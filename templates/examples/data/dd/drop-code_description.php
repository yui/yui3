<h3>Setting up the HTML</h3>
<p>First we need to create the HTML for the example.</p>
<textarea name="code" class="HTML">
<div id="play">
    <div id="drag1" class="drag">Drag #1</div>
    <div id="drag2" class="drag">Drag #2</div>
    <div id="drag3" class="drag">Drag #3</div>
    <div id="drag4" class="drag">Drag #4</div>
    <div id="drag5" class="drag">Drag #5</div>
    <div id="drop"></div>
</div>
</textarea>
<p>Now we give the HTML some CSS to make them visible.</p>
<textarea name="code" class="CSS">
.drag {
    height: 50px;
    width: 50px;
    border: 1px solid black;
    background-color: #004C6D;
    color: white;
    cursor: move;
    float: left;
    margin: 4px;
    z-index: 2;
}
#play {
    border: 1px solid black;
    height: 300px;
    position: relative;
}
#drop {
    position: absolute;
    bottom: 5px;
    right: 5px;
    border: 1px solid black;
    background-color: #8DD5E7;
    height: 75px;
    width: 65%;
    z-index: 1;
}
#drop p {
    margin: 1em;
}
#drop p strong {
    font-weight: bold;
}
#drop.yui-dd-drop-over {
    background-color: #FFA928;
}
</textarea>

<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance and tell it to load the <code>dd-drop</code> and <code>dd-constrain</code> modules.</p>
<textarea name="code" class="JScript">
YUI().use('dd-drop', 'dd-constrain');
</textarea>

<h3>Making the Nodes draggable</h3>
<p>Now that we have a YUI instance with the <code>dd-drop</code> module, we need to instantiate the <code>Drag</code> instance on each Drag Node.</p>
<p>In this example we are using the data config option of the drag to associate data with this Drag instance.</p>
<p>So we have set up an object literal containing information about our drag items.</p>
<textarea name="code" class="JScript">
    var data = {
        'drag1': { color: 'white', size: 'x-small', price: '$5.00' },
        'drag2': { color: 'blue', size: 'small', price: '$6.00' },
        'drag3': { color: 'green', size: 'medium', price: '$7.00' },
        'drag4': { color: 'red', size: 'large', price: '$10.00' },
        'drag5': { color: 'purple', size: 'x-large', price: '$15.00' }
    };
</textarea>
<p>Now we walk through the nodes and create a drag instance from each of them.</p>
<textarea name="code" class="JScript">
YUI().use('dd-drop', 'dd-constrain', function(Y) {
    //Data to attach to each drag object
    var data = {
        'drag1': { color: 'white', size: 'x-small', price: '$5.00' },
        'drag2': { color: 'blue', size: 'small', price: '$6.00' },
        'drag3': { color: 'green', size: 'medium', price: '$7.00' },
        'drag4': { color: 'red', size: 'large', price: '$10.00' },
        'drag5': { color: 'purple', size: 'x-large', price: '$15.00' }
    };
    //Get all the divs with the class drag
    var drags = Y.Node.all('#play div.drag');
    //Walk through each one
    drags.each(function(v, k) {
        //scope a local var for the data
        var thisData = {};
        //Using Y.mix to break this data from the data above
        Y.mix(thisData, data[v.get('id')]);

        //Create the new Drag Instance
        var dd = new Y.DD.Drag({
            //Give it the node
            node: v,
            //Keep it inside the work area
            constrain2node: '#play',
            //Set the dragMode to intersect
            dragMode: 'intersect',
            //Attach the data here..
            data: thisData
        });
        //Simple listener for missed drops to move it back to its start position.
        dd.on('drag:dropmiss', function() {
            this.get('node').setStyles({
                top: '',
                left: ''
            });
        });
    });
});
</textarea>


<h3>Setting up the Drop Target</h3>
<p>Here we set up the Drop Target and assign a listener to it.</p>
<textarea name="code" class="JScript">
var drop = new Y.DD.Drop({
    node: '#drop'
});
//Listen for a drop:hit on this target
drop.on('drop:hit', function(e) {
    //Now we get the drag instance that triggered the drop hit
    var drag = e.drag;
    //Reset its position
    drag.get('node').setStyles({
        top: '',
        left: ''
    });
    //get the data from it
    var data = drag.get('data');

    //Do something with the data
    var out = ['id: ' + drag.get('node').get('id')];
    Y.each(data, function(v, k) {
        out[out.length] = k + ': ' + v;
    });
    var str = '<p><strong>Dropped</strong>: ' + out.join(', ') + '</p>';
    this.get('node').set('innerHTML', str);
});
</textarea>

<h3>Full Example Source</h3>
<textarea name="code" class="JScript">
YUI().use('dd-drop', 'dd-constrain', function(Y) {
    var data = {
        'drag1': { color: 'white', size: 'x-small', price: '$5.00' },
        'drag2': { color: 'blue', size: 'small', price: '$6.00' },
        'drag3': { color: 'green', size: 'medium', price: '$7.00' },
        'drag4': { color: 'red', size: 'large', price: '$10.00' },
        'drag5': { color: 'purple', size: 'x-large', price: '$15.00' }
    };
    var drags = Y.Node.all('#play div.drag');
    drags.each(function(v, k, items) {
        var thisData = {};
        Y.mix(thisData, data[v.get('id')]);
        var dd = new Y.DD.Drag({
            node: items.item(k),
            constrain2node: '#play',
            dragMode: 'intersect',
            data: thisData
        });
        dd.on('drag:dropmiss', function() {
            this.get('node').setStyles({
                top: '',
                left: ''
            });
        });
    });

    var drop = new Y.DD.Drop({
        node: '#drop'
    });
    drop.on('drop:hit', function(e) {
        var drag = e.drag;
        drag.get('node').setStyles({
            top: '',
            left: ''
        });
        var data = drag.get('data');
        var out = ['id: ' + drag.get('node').get('id')];
        Y.each(data, function(v, k) {
            out[out.length] = k + ': ' + v;
        });
        var str = '<p><strong>Dropped</strong>: ' + out.join(', ') + '</p>';
        this.get('node').set('innerHTML', str);
    });
});
</textarea>
