    
<a href="#" id="demo">hover me</a>
<p>Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken.</p> 
<script type="text/javascript">
YUI().use('animation', function(Y) {
    var node = Y.get('#demo');

    var anim = new Y.Anim({
        node: node,
        from: {
            backgroundColor: node.getStyle('backgroundColor'),
        },

        to: {
            backgroundColor: '#ffa928',
        },

        duration: 0.5,
        iterations: 'infinite',
        easing: Y.Easing.easeOut,
        direction: 'alternate'
    });

    var hover = function(e) {
        var reverse = false,
            iterations = 'infinite';

        if (this.get('running')) {
            this.pause();
        }
        if (e.type === 'mouseout') {
            reverse = true;
            iterations = 1;
        }
        this.setAtts({
            'reverse': reverse,
            'iterations': iterations
        });

        this.run();
    };
    node.on('mouseover', hover, anim);
    node.on('mouseout', hover, anim);

});

</script>
