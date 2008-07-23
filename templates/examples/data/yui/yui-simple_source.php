<style>
    #demo {
        height: 100px;
        width: 100px;
        border: 1px solid black;
        background-color: #8DD5E7;
    }
</style>

<div id="demo"></div>

<script>

var Y = new YUI().use('node', function(Y) {
    var node = Y.get('#demo');
    Y.log('Found node.. Setting style');
    node.setStyle('backgroundColor', '#D00050');
});
</script>
