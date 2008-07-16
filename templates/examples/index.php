<?php
$docroot = "../"; //path to distribution's yui root
require($docroot."inc/common.php");
require($loader2x);
?>

<?php
//instantiate Loader:
$loader = new YAHOO_util_Loader();
if ($buildpath) {$loader->base = $buildpath;}

//always load YUI Loader, Dom and Event -- this provides the foundation for adding
//additional funcitionality in a flexible way to the site chrome:
$loader->load("yuiloader", "event", "dom");

$section="examples";
$highlightSyntax = false;
$releasenotes = false;
$title = "Yahoo! User Interface Library (YUI): Index of Library Examples";

if($ydn) {
//YDN PAGE VARIABLES AND HEADER INCLUDE
	echo '<?php
$section="examples";
$highlightSyntax = false;
$releasenotes = false;
$title = "Index of Library Examples";
include("'.$docroot.'inc/header.inc"); 
?>

';
//END YDN PAGE VARIABLES AND HEADER INCLUDE
} else {
	include($docroot."inc/header.php");
}

?>
<div id="yui-main">
    <div class="yui-b">
	    <div class="yui-ge">
		    <div class="yui-u first page-examples" id="main"> 

<h2>Official YUI Examples</h2>
	
<p>Every YUI Library component ships with a series of <?php echo sizeof($examples);?> examples that illustrate its implementation.  These examples can serve as starting points for your exploration of YUI, as code snippets to get you started in your own programming, or simply as an inspiration as to how various interaction patterns can be enabled in the web browser via YUI.</p>

<p>The navigation controls on the left side of this page allow you to explore these examples component-by-component; on this page you'll find the full index of library examples with a link to and short description of each one.</p>
<?php
foreach($aTypes as $thisType) {
		echo "\n<h3>".$oTypeNames[$thisType]."</h3>";
		$aUtils = getModulesByType($thisType,$modules);
		foreach($aUtils as $currentModuleName=>$aUtil) {
			$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
		if ($aCurrentExamples) {
			echo "<table class='examplesTable'>\n";
			echo "<thead>\n";
			echo "<tr><th class='title' colspan='2'><h4>$aUtil[name]</h4></th></tr>";
			echo "</thead>\n<tbody>\n";
			$idx = 1;
			foreach($aCurrentExamples as $key=>$thisExample) {
				/*This may be a cross-listed example.  If it is, ignore; it will be listed with its primary component.*/
				if ($currentModuleName != $thisExample[modules][0])  {
					//do nothing
				} else {
					if($idx%2) {
						$zebra = "class='odd'";
					} else {
						$zebra = "class='even'";
					}
					
					//Link to example
					echo "<tr $zebra><td class='title'><a href='$currentModuleName/$thisExample[key].html'>$thisExample[name]</a></td>";
					
					//Example descriptoin
					echo "<td class='description'>$thisExample[description]</td>";
					
					echo "</tr>\n";
					$idx++;
				}
			}
			echo "</tbody>\n</table>\n";
		}
			
		
		}
}
?>
			</div>

            <div class="yui-u sidebar" id="secondaryContent">
                <div id="siteswelove" class="mod box3">
                    <div class="hd">
                        <h4>YUI Sites We Love</h4>
                    </div>
                    <div class="bd">
                        <a href="http://yuiblog.com/assets/pdf/cheatsheets/<?php echo $section;?>.pdf" id="pdf-single"><img src="../assets/yui-candy.jpg" width="180" height="120"></a>
                        <p>The scores of examples on this page are a worthwhile place to start, but the official YUI examples are just the tip of the iceberg when it comes to YUI sample code and YUI-powered sites from which you can gather additional ideas.  Here are a few YUI-related sites that we find ourselves going back to again and again.</p>
                        <ul>
                            <li><a href="http://blog.davglass.com/files/yui/">Dav Glass's Blog</a>: Dav, who is now a member of the YUI team, has the most extensive set of YUI-focused examples anywhere on the web.</li>
                            <li><a href="http://yazaar.org/">Planet Yazaar</a>: YUI community member Ted Husted started the Yazaar site to collect great code samples from around the YUI world.</li>
                        </ul>
                    </div>
                </div>
            </div> 
	
		</div>
	</div>
</div>

<?php 

if ($ydn) {

	echo "<!--Script and CSS includes for YUI dependencies on this page-->\n";
	echo ($loader->tags());	

	echo '
<?php 
include("'.$docroot.'inc/side.inc");
include("'.$docroot.'inc/footer.inc");
?>';

} else {

	include ($docroot."inc/side.php"); 
	include ($docroot."inc/footer.php"); 
	
}
?>
