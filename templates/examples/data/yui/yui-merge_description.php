<h2 class="first">Using <code>merge</code></h2>


<h3 class="first">Instantiate YUI</h3>
<textarea name="code" class="JScript">
<!-- include yui -->
<script type="text/javascript" src="<?php echo $buildpath ?>yui/yui.js"></script>
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'.

function(Y) {
</textarea>

<h3>Merging hash tables</h3>
<p>When the "Merge" button is clicked, we merge three object literals in the form
of hash tables.  Note the key values in later parameters override those in
previous parameters.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var set1 = { foo : "foo" };
var set2 = { foo : "BAR", bar : "bar" };
var set3 = { foo : "FOO", baz : "BAZ" };
var result = Y.get('#demo_result');

var doMerge = function () {

    Y.log('set1 = ' + Y.dump(set1));
    Y.log('set2 = ' + Y.dump(set2));
    Y.log('set3 = ' + Y.dump(set3));

    Y.log('Merging set1, set2, and set3');
    var merged = Y.merge(set1, set2, set3);
    Y.log('merged = ' + Y.dump(merged));

    result.set('innerHTML', '<p>' + stringifyObj(merged) + '</p>');
};

Y.on('click', doMerge, '#demo_btn');

</textarea>

<h3>Creating Shallow Copies</h3>
<p>When the "Copy" button is clicked, we create use merge on a single
object in order to create a shallow clone.  The code illustrates the
fact that object properties of the result object are shared with
the input object.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var doCopy = function () {

    // Create set4 with an object property 'obj'
    var set4 = {
        obj: {}
    };

    // Create a shallow copy of set4
    var copy = Y.merge(set4);

    // Add a property to the copy inside of the 'obj' property
    copy.obj.addedToCopy = true;

    Y.log('After modifying the copy: ');

    // The result object is not the same as the original, but
    Y.log('copy === original: ' + (copy === set4));

    // objects in the result object will reference the same object in
    // the input object.
    var msg = 'copy.obj.addedToCopy === original.obj.addedToCopy: ' + 
            (copy.obj.addedToCopy === set4.obj.addedToCopy);

    Y.log(msg);
    result.set('innerHTML', '<p>' + msg + '</p>');
};
</textarea>

<p>See the <code>clone</code> method to create deep copies of objects.</p>
