<h3>Setting up the YUI Instance</h3>
<p>Here we will create our YUI instance and tell it to load the <code>node</code> module.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('node');
</textarea>

<h3>Using the callback</h3>
<p>You can pass a function in as the last argument to use. This function will execute after the YUI instance loads all the modules.</p>
<p>The callback method has one argument passed, the <code>YUI</code> instance that we are dealing with. In this function you know that all the modules have been loaded and it's ok to use them.</p>
<textarea name="code" class="JScript">
YUI().use('node', function(Y) {
    //the Y var passed in here will be our Y instance with Node loaded.
});
</textarea>

<p>Now that we know the module is loaded, we can use Node to interact with an HTML Element on the page.</p>
<textarea name="code" class="JScript">
YUI().use('node', function(Y) {
    var node = Y.get('#demo');
    Y.log('Found node.. Setting style');
    node.setStyle('backgroundColor', '#D00050');
});
</textarea>
