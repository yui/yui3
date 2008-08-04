<?php
include("/home/y/share/pear/Yahoo/YUI/loader.php");
require("data/examplesInfo.php");

//name may come in from querystring for testing; otherwise it comes in from filestub in the module examples directory
if(!isset($name)) {
	$name = $_GET[name];
}

$log = (isset($_GET['log'])) ? $_GET['log'] : false; //if true, designates that the logger is being requested
$clean = (isset($_GET['clean'])) ? $_GET['clean'] : false; //if true, designates that the example should load if appropriate in a clean window with no site chrome

//prep arbitrary <body> element class; useful for skinned panels
//that render to the body directly
if($currentExample["bodyclass"]) {
	$bodyclass = $currentExample["bodyclass"];
} else {
	$bodyclass = "";
}

//@todo: add in a true error handling framework:
if(! $examples[$name]) {
	echo "<h1>Error: Example not found.</h1>";
	die; //I mean, "die please."  But politeness throws an error.
}

	$currentExample = $examples[$name];
	$currentModuleName = $examples[$name][modules][0];
	$currentModule = validateModule($currentModuleName, $modules);
	
	$title="YUI Library Examples: ".$currentModule["name"].": ".$examples[$name][name];
	$section=$currentModuleName;
	$component=$currentModule[name];
	//prep for syntax highlighting, which always gets deferred to the footer
	//based on the $highlightSyntax variable	
	$highlightSyntax = $examples[$name][highlightSyntax];
	$assetsDirectory = "/yui/examples/".$currentModuleName."/assets/";
	
	//explicitly turn off release notes functionality in header/footer, which
	//is for landing pages only
	$releasenotes = false;

	//instantiate loader:
	$loader = new YAHOO_util_Loader();

	//fork for "full" or "clean" template
	if(($clean=="true") && ($currentExample["newWindow"] == "default")) {
		foreach ($currentExample["requires"] as $requirement) {
	    	$loader->load($requirement);
		}
		//clean requested and permitted; include this, and do nothing else:
		include ("example_clean.php");
	} else {
		//in-context example template:
		
		//include header
		include("../../inc/header.inc");
		
		//We use Dom and Button as part of the template
		$loader->load("dom", "button");
		
		//Automatically switch off the logger if this example is
		//supposed to load in a new window:
		if($currentExample["newWindow"] == "require") {	
			$currentExample["loggerInclude"] = "suppress";
		}
		
		//If logging is requested, use -debug versions of all files.
		//check if there is a loggerInclude="require" override in the module
		//metatdata; if there is, we require logger regardless of the
		//querystring value.
		if($currentExample["loggerInclude"] == "require") {
			$log = "true";
		}
		if($log=="true") {
			$loader->load("logger");
			$loader->target = $yui_load_manager->DEBUG;
			echo "<!--loading debug file versions to enable loader output-->";
		}
		//Now that Logger is loaded, load all necessary tags for this example; write to the doc
		//in header so that examples can be included inline.
		foreach ($examples[$name]["requires"] as $requirement) {
			$loader->load($requirement);
		}		
		//Reset, fonts and grids come in via yui.css; tell loader not to load them again:
		$loader->setLoaded("fonts","reset","grids");
		echo ($loader->tags());
		//Note: Logger output will be filtered off by script in the footer for all components
		//not explicitly identified in the => logger metadata for this
		//example.
	?>
	
	<div id="yui-main">
		<div class="yui-b">
		  <div class="yui-ge">
			  <div class="yui-u first example">
	
	<div class="promo">
	<h1><?= $currentModule[name].": ".$examples[$name][name]?></h1>
	
	<div class="exampleIntro">
	<?php 
	$filename = "src/".$currentModuleName."/".$name."_intro.php";
	include($filename);
	?>			
	</div>	
					
	<div class="example-container module <?php
	//add newWindow class if new window is required
	if($currentExample["newWindow"] == "require") {
		echo ' newWindow';
	}?>">
	<?php
	/*if the example's newWindow property is "default", that means
	it can load in a new window at the user's discretion; in that case
	we show a button link to launch the page in a clean new window.*/
	if($currentExample["newWindow"] == "default") {
	$url = $name.".html?clean=true";
?>		<div class="hd">
			<p class="newWindowButton"><span id="newWindowLink"><span class="first-child"><a href="<?php echo($url);?>" target="_blank">View example in new window.</a></span></span>		
		</div><?php
	}
	
		?>
		<div class="bd">
	
	<?php
	/*show source code inline for normal examples; if the newWindow
	property for this example is "require", then only display the link
	to pop-up the example in a new window; self-contained examples
	will have a _source.html file in the same directory and that file
	will have full html structure.*/
		if($currentExample["newWindow"] == "require") {
	?>
	<p class="newWindowButton"><span id="newWindowLink"><span class="first-child"><a href="<?php echo $name.'_source.html' ?>" target="_blank">View example in new window.</a></span></span>		
	
	<?php
		} else { //show inline example
	?>
	
	<!--BEGIN SOURCE CODE FOR EXAMPLE =============================== -->
	
	<?php 
	$filename = "src/".$currentModuleName."/".$name."_source.php";
	include($filename);
	?>
	
	<!--END SOURCE CODE FOR EXAMPLE =============================== -->
	
	<?php
		} //end conditional on suppressing inline example
	?>
	
		</div>
		
	
	</div>			
	</div>
		
	<?php 
	$filename =  "src/".$currentModuleName."/".$name."_description.php";
	include($filename);
	?>
				</div>
				<div class="yui-u">
	<?php 
	
	
	
	
	/*Logger can be suppressed entirely if loggerInclude
	is set to "suppress"; wrap entire logger section in 
	conditional:*/
	if($currentExample["loggerInclude"]!="suppress") {?>
					<div id="loggerModule">
						<h3 class="firstContent">YUI Logger Output:</h3>
	<?php
	if($log=="true") {
		$url = $name.".html";
	?>
							<div id="loggerDiv"></div>
	<?php
	//suppress this if logger is required for this example:
	if($currentExample["loggerInclude"]!="require") { 
	?>						<div id="loggerGloss">
								<p><strong>Note:</strong> You are viewing this example in debug mode with logging enabled.  This can significantly slow performance.</p>
	
								<p class="loggerButton"><span id="loggerLink"><span class="first-child"><a href="<?php echo($url);?>">Reload with logging<br />and debugging disabled.</a></span></span></p>
							</div>
	<?php
	}
	
	} else {
		$url = $name.".html?log=true";
	?>
							<div id="loggerGloss"><p><strong>Note:</strong> Logging and debugging is currently turned off for this example.</p> 
							<p class="loggerButton"><span id="loggerLink"><span class="first-child"><a href="<?php echo($url);?>">Reload with logging<br />
	 and debugging enabled.</a></span></span></p></div>
	
	<?php } ?>
					</div>
	<?php
	} /*end conditional for logger suppression */
	?>				
				
					<div id="examples">
						<h3<?php
	/*apply firstContent class if logger was suppressed*/ 
	if($currentExample[loggerInclude]=="suppress") {
		echo " class='firstContent'";
	} 
	?>><? 
	echo($currentModule[name]);?> Examples:</h3>
	
						<div id="exampleToc">
							<ul>
								<?php
	$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
	if ($aCurrentExamples) {
		foreach($aCurrentExamples as $key=>$thisExample) {
			/*if the key value is the same as the current module, then this
			is the one we're looking at presently:*/
			$selected = "";
			if($key == $name) {
				$selected = " class='selected'";
			} 
			/*We may be including this example here because it is crosslisted
			from another component; if the linked example is in another component's
			roster, we note that parenthetically, as it will move the user
			to the other component's context.*/
			if ($currentModuleName != $thisExample[modules][0]) {
				$moduleSuffix =  " (included with examples for ".$modules[$thisExample[modules][0]][name].")";
			} else {
				$moduleSuffix = "";
			}
			echo "<li".$selected."><a href='/yui/examples/".$thisExample[modules][0]."/".$key.".html'>".$thisExample["name"].$moduleSuffix."</a></li>";
			
		}
	}
	?>
							</ul>
						</div>
					</div>
					
					<div id="module">
						<h3>More <? echo($currentModule[name])." Resources:";?></h3>
						<ul>
							<!-- <li><a href="http://developer.yahoo.com/yui/<?php echo($currentModuleName);?>/">User's Guide</a></li> -->
							<li><a href="http://developer.yahoo.com/yui/docs/module_<?php echo($currentModuleName);?>.html">API Documentation</a></li>
							<!-- <li><a href="http://yuiblog.com/assets/pdf/cheatsheets/<?php echo($currentModuleName);?>.pdf">Cheat Sheet (pdf)</a></li> -->
						</ul>
					</div>
					
	
			  </div>
		</div>
		
		</div>
	</div>
	<?php 
	//if Logger is in use for this example, include the YUIexamples.js script
	//and then disable Logger output for all components not in use.  We
	//do that by setting the array of components we *want* to log
	//prior to including yuiexamples.js.
	if(($log)&&($currentExample["logger"])&&($currentExample["loggerInclude"]!="suppress")) {//if truthy, this is the array of components we want to log
		//convert to js array literal:
		foreach($currentExample["logger"] as $value) {
			if(!isset($temp)) {$temp = "[";} else {$temp = $temp.",";}
			$temp = $temp."'".$value."'";
		}
		$temp = $temp."]";
		
	?>
	<?php
	}//end Logger inclusion
	
	//now, pass it logger sources to show, if applicable, and include
	//the helper scripts for the page:
	?><script>
	YAHOO.namespace("yui.examples");
	<?php if(isset($temp)) { ?>
	YAHOO.yui.examples.aLoggerSources = <?php echo $temp;?>;
	<?php } ?>
	</script>
	<script src="/yui/docs/assets/examples/YUIexamples.js"></script>
<?php
	include "../../inc/side.inc";
	include "../../inc/footer.inc";

//end conditional on showing clean or standard window:
}
?>
