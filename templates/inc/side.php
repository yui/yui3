<?php
if (!isset($section)) { $section = ""; }


$nav[]=array('', '', 'YUI 3.x Project', '');
$nav[]=array('yui3home', 'http://developer.yahoo.com/yui/3/', 'YUI 3 Web Site (external)', 'The Yahoo! User Interface (YUI) Library, 3.x Branch, ');
$nav[]=array('examples',$docroot.'examples/','YUI 3 Examples', 'Examples of every YUI utility and control in action');
$nav[]=array('docs',$docroot.'api/','YUI 3 API Docs', 'Instantly searchable API documentation for the entire YUI library.');
$nav[]=array('sourceforge','http://sourceforge.net/projects/yui/','YUI 3 on Sourceforge (external)', 'The YUI Library can be downloaded from SourceForge');
$nav[]=array('license','http://developer.yahoo.com/yui/license.html','YUI License (external)', 'YUI is free and open, offered under a BSD license.');

$nav[]=array('', '', 'YUI 3 Core - Examples', ' YUI 3 Core - Functional Examples');
$nav[]=array('yui',$docroot.'examples/yui/index.html','YUI (Global Object)', 'YUI (Global Object) - Functional Examples');
$nav[]=array('dom',$docroot.'examples/dom/index.html','CSS Fonts', 'DOM - Functional Examples');
$nav[]=array('node',$docroot.'examples/node/index.html','CSS Grids', 'Node - Functional Examples');

$nav[]=array('', '', 'YUI 3 Utilities - Examples', 'YUI Utilities - Functional Examples');
$nav[]=array('attribute',$docroot.'examples/attribute/index.html','Attribute', 'Attribute - Functional Examples');
$nav[]=array('animation',$docroot.'examples/animation/index.html','Animation', 'Animation - Functional Examples');
$nav[]=array('base',$docroot.'examples/base/index.html','Base', 'Base - Functional Examples');
$nav[]=array('dd',$docroot.'examples/dd/index.html','Drag &amp; Drop', 'Drag &amp; Drop - Functional Examples');
$nav[]=array('io',$docroot.'examples/io/index.html','IO', 'IO - Functional Examples');
$nav[]=array('json',$docroot.'examples/json/index.html','JSON', 'JSON (JavaScript Object Notation) - Functional Examples');
$nav[]=array('queue',$docroot.'examples/queue/index.html','Queue', 'Queue - Functional Examples');

$nav[]=array('', '', 'YUI 3 CSS - Examples', 'YUI CSS - Functional Examples');
$nav[]=array('cssreset',$docroot.'examples/cssreset/index.html','CSS Reset', 'YUI CSS Reset - Functional Examples');
$nav[]=array('cssfonts',$docroot.'examples/cssfonts/index.html','CSS Fonts', 'YUI Fonts - Functional Examples');
$nav[]=array('cssgrids',$docroot.'examples/cssgrids/index.html','CSS Grids', 'YUI Grids - Functional Examples');
$nav[]=array('cssbase',$docroot.'examples/cssbase/index.html','CSS Base', 'YUI Base - Functional Examples');

$nav[]=array('', '', 'The YUI Community', '');
$nav[]=array('yuiblog','http://yuiblog.com','YUI Blog (external)', 'The Yahoo! User Interface Blog');
$nav[]=array('groups','http://tech.groups.yahoo.com/group/ydn-javascript/','YUI Forum (external)', 'The Yahoo! Group YDN-JavaScript hosts the YUI community forum');
$nav[]=array('groups','http://tech.groups.yahoo.com/group/yui3/','YUI 3 Forum (external)', 'The Yahoo! Group yui3 is dedicated to the 3.x branch of the Yahoo! User Interface (YUI) Library.');
$nav[]=array('poweredby','/yui/poweredby/','YUI Sightings (external)', 'YUI is used by Yahoo! and by hundreds of other sites, including many you know and love.');
$nav[]=array('theater','http://developer.yahoo.com/yui/theater/','YUI Theater (external)', 'Videos and podcasts from the YUI Team and from the Yahoo! frontend engineering community.');


$nav[]=array('', '', 'YUI Articles on the YUI Website', '');
$nav[]=array('faq','http://developer.yahoo.com/yui/articles/faq/','YUI FAQ (external)', 'Answers to Frequently Asked Questions about the YUI Library');
$nav[]=array('gbs','http://developer.yahoo.com/yui/articles/gbs/','Graded Browser Support (external)', 'Yahoo!\'s philosophy of Graded Browser Support');
$nav[]=array('reportingbugs','http://developer.yahoo.com/yui/articles/reportingbugs/','Bug Reports/Feature Requests (external)', 'Reporting Bugs and Making Feature Requests for YUI Components');
$nav[]=array('hosting','http://developer.yahoo.com/yui/articles/hosting/','Serving YUI Files from Yahoo! (external)', 'Serve YUI source files from Yahoo! -- free, fast, and simple');
$nav[]=array('security','http://developer.yahoo.com/security/','Security Best Practices (external)', 'Best practices for working with web services while protecting user privacy');
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
