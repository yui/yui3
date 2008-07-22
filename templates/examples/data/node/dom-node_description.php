<h3>Setting up the Node</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<div id="demo">
    <h4>Demo Element</h4>
    <p>This is a demo of Node in action.</p>
    <p>This paragraph will be removed dynamically.</p>
</div>
<button id="yui-run">run</button>
</textarea>
<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance. Node is included in YUI core so, no extra modules are required to use.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
</textarea>

<h3>Using DOM Methods</h3>
<p>Most common DOM methods are available via Node instances. These can be used to add, remove, and retrieve other nodes.</p>
<p>Note that methods returning DOM nodes instead return Node instances.  DOM methods that normally accept DOM nodes also accept Node instances.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
var node = Y.get('#demo');
var removedNode = node.removeChild(Y.get('#demo p:last-child'));
</textarea>

