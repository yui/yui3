YUI.add('sortable', function(Y) {

    /**
     * Sortable List.
     * @module sortable
     */     
    /**
     * Sortable Lists.
     * @class Sortable
     * @extends Base
     * @constructor
     */


    var S = function(o) {
        S.superclass.constructor.apply(this, arguments);
    };

    S.NAME = 'sortable';

    S.ATTRS = {
        /**
        * @attribute cont
        * @description A selector query to get the container to listen for mousedown events on. All "nodes" should be a child of this container.
        * @type String
        */    
        cont: {
            value: 'body'
        },
        /**
        * @attribute nodes
        * @description A selector query to get the children of the "container" to make draggable elements from.
        * @type String
        */        
        nodes: {
            value: '.dd-draggable'
        },
        opacity: {
            value: '.75'
        },
        id: {
            value: null
        },
        swap: {
            value: true
        }
    };

    Y.extend(S, Y.Base, {
        delegate: null,
        initializer: function() {
            var id = 'sortable-' + Y.stamp({}),
                del = new Y.DD.Delegate({
                    cont: this.get('cont'),
                    nodes: this.get('nodes'),
                    target: true,
                    dragConfig: {
                        groups: [ id ]
                    }
                });

            this.set('id', id);

            del.plugdd(Y.Plugin.DDProxy, {
                moveOnEnd: false,
                cloneNode: true
            });
            
            this._cont = new Y.DD.Drop({
                node: this.get('cont'),
                bubbles: del,
                groups: del.dd.get('groups')
            }).on('drop:over', Y.bind(function(e) {
                if (!e.drop.get('node').test(this.get('nodes'))) {
                    var nodes = e.drop.get('node').all(this.get('nodes'));
                    if (nodes.size() == 0) {
                        e.drop.get('node').append(e.drag.get('node'));
                    }
                }
            }, this));

            del.on('drag:start', Y.bind(function(e) {
                del.get('lastNode').setStyle('zIndex', '');
                del.get('dragNode').setStyle('opacity', this.get('opacity'));
                del.get('currentNode').setStyle('zIndex', '999');
            }, this));

            del.on('drag:over', Y.bind(function(e) {

                if (!e.drop.get('node').test(this.get('nodes'))) {
                    return;
                }
                if (e.drag.get('node') == e.drop.get('node')) {
                    return;
                }
                if (this.get('swap')) {
                    Y.DD.DDM.swapNode(e.drag, e.drop);
                } else {
                    if (e.drag.get('node').get('parentNode').contains(e.drop.get('node'))) {
                        Y.DD.DDM.swapNode(e.drag, e.drop);
                    } else {
                        e.drop.get('node').get('parentNode').insertBefore(e.drag.get('node'), e.drop.get('node'));
                    }
                }
            }, this));

            del.on('drag:end', Y.bind(function(e) {
                del.get('dragNode').setStyle('opacity', 1);
                del.get('currentNode').setStyles({
                    top: '',
                    left: ''
                });
            }, this));
            this.delegate = del;
        },
        plug: function(cls, config) {
            this.delegate.plugdd(cls, config);
        },
        sync: function() {
            this.delegate.syncTargets();
        },
        destructor: function() {
        },
        join: function(sel, type) {
            if (!(sel instanceof Y.Sortable)) {
                Y.error('Sortable: join needs a Sortable Instance');
                return;
            }

            console.log('Type: ', type);

            switch (type) {
                case 'inner':
                    this.delegate.dd.addToGroup(sel.get('id'));
                    this.delegate.syncTargets();
                    break;
                case 'outter':
                    sel.delegate.dd.addToGroup(this.get('id'));
                    sel.delegate.syncTargets();
                    break;
                default: //full
                    this.delegate.dd.addToGroup(sel.get('id'));
                    this.delegate.syncTargets();
                    sel.delegate.dd.addToGroup(this.get('id'));
                    sel.delegate.syncTargets();
                    break;
            }
        }
        /*
        bindTo: function(sel, swap) {
            if (!(sel instanceof Y.Sortable)) {
                Y.error('Sortable: bindTo needs a Sortable Instance');
                return;
            }
            sel.delegate.dd.addToGroup(this.get('id'));
            this.delegate.syncTargets();
        },
        unBindTo: function(sel) {
            if (!(sel instanceof Y.Sortable)) {
                Y.error('Sortable: unBindTo needs a Sortable Instance');
                return;
            }
            sel.delegate.dd.removeFromGroup(this.get('id'));
            this.delegate.syncTargets();
        },
        bindWith: function(sel) {
            if (!(sel instanceof Y.Sortable)) {
                Y.error('Sortable: bindWith needs a Sortable Instance');
                return;
            }
            this.delegate.dd.addToGroup(sel.get('id'));
            this.bindTo(sel);
        },
        unBindWith: function(sel) {
            if (!(sel instanceof Y.Sortable)) {
                Y.error('Sortable: unBindWith needs a Sortable Instance');
                return;
            }
            this.delegate.dd.removeFromGroup(sel.get('id'));
            this.unBindTo(sel);
        }
        */
    });

    Y.Sortable = S;

}, '@VERSION@' ,{requires:['dd-delegate'], skinnable:false});
