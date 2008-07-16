<?php
   require_once('json.inc');
   require_once('http.inc');
   require_once('php-cache.inc');

   //define('CACHE_PATH', '/home/y/share/htdocs/yui/tmp/');
  
   define('CACHE_TIME', 10000); 
   define('NUM_TAG_CLOUD_SIZES', 5);
   
   $bCachingAvailable = class_exists('PhpCache');
   echo("<!-- $bCachingAvailable -->");
   $sDeliciousUrl = urlencode($thisURI);
   echo "<!--$sDeliciousUrl-->";
   if ($bCachingAvailable) {
      $oDataCache = new PhpCache("delicious_badge_$sDeliciousUrl", CACHE_TIME);
   }
   
   if (!$bCachingAvailable || !$oDataCache->Check()) {
      $oHttp = new Http();
   	$oJSON = new Services_JSON();
      
      if (($sDeliciousStats = $oHttp->Get("http://badges.del.icio.us/feeds/json/url/data?url=$sDeliciousUrl")) && ($aDeliciousStats = $oJSON->decode($sDeliciousStats))) {
   	   $oDeliciousStats = $aDeliciousStats[0];
   	   $iMin = $iMax = 0;
   	   
   	   foreach ($oDeliciousStats->top_tags as $sCurrentTag => $iCurrentTotal) {
   	      $iMin ? $iMin = min($iMin, $iCurrentTotal) : $iMin = $iCurrentTotal;
   	      $iMax = max($iMax, $iCurrentTotal);
   	   }
   
   	   $oDeliciousStats->tag_cloud = array();
   
   	   foreach ($oDeliciousStats->top_tags as $sCurrentTag => $iCurrentTotal) {
   	      if ($iCurrentTotal - $iMin > 0) {
   	         $oDeliciousStats->tag_cloud[$sCurrentTag] = ceil((($iCurrentTotal - $iMin) / ($iMax - $iMin)) * NUM_TAG_CLOUD_SIZES);
   	      } else {
   	         $oDeliciousStats->tag_cloud[$sCurrentTag] = 1;
   	      }
   	   }
   	   
   	   if ($bCachingAvailable) {
            $oDataCache->Set($oDeliciousStats);
         }
      }
   } else {
      $oDeliciousStats = $oDataCache->Get();
   }
?>