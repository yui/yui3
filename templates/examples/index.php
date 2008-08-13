<?php
$docroot = "../"; //path to distribution's yui root
require($docroot."inc/common.php");
?>

<?php
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
	
<p>The YUI Library 3.x ships with a series of <?php echo sizeof($examples);?> examples that illustrate the implementation of its components. The examples can be starting points for your exploration, code snippets to jump-start your own programming, or simply inspiration as to how various interaction patterns can be enabled in the web browser via YUI.</p>

<p>This page allow you to explore these examples component-by-component; on this page you'll find the full index of library examples with the link and short description of each.</p>
<?php
foreach($aTypes as $thisType) {
    $exHtml = "";

    $aUtils = getModulesByType($thisType,$modules);
    foreach($aUtils as $currentModuleName=>$aUtil) {
        $aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
        if ($aCurrentExamples) {
            $exHtml.= "<table class='examplesTable'>\n";
            $exHtml.= "<thead>\n";
            $exHtml.= "<tr><th class='title' colspan='2'><h4>$aUtil[name]</h4></th></tr>";
            $exHtml.= "</thead>\n<tbody>\n";
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
                    $exHtml.= "<tr $zebra><td class='title'><a href='$currentModuleName/$thisExample[key].html'>$thisExample[name]</a></td>";
                    
                    //Example descriptoin
                    $exHtml.= "<td class='description'>$thisExample[description]</td>";
                    
                    $exHtml.= "</tr>\n";
                    $idx++;
                }
            }
            $exHtml.= "</tbody>\n</table>\n";
        }
    }

    if ($exHtml !== "") {
        echo "\n<h3>".$oTypeNames[$thisType]."</h3>";
        echo $exHtml;
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
                            <li><a href="http://www.satyam.com.ar/yui/">Satyam's YUI Site</a>: Satyam is a well-known YUI expert who has assisted thousands of developers with their YUI implementations.</li>
                        </ul>
                    </div>
                </div>
            </div> 
	
		</div>
	</div>
</div>

<?php 

if ($ydn) {

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
