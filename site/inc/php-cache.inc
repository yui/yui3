<?php
   /***************************************************************/
   /* PhpCache - a class for caching arbitrary data
   
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
   
   define('CACHE_PATH', '/home/y/share/htdocs/yui/tmp/');
   //define('CACHE_PATH', '/Sites/yui/temp/');
      
   class PhpCache {
      var $sFile;
      var $sFileLock;
      var $iCacheTime;
      var $oCacheObject;
      
      function PhpCache($sKey, $iCacheTime) {
         $this->sFile = CACHE_PATH.md5($sKey).".txt";
         $this->sFileLock = "$this->sFile.lock";
         $iCacheTime >= 10 ? $this->iCacheTime = $iCacheTime : $this->iCacheTime = 10;
      }
      
      function Check() {
         if (file_exists($this->sFileLock)) return true;
         return (file_exists($this->sFile) && ($this->iCacheTime == -1 || time() - filemtime($this->sFile) <= $this->iCacheTime));
      }
      
      function Exists() {
         return (file_exists($this->sFile) || file_exists($this->sFileLock));
      }
      
      function Set($vContents) {
         if (!file_exists($this->sFileLock)) {
            if (file_exists($this->sFile)) {
               copy($this->sFile, $this->sFileLock);
            }
            $oFile = fopen($this->sFile, 'w');
            fwrite($oFile, serialize($vContents));
            fclose($oFile);
            if (file_exists($this->sFileLock)) {
               unlink($this->sFileLock);
            }
            return true;
         }     
         return false;
      }
      
      function Get() {
         if (file_exists($this->sFileLock)) {
            return unserialize(file_get_contents($this->sFileLock));
         } else {
            return unserialize(file_get_contents($this->sFile));
         }
      }
      
      function ReValidate() {
         touch($this->sFile);
      }
   }
?>