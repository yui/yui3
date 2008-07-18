<?php

if (!isset($docroot)) { $docroot=""; }
$dataroot = $docroot."examples/data/";

$developerHome = 'http://developer.yahoo.com/yui/3';

// TODO: Waiting for 3x PHP Loader, 2x Loader no longer needed in examples
$loaderPath = "/home/y/share/pear/Yahoo/YUI/loader.php";
$loggerAvailable = false;

$aTypes = array('css', 'core', 'utility', 'tool');

$oTypeNames = array('css'=>'YUI 3 CSS Foundation',
                    'utility'=>'YUI 3 Utilities', 
                    'core'=>'YUI 3 Core JavaScript', 
                    'tool'=>'YUI 3 Developer Tools');

//ydn indicates whether this is for the website or for distribution
if(!isset($ydn)) {
    $ydn = (isset($_GET['ydn'])) ? $_GET['ydn'] : false;
}

$externalLabel = ($ydn) ? "" : "(external)"; //used to stamp external links in dist

//for customizing build path during development:
if(!isset($buildpath)) {
    $buildpath = (isset($_GET['buildpath'])) ? $_GET['buildpath'] : false;
}

//The current YUI version, for building filepaths in docs:
if (!isset($yuiCurrentVersion)) {
    if (isset($_GET['v'])) {
        $yuiCurrentVersion = $_GET['v'];
    } else {
        $yuiCurrentVersion = "[yuiCurrentVersion]";
    }
}

function getLoaderIncludes($loader) {
    global $docroot;
    global $buildpath;

    if (is_file($docroot."inc/loaderSubstitute.php")) {
        ob_start();
        include $docroot."inc/loaderSubstitute.php";
        $contents = ob_get_contents();
        ob_end_clean();
        return $contents;
    } else {
        return "<!--Error including JS/CSS files-->";
    }

    // return $loader->tags();
}

require($docroot."examples/module/modules.php");
