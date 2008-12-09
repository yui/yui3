    
<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
        <a title="collapse module" class="yui-toggle"><em>toggle</em></a>
    </div>
    <div class="yui-bd">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
    </div>
</div>
<p>This is placeholder text used to demonstrate how the above animation affects subsequent content.</p> 
<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var anim = new Y.Anim({
        node: '#demo .yui-bd',
        to: { height: 1 },
        easing: Y.Easing.backIn
    });

    var onClick = function(e) {
        e.preventDefault();
        anim.run();
    };
    Y.get('#demo .yui-toggle').on('click', onClick);

});

</script>
