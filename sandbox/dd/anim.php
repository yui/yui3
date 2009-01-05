<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop: Animated Drop</title>
    <link rel="stylesheet" type="text/css" href="../yui-dev/build/reset-fonts-grids/reset-fonts-grids.css"> 
        <link rel="stylesheet" type="text/css" href="../yui-dev/build/assets/skins/sam/logger.css"> 
    <link rel="stylesheet" href="../css/davglass.css" type="text/css">
    <!--link rel="stylesheet" type="text/css" href="dd.css"-->
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        .anim {
            position: relative;
            height: 50px;
            width: 100px;
            border: 1px solid black;
            background-color: #ccc;
            top: 100px;
        }
        #drag1 {
            height: 50px;
            width: 50px;
            border: 1px solid black;
            background-color: #ccc;
            cursor: move;
            z-index: 5;
        }
        #bd {
            position: relative;
        }
        #dock {
            height: 400px;
            width: 75px;
            background-color: #ccc;
            border: 1px solid black;
            position: absolute;
            top: 5px;
            right: 0px;

        }
        .anim.yui-dd-drop-over {
            background-color: green;
            color: white;
        }
        .anim.done {
            background-color: white;
        }
        #drag1.yui-dd-drag-over {
            opacity: .5;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x: Animated Drop</a></h1></div>
    <div id="bd">
        <div id="dock"></div>
        <div id="drag1">Drag #1</div>
        <div id="anim1" class="anim">Anim #1</div>
        <div id="anim2" class="anim">Anim #2</div>
        <div id="anim3" class="anim">Anim #3</div>
        <div id="anim4" class="anim">Anim #4</div>
        <div id="anim5" class="anim">Anim #5</div>
    </div>
    <div id="ft">&nbsp;</div>
</div>
    <script type="text/javascript" src="../3.x/build/yui/yui.js?bust=<?php echo(mktime()); ?>"></script>

    <!-- needed until built into a module -->
    <script type="text/javascript" src="../3.x/build/attribute/attribute.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../3.x/build/base/base.js?bust=<?php echo(mktime()); ?>"></script>

    <!-- needed until new node.js is built into yui.js -->
    <script type="text/javascript" src="../3.x/build/dom/dom.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../3.x/build/node/node.js?bust=<?php echo(mktime()); ?>"></script>

    <script type="text/javascript" src="../3.x/build/animation/animation.js?bust=<?php echo(mktime()); ?>"></script>



    <script type="text/javascript" src="ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="ddm.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="drag.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="drop.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    } 
};

var Y = new YUI(yConfig).use('dd-drop', 'animation', 'dd-plugin', 'dd-drop-plugin');

Y.on('event:ready', function() {
    //Y.DD.DDM._debugShim = true;

    var d = Y.Node.get('#drag1');
    d.plug(Y.Plugin.Drag, { /*dragMode: 'intersect'*/ });
    
    var anims = Y.Node.get('document').queryAll('#bd div.anim');
    Y.each(anims, function(v, k, items) {
        var a = items.item(k);
        a.plug(Y.Plugin.NodeFX);
        a.plug(Y.Plugin.Drop);

        a.fx.setAtts({
            from: {
                left: 0,
                from: 50
            },
            to: {
                left: function() {
                    var dW = Y.Node.get('#bd').get('offsetWidth');
                    var aW = a.get('offsetWidth');
                    return ((dW - aW) - 75); //Minus 75 for the dock
                },
                height: 100
            },
            iterations: 10,
            direction: 'alternate',
            duration: ((k * 2) + 1)
        });

        a.drop.on('drop:enter', function() {
            a.fx.pause();
        });
        a.drop.on('drop:exit', function() {
            a.fx.run();
        });
        a.drop.on('drop:hit', function() {
            a.fx.stop();
            a.fx.unsubscribeAll('tween');
            a.fx.setAtts({
                from: {
                    opacity: 1
                },
                to: {
                    height: 50,
                    width: 50,
                    left: function() {
                        var dW = Y.Node.get('#bd').get('offsetWidth');
                        return ((dW - 60)); //Minus 75 for the dock
                    },
                    top: 15,
                    opacity: .5
                },
                iterations: 1,
                duration: .5
            });
            a.fx.on('end', function() {
                this.get('node').addClass('done');
                a.drop.destroy();
            });
            a.fx.run();

        });

        a.fx.on('tween', function() {
            if (Y.DD.DDM.activeDrag) {
                a.drop.sizeShim();
                Y.Lang.later(0, a, function() {
                    this.drop._handleTargetOver();
                });
            }
        });

        a.fx.run();
    });
});

</script>
</body>
</html>
