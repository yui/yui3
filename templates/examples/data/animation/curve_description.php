<h3>Setting up the HTML</h3>
<p>First we add some HTML to animate.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<span id="demo"></span>
</textarea>

<h3>Creating the Anim Instance</h3>
<p>Now we create an instance of <code>Y.Anim</code>, passing it a configuration object that includes the <code>node</code> we wish to animate.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var node = Y.get('#demo');

var anim = new Y.Anim({
    node: node,
    duration: 1.5,
    easing: Y.Easing.easeOut
});
</textarea>

<h3>Changing Attributes</h3>
<p>A click handler will set the <code>to</code> value before <code>run</code> is called.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var onClick = function(e) {
    anim.set('to', {
        curve: randomCurve([e.pageX, e.pageY])
    });
    anim.run();
};

</textarea>

<h3>Running the Animation</h3>
<p>Finally we add an event handler to run the animation.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.get('document').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI().use('animation', function(Y) {
    var node = Y.get('#demo');

    var anim = new Y.Anim({
        node: node,
        duration: 1.5,
        easing: Y.Easing.easeOut
    });

    var randomCurve = function(end) {
        var points = [],
            n = 3,
            winWidth = node.get('winWidth'),
            winHeight = node.get('winHeight');

        for (var i = 0; i < n; ++i) {
            points.push([
                Math.floor(Math.random() * winWidth),
                Math.floor(Math.random() * winHeight)
            ]);
        }

        if (end) {
            points.push(end);
        }
        return points;
    };

    var onClick = function(e) {
        anim.set('to', {
            curve: randomCurve([e.pageX, e.pageY])
        });
        anim.run();
    };
    
    Y.get('document').on('click', onClick);

});
</textarea>

