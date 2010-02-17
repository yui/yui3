<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" href="http://blog.davglass.com/files/yui/css/davglass.css" type="text/css">
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #filho1, #filho2, #filho3, #filho4 {
            height: 50px;
            width: 200px;
            margin: 2em;
            background-color: yellow;
            border: 1px solid black;
            float: left;
        }
	</style>
</head>
<body class="yui-skin-sam">


<div id="wrapper">
    <div id="filho1" class="filho">Filho1 - useShim: false</div>
    <div id="filho2" class="filho">Filho2 - useShim: false</div>
    <div id="filho3" class="filho">Filho3 - useShim: true</div>
    <div id="filho4" class="filho">Filho4 - useShim: true</div>
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


<script type="text/javascript" src="js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
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

YUI(yConfig).use('dd-ddm', 'dd-drag', 'dd-drop', function(Y) {

    var over = function(e) {
        console.log(e.drag.get('node').get('id'), ' is over ', e.drop.get('node').get('id'));
    };

    new Y.DD.Drag({
        node: '#filho1',
        target: {
            useShim: false
        },
        on: {
            'drag:over': over
        }
    });

    new Y.DD.Drag({
        node: '#filho2',
        target: {
            useShim: false
        },
        on: {
            'drag:over': over
        }
    });

    new Y.DD.Drag({
        node: '#filho3',
        target: true,
        on: {
            'drag:over': over
        }
    });

    new Y.DD.Drag({
        node: '#filho4',
        target: true,
        on: {
            'drag:over': over
        }
    });

});
</script>
</body>
</html>
