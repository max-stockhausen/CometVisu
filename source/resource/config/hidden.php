<?php
// File for configurations that shouldn't be shared with the user
$data = '{
  "fritzbox": {
    "uri": "https://192.168.0.1:49443/", 
    "user": "CometVisuTestUser",
    "pass": "secret"
  },
  "influx": {
    "uri": "https://172.17.0.1/proxy/ts/query", 
    "user": "docker",
    "pass": "secret", 
    "selfsigned": "true"
  }
}';
$hidden = json_decode($data, true);