<h3>Setting up the Node</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<ul id="demo">
   <li>item 1</li> 
   <li>item 2</li> 
   <li>item 3</li> 
   <li>item 4</li> 
   <li>item 5</li> 
</ul>

<button id="yui-run">run</button>
</textarea>
<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance. Node is included in YUI core so, no extra modules are required to use.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
</textarea>

<h3>Geting a NodeList Instance</h3>
<p>Now that we have a YUI instance, we need to instantiate the <code>NodeList</code> instance representing our elements.</p>
<p>To do so, we use the <code>all</code> method of our YUI instance.  the <code>all</code> method accepts either a selector or a collection of dom nodes.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
var node = Y.all('#demo li');
</textarea>

<h3>Accessing NodeList Properties</h3>
<p>As with <code>Node</code>, simple type of properties (strings, numbers, booleans) pass directly to/from the underlying HTMLElement, however properties representing HTMLElements return Node instances.</p>
<p>In this example, we will use a BUTTON node to trigger the property change.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
var nodelist = Y.all('#demo li');

Y.get('#yui-run').on('click', function() {
    nodelist.set('innerHTML', 'updated via NodeList');
});
</textarea>
