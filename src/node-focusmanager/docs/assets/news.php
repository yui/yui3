<?php

	function getFeed($sFeed) {

		$params = array(
			"q"	=> ('select title,link from rss where url="http://rss.news.yahoo.com/rss/'.$sFeed.'"'),
			"format" => "json"
		);

		$encoded_params = array();

		foreach ($params as $k => $v) {
			$encoded_params[] = urlencode($k)."=".urlencode($v);
		}

		$url = "http://query.yahooapis.com/v1/public/yql?".implode("&", $encoded_params);

	    $ch = curl_init();
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    $rsp = curl_exec($ch);
	    curl_close($ch);

		if ($rsp !== false) {

			$rsp_obj = json_decode($rsp, true);

			$results = $rsp_obj["query"]["results"]["item"];

			$list = ""; // HTML output

			$nResults = count($results);
			
			if ($nResults > 10) {
				$nResults = 9;
			}
				
			for ($i = 0; $i<= $nResults; $i++) {
				
				$result = $results[$i];

				$list.= <<< END_OF_HTML
				<li>
				    <a href="{$result["link"]}"><q>{$result["title"]}</q></a>
				</li>
END_OF_HTML;

			}

			return ("<ul>" . $list . "</ul>");

		}

	}

?>
