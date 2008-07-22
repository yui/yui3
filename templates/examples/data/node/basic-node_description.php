<h3>Setting up the Node</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<div id="demo"></div>
</textarea>
<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance. Node is included in YUI core so, no extra modules are required to use.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
</textarea>

<h3>Geting a Node Instance</h3>
<p>Now that we have a YUI instance, we need to instantiate the <code>Node</code> instance representing our demo element.</p>
<p>To do so, we use the <code>get</code> method of our YUI instance.  the <code>get</code> method accepts either an HTMLElement or a Selector string.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
var node = Y.get('#demo');
</textarea>

<h3>Accessing Node Properties</h3>
<p>In most cases, simple type of properties (strings, numbers, booleans) pass directly to/from the underlying HTMLElement, however properties representing HTMLElements return Node instances.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
var node = Y.get('#demo');
node.set('innerHTML', 'my parentNode is a ' + node.get('parentNode').get('tagName'));
</textarea>
