<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>Animated Drop Targets</title>
    <link rel="stylesheet" href="http://yui.yahooapis.com/2.5.2/build/reset-fonts-grids/reset-fonts-grids.css" type="text/css">

    <script type="text/javascript" src="<?php echo $buildDirectory ?>yui/yui-min.js"></script>
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        body {
            text-align: left;
        }
        .anim {
            position: relative;
            height: 50px;
            width: 100px;
            border: 1px solid black;
            background-color: #00B8BF;
            top: 100px;
        }
        #drag {
            height: 50px;
            width: 50px;
            border: 1px solid black;
            background-color: #004C6D;
            color: white;
            cursor: move;
            z-index: 5;
        }
        #dock {
            height: 600px;
            width: 75px;
            background-color: #D00050;
            border: 1px solid black;
            position: absolute;
            top: 5px;
            right: 0px;

        }
        .anim.yui-dd-drop-over {
            background-color: #EDFF9F;
        }
        .anim.done {
            background-color: white;
        }
        #drag1.yui-dd-drag-over {
            opacity: .5;
            filter: alpha(opacity=50);
        }
	</style>
    
<body class="yui-reset yui-fonts">
        <div id="dock"></div>
        <div id="drag">Drag #1</div>
        <div id="anim1" class="anim">Anim #1</div>
        <div id="anim2" class="anim">Anim #2</div>
        <div id="anim3" class="anim">Anim #3</div>
        <div id="anim4" class="anim">Anim #4</div>
        <div id="anim5" class="anim">Anim #5</div>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use('dd', 'anim', function(Y) {
    //Get the node #drag
    var d = Y.Node.get('#drag');
    d.plug(Y.Plugin.Drag, { dragMode: 'intersect' });
    
    //Get all the div's with the class anim
    var anims = Y.Node.all('div.anim');
    anims.each(function(v, k, items) {
        //Get a reference to the Node instance
        var a = v; 
        //Add the FX plugin
        a.plug(Y.Plugin.NodeFX);
        //Add the Drop plugin
        a.plug(Y.Plugin.Drop);

        //Set the attributes on the animation
        a.fx.setAtts({
            from: {
                left: 0
            },
            to: {
                curve: function() {
                    var points = [],
                        n = 10;

                    for (var i = 0; i < n; ++i) {
                        points.push([
                            Math.floor(Math.random()*Y.DOM.winWidth() - 60 - a.get('offsetWidth')),
                            Math.floor(Math.random()*Y.DOM.winHeight() - a.get('offsetHeight'))
                        ]);
                    }
                    return points;
                }
            },
            //Do the animation 20 times
            iterations: 20,
            //Alternate it so it "bounces" across the screen
            direction: 'alternate',
            //Give all of them a different duration so we get different speeds.
            duration: ((k * 1.75) + 1)
        });

        //When this drop is entered, pause the fx
        a.drop.on('drop:enter', function() {
            this.fx.pause();
        }, a);
        //When the drop is exited, run the fx again
        a.drop.on('drop:exit', function() {
            this.fx.run();
        }, a);
        //When a drop is on the node, do something special
        a.drop.on('drop:hit', function(e) {
            //Stop the animation
            this.fx.stop();
            //remove the tween listener
            this.fx.unsubscribeAll('tween');
            //move it to the dock
            this.fx.setAtts({
                from: {
                    opacity: 1
                },
                to: {
                    height: 50,
                    width: 50,
                    left: function() {
                        var dW = Y.Node.get('body').get('viewportRegion').right;
                        return ((dW - 60)); //Minus 60 for the dock
                    },
                    top: 15,
                    opacity: .5
                },
                direction: 'normal',
                iterations: 1,
                duration: .5,
                //We are using reverse above for the "bouncing", reset it here.
                reverse: false
            });

            //On end, add a class and destroy the target
            this.fx.on('end', function() {
                this.drop.get('node').addClass('done');
                this.drop.destroy();
            }, this);
            //Run this animation
            this.fx.run();
            
            //others that where dropped on..
            Y.each(e.others, function(v, k) {
                var node = v.get('node');
                node.fx.run();
            });

        }, a);
        
        //on tween of the original anim, we need to sync the drop's shim.
        a.fx.on('tween', function() {
            //Do we have an active Drag?
            if (Y.DD.DDM.activeDrag) {
                //Size this shim
                this.drop.sizeShim();
                //Force an over target check since we might not be moving the mouse..
                Y.Lang.later(0, a, function() {
                    this.drop._handleTargetOver();
                });
            }
        }, a);

        a.fx.run();
    });
});

</script>


</body>
</html>

