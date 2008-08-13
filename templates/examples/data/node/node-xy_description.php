<h3>Setting up the HTML</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<span id="demo"></span>
</textarea>

<h3>Getting the Dimensions</h3>
<p>In this example, we will listen for clicks on the document and update the position of our demo node to match the click position.</p>
<textarea name="code" class="JScript">
var onClick = function(e) {
    Y.get('#demo').setXY([e.pageX, e.pageY]);
};
</textarea>

<p>The last step is to assign the click handler to the <code>document</code> to capture all <code>click</code> events.</p>
<textarea name="code" class="JScript">
Y.get('document').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    var onClick = function(e) {
        Y.get('#demo').setXY([e.pageX, e.pageY]);
    };

    Y.get('document').on('click', onClick);
});
</textarea>
