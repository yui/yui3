<?php
echo'
<div id="quicklinks">
	<h4>More Information</h4>
	<ul>
';
if (($section != "datasource")&&($section != "element")) { echo '		<li><a href="/yui/examples/'.$section.'/index.html">Examples</a>: Explore examples of the '.$component.' in action.</li>
';}
if (($section != "fonts") && ($section != "reset") && ($section != "grids") && ($section != "base")) { echo '		<li><a href="/yui/docs/module_'.$section.'.html">API Documentation</a>: View the full API documentation for the '.$component.'.</li>
';}
echo '		<li><a id="releasenotes" href="/yui/build/'.$section.'/README">Release Notes</a>: Detailed change log for the '.$component.'.</li>
		<li><a href="/yui/license.html">License</a>: The YUI Library is issued under a BSD licensed.</li>
		<li><a href="/yui/download/">Download</a>: Download the '.$component.' as part of the full YUI Library on SourceForge.</li>
	</ul>
</div>';
?>
