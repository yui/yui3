<h3>Setting up the HTML</h3>
<p>First we are going to setup our "modules" to look like this. The <code>UL</code> being the column that it belongs to and the <code>LI</code> being the module we are dragging.</p>
<textarea name="code" class="HTML">
<div id="play">
    <ul class="list" id="list1">
        <li class="item">
            <div class="mod">
                <h2>Item Title #1-1 <a title="minimize module" class="min" href="#"> </a>
                <a title="close module" class="close" href="#"></a></h2>
                <div class="inner">
                    <ul>
                        <li>Item #1-1</li>
                        <li>Item #1-2</li>      
                        <li>Item #1-3</li>
                        <li>Item #1-4</li>
                        <li>Item #1-5</li>
                    </ul>
                </div>
            </div>
        </li>
    </ul>
</div>

</textarea>

<h3>Setting up the YUI Instance</h3>
<p>Now we need to create our YUI instance and tell it to load the <code>dd-drop</code>, <code>dd-proxy</code>, <code>dd-constrain</code> and <code>animation</code> modules.</p>
<textarea name="code" class="JScript">
var Y = YUI().use('dd-drop', 'dd-proxy', 'dd-constrain', 'animation');
</textarea>

<h3>Setting up the Drag</h3>
<p>First we need to make the "module" draggable.</p>
<textarea name="code" class="JScript">
var lis = Y.Node.get('#play').queryAll('ul.list li.item');
Y.each(lis, function(v, k, items) {
    var node = items.item(k);

    var dd = new Y.DD.Drag({
        node: node,
        proxy: true,
        moveOnEnd: false,
        constrain2node: '#play',
        target: true,
        borderStyle: 'none'
    }).addHandle('h2').addInvalid('a');
});
</textarea>

<h3>Makeing the UL A Target</h3>
<p>To catch column jumps and empty column drops we need to make the UL's Drop Targets as well.</p>
<textarea name="code" class="JScript">
//Create simple targets for the main lists..
var uls = Y.Node.get('#play').queryAll('ul.list');
Y.each(uls, function(v, k, items) {
    var tar = new Y.DD.Drop({
        node: items.item(k),
        padding: '10'
    });
    tar.on('drop:enter', function() {
        crossList = true;
    });
});
</textarea>


<h3>Using Event Bubbling</h3>
<p>By default, all Drag and Drop instances bubble their event's up to the DragDropMgr. In this example we are assuming that there are no other Drag Operations in this YUI Instance.</p>

<h3>Start Drag</h3>
<p>Use some CSS here to make our dragging better looking.</p>
<textarea name="code" class="JScript">
    //Handle the drag:start event
    Y.DD.DDM.on('drag:start', function(e) {
        var drag = e.target;
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyle('opacity','.5');
        drag.get('node').query('div.mod').setStyle('visibility', 'hidden');
        drag.get('node').addClass('moving');
    });
</textarea>

<h3>End Drag</h3>
<p>Replace some of the styles we changed on start drag.</p>
<textarea name="code" class="JScript">
//Handle the drag:end event
Y.DD.DDM.on('drag:end', function(e) {
    var drag = e.target;
    drag.get('node').setStyle('visibility', '');
    drag.get('node').query('div.mod').setStyle('visibility', '');
    drag.get('node').removeClass('moving');
});
</textarea>

<h3>Drag Event</h3>
<p>On drag we need to know if they are moved up or down so we can place the module in the proper DOM location.</p>
<textarea name="code" class="JScript">
//Handle the drag:drag event
Y.DD.DDM.on('drag:drag', function(e) {
    var y = e.target.mouseXY[1];
    if (y &lt; lastY) {
        goingUp = true;
    } else {
        goingUp = false;
    }
    lastY = y;
});
</textarea>

<h3>Drop Enter</h3>
<p>Now when we get a drop enter event, we check to see if the target is an LI, then we know it's out module.</p>
<p>Here is where we move the module around in the DOM.</p>
<textarea name="code" class="JScript">
//Handle the drop:enter event
Y.DD.DDM.on('drop:enter', function(e) {
    if (!e.drag || !e.drop) {
        return false;
    }
    var drag = e.drag, drop = e.drop,
        dragNode = drag.get('node'),
        dropNode = drop.get('node'),
        middle = drop.region.top + ((drop.region.bottom - drop.region.top) / 2);
    
    if (!goingUp && (drag.mouseXY[1] &lt; middle) && !crossList) {
        dropNode = dropNode.get('nextSibling');
    }
    crossList = false;
    if (dropNode.get('parentNode')) {
        dropNode.get('parentNode').insertBefore(dragNode, dropNode);
    }
    Y.DD.DDM.syncActiveShims(true);
});
</textarea>

<h3>Drop Hit Event</h3>
<p>Now that we have a drop on the target, we check to see if the drop was not on a LI.</p>
<p>This means they dropped on the empty space of the UL.</p>
<textarea name="code" class="JScript">
//Handle the drop:hit event
Y.DD.DDM.on('drag:drophit', function(e) {
    var drop = e.drop.get('node'),
        drag = e.drag.get('node');

    if (drop.get('tagName').toLowerCase() !== 'li') {
        if (!drop.contains(drag)) {
            drop.appendChild(drag);
        }
    }
});
</textarea>

<h3>Handling Node expand, collapse and close</h3>
<p>Now we add a listener back on our node for a click.</p>
<textarea name="code" class="JScript">
//Snippet
var node = items.item(k);
node.on('click', _nodeClick);

var dd = new Y.DD.Drag({



//Handle the node:click event
var _nodeClick = function(e) {
    if (e.target.test('a')) {
        //e.halt();
        var a = e.target;
        var div = a.get('parentNode').get('parentNode');
        if (a.hasClass('min')) {
            var ul = div.query('ul'),
                h2 = div.query('h2'),
            h = h2.get('offsetHeight'),
            hUL = ul.get('offsetHeight'),
            inner = div.query('div.inner');

            var anim = new Y.Anim({
                node: inner
            });
            if (!div.hasClass('minned')) {
                anim.setAtts({
                    to: {
                        height: 0
                    },
                    duration: .5,
                    iteration: 1
                });
                anim.on('end', function() {
                    div.toggleClass('minned');
                });
            } else {
                anim.setAtts({
                    to: {
                        height: (hUL)
                    },
                    duration: .5,
                    iteration: 1
                });
                div.toggleClass('minned');
            }
            anim.run();

        }
        if (a.hasClass('close')) {
            var li = div.get('parentNode');
            var id = li.get('id');
            var dd = Y.DD.DDM.getDrag('#' + id);
            dd.destroy();
            var anim = new Y.Anim({
                node: div,
                to: {
                    opacity: 0
                },
                duration: .5
            });
            anim.on('end', function() {
                var anim = new Y.Anim({
                    node: div,
                    to: {
                        height: 0
                    },
                    duration: .5
                });
                anim.on('end', function() {
                    li.get('parentNode').removeChild(li);
                });
                anim.run();
            });
            anim.run();
        }
        e.halt();
    }
};
</textarea>

<h3>Full Source</h3>
<textarea name="code" class="JScript">
(function() {
var Y = YUI().use('dd-drop', 'dd-proxy', 'dd-constrain', 'animation', function(Y) {
    var goingUp = false, lastY = 0, crossList = false;
 
    //Handle the drop:enter event
    Y.DD.DDM.on('drop:enter', function(e) {
        if (!e.drag || !e.drop) {
            return false;
        }
        var drag = e.drag, drop = e.drop,
            dragNode = drag.get('node'),
            dropNode = drop.get('node'),
            middle = drop.region.top + ((drop.region.bottom - drop.region.top) / 2);
        
        if (!goingUp && (drag.mouseXY[1] &lt; middle) && !crossList) {
            dropNode = dropNode.get('nextSibling');
        }
        crossList = false;
        if (dropNode.get('parentNode')) {
            dropNode.get('parentNode').insertBefore(dragNode, dropNode);
        }
        Y.DD.DDM.syncActiveShims(true);
    });

    //Handle the drag:drag event
    Y.DD.DDM.on('drag:drag', function(e) {
        var y = e.target.mouseXY[1];
        if (y &lt; lastY) {
            goingUp = true;
        } else {
            goingUp = false;
        }
        lastY = y;
    });

    //Handle the drop:hit event
    Y.DD.DDM.on('drag:drophit', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
            }
        }
    });

    //Handle the drag:start event
    Y.DD.DDM.on('drag:start', function(e) {
        var drag = e.target;
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyle('opacity','.5');
        drag.get('node').query('div.mod').setStyle('visibility', 'hidden');
        drag.get('node').addClass('moving');
    });

    //Handle the drag:end event
    Y.DD.DDM.on('drag:end', function(e) {
        var drag = e.target;
        drag.get('node').setStyle('visibility', '');
        drag.get('node').query('div.mod').setStyle('visibility', '');
        drag.get('node').removeClass('moving');
    });
    
    //Handle the node:click event
    var _nodeClick = function(e) {
        if (e.target.test('a')) {
            //e.halt();
            var a = e.target;
            var div = a.get('parentNode').get('parentNode');
            if (a.hasClass('min')) {
                var ul = div.query('ul'),
                    h2 = div.query('h2'),
                h = h2.get('offsetHeight'),
                hUL = ul.get('offsetHeight'),
                inner = div.query('div.inner');

                var anim = new Y.Anim({
                    node: inner
                });
                if (!div.hasClass('minned')) {
                    anim.setAtts({
                        to: {
                            height: 0
                        },
                        duration: .5,
                        iteration: 1
                    });
                    anim.on('end', function() {
                        div.toggleClass('minned');
                    });
                } else {
                    anim.setAtts({
                        to: {
                            height: (hUL)
                        },
                        duration: .5,
                        iteration: 1
                    });
                    div.toggleClass('minned');
                }
                anim.run();

            }
            if (a.hasClass('close')) {
                var li = div.get('parentNode');
                var id = li.get('id');
                var dd = Y.DD.DDM.getDrag('#' + id);
                dd.destroy();
                var anim = new Y.Anim({
                    node: div,
                    to: {
                        opacity: 0
                    },
                    duration: .5
                });
                anim.on('end', function() {
                    var anim = new Y.Anim({
                        node: div,
                        to: {
                            height: 0
                        },
                        duration: .5
                    });
                    anim.on('end', function() {
                        li.get('parentNode').removeChild(li);
                    });
                    anim.run();
                });
                anim.run();
            }
            e.halt();
        }
    };


    Y.DD.DDM.on('drop:over', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
            }
        }
    });

    //Create simple targets for the main lists..
    
    var uls = Y.Node.get('#play').queryAll('ul.list');
    Y.each(uls, function(v, k, items) {
        var tar = new Y.DD.Drop({
            node: items.item(k),
            padding: '10'
        });
        tar.on('drop:enter', function() {
            crossList = true;
        });
    });
    

    var lis = Y.Node.get('#play').queryAll('ul.list li.item');
    Y.each(lis, function(v, k, items) {
        var node = items.item(k);
        node.on('click', _nodeClick);

        var dd = new Y.DD.Drag({
            node: node,
            proxy: true,
            moveOnEnd: false,
            constrain2node: '#play',
            target: true,
            borderStyle: 'none'
        }).addHandle('h2').addInvalid('a');
    });

});

})();
</textarea>

