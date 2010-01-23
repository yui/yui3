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
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>


<script type="text/javascript">
var yConfig = {
    base: '../../build/',
    filter: 'DEBUG',
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    },
    debug: false
};


YUI(yConfig).use('dd-drag', 'dd-ddm', 'dump', function(Y) {
    Y.DD.DDM._debugShim = true;

    //Add touchmove event to node
    Y.Node.DOM_EVENTS.touchmove = true;
    
    //Some Event over writing ?? Extend ??
    //This needs to be added to Event, this is a total hack!!
    Y._DOMEventFacade = Y.DOMEventFacade;
    Y.DOMEventFacade = function(ev, currentTarget, wrapper) {
        var e = new Y._DOMEventFacade(ev, currentTarget, wrapper);
        if (ev.touches) {
            e.touches = [];
            if (ev.touches[0]) {
                e.touches[0] = new Y.DOMEventFacade(ev.touches[0], currentTarget, wrapper);
            }
            if (ev.touches[1]) {
                e.touches[1] = new Y.DOMEventFacade(ev.touches[1], currentTarget, wrapper);
            }
        }
        return e;
    };
    
    dd = new Y.DD.Drag({ node: '#drag' });
    //So we know we are loaded, it's a little slow..
    dd.get('node').setStyle('backgroundColor', 'green');
    
    if (Y.UA.webkit && Y.UA.mobile) {
        dd.get('node').on('touchmove', function(e) {

            if(e.touches.length == 1) { // Only deal with one finger
                if (!dd.get('dragging')) {
                    dd.fire('drag:mouseDown', { ev: e.touches[0] });
                    dd._ev_md = e.touches[0];
                } else {
                    console.log('touch: [' + e.touches[0].pageX + ', ' + e.touches[0].pageY + ']');
                
                    Y.DD.DDM._move.apply(Y.DD.DDM, [e.touches[0]]);
                }
                e.preventDefault();
            }
            
        });
    }

});
</script>
</body>
</html>
