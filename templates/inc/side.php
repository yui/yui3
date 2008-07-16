<?php
if (!isset($section)) { $section = ""; }

$nav[]=array('', '', 'Yahoo! UI Library', '');
$nav[]=array('yui', $developerHome, 'Home (external)', 'The Yahoo! User Interface Library (YUI)');
$nav[]=array('yuiblog','http://yuiblog.com','YUIBlog (external)', 'The Yahoo! User Interface Blog');
$nav[]=array('groups','http://tech.groups.yahoo.com/group/ydn-javascript/','YUI Discussion Forum (external)', 'The Yahoo! Group YDN-JavaScript hosts the YUI community forum');
$nav[]=array('sourceforge','http://sourceforge.net/projects/yui/','YUI on Sourceforge (external)', 'The YUI Library can be downloaded from SourceForge');
$nav[]=array('docs',$docroot.'docs/index.html','API Documentation', 'Instantly searchable API documentation for the entire YUI library.');
$nav[]=array('examples',$docroot.'examples/','Functional Examples', 'Examples of every YUI utility and control in action');
$nav[]=array('theater','http://developer.yahoo.com/yui/theater/','YUI Theater (external)', 'Videos and podcasts from the YUI Team and from the Yahoo! frontend engineering community.');
$nav[]=array('license','http://developer.yahoo.com/yui/license.html','YUI License (external)', 'YUI is free and open, offered under a BSD license.');

$nav[]=array('', '', 'YUI Functional Examples', ' - Functional Examples');
$nav[]=array('animation',$docroot.'examples/animation/index.html','Animation', 'The YUI Animation Utility - Functional Examples');
$nav[]=array('autocomplete',$docroot.'examples/autocomplete/index.html','AutoComplete', 'The YUI AutoComplete Control - Functional Examples');
$nav[]=array('history',$docroot.'examples/history/index.html','Browser History Manager', 'The YUI Browser History Manager - Functional Examples');
$nav[]=array('button',$docroot.'examples/button/index.html','Button', 'The YUI Button Control - Functional Examples');
$nav[]=array('calendar',$docroot.'examples/calendar/index.html','Calendar', 'The YUI Calendar Control - Functional Examples');
$nav[]=array('charts',$docroot.'examples/charts/index.html','Charts (experimental)', 'The YUI Charts Control - Functional Examples');
$nav[]=array('colorpicker',$docroot.'examples/colorpicker/index.html','Color Picker', 'The YUI Color Picker Control - Functional Examples');
$nav[]=array('cookie',$docroot.'examples/cookie/index.html','Cookie (beta)', 'The YUI Cookie Utility - Functional Examples');
$nav[]=array('connection',$docroot.'examples/connection/index.html','Connection Manager', 'The YUI Connection Manager (AJAX) - Functional Examples');
$nav[]=array('container',$docroot.'examples/container/index.html','Container', 'The YUI Container Family (Module, Overlay, Tooltip, Panel, Dialog, SimpleDialog) - Functional Examples');
//$nav[]=array('datasource',$docroot.'examples/datasource/index.html','DataSource', 'The YUI DataSource Utility - Functional Examples');
$nav[]=array('datatable',$docroot.'examples/datatable/index.html','DataTable (beta)', 'The YUI DataTable Control - Functional Examples');
$nav[]=array('dom',$docroot.'examples/dom/index.html','Dom', 'The YUI Dom Collection - Functional Examples');
$nav[]=array('dragdrop',$docroot.'examples/dragdrop/index.html','Drag &amp; Drop', 'The YUI Drag &amp; Drop Utility - Functional Examples');
//$nav[]=array('element',$docroot.'examples/element/index.html','Element', 'The YUI Element Utility - Functional Examples');
$nav[]=array('event',$docroot.'examples/event/index.html','Event', 'The YUI Event Utility - Functional Examples');
$nav[]=array('get',$docroot.'examples/get/index.html','Get', 'The YUI Get Utility - Functional Examples');
$nav[]=array('imagecropper',$docroot.'examples/imagecropper/index.html','ImageCropper (beta)', 'The YUI ImageCropper Control - Functional Examples');
$nav[]=array('imageloader',$docroot.'examples/imageloader/index.html','ImageLoader', 'The YUI ImageLoader Utility - Functional Examples');
$nav[]=array('json',$docroot.'examples/json/index.html','JSON', 'The YUI JSON Utility - Functional Examples');
$nav[]=array('layout',$docroot.'examples/layout/index.html','Layout Manager (beta)', 'The YUI Layout Manager - Functional Examples');
$nav[]=array('logger',$docroot.'examples/logger/index.html','Logger', 'The YUI Logger Control - Functional Examples');
$nav[]=array('menu',$docroot.'examples/menu/index.html','Menu', 'The YUI Menu Control - Functional Examples');
$nav[]=array('profiler',$docroot.'examples/profiler/index.html','Profiler (beta)', 'The YUI Profiler Utility - Functional Examples');
$nav[]=array('profilerviewer',$docroot.'examples/profilerviewer/index.html','ProfilerViewer (beta)', 'The YUI ProfileViewer Control - Functional Examples');
$nav[]=array('resize',$docroot.'examples/resize/index.html','Resize (beta)', 'The YUI Resize Utility - Functional Examples');
$nav[]=array('editor',$docroot.'examples/editor/index.html','Rich Text Editor (beta)', 'The YUI Rich Text Editor - Functional Examples');
$nav[]=array('selector',$docroot.'examples/selector/index.html','Selector (beta)', 'The YUI Selector Utility - Functional Examples');
$nav[]=array('slider',$docroot.'examples/slider/index.html','Slider', 'The YUI Slider Control - Functional Examples');
$nav[]=array('tabview',$docroot.'examples/tabview/index.html','TabView', 'The YUI TabView Control - Functional Examples');
$nav[]=array('treeview',$docroot.'examples/treeview/index.html','TreeView', 'The YUI TreeView Control - Functional Examples');
$nav[]=array('uploader',$docroot.'examples/uploader/index.html','Uploader (experimental)', 'The YUI Uploader Utility - Functional Examples');
$nav[]=array('yahoo',$docroot.'examples/yahoo/index.html','YAHOO Global Object', 'The YUI YAHOO Global Object - Functional Examples');
$nav[]=array('yuiloader',$docroot.'examples/yuiloader/index.html','YUI Loader (beta)', 'The YUI Loader Utility - Functional Examples');
$nav[]=array('yuitest',$docroot.'examples/yuitest/index.html','YUI Test', 'The YUI Test Utility - Functional Examples');
$nav[]=array('reset',$docroot.'examples/reset/index.html','Reset CSS', 'YUI Reset CSS - Functional Examples');
$nav[]=array('base',$docroot.'examples/base/index.html','Base CSS', 'YUI Base CSS - Functional Examples');
$nav[]=array('fonts',$docroot.'examples/fonts/index.html','Fonts CSS', 'YUI Fonts CSS - Functional Examples');
$nav[]=array('grids',$docroot.'examples/grids/index.html','Grids CSS', 'YUI Grids CSS - Functional Examples');

$nav[]=array('', '', 'YUI Articles on the YUI Website', '');
$nav[]=array('faq','http://developer.yahoo.com/yui/articles/faq/','YUI FAQ (external)', 'Answers to Frequently Asked Questions about the YUI Library');
$nav[]=array('gbs','http://developer.yahoo.com/yui/articles/gbs/','Graded Browser Support (external)', 'Yahoo!\'s philosophy of Graded Browser Support');
$nav[]=array('reportingbugs','http://developer.yahoo.com/yui/articles/reportingbugs/','Bug Reports/Feature Requests (external)', 'Reporting Bugs and Making Feature Requests for YUI Components');
$nav[]=array('hosting','http://developer.yahoo.com/yui/articles/hosting/','Serving YUI Files from Yahoo! (external)', 'Serve YUI source files from Yahoo! -- free, fast, and simple');
$nav[]=array('security','http://developer.yahoo.com/security/','Security Best Practices (external)', 'Best practices for working with web services while protecting user privacy');



?>

<div class="yui-b" id="tocWrapper">
<!-- TABLE OF CONTENTS -->
<div id="toc">
	
<ul>
<?php
for ($i=0; $i<count($nav); $i++)
{
	$sect = $nav[$i][0];
	$link = $nav[$i][1];
	$text = $nav[$i][2];

	$alt = $nav[$i][3];
	echo "<li class=\"";
	if ($sect && ($sect == $section)) {
		echo "selected ";
	}
	else
	{
		if ($sect) {
			echo "item";
		} else {
			echo "sect";
			if($i==0) {
				echo " first";
			}
		}
	}
	echo "\">";
	if ($link)
	{
		echo "<a title=\"$alt\" href=\"";
		if (substr($link, 0, 7) != 'http://') {
			//echo "$docroot"; <--these are already in the url
		}
		echo $link;
		echo "\">";
	}
	echo $text;
	if ($link) {
		echo "</a>";
	}
	echo "</li>";
}
?>
</ul>
</div>
</div>
