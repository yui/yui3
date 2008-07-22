<h3>Setting up the Node</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<button id="yui-run">run</button>
</textarea>
<h3>Getting a Node Instance</h3>
<p>Now we need to create our YUI instance and get a node instance for the button.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
var node = Y.get('#yui-run');
</textarea>

<h3>Handling Events</h3>
<p>Next we will add a handler to run when the event is fired. In our handler we will pop an alert as well as detach the handler so that it only runs once.</p>
<p>Note that the event handler receives an event object with a Node instance as its <code>target</code> property.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
var node = Y.get('#yui-run');
var onclick = function(e) {
    alert('you clicked a ' + e.target.get('tagName'));
    node.detach('click', onclick);
};
</textarea>

<h3>Attaching Events</h3>
<p>Finally we will add a handler to run when the event is fired.
<textarea name="code" class="JScript">
var Y = YUI().use('*');
var node = Y.get('#yui-run');
var onclick = function(e) {
    alert('you clicked a ' + e.target.get('tagName'));
    node.detach('click', onclick);
};

node.on('click', onclick);
</textarea>
