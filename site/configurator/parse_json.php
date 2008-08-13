#!/home/y/bin/php
<?php
#!/usr/bin/php

//This path may need to be changed
$gzip = '/usr/bin/gzip';

$builddir = '../../build/';

$loaderData = 'loader.json';
$str = file_get_contents($loaderData);
$loader = json_decode($str);

$apiData = 'raw.json';
$str = file_get_contents($apiData);
$api = json_decode($str);

//print_r($api);exit;

$out = new stdclass();

$submods = array();

$modules = $loader->data;

foreach ($modules as $mod => $config) {

    if (!isset($config->info)) {
        $config->info = new stdclass();
    }

    $config->info->name = strtolower($mod);
    if(isset($api->modules->$mod->description)) {
        $config->info->desc = $api->modules->$mod->description;
    } else {
        $config->info->desc = "";
    }

    if (!$config->path) {
        $config->path = $mod.'/'.$mod.'-min.js';
    }

    $path = $builddir.$config->path;

    if (!isset($config->sizes)) {
        $config->sizes = new stdclass();
    }
    if (is_file($path)) {
        /*
        $size = filesize($path);
        $dPath = str_replace('-min', '-debug', $path);
        $fPath = str_replace('-min', '', $path);   
        $config->sizes->min = $size;
        if (is_file($dPath)) {
            $config->sizes->debug = filesize($dPath);
        }
        if (is_file($fPath)) {
            $config->sizes->raw = filesize($fPath);
        }
        */
        getFileSizes($config, $path);
    }

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
}
/*
foreach($modules as $mod => $config) {
//    if (!isset($modules->$mod->isSubmod)) {
        $out->$mod = $modules->$mod;
//    }
    if (isset($config->submodules)) {
        foreach($config->submodules as $submod => $submodConfig) {
            if ($modules->$submod) {
                $config->submodules->$submod = $modules->$submod;
                
            }
        }
     }
}
*/
// print_r($data);exit;


//print_r($data2);exit;
/*
foreach ($data2->modules as  $name => $value) {
    $mod = strtolower($name);
    if (!$outData->$mod) {
        $outData->$mod = new stdclass();
    }
    $subs = new stdclass();
    $hasSub = false;
    foreach ($value->submodules as $k => $v) {
        $subs->$v = new stdclass();
        if ($data->data->$v) {
            $hasSub = true;
            $subs->$v = $data->data->$v;
        }
    }
    $outData->$mod->submodules = $subs;

    //echo('['.$mod.'] Sub Found: '.(($hasSub) ? 'true' : 'false')."\n");
    //print_r($data->data->$mod);
    if (!$hasSub && $data->data->$mod) {
        //$outData->$mod->info = $data->data->$mod;
        foreach ($data->data->$mod as $k1 => $v1) {
            $outData->$mod->$k1 = $v1;
        }
        //print_r($outData->$mod);
    }

}
*/

$out = json_encode($modules);

$fp = fopen('./data.js', 'w');
fwrite($fp, 'var configData = '.$out.';');
fclose($fp);

//print_r($data);

function PrettySize($size) {
    if ($size == 'na') { 
        $mysize = '<i>unknown</i>';
    } else {
        $gb = 1024*1024*1024;
        $mb = 1024*1024;
        if ($size > $gb) {
            $mysize = sprintf ("%01.2f",$size/$gb) . " GB";
        } elseif ($size > $mb) {
            $mysize = sprintf ("%01.2f",$size/$mb) . " MB";
        } elseif ( $size >= 1024 ) {
            $mysize = sprintf ("%01.2f",$size/1024) . " Kb";
        } else {
            $mysize = $size . " bytes";
        }       
    }
    return $mysize;
}

function getFileSizes($config, $path) {
    global $gzip;
    if (!is_dir('./tmp')) {
        mkdir('./tmp');
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
