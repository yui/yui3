<h3>Setting up the Node</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<ul id="demo">
    <li>lorem</li>
    <li>ispum</li>
    <li>dolor</li>
    <li>sit</li>
</ul>
</textarea>
<h3>Using DOM Methods</h3>
<p>Most common DOM methods are available via Node instances. These can be used to add, remove, and retrieve other nodes.</p>
<p>Now we need a handler to remove a node when the <code>click</code> event fires.</p>
<textarea name="code" class="JScript">
var onClick = function(e) {
    var node = e.currentTarget;
    node.get('parentNode').removeChild(node);
};
</textarea>

<h3>Listening for Node Events</h3>
<p>We can assign our handler to all of the items by using the <code>all</code> method to get a <code>NodeList</code> instance and using the <code>on</code> method to subscribe to the event.</p>
<textarea name="code" class="JScript">
Y.all('#demo li').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    var onClick = function(e) {
        var node = e.currentTarget;
        node.get('parentNode').removeChild(node);
    };

    Y.all('#demo li').on('click', onClick);
});
</textarea>
