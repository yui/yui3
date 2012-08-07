<?php
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// always modified
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

// HTTP/1.1
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
	echo str_replace('&amp;', '&', $_SERVER['QUERY_STRING']);
}
else {
	echo $_SERVER['REQUEST_METHOD'];
}
?>
