<h3>Setting up the Node</h3>
<p>First we need to create an HTML Node to make draggable.</p>
<textarea name="code" class="HTML">
<div id="demo">Drag Me</div>
</textarea>
<p>Now we give that Node some CSS to make it visible.</p>
<textarea name="code" class="CSS">
#demo {
    height: 100px;
    width: 100px;
    border: 1px solid black;
    background-color: #8DD5E7;
    cursor: move;
}
</textarea>

<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance and tell it to load the <code>dd-drag</code> and <code>dd-proxy</code> modules.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-drag', 'dd-proxy');
</textarea>

<h3>Making the Node draggable</h3>
<p>Now that we have a YUI instance with the <code>dd-drag</code> and <code>dd-proxy</code> modules, we need to instantiate the <code>Drag</code> instance on this Node.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-drag');
Y.on('event:ready', function() {
    //Selector of the node to make draggable
    var dd = new Y.DD.Drag({
        node: '#demo',
        //This config option makes the node a Proxy Drag
        proxy: true
    });   
});
</textarea>
