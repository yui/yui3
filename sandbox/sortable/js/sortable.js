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
                    e.drop.get('node').append(e.drag.get('node'));
                }
            }, this));

            del.on('drag:start', Y.bind(function(e) {
                del.get('lastNode').setStyle('zIndex', '');
                del.get('dragNode').setStyle('opacity', this.get('opacity'));
                del.get('currentNode').setStyle('zIndex', '999');
            }, this));

            del.on('drag:over', Y.bind(function(e) {
                var dp = e.drop.get('node'),
                    dg = e.drag.get('node');
                if (!dp.test(this.get('nodes'))) {
                    return;
                }
                if (dg === dp) {
                    return;
                }
                if (this.get('swap')) {
                    Y.DD.DDM.swapNode(dg, dp);
                } else {
                    if (dg.get('parentNode').contains(dp)) {
                        Y.DD.DDM.swapNode(dg, dp);
                    } else {
                        //Another List
                        dp.get('parentNode').insertBefore(dg, dp);
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
    });

    Y.Sortable = S;

}, '@VERSION@' ,{requires:['dd-delegate'], skinnable:false});
