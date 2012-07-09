<?php

    if (!function_exists('http_response_code')) {
        function http_response_code($code = NULL) {

            if ($code !== NULL) {

                switch ($code) {
                    case 100: $text = 'Continue'; break;
                    case 101: $text = 'Switching Protocols'; break;
                    case 200: $text = 'OK'; break;
                    case 201: $text = 'Created'; break;
                    case 202: $text = 'Accepted'; break;
                    case 203: $text = 'Non-Authoritative Information'; break;
                    case 204: $text = 'No Content'; break;
                    case 205: $text = 'Reset Content'; break;
                    case 206: $text = 'Partial Content'; break;
                    case 300: $text = 'Multiple Choices'; break;
                    case 301: $text = 'Moved Permanently'; break;
                    case 302: $text = 'Moved Temporarily'; break;
                    case 303: $text = 'See Other'; break;
                    case 304: $text = 'Not Modified'; break;
                    case 305: $text = 'Use Proxy'; break;
                    case 400: $text = 'Bad Request'; break;
                    case 401: $text = 'Unauthorized'; break;
                    case 402: $text = 'Payment Required'; break;
                    case 403: $text = 'Forbidden'; break;
                    case 404: $text = 'Not Found'; break;
                    case 405: $text = 'Method Not Allowed'; break;
                    case 406: $text = 'Not Acceptable'; break;
                    case 407: $text = 'Proxy Authentication Required'; break;
                    case 408: $text = 'Request Time-out'; break;
                    case 409: $text = 'Conflict'; break;
                    case 410: $text = 'Gone'; break;
                    case 411: $text = 'Length Required'; break;
                    case 412: $text = 'Precondition Failed'; break;
                    case 413: $text = 'Request Entity Too Large'; break;
                    case 414: $text = 'Request-URI Too Large'; break;
                    case 415: $text = 'Unsupported Media Type'; break;
                    case 500: $text = 'Internal Server Error'; break;
                    case 501: $text = 'Not Implemented'; break;
                    case 502: $text = 'Bad Gateway'; break;
                    case 503: $text = 'Service Unavailable'; break;
                    case 504: $text = 'Gateway Time-out'; break;
                    case 505: $text = 'HTTP Version not supported'; break;
                    default:
                        exit('Unknown http status code "' . htmlentities($code) . '"');
                    break;
                }

                $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');

                header($protocol . ' ' . $code . ' ' . $text);

                $GLOBALS['http_response_code'] = $code;

            } else {

                $code = (isset($GLOBALS['http_response_code']) ? $GLOBALS['http_response_code'] : 200);

            }

            return $code;

        }
    }




if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 header('Access-Control-Allow-Origin: *');
 exit;
}
else {
 header('Access-Control-Allow-Origin: *');
}

$target_path = "uploads/";
$target_path = $target_path . basename( $_FILES['Filedata']['name']);

if ($_GET['error']) {
	http_response_code($_GET['error']);
	exit;
}

$errorrand = rand(0,5);

if ($errorrand > 4) {
    http_response_code(400);
    exit();
}

//if(move_uploaded_file($_FILES['Filedata']['tmp_name'], $target_path)) {
	//echo "The file ".basename( $_FILES['Filedata']['name'])." has been uploaded\n";
	if ($_POST['filename']) {
		echo "filename = " . htmlentities($_POST['filename']) . "<br>";
		echo "timestamp = " . date("g:i:s A");
	}
	else {
		echo "Upload successful";
	}
//	echo "POST:\n";
//	foreach($_POST as $key => $value) echo $key."=".htmlentities($value)."\n";
//	echo "GET:\n";
//	foreach($_GET as $key => $value) echo $key."=".htmlentities($value)."\n";
//} else {
//	echo "There was an error uploading the file, please try again!";
//}
?>