<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
        <a title="remove module" class="yui-remove"><em>x</em></a>
    </div>
    <div class="yui-bd">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
    </div>
</div>

<script type="text/javascript">
YUI().use('animation', function(Y) {
    var anim = new Y.Anim({
        node: '#demo',
        to: { opacity: 0 }
    });

    // enable close link (with anim context)
    Y.get('#demo .yui-remove').on('click', anim.run, anim);

});

</script>
