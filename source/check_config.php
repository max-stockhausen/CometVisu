<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>CometVisu-Client: Config file check</title>
  </head>
  <body>
<?php

require_once('library_version.inc.php');

$error_array = array();

// this function was inspired by:
//  http://www.php.net/manual/en/function.highlight-string.php#84661
function xml_highlight($s)
{
    $s = htmlspecialchars($s);
    $s = preg_replace("#&lt;([/]*?)(.*)([\s]*?)&gt;#sU",
        "<font color=\"#0000FF\">&lt;\\1\\2\\3&gt;</font>",$s);
    $s = preg_replace("#&lt;([\?])(.*)([\?])&gt;#sU",
        "<font color=\"#800000\">&lt;\\1\\2\\3&gt;</font>",$s);
    $s = preg_replace("#&lt;([^\s\?/=])(.*)([\[\s/]|&gt;)#iU",
        "&lt;<font color=\"#808000\">\\1\\2</font>\\3",$s);
    $s = preg_replace("#&lt;([/])([^\s]*?)([\s\]]*?)&gt;#iU",
        "&lt;\\1<font color=\"#808000\">\\2</font>\\3&gt;",$s);
    $s = preg_replace("#([^\s]*?)\=(&quot;|')(.*)(&quot;|')#isU",
        "<font color=\"#800080\">\\1</font>=<font color=\"#FF00FF\">\\2\\3\\4</font>",$s);
    $s = preg_replace("#&lt;(.*)(\[)(.*)(\])&gt;#isU",
        "&lt;\\1<font color=\"#800080\">\\2\\3\\4</font>&gt;",$s);
    return preg_replace( '#<br */>$#', '', nl2br($s) );
}

function libxml_display_error( $error )
{
  global $combinedLines, $error_array, $lineMappings, $conffile;

  $error_array[] = $error->line;

  $return = "";

  switch ($error->level)
  {
    case LIBXML_ERR_WARNING:
      $return .= '<b>Warning ' . $error->code . '</b>: ';
      break; 
    case LIBXML_ERR_ERROR: 
      $return .= '<b>Error ' . $error->code . '</b>: ';
      break; 
    case LIBXML_ERR_FATAL: 
      $return .= '<b>Fatal Error ' . $error->code . '</b>: ';
      break; 
  }

  $return .= trim( $error->message );
  $return .= ' on <a href="#' . ($error->line-1) . '">line <b>' . $error->line . '</b></a>';
  $errorInIncludedFile = false;
  $outerFileLineNumber = $error->line;
  foreach($lineMappings as $mapping) {
      if ($error->line >= $mapping['start'] && $error->line <= $mapping['end']) {
          // inside this file
          $return .= ' [origin in file ' . $mapping['file'] . ' line ' . ($error->line - $mapping['start']) . ']';
          $errorInIncludedFile = true;
      } elseif ($error->line > $mapping['end']) {
          // subtract the includes number of lines from the calculate to get the "real" line number if the error occured in
          // the "outer"-file
          $outerFileLineNumber -= $mapping['end'] - $mapping['start'] + 1;
      }
  }
  if (!$errorInIncludedFile) {
      $return .= ' [origin in file ' . $conffile . ' line ' . $outerFileLineNumber . ']';
  }

  $return .= '<pre>';
  for( $i = max( 0, $error->line - 1 - 3); $i <= $error->line - 1 + 3; $i++ )
  {
    if( $i == $error->line - 1 ) $return .= '<b>';
    $return .= sprintf( '%4d: ', $i+1 );
    $return .= xml_highlight( $combinedLines[ $i ] );
    if( $i == $error->line - 1 ) $return .= '</b>';
  }
  $return .= '</pre>';

  return $return; 
}

function checkVersion( $dom )
{
  echo '<hr />';
  $pages = $dom->getElementsByTagName("pages");
  if( 1 != $pages->length )
  {
    echo 'Fatal error: Could not find &lt;pages&gt; element in config file!<br/>';
    echo '(Note: this can also be caused by unbalanced elements, bad quotation marks, ...)';
    return;
  }
  $fileVersion = $pages->item(0)->getAttribute('lib_version');
  echo "The config file uses a library version of '" . $fileVersion . "', current version is '"
       . LIBRARY_VERSION . "', so this is " . ($fileVersion==LIBRARY_VERSION?'':'NOT ') . "up to date.";
  if( $fileVersion != LIBRARY_VERSION )
    echo ' Please run <a href="upgrade/index.php?config='.$_GET['config'].
      '">Configuration Upgrade</a> when you are sure that the config file is valid XML.';
}

// Enable user error handling 
libxml_use_internal_errors(true);

$resourceDir = 'resource/';


$dom = new DomDocument();
$isDemo = false;
$quercus = strpos($_SERVER["SERVER_SOFTWARE"], "Quercus") !== false;
$baseURL = $resourceDir;
if (!isset($_GET['config'])) $_GET['config'] = "";

// something openhab2 specific for autogenerated configs
if (substr($_GET['config'],0,3)=="oh_" || $quercus) {
   $protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
   $baseURL = $protocol.$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT'].str_replace("check_config.php", "", $_SERVER['SCRIPT_URL']).$resourceDir;
   $conffile = $baseURL."config/visu_config";
}
else {
   $conffile = $resourceDir . 'config/visu_config';
}
if (defined('STDIN')) {
  $conffile = "visu_config_" . $argv[1];
} else if ($_GET['config']) {
  $conffile .= "_" . $_GET['config'];
}
$conffile .= '.xml';

if ( false === is_readable( $conffile ) ) {
  $conffile = $resourceDir . 'demo/visu_config';
  if ($_GET['config']) {
    $conffile .= "_" . $_GET['config'];
  }
  $conffile .= '.xml';
  $isDemo = true;
}

if( false === is_readable( $conffile ) )
{
  $old_conffile = 'visu_config';
  if ($_GET['config']) {
    $old_conffile .= "_" . $_GET['config'];
  }
  $old_conffile .= '.xml';

  if( true === is_readable( $old_conffile ) )
  {
    $conffile = $old_conffile;
    echo '<font color="#f00"><b>WARNING:</b> Deprecated position of config file!</font><hr/>';
  } else {
    echo "File <b>$conffile</b> (nor the deprecated <b>$old_conffile</b>) does not exist!";
    echo '</body></html>';
    exit;
  }
}
$lines = file( $conffile );
$combinedLines = $lines;
$lineMappings = array();
$mappedLineOffset = 0;

function mapIncludedLines ($value) {
    global $matches;
    return $matches[1] . $value;
}

foreach( $lines as $line_num => $line ) {
    if (preg_match('/(\s*)(.*)<include src="([^"]+)"\s*\/>(.*)/', $line, $matches)) {
        $includedLines = file($baseURL . $matches[3]);
        $startLine = $line_num + $mappedLineOffset;
        $mappingStart = $startLine;
        array_unshift($includedLines, "<!-- Start of " . $matches[3] . " -->\n");
        $mappingStart++;
        $includedLines[sizeof($includedLines) -1 ] .= "\n";
        array_push($includedLines, "<!-- End of " . $matches[3] . " -->\n");
        $includedLines = array_map(mapIncludedLines, $includedLines);
        if (!empty($matches[2])) {
            array_unshift($includedLines, $matches[2]);
            $mappingStart++;
        }

        if (!empty($matches[4])) {
            array_push($includedLines, $matches[4]);
        }
        array_splice($combinedLines, ($line_num + $mappedLineOffset), 1, $includedLines);
        $lineMappings[] = array(
            'file' => $matches[3],
            'start' => $mappingStart,
            'end' => $startLine + sizeof($includedLines) - 1
        );
        $mappedLineOffset += sizeof($includedLines) - 1;
    }
}
$source = implode('', $combinedLines);
$dom->loadXML( $source );
if ($quercus) {
  // catch output of schemaValidate (quercus PHP echos the errors directly)
  ob_start();
}
if( $dom->schemaValidate( $resourceDir . 'visu_config.xsd' ) )
{
  if ($quercus) {
    $errors = ob_get_clean();
  }
  echo 'config <b>' . $conffile . ' is valid </b> XML';
  if( isset($_GET['src']) && $_GET['src'] === 'editor' )
    echo '. <a href="editor/editor.html?config='.$_GET['config'].($isDemo?'&demo=true':'').'">Continue to the editor here.</a>';
  echo '<br/>';

  checkVersion( $dom );
} else {
  if ($quercus) {
    $errors = ob_get_clean();
  }
  echo 'config <b>' . $conffile . ' is NOT valid </b> XML';
  if( isset($_GET['src']) && $_GET['src'] === 'editor' )
    echo '. <a href="editor/editor.html?config='.$_GET['config'].($isDemo?'&demo=true':'').'">Still continue to the editor here</a> - <b>but this can break the config file completely</b>.';
  echo '<br/>';

  checkVersion( $dom );

  echo '<hr />';

  if ($quercus) {
    echo $errors;
  } else {
    $errors = libxml_get_errors();
    foreach( $errors as $error )
    {
      echo libxml_display_error( $error );
    }
    libxml_clear_errors();
  }
}
echo '<hr />';

echo '<pre>';
foreach( $combinedLines as $line_num => $line )
{
  $error_in_line = in_array( $line_num+1, $error_array );
  if( $error_in_line ) echo '<b>';
  printf( '<a name="%s">%4d</a>: ', $line_num, $line_num+1 );
  echo xml_highlight( $line );
  if( $error_in_line ) echo '</b>';
}
echo '</pre>';
?>
  </body>
</html>
