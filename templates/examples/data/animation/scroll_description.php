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
<p>Depending on which control is clicked, we may be scrolling up or down, so an event handler will update the <code>to</code> attribute's <code>scroll</code> behavior before calling <code>run</code>.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var onClick = function(e) {
    var y = node.get('offsetHeight');
    if (e.currentTarget.hasClass('yui-scrollup')) {
        y = 0 - y;
    }

    anim.set('to', { scroll: [0, y + node.get('scrollTop')] });
    anim.run();
};
</textarea>

<h3>Running the Animation</h3>
<p>Finally we add an event handler to run the animation. Both of our controls use the same handler, so we can use the <code>Y.all</code> method to assign the handler to both.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.all('#demo .yui-hd a').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI().use('animation', function(Y) {
    var node = Y.get('#demo .yui-bd');
    var anim = new Y.Anim({
        node: node,
        to: {
            scroll: function(node) {
                return [0, node.get('scrollTop') + node.get('offsetHeight')]
            }
        },
        easing: Y.Easing.easeOut
    });

    var onClick = function(e) {
        var y = node.get('offsetHeight');
        if (e.currentTarget.hasClass('yui-scrollup')) {
            y = 0 - y;
        }

        anim.set('to', { scroll: [0, y + node.get('scrollTop')] });
        anim.run();
    };

    Y.all('#demo .yui-hd a').on('click', onClick);
});
</textarea>

