<?php

$callback = $_GET['callback'];

header('content-type: text/javascript');

echo $callback . '({"data":"here"})';
?>
