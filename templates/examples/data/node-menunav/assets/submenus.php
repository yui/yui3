<?php

if (isset($_GET["menu"])) {

	$menu = $_GET["menu"];

	if (!empty($menu)) {
		
		if ($menu == "answers-options") {
?>
<ul>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://answers.yahoo.com/dir/">Answer</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://answersonthestreet.yahoo.com/">Answers on the Street</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://answers.yahoo.com/question/;_ylt=Av3Nt22Mr7YNs651NWFv8YUPzKIX;_ylv=3?link=ask">Ask</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://answers.yahoo.com/dir/;_ylt=Aqp_jJlsYDP7urcq2WGC6HBJxQt.;_ylv=3?link=over&amp;amp;more=y">Discover</a></li>
</ul>
<?php
		}
		else if ($menu == "flickr-options") {
?>
<ul>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.flickr.com/explore/">Explore</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.flickr.com/groups/">Groups</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.flickr.com/photos/organize/">Organize Your Photos</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://flickr.com/photos/friends/">Photos From Contacts</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.flickr.com/signup/">Sign Up</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.flickr.com/tour/">Take a Tour</a></li>
</ul>
<?php	
		}
		else if ($menu == "jumpcut-options") {
?>
<ul>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.jumpcut.com/explore/?type=">Explore</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.jumpcut.com/groups/">Groups</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.jumpcut.com/create/">Make a Movie</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.jumpcut.com/explore/?type=movie&amp;amp;sort=rank&amp;amp;viewtype=thumb&amp;amp;pcount=1">Recently Popular Movies</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://www.jumpcut.com/upload/">Upload</a></li>
</ul>
<?php	
		}
		else if ($menu == "mobile-options") {
?>
<ul>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://mobile.yahoo.com/developers">Developers Home</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://mobile.yahoo.com/mail">Mail</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://mobile.yahoo.com/gallery">Widget Gallery</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://mobile.yahoo.com/oneconnect">Y! oneConnect</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://mobile.yahoo.com/go">Yahoo! Go</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://mobile.yahoo.com/iphone">Yahoo! on the iPhone</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://mobile.yahoo.com/mail">More Mobile Services</a></li>
</ul>
<?php	
		}
		else if ($menu == "upcoming-options") {
?>
<ul>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://upcoming.yahoo.com/event/add/">Add New Event</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://upcoming.yahoo.com/event/">Events</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://upcoming.yahoo.com/friend/">Friends</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://upcoming.yahoo.com/group/">Groups</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://upcoming.yahoo.com/place/">Places</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://upcoming.yahoo.com/popular/">Popular</a></li>
</ul>
<?php	
		}
		else if ($menu == "forgood-options") {
?>
<ul>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://forgood.yahoo.com/take_action/donate.html">Donate</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://forgood.yahoo.com/everyday_heroes/index.html">Everyday Heroes</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://forgood.yahoo.com/go_green/index.html">Go Green</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://forgood.yahoo.com/good_causes/index.html">Good Causes</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://forgood.yahoo.com/purple_acts/index.html">Purple Acts</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://forgood.yahoo.com/social_responsibility/index.html">Social Responsibility</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://forgood.yahoo.com/take_action/index.html">Take Action</a></li>
	<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://forgood.yahoo.com/take_action/volunteer.html">Volunteer</a></li>
</ul>
<?php	
		}
		
	}

}

?>