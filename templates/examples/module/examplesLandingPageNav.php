<?php
//This file outputs the example nav for component landing pages:

$docroot = "../../"; //path to distribution's yui root
require($docroot."inc/common.php");

if (!isset($currentModuleName )) {
	$currentModuleName = $_GET['module'];
};
if($modules[$currentModuleName]) {
	$currentModule = $modules[$currentModuleName];
	$component=$currentModule[name];
	
	$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
	if ($aCurrentExamples) {
?>
    <div id="examples" class="mod box4">
        <div class="hd">
            <h4><?php echo $component; ?> Examples</h4>
        </div>
        <div class="bd">
            <ul>
<?php
        $relatedExamples = "";
		foreach($aCurrentExamples as $key=>$thisExample) {
			/*This may be a cross-listed example.  If it is, build the link out
			and defer it until later on the page:*/
			if ($currentModuleName != $thisExample[modules][0])  {
				$relatedExamples .= "<li><a href='/yui/3/examples/".$thisExample[modules][0]."/$thisExample[key].html'>".$thisExample["name"]."</a> (included with examples for the <a href='/yui/3/".$thisExample[modules][0]."/index.html'>".$modules[$thisExample[modules][0]][name]."</a>)</li>\n";
			} else {
				echo "<li><a href='/yui/3/examples/".$thisExample[modules][0]."/$thisExample[key].html'>".$thisExample["name"]."</a></li>\n";
			}
		}
?>
            </ul>
        </div>
<?php
	} // end current examples

    /*output related examples:*/
	if($relatedExamples) {
?>
<div id="relatedexamples" class="mod box4">
    <div class="hd">
		<h4>Other YUI Examples That Make Use of the <?php echo $component; ?></h4>
    </div>
    <div class="bd">
        <ul><?php echo $relatedExamples; ?></ul>
    </div>
</div>
<?php
    }
}
?>	
