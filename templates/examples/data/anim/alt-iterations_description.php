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
    direction: 'alternate'
});
</textarea>

<h3>Changing Attributes</h3>
<p>We don't want the animation running when the link is not hovered over, so we will change the animation attributes depending on whether or not we are over the link.</p>
<p>We can use a single handler for both mouse the mouseOver and mouseOut events, and set the <code>reverse</code> attribute depending on which event fired.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>
<h3>Running the Animation</h3>
<p>Finally we add event handlers to run the animation.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
node.on('mouseover', hover);
node.on('mouseout', hover);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI().use('anim-color', function(Y) {
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

</textarea>

