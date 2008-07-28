<h3>Setting up the HTML</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<ul id="demo">
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
</ul>
</textarea>

<h3>Geting a NodeList Instance</h3>
<p>We will use the <code>all</code> method of our YUI instance to get a <code>NodeList</code> instance to work with.</p>
<textarea name="code" class="JScript">
var nodes = Y.all('#demo li');
</textarea>

<h3>Delegating Node Events</h3>
<p>In this example, we will listen for a <code>click</code> event on the list and handle it at the item level and use information from both the <code>NodeList</code> instance and <code>event</code> object to update the nodes.</p>
<textarea name="code" class="JScript">
var onClick = function(e) {
    var target = e.target,
        html = 'Dont forget to click me...';

    if (target.test('#demo li')) {
        target.addClass('yui-pass');
        target.set('innerHTML', 'thanks for the click!');
    }
    nodes.filter(':not(.yui-pass)').set('innerHTML', html);
};
</textarea>

<p>Now we just assign the click handler to the <code>UL</code> that will allow us to use event bubbling to handle clicks on each <code>LI</code>.</p>
<textarea name="code" class="JScript">
Y.get('#demo').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
<script type="text/javascript">
YUI().use('*', function(Y) {
    var nodes = Y.all('#demo li');

    var onClick = function(e) {
        var target = e.target,
            html = 'Dont forget to click me...';

        if (target.test('#demo li')) {
            target.addClass('yui-pass');
            target.set('innerHTML', 'thanks for the click!');
        }
        nodes.filter(':not(.yui-pass)').set('innerHTML', html);
    };

    Y.get('#demo').on('click', onClick);
});
</script>
</textarea>
