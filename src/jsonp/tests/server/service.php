<?php

$callback = $_GET['callback'];

header('content-type: text/javascript');
header('Cache-Control: no-store;max-age:0');
header('Expires: Tue 10 Mar 1989 03:10:00 GMT');

echo $callback . '({"data":"here","callback":"'.$callback.'"})';
?>
