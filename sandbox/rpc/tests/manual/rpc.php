<?php

header('content-type: application/json');

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    echo json_encode(array(
        "methods" => array("foo", "other", "last")#,
        #"envelope" => "JSON-RPC-1.0"
    ));
} else {
    $req = json_decode($HTTP_RAW_POST_DATA);

    switch ($req->method) {
        case "foo"  : $payload = 'You requested foo!'; break;
        case "other": $payload = '<p class="response">Other!</p>'; break;
        case "last" : $payload = 'FIRST ' . $req->params[0] . '!'; break;
        default     : $payload = "Something went wrong";
    }

    $response = array("result" => $payload);
    if ($req->id) {
         
        $response["id"] = $req->id;
        echo json_encode($response);
    } else {
        header('HTTP/1.0 204 No Content');
    }
}

?>
