<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
<title><?php echo $currentExample["name"]; ?></title>

<?php
echo ($loader->tags());	
?>
</head>

<body class="<?php if(isset($bodyclass)) {echo $bodyclass;};?>">

<h1><?php echo $currentExample["name"]; ?></h1>

<div class="exampleIntro">
	<?php 
	$filename = "src/".$currentModuleName."/".$name."_intro.php";
	include($filename);
	?>			
</div>

<!--BEGIN SOURCE CODE FOR EXAMPLE =============================== -->

<?php 
$filename = "src/".$currentModuleName."/".$name."_source.php";
include($filename);
?>

<!--END SOURCE CODE FOR EXAMPLE =============================== -->
</body>
</html>
