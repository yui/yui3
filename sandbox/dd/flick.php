<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop - Flick</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" href="http://blog.davglass.com/files/yui/css/davglass.css" type="text/css">
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #davdoc {
            min-height: 2000px;
        }
        #drag, #drag2, #drag3, #drag4, #drag5, #drag6, #drag7, .drop {
            height: 75px;
            width: 75px;
            border: 1px solid black;
            z-index: 1;
            text-align: center;
            overflow: hidden;
        }
        #bd {
            position: relative;
        }
        .drop {
            border-width: 4px; 
            background-color: #ccc;
            height: 100px;
            width: 100px;
            float: left;
            margin: 5px;
        }
        #play {
            position: absolute;
            top: 50px;
            right: 100px;
            width: 500px;
            border: 3px solid black;
            /*height: 500px;
            overflow: auto;*/
        }
        #fixed {
            position: fixed;
            left: 485px;
            height: 100px;
            width: 200px;
            border: 1px solid black;
            background-color: #ccc;
        }
        #drag h2, #drag2 h2, #drag3 h2 {
            margin: 0;
            padding: 0;
            border: none;
        }
        #drag3 {
            position: relative;
        }
        #drag3 h2 {
            position: absolute;
            font-size: 85%;
            height: 25px;
            width: 25px;
            background-color: red;
            color: white;
        }
        #drag3 h2.one {
            top: 0;
            left: 0;
        }
        #drag3 h2.two {
            top: 0;
            right: 0;
        }
        #drag3 h2.three {
            bottom: 0;
            left: 0;
        }
        #drag3 h2.four {
            bottom: 0;
            right: 0;
        }
        #drag6 {
            height: 150px;
            width: 150px;
        }
        #drag4 {
            position: absolute;
            top: 13px;
            left: 13px;
            height: 73px;
            width: 73px;
            background-color: green;
        }
        #drag4.yui-dd-dragging {
            opacity: .5;

        }
        .yui-dd-proxy {
            background-color: red;
        }
        #drag7EL {
            position: absolute;
            display: none;
            height: 30px;
            width: 200px;
            background-color: green;
            color: white;
            font-weight: bold;
            border: 2px solid black;
            z-index: 999;
        }
        #drag4Cont {
            border: 1px solid black;
            position: relative;
            height: 400px;
            width: 400px;
            background-image: url( grid.png );
        }

        .yui-dd-drop-active {
            border-style: dotted;
        }
        .yui-dd-drop-active-valid {
            border-color: blue;
        }
        .yui-dd-drop-active-invalid {
            border-color: red;
        }
        .yui-dd-drop-over {
            border-color: green;
        }
        #drop_4 {
            position: relative;
            top: -50px;
            left: -10px;
        }
        #drop_8 {
            position: relative;
            top: -200px;
            left: 25px;
        }
        #drop_2 {
            position: relative;
            top: 20px;
            left: -195px;
        }
        #drop_6 {
            position: relative;
            top: -70px;
            left: -185px;
        }
        #drop_1 {
            position: relative;
            left: 275px;
            top: 10px;
        }
        #drop_5 {
            position: relative;
            left: 205px;
            top: -81px;
        }
        #drop_7 {
            position: relative;
            top: -61px;
            left: -10px;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="drag7EL">I'm a custom proxy</div>
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x - Flick</a></h1></div>
    <div id="bd">
        <div id="drag"><h2><strong>Drag</strong> Me</h2></div>

    </div>
    <div id="ft">&nbsp;</div>
</div>
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/attribute/attribute-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/base/base-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event/event-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/oop/oop-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/dom/dom-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/node/node-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/anim/anim-debug.js?bust=<?php echo(mktime()); ?>"></script>



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
    allowRollup: false,
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    },
    debug: false
};


var Y = new YUI(yConfig).use('dd-drag', 'dd-ddm', 'anim', function(Y) {
    //Y.DD.DDM._debugShim = true;

    var anim = null;
    
    dd = new Y.DD.Drag({
        node: '#drag',
        target: true,
        dragMode: 'intersect',
        //proxy: true,
        //dragMode: 'strict',
        data: {
            one: 'This is my data object',
            two: 'This is my data object',
            three: 'This is my data object'
        }
    });
    //}).addHandle('h2');

    dd.on('drag:start', function() {
        if (anim && anim.stop) {
            anim.stop();
        }
    });
    dd.on('drag:end', function() {
        var dragTime = (this._endTime - this._startTime);
        var movedXY = [(this.mouseXY[0] - this.startXY[0]), (this.mouseXY[1] - this.startXY[1])];

        if (movedXY[0] < 0) {
            //movedXY[0] = -(movedXY[0]);
        }
        if (movedXY[1] < 0) {
            //movedXY[1] = -(movedXY[1]);
        }
        var timePerPixelInfo = [(dragTime / movedXY[0]), (dragTime / movedXY[1])];
        var timePerPixel = timePerPixelInfo[0];
        if (timePerPixel > timePerPixelInfo[1]) {
            timePerPixel = timePerPixelInfo[1];
        }
        if (timePerPixel < 0) {
            timePerPixel = -(timePerPixel);
        }
        console.log(movedXY, timePerPixel);
        var top = parseInt(this.get('node').getStyle('top'), 10);
        var left = parseInt(this.get('node').getStyle('left'), 10);
        var t = movedXY[1] + top;
        var l = movedXY[0] + left;
        console.log(top, left, t, l, timePerPixel);

        console.log('drag:end :: ', this.lastXY, this.startXY);

        anim = new Y.Anim({
            node: this.get('node'),
            to: {
                top: t,
                left: l
            },
            duration: timePerPixel
        });
        anim.run();
    });


    Y.Node.get('document').on('keypress', function(e) {
        if ((e.keyCode === 27) || (e.charCode === 27)) {
            if (Y.DD.DDM.activeDrag) {
                console.info('DD is dragging, stop it..');
                Y.DD.DDM.activeDrag.stopDrag();
            }
            if (anim && anim.stop) {
                anim.stop();
            }
        }
    });
    
        
  
});
</script>
</body>
</html>
