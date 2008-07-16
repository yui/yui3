	</div><!--closes bd-->

	<div id="ft">
        <p class="first">Copyright &copy; <?php print strftime("%Y"); ?> Yahoo! Inc. All rights reserved.</p>
        <p><a href="http://privacy.yahoo.com/privacy/us/devel/index.html">Privacy Policy</a> - 
            <a href="http://docs.yahoo.com/info/terms/">Terms of Service</a> - 
            <a href="http://docs.yahoo.com/info/copyright/copyright.html">Copyright Policy</a> - 
            <a href="http://careers.yahoo.com/">Job Openings</a></p>
	</div>
</div>
<?php
if ($highlightSyntax) { /*include code for syntax-highlighting boxes, mostly found on landing and example pages*/
?>
<script src="<?php echo $docroot ?>assets/dpSyntaxHighlighter.js"></script>
<script language="javascript"> 
dp.SyntaxHighlighter.HighlightAll('code'); 
</script><?php
}

if ($append) { /*there is additional javascript for this page -- perhaps some use of YUI and/or custom js -- that is meant to be inserted at the last line of the file*/
echo $append;
}
?>

</body>
</html>
