<h5>Including Files Manually</h5>

<ul>
	<li><p><strong>The Dependency Configurator</strong> &#8211; If you'd like to obtain the optimal list of files you need to manually include on your page to support this component along with any other components on your page, you can use the <a href="/yui/3/articles/hosting/#configure">YUI Dependency Configurator</a>. The Configurator uses YUI Loader to generate the optimal set of HTML script and link tags required to include the files you need for your implementation; which you can then copy/paste into your page.</p></li>
<?php

//include module name for YUI Loader if we're not on the Get or Yahoo Global
//page.  The local $section variable is the same as the YUI Loader's module
//name, so we'll use that here; its limitation is that it omits the option
//of using simpleeditor and containercore.
if ($section != "yuiloader") {
	if (($section != "yui") && ($section != "get")) { ?>

	<li><p><strong>Loading via YUI Loader</strong> &#8211; If you wish to include this component via the <a href="/yui/3/yui/#loader">YUI Loader</a>, its module name is <code><?php echo $section; ?></code>. (<a href="/yui/3/yui/#modulelist">Click here for the full list of module names for YUI Loader.</a>)</p></li>

	<?php } else { ?>

	<li><p><strong>Loading via YUI Loader</strong> &#8211; If you are loading components via the <a href="/yui/3/yui/#loader">YUI Loader</a>, this component <em>is included in the YUI Loader package</em> &mdash; you do not need to load it separately. If YUI Loader is on the page, so is the <?php echo $component; ?>.</p></li>

	<?php 
	}
}
?>
</ul>

<!--
<p><a href="/yui/articles/hosting/#configure"><img id="configuratorBadge" src="http://us.i1.yimg.com/us.yimg.com/i/ydn/yuiweb/img/configure.png" alt="YUI dependency configurator." title="Use the YUI dependency Configurator determine the optimal file list for your desired components; the Configurator uses YUI Loader write out the full HTML for including the precise files you need for your implementation." height="127" width="150"></a></p>
-->

<h5>Notes</h5>

<ul>
	<li><p><strong>Where These Files Come From</strong> &#8211; The files included using the text above will be served from Yahoo! servers; see "<a href="http://developer.yahoo.com/yui/articles/hosting/">Serving YUI Files from Yahoo!</a>" for important information about this service.</p></li>
</ul>
