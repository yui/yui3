<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
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

        #demo {
            border: 1px solid black;
            height: 400px;
        }
        #demo .item {
            height: 50px;
            width: 50px;
            border: 1px solid black;
            -webkit-border-radius: 4px;
            background-color: #ccc;
            float: left;
            margin: 5px;
            text-align: center;
        }
	</style>
</head>
<body class="yui-skin-sam">
<input type="button" value="Add <?php echo($count); ?> More Items" id="add"><br>

<div id="demo">
<?php
for ($i = 1; $i <= $count; $i++) {
    echo('<div class="item">Item #'.$i.'</div>'."\n");
}
?>
</div>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/attribute/attribute-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/base/base-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event/event-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event-custom/event-custom-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/oop/oop-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/dom/dom-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/dom/dom-screen-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/node/node-debug.js?bust=<?php echo(mktime()); ?>"></script>


<script type="text/javascript" src="../dd/js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/delegate.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript" src="js/sortable.js?bust=<?php echo(mktime()); ?>"></script>

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

YUI(yConfig).use('dd-ddm', 'dd-drag', 'dd-proxy', 'dd-drop', 'dd-delegate', 'dd-constrain', 'dd-drop-plugin', 'event-mouseenter', 'sortable', function(Y) {
    console.log(Y);
    
    //Y.DD.DDM._debugShim = true;

    var sel = new Y.Sortable({
        cont: '#demo',
        nodes: '.item',
        opacity: '.5',
        moveType: 'copy'
    });
    sel.plug(Y.Plugin.DDConstrained, {
        constrain2node: '#demo'
    });

    var count = <?php echo($count); ?>,
        inc = 1;
    
    Y.one('#add').on('click', function(e) {
        var node, demo = Y.one('#demo');

        for (var i = 1; i < count + 1; i++) {
            node = Y.Node.create('<div class="item">(' + inc + ':1) ' + i + '</div>');
            demo.append(node);
        }
        inc++;
        sel.sync();
    });

});

</script>
</body>
</html>
