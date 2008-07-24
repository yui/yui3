<h3>Setting up the lists</h3>
<p>First we will make some lists that we want to make sortable.</p>
<textarea name="code" class="HTML">
<div id="play">
    <ul id="list1">
        <li class="list1">Item #1</li>
        <li class="list1">Item #2</li>
        <li class="list1">Item #3</li>
        <li class="list1">Item #4</li>
        <li class="list1">Item #5</li>
    </ul>
    <ul id="list2">
        <li class="list2">Item #1</li>
        <li class="list2">Item #2</li>
        <li class="list2">Item #3</li>
        <li class="list2">Item #4</li>
        <li class="list2">Item #5</li>
    </ul>
</div>
</textarea>

<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance and tell it to load the <code>dd-constrain</code>, <code>dd-proxy</code> and <code>dd-drop</code>, modules.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {
</textarea>

<h3>Making the Nodes Drag Instances and Drop Targets</h3>
<p>Now we have our YUI instance ready, we can make the list items draggable. We will do this using <code>Y.Node.all</code></p>
<p>We will be passing the selector string <code>#play ul li</code> to <code>Y.Node.all</code> to have it return us a <code>NodeList</code> of the li's in our 2 lists.
Using this selector syntax we will be able to add new list markup to the <code>#play</code> div and not have to change our code.</p>
<p>Then we will walk that <code>NodeList</code> and create our draggable Nodes.</p>
<p>Note that we are setting the following configs on the Drag instance: <code>proxy, moveOnEnd, constrain2node, target</code>.</p>
<textarea name="code" class="JScript">
//Get the list of li's in the lists and make them draggable
var lis = Y.Node.all('#play ul li');
lis.each(function(v, k, items) {
    var dd = new Y.DD.Drag({
        node: items.item(k),
        proxy: true,
        //Don't move the node at the end of the drag
        moveOnEnd: false,
        //Keep it inside the #play node
        constrain2node: '#play',
        //Make it Drop target and pass this config to the Drop constructor
        target: {
            padding: '0 0 0 20'
        }
    });
});
</textarea>

<h3>Making the List Drop Target's too</h3>
<p>We need to make the UL nodes a Drop Target so we can catch drops on the empty space of the list. 
Using this selector syntax we will be able to add new list markup to the <code>#play</code> div and not have to change our code.</p>
<textarea name="code" class="JScript">
//Create simple targets for the 2 lists..
var uls = Y.Node.all('#play ul');
uls.each(function(v, k, items) {
    var tar = new Y.DD.Drop({
        node: items.item(k)
    });
});
</textarea>

<h3>Using Event Bubbling</h3>
<p>By default, all Drag and Drop instances bubble their event's up to the DragDropMgr. In this example we are assuming that there are no other Drag Operations in this YUI Instance.</p>
<h3>Start Drag Event</h3>
<p>The first thing we will do is handle the drag:start event. In this event, we will setup some styles to apply to the <code>node</code> and <code>dragNode</code> of the current Drag instance.</p>
<p>We will also be copying the <code>innerHTML</code> of the <code>node</code> and copying that to the <code>innerHTML</code> of the <code>dragNode</code>. </p>
<p><em>It should be noted, that
doing this will also copy any <code>id</code>'s of the nodes inside the <code>node</code>. So if you are using this on something that is <code>id</code> based, you may need to remove the <code>id</code>'s
of the nodes inside the <code>node</code> that is being dragged.
</em></p>
<textarea name="code" class="JScript">
Y.DD.DDM.on('drag:start', function(e) {
    //Get our drag object
    var drag = e.target;
    //Set some styles here
    drag.get('node').setStyle('opacity', '.25');
    drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
    drag.get('dragNode').setStyles({
        opacity: '.5',
        borderColor: drag.get('node').getStyle('borderColor'),
        backgroundColor: drag.get('node').getStyle('backgroundColor')
    });
});
</textarea>

<h3>End Drag Event</h3>
<p>In this event, we will reset some of the styles set in the drag:start event.</p>
<textarea name="code" class="JScript">
Y.DD.DDM.on('drag:end', function(e) {
    var drag = e.target;
    //Put out styles back
    drag.get('node').setStyles({
        visibility: '',
        opacity: '1'
    });
});
</textarea>

<h3>Drag Event</h3>
<p>In this event, we will track the up/down movement for later use.</p>
<textarea name="code" class="JScript">
Y.DD.DDM.on('drag:drag', function(e) {
    //Get the last y point
    var y = e.target.lastXY[1];
    //is it greater than the lastY var?
    if (y &lt; lastY) {
        //We are going up
        goingUp = true;
    } else {
        //We are going down..
        goingUp = false;
    }
    //Cache for next check
    lastY = y;
});
</textarea>

<h3>Over Drop Event</h3>
<p>In this event, know which Target we are over, so we add the Drag node to the list either above or below the current Drop Target.</p>
<textarea name="code" class="JScript">
Y.DD.DDM.on('drop:over', function(e) {
    //Get a reference to out drag and drop nodes
    var drag = e.drag.get('node'),
        drop = e.drop.get('node');
    
    //Are we dropping on a li node?
    if (drop.get('tagName').toLowerCase() === 'li') {
        //Are we not going up?
        if (!goingUp) {
            drop = drop.get('nextSibling');
        }
        //Add the node to this list
        e.drop.get('node').get('parentNode').insertBefore(drag, drop);
        //Resize this nodes shim, so we can drop on it later.
        e.drop.sizeShim();
    }
});
</textarea>

<h3>Drop Hit Event</h3>
<p>In this event, we check to see if the target that was dropped on was not an LI node. If it wasn't, then we know it was dropped on the empty space of the UL.</p>
<textarea name="code" class="JScript">
Y.DD.DDM.on('drag:drophit', function(e) {
    var drop = e.drop.get('node'),
        drag = e.drag.get('node');

    //if we are not on an li, we must have been dropped on a ul
    if (drop.get('tagName').toLowerCase() !== 'li') {
        if (!drop.contains(drag)) {
            drop.appendChild(drag);
        }
    }
});
</textarea>

<h3>Full Javascript Source</h3>
<textarea name="code" class="JScript">
var Y = YUI().use('dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {
    //Listen for all drop:over events
    Y.DD.DDM.on('drop:over', function(e) {
        //Get a reference to out drag and drop nodes
        var drag = e.drag.get('node'),
            drop = e.drop.get('node');
        
        //Are we dropping on a li node?
        if (drop.get('tagName').toLowerCase() === 'li') {
            //Are we not going up?
            if (!goingUp) {
                drop = drop.get('nextSibling');
            }
            //Add the node to this list
            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
            //Resize this nodes shim, so we can drop on it later.
            e.drop.sizeShim();
        }
    });
    //Listen for all drag:drag events
    Y.DD.DDM.on('drag:drag', function(e) {
        //Get the last y point
        var y = e.target.lastXY[1];
        //is it greater than the lastY var?
        if (y &lt; lastY) {
            //We are going up
            goingUp = true;
        } else {
            //We are going down..
            goingUp = false;
        }
        //Cache for next check
        lastY = y;
    });
    //Listen for all drag:start events
    Y.DD.DDM.on('drag:start', function(e) {
        //Get our drag object
        var drag = e.target;
        //Set some styles here
        drag.get('node').setStyle('opacity', '.25');
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyles({
            opacity: '.5',
            borderColor: drag.get('node').getStyle('borderColor'),
            backgroundColor: drag.get('node').getStyle('backgroundColor')
        });
    });
    //Listen for a drag:end events
    Y.DD.DDM.on('drag:end', function(e) {
        var drag = e.target;
        //Put out styles back
        drag.get('node').setStyles({
            visibility: '',
            opacity: '1'
        });
    });
    //Listen for all drag:drophit events
    Y.DD.DDM.on('drag:drophit', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        //if we are not on an li, we must have been dropped on a ul
        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
            }
        }
    });
    
    //Static Vars
    var goingUp = false, lastY = 0;

    //Get the list of li's in the lists and make them draggable
    var lis = Y.Node.all('#play ul li');    
    lis.each(function(v, k, items) {
        var dd = new Y.DD.Drag({
            node: items.item(k),
            proxy: true,
            moveOnEnd: false,
            constrain2node: '#play',
            target: {
                padding: '0 0 0 20'
            }
        });
    });

    //Create simple targets for the 2 lists..
    var uls = Y.Node.all('#play ul');    
    uls.each(function(v, k, items) {
        var tar = new Y.DD.Drop({
            node: items.item(k)
        });
    });
    
});
</textarea>
