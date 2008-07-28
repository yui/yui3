    
<a href="#" id="demo">hover me</a>
<script type="text/javascript">
YUI().use('animation', function(Y) {
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

        duration:0.5
    });

    var hover = function(e) {
        var reverse = false;
        if (this.get('running')) {
            this.pause();
        }
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
