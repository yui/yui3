<h2 class="first">Type Checking with YUI</h2>

<h3>Instantiate YUI</h3>
<textarea name="code" class="JScript">
<!-- include yui -->
<script type="text/javascript" src="<?php echo $buildDirectory ?>yui/yui.js"></script>
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'.

function(Y) {
</textarea>

<h3>Checking types</h3>
<p>In this example, we use a few of the type-checking methods available in
<code>Lang</code> to test various types of data.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Test the input using Y.Lang type checking methods
var checkType = function (val) {
    return {
        'object'  : Y.Lang.isObject(val),
        'array'   : Y.Lang.isArray(val),
        'function': Y.Lang.isFunction(val)
    };
};
</textarea>

