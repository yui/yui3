<?php
$docroot = "../../"; //path to distribution's yui root
require($docroot."inc/common.php");
require($loader3x);

$externalLabel = ($ydn) ? "" : " (external)"; //used to stamp external links in dist

//name may come in from querystring for testing; otherwise it comes in from filestub in the module examples directory
if(!isset($name)) {
	$name = (isset($_GET['name'])) ? $_GET['name'] : "";
}

if(!isset($log)) {
	$log = (isset($_GET['log'])) ? $_GET['log'] : false; //if true, designates that the logger is being requested
    $log = $log && $loggerAvailable;
}

if(!isset($clean)) {
	$clean = (isset($_GET['clean'])) ? $_GET['clean'] : false; //if true, designates that the example should load if appropriate in a clean window with no site chrome
}

if(!isset($preview)) {
	$preview = (isset($_GET['preview'])) ? $_GET['preview'] : false; //if true, designates that the example should load in preview mode; this affects the asset path.
}

//create the $prepend var for later use
if(!isset($prepend)) {$prepend = "";}

//@todo: add in a true error handling framework:
if(! $examples[$name]) {
	echo "<h1>Error: Example not found.</h1>";
	die;
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
	
	//assets directory loads relative to the preview file in preview mode, and
	//relative to the actual example in the final build.
	if($preview=="true") {
		$assetsDirectory = "../".$currentModuleName."/assets/";
	} else {
		$assetsDirectory = "assets/";
	}

	//prep arbitrary <body> element class; useful for skinned panels
	//that render to the body directly
	if(isset($currentExample["bodyclass"])) {
		$bodyclass = $currentExample["bodyclass"];
	} else {
		$bodyclass = " yui-skin-sam";
	}
	
	//instantiate loader, then set the buildpath if a custom
	//buildpath is requested via the querystring:
	$loader = new YAHOO_util_Loader();
	
	//fork for "full" or "clean" template
	if(($clean=="true") && ($currentExample["newWindow"] == "default")) {
	
		//flag to signal we're in newWindowMode:
		$newWindowMode = true;
		
		//clean requested and permitted; include this, with dependencies:
		foreach ($examples[$name]["requires"] as $requirement) {
			$loader->load($requirement);
		}
		//if a buildPath has been sent in, use it; this logic assumes
		//no -debug for newWindow mode, which may not be a good assumption
		//@TODO: determine whether new windows should support -debug and
		//what to add to metadata to support that level of control.
		if($buildpath) {
			if ($ydn) {
				// preg_match('/\d+\.\d+\.\d+[^\/]*/', $yui_config->prodbase, $matches);
				// $yui_config->configLocalTarget($buildpath, false, $matches[0]); //false means no -debug
                $loader->base = $buildpath;
			} else {
				// $yui_config->configLocalTarget($buildpath, false); //false means no -debug
                $loader->base = $buildpath;
			}
			// $loader->target = $yui_load_manager->LOCAL;

		}

		include ("example_clean.php");
	} else {

	    //in-context template:
		//flag to signal we're in newWindowMode:
		$newWindowMode = false;

		//Automatically switch off the logger if this example is
		//supposed to load in a new window:
		if($currentExample["newWindow"] == "require") {	
			$currentExample["loggerInclude"] = "suppress";
		}

		//If logging is requested, use -debug versions of all files.
		//check if there is a loggerInclude="require" override in the module
		//metatdata; if there is, we require logger regardless of the
		//querystring value.
		if($currentExample["loggerInclude"] == "require" && $loggerAvailable) {
			$log = "true";
		}
		
		//determine whether to load debug versions.  If $log is true,
		//and there are any members of the logger metadata array for
		//this example, then we should load debug; otherwise, not so
		//much.
		if(($log)&&(sizeof($currentExample["logger"]) > 0)) {
			$loadDebug = true;
		} else {
			$loadDebug = false;
		}
		
		//if a buildPath has been sent in, use it:
		if($buildpath) {
			if ($ydn) {
				// preg_match('/\d+\.\d+\.\d+[^\/]*/', $yui_config->prodbase, $matches);
				// the boolean on the end determines whether to use debug versions when in localTarget mode;
				// $yui_config->configLocalTarget($buildpath, $loadDebug, $matches[0]);

                $loader->base = $buildpath;
			} else {
				// $yui_config->configLocalTarget($buildpath, $loadDebug);
                $loader->base = $buildpath;
			}

            if ($loadDebug) {
                $loader->filter = YUI_DEBUG;
            }

			// $loader->target = $yui_load_manager->LOCAL;
			
			// Workaround to get -min files : unset the targetFilter for LOCAL if
			// not debug...
			if ($log === false) {
				// unset($yui_config->common->targetFilters[$yui_load_manager->LOCAL]);
			}
			
		} else {
		//if not, at least turn on debug if that's required:
			if($log) {
				// $loader->target = $yui_load_manager->DEBUG;
				$loader->filter = YUI_DEBUG;
			}
		}

		//If we're using logger, then load it...
		if($log=="true") {
			$loader->load("logger");
			
			//...but specify exactly which debug versions we're using:
			if((isset($examples[$name][logger])) && (is_array($examples[$name][logger]))) {
				
				//list of module names can be derived from the keyset of $modules:
				$aModuleNames = array_keys($modules);
				array_push($aModuleNames, "datasource", "yahoo"); //add modules that have no examples; these don't appear in $module's keys
				
				//array of modulename = boolean pairs to send to $yui_config->configDebug();
				$configDebug = array();
				
				foreach ($examples[$name][logger] as $logSource) {
					//Only "enable" logging in Loader for YUI module sources, not 
					//custom, arbitrary logger sources that may be in use in an example:
					if(in_array($logSource, $aModuleNames)) {
						$configDebug[$logSource] = true;
					}
				}

				// $yui_config->configDebug($configDebug);

                $loader->filterList = $configDebug;

				//print_r($examples[$name][logger]);
				// print_r($configDebug);
			}
			
		}
			
		//Now that Logger is loaded, load all necessary tags for this example; write to the doc
		//in header so that examples can be included inline.  Added isset/is_array to accommodate
		//leaving off requires metadata for examples that require a new window.
		if((isset($examples[$name]["requires"])) && (is_array($examples[$name]["requires"]))) {
			foreach ($examples[$name]["requires"] as $requirement) {
				$aLoaded = array("fonts","reset","grids");
				//defend against reloading of fonts, reset, grids; setLoaded below not working:
				if(!in_array($requirement, $aLoaded)) {
					$loader->load($requirement);
				}
			}
		}

		//We use Dom and Button as part of the template:
		// $loader->load("yuiloader", "event", "dom", "button");
        // TODO: YUI 3x Loader
		$loader->load("yuiloader", "event", "dom");
		
		//Reset, fonts and grids come in via yui.css; tell loader not to load them again:
		//NOTE: This isn't working as of 7/7/07...defending against this in loader loop above, too.
		$loader->setLoaded("fonts","reset","grids");
		
		//mechanism for adding header content from within source file in templates;
		//add this optional file, examplename_customheader.php, in your examples dir
		//along with the other three files as needed.
		if(isset($currentModuleName) && isset($name)) {//header appears on some non-example pages, too
			$filename = $dataroot.$currentModuleName."/".$name."_customheader.php";
			if (file_exists($filename)) {

				$prepend .= "\n\n<!--begin custom header content for this example-->\n";
				$prepend .= file_get_contents($filename);
				$prepend .= "\n<!--end custom header content for this example-->\n\n";
				
			} else {
				$prepend .= "\n<!--there is no custom header content for this example-->\n\n";
			}
		}

		//set fork for YDN-deployable files:
		if($ydn) {
			//YDN PAGE VARIABLES AND HEADER INCLUDE
			$strHighlightSyntax = ($highlightSyntax) ? "true" : "false";
			echo '<?php
$prepend = \''.$loader->tags().str_replace("'", "\\'", $prepend).'\';
$section="examples";
$highlightSyntax = '.$strHighlightSyntax.';
$assetsDirectory = "'.$assetsDirectory.'";
$releasenotes = false;
$bodyclass = "'.$bodyclass.'";
$title = "'.str_replace('"', '\\"', $title).'";
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
			  <div class="yui-u first example">
	
	<div class="promo">
	<h1><?php echo $currentModule[name].": ".$examples[$name][name]?></h1>
	
	<div class="exampleIntro">
	<?php 
	$filename = $dataroot.$currentModuleName."/".$name."_intro.php";
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
	$url = $name."_clean.html";
?>		<div class="hd exampleHd">
			<p class="newWindowButton yui-skin-sam"><!--<span id="newWindowLinkx"><span class="first-child">--><a href="<?php echo($url);?>" target="_blank">View example in new window.</a><!--</span></span>-->		
		</div><?php
	}
	
		?>
		<div id="example-canvas" class="bd">
	
	<?php
	/*show source code inline for normal examples; if the newWindow
	property for this example is "require", then only display the link
	to pop-up the example in a new window; self-contained examples
	will have a _source.html file in the same directory and that file
	will have full html structure.*/
		if($currentExample["newWindow"] == "require") {
	?>
	<p class="newWindowButton yui-skin-sam"><span id="newWindowLink"><span class="first-child"><a href="<?php echo $name.'_source.html' ?>" target="_blank">View example in new window.</a></span></span>		
	
	<?php
		} else { //show inline example
	?>
	
	<!--BEGIN SOURCE CODE FOR EXAMPLE =============================== -->
	
	<?php 
	$filename = $dataroot.$currentModuleName."/".$name."_source.php";
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
	$filename =  $dataroot.$currentModuleName."/".$name."_description.php";
	include($filename);
	?>
				</div>
				<div class="yui-u">
	<?php 
	
	
	
	
	/*Logger can be suppressed entirely if loggerInclude
	is set to "suppress"; wrap entire logger section in 
	conditional:*/
	if($currentExample["loggerInclude"]!="suppress" && $loggerAvailable) {?>
					<div id="loggerModule" class="yui-skin-sam">
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
		$url = $name."_log.html";
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
	if($currentExample["loggerInclude"]=="suppress" || $loggerAvailable == false) {
		echo " class='firstContent'";
	} 
	?>><?php echo($currentModule[name]);?> Examples:</h3>
	
						<div id="exampleToc">
							<ul>
								<?php
	$aCurrentExamples = getExamplesByModule($currentModuleName, $examples);
	if ($aCurrentExamples) {
		foreach($aCurrentExamples as $key=>$thisExample) {
			/*if the key value is the same as the current module, then this
			is the one we're looking at presently:*/
			$selected = "";
			if($thisExample[key] == $name) {
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
			echo "<li".$selected."><a href='../".$thisExample[modules][0]."/$thisExample[key].html'>".$thisExample["name"].$moduleSuffix."</a></li>";
			
		}
	}
	?>
							</ul>
						</div>
					</div>
					
					<div id="module">
						<h3>More <?php echo($currentModule[name])." Resources:";?></h3>
						<ul>
							<li><a href="http://developer.yahoo.com/yui/<?php echo($currentModuleName);?>/">User's Guide</a><?php echo $externalLabel; ?></li>
<?php
/* Currently, all modules that are not of type=="css" have API documentation conforming to the same AdamDoc URL style:*/
if ($currentModule[type] != "css") {
?>
						<li><a href="<?php echo $docroot ?>docs/module_<?php echo($currentModuleName);?>.html">API Documentation</a></li>
<?php 
}
/* cheatsheet is indicated by $currentModule[cheatsheet] -- either true, false, or a string specifying the filename for this module's cheatsheet (e.g., if it isn't modulename.pdf) */

if($currentModule[cheatsheet]) {
	$chShFilename = (is_string($currentModule[cheatsheet])) ? $currentModule[cheatsheet] : $currentModuleName . ".pdf";
?>
                            
                            
							<li><a href="http://yuiblog.com/assets/pdf/cheatsheets/<?php echo($chShFilename);?>">Cheat Sheet PDF</a><?php echo $externalLabel; ?></li><?php

}
                         
						?></ul>
					</div>
			  </div>
		</div>
		
		</div>
	</div>

<?php

	if(!isset($append)) {$append = "";};

    // NOT INSTANTIATING 2.x BUTTONS/LOGGER
	// $append .= "\n\n<script src='".$docroot."assets/YUIexamples.js'></script>\n\n";

	if ($ydn) {
	
	echo '
	<?php 
	$append = "'.$append.'";
	include("'.$docroot.'inc/side.inc");
	include("'.$docroot.'inc/footer.inc");
	?>';
	
	} else {
	
		include ($docroot."inc/side.php"); 
		include ($docroot."inc/footer.php"); 
		
	}
}
?>
