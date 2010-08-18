<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" href="http://blog.davglass.com/files/yui/css/davglass.css" type="text/css">
    <style type="text/css" media="screen">
        #drag4, #drag5 {
            height: 75px;
            width: 75px;
            border: 1px solid black;
            z-index: 1;
            text-align: center;
            /*overflow: hidden;*/
        }
        #drag4 {
            position: absolute;
            top: 13px;
            left: 13px;
            height: 73px;
            width: 73px;
            background-color: green;
        }
        #drag4.yui3-dd-dragging {
            opacity: .5;

        }
        #drag4Cont {
            border: 1px solid black;
            position: relative;
            height: 400px;
            width: 400px;
            background-image: url( grid.png );
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x</a></h1></div>
    <div id="bd">
        <div id="drag4Cont">
            <div id="drag4">Drag Me IV</div>
            <div id="drag5">Drag Me V</div>
        </div>
    </div>
    <div id="ft">&nbsp;</div>
</div>
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/constrain.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    base: '../../build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        'yui': true,
        event: true,
        base: true,
        attribute: true,
        augment: true
    },
    throwFail: true,
    debug: false
};

YUI(yConfig).use('classnamemanager', 'event-synthetic', 'event-gestures', 'dd-ddm', 'dd-drag', 'dd-plugin', 'dd-proxy', 'dd-constrain', 'yui-throttle', 'json', function(Y1) {
    
    dd4 = new Y1.DD.Drag({
        node: '#drag4'
    });
    dd4.plug(Y1.Plugin.DDConstrained, {
        constrain: {
            top: 200,
            left: 100,
            right: 800,
            bottom: 700
        }
    });
    
    dd5 = new Y1.DD.Drag({
        node: '#drag5'
    });
    dd5.plug(Y1.Plugin.DDConstrained, {
        constrain: '#drag4Cont'
    });
    
});

</script>
</body>
</html>
