<h3>Setting up the Work Area</h3>
<p>First we need to create the work area, players (drags) and slots (drops).</p>
<textarea name="code" class="HTML">
<div id="workarea">

    <div class="slot" id="t1">1</div>
    <div class="slot bottom" id="b1">3</div>
    <div class="slot bottom" id="b2">4</div>
    <div class="slot bottom" id="b3">5</div>
    <div class="slot bottom" id="b4">6</div>
    <div class="slot" id="t2">2</div>


    <div class="player" id="pt1">1</div>
    <div class="player" id="pt2">2</div>
    <div class="player" id="pb1">3</div>
    <div class="player" id="pb2">4</div>
    <div class="player" id="pboth1">5</div>
    <div class="player" id="pboth2">6</div>

</div>
</textarea>
<p>Now we give them some CSS to make them visible.</p>
<textarea name="code" class="CSS">
.slot {
    border: 2px solid #808080;
    background-color: #CDCDCD;
    color: #666666;
    text-align: center;
    position: relative;
    float: left;
    margin: 4px;
    width: 60px;
    height: 60px;
    z-index: 0;
}
.player {
    border: 2px solid #808080;
    color: #ffffff;
    text-align: center;
    position: relative;
    float: left;
    margin: 4px;
    width: 60px;
    height: 60px;
    top: 150px;
    z-index: 1;
    cursor: move;
}
#pt1 {
    clear: both;
}
.bottom {
    top: 50px;
}

#pt1, #pt2 {
    background-color: #71241A;
}
#pb1, #pb2 {
    background-color: #004C6D;
}

#pboth1, #pboth2 {
    background-color: #FFA928;
}

#workarea {
    position: relative;
    height: 300px;
}
#workarea .yui-dd-drop-active-valid {
    border: 2px solid green;
}
#workarea .yui-dd-drop-over {
    background-color: green;
}
#workarea .yui-dd-drop-active-invalid {
    border: 2px solid red;
}
</textarea>

<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance and tell it to load the <code>dd-drop</code>, <code>dd-proxy</code> and <code>dd-constrain</code> modules.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-drop', 'dd-proxy', 'dd-constrain');
</textarea>

<h3>Setting up the Drop Targets</h3>
<p>Now that we have a YUI instance with the requested modules, we are going to create our Drop Targets.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-drop', 'dd-proxy', 'dd-constrain');
Y.on('event:ready', function() {
    //Get all the nodes with the class of .slot under #workarea
    var slots = Y.Node.get('#workarea').queryAll('.slot');
    //Loop through them
    Y.each(slots, function(v, k, items) {
        var id = v.get('id'), groups = ['two'];
        //Assign them to different groups
        switch (id) {
            case 't1':
            case 't2':
                groups = ['one'];
                break;
        }
        //Create the Drop object
        var drop = new Y.DD.Drop({
            node: items.item(k),
            //With the new groups array as a config option
            groups: groups
        });
    });
});
</textarea>

<h3>Setting up the Drag Nodes</h3>
<p>Now we need to create the Drag Nodes and assign them to the proper group.</p>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-drop', 'dd-proxy', 'dd-constrain');
Y.on('event:ready', function() {
    //Snipped
    var players = Y.Node.get('#workarea').queryAll('.player');
    Y.each(players, function(v, k, items) {
        var id = v.get('id'), groups = ['one', 'two'];
        switch (id) {
            case 'pt1':
            case 'pt2':
                groups = ['one'];
                break;
            case 'pb1':
            case 'pb2':
                groups = ['two'];
                break;
        }
        var drag = new Y.DD.Drag({
            node: items.item(k),
            //This makes it a Proxy Drag
            proxy: true,
            //Assign the Groups
            groups: groups,
            //Use Intersect Mode for the Target Calculations
            dragMode: 'intersect',
            //We don't want the node to move on end drag
            moveOnEnd: false,
            //Keep me inside the workarea
            constrain2node: '#workarea'
        });
});
</textarea>
<h3>Handling the Drops and Moments</h3>
<p>Now we are going to listen for 4 Drag Events: <code>drag:start, drag:end, drag:drophit, drag:dropmiss</code></p>
<textarea name="code" class="JScript">
drag.on('drag:start', function() {
    //In this event we setup some styles to make the nodes look pretty
    var p = this.get('dragNode'),
        n = this.get('node');
        n.setStyle('opacity', .25);
        if (!this._playerStart) {
            this._playerStart = this.nodeXY;
        }
    //Put the drag's html inside the proxy
    p.set('innerHTML', n.get('innerHTML'));
    //set some styles on the proxy
    p.setStyles({
        backgroundColor: n.getStyle('backgroundColor'),
        color: n.getStyle('color'),
        opacity: .65
    });
});
drag.on('drag:end', function() {
    //Undo some of the styles from the start
    var n = this.get('node');
    n.setStyle('opacity', '1');
});
drag.on('drag:drophit', function(e) {
    //If we drop on a target, move to it's position
    var xy = e.drop.get('node').getXY();
    this.get('node').setXY(xy);
});
drag.on('drag:dropmiss', function(e) {
    //If we miss a target, move back to our start position
    if (this._playerStart) {
        this.get('node').setXY(this._playerStart);
        this._playerStart = null;
    }
});
</textarea>

<h3>Full Javascript Code</h3>
<textarea name="code" class="JScript">
var Y = new YUI().use('dd-drop', 'dd-proxy', 'dd-constrain');
Y.on('event:ready', function() {
    
    var slots = Y.Node.get('#workarea').queryAll('.slot');
    Y.each(slots, function(v, k, items) {
        var id = v.get('id'), groups = ['two'];
        switch (id) {
            case 't1':
            case 't2':
                groups = ['one'];
                break;
        }
        var drop = new Y.DD.Drop({
            node: items.item(k),
            groups: groups
        });
    });

    var players = Y.Node.get('#workarea').queryAll('.player');
    Y.each(players, function(v, k, items) {
        var id = v.get('id'), groups = ['one', 'two'];
        switch (id) {
            case 'pt1':
            case 'pt2':
                groups = ['one'];
                break;
            case 'pb1':
            case 'pb2':
                groups = ['two'];
                break;
        }
        var drag = new Y.DD.Drag({
            node: items.item(k),
            proxy: true,
            groups: groups,
            dragMode: 'intersect',
            moveOnEnd: false,
            constrain2node: '#workarea'
        });
        drag.on('drag:start', function() {
            var p = this.get('dragNode'),
                n = this.get('node');
                n.setStyle('opacity', .25);
                if (!this._playerStart) {
                    this._playerStart = this.nodeXY;
                }
            p.set('innerHTML', n.get('innerHTML'));
            p.setStyles({
                backgroundColor: n.getStyle('backgroundColor'),
                color: n.getStyle('color'),
                opacity: .65
            });
        });
        drag.on('drag:end', function() {
            var n = this.get('node');
            n.setStyle('opacity', '1');
        });
        drag.on('drag:drophit', function(e) {
            var xy = e.drop.get('node').getXY();
            this.get('node').setXY(xy);
        });
        drag.on('drag:dropmiss', function(e) {
            if (this._playerStart) {
                this.get('node').setXY(this._playerStart);
                this._playerStart = null;
            }
        });
    });


});
</textarea>
