<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
        <a href="remove.php?id=#demo" title="remove module" class="yui-remove"><em>remove</em></a>
    </div>
    <div class="yui-bd">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
    </div>
</div>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var anim = new Y.Anim({
        node: '#demo',
        to: { opacity: 0 }
    });

    var onClick = function(e) {
        e.preventDefault(); 
        anim.run();
    };

    Y.get('#demo .yui-remove').on('click', onClick);

});

</script>
