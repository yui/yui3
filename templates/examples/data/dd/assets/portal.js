(function() {
var Y = new YUI().use('dd-drop', 'dd-proxy', 'dd-constrain', 'animation');

Y.on('event:ready', function() {
    //Y.DD.DDM._debugShim = true;

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
        
        if (!goingUp && (drag.mouseXY[1] < middle) && !crossList) {
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
        if (y < lastY) {
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
    /* {{{ */
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
    /* }}} */


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
