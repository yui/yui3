(function() {

var yConfig = {
    
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    },
    debug: false
};

var Y = new YUI(yConfig).use('dd-drop', 'dd-proxy', 'dd-constrain', 'animation');

Y.on('event:ready', function() {
    //Y.DD.DDM._debugShim = true;

    var goingUp = false, lastY = 0, crossList = false;
 
    //Handle the drop:enter event
    var _dropEnter = function(e) {
        var drag = e.drag.get('node'),
            drop = e.drop.get('node'),
            middle = this.region.top + ((this.region.bottom - this.region.top) / 2);
        
        if (!goingUp && (e.drag.mouseXY[1] < middle) && !crossList) {
            drop = drop.get('nextSibling');
        }
        crossList = false;
        e.drop.get('node').get('parentNode').insertBefore(drag, drop);
        Y.DD.DDM.syncActiveShims(true);
    };

    //Handle the drag:drag event
    var _drag = function() {
        var y = this.mouseXY[1];
        if (y < lastY) {
            goingUp = true;
        } else {
            goingUp = false;
        }
        lastY = y;
    };

    //Handle the drop:hit event
    var _dropHit = function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
            }
        }
    };

    //Handle the drag:start event
    var _dragStart = function() {
        this.get('dragNode').set('innerHTML', this.get('node').get('innerHTML'));
        this.get('dragNode').setStyles({
            //opacity: '.5'
        });
        this.get('node').query('div.mod').setStyle('visibility', 'hidden');
        this.get('node').addClass('moving');
    };

    //Handle the drag:end event
    var _dragEnd = function() {
        this.get('node').setStyles({
            top: '',
            left: '',
            visibility: ''
        });
        this.get('node').query('div.mod').setStyle('visibility', '');
        this.get('node').removeClass('moving');
    };
    
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




    var _listDropOver = function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
            }
        }
    };

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
        tar.on('drop:over', _listDropOver);
    });
    

    var lis = Y.Node.get('#play').queryAll('ul.list li.item');
    Y.each(lis, function(v, k, items) {
        var node = items.item(k);
        node.on('click', _nodeClick);

        var dd = new Y.DD.Drag({
            node: node,
            proxy: true,
            constrain2node: '#play',
            target: true,
            borderStyle: 'none'
        }).addHandle('h2').addInvalid('a');
        dd.target.on('drop:enter', _dropEnter);
        dd.on('drag:drag', _drag);
        dd.on('drag:start', _dragStart);
        dd.on('drag:end', _dragEnd);
        dd.on('drag:drophit', _dropHit);
    });

});


})();
