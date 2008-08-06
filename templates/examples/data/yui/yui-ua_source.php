<pre style="margin-bottom: 1em">
UA properties set for your browser:
</pre>
<div id="demo">
</div>
<script type="text/javascript">

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'.
function(Y) {
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
});

</script>
