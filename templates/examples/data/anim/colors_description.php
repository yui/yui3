<h3>Setting up the HTML</h3>
<p>First we add some HTML to animate.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<a href="#" id="demo">hover me</a>
</textarea>

<h3>Creating the Anim Instance</h3>
<p>Now we create an instance of <code>Y.Anim</code>, passing it a configuration object that includes the <code>node</code> we wish to animate and the <code>to</code> attribute containing the final properties and their values.</p>
<p>Adding a <code>from</code> attribute allows us to reset the colors <code>onmouseout</code> using the <code>reverse</code> attribute, which we will see below.</p>

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

    duration:0.5
});
</textarea>

<h3>Runnint the Animation</h3>
<p>Next we need a handler to run when the link is moused over, and reverse when moused out.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var hover = function(e) {
    var reverse = false;
    if (anim.get('running')) {
        anim.pause();
    }
    if (e.type === 'mouseout') {
        reverse = true;
    }
    anim.set('reverse', reverse);
    anim.run();
};
</textarea>
<h3>Listening for the Events</h3>
<p>Finally we add an event handler to run the animation.</p>
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

        duration:0.5
    });

    var hover = function(e) {
        var reverse = false;
        if (anim.get('running')) {
            anim.pause();
        }
        if (e.type === 'mouseout') {
            reverse = true;
        }
        anim.set('reverse', reverse);
        anim.run();
    };
    node.on('mouseover', hover);
    node.on('mouseout', hover);
});
</textarea>
