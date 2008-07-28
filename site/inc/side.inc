<?php

$galleryLink = "<h2><a name=\"gallery\"></a>Built Something Cool? Please Share It in the Applications Gallery!</h2>\n<p>We'd love to see what you've come up with!  To share your applications and find other examples of developer creativity, please visit the <a href=\"http://gallery.yahoo.com/\">Yahoo! Applications Gallery</a>. You'll be able to upload, download, rate, and review applications from all over the world, using all sorts of Yahoo! data and services.</p>\n";

if (!isset($docroot)) { $docroot=""; }
if (!isset($section)) { $section = ""; }

$nav[]=array('', '', 'YUI 3.x Project', '');
$nav[]=array('home','/','YUI 3 Intro and FAQ', 'The Yahoo! User Interface Library (YUI)');
$nav[]=array('home','/','YUI 3 versus YUI 2.x', 'The Yahoo! User Interface Library (YUI)');
$nav[]=array('faq','/yui/articles/3.x/overview/','YUI 3 Goals &amp; Philosophy', 'Introduction to YUI ');
$nav[]=array('faq','/yui/articles/faq/','YUI 3 FAQ', 'Answers to Frequently Asked Questions about the YUI Library');
$nav[]=array('examples','/yui/examples/','YUI 3 Examples', 'Examples of every YUI utility and control in action');
$nav[]=array('docs','/yui/docs/','YUI 3 API Docs', 'Instantly searchable API documentation for the entire YUI library.');
$nav[]=array('sourceforge','http://sourceforge.net/projects/yui/','YUI 3 Source Code (SVN)', 'The YUI Library can be downloaded from SourceForge');
$nav[]=array('license','/yui/license.html','YUI 3 is BSD Licensed', 'YUI is free and open, offered under a BSD license.');


$nav[]=array('', '', 'YUI 3 Core', '');
$nav[]=array('yui','/yui/','YUI (Global Object)', 'YUI Global Object');
$nav[]=array('dom','/dom/','DOM', 'DOM');
$nav[]=array('node','/node/','Node', 'Node');

$nav[]=array('', '', 'YUI 3 Utilities', '');
$nav[]=array('attribute','/attribute/','Attribute', 'Attribute');
$nav[]=array('animation','/animation/','Animation', 'Animation');
$nav[]=array('base','/base/','Base', 'Base');
$nav[]=array('compat','/compat/','Compat', 'Compat');
$nav[]=array('cookie','/cookie/','Cookie', 'Cookie');
$nav[]=array('dd','/dd/','Drag & Drop', 'Drag & Drop');
$nav[]=array('io','/io/','IO', 'IO');
$nav[]=array('json','/json/','JSON', 'JSON (JavaScript Object Notation)');
$nav[]=array('queue','/queue/','Queue', 'Queue');

$nav[]=array('', '', 'Tools', '');
$nav[]=array('compressor','/yui/compressor/','YUI Compressor', 'YUI Compressor for CSS and JavaScript');
$nav[]=array('loader','/loader/','YUI Load', 'YUI Loader');
$nav[]=array('logger','/logger/','YUI Log', 'YUI Logger');
$nav[]=array('profiler','/profiler/','YUI Profiler', 'Global YUI Object');
$nav[]=array('yuitest','/yuitest/','YUI Test', 'YUI Test');

$nav[]=array('', '', 'CSS', '');
$nav[]=array('reset','/reset/','CSS Reset', 'CSS Reset');
$nav[]=array('fonts','/fonts/','CSS Fonts', 'CSS Fonts');
$nav[]=array('grids','/grids/','CSS Grids', 'CSS Grids');
$nav[]=array('base','/base/','CSS Base', 'CSS Base');

$nav[]=array('', '', 'The YUI Community', '');
$nav[]=array('yuiblog','http://yuiblog.com','YUI Blog', 'The Yahoo! User Interface Blog');
$nav[]=array('poweredby','http://twitter.com/yuiteam','YUI on Twitter', 'Follow YUI on Twitter');
$nav[]=array('groups','http://tech.groups.yahoo.com/group/ydn-javascript/','YUI Forum', 'The Yahoo! Group YDN-JavaScript hosts the YUI community forum');
$nav[]=array('poweredby','/yui/poweredby/','YUI Sightings', 'YUI is used by Yahoo! and by hundreds of other sites, including many you know and love.');


$nav[]=array('', '', 'YUI Articles', '');
$nav[]=array('gbs','/yui/articles/gbs/','Graded Browser Support', 'Yahoo!\'s philosophy of Graded Browser Support');
$nav[]=array('skinning','/yui/articles/skinning/','Skinning YUI', 'Modifying YUI\'s visual "skin" and building skins of your own');
$nav[]=array('customwidgets','http://yuiblog.com/blog/2008/06/24/buildingwidgets','Building Custom Widgets', 'Building your own custom widgets using the YUI infrastructure and tools.');
$nav[]=array('reportingbugs','/yui/articles/reportingbugs/','Bug Reports/Feature Requests', 'Reporting Bugs and Making Feature Requests for YUI Components');
$nav[]=array('hosting','/yui/articles/hosting/','Serving YUI Files from Yahoo!', 'Serve YUI source files from Yahoo! -- free, fast, and simple');
$nav[]=array('security','/security/','Security Best Practices', 'Best practices for working with web services while protecting user privacy');
$nav[]=array('roadmap','/yui/articles/roadmap/','YUI Roadmap', 'Learn about plans for YUI\'s upcoming releases');




?>

<div class="yui-b toc3" id="tocWrapper">
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
			echo "$docroot";
		}
		echo $link;
		echo "\">";
	}
	echo $text;
	if ($link) {
		if($sect=="theater") {
			echo " <img src='http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/vidcam12_1.gif'>";
		}
		if($sect=="groups") {
			echo " <img src='http://us.i1.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/post12_1.gif'>";
		}
		$aBeta = array();
//		$aBeta = array("selector", "profiler", "profilerviewer", "imagecropper", "resize", "layout",  "element", "editor", "datasource", "datatable", "yuiloader", "cookie");
		if(in_array($sect, $aBeta)) {
			echo " <img src='http://us.i1.yimg.com/us.yimg.com/i/not/beta_1.gif'>";
		}
		echo "</a>";
	}
	echo "</li>";
}
?>
</ul>
</div>
</div>
