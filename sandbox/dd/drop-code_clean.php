
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>Drop Based Coding</title>

<style type="text/css">
/*margin and padding on body element
  can introduce errors in determining
  element position and are not recommended;
  we turn them off as a foundation for YUI
  CSS treatments. */
body {
	margin:0;
	padding:0;
}
</style>

<link type="text/css" rel="stylesheet" href="http://yui.yahooapis.com/3.0.0b1/build/cssfonts/fonts-min.css" />

<!--there is no custom header content for this example-->

</head>

<body class=" yui-skin-sam">

<h1>Drop Based Coding</h1>

<div class="exampleIntro">
	<p>This example shows how to use the Drop Target events to code your application.</p>
			
</div>

<!--BEGIN SOURCE CODE FOR EXAMPLE =============================== -->

<style>
    .drag {
        height: 50px;
        width: 50px;
        border: 1px solid black;
        background-color: #004C6D;
        color: white;
        cursor: move;
        float: left;
        margin: 4px;
        z-index: 2;
    }
    #play {
        border: 1px solid black;
        height: 300px;
        position: relative;
    }
    #drop {
        position: absolute;
        bottom: 5px;
        left: 5px;
        border: 1px solid black;
        background-color: #8DD5E7;
        height: 75px;
        width: 65%;
        z-index: 1;
    }
    #drop p {
        margin: 1em;
    }
    #drop p strong {
        font-weight: bold;
    }
    #drop.yui-dd-drop-over {
        background-color: #FFA928;
    }
</style>

<div id="play">
    <div id="drag1" class="drag">Drag #1</div>
    <div id="drag2" class="drag">Drag #2</div>
    <div id="drag3" class="drag">Drag #3</div>
    <div id="drag4" class="drag">Drag #4</div>
    <div id="drag5" class="drag">Drag #5</div>
    <div id="drop"></div>
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

<!--script src="http://yeshouseborn-lx.corp.yahoo.com/yui-clean/yui3/build/yui/yui-debug.js"></script-->


<script type="text/javascript" src="js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script>

var yConfig = {
    base: '../../build/',
    filter: 'DEBUG',
    //base: 'http://yeshouseborn-lx.corp.yahoo.com/yui-clean/yui3/build/',
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
YUI(yConfig).use('dd-drop', 'dd-constrain', function(Y) {
    Y.DD.DDM._noShim = true;
    Y.DD.DDM._debugShim = true;
    var data = {
        'drag1': { color: 'white', size: 'x-small', price: '$5.00' },
        'drag2': { color: 'blue', size: 'small', price: '$6.00' },
        'drag3': { color: 'green', size: 'medium', price: '$7.00' },
        'drag4': { color: 'red', size: 'large', price: '$10.00' },
        'drag5': { color: 'purple', size: 'x-large', price: '$15.00' }
    };
    var drags = Y.Node.all('#play div.drag');
    drags.each(function(v, k) {
        var thisData = {};
        Y.mix(thisData, data[v.get('id')]);
        var dd = new Y.DD.Drag({
            node: v,
            dragMode: 'intersect',
            data: thisData
        }).plug(Y.Plugin.DDConstrained, {
            constrain2node: '#play',
            stickY: true
        });
        dd.on('drag:end', function(e) {
            e.preventDefault();
        });
    });

    var drop = new Y.DD.Drop({
        node: '#drop'
    });
    drop.on('drop:hit', function(e) {
        var drag = e.drag;
        var data = drag.get('data');
        var out = ['id: ' + drag.get('node').get('id')];
        Y.each(data, function(v, k) {
            out[out.length] = k + ': ' + v;
        });
        var str = '<p><strong>Dropped</strong>: ' + out.join(', ') + '</p>';
        this.get('node').set('innerHTML', str);
    });
});
</script>

<!--END SOURCE CODE FOR EXAMPLE =============================== -->
</body>
</html>
