<h3>Setting up the HTML</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<dl id="demo">
    <dt>Window size</dt>
    <dd class="yui-data-win">Click me to find out</dd>
    <dt>Document size</dt>
    <dd class="yui-data-doc">Click me to find out</dd>
</dl>
</textarea>

<h3>Getting the Dimensions</h3>
<p>In this example, we will listen for clicks on the <code>DD</code> elements and update them with screen information.</p>
<textarea name="code" class="JScript">
var onClick = function(e) {
    var target = e.target,
        h, w;

    if (target.test('dd')) {
        if (target.test('.yui-data-win')) {
            h = target.get('winHeight');
            w = target.get('winWidth');
        } else if (target.test('.yui-data-doc')) {
            h = target.get('docHeight');
            w = target.get('docWidth');

        }
        target.set('innerHTML', 'width: ' + w + ' height: ' + h);
    }
};

</textarea>

<h3>Adding a Click Listener</h3>
<p>Now we just assign the click handler to the <code>DL</code> that will allow us to use event bubbling to handle clicks on each <code>DD</code>.</p>
<textarea name="code" class="JScript">
Y.get('#demo').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    var onClick = function(e) {
        var target = e.target,
            h, w;

        if (target.test('dd')) {
            if (target.test('.yui-data-win')) {
                h = target.get('winHeight');
                w = target.get('winWidth');
            } else if (target.test('.yui-data-doc')) {
                h = target.get('docHeight');
                w = target.get('docWidth');

            }
            target.set('innerHTML', 'width: ' + w + ' height: ' + h);
        }
    };

    Y.get('#demo').on('click', onClick);
});
</textarea>
