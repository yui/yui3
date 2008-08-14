<h2 class="first">First, a word of caution</h2>

<p><strong>Please DO NOT use this in place of feature detection</strong>.
Though many browsers have known JavaScript implementation quirks, it is bad
practice and unsafe coding to make the assumption that because the page is being
viewed in browser X that you can rely on feature Y being available.  Check for
feature Y if you need it.</p>

<p>Browser sniffing is an imprecise science, and relies on many things in the
browser environment to be just right.  Though many techniques are very
accurate, 100% accuracy can't be guaranteed.</p>

<p>Use the <code>UA</code> object to inform you of what browser your
page is being viewed in, but avoid using this technique unless feature detection
will not serve your purpose.</p>

<h3>What UA looks like</h3>

<p><code>UA</code> is an object literal containing keys for most major user
agents.  The key corresponding to the current browser is assigned a version
number.  All others have value 0, with the exception of the <code>mobile</code>
property, which is a string value indicating the name of a supported mobile 
device that was detected or null.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
if (Y.UA.gecko > 0) {}  // e.g. Firefox
if (Y.UA.ie > 0) {}     // Microsoft Internet Explorer

// Or leverage boolean coercion -- 0 evaulates as false
if (Y.UA.opera) {}  // Opera
if (Y.UA.webkit) {} // Safari, Webkit
</textarea>

<p>There's more information on the <code>UA</code> object and value
ranges in the <a
href="http://developer.yahoo.com/yui/3/api/UA.html">API
Documentation</a>.</p>

<h3 class="first">Instantiate YUI</h3>
<textarea name="code" class="JScript">
<!-- include yui -->
<script type="text/javascript" src="<?php echo $buildDirectory ?>yui/yui.js"></script>
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'.

function(Y) {
</textarea>

<h3>User Agent Info</h3>
<p>In this simple example, we use the <code>each</code> to iterate the <code>UA</code> object.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var results = Y.get('#demo'), ua = '';

Y.each(Y.UA, function(v, k) {
    var info = k + ': ' + v;
    results.set('innerHTML', results.get('innerHTML') + 
        '<p>' + info + '</p>');

    if (v) {
        ua = info;
    }
});

results.set('innerHTML', results.get('innerHTML') + 
    '<p>Your browser is ' + ua + '</p>');
</textarea>
