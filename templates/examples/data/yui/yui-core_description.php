<h3>Setting up the YUI Instance</h3>
<p>Here we will create our YUI instance loading no modules.</p>
<textarea name="code" class="JScript">
var Y = YUI();
</textarea>


<p>Now that we know all of the modules are loaded, we will show a list of the modules loaded in this <code>YUI</code> instance.</p>
<textarea name="code" class="JScript">
var Y = YUI();
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
