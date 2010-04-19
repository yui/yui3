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
        .drag {
            height: 75px;
            width: 75px;
            border: 1px solid black;
            z-index: 1;
            text-align: center;
            /*overflow: hidden;*/
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x</a></h1></div>
    <div id="bd">
        <div class="drag">Drag Me</div>
        <div class="drag">Drag Me</div>
        <div class="drag">Drag Me</div>
        <div class="drag">Drag Me</div>
        <div class="drag">Drag Me</div>
        <div class="drag">Drag Me</div>
    </div>
    <div id="ft">&nbsp;</div>
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

YUI(yConfig).use('dd-ddm', 'dd-drag', 'dd-proxy', 'dd-constrain', 'yui-throttle', 'dd-drop', function(Y) {
    
    Y.all('#bd div').each(function(node) {
        var drag = new Y.DD.Drag({ node: node, target: true });
        drag.on('drag:start', function() {
            console.log('Drag events WORKING - target drag:start');
        });

        drag.on('drag:enter', function() {
            console.log('Drop events NOT WORKING - target drag:enter');
        });
    });

});
</script>
</body>
</html>
