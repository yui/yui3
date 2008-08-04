<h3>Setting up the HTML</h3>
<p>First we add some HTML to animate.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
        <a title="remove module" class="yui-toggle"><em>-</em></a>
    </div>
    <div class="yui-bd">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
    </div>
</div>
</textarea>

<h3>Using the NodeFX Plugin</h3>
<p>For this example, we will use <code>Node</code>'s <code>fx</code> plugin to animate the element.  The plugin adds the anim instance to the <code>Node</code> instance, pre-configuring it to use the Node instance as the <code>Anim</code>'s node.  The <code>plug</code> method accepts a class to construct and an optional config to pass to the constructor.</p>
<p>Setting the <code>from</code> attribute to the expanded height of the element allows us to toggle the effect using the <code>reverse</code> attribute, which we will see below (<code>from</code> uses current value when omitted).</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var module = Y.get('#demo');

// add fx plugin to module body
var content = module.query('.yui-bd').plug(Y.Plugin.NodeFX, {
    to: {
        height: function(node) { // dynamic in case of change
            return node.get('scrollHeight'); // get expanded height (offsetHeight may be zero)
        }
    },

    easing: Y.Easing.easeOut,
    from: { height: 0 },
    duration: 0.5
});

</textarea>

<h3>Creating the Control Element</h3>
<p>Because our behavior only works when JS is available, let's go ahead and add our control element using JS as well.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// use dynamic control for dynamic behavior
var control = Y.Node.create(
    '<a title="show/hide content" class="yui-toggle">' +
        '<em>toggle</em>' +
    '</a>'
);

// append dynamic control to header section
module.query('.yui-hd').appendChild(control);
</textarea>
<h3>Toggling Animation Behavior</h3>
<p>Before calling <code>run</code> in our <code>click</code> handler, we will use the <code>reverse</code> attribute toggle the direction of the animation depending on whether its opening or closing.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var onClick = function(e) {
    module.toggleClass('yui-closed');
    content.fx.reverse();
};
</textarea>

<h3>Running the Animation</h3>
<p>Finally we add an event handler to run the animation.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
module.query('.yui-toggle').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI().use('animation', function(Y) {
    var module = Y.get('#demo');

    // add fx plugin to module body
    var content = module.query('.yui-bd').plug(Y.Plugin.NodeFX, {
        to: {
            height: function(node) { // dynamic in case of change
                return node.get('scrollHeight'); // get expanded height (offsetHeight may be zero)
            }
        },

        easing: Y.Easing.easeOut,
        from: { height: 0 },
        duration: 0.5
    });

    var onClick = function(e) {
        module.toggleClass('yui-closed');
        content.fx.reverse();
    };

    // use dynamic control for dynamic behavior
    var control = Y.Node.create(
        '<a title="show/hide content" class="yui-toggle">' +
            '<em>toggle</em>' +
        '</a>'
    );

    // append dynamic control to header section
    module.query('.yui-hd').appendChild(control);
    control.on('click', onClick);
});
</textarea>

