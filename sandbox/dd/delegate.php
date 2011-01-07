<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop: Delegate</title>
    <!--link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"--> 
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }

        #demo {
            border: 1px solid black;
            width: 600px;
            height: 400px;
            margin: 3em;
            position: relative;
        }
        #demo .item {
            width: 150px;
            border: 2px solid black;
            background-color: #ccc;
            margin: 4px;
        }
        #demo li.item {
            list-style-type: circle;
        }
        #demo div.item {
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
        #demo .yui-dd-drop-over {
            border: 2px solid green;
        }
        #drop.yui-dd-drop-over {
            border: 4px solid green;
        }

        #demo li.disabled {
            font-style: italic;
        }
        .yui3-dd.draggable {
            background-color: blue;
        }
	</style>
</head>
<body class="yui-skin-sam">
<input type="button" value="Add <?php echo($count); ?> More Items" id="add"><br>

<div id="demo">
<ul>
<?php
foreach (range(1, $count) as $k) {
    echo('  <li class="item'.(($k % 2) ? ' disabled' : '').'">'.$k.' <strong>[Grab]</strong></li>'."\n");
}
?>
</ul>
<input id="IcantSelectAfterDnD" type="text" />
</div>

<div id="drop">Drop Here..</div>

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
<script type="text/javascript" src="js/drag-gestures.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    base: '../../build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        yui: true,
        get: true,
        loader: true,
        node: true,
        Selector: true,
        'dom-screen': true,
        event: true,
        base: true,
        attribute: true,
        augment: true
    },
    throwFail: true,
    debug: true
};

YUI(yConfig).use('dd-ddm', 'dd-drag', 'dd-proxy', 'dd-drop', 'dd-delegate', 'dd-drop-plugin', 'event-mouseenter', function(Y) {
    //console.log(Y);
    //Y.DD.DDM._debugShim = true;
    //Y.DD.DDM._useShim = false;

    Y.DD.DDM.on('drag:start', function(e) {
        console.log('DDM:start :: ', e);
    });
    Y.DD.DDM.on('drag:end', function(e) {
        console.log('DDM:end :: ', e);
    });

    var del = new Y.DD.Delegate({
        container: '#demo',
        nodes: '.item',
        target: true,
        invalid: '.disabled',
        handles: ['strong'],
        bubbleTargets: false
    });

    del.dd.plug(Y.Plugin.DDProxy, {
        cloneNode: true,
        moveOnEnd: false
    });

    del.on('drag:start', function(e) {
        this.get('lastNode').setStyle('zIndex', '');
        this.get('currentNode').setStyle('zIndex', '999');
    });
    del.on('drag:over', function(e) {
        var sel = e.currentTarget.get('container') + ' ' + e.currentTarget.get('nodes');
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

    var count = <?php echo($count); ?>,
        inc = 1;
    
    Y.one('#add').on('click', function(e) {
        var node, demo = Y.one('#demo ul');
        for (var i = 1; i < count + 1; i++) {
            node = Y.Node.create('<li class="item">(' + inc + ') ' + i + ' <strong>[GRAB]</strong></li>');
            demo.append(node);
        }
        inc++;
        del.syncTargets();
    });


    var drop = new Y.DD.Drop({
        node: '#drop',
        useShim: false
    });

    drop.on('drop:hit', function(e) {
        console.log(e);
    });

    localStorage.clear();
});

</script>
</body>
</html>
