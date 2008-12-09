    
<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
    </div>
    <div class="yui-bd">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
    </div>
</div>
<p>This is placeholder text used to demonstrate how the above animation affects subsequent content.</p> 
<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var module = Y.get('#demo');

    // add fx plugin to module body
    var content = module.query('.yui-bd').plug(Y.plugin.NodeFX, {
        from: { height: 0 },
        to: {
            height: function(node) { // dynamic in case of change
                return node.get('scrollHeight'); // get expanded height (offsetHeight may be zero)
            }
        },

        easing: Y.Easing.easeOut,
        duration: 0.5
    });

    var onClick = function(e) {
        module.toggleClass('yui-closed');
        content.fx.set('reverse', !content.fx.get('reverse')); // toggle reverse 
        content.fx.run();
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
