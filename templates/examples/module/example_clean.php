<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title><?php echo $currentExample["name"]; ?></title>

<style type="text/css">
/*margin and padding on body element
  can introduce errors in determining
  element position and are not recommended;
  we turn them off as a foundation for YUI
  CSS treatments. */
body {
	margin:0;
	padding:0;
}
</style>

<?php
//Fonts is always required:
$loader->load("fonts");
echo ($loader->tags());	

//mechanism for adding header content from within source file in templates;
//add this optional file, examplename_customheader.php, in your examples dir
//along with the other three files as needed.
$filename = $dataroot.$currentModuleName."/".$name."_customheader.php";
if (file_exists($filename)) {

echo "\n\n<!--begin custom header content for this example-->\n";
	include($filename);
echo "\n<!--end custom header content for this example-->\n\n";

} else {
	echo "\n<!--there is no custom header content for this example-->\n\n";
}
?>
</head>

<body class="<?php if(isset($bodyclass)) {echo $bodyclass;} else {echo "yui-skin-sam";};?>">

<h1><?php echo $currentExample["name"]; ?></h1>

<div class="exampleIntro">
	<?php 
	$filename = $dataroot.$currentModuleName."/".$name."_intro.php";
	include($filename);
	?>			
</div>

<!--BEGIN SOURCE CODE FOR EXAMPLE =============================== -->

<?php 
$filename = $dataroot.$currentModuleName."/".$name."_source.php";
include($filename);
?>

<!--END SOURCE CODE FOR EXAMPLE =============================== -->

<?php if($ydn) {
echo '
<!--MyBlogLog instrumentation-->
<script type="text/javascript" src="http://track2.mybloglog.com/js/jsserv.php?mblID=2007020704011645"></script>

';}
?>
</body>
</html>
