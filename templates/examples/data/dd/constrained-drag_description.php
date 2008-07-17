<h3>Setting up the Node</h3>
<p>First we need to create the HTML structure used in this example.</p>
<textarea name="code" class="HTML">
<div id="dd-demo-canvas1">
    <div id="dd-demo-canvas2">
        <div id="dd-demo-canvas3">
            <div id="dd-demo-1" class="dd-demo"><div>1</div></div>
            <div id="dd-demo-2" class="dd-demo"><div>2</div></div>
            <div id="dd-demo-3" class="dd-demo"><div>3</div></div>
        </div>
    </div>
</div>
</textarea>
<p>Now we give the Nodes some CSS to make them visible.</p>
<textarea name="code" class="CSS">
.dd-demo {
    position: relative;
    text-align: center;
    color: #fff;
    cursor: move;
    height: 60px;
    width: 60px;
    padding: 0;
    margin: 0;
}

.dd-demo div {
    border: 1px solid black;
    height: 58px;
    width: 58px;
}

#dd-demo-canvas1 {
    padding: 55px;
    background-color: #004C6D;
    border: 1px solid black;
}
#dd-demo-canvas2 {
    padding: 25px;
    background-color: #CDCDCD;
    border: 1px solid black;
}
#dd-demo-canvas3 {
    padding: 15px;
    background-color: #8DD5E7;
    border: 1px solid black;
}

#dd-demo-1 { 
    background-color: #8DD5E7;
    top:5px;
    left:5px;
    color: #000;
}

#dd-demo-2 { 
    background-color: #CDCDCD;
    top:50px;
    left:100px;
    color: #000;
}

#dd-demo-3 {
    background-color: #004C6D;
    top:-100px;
    left:200px;
}
</textarea>

<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance and tell it to load the <code>dd-constrain</code> module (that will load the dd-ddm and dd-drag modules too).</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-constrain');
</textarea>

<h3>Making the Nodes draggable</h3>
<p>Now that we have a YUI instance with the <code>dd-constrain</code> module, we need to instantiate the <code>Drag</code> instance on the Nodes.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-constrain');
Y.on('event:ready', function() {
    var dd1 = new Y.DD.Drag({
        node: '#dd-demo-1'
    });

    var dd2 = new Y.DD.Drag({
        node: '#dd-demo-2'
    });

    var dd3 = new Y.DD.Drag({
        node: '#dd-demo-3'
    });
});
</textarea>

<h3>Constrain the Nodes to other Nodes</h3>
<p>Now that we have the Nodes draggable, we need to constrain them. We can do this by passing another config option called <code>constrain2node</code> and giving it a selector string of the Node we want to constrain to.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-constrain');
Y.on('event:ready', function() {
    var dd1 = new Y.DD.Drag({
        node: '#dd-demo-1',
        constrain2node: '#dd-demo-canvas3'
    });

    var dd2 = new Y.DD.Drag({
        node: '#dd-demo-2',
        constrain2node: '#dd-demo-canvas2'
    });

    var dd3 = new Y.DD.Drag({
        node: '#dd-demo-3',
        constrain2node: '#dd-demo-canvas1'
    });
});
</textarea>
