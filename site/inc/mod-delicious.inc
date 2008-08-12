<div id="delicious" class="mod box4">
	<div class="hd">
		<h4>YUI's <?php echo $component;?> on del.icio.us</h4>
	</div>
	<?php 
	$thisURI="http://developer.yahoo.com/yui/3/".$section."/";
	require_once('../inc/badge.inc');
	?>
	<div class="bd">
		<?php require('../inc/badge-html.inc'); ?>
	</div>
</div>