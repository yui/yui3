    
<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
        <a title="toggle module" class="yui-toggle"><em>-</em></a>
    </div>
    <div class="yui-bd">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
    </div>
</div>
<p>Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken.</p> 
<script type="text/javascript">
YUI().use('animation', function(Y) {
    var anim = new Y.Anim({
        node: '#demo .yui-bd',
        from: {
            height: function(node) {
                return node.get('scrollHeight'); 
            }
        },
        to: { height: 0 },
        easing: Y.Easing.backIn
    });

    var onClick = function() {
        var className = 'yui-closed',
            reverse = false,
            toggleChar = '+';

        if ( this.get('running') ) {
            this.pause();
        }
        var node = Y.get('#demo .yui-toggle em'); // control element

        if ( node.hasClass(className) ) {
            reverse = true;
            toggleChar = '-';
        }

        node.toggleClass(className).set('innerHTML', toggleChar);
        this.set('reverse', reverse);
        this.run();
    };

    Y.get('#demo .yui-toggle').on('click', onClick, anim);

});

</script>
