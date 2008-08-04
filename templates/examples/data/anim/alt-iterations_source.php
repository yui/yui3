    
<a href="#" id="demo">hover me</a>
<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var node = Y.get('#demo');

    var anim = new Y.Anim({
        node: node,
        from: {
            backgroundColor:node.getStyle('backgroundColor'),
            color: node.getStyle('color'),
            borderColor: node.getStyle('borderTopColor')
        },

        to: {
            color: '#fff',
            backgroundColor:'#ffa928',
            borderColor: '#71241a'
        },

        duration: 0.5,
        iterations: 'infinite',
        direction: 'alternate'
    });

    var hover = function(e) {
        var reverse = false,
            iterations = 'infinite';

        if (anim.get('running')) {
            anim.pause();
        }
        if (e.type === 'mouseout') {
            reverse = true;
            iterations = 1;
        }
        anim.setAtts({
            'reverse': reverse,
            'iterations': iterations
        });

        anim.run();
    };

    node.on('mouseover', hover);
    node.on('mouseout', hover);
});

</script>
