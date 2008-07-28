    
<a href="#" id="demo">hover me</a>
<p>Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken.</p> 
<script type="text/javascript">
YUI().use('animation', function(Y) {
    var node = Y.get('#demo');

    var anim = new Y.Anim({
        node: node,
        from: {
            backgroundColor:node.getStyle('backgroundColor'),
            color: node.getStyle('color'),
            borderTopColor: node.getStyle('borderTopColor'),
            borderRightColor: node.getStyle('borderRightColor'),
            borderBottomColor: node.getStyle('borderBottomColor'),
            borderLeftColor: node.getStyle('borderLeftColor'),
        },

        to: {
            color: '#fff',
            backgroundColor:'#ffa928',
            borderTopColor: '#71241a',
            borderRightColor: '#71241a',
            borderBottomColor: '#71241a',
            borderLeftColor: '#71241a'
        },

        duration:0.5
    });

    var hover = function(e) {
        if (this.get('running')) {
            this.pause();
        }
        var reverse = false;
        if (e.type === 'mouseout') {
            reverse = true;
        }
        this.set('reverse', reverse);
        this.run();
    };
    node.on('mouseover', hover, anim);
    node.on('mouseout', hover, anim);

});

</script>
