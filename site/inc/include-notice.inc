<h5>Other Ways</h5>

<ul>
	<li><p><strong>The Dependency Configurator</strong> &#8211; Instead of copying and pasting the filepaths above, try letting <a href="/yui/articles/hosting/#configure">the YUI dependency Configurator determine the optimal file list for your desired components</a>; the Configurator uses YUI Loader to write out the full HTML for including the precise files you need for your implementation.</p></li>

<?php

//include module name for YUI Loader if we're not on the Get or Yahoo Global
//page.  The local $section variable is the same as the YUI Loader's module
//name, so we'll use that here; its limitation is that it omits the option
//of using simpleeditor and containercore.
if ($section != "yuiloader") {
	if (($section != "yahoo") && ($section != "get")) { ?>

	<li><p><strong>Loading via YUI Loader</strong> &#8211; If you wish to include this component via the <a href="http://developer.yahoo.com/yui/yuiloader/">YUI Loader</a>, its module name is <code><?php echo $section; ?></code>. (<a href="http://developer.yahoo.com/yui/yuiloader/#modulenames">Click here for the full list of module names for YUI Loader.</a>)</p></li>
	
	<?php } else { ?>
	
	<li><p><strong>Loading via YUI Loader</strong> &#8211; If you are loading components via the <a href="http://developer.yahoo.com/yui/yuiloader/">YUI Loader</a>, this component <em>is included in the YUI Loader package</em> &mdash; you do not need to load it separately. If YUI Loader is on the page, so is the <?php echo $component; ?>.</p></li>
	
	
	<?php 
	}
}
?>
</ul>

<!--<p><a href="/yui/articles/hosting/#configure"><img id="configuratorBadge" src="http://us.i1.yimg.com/us.yimg.com/i/ydn/yuiweb/img/configure.png" alt="YUI dependency configurator." title="Use the YUI dependency Configurator determine the optimal file list for your desired components; the Configurator uses YUI Loader write out the full HTML for including the precise files you need for your implementation." height="127" width="150"></a></p>
-->

<h5>Notes</h5>

<ul>
	<li><p><strong>Where These Files Come From</strong> &#8211; The files included using the text above will be served from Yahoo! servers; see "<a href="http://developer.yahoo.com/yui/articles/hosting/">Serving YUI Files from Yahoo!</a>" for important information about this service.  JavaScript files are minified, meaning that comments and white space have been removed to make them more efficient to download.  To use the full, commented versions or the <a href="http://developer.yahoo.com/yui/articles/faq/#debug"><code>-debug</code></a> versions of YUI JavaScript files, please <a href="http://developer.yahoo.com/yui/download/">download the library distribution</a> and host the files on your own server.</p></li>
	<li><p><strong>Order Matters</strong> &#8211; As is the case generally with JavaScript and CSS, order matters; these files should be included in the order specified above.  If you include files in the wrong order, errors may result.</p></li>

<?php

if (in_array($section, array("autocomplete", "button", "calendar", "colorpicker", "container", "datatable", "layout", "logger", "menu", "editor", "profilerviewer", "resize", "tabview", "treeview"))) {
?>

	<li><p><strong>Using "CSS Skins"</strong> &#8211; One of the files listed above contains a CSS "skin" for the <?php echo $component; ?>.  For this skin CSS to work correctly, you will need to apply the CSS class "yui-skin-sam" to an element that is a parent of the element in which the component lives.  You can usually accomplish this simply by putting the class on the <code>&lt;body&gt;</code> tag:</p>
		<p><code>&lt;body class="yui-skin-sam"&gt;</code></p>
		<p class="lastP">For more information on skinning YUI components and making use of default skins, see our <a href="http://developer.yahoo.com/yui/articles/skinning/">Understanding YUI Skins</a> article here on the website.</p>
	</li>
<?php } ?>
</ul>