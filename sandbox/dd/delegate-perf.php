<?php
$count = (($_GET['count']) ? $_GET['count'] : 500);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <!--link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"--> 
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        
        #demo, #demo2 {
            width: 300px;
            border: 1px solid black;
            float: left;
        }

        .demo .item {
            width: 150px;
            border: 2px solid black;
            background-color: #ccc;
            margin: 4px;
        }
        .demo li.item {
            list-style-type: circle;
        }
        .demo div.item {
            height: 50px;
            float: left;
        }
        #drop {
            border: 4px solid black;
            height: 200px;
            width: 300px;
            position: absolute;
            top: 200px;
            right: 10px;
        }
        .demo .yui-dd-drop-over {
            border: 2px solid green;
        }
        #drop.yui-dd-drop-over {
            border: 4px solid green;
        }

        .demo li.disabled {
            opacity: .5;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="demo" class="demo">
<h2>Delegate (<?php echo($count); ?>)</h2>
<ul>
<?php
foreach (range(1, $count) as $k) {
    echo('  <li class="item'.(($k % 2) ? ' disabled' : '').'">'.$k.' <strong>[Grab]</strong></li>'."\n");
}
?>
</ul>
</div>

<div id="demo2" class="demo">
<h2>Per Item (<?php echo($count); ?>)</h2>
<ul>
<?php
foreach (range(1, $count) as $k) {
    echo('  <li class="item'.(($k % 2) ? ' disabled' : '').'">'.$k.' <strong>[Grab]</strong></li>'."\n");
}
?>
</ul>
</div>


<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>


<script type="text/javascript" src="js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript" src="js/delegate.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    base: '../../build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    },
    throwFail: true,
    debug: false
};

YUI(yConfig).use('dd-ddm', 'dd-drag', 'dd-delegate', 'dd-plugin', 'event-mouseenter', 'yui-throttle', function(Y) {
    console.time('delegate');
    var del = new Y.DD.Delegate({
        container: '#demo',
        nodes: '.item',
        invalid: '.disabled',
        handles: ['strong'],
        bubbleTargets: false
    });
    console.timeEnd('delegate');

    console.time('per item');
    var lis = Y.all('#demo2 li');
    lis.plug(Y.Plugin.Drag, {
        handles: ['strong']
    });
    console.timeEnd('per item');

});

</script>
</body>
</html>
