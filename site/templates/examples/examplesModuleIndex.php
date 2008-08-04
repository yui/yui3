<?php
include("/home/y/share/pear/Yahoo/YUI/loader.php");
require("data/examplesInfo.php");
if (!isset($currentModuleName)) {
	$currentModuleName = $_GET['module'];
};

if($modules[$currentModuleName]) {
	$currentModule = $modules[$currentModuleName];
	
	$title="YUI Library Examples: ".$currentModule["name"];
	$section="examples";
	$component=$currentModule[name];
	$highlightSyntax = false;
	$releasenotes = false;
	include("../../inc/header.inc");

?>

<div id="yui-main">
	<div class="yui-b">
	  <div class="yui-ge">
		  <div class="yui-u first">
<h1 class="firstContent"><?php echo $currentModule[name]; ?>: Examples</h1>


<?php

/*if the current module has a description field, output that here.*/
if ($currentModule[description]) {
	echo $currentModule[description];
}

/*loop through the examples for this module*/
$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
if ($aCurrentExamples) {
	echo "<ul>";
	$relatedExamples = "";
	foreach($aCurrentExamples as $key=>$thisExample) {
		/*This may be a cross-listed example.  If it is, build the link out
		and defer it until later on the page:*/
		if ($currentModuleName != $thisExample[modules][0])  {
			$relatedExamples .= "<li><a href='/yui/examples/".$thisExample[modules][0]."/".$key.".html'>".$thisExample["name"]."</a> (included with examples for ".$modules[$thisExample[modules][0]][name].")</li>";
		} else {
			echo "<li><a href='".$key.".html'>".$thisExample[name]."</a>: ".$thisExample[description]."</li>";
		}
	}
}
?>
</ul>

<?php
/*output related examples:*/
	if($relatedExamples) {
		echo "<h2 id='relatedExamples'>Other YUI Examples That Make Use of the ".$component."</h2><ul>".$relatedExamples."</ul>";
	}
?>		
			</div>
			<div class="yui-u">
				
				<div id="module" class="firstContent">
					<h3><? echo($currentModule[name]).":";?></h3>
					<ul>
						<!-- <li><a href="http://developer.yahoo.com/yui/<?php echo($currentModuleName);?>/">User's Guide</a></li> -->
						<li><a href="http://developer.yahoo.com/yui/docs/module_<?php echo($currentModuleName);?>.html">API Documentation</a></li>
						<!-- <li><a href="http://yuiblog.com/assets/pdf/cheatsheets/<?php echo($currentModuleName);?>.pdf">Cheat Sheet (pdf)</a></li> -->
					</ul>
				</div>
				
				
		  </div>
	</div></div>
</div>
<?php } 
	else { /*module not found*/
		echo "module not found";
	}
include "../../inc/side.inc";
include "../../inc/footer.inc";

?>

