<?php
echo'
<div id="quicklinks">
	<h4>More Information</h4>
	<ul>
';
if (($section != "base") && ($section != "cookie") ) { echo '		<li><a href="/yui/3/examples/'.$section.'/index.html">Examples</a>: '.$component.' in action.</li>
';}
if (($section != "cssfonts") && ($section != "cssreset") && ($section != "cssgrids") && ($section != "cssbase")) { echo '		<li><a href="/yui/3/api/module_'.$section.'.html">API Documentation</a>: View the full API documentation for the '.$component.'.</li>
';}
echo '
	<li><a href="/yui/3/download/">Download</a>: '.$component.' as part of the full YUI Library.</li>
	<li><a href="/yui/3/articles/download/">Free Hosting</a> on our fast edge servers with combo-loading.</li>
		<!-- 
		masked for initial release
		<li><a id="releasenotes" href="/yui/3/build/'.$section.'/README">Release notes</a> and detailed change log.</li> 
		-->
		<li><a href="/yui/3/license.html">License</a>:  BSD.</li>
	</ul>
</div>';
?>
