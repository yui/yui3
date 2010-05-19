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
        #drag {
            height: 175px;
            width: 175px;
            border: 1px solid black;
            z-index: 1;
            text-align: center;
            overflow: hidden;
        }
        #drop {
            height: 175px;
            width: 500px;
            border: 1px solid black;
            background-color: red;
            position: absolute;
            top: 300px;
            right: 0px;
            font-weight: bold;
            font-size: 120%;
        }
        #drop.yui3-dd-drop-over {
            background-color: orange;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x</a></h1></div>
    <div id="bd">
        <div id="drag"><h2><strong>Drag</strong> Me</h2></div>
        <div id="drop">Drop here</div>
    </div>
    <div id="ft">&nbsp;</div>
</div>
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>


<script type="text/javascript">
var yConfig = {
    base: '../../build/',
    //filter: 'DEBUG',
    filter: 'RAW',
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    },
    debug: false
};


YUI(yConfig).use('dd-drag', 'dd-ddm', 'dd-drop', 'dump', 'dd-scroll', function(Y) {
    //Y.DD.DDM._debugShim = true;
    Y.DD.DDM._useShim = false;

    //Add touchmove event to node
    Y.Node.DOM_EVENTS.touchmove = true;
    Y.Node.DOM_EVENTS.touchend = true;
    Y.Node.DOM_EVENTS.touchstart = true;
    
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

    drop = new Y.DD.Drop({ node: '#drop' });
    drop.on('drop:hit', function() {
        drop.get('node').set('innerHTML', 'You Dropped on me!!!');
    });

    
    dd = new Y.DD.Drag({ node: '#drag', clickTimeThresh: 1 });
    dd.plug(Y.Plugin.DDWinScroll);
    //So we know we are loaded, it's a little slow..
    dd.get('node').setStyle('backgroundColor', 'green');
    dd.on('drag:start', function() {
        dd.get('node').setStyle('backgroundColor', 'blue');
    });
    dd.on('drag:end', function() {
        dd.get('node').setStyle('backgroundColor', 'green');
    });
    //console.log(dd.get('node').getXY());
    
    
    if (Y.UA.webkit && Y.UA.mobile) {
        dd.get('node').on('touchmove', function(e) {
            //console.log(dd.get('node').getXY());
            if(e.touches.length == 1) { // Only deal with one finger
                if (!dd.get('dragging')) {
                    //console.log('touch: [' + e.touches[0].pageX + ', ' + e.touches[0].pageY + ']');
                    dd.fire('drag:mouseDown', { ev: e.touches[0] });
                    e.preventDefault();
                }
            }
            
        });
        //Y.DD.DDM._pg.on('touchmove', function(e) {
        Y.one('doc').on('touchmove', function(e) {
            if (Y.DD.DDM.activeDrag) {
                if (e.touches.length == 1) { // Only deal with one finger
                    if (Y.DD.DDM.activeDrag) {
                        //console.log('DDM touch: [' + e.touches[0].pageX + ', ' + e.touches[0].pageY + ']');
                        Y.DD.DDM._move(e.touches[0]);
                    }
                }
            }
        });
        Y.one('doc').on('touchend', function(e) {
            //console.log('TOUCH END');
            if (Y.DD.DDM.activeDrag) {
                dd._handleMouseUp.apply(dd);
            }
        });
    }

});
</script>
</body>
</html>
