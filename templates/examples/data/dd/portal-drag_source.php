<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>Portal Example</title>
    <link type="text/css" rel="stylesheet" href="../../../build/reset-fonts/reset-fonts.css" />

    <script type="text/javascript" src="../../../build/yui/yui-min.js"></script>
    <script type="text/javascript" src="../../../build/dom/dom-min.js"></script>
    <script type="text/javascript" src="../../../build/node/node-min.js"></script>
    <script type="text/javascript" src="../../../build/attribute/attribute-min.js"></script>
    <script type="text/javascript" src="../../../build/base/base-min.js"></script>
    <script type="text/javascript" src="../../../build/animation/animation-min.js"></script>
    <script type="text/javascript" src="../../../build/io/io-min.js"></script>
    <script type="text/javascript" src="../../../build/json/json-min.js"></script>
    <script type="text/javascript" src="../../../build/yuitest/yuitest-min.js"></script>
    <script type="text/javascript" src="../../../build/profiler/profiler-min.js"></script>
    <script type="text/javascript" src="../../../build/dd/dd-dragdrop-all.js"></script>
    <script type="text/javascript" src="../../../build/queue/queue-min.js"></script>

    <link rel="stylesheet" type="text/css" href="assets/portal.css"> 

<body class="yui-reset yui-fonts">

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

<script src="assets/portal.js"></script>
</body>
</html>
