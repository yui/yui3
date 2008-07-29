<h3>Setting up the YUI Instance</h3>
<p>Here we will create our YUI instance and tell it to load the <code>*</code> module.</p>
<p>The <code>*</code> module is a shorthand module name for all modules on the page. So you don't need to add all the modules to the <code>use</code> method.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('*');
</textarea>

<h3>Using the callback</h3>
<p>You can pass a function in as the last argument to use. This function will execute after the YUI instance loads all the modules.</p>
<p>The callback method has one argument passed, the <code>YUI</code> instance that we are dealing with. In this function you know that all the modules have been loaded and it's ok to use them.</p>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    //the Y var passed in here will be our Y instance
});
</textarea>



<p>Now that we know all of the modules are loaded, we will show a list of the modules loaded in this <code>YUI</code> instance.</p>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    var node = Y.get('#demo');
    var used = [];
    Y.each(Y.Env._attached, function(v, k) {
        used[used.length] = k;
    });
    used.sort();
    node.set('innerHTML', '<strong>Modules Loaded:</strong> ' + used.join(', '));
});
</textarea>
