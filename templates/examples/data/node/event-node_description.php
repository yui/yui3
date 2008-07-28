<h3>Setting up the Node</h3>
<p>First we need some HTML to work with.</p>
<textarea name="code" class="HTML">
<ul id="demo">
    <li>lorem</li>
    <li>ispum</li>
</ul>
</textarea>
<h3>Handling Events</h3>
<p>Next we will add a handler to run when the event is fired. In our handler we will update the <code>currentTarget</code> with the <code>type</code> of the event.</p>
<p>Note that the event handler receives an event object with a Node instance as its <code>currentTarget</code> property.</p>
<textarea name="code" class="JScript">
var onClick = function(e) {
    e.currentTarget.set('innerHTML', e.type);
};
</textarea>

<h3>Attaching Events</h3>
<p>We can assign our handler to all of the items by using the <code>all</code> method to get a <code>NodeList</code> instance and using the <code>on</code> method to subscribe to the event.</p>
<textarea name="code" class="JScript">
Y.all('#demo li').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
YUI().use('*', function(Y) {
    var onClick = function(e) {
        e.currentTarget.set('innerHTML', e.type);
    };

    Y.all('#demo li').on('click', onClick);
});
</textarea>
