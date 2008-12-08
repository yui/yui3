#!/home/y/bin/php
<?php
#!/usr/bin/php

//This path may need to be changed
$gzip = '/bin/gzip';
$builddir = '../../build/';

define("UNKNOWN_CAT", "other");
define("UNKNOWN_DESC", "");
define("UNKNOWN_NAME", "");


$loaderData = 'loader.json';
$str = file_get_contents($loaderData);
$loader = json_decode($str);

$apiData = 'raw.json';
$str = file_get_contents($apiData);
$api = json_decode($str);

$manualData = 'manual.json';
$str = file_get_contents($manualData);
$manual = json_decode($str);

// print_r($manual);exit;

$out = new stdclass();
$out->modules = new stdclass();
$out->categories = $manual->categories;

$modules = $loader->data;

foreach ($modules as $mod => $config) {
    // Setup submodule structure, and mark submodules with
    // isSubMod flag.
    if (isset($config->submodules)) {
        foreach($config->submodules as $submod => $subConfig) {
            if (!isset($modules->$submod)) {
                $modules->$submod = $subConfig;
            }
            $modules->$submod->isSubMod = true;
            if (isset($api->modules->$mod->subdata->$submod->description)) {
                if (!isset($modules->$submod->info)) {
                    $modules->$submod->info = new stdclass();
                }
                $modules->$submod->info->desc = $api->modules->$mod->subdata->$submod->description;
            }
        }
    }

    if (isset($config->plugins)) {
        foreach($config->plugins as $plugin => $pluginConfig) {
            if (!isset($modules->$plugin)) {
                $modules->$plugin = $pluginConfig;
            }
            $modules->$plugin->isPlugin = true;
        }
    }
}

foreach ($modules as $mod => $config) {

    if (!isset($config->info)) {
        $config->info = new stdclass();
    }

    // Pick up Description from manual.json or api.json
    if (isset($manual->modules->$mod->description)) {
        $config->info->desc = $manual->modules->$mod->description;
    } else if(isset($api->modules->$mod->description)) {
        $config->info->desc = $api->modules->$mod->description;
    } else {
        $config->info->desc = UNKNOWN_DESC;
    }

    // Pick up Category from manual.json or api.json
    if (isset($manual->modules->$mod->cat)) {
        $config->info->cat = $manual->modules->$mod->cat;
    } else if(isset($api->modules->$mod->cat)) {
        $config->info->cat = $api->modules->$mod->cat;
    } else {
        $config->info->cat = UNKNOWN_CAT;
    }

    // Pick up canonical name from manual.json or api.json,
    // else fall back on module id
    if (isset($manual->modules->$mod->name)) {
        $config->info->name = $manual->modules->$mod->name;
    } else if(isset($api->modules->$mod->name)) {
        $config->info->name = $api->modules->$mod->name;
    } else {
        $config->info->name = strtolower($mod);
    }

    // Calculate file sizes
    if (!$config->path) {
        $config->path = $mod.'/'.$mod.'-min.js';
    }

    $path = $builddir.$config->path;

    if (!isset($config->sizes)) {
        $config->sizes = new stdclass();
    }

    if (is_file($path)) {
        getFileSizes($config, $path);
    }

    // Setup submodule structure, and mark submodules with
    // isSubMod flag.
    /*
    if (isset($config->submodules)) {
        foreach($config->submodules as $submod => $config) {
            if (!isset($modules->$submod)) {
                $modules->$submod = new stdclass();
            }
            $modules->$submod->isSubMod = true;
            if (isset($api->modules->$mod->subdata->$submod->description)) {
                if (!isset($modules->$submod->info)) {
                    $modules->$submod->info = new stdclass();
                }
                $modules->$submod->info->desc = $api->modules->$mod->subdata->$submod->description;
            }
        }
    }
    */

    // YUI submodule hack
    if ($mod == "get" || $mod == "loader") {
        $config->info->desc = $api->modules->yui->subdata->$mod->description;
    }
}

$out->modules = $modules;

$outData = json_encode($out);

$fp = fopen('./data.js', 'w');
fwrite($fp, 'var configData = '.$outData.';');
fclose($fp);

function getFileSizes($config, $path) {
    global $gzip;
    if (!is_dir('./tmp')) {
        mkdir('./tmp', 0755);
    }
    $fileName = pathinfo($path);
    $size = filesize($path);
    copy($path, './tmp/'.$fileName['basename']);
    system($gzip.' ./tmp/'.$fileName['basename']);
    $gzSize = filesize('./tmp/'.$fileName['basename'].'.gz');
    unlink('./tmp/'.$fileName['basename'].'.gz');


    $dPath = str_replace('-min', '-debug', $path);
    $fPath = str_replace('-min', '', $path);   
    $config->sizes->min = $size;
    $config->sizes->mingz = $gzSize;
    if (is_file($dPath)) {
        $dFileName = pathinfo($path);
        copy($dPath, './tmp/'.$dFileName['basename']);
        $config->sizes->debug = filesize($dPath);
        system($gzip.' ./tmp/'.$dFileName['basename']);
        $gzSize = filesize('./tmp/'.$dFileName['basename'].'.gz');
        $config->sizes->debuggz = $gzSize;
        unlink('./tmp/'.$dFileName['basename'].'.gz');
    }
    if (is_file($fPath)) {
        $fFileName = pathinfo($path);
        copy($fPath, './tmp/'.$fFileName['basename']);
        $config->sizes->raw = filesize($fPath);
        system($gzip.' ./tmp/'.$fFileName['basename']);
        $gzSize = filesize('./tmp/'.$fFileName['basename'].'.gz');
        $config->sizes->rawgz = $gzSize;
        unlink('./tmp/'.$fFileName['basename'].'.gz');
    }
}
?>
