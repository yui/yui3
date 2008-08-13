<?php 
//default globals:
if (!isset($docroot)) { $docroot=""; } 
if (isset($title)) { $titlebar=$title; }
	else  
{$titlebar="Yahoo! Developer Network";}

//code highlighting, usually on examples pages:
if (!isset($highlightSyntax)) { $highlightSyntax=false; } 

//release notes, on examples pages:
if (!isset($releasenotes)) { $releasenotes=false; } 

//allows a template to place js or css includes in the header:
if (!isset($prepend)) { $prepend=""; }

//allows a template to add js or css includes in the footer:
if (!isset($append)) { $append=""; } 

//default sets yui-skin-sam as the skin for all pages:
if (!isset($bodyclass)) { $bodyclass=" yui-skin-sam"; }

//this global affects versioning where it appears in documentation;
//it does not affect the version used across the site:
$yuiCurrentVersion = "3.0.0pr1";

//this global changes the version of YUI we're using throughout
//the website; this only affects pages that have the site chrome --
//the Grid Builder, for example, does not:
$yuiUseVersion = "2.5.2";

//assets directory for example pages:
if (!isset($assetsDirectory)) { $assetsDirectory="assets/"; } 


?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<title><?php if (isset($title)) { echo $title ; } else {?>Yahoo! User Interface Library<?php } ?></title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <?php if (isset($metainfo)) { echo $metainfo; } ?>
	<link rel="stylesheet" type="text/css" href="/yui/3/assets/yui.css">
<?php
if ($highlightSyntax) { /*include code for syntax-highlighting boxes, mostly found on landing and example pages*/
?>
	<link rel="stylesheet" type="text/css" href="/yui/3/assets/dpSyntaxHighlighter.css">
<?php
}

if ($prepend) { /*there is additional css or header information for this page -- perhaps some use of YUI and/or custom css -- that is meant to be inserted in the document head*/
	//some YUI examples have custom header content that contains php;
	//if present, eval the string as php; otherwise, echo the string directly.
	if(strpos($prepend, "<?php")) {
		$prepend = "?>".$prepend;
		eval($prepend);
	} else {
		echo $prepend;
	}
}
?>


</head>
<body id="yahoo-com" class="<?php echo $bodyclass; ?>">
<div id="doc3" class="yui-t2">
<div id="hd">
	<div id="ygunav">
		<p><em>
			<a href="http://developer.yahoo.com">Developer Network Home</a> <i> - </i>	
			<a href="http://help.yahoo.com/help/us/ysearch">Help</a>
			</em>
		</p>
		<form action="http://search.yahoo.com/search" id="sitesearchform">
		<input name="vs" type="hidden" value="developer.yahoo.com">
		<input name="vs" type="hidden" value="yuiblog.com">
		<div id="sitesearch">
			<label for="searchinput">Site Search: </label>
			<input type="text" id="searchinput" name="p">
			<input type="submit" value="Search" id="searchsubmit" class="ygbt">    
			<div id="searchcontainer"></div>
		</div>
		</form>
	</div>

	<div id="ygma"><a href="<?php echo $docroot ?>/"><img src="http://us.i1.yimg.com/us.yimg.com/i/us/nt/ma/ma_devnet_1.gif"  border="0"></a></div>
	<div id="pagetitle"><h1>YUI 3: <?php echo $titlebar ?></h1></div>
</div>
<div id="bd">
<div id="bar-note"><p><strong>Note:</strong> This is the <a href="/yui/3">YUI 3.x</a> site. Looking for the <a href="http://developer.yahoo.com/yui/">YUI 2.x</a> site?</p></div>
