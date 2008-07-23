<style>
    #demo {
        border: 1px solid black;
        background-color: #8DD5E7;
    }
    #demo strong {
        font-weight: bold;
    }
</style>

<div id="demo"></div>

<script>

var Y = YUI().use('*');
Y.on('event:ready', function() {
    var node = Y.get('#demo');
    var used = [];
    Y.each(Y.Env._used, function(v, k) {
        used[used.length] = k;
    });
    used.sort();
    node.set('innerHTML', '<strong>Modules Loaded:</strong> ' + used.join(', '));
});
</script>
