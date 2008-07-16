<?php

$galleryLink = "<h2><a name=\"gallery\"></a>Built Something Cool? Please Share It in the Applications Gallery!</h2>\n<p>We'd love to see what you've come up with!  To share your applications and find other examples of developer creativity, please visit the <a href=\"http://gallery.yahoo.com/\">Yahoo! Applications Gallery</a>. You'll be able to upload, download, rate, and review applications from all over the world, using all sorts of Yahoo! data and services.</p>\n";

if (!isset($docroot)) { $docroot=""; }
if (!isset($section)) { $section = ""; }

$nav[]=array('', '', 'Yahoo! UII Library', '');
$nav[]=array('yui','/yui/','Home', 'The Yahoo! User Interface Library (YUI)');
$nav[]=array('yuiblog','http://yuiblog.com','YUIBlog', 'The Yahoo! User Interface Blog');
$nav[]=array('groups','http://tech.groups.yahoo.com/group/ydn-javascript/','YUI Discussion Forum', 'The Yahoo! Group YDN-JavaScript hosts the YUI community forum');
$nav[]=array('sourceforge','http://sourceforge.net/projects/yui/','YUI on Sourceforge', 'The YUI Library can be downloaded from SourceForge');
$nav[]=array('docs','/yui/docs/','API Documentation', 'Instantly searchable API documentation for the entire YUI library.');
$nav[]=array('examples','/yui/examples/','Examples &amp; Implementations', 'Examples of every YUI utility and control in action');
$nav[]=array('theater','/yui/theater/','YUI Theater', 'Videos and podcasts from the YUI Team and from the Yahoo! frontend engineering community.');

$nav[]=array('', '', 'YUI Articles', '');
$nav[]=array('gbs','/yui/articles/gbs/gbs.html','Graded Browser Support', 'Yahoo!\'s philosophy of Graded Browser Support');
$nav[]=array('gbstable','/yui/articles/gbs/gbs_browser-chart.html','Table of A-Grade Browsers', 'The current roster of fully supported, "A-Grade" browsers');
/*$nav[]=array('hosting','/yui/articles/hosting/hosting.html','Serving YUI Files from Yahoo!', 'Serve YUI source files from the same Content Distribution Network we use at Yahoo! -- free, fast, and simple');*/

$nav[]=array('', '', 'YUI Components', '');
$nav[]=array('animation','/yui/animation/','Animation', 'The YUI Animation Utility');
$nav[]=array('autocomplete','/yui/autocomplete/','AutoComplete', 'The YUI AutoComplete Control');
$nav[]=array('calendar','/yui/calendar/','Calendar', 'The YUI Calendar Control');
$nav[]=array('connection','/yui/connection/','Connection Manager', 'The YUI Connection Manager (AJAX)');
$nav[]=array('container','/yui/container/','Container', 'The YUI Container Family (Module, Overlay, Tooltip, Panel, Dialog, SimpleDialog)');
$nav[]=array('dom','/yui/dom/','Dom', 'The YUI Dom Collection');
$nav[]=array('dragdrop','/yui/dragdrop/','Drag &amp; Drop', 'The YUI Drag &amp; Drop Utility');
$nav[]=array('event','/yui/event/','Event', 'The YUI Event Utility');
$nav[]=array('logger','/yui/logger/','Logger', 'The YUI Logger Control');
$nav[]=array('menu','/yui/menu/','Menu', 'The YUI Menu Control');
$nav[]=array('slider','/yui/slider/','Slider', 'The YUI Slider Control');
$nav[]=array('tabview','/yui/tabview/','TabView', 'The YUI TabView Control');
$nav[]=array('treeview','/yui/treeview/','TreeView', 'The YUI TreeView Control');
$nav[]=array('yahooglobal','/yui/yahoo/','YAHOO Global Object', 'The YUI YAHOO Global Object');
$nav[]=array('reset','/yui/reset/','Reset CSS', 'YUI Reset CSS');
$nav[]=array('fonts','/yui/fonts/','Fonts CSS', 'YUI Fonts CSS');
$nav[]=array('grids','/yui/grids/','Grids CSS', 'YUI Grids CSS');

$nav[]=array('', '', 'Yahoo! Developer Network', '');
$nav[]=array('home','/','Home', 'What\'s hot?');
$nav[]=array('about','/about/','About Us', 'Who we are and what we do.');
$nav[]=array('blog','/blog/','Developer Network Blog', 'What we\'ve done lately.');
$nav[]=array('faq','/faq/','Frequently Asked Questions', 'With answers!');
$nav[]=array('community','/community/','Support Communities', 'Where to go for help.');
$nav[]=array('gallery','http://gallery.yahoo.com/','Working Examples', 'gallery.yahoo.com');

$nav[]=array('', '', 'Developer Central', '');
$nav[]=array('auth','/auth/','Browser Based Auth', 'Authentication, with a browser.');
$nav[]=array('ypatterns','/ypatterns/','Design Pattern Library', 'Sweet, tasty pattens!');
$nav[]=array('javascript','/javascript/','JavaScript Developer Center', 'Client-side magic.');
$nav[]=array('flash','/flash/','Flash Developer Center', 'Using Adobe Flash with Yahoo! Web Services and APIs');
$nav[]=array('dotnet','/dotnet/','.NET Developer Center', 'Integrated development from Microsoft.');
$nav[]=array('php','/php/','PHP Developer Center', 'Workhorse server language.');
$nav[]=array('python','/python/','Python Developer Center', 'Snakes on a page!');
$nav[]=array('ruby','/ruby/','Ruby Developer Center', 'How to get the news.');
$nav[]=array('download','/download/','Search SDK', 'Examples for Search');
$nav[]=array('security','/security/','Security Best Practices', '');
$nav[]=array('util','/util/','Utility Web Services', 'Handy tools!');

$nav[]=array('', '', 'Work With Us', '');
#$nav[]=array('auth','/auth/','Access Yahoo! User Data', 'Hooking Up');
$nav[]=array('appid','http://api.search.yahoo.com/webservices/register_application', 'Get an Application ID', 'You\'ll need this.');
# $nav[]=array('register','/register/', 'Make a Special Request', 'Need something out of the ordinary?');
$nav[]=array('usage','/usagePolicy/','Usage Policy', 'What you can do.');
$nav[]=array('terms','/terms/','Terms of Use', 'How you can do it.');

$nav[]=array('', '', 'Learn About ....', '');
$nav[]=array('answers','/answers/','Answers', 'Your pipeline to the great global brain.');
$nav[]=array('delicious','http://del.icio.us/help/api/','del.icio.us', 'Everybody\'s bookmarks.');
$nav[]=array('finance','/finance/','Finance', 'The color of money.');
$nav[]=array('flickr','/flickr/','Flickr&trade;', 'Share your snapshots.');
$nav[]=array('hotjobs','/hotjobs/','HotJobs', 'The perfect job is out there.');
$nav[]=array('local','/local/','Local', 'Find it in your neighborhood.');
$nav[]=array('maps','/maps/','Maps', 'Where ARE we, anyway?');
$nav[]=array('stores','/stores/','Merchant Solutions', 'Cha-ching!');
$nav[]=array('messenger','/messenger/','Messenger', 'Chat, webcam, and more.');
$nav[]=array('music','/music/','Music', 'This is HUGE.');
$nav[]=array('photos','/photos/','Photos', '');
$nav[]=array('rss','/rss/','RSS Feeds', 'How to get the news.');
$nav[]=array('search','/search/','Search', 'Find it fast!');
$nav[]=array('searchMktng','http://searchmarketing.yahoo.com/af/yws.php','Search Marketing', 'Monetize your site.');
$nav[]=array('shopping','/shopping/','Shopping', 'Find it and buy it!');
$nav[]=array('traffic','/traffic/','Traffic', 'Where\'s the backup?');
$nav[]=array('travel','/travel/','Travel', 'How to get there.');
$nav[]=array('upcoming','http://upcoming.org/services/api/','Upcoming.org', 'Who\'s doing what?');
$nav[]=array('weather','/weather/','Weather', 'Baby, it\'s cold outside....');
$nav[]=array('webjay','http://webjay.org/api/help','Webjay', 'Spinning the hits.');
$nav[]=array('widgets','http://pa.yahoo.com/*http://us.rd.yahoo.com/evt=37757/*http://widgets.yahoo.com/workshop/','Widgets', 'Cute little shiny toys!');
?>


<div class="yui-b">
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
		echo "</a>";
	}
	echo "</li>";
}
?>
</ul>
</div>
</div>