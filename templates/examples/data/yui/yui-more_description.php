<h3>Including YUI and Additional Modules on the Page</h3>
<p>Here we are including any additional dependencies we need within the page instead of relying on loader to pull them in dynamically.</p>
<textarea name="code" class="JScript">
<!-- include yui core -->
<script type="text/javascript" src="<?php echo $buildpath ?>yui/yui.js"></script>

<!-- include all requirements for node -->
<script type="text/javascript" src="<?php echo $buildpath ?>oop/oop.js"></script>
<script type="text/javascript" src="<?php echo $buildpath ?>event/event.js"></script>
<script type="text/javascript" src="<?php echo $buildpath ?>dom/dom.js"></script>
<script type="text/javascript" src="<?php echo $buildpath ?>node/node.js"></script>
</textarea>

<h3>Setting up the YUI Instance</h3>

<p>When we create our <code>YUI</code> instance, we'll tell it to load the <code>*</code> module.

<p>The <code>*</code> module is a shorthand module name for all modules on the page.  This way you don't
have to supply the full list of requirements to the <code>use</code> method.</p>
<textarea name="code" class="JScript">
YUI().use('*' ...
</textarea>

<h3>Using the callback</h3>
<p>You can pass a function as the last argument to the <code>use</code>. This function will execute after the <code>YUI</code> instance loads all the modules.</p>
<p>The function is supplied one argument: the <code>YUI</code> instance that we have just created.  When this function executes, all
of the modules have been loaded and attached to the instance, ready to use.</p>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    // the Y var passed in here will be our YUI instance
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
