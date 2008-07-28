<h2 class="first">Creating a Simple Animation</h2>

<h3>Setting up the HTML</h3>
<p>First we add some HTML to animate.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<a href="#" id="demo">hover me</a>
</textarea>

<h3>Creating the Anim Instance</h3>
<p>Now we create an instance of <code>Y.Anim</code>, passing it a configuration object that includes the <code>node</code> we wish to animate and the <code>to</code> attribute containing the properties to be transitioned and final values.</p>
<p>Adding a <code>from</code> attribute set the expanded height of the element toggle the effect using the <code>reverse</code> attribute, which we will see below.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>

<h3>Running the Animation</h3>
<p>Finally we add an event handler to run the animation.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.get('#demo .yui-remove').on('click', run, anim);
</textarea>

