    
<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
    </div>
    <div class="yui-bd">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
    </div>
</div>
<p>Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken.</p> 
<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var module = Y.get('#demo');

    // add fx plugin to module body
    var content = module.query('.yui-bd').plug(Y.Plugin.NodeFX, {
        to: {
            height: function(node) { // dynamic in case of change
                return node.get('scrollHeight'); // get expanded height (offsetHeight may be zero)
            }
        },

        easing: Y.Easing.easeOut,
        from: { height: 0 },
        duration: 0.5
    });

    var onClick = function(e) {
        module.toggleClass('yui-closed');
        content.fx.reverse();
    };

    // use dynamic control for dynamic behavior
    var control = Y.Node.create(
        '<a title="show/hide content" class="yui-toggle">' +
            '<em>toggle</em>' +
        '</a>'
    );

    // append dynamic control to header section
    module.query('.yui-hd').appendChild(control);
    control.on('click', onClick);

});

</script>
