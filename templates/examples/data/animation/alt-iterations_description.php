<h3>Setting up the HTML</h3>
<p>First we add some HTML to animate.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<a href="#" id="demo">hover me</a>
</textarea>

<h3>Creating the Anim Instance</h3>
<p>Now we create an instance of <code>Y.Anim</code>, passing it a configuration object that includes the <code>node</code> we wish to animate and the <code>to</code> attribute containing the final properties and their values.</p>
<p>Adding an <code>iterations</code> attribute of "infinite" means that the animation will run continuously.</p>
<p>The <code>direction</code> attribute of "alternate" means that the animation reverses every other iteration.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
    direction: 'alternate',
    easing: Y.Easing.easeOut
});

</textarea>

<h3>Changing Attributes</h2>
<p>We don't want the animation running when the link is not hovered over, so we will change the animation attributes depending on whether or not we are over the link.</p>
<h3>Running the Animation</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
<p>Finally we add event handlers to run the animation.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
node.on('mouseover', hover, anim);
node.on('mouseout', hover, anim);
</textarea>

<h3>Full Script Source</h2>
<textarea name="code" class="JScript" cols="60" rows="1">
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

</textarea>

