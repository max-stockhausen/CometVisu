/* Appearance.js 
 * 
 * copyright (c) 2010-2022, Christian Mayer and the CometVisu contributers.
 * 
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA
 */


qx.Theme.define('cv.theme.dark.Appearance', {
  extend : osparc.theme.common.Appearance,

  appearances : {
    'cv-start': 'widget',
    'cv-start/configs-header': {
      style: function () {
        return {
          margin: [20, 10, 0, 10],
          decorator: 'cv-start-section-title'
        };
      }
    },
    'cv-start/configs-title': {
      style: function () {
        return {
          iconPosition: 'right',
          font: 'title',
          marginLeft: 10,
          allowGrowX: true
        };
      }
    },
    'cv-start/configs-toolbar': {
      style: function () {
        return {

        };
      }
    },
    'cv-start/misc-title': {
      style: function () {
        return {
          iconPosition: 'right',
          font: 'title',
          margin: [20, 10, 0, 10],
          paddingTop: 5,
          cursor: 'pointer',
          allowGrowX: true,
          decorator: 'cv-start-section-title'
        };
      }
    },
    'cv-start/demo-configs-title': 'cv-start/misc-title',
    'cv-start/media-title': 'cv-start/configs-title',
    'cv-start/media-toolbar': 'cv-start/configs-toolbar',
    'cv-start/media-header': 'cv-start/configs-header',

    'cv-file-item': {
      include: 'listitem',
      alias: 'listitem',

      style: function (states) {
        return {
          iconPosition: states.list ? 'left' : 'top',
          show: states.list ? 'label' : 'both',
          font: states.list ? 'default' : 'small',
          width: states.list ? 500 : 160,
          backgroundColor: states.hovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        };
      }
    },
    'cv-file-item/atom/label': {
      include: 'atom/label',
      style: function () {
        return {
          alignY: 'middle',
          allowGrowY: true
        };
      }
    },
    'cv-file-item/atom/icon': {
      include: 'atom/icon',
      style: function () {
        return {
          width: 70,
          height: 70,
          scale: true
        };
      }
    },
    'cv-file-item/action-menu': 'menu',
    'cv-file-item/download-button': {
      include: 'button',
      alias: 'button',

      style: function () {
        return {
          height: 30,
          show: 'icon'
        };
      }
    },
    'cv-file-item/action-button': 'cv-file-item/download-button',
    'cv-file-item/open-button': 'cv-file-item/download-button',
    'cv-file-item/edit-button': 'cv-file-item/download-button',
    'cv-icon': 'cv-file-item',
    'cv-icon/icon': {
      include: 'atom/icon',
      style: function () {
        return {
          width: 70,
          height: 70
        };
      }
    },
    'cv-file-item-add-file': {
      include: 'cv-file-item',
      alias: 'cv-file-item',

      style: function (states) {
        return {
          decorator: 'cv-file-item-add-file',
          opacity: states.hovered ? 1.0 : 0.5,
          cursor: 'pointer'
        };
      }
    },
    'open-file-item': {
      alias: 'atom',

      style: function (states) {
        let padding = [2, 5, 2, 5];
        if (states.lead) {
          padding = [1, 4, 1, 4];
        }
        if (states.dragover) {
          padding[2] -= 1;
        }

        let backgroundColor;
        if (states.selected) {
          backgroundColor = 'background-selected';
          if (states.disabled) {
            backgroundColor += '-disabled';
          }
        }
        return {
          backgroundColor: backgroundColor,
          textColor: states.selected ? 'text-selected' : undefined,
          decorator: states.lead ? 'lead-item' : states.dragover ? 'dragover' : undefined,
          opacity: states.drag ? 0.5 : undefined,
          height: 26,
          padding: padding,
          margin: 0
        };
      }
    },
    'open-file-item/label': {
      include: 'listitem/label',

      style: function () {
        return {
          alignY: 'middle'
        };
      }
    },
    'open-file-item/icon': {
      alias: 'listitem/icon',
      style: function () {
        return {
          alignY: 'middle',
          padding: [0, 8]
        };
      }
    },
    'open-file-item/close': {

      style: function () {
        return {
          padding: 8,
          cursor: 'pointer',
          alignY: 'middle'
        };
      }
    },

    'open-with-button': {
      include: 'menu-button',
      alias: 'menu-button',

      style: function (states) {
        return {
          font: states.default ? 'bold' : 'default'
        };
      }
    },

    'list': {
      style: function () {
        return {
          decorator: null
        };
      }
    },

    'cv-editor-config': {
      style: function () {
        return {
          padding: 10
        };
      }
    },

    'cv-editor-config-section': {
      style: function () {
        return {
          padding: 10,
          decorator: 'cv-editor-config-section',
          marginBottom: 10
        };
      }
    },

    'cv-editor-config-option': {
      style: function () {
        return {
          marginBottom: 10
        };
      }
    },

    'cv-config-textfield': {
      include: 'textfield',
      alias: 'textfield',

      style: function () {
        return {
          minWidth: 300
        };
      }
    },

    'cv-editor-config-section/section-title': {
      style: function () {
        return {
          font: 'title',
          marginRight: 20
        };
      }
    },

    'cv-editor-config-section/options-title': 'cv-editor-config-section/section-title',
    'cv-editor-config-section/name': 'cv-config-textfield',
    'cv-editor-config-section/list': {
      include: 'list',
      alias: 'list',

      style: function() {
        return {
          height: null
        };
      }
    },
    'cv-editor-config-option/value-title': {
      style: function () {
        return {
          allowGrowX: true,
          font: 'subtitle'
        };
      }
    },
    'cv-editor-config-option/key-title': 'cv-editor-config-option/value-title',

    // snackbar components
    'cv-snackbar': {
      style: function () {
        return {
          zIndex: 1000
        };
      }
    },

    'cv-snackbar/list': {
      style: function () {
        return {
          height: null,
          width: 400,
          minWidth: 300
        };
      }
    },

    'cv-snackbar-msg': {
      style: function () {
        return {
          marginTop: 10,
          padding: 10,
          textColor: 'text',
          decorator: 'cv-snackbar-msg'
        };
      }
    },

    'cv-snackbar-msg/content': {
      style: function () {
        return {
          allowGrowX: true
        };
      }
    },

    'cv-snackbar-msg/close': {
      style: function () {
        return {
          cursor: 'pointer'
        };
      }
    },
    'cv-toolbar': {
      include: 'toolbar',
      alias: 'toolbar',

      style: function () {
        return {
          // decorator: 'cv-toolbar'
        };
      }
    },
    'cv-toolbar-button': {
      include: 'toolbar-button',
      alias: 'toolbar-button',

      style: function () {
        return {
          // margin: 1
        };
      }
    },

    'image-viewer': {},
    'image-viewer/scroll': 'scrollarea',
    'image-viewer/image': {
      include: 'atom',
      alias: 'atom',

      style: function () {
        return {
          iconPosition: 'top',
          gap: 10,
          center: true
        };
      },
      'image-viewer/image/label': {
        style: function () {
          return {
            margin: 10
          };
        }
      }
    },

    'fs-tree-item': {
      include: 'virtual-tree-folder',
      alias: 'virtual-tree-folder',

      style: function (states) {
        return {
          font: states.temporary ? 'italic' : 'default'
        };
      }
    },

    'fs-tree-item/icon': {
      include: 'virtual-tree-folder/icon',
      alias: 'virtual-tree-folder/icon',

      style: function(states) {
        return {
          textColor: states.comment ? 'text-disabled' : (states.error ? 'invalid-color' : null)
        };
      }
    },
    'element-tree-item': {
      include: 'fs-tree-item',
      alias: 'fs-tree-item',
      style: function (states) {
        return {
          indent: states.touch ? 24 : 19
        };
      }
    },
    'element-tree-item/label': {
      include: 'fs-tree-item/label',

      style: function (states) {
        return {
          textColor: states.comment ? 'text-disabled' : null,
          allowGrowX: true,
          maxWidth: 250
        };
      }
    },
    'element-tree-item/open': {
      include: 'fs-tree-item/open',

      style: function (states) {
        return {
          // width must not be greater the the indentation
          width: states.touch ? 24 : 16,
          height: states.touch ? 32 : 16,
          scale: true
        };
      }
    },
    'cv-file-contextmenu': 'menu',
    'cv-file-contextmenu/open-with-button': 'menu-button',
    'cv-file-contextmenu/compare-with-button': 'menu-button',
    'open-files-tabs': {
      style: function () {
        return {
          height: 34,
          padding: 0,
          marginBottom: 5,
          decorator: 'open-file-tabs'
        };
      }
    },
    'helptext': {
      style: function () {
        return {
          font: 'small',
          textColor: 'text-disabled'
        };
      }
    },
    'checkbox/label': {
      style: function(states) {
        return {
          textColor: states.undetermined ? 'text-disabled' : 'text'
        };
      }
    },

    'toolbar-separator': {
      style: function() {
        return {
          backgroundColor: 'border-separator',
          margin: [7, 0],
          width: 1
        };
      }
    },
    'iframe': {
      style: function () {
        return {
          backgroundColor: null,
          decorator: 'main-dark'
        };
      }
    },
    'state-option': {
      style: function (states) {
        return {
          textColor: states.error ? 'warning-color' : 'text-disabled',
          font: 'italic',
          height: 25
        };
      }
    },
    'error-option': {
      style: function () {
        return {
          textColor: 'warning-color',
          font: 'italic',
          height: 25
        };
      }
    },
    'selectbox/atom': {
      style: function (states) {
        let font = 'default';
        let textColor = 'text';
        if (states.error || states.loading) {
          font = 'italic';
          textColor = states.error ? 'warning-color' : 'text-disabled';
        }
        return {
          textColor: textColor,
          font: font
        };
      }
    },
    'optiongroup': {
      style: function () {
        return {
          textColor: 'text-disabled',
          height: 25
        };
      }
    },
    'optiongroup/label': {
      style: function () {
        return {
          allowGrowX: true,
          textAlign: 'center'
        };
      }
    },
    'round-button': {
      include: 'atom',
      alias: 'atom',
      style: function (states) {
        return {
          decorator: states.hovered ? 'round-button-hovered' : 'round-button',
          width: 48,
          height: 48,
          textColor: 'text',
          show: 'icon',
          center: true
        };
      }
    },
    'round-button/icon': {
      include: 'atom/icon',
      alias: 'atom/icon',
      style: function (states) {
        return {
          width: 32,
          height: 32
        };
      }
    },
    'dragdrop-cursor': {
      style: function (states) {
        let icon = 'nodrop';

        if (states.copy) {
          icon = 'copy';
        } else if (states.move) {
          icon = 'move';
        } else if (states.alias) {
          icon = 'alias';
        }
        let leftOffset = 8;
        if (states.touch) {
          leftOffset = 44;
        }

        return {
          source: osparc.theme.common.Image.URLS['cursor-' + icon],
          position: 'left-middle',
          offset: [2, leftOffset, 2, 6]
        };
      }
    },
    'element-tree-item/menu-button': {
      include: 'button',
      alias: 'button',
      style: function () {
        return {
          padding: [2, 4],
          icon: osparc.theme.common.Image.URLS['arrow-down'],
          show: 'icon'
        };
      }
    },
    'tree-editor': 'widget',
    'tree-editor/preview-sync-hint': {
      include: 'atom',
      alias: 'atom',
      style: function () {
        return {
          padding: [4, 8],
          iconPosition: 'left',
          gap: 8,
          center: true
        };
      }
    },
    'tree-editor/preview-sync-hint/icon': {
      include: 'atom/icon',
      style: function (states) {
        let color = 'valid-color';
        if (states.error) {
          color = 'invalid-color';
        } else if (states.warning) {
          color = 'warning-color';
        }
        return {
          textColor: color
        };
      }
    }
  }
});
