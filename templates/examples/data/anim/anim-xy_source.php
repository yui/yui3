<span id="demo"></span>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var anim = new Y.Anim({
        node: '#demo',
        duration: 0.5,
        easing: Y.Easing.elasticOut
    });

    var onClick = function(e) {
        anim.set('to', { xy: [e.pageX, e.pageY] });
        anim.run();
    };
    
    Y.get('document').on('click', onClick);

});

</script>
