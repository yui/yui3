<h3>Setting up the HTML</h3>
<p>First we will create our HTML.</p>
<textarea name="code" class="HTML">
        <div id="dock"></div>
        <div id="drag">Drag #1</div>
        <div id="anim1" class="anim">Anim #1</div>
        <div id="anim2" class="anim">Anim #2</div>
        <div id="anim3" class="anim">Anim #3</div>
        <div id="anim4" class="anim">Anim #4</div>
        <div id="anim5" class="anim">Anim #5</div>
</textarea>
<p>Now we give that HTML some CSS to make it visible.</p>
<textarea name="code" class="CSS">
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
</textarea>

<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance and tell it to load the <code>dd-drop</code>, <code>dd-plugin</code>, <code>dd-drop-plugin</code> and <code>anim</code> modules.</p>
<textarea name="code" class="JScript">
YUI().use('dd-drop', 'anim', 'dd-plugin', 'dd-drop-plugin');
</textarea>

<h3>Making the Node draggable</h3>
<p>Now that we have a YUI instance with the modules loaded, we need to instantiate the <code>Drag</code> instance on this Node.</p>
<p>In this example we will be using Node plugins to accomplish our tasks.</p>
<textarea name="code" class="JScript">
YUI().use('dd-drop', 'anim', 'dd-plugin', 'dd-drop-plugin', function(Y) {
    //Get the node #drag
    var d = Y.Node.get('#drag');
    d.plug(Y.Plugin.Drag, { dragMode: 'intersect' });
});
</textarea>

<h3>Animating the Nodes</h3>
<p>Now we will setup the Animation sequence that we want to run.</p>
<textarea name="code" class="JScript">
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
    });
</textarea>

<h3>Making the Node A Target</h3>
<p>Using the <code>dd-drop-plugin</code>, we now need to make this animated Node a Drop Target.</p>
<p>To do that, we need to add the plugin after the fx plugin.</p>
<textarea name="code" class="JScript">
//Add the FX plugin
a.plug(Y.Plugin.NodeFX);
//Add the Drop plugin
a.plug(Y.Plugin.Drop);
</textarea>

<h3>Syncing the Target with the Animation</h3>
<p>The Drop Target needs to be in sync with the animation, since we are changing the height, width, top and left style.</p>
<p>We do this by adding a listener to the <code>tween</code> event on the animation instance.</p>
<textarea name="code" class="JScript">
//on tween of the original anim, we need to sync the drop's shim.
a.fx.on('tween', function() {
    //Do we have an active Drag?
    if (Y.DD.DDM.activeDrag) {
        //Size this shim
        this.drop.sizeShim();
        //Force an over target check since we might not be moving the mouse.
        Y.Lang.later(0, a, function() {
            this.drop._handleTargetOver();
        });
    }
}, a);
</textarea>

<h3>Full example source</h3>
<textarea name="code" class="JScript">
YUI().use('dd-drop', 'anim', 'dd-plugin', 'dd-drop-plugin', function(Y) {
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
            
            //others that were dropped on.
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
                //Force an over target check since we might not be moving the mouse.
                Y.Lang.later(0, a, function() {
                    this.drop._handleTargetOver();
                });
            }
        }, a);

        a.fx.run();
    });
});
</textarea>

