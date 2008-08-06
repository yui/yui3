#!/usr/local/bin/php
<?php

$file = 'loader.json';
$builddir = '../3.x/build/';

$str = file_get_contents($file);
$data = json_decode($str);

$outData = new stdclass();

foreach ($data->data as  $name => $value) {
    if (!$value->path) {
        $value->path = $name.'/'.$name.'-min.js';
    }
    $path = $builddir.$value->path;
            
    if (!$data->data->$name->sizes) {
        $data->data->$name->sizes = new stdclass();
    }
    $data->data->$name->info = new stdclass();
    $data->data->$name->info->name = strtolower($name);
    $data->data->$name->info->desc = 'None Given';
    if (is_file($path)) {
        $size = filesize($path);
        $dPath = str_replace('-min', '-debug', $path);
        $fPath = str_replace('-min', '', $path);   
        $value->sizes->min = $size;
        if (is_file($dPath)) {
            $value->sizes->debug = filesize($dPath);
        }
        if (is_file($fPath)) {
            $value->sizes->full = filesize($fPath);
        }

    }
}
//print_r($data);exit;

$file = 'raw.json';
$str = file_get_contents($file);
$data2 = json_decode($str);

//print_r($data2);exit;


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


$out = json_encode($outData);
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
?>
