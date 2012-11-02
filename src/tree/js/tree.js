/**
Provides the `Tree` class.

@module tree
**/

/**
The `Tree` class represents a generic tree data structure. A tree has a root
node, which may contain any number of child nodes, which may themselves contain
child nodes, ad infinitum.

This class doesn't expose any UI, but is extended by the `TreeView` class, which
does.

@class Tree
@param {Object} [config] Config options.
    @param {Object[]|Tree.Node[]} [config.nodes] Array of tree node config
        objects or `Tree.Node` instances to add to this tree at initialization
        time.
    @param {Object|Tree.Node} [config.rootNode] Node to use as the root node of
        this tree.
@constructor
@extends Base
**/

var Lang = Y.Lang,

    /**
    Fired when a node is added to this Tree. The `src` property will indicate
    how the node was added ("append", "insert", "prepend", etc.).

    @event add
    @param {Number} index Index at which the node will be added.
    @param {Tree.Node} node Node being added.
    @param {Tree.Node} parent Parent node to which the node will be added.
    @param {String} src Source of the event ("append", "insert", "prepend",
        etc.).
    @preventable _defAddFn
    **/
    EVT_ADD = 'add',

    /**
    Fired when this Tree is cleared.

    @event clear
    @param {Tree.Node} rootNode New root node of this tree (the old root node is
        always destroyed when a tree is cleared).
    @preventable _defClearFn
    **/
    EVT_CLEAR = 'clear',

    /**
    Fired when a node is closed.

    @event close
    @param {Tree.Node} node Node being closed.
    @preventable _defCloseFn
    **/
    EVT_CLOSE = 'close',

    /**
    Fired when a node is opened.

    @event open
    @param {Tree.Node} node Node being opened.
    @preventable _defOpenFn
    **/
    EVT_OPEN = 'open',

    /**
    Fired when a node is removed from this Tree.

    @event remove
    @param {Boolean} destroy Whether or not the node will be destroyed after
        being removed from this tree.
    @param {Tree.Node} node Node being removed.
    @param {Tree.Node} parent Parent node from which the node will be removed.
    @preventable _defRemoveFn
    **/
    EVT_REMOVE = 'remove',

    /**
    Fired when a node is selected.

    @event select
    @param {Tree.Node} node Node being selected.
    @preventable _defSelectFn
    **/
    EVT_SELECT = 'select',

    /**
    Fired when a node is unselected.

    @event unselect
    @param {Tree.Node} node Node being unselected.
    @preventable _defUnselectFn
    **/
    EVT_UNSELECT = 'unselect';

var Tree = Y.Base.create('tree', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Root node of this Tree.

    @property {Tree.Node} rootNode
    @readOnly
    **/

    /**
    The `Tree.Node` class or subclass that should be used for nodes created by
    this tree.

    You may specific an actual class reference or a string that resolves to a
    class reference at runtime.

    @property {String|Tree.Node} nodeClass
    @default Y.Tree.Node
    **/
    nodeClass: Y.Tree.Node,

    // -- Protected Properties -------------------------------------------------

    /**
    Simple way to type-check that this is a Tree instance.

    @property {Boolean} _isYUITree
    @default true
    @protected
    **/
    _isYUITree: true,

    /**
    Mapping of node ids to node instances for nodes in this tree.

    @property {Object} _nodeMap
    @protected
    **/

    /**
    Default config object for the root node.

    @property {Object} _rootNodeConfig
    @protected
    **/
    _rootNodeConfig: {canHaveChildren: true},

    /**
    Mapping of node ids to node instances for nodes in this tree that are
    currently selected.

    @property {Object} _selectedMap
    @protected
    **/

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        config || (config = {});

        /**
        Hash of published custom events.

        @property {Object} _published
        @default {}
        @protected
        **/
        this._published || (this._published = {});

        this._nodeMap = {};

        if (typeof this.nodeClass === 'string') {
            // Look for a namespaced node class on `Y`.
            this.nodeClass = Y.Object.getValue(Y, this.nodeClass.split('.'));

            if (!this.nodeClass) {
                Y.error('Tree: Node class not found: ' + this.nodeClass);
            }
        }

        this.clear(config.rootNode, {silent: true});
        this._attachTreeEvents();

        if (config.nodes) {
            this.appendNode(this.rootNode, config.nodes, {silent: true});
        }
    },

    destructor: function () {
        this.destroyNode(this.rootNode, {silent: true});

        this._detachTreeEvents();

        delete this.rootNode;
        delete this._nodeMap;
        delete this._published;
        delete this._selectedMap;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Appends a node or array of nodes as the last child of the specified parent
    node.

    If a node being appended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method appendNode
    @param {Tree.Node} parent Parent node.
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config
        object, array of child nodes, or array of node config objects to append
        to the given parent. Node config objects will automatically be converted
        into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were
        appended.
    **/
    appendNode: function (parent, node, options) {
        return this.insertNode(parent, node, Y.merge(options, {
            index: parent.children.length,
            src  : 'append'
        }));
    },

    /**
    Clears this tree by destroying the root node and all its children. If a
    `rootNode` argument is provided, that node will become the root node of this
    tree; otherwise, a new root node will be created.

    @method clear
    @param {Object|Tree.Node} [rootNode] If specified, this node will be used as
        the new root node.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `clear` event
            will be suppressed.
    @chainable
    **/
    clear: function (rootNode, options) {
        return this._fire(EVT_CLEAR, {
            rootNode: this.createNode(rootNode || this._rootNodeConfig)
        }, {
            defaultFn: this._defClearFn,
            silent   : options && options.silent
        });
    },

    /**
    Closes the specified node if it isn't already closed.

    @method closeNode
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `close` event
            will be suppressed.
    @chainable
    **/
    closeNode: function (node, options) {
        if (node.canHaveChildren && node.isOpen()) {
            this._fire(EVT_CLOSE, {node: node}, {
                defaultFn: this._defCloseFn,
                silent   : options && options.silent
            });
        }

        return this;
    },

    /**
    Creates and returns a new `Tree.Node` instance associated with (but not
    yet appended to) this tree.

    @method createNode
    @param {Object|Tree.Node} [config] Node configuration. If a `Tree.Node`
        instance is specified instead of a config object, that node will be
        adopted into this tree (if it doesn't already belong to this tree) and
        removed from any other tree to which it belongs.
    @return {Tree.Node} New node.
    **/
    createNode: function (config) {
        config || (config = {});

        // If `config` is already a node, just ensure it's in the node map and
        // return it.
        if (config._isYUITreeNode) {
            this._adoptNode(config);
            return config;
        }

        // First, create nodes for any children of this node.
        if (config.children) {
            var children = [];

            for (var i = 0, len = config.children.length; i < len; i++) {
                children.push(this.createNode(config.children[i]));
            }

            config = Y.merge(config, {children: children});
        }

        var node = new this.nodeClass(this, config);
        return this._nodeMap[node.id] = node;
    },

    /**
    Removes and destroys a node and all its child nodes. Once destroyed, a node
    is eligible for garbage collection and cannot be reused or re-added to the
    tree.

    @method destroyNode
    @param {Tree.Node} node Node to destroy.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, `remove` events will
            be suppressed.
    @chainable
    **/
    destroyNode: function (node, options) {
        var child, i, len;

        options || (options = {});

        for (i = 0, len = node.children.length; i < len; i++) {
            child = node.children[i];

            // Manually remove the child from its parent; this makes destroying
            // all children of the parent much faster since there's no splicing
            // involved.
            delete child.parent;

            // Destroy the child.
            this.destroyNode(child, options);
        }

        if (node.parent) {
            this.removeNode(node, options);
        }

        delete node.children;
        delete node.data;
        delete node.state;
        delete node.tree;
        delete node._htmlNode;
        delete node._indexMap;

        delete this._nodeMap[node.id];

        node.state = {destroyed: true};

        return this;
    },

    /**
    Removes all children from the specified node. The removed children will
    still be reusable unless the `destroy` option is truthy.

    @method emptyNode
    @param {Tree.Node} node Node to empty.
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, the children will
            also be destroyed, which makes them available for garbage collection
            and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, `remove` events will
            be suppressed.
    @return {Tree.Node[]} Array of removed child nodes.
    **/
    emptyNode: function (node, options) {
        var removed = [];

        while (node.children.length) {
            removed.push(this.removeNode(node.children[0], options));
        }

        return removed;
    },

    /**
    Returns the tree node with the specified id, or `undefined` if the node
    doesn't exist in this tree.

    @method getNodeById
    @param {String} id Node id.
    @return {Tree.Node} Node, or `undefined` if not found.
    **/
    getNodeById: function (id) {
        return this._nodeMap[id];
    },

    /**
    Returns an array of nodes that are currently selected.

    @method getSelectedNodes
    @return {Tree.Node[]} Array of selected nodes.
    **/
    getSelectedNodes: function () {
        return Y.Object.values(this._selectedMap);
    },

    /**
    Inserts a node or array of nodes at the specified index under the given
    parent node, or appends them to the parent if no index is specified.

    If a node being inserted is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method insertNode
    @param {Tree.Node} parent Parent node.
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config
        object, array of child nodes, or array of node config objects to insert
        under the given parent. Node config objects will automatically be
        converted into node instances.

    @param {Object} [options] Options.
        @param {Number} [options.index] Index at which to insert the child node.
            If not specified, the node will be appended as the last child of the
            parent.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.

    @return {Tree.Node[]} Node or array of nodes that were inserted.
    **/
    insertNode: function (parent, node, options) {
        options || (options = {});
        parent  || (parent = this.rootNode);

        var index = options.index;

        if (typeof index === 'undefined') {
            index = this.rootNode.children.length;
        }

        // If `node` is an array, recurse to insert each node it contains.
        if (Lang.isArray(node)) {
            var inserted = [];

            node = node.concat(); // avoid modifying the passed array

            for (var i = 0, len = node.length; i < len; i++) {
                inserted.push(this.insertNode(parent, node[i], options));

                if ('index' in options) {
                    options.index += 1;
                }
            }

            return inserted;
        }

        node = this.createNode(node);

        this._fire(EVT_ADD, {
            index : index,
            node  : node,
            parent: parent,
            src   : options.src || 'insert'
        }, {
            defaultFn: this._defAddFn,
            silent   : options.silent
        });

        return node;
    },

    /**
    Opens the specified node if it isn't already open.

    @method openNode
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `open` event
            will be suppressed.
    @chainable
    **/
    openNode: function (node, options) {
        if (node.canHaveChildren && !node.isOpen()) {
            this._fire(EVT_OPEN, {node: node}, {
                defaultFn: this._defOpenFn,
                silent   : options && options.silent
            });
        }

        return this;
    },

    /**
    Prepends a node or array of nodes at the beginning of the specified parent
    node.

    If a node being prepended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method prependNode
    @param {Tree.Node} parent Parent node.
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node,
        node config object, array of child nodes, or array of node config
        objects to prepend to the given parent. Node config objects will
        automatically be converted into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were
        prepended.
    **/
    prependNode: function (parent, node, options) {
        return this.insertNode(parent, node, Y.merge(options, {
            index: 0,
            src  : 'prepend'
        }));
    },

    /**
    Removes the specified node from its parent node. The removed node will still
    be reusable unless the `destroy` option is truthy.

    @method removeNode
    @param {Tree.Node} node Node to remove.
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, the node and all its
            children will also be destroyed, which makes them available for
            garbage collection and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, the `remove` event
            will be suppressed.
    @return {Tree.Node} Node that was removed.
    **/
    removeNode: function (node, options) {
        options || (options = {});

        this._fire(EVT_REMOVE, {
            destroy: !!options.destroy,
            node   : node,
            parent : node.parent,
            src    : options.src || 'remove'
        }, {
            defaultFn: this._defRemoveFn,
            silent   : options.silent
        });

        return node;
    },

    /**
    Selects the specified node.

    @method selectNode
    @param {Tree.Node} node Node to select.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `select` event
            will be suppressed.
    @chainable
    **/
    selectNode: function (node, options) {
        // Instead of calling node.isSelected(), we look for the node in this
        // tree's selectedMap, which ensures that the `select` event will fire
        // in cases such as a node being added to this tree with its selected
        // state already set to true.
        if (!this._selectedMap[node.id]) {
            this._fire(EVT_SELECT, {node: node}, {
                defaultFn: this._defSelectFn,
                silent   : options && options.silent
            });
        }

        return this;
    },

    /**
    Returns the total number of nodes in this tree, at all levels.

    Use `rootNode.children.length` to get only the number of top-level nodes.

    @method size
    @return {Number} Total number of nodes in this tree.
    **/
    size: function () {
        return this.rootNode.size();
    },

    /**
    Toggles the open/closed state of the specified node.

    @method toggleNode
    @param {Tree.Node} node Node to toggle.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, events will be
            suppressed.
    @chainable
    **/
    toggleNode: function (node, options) {
        return node.isOpen() ? this.closeNode(node, options) :
            this.openNode(node, options);
    },

    /**
    Serializes this tree to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized tree object.
    **/
    toJSON: function () {
        return this.rootNode.toJSON();
    },

    /**
    Unselects all selected nodes.

    @method unselect
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselect: function (options) {
        for (var id in this._selectedMap) {
            if (this._selectedMap.hasOwnProperty(id)) {
                this.unselectNode(this._selectedMap[id], options);
            }
        }

        return this;
    },

    /**
    Unselects the specified node.

    @method unselectNode
    @param {Tree.Node} node Node to unselect.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselectNode: function (node, options) {
        if (node.isSelected() || this._selectedMap[node.id]) {
            this._fire(EVT_UNSELECT, {node: node}, {
                defaultFn: this._defUnselectFn,
                silent   : options && options.silent
            });
        }

        return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Moves the specified node and all its children from another tree to this
    tree.

    @method _adoptNode
    @param {Tree.Node} node Node to adopt.
    @param {Object} [options] Options to pass along to `removeNode()`.
    @protected
    **/
    _adoptNode: function (node, options) {
        var oldTree = node.tree;

        if (oldTree === this) {
            return;
        }

        for (var i = 0, len = node.children.length; i < len; i++) {
            this._adoptNode(node.children[i], {silent: true});
        }

        oldTree.removeNode(node, options);

        // TODO: update selectedMap?
        delete oldTree._nodeMap[node.id];
        this._nodeMap[node.id] = node;
        node.tree = this;
    },

    _attachTreeEvents: function () {
        this._treeEvents || (this._treeEvents = []);

        this._treeEvents.push(
            this.after('multiSelectChange', this._afterMultiSelectChange)
        );
    },

    _detachTreeEvents: function () {
        (new Y.EventHandle(this._treeEvents)).detach();
        this._treeEvents = [];
    },

    /**
    Utility method for lazily publishing and firing events.

    @method _fire
    @param {String} name Event name to fire.
    @param {Object} facade Event facade.
    @param {Object} [options] Options.
        @param {Function} [options.defaultFn] Default handler for this event.
        @param {Boolean} [options.silent=false] Whether the default handler
            should be executed directly without actually firing the event.
    @chainable
    @protected
    **/
    _fire: function (name, facade, options) {
        if (options && options.silent) {
            if (options.defaultFn) {
                options.defaultFn.call(this, facade);
            }
        } else {
            if (options && options.defaultFn && !this._published[name]) {
                this._published[name] = this.publish(name, {
                    defaultFn: options.defaultFn
                });
            }

            this.fire(name, facade);
        }

        return this;
    },

    /**
    Removes the specified node from its parent node if it has one.

    @method _removeNodeFromParent
    @param {Tree.Node} node Node to remove.
    @protected
    **/
    _removeNodeFromParent: function (node) {
        var parent = node.parent,
            index;

        if (parent) {
            index = parent.indexOf(node);

            if (index > -1) {
                parent.children.splice(index, 1);
                parent._isIndexStale = true;
                delete node.parent;
            }
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterMultiSelectChange: function (e) {
        this.multiSelect = e.newVal; // for faster lookups
        this.unselect();
    },

    // -- Default Event Handlers -----------------------------------------------
    _defAddFn: function (e) {
        var node   = e.node,
            parent = e.parent;

        // Remove the node from its existing parent if it has one.
        this._removeNodeFromParent(node);

        // Add the node to its new parent at the desired index.
        node.parent = parent;
        parent.children.splice(e.index, 0, node);

        parent.canHaveChildren = true;
        parent._isIndexStale   = true;

        // If the node is marked as selected, we need go through the select
        // flow.
        if (node.isSelected()) {
            this.selectNode(node);
        }
    },

    _defClearFn: function (e) {
        var newRootNode = e.rootNode;

        if (this.rootNode) {
            this.destroyNode(this.rootNode, {silent: true});
        }

        this._nodeMap     = {};
        this._selectedMap = {};

        this._nodeMap[newRootNode.id] = newRootNode;
        this.rootNode = newRootNode;
    },

    _defCloseFn: function (e) {
        delete e.node.state.open;
    },

    _defOpenFn: function (e) {
        e.node.state.open = true;
    },

    _defRemoveFn: function (e) {
        var node = e.node;

        delete node.state.selected;
        delete this._selectedMap[node.id];

        if (e.destroy) {
            this.destroyNode(node, {silent: true});
        } else if (e.parent) {
            this._removeNodeFromParent(node);
        } else if (this.rootNode === node) {
            // Guess we'll need a new root node!
            this.rootNode = this.createNode(this._rootNodeConfig);
        }
    },

    _defSelectFn: function (e) {
        if (!this.get('multiSelect')) {
            this.unselect();
        }

        e.node.state.selected = true;
        this._selectedMap[e.node.id] = e.node;
    },

    _defUnselectFn: function (e) {
        delete e.node.state.selected;
        delete this._selectedMap[e.node.id];
    }
}, {
    ATTRS: {
        /**
        Whether or not to allow multiple nodes to be selected at once.

        @attribute {Boolean} multiSelect
        @default false
        **/
        multiSelect: {
            value: false
        },

        /**
        Root node of this treeview.

        @attribute {Tree.Node} rootNode
        @readOnly
        **/
        rootNode: {
            getter: function () {
                return this.rootNode;
            },

            readOnly: true
        }
    }
});

Y.Tree = Y.mix(Tree, Y.Tree);
