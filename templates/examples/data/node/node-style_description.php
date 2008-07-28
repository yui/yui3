<h3>Setting up the HTML</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<div id="demo">
    <p>Click me to change my color and show some style information.</p>
</div>
</textarea>

<h3>Using Style Methods</h3>
<p>In this example, we will set the node's color and compare the style and computedStyle values when our demo node is clicked.</p>
<textarea name="code" class="JScript">
var onClick = function(e) {
    var node = e.currentTarget;
    if (!node.query('dl')) { // only create the DL once
        node.setStyle('color', 'green');
        var styleColor = node.getStyle('color');
        var computedColor = node.getComputedStyle('color');

        node.appendChild(Y.Node.create('<dl>' +
            '<dt>style.color</dt><dd>' + styleColor + '</dd>' + 
            '<dt>computedStyle.color</dt><dd>' + computedColor + '</dd>' +
        '</dl>'));
    }
};
</textarea>

<p>The last step is to assign the click handler.</p>
<textarea name="code" class="JScript">
Y.get('#demo').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    var onClick = function(e) {
        var node = e.currentTarget;
        if (!node.query('dl')) { // only create the DL once
            node.setStyle('color', 'green');
            var styleColor = node.getStyle('color');
            var computedColor = node.getComputedStyle('color');

            node.appendChild(Y.Node.create('<dl>' +
                '<dt>style.color</dt><dd>' + styleColor + '</dd>' + 
                '<dt>computedStyle.color</dt><dd>' + computedColor + '</dd>' +
            '</dl>'));
        }
    };

    Y.get('#demo').on('click', onClick);
});
</textarea>
