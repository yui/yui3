<h3>Setting up the first YUI Instance</h3>
<p>Here we will create our first YUI instance and tell it to load the <code>anim</code> module.</p>
<textarea name="code" class="JScript">
YUI().use('anim', function(Y) {
});
</textarea>

<h3>Using Animation</h3>
<p>Now lets setup a simple animation on the Node <code>#demo</code>.</p>
<textarea name="code" class="JScript">
YUI().use('anim', function(Y) {
    var anim = new Y.Anim({
        node: '#demo',
        to: {
            height: 50,
            width: 150
        },
        from: {
            height: 100,
            width: 100
        },
        direction: 'alternate',
        iterations: 30,
        duration: .5
    });
    anim.run();
});
</textarea>

<h3>Setting up the second YUI Instance</h3>
<p>Here we will create our second YUI instance and tell it to load the <code>dd-drag</code> module.</p>
<p>Since we didn't specify the <code>anim</code> module, we will not have access to it in this instance.</p>
<textarea name="code" class="JScript">
var Y2 = YUI().use('dd-drag', function(Y) {
});
</textarea>

<h3>Making the node draggable</h3>
<p>Now lets make the same node draggable (while it's animated).</p>
<textarea name="code" class="JScript">
YUI().use('dd-drag', function(Y) {
    var dd = new Y.DD.Drag({
        node: '#demo'
    });
});
</textarea>
