<h3>Setting up the Node</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<ul id="demo">
    <li>lorem</li>
    <li>ispum</li>
    <li>dolor</li>
    <li>sit</li>
</ul>
</textarea>

<h3>Geting a NodeList Instance</h3>
<p>We will use the <code>all</code> method of our YUI instance to get a <code>NodeList</code> instance to work with.</p>
<textarea name="code" class="JScript">
var nodes = Y.all('#demo li');
</textarea>

<h3>Accessing NodeList Properties</h3>
<p>As with <code>Node</code>, simple type of properties (strings, numbers, booleans) pass directly to/from the underlying HTMLElement, however properties representing HTMLElements return Node instances.</p>
<p>In this example, we will listen for a <code>click</code> event to trigger the property change.</p>
<textarea name="code" class="JScript">
var onClick = function(e) {
    nodes.set('innerHTML', 'thanks from all of us!');
    e.currentTarget.setStyle('backgroundColor', 'green');
};
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
<script type="text/javascript">
YUI().use('*', function(Y) {
    var nodes = Y.all('#demo li');

    var onClick = function(e) {
        nodes.set('innerHTML', 'thanks from all of us!');
        e.currentTarget.setStyle('backgroundColor', 'green');
    };

    nodes.on('click', onClick);
});
</script>
</textarea>
