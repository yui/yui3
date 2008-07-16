<?php $title="Yahoo! UI Library (YUI)";
$section="yui";
include  "inc/header.inc";
require('inc/rss-feed.inc');
?>


<?php
				
$oYuiRss = new SimpleRss('http://feedproxy.feedburner.com/YahooUserInterfaceBlog', 60, 6);
//$oYuiRss = new SimpleRss('http://localhost/test.xml', 60, 6);
if ($oRssObject = $oYuiRss->GetRssObject()) {

?><h2 id="yuiblogTitle">Yahoo! User Interface Blog <a href="http://feeds.yuiblog.com/YahooUserInterfaceBlog"><img class="rssbadge" src="http://us.i1.yimg.com/us.yimg.com/i/us/ext/rss.gif" height="17" width="36" alt="RSS badge"></a></h2>
				<div id="yuiblogBody"><?php
 echo '<ul class="yuirssreader">';
 foreach ($oRssObject->aItems as $oItem) {
   $thistitle = htmlspecialchars($oItem->sTitle);
   $thisdate = strftime("%D %T",strtotime($oItem->sDate));
   echo "<li><a href=\"$oItem->sLink\">$thistitle</a><p class='byline'><cite>$oItem->sAuthor</cite><span class='yuirssreader-date'>$thisdate</span></p></li>";
 }
 echo '</ul>';
 if ($oYuiRss->IsCached()) {
	echo '<!--cached-->';
 } else {
	echo '<!--not cached-->';
 }
 echo '</div>';
}
?>

<?php include "inc/footer.inc" ?>