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
    },
    CURRENT_NODE = 'currentNode',
    OPACITY_NODE = 'opacityNode',
    ID = 'id',
    OPACITY = 'opacity',
    PARENT_NODE = 'parentNode',
    NODE = 'node';

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
        /**
        * @attribute opacity
        * @description The ocpacity to test the proxy item to when dragging.
        * @type String
        */        
        opacity: {
            value: '.75'
        },
        /**
        * @attribute opacityNode
        * @description The node to set opacity on when dragging (dragNode or currentNode). Default: currentNode.
        * @type String
        */        
        opacityNode: {
            value: 'currentNode'
        },
        /**
        * @attribute id
        * @description The id of this sortable, used to get a reference to this sortable list from another list.
        * @type String
        */        
        id: {
            value: null
        },
        /**
        * @attribute moveType
        * @description How should an item move to another list: swap, move, copy. Default: swap
        * @type String
        */        
        moveType: {
            value: 'swap'
        },
        /**
        * @attribute invalid
        * @description A selector string to test if a list item is invalid and not sortable
        * @type String
        */        
        invalid: {
            value: ''
        }
    };

    /**
    * @static
    * @property _sortables
    * @private
    * @type Array
    * @description Hash map of all Sortables on the page.
    */
    S._sortables = [];
    /**
    * @static
    * @method getSortable
    * @param {String|Node} node The node instance or selector string to use to find a Sortable instance.
    * @description Get a sortable instance back from a node reference or a selector string.
    */
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
    /**
    * @static
    * @method regSortable
    * @param Sortable s A Sortable instance.
    * @description Register a Sortable instance with the singleton to allow lookups later.
    */
    S.regSortable = function(s) {
        S._sortables.push(s);
    };

    /**
    * @static
    * @method unregSortable
    * @param Sortable s A Sortable instance.
    * @description Unregister a Sortable instance with the singleton.
    */
    S.unregSortable = function(s) {
        Y.each(S._sortables, function(v, k) {
            if (v === s) {
                S._sortables[k] = null;
                delete S._sortables[k];
            }
        });
    };

    Y.extend(S, Y.Base, {
        /**
        * @property delegate
        * @type DD.Delegate
        * @description A reference to the DD.Delegate instance.
        */
        delegate: null,
        initializer: function() {
            var id = 'sortable-' + Y.stamp({}), c,
                self = this,
                del = new Y.DD.Delegate({
                    cont: self.get('cont'),
                    nodes: self.get('nodes'),
                    target: true,
                    invalid: self.get('invalid'),
                    dragConfig: {
                        groups: [ id ]
                    }
                });

            self.set(ID, id);

            del.dd.plug(Y.Plugin.DDProxy, {
                moveOnEnd: false,
                cloneNode: true
            });

            c = new Y.DD.Drop({
                node: self.get('cont'),
                bubbles: del,
                groups: del.dd.get('groups')
            }).on('drop:over', Y.bind(self._handleDropOver, self));

            del.on('drag:start', Y.bind(self._handleDragStart, self));
            del.on('drag:end', Y.bind(self._handleDragEnd, self));
            del.on('drag:over', Y.bind(self._handleDragOver, self));

            self.delegate = del;
            S.regSortable(self);
        },
        /**
        * @private
        * @method _handleDropOver
        * @param Event e The Event Object
        * @description Handles the DropOver event to append a drop node to an empty target
        */
        _handleDropOver: function(e) {
            if (!e.drop.get(NODE).test(this.get('nodes'))) {
                var nodes = e.drop.get(NODE).all(this.get('nodes'));
                if (nodes.size() === 0) {
                    e.drop.get(NODE).append(e.drag.get(NODE));
                }
            }
        },
        /**
        * @private
        * @method _handleDragOver
        * @param Event e The Event Object
        * @description Handles the DragOver event that moves the object in the list or to another list.
        */
        _handleDragOver: function(e) {
            if (!e.drop.get(NODE).test(this.get('nodes'))) {
                return;
            }
            if (e.drag.get(NODE) == e.drop.get(NODE)) {
                return;
            }
            switch (this.get('moveType')) {
                case 'swap':
                    Y.DD.DDM.swapNode(e.drag, e.drop);
                    break;
                case 'move':
                case 'copy':
                    var dropsort = Y.Sortable.getSortable(e.drop.get(NODE).get(PARENT_NODE)),
                        oldNode, newNode;

                    Y.DD.DDM.getDrop(e.drag.get(NODE)).addToGroup(dropsort.get('id'));

                    //Same List
                    if (e.drag.get(NODE).get(PARENT_NODE).contains(e.drop.get(NODE))) {
                        Y.DD.DDM.swapNode(e.drag, e.drop);
                    } else {
                        if (this.get('moveType') == 'copy') {
                            //New List
                            oldNode = e.drag.get(NODE);
                            newNode = oldNode.cloneNode(true);

                            newNode.set(ID, '');
                            e.drag.set(NODE, newNode);
                            dropsort.delegate.createDrop(newNode, [dropsort.get(ID)]);
                            oldNode.setStyles({
                                top: '',
                                left: ''
                            });
                        }
                        e.drop.get(NODE).get(PARENT_NODE).insertBefore(e.drag.get(NODE), e.drop.get(NODE));
                    }
                    break;
            }
        },
        /**
        * @private
        * @method _handleDragStart
        * @param Event e The Event Object
        * @description Handles the DragStart event and initializes some settings.
        */
        _handleDragStart: function(e) {
            this.delegate.get('lastNode').setStyle('zIndex', '');
            this.delegate.get(this.get(OPACITY_NODE)).setStyle(OPACITY, this.get(OPACITY));
            this.delegate.get(CURRENT_NODE).setStyle('zIndex', '999');
        },
        /**
        * @private
        * @method _handleDragEnd
        * @param Event e The Event Object
        * @description Handles the DragEnd event that cleans up the settings in the drag:start event.
        */
        _handleDragEnd: function(e) {
            this.delegate.get(this.get(OPACITY_NODE)).setStyle(OPACITY, 1);
            this.delegate.get(CURRENT_NODE).setStyles({
                top: '',
                left: ''
            });
        },
        /**
        * @method plug
        * @param Class cls The class to plug
        * @param Object config The class config
        * @description Passthrough to the DD.Delegate.ddplug method
        * @chainable
        */
        plug: function(cls, config) {
            this.delegate.dd.plug(cls, config);
            return this;
        },
        /**
        * @method plug
        * @description Passthrough to the DD.Delegate syncTargets method.
        * @chainable
        */
        sync: function() {
            this.delegate.syncTargets(this.get(ID));
            return this;
        },
        destructor: function() {
            this.delegate.destroy();
            S.unregSortable(this);
        },
        /**
        * @method join
        * @param Sortable sel The sortable list to join with
        * @param String type The type of join to do: full, inner, outer. Default: full
        * @description Join this Sortable with another Sortable instance.
        * <ul>
        *   <li>Full: Exchange nodes with both lists.</li>
        *   <li>Inner: Items can go into this list from the joined list.</li>
        *   <li>Outer: Items can go out of the joined list into this list.</li>
        * </ul>
        * @chainable
        */
        join: function(sel, type) {
            if (!(sel instanceof Y.Sortable)) {
                Y.error('Sortable: join needs a Sortable Instance');
                return this;
            }
            if (!type) {
                type = 'full';
            }

            switch (type.toLowerCase()) {
                case 'none':
                    this.delegate.dd.removeFromGroup(sel.get(ID));
                    sel.delegate.dd.removeFromGroup(this.get(ID));
                    break;
                case 'out':
                case 'outside':
                case 'outter':
                case 'outer':
                    this.delegate.dd.addToGroup(sel.get(ID));
                    break;
                case 'in':
                case 'inside':
                case 'inner':
                    sel.delegate.dd.addToGroup(this.get(ID));
                    break;
                default: //full
                    this.delegate.dd.addToGroup(sel.get(ID));
                    sel.delegate.dd.addToGroup(this.get(ID));
                    break;
            }
            return this;
        }
    });

    Y.Sortable = S;



}, '@VERSION@' ,{requires:['dd-delegate', 'dd-drop-plugin', 'dd-proxy']});
