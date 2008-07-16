<?php
   /***************************************************************/
   /* Http - a class for making HTTP requests
   
      Software License Agreement (BSD License)
   
      Copyright (C) 2005-2007, Edward Eliot.
      All rights reserved.
      
      Redistribution and use in source and binary forms, with or without
      modification, are permitted provided that the following conditions are met:

         * Redistributions of source code must retain the above copyright
           notice, this list of conditions and the following disclaimer.
         * Redistributions in binary form must reproduce the above copyright
           notice, this list of conditions and the following disclaimer in the
           documentation and/or other materials provided with the distribution.
         * Neither the name of Edward Eliot nor the names of its contributors 
           may be used to endorse or promote products derived from this software 
           without specific prior written permission of Edward Eliot.

      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER AND CONTRIBUTORS "AS IS" AND ANY
      EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
      WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
      DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY
      DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
      (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
      LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
      ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
      (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
      SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   
      Last Updated:  7th January 2007                             */
   /***************************************************************/
   
   define('HTTP_TIMEOUT', 5); // how long to wait for a connection before aborting, CURL only
   define('MAX_HTTP_REQUEST_TIME', 7); // maximum time allowed for completing URL request before aborting, CURL only
   define('HTTP_USERAGENT', 'Mozilla/6.0 (Macintosh; U; PPC Mac OS X Mach-O; en-US; rv:2.0.0.0) Gecko/20061028 Firefox/3.0');
   
   class Http {
      var $iConnectTimeout;
      var $iRequestTimeout;
      var $sUserAgent;
      
      function Http($iConnectTimeout = HTTP_TIMEOUT, $iRequestTimeout = MAX_HTTP_REQUEST_TIME, $sUserAgent = HTTP_USERAGENT) {
         $this->iConnectTimeout = $iConnectTimeout;
         $this->iRequestTimeout = $iRequestTimeout;
      }
      
      function Get($sUrl) {
         // check for curl lib, use in preference to file_get_contents if available
         if (function_exists('curl_init')) {
            // initiate session
            $oCurl = curl_init($sUrl);
            // set options
            curl_setopt($oCurl, CURLOPT_CONNECTTIMEOUT, $this->iConnectTimeout);
            curl_setopt($oCurl, CURLOPT_TIMEOUT, $this->iRequestTimeout);
            curl_setopt($oCurl, CURLOPT_USERAGENT, $this->sUserAgent);
            curl_setopt($oCurl, CURLOPT_HEADER, false);
            curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, true);
            // request URL
            $sResult = curl_exec($oCurl);
            // close session
            curl_close($oCurl);
            return $sResult;
         } else {
            ini_set('user_agent', HTTP_USERAGENT);
            // fopen_wrappers need to be enabled for this to work - see http://www.php.net/manual/en/function.file-get-contents.php
            if ($sResult = @file_get_contents($sUrl)) {
               return $sResult;
            }
         }
         return false;
      }
   }
?>