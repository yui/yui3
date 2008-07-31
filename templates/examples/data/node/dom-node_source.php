<ul id="demo">
    <li>lorem</li>
    <li>ispum</li>
    <li>dolor</li>
    <li>sit</li>
</ul>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var onClick = function(e) {
        var node = e.currentTarget;
        node.get('parentNode').removeChild(node);
    };

    Y.all('#demo li').on('click', onClick);
});
</script>
