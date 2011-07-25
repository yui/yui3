<?php

function getResource($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
}

$query = getenv('QUERY_STRING');
$url = "http://search.news.yahoo.com/rss?{$query}";

$response = getResource($url);

$xml = new SimpleXMLElement($response);

$titles = Array();
$links = Array();
$sources = Array();

$result = $xml->xpath('/rss/channel/item/title');
while(list( , $node) = each($result)) {
    array_push($titles, $node);
}

$result = $xml->xpath('/rss/channel/item/link');
while(list( , $node) = each($result)) {
    array_push($links, $node);
}

/*
$result = $xml->xpath('/rss/channel/item/link');
while(list( , $node) = each($titles)) {
    array_push($links, $node);
}
*/

$html = '<ul>';

for ($i = 0; $i < count($titles); $i++) {
    $html .= '<li><a href="' . $links[$i] . '">' . $titles[$i] . '</a></li>';
}

$html .= '</ul>';
echo $html;

?>
