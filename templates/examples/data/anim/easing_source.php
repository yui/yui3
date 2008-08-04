    
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
<p>Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken.</p> 
<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var anim = new Y.Anim({
        node: '#demo .yui-bd',
        to: { height: 0 },
        easing: Y.Easing.backIn
    });

    var onClick = function(e) {
        e.preventDefault();
        anim.run();
    };
    Y.get('#demo .yui-toggle').on('click', onClick);

});

</script>
