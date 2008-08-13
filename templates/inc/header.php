<?php 
if (!isset($title)) { 
    $title = "Yahoo! User Interface Library (YUI)";
}

$titlebar = $title;

//code highlighting, usually on examples pages:
if (!isset($highlightSyntax)) { $highlightSyntax=false; } 

//release notes, on examples pages:
if (!isset($releasenotes)) { $releasenotes=false; } 

//allows a template to place js or css includes in the header:
if (!isset($prepend)) { $prepend=""; }

//allows a template to add js or css includes in the footer:
if (!isset($append)) { $append=""; } 

?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<title><?php echo $titlebar ?></title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <?php if (isset($metainfo)) { echo $metainfo; } ?>
	<link rel="stylesheet" type="text/css" href="<?php echo $docroot ?>assets/yui.css" >

<style>
    /*Supplemental CSS for the YUI distribution*/
    #custom-doc { width: 95%; min-width: 950px; }
    #pagetitle {background-image: url(<?php echo $docroot ?>assets/bg_hd.gif);}
    #pagetitle h1 {background-image: url(<?php echo $docroot ?>assets/title_h_bg.gif);}
</style>

<?php
if ($highlightSyntax) { /*include code for syntax-highlighting boxes, mostly found on landing and example pages*/
?>
<link rel="stylesheet" type="text/css" href="<?php echo $docroot ?>assets/dpSyntaxHighlighter.css">
<?php
}

//Note: Logger output will be filtered off by script in the footer for
//all sources that are
//not explicitly identified in the => logger metadata for this
//example.

if ($prepend) { /*there is additional css or header information for this page -- perhaps some use of YUI and/or custom css -- that is meant to be inserted in the document head*/
    echo $prepend;
}

if (isset($customHeader) && $customHeader != "") {
	include($customHeader);
}
?>

</head>
<body id="yahoo-com" class="<?php if(isset($bodyclass)) {echo $bodyclass;};?>">
<div id="custom-doc" class="yui-t2">
<div id="hd">
	<div id="ygunav">
		<p>
            <em>
                <a href="http://developer.yahoo.com/yui/3/">YUI 3.x Home</a> <i> - </i>	
            </em>
		</p>
		<form action="http://search.yahoo.com/search" id="sitesearchform">
            <input name="vs" type="hidden" value="developer.yahoo.com">
            <input name="vs" type="hidden" value="yuiblog.com">
		    <div id="sitesearch">
		    	<label for="searchinput">Site Search (YDN &amp; YUIBlog): </label>
			    <input type="text" id="searchinput" name="p">
			    <input type="submit" value="Search" id="searchsubmit" class="ygbt">
		    </div>
		</form>
    </div>
	<div id="ygma"><a href="<?php echo $docroot ?>"><img src="<?php echo $docroot ?>assets/logo.gif"  border="0" width="200" height="93"></a></div>
	<div id="pagetitle"><h1><?php echo $titlebar ?></h1></div>
</div>
<div id="bd">

	<div id="bar-note"><p><strong>Note:</strong> This is YUI 3.x. Looking for <a href="http://developer.yahoo.com/yui/">YUI 2.x</a>?</p></div>
