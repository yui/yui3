<h3>Setting up the YUI Instance</h3>
<p>Here we will create our YUI instance and tell it to load the <code>*</code> module.</p>
<p>The <code>*</code> module is a shorthand module name for all modules on the page. So you don't need to add all the modules to the <code>use</code> method.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('*');
</textarea>

<h3>Using the Ready Event</h3>
<p>In this example, we will use the <code>ready</code> event to determine when we can interact with the modules.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('*');
Y.on('event:ready', function() {
    //All of our code is loaded, now we can use it.
});
</textarea>

<p>Now that we know all of the modules are loaded, we will show a list of the modules loaded in this <code>YUI</code> instance.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('*');
Y.on('event:ready', function() {
    var node = Y.get('#demo');
    var used = [];
    Y.each(Y.Env._used, function(v, k) {
        used[used.length] = k;
    });
    used.sort();
    node.set('innerHTML', '<strong>Modules Loaded:</strong> ' + used.join(', '));
});
</textarea>
