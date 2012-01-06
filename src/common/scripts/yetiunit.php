#!/usr/bin/env php
<?php

$xml = simplexml_load_file('common/tests/unit.xml');

$urls = array();

foreach ($xml->tests->url as $k => $url) {
    $urls[] = $url;
}

echo('yeti '.implode(' ', $urls)."\n");
?>
