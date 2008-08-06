<div id="demo">
<pre>set1 = { foo : "foo" };</pre>
<pre>set2 = { foo : "BAR", bar : "bar"  };</pre>
<pre>set3 = { foo : "FOO", baz : "BAZ" };</pre>

<input type="button" name="demo_btn1" id="demo_btn1" value="Merge"/>
<input type="button" name="demo_btn2" id="demo_btn2" value="Copy"/>
<h3>result</h3>
<pre id="demo_result">click Merge or Copy</pre>
<script type="text/javascript">

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'
// and 'dump'.

function(Y) {

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

    Y.on('click', doMerge, '#demo_btn1');

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

    Y.on('click', doCopy, '#demo_btn2');

    var stringifyObj = function (obj) {
        var bits = ['{ '];
        for (var k in obj) {
            bits = bits.concat([k, ' : "', obj[k], '", ']);
        }
        bits[bits.length - 1] = '" }';

        return bits.join('');
    };

});
</script>
</div>
