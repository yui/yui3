<h3>Setting up the HTML</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<div id="demo">
    <p>Whose child am I?</p>
</div>
</textarea>

<h3>Geting a Node Instance</h3>
<p>We will get our <code>Node</code> instance using the <code>get</code> method of our YUI instance which accepts either an HTMLElement or a Selector string.</p>
<textarea name="code" class="JScript">
var node = Y.get('#demo p');
</textarea>

<h3>Accessing Node Properties</h3>
<p>The properties of a node can be accessed via its <code>set</code> and <code>get</code> methods.</p>
<p>In most cases, simple type of properties (strings, numbers, booleans) pass directly to/from the underlying DOM node, however properties representing other DOM nodes return <code>Node</code> instances.</p>
<p>A <code>click</code> handler will allow us to update the <code>innerHTML</code> of our node with the <code>id</code> of its <code>parentNode</code>.</p>
<textarea name="code" class="JScript">
onClick = function(e) {
    var node = e.currentTarget;
    var html = 'I am a child of ' + node.get('parentNode').get('id') + '.';
    node.set('innerHTML', html);
};

</textarea>

<h3>Listening for Node Events</h3>
<p>We will update the node when the <code>click</code> event fires by using the <code>on</code> method to subscribe to the event.</p>
<textarea name="code" class="JScript">
node.on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    var node = Y.get('#demo p');

    var onClick = function(e) {
        var node = e.currentTarget;
        var html = 'I am a child of ' + node.get('parentNode').get('id') + '.';
        node.set('innerHTML', html);
    };

    node.on('click', onClick);
});
</textarea>
