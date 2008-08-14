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
<div id="headerMaxCont">
	<div id="headerMainSandbag"></div>
	<div id="headerContainer">
		<span id="headeraL">
			<a href="/"><img src="http://l.yimg.com/a/i/ydn/ydn-logo.gif" class="ydnLogo" height="53" width="408" alt="Yahoo! Developer Network"></a>
		</span>
		<span id="headeraR">
			<div id="searchArea">
				<ul class="srchOptns">
					<!-- li class="first"><strong>YDN Site</strong></li>
					<li>Code</li>
					<li>Web</li -->
				</ul>
				<span class="srchFld">
					<form action="http://search.yahoo.com/search" method="get">
						<div id="sitesearch">
							<input type="text" name="va" value="" id="searchinput">
							<input type="hidden" name="vs" value="developer.yahoo.com">
							<input type="hidden" name="vs" value="yuiblog.com">
							<input type="submit" name="sub" value="Search" id="searchsubmit" class="ygbt">
						</div>
						<div id="searchcontainer"></div>
					</form>
				</span>
			</div>
		</span>
	</div>
</div>
<div id="doc3" class="yui-t2">
	<div id="hd">
		<div id="bar-note"><p><strong>Note:</strong> This is the <a href="/yui/3">YUI 3.x</a> site. Looking for the <a href="http://developer.yahoo.com/yui/">YUI 2.x</a> site?</p></div>
		<div id="pagetitle"><h1>YUI 3: <?php echo $titlebar ?></h1></div>
	</div>
<div id="bd">
