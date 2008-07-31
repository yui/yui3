
	<div id="ft">
        <p class="first">Copyright &copy; <?php print strftime("%Y"); ?> Yahoo! Inc. All rights reserved.</p>
        <p><a href="http://privacy.yahoo.com/privacy/us/devel/index.html">Privacy Policy</a> - 
            <a href="http://docs.yahoo.com/info/terms/">Terms of Service</a> - 
            <a href="http://docs.yahoo.com/info/copyright/copyright.html">Copyright Policy</a> - 
            <a href="http://careers.yahoo.com/">Job Openings</a></p>
	</div>
</div>

<?php
//include code for syntax-highlighting boxes, mostly found on landing and example pages
if ($highlightSyntax) {
?>
<script src="/yui/3/assets/dpSyntaxHighlighter.js"></script>
<script language="javascript"> 
dp.SyntaxHighlighter.HighlightAll('code'); 
</script>
<?php
}



//YUI 2.x Loader belongs on the page for all YDN-served pages.  For
//the configurator page ("articles/hosting"), this must always be
//the latest version (as opposed to the $yuiUseVersion, which may
//be one or two versions old.)
if (substr_count($_SERVER["REQUEST_URI"], "articles/hosting")) {
	echo '<script type="text/javascript" src="/yui/build/yuiloader-dom-event/yuiloader-dom-event.js?v='.$yuiCurrentVersion.'"></script>';
} else {
	echo '<script type="text/javascript" src="http://yui.yahooapis.com/combo?'.$yuiUseVersion.'/build/yuiloader-dom-event/yuiloader-dom-event.js&'.$yuiUseVersion.'/build/autocomplete/autocomplete-min.js"></script>';
}


if ($append) { //there is additional javascript for this page -- perhaps some use of YUI and/or custom js -- that is meant to be inserted at the last line of the file
	echo $append;
}
?>
<?php
if ($releasenotes) { 
?>
	<script type="text/javascript" src="/yui/docs/assets/yuiModuleMeta.js"></script>
	<script type="text/javascript" src="/yui/docs/assets/readme.js?v=2"></script>
<?php
}

//hide site search enhancement on QA during testing
if (!substr_count($_SERVER["REQUEST_URI"], "ydn.corp")) {?>
<script type="text/javascript" src="/yui/docs/assets/yuiSiteSearch.js?v=1"></script>
<?php
}
?>

<!--MyBlogLog instrumentation-->
<script type="text/javascript" src="http://track2.mybloglog.com/js/jsserv.php?mblID=2007020704011645"></script>

</body>

</html>

