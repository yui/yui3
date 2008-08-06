<h2 class="first">Instantiate YUI</h2>
<textarea name="code" class="JScript">
<!-- include yui -->
<script type="text/javascript" src="<?php echo $buildpath ?>yui/yui.js"></script>
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'.

function(Y) {
</textarea>

<h2>Checking types</h2>
<p>In this example, we use a few of the type-checking methods available in
<code>YAHOO.Lang</code> to test various types of data.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Test the input using YAHOO.lang type checking methods
var checkType = function (val) {
    return {
        'object'  : Y.Lang.isObject(val),
        'array'   : Y.Lang.isArray(val),
        'function': Y.Lang.isFunction(val)
    };
};
</textarea>

<h2>Other type checking methods</h2>
<p><code>YAHOO.lang</code> currently supports the following type checking methods:</p>
<ul>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isArray">isArray</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isBoolean">isBoolean</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isFunction">isFunction</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isNull">isNull</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isNumber">isNumber</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isObject">isObject</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isString">isString</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isUndefined">isUndefined</a></li>
    <li><a href="http://developer.yahoo.com/yui/docs/YAHOO.lang.html#isValue">isValue</a></li>
</ul>
