<?php

header("Content-Type", "application/json");

echo json_encode(array(
    "POST" => $_POST,
    "GET" => $_GET,
));
?>