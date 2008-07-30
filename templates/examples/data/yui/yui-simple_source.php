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

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
function(Y) {
    var node = Y.get('#demo');
    Y.log('Found node.. Setting style');
    node.setStyle('backgroundColor', '#D00050');
});
</script>
