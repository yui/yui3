<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <link rel="stylesheet" type="text/css" href="../yui-dev/build/reset-fonts-grids/reset-fonts-grids.css"> 
        <link rel="stylesheet" type="text/css" href="../yui-dev/build/assets/skins/sam/logger.css"> 
    <link rel="stylesheet" href="../css/davglass.css" type="text/css">
    <!--link rel="stylesheet" type="text/css" href="dd.css"-->
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #davdoc {
            min-height: 2000px;
        }
        #drag, #drag2, #drag3, #drag4, #drag5, #drag6, #drag7, .drop {
            height: 175px;
            width: 175px;
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
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x</a></h1></div>
    <div id="bd">
        <div id="drag"><h2><strong>Drag</strong> Me</h2></div>

    </div>
    <div id="ft">&nbsp;</div>
</div>
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.1/build/yahoo-dom-event/yahoo-dom-event.js"></script> 
    <script type="text/javascript" src="../3.x/build/yui/yui.js?bust=<?php echo(mktime()); ?>"></script>

    <!-- needed until built into a module -->
    <!--script type="text/javascript" src="http://greatniece-lx.corp.yahoo.com/YuiWip/yui3x/build/attribute/attribute.js?bust=<?php echo(mktime()); ?>"></script-->
    <script type="text/javascript" src="../3.x/build/attribute/attribute.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../3.x/build/base/base.js?bust=<?php echo(mktime()); ?>"></script>

    <!-- needed until new node.js is built into yui.js -->
    <script type="text/javascript" src="../3.x/build/dom/dom.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../3.x/build/node/node.js?bust=<?php echo(mktime()); ?>"></script>

    <script type="text/javascript" src="../3.x/build/animation/animation.js?bust=<?php echo(mktime()); ?>"></script>



    <script type="text/javascript" src="ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="ddm.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="drag.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    },
    debug: false
};


var Y = new YUI(yConfig).use('dd-drag', 'dd-ddm', 'dump', function(Y) {
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
    
    if (Y.UA.webkit && Y.UA.mobile) {
        dd.get('node').on('touchmove', function(e) {
            if(e.touches.length == 1) { // Only deal with one finger
                if (!dd.get('dragging')) {
                    Y.DD.DDM._noShim = true;
                    dd._setStartPosition(dd.get('node').getXY());
                    Y.DD.DDM.activeDrag = dd;
                    dd.start();
                }
                var touch = e.touches[0]; // Get the information for finger #1
                var ev = new Y.Event.Facade(touch);
                ///console.log(Y.Lang.dump(ev));
                dd._dragThreshMet = true;
                Y.DD.DDM.activeDrag = dd;
                Y.DD.DDM._move.apply(Y.DD.DDM, [ev]);
                e.preventDefault();
            }
            
        });
    }


    Y.Node.get('document').on('keypress', function(e) {
        if ((e.keyCode === 27) || (e.charCode === 27)) {
            if (Y.DD.DDM.activeDrag) {
                console.info('DD is dragging, stop it..');
                Y.DD.DDM.activeDrag.stopDrag();
            }
        }
    });
    
        
  
});
</script>
</body>
</html>
