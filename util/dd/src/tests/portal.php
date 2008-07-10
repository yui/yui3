<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop: Portal Example</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.5.1/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" type="text/css" href="portal.css">
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="doc3" class="yui-t7">
    <div id="hd">YUI: DragDrop: Portal Example</div>
    <div id="bd">
        <div id="play">
            <?php
            $rowCount = (($_GET['rows']) ? $_GET['rows'] : 3);
            $itemCount = (($_GET['items']) ? $_GET['items'] : 5);

            for ($c = 1; $c <= $rowCount; $c++) {
                echo('<ul id="list'.$c.'" class="list">'."\n");
                    for ($i = 1; $i <= $itemCount; $i++) {
                        echo('<li class="item">');
                        echo('  <div class="mod">');
                        echo('      <h2>Item Title #'.$c.'-'.$i.' <a href="#" class="min" title="minimize module"></a> <a href="#" class="close" title="close module"></a></h2>');
                        echo('  <div class="inner">');
                        echo('<ul>');
                        for ($e = 1; $e <= 5; $e++) {
                            echo('      <li>Item #'.$i.'-'.$e.'</li>');
                        }
                        echo('</ul>');
                        echo('  </div>');
                        echo('  </div>');
                        echo('</li>');
                    }
                echo('</ul>'."\n");
            }
            ?>
        </div>
    </div>
    <div id="ft">&nbsp;</div>
</div>
    <script type="text/javascript" src="../../../../build/yui/yui-min.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/attribute/attribute-min.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/base/base-min.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/dom/dom-min.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/node/node-min.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/animation/animation-min.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/dd/dd-dragdrop-all-min.js?bust=<?php echo(mktime()); ?>"></script>    

    <script type="text/javascript" src="portal.js?bust=<?php echo(mktime()); ?>"></script>
</body>
</html>
