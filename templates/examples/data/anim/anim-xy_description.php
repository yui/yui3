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
<p>Now we create an instance of <code>Y.Anim</code>, passing it a configuration object that includes the <code>node</code> we wish to animate. We will set the <code>to</code> attribute later when then animation runs.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var anim = new Y.Anim({
    node: '#demo',
    duration: 0.5,
    easing: Y.Easing.elasticOut
});
</textarea>

<h3>Changing Attributes</h3>
<p>Next we need a <code>click</code> handler to set the <code>to</code> attribute for the <code>xy</code> behavior and run the animation.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var onClick = function(e) {
    anim.set('to', { xy: [e.pageX, e.pageY] });
    anim.run();
};

</textarea>
<h3>Running the Animation</h3>
<p>Finally we add an event handler to run the animation when the document is clicked.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.get('document').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI().use('anim', function(Y) {
    var anim = new Y.Anim({
        node: '#demo',
        duration: 0.5,
        easing: Y.Easing.elasticOut
    });

    var onClick = function(e) {
        anim.set('to', { xy: [e.pageX, e.pageY] });
        anim.run();
    };
    
    Y.get('document').on('click', onClick);

});
</textarea>

