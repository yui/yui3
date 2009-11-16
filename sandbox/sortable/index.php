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
            width: 600px;
            height: 400px;
        }
        #demo ul {
            border: 1px solid blue;
            width: 200px;
            float: left;
        }
        #demo .item {
            border: 2px solid black;
            background-color: #ccc;
            margin: 4px;
        }
        #demo li.item {
            width: 150px;
            list-style-type: circle;
        }
        #demo div.item {
            height: 50px;
            float: left;
            width: 50px;
        }
        #demo .yui-dd-drop-over {
            border: 2px solid green;
        }
	</style>
</head>
<body class="yui-skin-sam">
<input type="button" value="Add <?php echo($count); ?> More Items" id="add"><br>

<div id="demo">
<ul id="one">
<?php
foreach (range(1, $count) as $k) {
    echo('  <li class="item">'.$k.'</li>'."\n");
}
?>
</ul>
<ul id="two">
<?php
foreach (range(1, $count) as $k) {
    echo('  <li class="item">'.$k.'</li>'."\n");
}
?>
</ul>
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

YUI(yConfig).use('dd-ddm', 'dd-drag', 'dd-proxy', 'dd-drop', 'dd-delegate', 'dd-drop-plugin', 'event-mouseenter', 'sortable', function(Y) {
    console.log(Y);

    var del = new Y.Sortable({
        cont: '#demo',
        nodes: '.item'
    });
    
    /*
    var del = new Y.DD.Delegate({
        cont: '#demo',
        nodes: '.item',
        target: true
    });
    del.plugdd(Y.Plugin.DDProxy, {
        moveOnEnd: false
    });

    del.on('drag:start', function(e) {
        this.get('lastNode').setStyle('zIndex', '');
        this.get('currentNode').setStyle('zIndex', '999');
    });
    del.on('drag:over', function(e) {
        var sel = e.currentTarget.get('cont') + ' ' + e.currentTarget.get('nodes');
        if (e.drop.get('node').test(sel)) {
            Y.DD.DDM.swapNode(e.drag, e.drop);
        }
    });
    del.on('drag:end', function(e) {
        this.get('currentNode').setStyles({
            top: 0,
            left: 0
        });
    });
    //del.on('drag:drag', console.log);
    //console.log(del);
    */

    var count = <?php echo($count); ?>,
        inc = 1;
    
    Y.one('#add').on('click', function(e) {
        var node, demo = Y.one('#demo ul');
        for (var i = 1; i < count + 1; i++) {
            node = Y.Node.create('<li class="item">(' + inc + ') ' + i + '</li>');
            demo.append(node);
        }
        inc++;
        del.syncTargets();
    });

});

</script>
</body>
</html>
