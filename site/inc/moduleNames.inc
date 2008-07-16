<?php

// $aModuleNames = array("animation", "autocomplete", "button", "calendar", "charts", "colorpicker", "connection", "containercore", "container", "datasource", "datatable", "dom", "dragdrop", "editor", "element", "event", "get", "history", "imageloader", "json", "logger", "menu", "profiler", "selector", "simpleeditor", "slider", "tabview", "treeview", "yahoo", "yuiloader", "yuitest");

// $aComponentNames = array("Animation Utility", "AutoComplete Control", "Button Control", "Calendar Control", "Charts Control", "Color Picker Control", "Connection Manager", "Container Family Core (Module, Overlay)", "Container Family (Module, Overlay Panel, Tooltip, Dialog, SimpleDialog)", "DataSource Utility", "DataTable Control", "Dom Collection", "Drag &amp; Drop Utility", "Rich Text Editor", "Element Utility", "Event Utility", "Get Utility", "Browser History Manager", "ImageLoader Utility", "JSON Utility", "Logger Control", "Menu Control", "Profiler", "Selector Utility", "Simple version of the Rich Text Editor", "Slider Control", "TabView Control", "TreeView Control", "Yahoo Global Object", "YUI Loader Utility", "YUI Test Utility");

$mmap = array();
$mmap["animation"] = "Animation Utility";
$mmap["autocomplete"] = "AutoComplete Control";
$mmap["base"] = "Base CSS Style Foundation";
$mmap["button"] = "Button Control";
$mmap["calendar"] = "Calendar Control";
$mmap["charts"] = "Charts Control";
$mmap["colorpicker"] = "Color Picker Control";
$mmap["connection"] = "Connection Manager";
$mmap["cookie"] = "Cookie Utility";
$mmap["containercore"]  = "Container Family Core (Module, Overlay)";
$mmap["container"] = "Container Family (Module, Overlay Panel, Tooltip, Dialog, SimpleDialog)";
$mmap["datasource"] = "DataSource Utility";
$mmap["datatable"] = "DataTable Control";
$mmap["dom"] = "Dom Collection";
$mmap["dragdrop"] = "Drag &amp; Drop Utility";
$mmap["editor"] = "Rich Text Editor";
$mmap["element"] = "Element Utility";
$mmap["event"] = "Event Utility";
$mmap["fonts"] = "Fonts CSS";
$mmap["get"] = "Get Utility";
$mmap["grids"] = "Grids CSS Kit";
$mmap["history"] = "Browser History Manager";
$mmap["imageloader"] = "ImageLoader Utility";
$mmap["imagecropper"] = "ImageCropper Control";
$mmap["json"] = "JSON Utility";
$mmap["layout"] = "Layout Manager";
$mmap["logger"] = "Logger Control";
$mmap["menu"] = "Menu Control"; 
$mmap["profiler"] = "Profiler Tool";
$mmap["profilerviewer"] = "ProfilerViewer Control";
$mmap["resize"] = "Resize Utility";
$mmap["reset"] = "Reset CSS";
$mmap["selector"] = "Selector Utility";
$mmap["simpleeditor"] = "Simple Editor";
$mmap["slider"] = "Slider Control";
$mmap["tabview"] = "TabView Control";
$mmap["treeview"] = "TreeView Control";
$mmap["uploader"] = "Uploader Control";
$mmap["yahoo"] = "YAHOO Global Object";
$mmap["yuiloader"] = "YUI Loader Utility";
$mmap["yuitest"] = "YUI Test Tool";

$rmap = array();
$rmap["container"] = "containercore";
$rmap["editor"] = "simpleeditor";
$rmap["reset-fonts"] = "reset, fonts";
$rmap["reset-fonts-grids"] = "reset, fonts, grids, reset-fonts";
$rmap["utilities"] = "yahoo, event, dragdrop, animation, dom, connection, element, yahoo-dom-event";
$rmap["yahoo-dom-event"] = "yahoo, dom, event";
$rmap["yuiloader"] = "yahoo, get";
$rmap["yuiloader-dom-event"] = "yahoo, dom, event, get, yuiloader, yahoo-dom-event";

$moduleHomes = array();
$moduleHomes['containercore'] = 'container';
$moduleHomes['simpleeditor'] = 'editor';


# array_multisort($aComponentNames, $aModuleNames);

$moduleNamesTable = "<table><thead><tr><th>YUI Component</th><th>Module Name</th></tr></thead><tbody>";

$keys = array_keys($mmap);

$i = 0;
foreach ($keys as $mname) {
	$moduleNamesTable .= "<tr";
	
	if ((($i++) % 2) > 0) {
		$moduleNamesTable .= " class='odd'";
	};

    $mhome = (isset($moduleHomes[$mname])) ? $moduleHomes[$mname] : $mname;
	
	$moduleNamesTable .= "><td><a href='http://developer.yahoo.com/yui/$mhome/'>$mmap[$mname]</a></td><td>$mname</td></tr>";
}

$moduleNamesTable .= "</tbody></table>";

$rollupNamesTable = "<table><thead><tr><th>YUI Rollup</th><th>Provides</th></tr></thead><tbody>";

$keys = array_keys($rmap);

$i = 0;
foreach ($keys as $rname) {
	$rollupNamesTable .= "<tr";
	
	if ((($i++) % 2) > 0) {
		$rollupNamesTable .= " class='odd'";
	};

	$rollupNamesTable .= "><td>$rname</td><td>$rmap[$rname]</td></tr>";
}

$rollupNamesTable .= "</tbody></table>";

?>
