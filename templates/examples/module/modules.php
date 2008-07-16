<?php
/*define constants to enforce errors on typos
in array labels */
define("description", "description");
define("modules", "modules");
define("name", "name");
define("src", "src");
define("sequence", "sequence");
define("requires", "requires");
define("highlightSyntax", "highlightSyntax");
define("logger", "logger");
define("loggerInclude", "loggerInclude");
define("newWindow", "newWindow");
define("type", "type");
define("bodyclass", "bodyclass");
define("key", "key");
define("cheatsheet", "cheatsheet");
/*******************************************/

/* $examples holds all metadata about the examples
for every component; the actual example text lives
in the filename for that component, under examples/modulename/src */
$examples = array();

/*text to appear on the Examples index page, or elsewhere
as needed*/
$examplesInfo["description"] = "Examples are provided for each YUI component.  Many examples are tutorial-based and inlcude step-by-step descriptions of how the example is put together; other examples are purely functional and are meant to illustrate an aspect or feature of a given component.  In all cases, you can view the source of the example and see exactly how it was written.";

/*The modules array contains the full roster of YUI modules*/
$modules = array();

/*Each module array contains a small amount of metadata, then
the bucket of examples*/
include($dataroot."examples.php");

/*validateModule: if the module has been defined,
returns that module array; if not, returns false.*/
function validateModule($moduleName, $aModules) {
	if($aModules[$moduleName]) {
		return $aModules[$moduleName];
	} else {
		return false;
	}
}

function seqComparator($a, $b) {
	if ($a["currentSequence"] == $b["currentSequence"]) {
      	return strcmp($a["name"], $b["name"]);
	}
	return ($a["currentSequence"] < $b["currentSequence"]) ? -1 : 1;
}

/*getExampleList: returns an array of example
arrays that correspond to the requested module,
sorted by sequence; includes examples that indicate multiple
module affiliations*/
function getExamplesByModule($sModuleName, $aExamples) {
	$moduleExamples = array();
	foreach($aExamples as $key=>$example) {
		if(in_array($sModuleName, $example["modules"])) {
			/*get the sequence number to use for this view;
			the sequencing is indexed by module, so the sequence
			array is parallel to the modules array; find out the index
			of the requested module in this example and then grab
			its corresponding sequence value.*/
			$example["currentSequence"] = $example[sequence][array_search($sModuleName, $example[modules])];
			/*Maintain symmetry of keys in between master array of 
			examples and the subset returned:*/
			$example["key"] = $key;
			$moduleExamples[$key] = $example;
		}
	}

	usort($moduleExamples, "seqComparator");
	/*foreach($moduleExamples[0] as $key=>$value) {
		echo "$key: $value \n\n";
	}*/
	return $moduleExamples;
}

/*getModulesByType: Returns all the module arrays for a given
type (e.g., widget, utility, css).*/
function getModulesByType($sType, $aModule) {
	$modulesByType = array();
	foreach ($aModule as $key=>$thisModule) {
		if ($thisModule[type] == $sType) {
			$modulesByType[$key] = $thisModule;
		}
	}

	// Obtain a list of columns for multisorting:
	$name = array();
	foreach ($modulesByType as $key => $row) {
	   $name[$key]  = $row[name];
	}	
	array_multisort($name, SORT_ASC, $modulesByType);
	return $modulesByType;
}
?>
