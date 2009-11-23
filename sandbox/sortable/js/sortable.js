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
        moveType: {
            value: 'swap'
        }
    };

    S._sortables = [];
    S.getSortable = function(node) {
        var s = null;
        node = Y.one(node);
        Y.each(S._sortables, function(v) {
            if (node.test(v.get('cont'))) {
                s = v;
            }
        });
        return s;
    };
    S.regSortable = function(s) {
        S._sortables.push(s);
    };

    Y.extend(S, Y.Base, {
        delegate: null,
        _joins: null,
        _cont: null,
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
                switch (this.get('moveType')) {
                    case 'swap':
                        Y.DD.DDM.swapNode(e.drag, e.drop);
                        break;
                    case 'move':
                    case 'copy':
                        //Same List
                        if (e.drag.get('node').get('parentNode').contains(e.drop.get('node'))) {
                            Y.DD.DDM.swapNode(e.drag, e.drop);
                        } else {
                            if (this.get('moveType') == 'copy') {
                                //New List
                                var oldNode = e.drag.get('node'),
                                    newNode = oldNode.cloneNode(true),
                                    sort = Y.Sortable.getSortable(e.drop.get('node').get('parentNode'));

                                newNode.set('id', '');
                                e.drag.set('node', newNode);
                                sort.delegate.createDrop(newNode, [sort.get('id')]);
                                oldNode.setStyles({
                                    top: '',
                                    left: ''
                                });
                            }
                            e.drop.get('node').get('parentNode').insertBefore(e.drag.get('node'), e.drop.get('node'));
                        }
                        break;
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
            S.regSortable(this);
        },
        plug: function(cls, config) {
            this.delegate.plugdd(cls, config);
        },
        sync: function() {
            this.delegate.syncTargets(this.get('id'));
        },
        destructor: function() {
        },
        join: function(sel, type) {
            if (!(sel instanceof Y.Sortable)) {
                Y.error('Sortable: join needs a Sortable Instance');
                return;
            }
            if (!type) {
                type = 'full';
            }


            if (!this._joins) {
                this._joins = {};
            }
            this._joins[sel] = type;

            switch (type.toLowerCase()) {
                case 'none':
                    this.delegate.dd.removeFromGroup(sel.get('id'));
                    sel.delegate.dd.removeFromGroup(this.get('id'));
                    break;
                case 'out':
                case 'outside':
                case 'outter':
                    this.delegate.dd.addToGroup(sel.get('id'));
                    break;
                case 'in':
                case 'inside':
                case 'inner':
                    sel.delegate.dd.addToGroup(this.get('id'));
                    break;
                default: //full
                    this.delegate.dd.addToGroup(sel.get('id'));
                    sel.delegate.dd.addToGroup(this.get('id'));
                    break;
            }
        }
    });

    Y.Sortable = S;

}, '@VERSION@' ,{requires:['dd-delegate'], skinnable:false});
