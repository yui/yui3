<?php

$target_path = "uploads/";
$target_path = $target_path . basename( $_FILES['Filedata']['name']); 


if(move_uploaded_file($_FILES['Filedata']['tmp_name'], $target_path)) {
	echo "The file ".basename( $_FILES['Filedata']['name'])." has been uploaded\n";
	echo "POST:\n";
	foreach($_POST as $key => $value) echo $key."=".htmlentities($value)."\n";
	echo "GET:\n";
	foreach($_GET as $key => $value) echo $key."=".htmlentities($value)."\n";
} else {
	echo "There was an error uploading the file, please try again!";
}
?>