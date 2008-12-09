<h3>Setting up the Node</h3>
<p>First we need to create an HTML Node to make draggable.</p>
<textarea name="code" class="HTML">
<div id="demo"><h2>x</h2>Drag Me</div>
</textarea>
<p>Now we give that Node some CSS to make it visible.</p>
<textarea name="code" class="CSS">
#demo {
    height: 100px;
    width: 100px;
    border: 1px solid black;
    background-color: #8DD5E7;
    padding: 7px;
}
#demo h2 {
    padding: 0;
    margin: 0;
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 110%;
    color: black;
    font-weight: bold;
    cursor: move;
}
</textarea>

<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance and tell it to load the <code>dd-plugin</code> module.</p>
<textarea name="code" class="JScript">
YUI().use('dd-plugin');
</textarea>

<h3>Making the Node draggable with the Drag Plugin</h3>
<p>Now that we have a YUI instance with the <code>dd-plugin</code> module, we need to instantiate a <code>Node</code> instance on this Node.</p>
<textarea name="code" class="JScript">
YUI().use('dd-plugin', function(Y) {
    var node = Y.get('#demo');
    node.plug(Y.plugin.Drag);
});
</textarea>

<h3>Accessing the Drag instance</h3>
<p>Now that we have a draggable Node, you can get access to the Drag Instance from the <code>dd</code> namespace on the <code>Node</code> instance.</p>
<textarea name="code" class="JScript">
YUI().use('dd-plugin', function(Y) {
    var node = Y.get('#demo');
    node.plug(Y.plugin.Drag);
    
    //Now you can only drag it from the x in the corner
    node.dd.addHandle('h2'); 
});
</textarea>
