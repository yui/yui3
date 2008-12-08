<?php
$docroot = ""; //path to distribution's yui root
require($docroot."inc/common.php");

$title = "The Yahoo! User Interface Library (YUI) 3.0 PR2";
$prepend = "<style type='text/css'>
#components:after {content:'.';visibility:hidden;clear:both;height:0;display:block;}
#components {zoom:1;}
</style>";

include($docroot."inc/header.php");
?>
<div id="yui-main">
	<div class="yui-b" id="main">
		
		<div class="yui-g">
			
            <h2>YUI 3.x Preview Release 2</h2>

			<p>The YUI team is pleased to announce the YUI 3.0 Preview Release 2. This preview is an early look at what we're working on for the next generation of YUI Library. Please <a href="api/">review the API</a>, play with <a href="examples/">the examples</a>, and read the documentation on the <a href="http://developer.yahoo.com/yui/3/">3.x web site</a> for details; you can find us with questions or comments on the <a href="http://tech.groups.yahoo.com/group/yui3/">YUI 3.x discussion group</a>.</p>		
			<p>Please keep in mind that this is an early <em>preview</em>, not a production-quality (or even a beta) release. Things will change. Optimization and refactoring will continue. But we didn't want to wait to get feedback from the community.</p>
			<p>This YUI 3.x PR2 is part of the broader <a href="http://developer.yahoo.com/yui">YUI Library</a> project, which is a coherent collection of JavaScript and CSS resources that make it easier to build richly interactive applications in web browsers. They have been released as open source under a <a href="license.html">BSD license</a> and are free for all uses.</p>

			<h3 id="start" class="first">Getting Started</h3>

			<ol class="gettingstarted">
				<li><strong>Check out the examples of YUI in action.</strong> We recommend starting with the base <a href="examples/yui/">YUI module</a> and then moving on to <a href="examples/node/">Node</a>.  Other utilities like <a href="examples/io/">IO</a> and <a href="examples/dd/">Drag and Drop</a> make for good points of exploration. If you're interested in YUI's CSS components, read through the examples for <a href="examples/cssreset/">Reset</a>, <a href="examples/cssbase/">Base</a>, <a href="examples/cssfonts/">Fonts</a>, and <a href="examples/cssgrids/">Grids</a> in that order.</li>
		  		<li><strong>Remember that there are full user's guides</strong> for each component here on the website. If you have any questions about a component as you play with the examples, check out the component's user's guide (by following any of the links along the left side of the page) or the <a href="api/">searchable API documentation</a>.</li>
				<li><strong>Start building.</strong> Use the <a href="configurator/">YUI 3 Configurator</a> to configure a page for YUI 3 usage or base your exploration off of one of the existing <a href="examples/">examples</a>.</li>
			  	<li><strong>Become a member of the YUI community.</strong> As YUI 3 moves through its preview phase, developers and community members are discussing it <a href="http://tech.groups.yahoo.com/group/yui3/">in the YUI 3 forums</a>. </li>
			</ol>

			<h3 id="examples">YUI Functional Examples Included with This Download:</h3>

			<p>Along with the source code for YUI, your download includes <a href="examples/index.html"><?php echo sizeof($examples);?> functional examples and tutorials</a> showing YUI 3.x in action.  Use the list below or the menu at left to review these YUI demos &mdash; they're the best way to get oriented to what YUI can do and to grab sample code that can help you get started.  Remember that these examples and more, in addition to user's guides for each YUI component, can also be found on the <a href="http://developer.yahoo.com/yui/3/">YUI website</a> (external link).  (<strong>Note:</strong> Almost all examples in this distribution will work if you are browsing them from your filesystem, but some examples included here do need to be deployed on a PHP-enabled http server to function properly; if you don't have access to such a setup, just check out those examples <a href="http://developer.yahoo.com/yui/3/">on our website</a> to see how they work.)</p>

		</div>

<!--stacked three-column grid-->
		<div class="yui-gb">
			<div class="yui-u first">

        		<h4>YUI 3 Core</h4>
        		<ul>
			        <?php
			            $aUtils = getModulesByType("core",$modules);
			            foreach($aUtils as $key=>$aUtil) {
				            echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
			            }
			        ?>
				</ul>
				
				<h4>YUI 3 Component Infrastructure</h4>
				<ul>
			        <?php
			            $aUtils = getModulesByType("infra",$modules);
			            foreach($aUtils as $key=>$aUtil) {
				            echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
			            }
			        ?>
				</ul>

				<h4>YUI 3 Widgets</h4>
				<ul>
			        <?php
			            $aUtils = getModulesByType("widget",$modules);
			            foreach($aUtils as $key=>$aUtil) {
				            echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
			            }
			        ?>
				</ul>
	
				<h4>YUI 3 Node Plugins</h4>
				<ul>
			        <?php
			            $aUtils = getModulesByType("nodeplugin",$modules);
			            foreach($aUtils as $key=>$aUtil) {
				            echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
			            }
			        ?>
				</ul>	
	
			</div>
			<div class="yui-u">  
			
				<h4>YUI 3 Utilities</h4>
				<ul>
			        <?php
			            $aUtils = getModulesByType("utility",$modules);
			            foreach($aUtils as $key=>$aUtil) {
				            echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
			            }
			        ?>
				</ul>

    			<h4>CSS Resources</h4>
        		<ul>
		            <?php
		                //Going to print out the CSS Modules by hand to enforce the logical ordering:
		                /*$aUtils = getModulesByType("css",$modules);
		                foreach($aUtils as $key=>$aUtil) {
		                	echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
		                }*/
		            ?>
		            <li><a href='examples/cssreset/index.html'>CSS Reset</a></li>
		            <li><a href='examples/cssfonts/index.html'>CSS Fonts</a></li>
		            <li><a href='examples/cssgrids/index.html'>CSS Grids</a></li>
		            <li><a href='examples/cssbase/index.html'>CSS Base</a></li>
        		</ul>
			</div> <!-- /div.yui-u -->
		</div> <!-- /div.yui-gb	 -->
	</div>
</div>

<?php include ($docroot."inc/side.php"); ?>
<?php include ($docroot."inc/footer.php"); ?>
