<style type="text/css" media="screen">
    .yui-dd-proxy {
        text-align: left;
    }
    #play {
        border: 1px solid black;
        padding: 10px;
        margin: 10px;
        zoom: 1;
    }
    #play:after { display: block; clear: both; visibility: hidden; content: '.'; height: 0;}
    #play ul li {
        margin: 2px;
    }
    #play ul {
        border: 1px solid black;
        margin: 10px;
        width: 200px;
        height: 300px;
        float: left;
        padding: 0;

    }
    #play ul li {
        list-style-type: none;
        padding-left: 20px;
        padding: 5px;
        margin: 2px;
        cursor: move;
        zoom: 1;
    }
    li.list1 {
        background-color: #8DD5E7;
        border:1px solid #004C6D;
    }
    li.list2 {
        background-color: #EDFF9F;
        border:1px solid #CDCDCD;
    }
</style>

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

<script type="text/javascript">
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
        if (y < lastY) {
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

</script>

