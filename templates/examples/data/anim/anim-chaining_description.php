<h3>Setting up the HTML</h3>
<p>First we add some HTML to animate.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
        <a title="remove module" class="yui-remove"><em>x</em></a>
    </div>
    <div class="yui-bd">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
    </div>
</div>
</textarea>

<h3>Creating the Anim Instance</h3>
<p>Now we create an instance of <code>Y.Anim</code>, passing it a configuration object that includes the <code>node</code> we wish to animate and the <code>to</code> attribute containing the properties to be transitioned and final values.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var anim = new Y.Anim({
    node: '#demo',
    to: {
        opacity: 0
    }
});
</textarea>

<h3>Handling the End Event</h3>
<p>We will need a function to run when the <code>end</code> event fires.  Note that the context of our handler defaults to <code>anim</code>, so <code>this</code> refers to our Anim instance inside the handler.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var onEnd = function() {
    this.unsubscribe('end', onEnd);
    this.setAtts({
        to: { height: 0 },
        easing: Y.Easing.bounceOut
    });
    this.run();
};
</textarea>
<h3>Listening for the End Event</h3>
<p>Now we will use the <code>on</code> method to subscribe to the <code>end</code> event, passing it our handler.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
anim.on('end', onEnd);
</textarea>

<h3>Running the Animation</h3>
<p>Finally we add an event handler to run the animation.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.get('#demo .yui-remove').on('click', anim.run, anim);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI().use('anim', function(Y) {
    var anim = new Y.Anim({
        node: '#demo',
        to: { opacity: 0 }
    });

    var onEnd = function() {
        this.unsubscribe('end', onEnd);
        this.setAtts({
            to: { height: 0 },
            easing: Y.Easing.bounceOut
        });
        this.run();
    };

    anim.on('end', onEnd);

    Y.get('#demo .yui-remove').on('click', anim.run, anim);

});
</textarea>
