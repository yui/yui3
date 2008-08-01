<h3>Setting up the YUI Instance</h3>
<p>Here we will create our <code>YUI</code> instance, loading 'node' so we can work with DOM elements in the example.</p>
<textarea name="code" class="JScript">
YUI().use('node' ...
</textarea>

<p>The <code>use</code> method will dynamically fetch anything required for 'node' if it isn't already on the page.
If dynamic loading is required, the last parameter supplied to <code>use</code> should be a function to execute when
the load is complete.  This function will be executed whether or not dynamic loading is required, so it
is the preferred pattern for using <code>YUI</code>.</p>
<textarea name="code" class="JScript">
YUI().use('node' function(Y) ...
</textarea>

<p>
The function is supplied a reference to the <code>YUI</code> instance, so we can wrap all of our implementation code inside of
the <code>use</code> statement without saving an external reference to the instance somewhere else.
</p>
<p>
Now that we know all of the modules are loaded, we can use node to update DOM nodes.
</p>
<textarea name="code" class="JScript">

YUI().use('node', function(Y) {
    var node = Y.get('#demo');
    Y.log('Found node.. Setting style');
    node.setStyle('backgroundColor', '#D00050');
    node.set('innerHTML', '<strong>Changed!</strong>');
});
</textarea>
