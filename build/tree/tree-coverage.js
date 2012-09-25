if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/tree/tree.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tree/tree.js",
    code: []
};
_yuitest_coverage["build/tree/tree.js"].code=["YUI.add('tree', function (Y, NAME) {","","/**","Provides the `Tree` class.","","@module tree","**/","","/**","The `Tree` class represents a generic tree data structure. A tree has a root","node, which may contain any number of child nodes, which may themselves contain","child nodes, ad infinitum.","","This class doesn't expose any UI, but is extended by the `TreeView` class, which","does.","","@class Tree","@param {Object} [config] Config options.","    @param {Object[]|Tree.Node[]} [config.nodes] Array of tree node config","        objects or `Tree.Node` instances to add to this tree at initialization","        time.","    @param {Object|Tree.Node} [config.rootNode] Node to use as the root node of","        this tree.","@constructor","@extends Base","**/","","var Lang = Y.Lang,","","    /**","    Fired when a node is added to this Tree. The `src` property will indicate","    how the node was added (\"append\", \"insert\", \"prepend\", etc.).","","    @event add","    @param {Number} index Index at which the node will be added.","    @param {Tree.Node} node Node being added.","    @param {Tree.Node} parent Parent node to which the node will be added.","    @param {String} src Source of the event (\"append\", \"insert\", \"prepend\",","        etc.).","    @preventable _defAddFn","    **/","    EVT_ADD = 'add',","","    /**","    Fired when this Tree is cleared.","","    @event clear","    @param {Tree.Node} rootNode New root node of this tree (the old root node is","        always destroyed when a tree is cleared).","    @preventable _defClearFn","    **/","    EVT_CLEAR = 'clear',","","    /**","    Fired when a node is closed.","","    @event close","    @param {Tree.Node} node Node being closed.","    @preventable _defCloseFn","    **/","    EVT_CLOSE = 'close',","","    /**","    Fired when a node is opened.","","    @event open","    @param {Tree.Node} node Node being opened.","    @preventable _defOpenFn","    **/","    EVT_OPEN = 'open',","","    /**","    Fired when a node is removed from this Tree.","","    @event remove","    @param {Boolean} destroy Whether or not the node will be destroyed after","        being removed from this tree.","    @param {Tree.Node} node Node being removed.","    @param {Tree.Node} parent Parent node from which the node will be removed.","    @preventable _defRemoveFn","    **/","    EVT_REMOVE = 'remove',","","    /**","    Fired when a node is selected.","","    @event select","    @param {Tree.Node} node Node being selected.","    @preventable _defSelectFn","    **/","    EVT_SELECT = 'select',","","    /**","    Fired when a node is unselected.","","    @event unselect","    @param {Tree.Node} node Node being unselected.","    @preventable _defUnselectFn","    **/","    EVT_UNSELECT = 'unselect';","","var Tree = Y.Base.create('tree', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Root node of this Tree.","","    @property {Tree.Node} rootNode","    @readOnly","    **/","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a Tree instance.","","    @property {Boolean} _isYUITree","    @default true","    @protected","    **/","    _isYUITree: true,","","    /**","    Mapping of node ids to node instances for nodes in this tree.","","    @property {Object} _nodeMap","    @protected","    **/","","    /**","    Default config object for the root node.","","    @property {Object} _rootNodeConfig","    @protected","    **/","    _rootNodeConfig: {canHaveChildren: true},","","    /**","    Mapping of node ids to node instances for nodes in this tree that are","    currently selected.","","    @property {Object} _selectedMap","    @protected","    **/","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        config || (config = {});","","        /**","        Hash of published custom events.","","        @property {Object} _published","        @default {}","        @protected","        **/","        this._published || (this._published = {});","","        this._nodeMap = {};","","        this.clear(config.rootNode, {silent: true});","        this._attachTreeEvents();","","        if (config.nodes) {","            this.appendNode(this.rootNode, config.nodes, {silent: true});","        }","    },","","    destructor: function () {","        this.destroyNode(this.rootNode, {silent: true});","","        this._detachTreeEvents();","","        delete this.rootNode;","        delete this._nodeMap;","        delete this._published;","        delete this._selectedMap;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends a node or array of nodes as the last child of the specified parent","    node.","","    If a node being appended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method appendNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to append","        to the given parent. Node config objects will automatically be converted","        into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        appended.","    **/","    appendNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: parent.children.length,","            src  : 'append'","        }));","    },","","    /**","    Clears this tree by destroying the root node and all its children. If a","    `rootNode` argument is provided, that node will become the root node of this","    tree; otherwise, a new root node will be created.","","    @method clear","    @param {Object|Tree.Node} [rootNode] If specified, this node will be used as","        the new root node.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `clear` event","            will be suppressed.","    @chainable","    **/","    clear: function (rootNode, options) {","        return this._fire(EVT_CLEAR, {","            rootNode: this.createNode(rootNode || this._rootNodeConfig)","        }, {","            defaultFn: this._defClearFn,","            silent   : options && options.silent","        });","    },","","    /**","    Closes the specified node if it isn't already closed.","","    @method closeNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `close` event","            will be suppressed.","    @chainable","    **/","    closeNode: function (node, options) {","        if (node.canHaveChildren && node.isOpen()) {","            this._fire(EVT_CLOSE, {node: node}, {","                defaultFn: this._defCloseFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Creates and returns a new `Tree.Node` instance associated with (but not","    yet appended to) this tree.","","    @method createNode","    @param {Object|Tree.Node} [config] Node configuration. If a `Tree.Node`","        instance is specified instead of a config object, that node will be","        adopted into this tree (if it doesn't already belong to this tree) and","        removed from any other tree to which it belongs.","    @return {Tree.Node} New node.","    **/","    createNode: function (config) {","        config || (config = {});","","        // If `config` is already a node, just ensure it's in the node map and","        // return it.","        if (config._isYUITreeNode) {","            this._adoptNode(config);","            return config;","        }","","        // First, create nodes for any children of this node.","        if (config.children) {","            var children = [];","","            for (var i = 0, len = config.children.length; i < len; i++) {","                children.push(this.createNode(config.children[i]));","            }","","            config = Y.merge(config, {children: children});","        }","","        var node = new Y.Tree.Node(this, config);","        return this._nodeMap[node.id] = node;","    },","","    /**","    Removes and destroys a node and all its child nodes. Once destroyed, a node","    is eligible for garbage collection and cannot be reused or re-added to the","    tree.","","    @method destroyNode","    @param {Tree.Node} node Node to destroy.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @chainable","    **/","    destroyNode: function (node, options) {","        var child, i, len;","","        options || (options = {});","","        for (i = 0, len = node.children.length; i < len; i++) {","            child = node.children[i];","","            // Manually remove the child from its parent; this makes destroying","            // all children of the parent much faster since there's no splicing","            // involved.","            delete child.parent;","","            // Destroy the child.","            this.destroyNode(child, options);","        }","","        if (node.parent) {","            this.removeNode(node, options);","        }","","        delete node.children;","        delete node.data;","        delete node.state;","        delete node.tree;","        delete node._htmlNode;","        delete node._indexMap;","","        delete this._nodeMap[node.id];","","        node.state = {destroyed: true};","","        return this;","    },","","    /**","    Removes all children from the specified node. The removed children will","    still be reusable unless the `destroy` option is truthy.","","    @method emptyNode","    @param {Tree.Node} node Node to empty.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {Tree.Node[]} Array of removed child nodes.","    **/","    emptyNode: function (node, options) {","        var removed = [];","","        while (node.children.length) {","            removed.push(this.removeNode(node.children[0], options));","        }","","        return removed;","    },","","    /**","    Returns the tree node with the specified id, or `undefined` if the node","    doesn't exist in this tree.","","    @method getNodeById","    @param {String} id Node id.","    @return {Tree.Node} Node, or `undefined` if not found.","    **/","    getNodeById: function (id) {","        return this._nodeMap[id];","    },","","    /**","    Returns an array of nodes that are currently selected.","","    @method getSelectedNodes","    @return {Tree.Node[]} Array of selected nodes.","    **/","    getSelectedNodes: function () {","        return Y.Object.values(this._selectedMap);","    },","","    /**","    Inserts a node or array of nodes at the specified index under the given","    parent node, or appends them to the parent if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insertNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to insert","        under the given parent. Node config objects will automatically be","        converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {Tree.Node[]} Node or array of nodes that were inserted.","    **/","    insertNode: function (parent, node, options) {","        options || (options = {});","        parent  || (parent = this.rootNode);","","        var index = options.index;","","        if (typeof index === 'undefined') {","            index = this.rootNode.children.length;","        }","","        // If `node` is an array, recurse to insert each node it contains.","        if (Lang.isArray(node)) {","            var inserted = [];","","            node = node.concat(); // avoid modifying the passed array","","            for (var i = 0, len = node.length; i < len; i++) {","                inserted.push(this.insertNode(parent, node[i], options));","","                if ('index' in options) {","                    options.index += 1;","                }","            }","","            return inserted;","        }","","        node = this.createNode(node);","","        this._fire(EVT_ADD, {","            index : index,","            node  : node,","            parent: parent,","            src   : options.src || 'insert'","        }, {","            defaultFn: this._defAddFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Opens the specified node if it isn't already open.","","    @method openNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `open` event","            will be suppressed.","    @chainable","    **/","    openNode: function (node, options) {","        if (node.canHaveChildren && !node.isOpen()) {","            this._fire(EVT_OPEN, {node: node}, {","                defaultFn: this._defOpenFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Prepends a node or array of nodes at the beginning of the specified parent","    node.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prependNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to prepend to the given parent. Node config objects will","        automatically be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        prepended.","    **/","    prependNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: 0,","            src  : 'prepend'","        }));","    },","","    /**","    Removes the specified node from its parent node. The removed node will still","    be reusable unless the `destroy` option is truthy.","","    @method removeNode","    @param {Tree.Node} node Node to remove.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the node and all its","            children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @return {Tree.Node} Node that was removed.","    **/","    removeNode: function (node, options) {","        options || (options = {});","","        this._fire(EVT_REMOVE, {","            destroy: !!options.destroy,","            node   : node,","            parent : node.parent,","            src    : options.src || 'remove'","        }, {","            defaultFn: this._defRemoveFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Selects the specified node.","","    @method selectNode","    @param {Tree.Node} node Node to select.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `select` event","            will be suppressed.","    @chainable","    **/","    selectNode: function (node, options) {","        // Instead of calling node.isSelected(), we look for the node in this","        // tree's selectedMap, which ensures that the `select` event will fire","        // in cases such as a node being added to this tree with its selected","        // state already set to true.","        if (!this._selectedMap[node.id]) {","            this._fire(EVT_SELECT, {node: node}, {","                defaultFn: this._defSelectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Returns the total number of nodes in this tree, at all levels.","","    Use `rootNode.children.length` to get only the number of top-level nodes.","","    @method size","    @return {Number} Total number of nodes in this tree.","    **/","    size: function () {","        return this.rootNode.size();","    },","","    /**","    Toggles the open/closed state of the specified node.","","    @method toggleNode","    @param {Tree.Node} node Node to toggle.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, events will be","            suppressed.","    @chainable","    **/","    toggleNode: function (node, options) {","        return node.isOpen() ? this.closeNode(node, options) :","            this.openNode(node, options);","    },","","    /**","    Serializes this tree to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized tree object.","    **/","    toJSON: function () {","        return this.rootNode.toJSON();","    },","","    /**","    Unselects all selected nodes.","","    @method unselect","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselect: function (options) {","        for (var id in this._selectedMap) {","            if (this._selectedMap.hasOwnProperty(id)) {","                this.unselectNode(this._selectedMap[id], options);","            }","        }","","        return this;","    },","","    /**","    Unselects the specified node.","","    @method unselectNode","    @param {Tree.Node} node Node to unselect.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselectNode: function (node, options) {","        if (node.isSelected() || this._selectedMap[node.id]) {","            this._fire(EVT_UNSELECT, {node: node}, {","                defaultFn: this._defUnselectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Moves the specified node and all its children from another tree to this","    tree.","","    @method _adoptNode","    @param {Tree.Node} node Node to adopt.","    @param {Object} [options] Options to pass along to `removeNode()`.","    @protected","    **/","    _adoptNode: function (node, options) {","        var oldTree = node.tree;","","        if (oldTree === this) {","            return;","        }","","        for (var i = 0, len = node.children.length; i < len; i++) {","            this._adoptNode(node.children[i], {silent: true});","        }","","        oldTree.removeNode(node, options);","","        // TODO: update selectedMap?","        delete oldTree._nodeMap[node.id];","        this._nodeMap[node.id] = node;","        node.tree = this;","    },","","    _attachTreeEvents: function () {","        this._treeEvents || (this._treeEvents = []);","","        this._treeEvents.push(","            this.after('multiSelectChange', this._afterMultiSelectChange)","        );","    },","","    _detachTreeEvents: function () {","        (new Y.EventHandle(this._treeEvents)).detach();","        this._treeEvents = [];","    },","","    /**","    Utility method for lazily publishing and firing events.","","    @method _fire","    @param {String} name Event name to fire.","    @param {Object} facade Event facade.","    @param {Object} [options] Options.","        @param {Function} [options.defaultFn] Default handler for this event.","        @param {Boolean} [options.silent=false] Whether the default handler","            should be executed directly without actually firing the event.","    @chainable","    @protected","    **/","    _fire: function (name, facade, options) {","        if (options && options.silent) {","            if (options.defaultFn) {","                options.defaultFn.call(this, facade);","            }","        } else {","            if (options && options.defaultFn && !this._published[name]) {","                this._published[name] = this.publish(name, {","                    defaultFn: options.defaultFn","                });","            }","","            this.fire(name, facade);","        }","","        return this;","    },","","    /**","    Removes the specified node from its parent node if it has one.","","    @method _removeNodeFromParent","    @param {Tree.Node} node Node to remove.","    @protected","    **/","    _removeNodeFromParent: function (node) {","        var parent = node.parent,","            index;","","        if (parent) {","            index = parent.indexOf(node);","","            if (index > -1) {","                parent.children.splice(index, 1);","                parent._isIndexStale = true;","                delete node.parent;","            }","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterMultiSelectChange: function (e) {","        this.multiSelect = e.newVal; // for faster lookups","        this.unselect();","    },","","    // -- Default Event Handlers -----------------------------------------------","    _defAddFn: function (e) {","        var node   = e.node,","            parent = e.parent;","","        node.parent = parent;","","        parent.children.splice(e.index, 0, node);","","        parent.canHaveChildren = true;","        parent._isIndexStale   = true;","","        // If the node is marked as selected, we need go through the select","        // flow.","        if (node.isSelected()) {","            this.selectNode(node);","        }","    },","","    _defClearFn: function (e) {","        var newRootNode = e.rootNode;","","        if (this.rootNode) {","            this.destroyNode(this.rootNode, {silent: true});","        }","","        this._nodeMap     = {};","        this._selectedMap = {};","","        this._nodeMap[newRootNode.id] = newRootNode;","        this.rootNode = newRootNode;","    },","","    _defCloseFn: function (e) {","        delete e.node.state.open;","    },","","    _defOpenFn: function (e) {","        e.node.state.open = true;","    },","","    _defRemoveFn: function (e) {","        var node = e.node;","","        delete node.state.selected;","        delete this._selectedMap[node.id];","","        if (e.destroy) {","            this.destroyNode(node, {silent: true});","        } else if (e.parent) {","            this._removeNodeFromParent(node);","        } else if (this.rootNode === node) {","            // Guess we'll need a new root node!","            this.rootNode = this.createNode(this._rootNodeConfig);","        }","    },","","    _defSelectFn: function (e) {","        if (!this.get('multiSelect')) {","            this.unselect();","        }","","        e.node.state.selected = true;","        this._selectedMap[e.node.id] = e.node;","    },","","    _defUnselectFn: function (e) {","        delete e.node.state.selected;","        delete this._selectedMap[e.node.id];","    }","}, {","    ATTRS: {","        /**","        Whether or not to allow multiple nodes to be selected at once.","","        @attribute {Boolean} multiSelect","        @default false","        **/","        multiSelect: {","            value: false","        },","","        /**","        Root node of this treeview.","","        @attribute {Tree.Node} rootNode","        @readOnly","        **/","        rootNode: {","            getter: function () {","                return this.rootNode;","            },","","            readOnly: true","        }","    }","});","","Y.Tree = Y.mix(Tree, Y.Tree);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"tree-node\"]});"];
_yuitest_coverage["build/tree/tree.js"].lines = {"1":0,"28":0,"102":0,"148":0,"157":0,"159":0,"161":0,"162":0,"164":0,"165":0,"170":0,"172":0,"174":0,"175":0,"176":0,"177":0,"202":0,"222":0,"240":0,"241":0,"247":0,"262":0,"266":0,"267":0,"268":0,"272":0,"273":0,"275":0,"276":0,"279":0,"282":0,"283":0,"299":0,"301":0,"303":0,"304":0,"309":0,"312":0,"315":0,"316":0,"319":0,"320":0,"321":0,"322":0,"323":0,"324":0,"326":0,"328":0,"330":0,"348":0,"350":0,"351":0,"354":0,"366":0,"376":0,"403":0,"404":0,"406":0,"408":0,"409":0,"413":0,"414":0,"416":0,"418":0,"419":0,"421":0,"422":0,"426":0,"429":0,"431":0,"441":0,"454":0,"455":0,"461":0,"484":0,"505":0,"507":0,"517":0,"535":0,"536":0,"542":0,"554":0,"568":0,"579":0,"592":0,"593":0,"594":0,"598":0,"612":0,"613":0,"619":0,"634":0,"636":0,"637":0,"640":0,"641":0,"644":0,"647":0,"648":0,"649":0,"653":0,"655":0,"661":0,"662":0,"679":0,"680":0,"681":0,"684":0,"685":0,"690":0,"693":0,"704":0,"707":0,"708":0,"710":0,"711":0,"712":0,"713":0,"720":0,"721":0,"726":0,"729":0,"731":0,"733":0,"734":0,"738":0,"739":0,"744":0,"746":0,"747":0,"750":0,"751":0,"753":0,"754":0,"758":0,"762":0,"766":0,"768":0,"769":0,"771":0,"772":0,"773":0,"774":0,"775":0,"777":0,"782":0,"783":0,"786":0,"787":0,"791":0,"792":0,"814":0,"822":0};
_yuitest_coverage["build/tree/tree.js"].functions = {"initializer:147":0,"destructor:169":0,"appendNode:201":0,"clear:221":0,"closeNode:239":0,"createNode:261":0,"destroyNode:298":0,"emptyNode:347":0,"getNodeById:365":0,"getSelectedNodes:375":0,"insertNode:402":0,"openNode:453":0,"prependNode:483":0,"removeNode:504":0,"selectNode:530":0,"size:553":0,"toggleNode:567":0,"toJSON:578":0,"unselect:591":0,"unselectNode:611":0,"_adoptNode:633":0,"_attachTreeEvents:652":0,"_detachTreeEvents:660":0,"_fire:678":0,"_removeNodeFromParent:703":0,"_afterMultiSelectChange:719":0,"_defAddFn:725":0,"_defClearFn:743":0,"_defCloseFn:757":0,"_defOpenFn:761":0,"_defRemoveFn:765":0,"_defSelectFn:781":0,"_defUnselectFn:790":0,"getter:813":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tree/tree.js"].coveredLines = 153;
_yuitest_coverage["build/tree/tree.js"].coveredFunctions = 35;
_yuitest_coverline("build/tree/tree.js", 1);
YUI.add('tree', function (Y, NAME) {

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

_yuitest_coverfunc("build/tree/tree.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tree/tree.js", 28);
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

_yuitest_coverline("build/tree/tree.js", 102);
var Tree = Y.Base.create('tree', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Root node of this Tree.

    @property {Tree.Node} rootNode
    @readOnly
    **/

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
        _yuitest_coverfunc("build/tree/tree.js", "initializer", 147);
_yuitest_coverline("build/tree/tree.js", 148);
config || (config = {});

        /**
        Hash of published custom events.

        @property {Object} _published
        @default {}
        @protected
        **/
        _yuitest_coverline("build/tree/tree.js", 157);
this._published || (this._published = {});

        _yuitest_coverline("build/tree/tree.js", 159);
this._nodeMap = {};

        _yuitest_coverline("build/tree/tree.js", 161);
this.clear(config.rootNode, {silent: true});
        _yuitest_coverline("build/tree/tree.js", 162);
this._attachTreeEvents();

        _yuitest_coverline("build/tree/tree.js", 164);
if (config.nodes) {
            _yuitest_coverline("build/tree/tree.js", 165);
this.appendNode(this.rootNode, config.nodes, {silent: true});
        }
    },

    destructor: function () {
        _yuitest_coverfunc("build/tree/tree.js", "destructor", 169);
_yuitest_coverline("build/tree/tree.js", 170);
this.destroyNode(this.rootNode, {silent: true});

        _yuitest_coverline("build/tree/tree.js", 172);
this._detachTreeEvents();

        _yuitest_coverline("build/tree/tree.js", 174);
delete this.rootNode;
        _yuitest_coverline("build/tree/tree.js", 175);
delete this._nodeMap;
        _yuitest_coverline("build/tree/tree.js", 176);
delete this._published;
        _yuitest_coverline("build/tree/tree.js", 177);
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
        _yuitest_coverfunc("build/tree/tree.js", "appendNode", 201);
_yuitest_coverline("build/tree/tree.js", 202);
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
        _yuitest_coverfunc("build/tree/tree.js", "clear", 221);
_yuitest_coverline("build/tree/tree.js", 222);
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
        _yuitest_coverfunc("build/tree/tree.js", "closeNode", 239);
_yuitest_coverline("build/tree/tree.js", 240);
if (node.canHaveChildren && node.isOpen()) {
            _yuitest_coverline("build/tree/tree.js", 241);
this._fire(EVT_CLOSE, {node: node}, {
                defaultFn: this._defCloseFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/tree/tree.js", 247);
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
        _yuitest_coverfunc("build/tree/tree.js", "createNode", 261);
_yuitest_coverline("build/tree/tree.js", 262);
config || (config = {});

        // If `config` is already a node, just ensure it's in the node map and
        // return it.
        _yuitest_coverline("build/tree/tree.js", 266);
if (config._isYUITreeNode) {
            _yuitest_coverline("build/tree/tree.js", 267);
this._adoptNode(config);
            _yuitest_coverline("build/tree/tree.js", 268);
return config;
        }

        // First, create nodes for any children of this node.
        _yuitest_coverline("build/tree/tree.js", 272);
if (config.children) {
            _yuitest_coverline("build/tree/tree.js", 273);
var children = [];

            _yuitest_coverline("build/tree/tree.js", 275);
for (var i = 0, len = config.children.length; i < len; i++) {
                _yuitest_coverline("build/tree/tree.js", 276);
children.push(this.createNode(config.children[i]));
            }

            _yuitest_coverline("build/tree/tree.js", 279);
config = Y.merge(config, {children: children});
        }

        _yuitest_coverline("build/tree/tree.js", 282);
var node = new Y.Tree.Node(this, config);
        _yuitest_coverline("build/tree/tree.js", 283);
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
        _yuitest_coverfunc("build/tree/tree.js", "destroyNode", 298);
_yuitest_coverline("build/tree/tree.js", 299);
var child, i, len;

        _yuitest_coverline("build/tree/tree.js", 301);
options || (options = {});

        _yuitest_coverline("build/tree/tree.js", 303);
for (i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/tree/tree.js", 304);
child = node.children[i];

            // Manually remove the child from its parent; this makes destroying
            // all children of the parent much faster since there's no splicing
            // involved.
            _yuitest_coverline("build/tree/tree.js", 309);
delete child.parent;

            // Destroy the child.
            _yuitest_coverline("build/tree/tree.js", 312);
this.destroyNode(child, options);
        }

        _yuitest_coverline("build/tree/tree.js", 315);
if (node.parent) {
            _yuitest_coverline("build/tree/tree.js", 316);
this.removeNode(node, options);
        }

        _yuitest_coverline("build/tree/tree.js", 319);
delete node.children;
        _yuitest_coverline("build/tree/tree.js", 320);
delete node.data;
        _yuitest_coverline("build/tree/tree.js", 321);
delete node.state;
        _yuitest_coverline("build/tree/tree.js", 322);
delete node.tree;
        _yuitest_coverline("build/tree/tree.js", 323);
delete node._htmlNode;
        _yuitest_coverline("build/tree/tree.js", 324);
delete node._indexMap;

        _yuitest_coverline("build/tree/tree.js", 326);
delete this._nodeMap[node.id];

        _yuitest_coverline("build/tree/tree.js", 328);
node.state = {destroyed: true};

        _yuitest_coverline("build/tree/tree.js", 330);
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
        _yuitest_coverfunc("build/tree/tree.js", "emptyNode", 347);
_yuitest_coverline("build/tree/tree.js", 348);
var removed = [];

        _yuitest_coverline("build/tree/tree.js", 350);
while (node.children.length) {
            _yuitest_coverline("build/tree/tree.js", 351);
removed.push(this.removeNode(node.children[0], options));
        }

        _yuitest_coverline("build/tree/tree.js", 354);
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
        _yuitest_coverfunc("build/tree/tree.js", "getNodeById", 365);
_yuitest_coverline("build/tree/tree.js", 366);
return this._nodeMap[id];
    },

    /**
    Returns an array of nodes that are currently selected.

    @method getSelectedNodes
    @return {Tree.Node[]} Array of selected nodes.
    **/
    getSelectedNodes: function () {
        _yuitest_coverfunc("build/tree/tree.js", "getSelectedNodes", 375);
_yuitest_coverline("build/tree/tree.js", 376);
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
        _yuitest_coverfunc("build/tree/tree.js", "insertNode", 402);
_yuitest_coverline("build/tree/tree.js", 403);
options || (options = {});
        _yuitest_coverline("build/tree/tree.js", 404);
parent  || (parent = this.rootNode);

        _yuitest_coverline("build/tree/tree.js", 406);
var index = options.index;

        _yuitest_coverline("build/tree/tree.js", 408);
if (typeof index === 'undefined') {
            _yuitest_coverline("build/tree/tree.js", 409);
index = this.rootNode.children.length;
        }

        // If `node` is an array, recurse to insert each node it contains.
        _yuitest_coverline("build/tree/tree.js", 413);
if (Lang.isArray(node)) {
            _yuitest_coverline("build/tree/tree.js", 414);
var inserted = [];

            _yuitest_coverline("build/tree/tree.js", 416);
node = node.concat(); // avoid modifying the passed array

            _yuitest_coverline("build/tree/tree.js", 418);
for (var i = 0, len = node.length; i < len; i++) {
                _yuitest_coverline("build/tree/tree.js", 419);
inserted.push(this.insertNode(parent, node[i], options));

                _yuitest_coverline("build/tree/tree.js", 421);
if ('index' in options) {
                    _yuitest_coverline("build/tree/tree.js", 422);
options.index += 1;
                }
            }

            _yuitest_coverline("build/tree/tree.js", 426);
return inserted;
        }

        _yuitest_coverline("build/tree/tree.js", 429);
node = this.createNode(node);

        _yuitest_coverline("build/tree/tree.js", 431);
this._fire(EVT_ADD, {
            index : index,
            node  : node,
            parent: parent,
            src   : options.src || 'insert'
        }, {
            defaultFn: this._defAddFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/tree/tree.js", 441);
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
        _yuitest_coverfunc("build/tree/tree.js", "openNode", 453);
_yuitest_coverline("build/tree/tree.js", 454);
if (node.canHaveChildren && !node.isOpen()) {
            _yuitest_coverline("build/tree/tree.js", 455);
this._fire(EVT_OPEN, {node: node}, {
                defaultFn: this._defOpenFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/tree/tree.js", 461);
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
        _yuitest_coverfunc("build/tree/tree.js", "prependNode", 483);
_yuitest_coverline("build/tree/tree.js", 484);
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
        _yuitest_coverfunc("build/tree/tree.js", "removeNode", 504);
_yuitest_coverline("build/tree/tree.js", 505);
options || (options = {});

        _yuitest_coverline("build/tree/tree.js", 507);
this._fire(EVT_REMOVE, {
            destroy: !!options.destroy,
            node   : node,
            parent : node.parent,
            src    : options.src || 'remove'
        }, {
            defaultFn: this._defRemoveFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/tree/tree.js", 517);
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
        _yuitest_coverfunc("build/tree/tree.js", "selectNode", 530);
_yuitest_coverline("build/tree/tree.js", 535);
if (!this._selectedMap[node.id]) {
            _yuitest_coverline("build/tree/tree.js", 536);
this._fire(EVT_SELECT, {node: node}, {
                defaultFn: this._defSelectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/tree/tree.js", 542);
return this;
    },

    /**
    Returns the total number of nodes in this tree, at all levels.

    Use `rootNode.children.length` to get only the number of top-level nodes.

    @method size
    @return {Number} Total number of nodes in this tree.
    **/
    size: function () {
        _yuitest_coverfunc("build/tree/tree.js", "size", 553);
_yuitest_coverline("build/tree/tree.js", 554);
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
        _yuitest_coverfunc("build/tree/tree.js", "toggleNode", 567);
_yuitest_coverline("build/tree/tree.js", 568);
return node.isOpen() ? this.closeNode(node, options) :
            this.openNode(node, options);
    },

    /**
    Serializes this tree to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized tree object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/tree/tree.js", "toJSON", 578);
_yuitest_coverline("build/tree/tree.js", 579);
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
        _yuitest_coverfunc("build/tree/tree.js", "unselect", 591);
_yuitest_coverline("build/tree/tree.js", 592);
for (var id in this._selectedMap) {
            _yuitest_coverline("build/tree/tree.js", 593);
if (this._selectedMap.hasOwnProperty(id)) {
                _yuitest_coverline("build/tree/tree.js", 594);
this.unselectNode(this._selectedMap[id], options);
            }
        }

        _yuitest_coverline("build/tree/tree.js", 598);
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
        _yuitest_coverfunc("build/tree/tree.js", "unselectNode", 611);
_yuitest_coverline("build/tree/tree.js", 612);
if (node.isSelected() || this._selectedMap[node.id]) {
            _yuitest_coverline("build/tree/tree.js", 613);
this._fire(EVT_UNSELECT, {node: node}, {
                defaultFn: this._defUnselectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/tree/tree.js", 619);
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
        _yuitest_coverfunc("build/tree/tree.js", "_adoptNode", 633);
_yuitest_coverline("build/tree/tree.js", 634);
var oldTree = node.tree;

        _yuitest_coverline("build/tree/tree.js", 636);
if (oldTree === this) {
            _yuitest_coverline("build/tree/tree.js", 637);
return;
        }

        _yuitest_coverline("build/tree/tree.js", 640);
for (var i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/tree/tree.js", 641);
this._adoptNode(node.children[i], {silent: true});
        }

        _yuitest_coverline("build/tree/tree.js", 644);
oldTree.removeNode(node, options);

        // TODO: update selectedMap?
        _yuitest_coverline("build/tree/tree.js", 647);
delete oldTree._nodeMap[node.id];
        _yuitest_coverline("build/tree/tree.js", 648);
this._nodeMap[node.id] = node;
        _yuitest_coverline("build/tree/tree.js", 649);
node.tree = this;
    },

    _attachTreeEvents: function () {
        _yuitest_coverfunc("build/tree/tree.js", "_attachTreeEvents", 652);
_yuitest_coverline("build/tree/tree.js", 653);
this._treeEvents || (this._treeEvents = []);

        _yuitest_coverline("build/tree/tree.js", 655);
this._treeEvents.push(
            this.after('multiSelectChange', this._afterMultiSelectChange)
        );
    },

    _detachTreeEvents: function () {
        _yuitest_coverfunc("build/tree/tree.js", "_detachTreeEvents", 660);
_yuitest_coverline("build/tree/tree.js", 661);
(new Y.EventHandle(this._treeEvents)).detach();
        _yuitest_coverline("build/tree/tree.js", 662);
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
        _yuitest_coverfunc("build/tree/tree.js", "_fire", 678);
_yuitest_coverline("build/tree/tree.js", 679);
if (options && options.silent) {
            _yuitest_coverline("build/tree/tree.js", 680);
if (options.defaultFn) {
                _yuitest_coverline("build/tree/tree.js", 681);
options.defaultFn.call(this, facade);
            }
        } else {
            _yuitest_coverline("build/tree/tree.js", 684);
if (options && options.defaultFn && !this._published[name]) {
                _yuitest_coverline("build/tree/tree.js", 685);
this._published[name] = this.publish(name, {
                    defaultFn: options.defaultFn
                });
            }

            _yuitest_coverline("build/tree/tree.js", 690);
this.fire(name, facade);
        }

        _yuitest_coverline("build/tree/tree.js", 693);
return this;
    },

    /**
    Removes the specified node from its parent node if it has one.

    @method _removeNodeFromParent
    @param {Tree.Node} node Node to remove.
    @protected
    **/
    _removeNodeFromParent: function (node) {
        _yuitest_coverfunc("build/tree/tree.js", "_removeNodeFromParent", 703);
_yuitest_coverline("build/tree/tree.js", 704);
var parent = node.parent,
            index;

        _yuitest_coverline("build/tree/tree.js", 707);
if (parent) {
            _yuitest_coverline("build/tree/tree.js", 708);
index = parent.indexOf(node);

            _yuitest_coverline("build/tree/tree.js", 710);
if (index > -1) {
                _yuitest_coverline("build/tree/tree.js", 711);
parent.children.splice(index, 1);
                _yuitest_coverline("build/tree/tree.js", 712);
parent._isIndexStale = true;
                _yuitest_coverline("build/tree/tree.js", 713);
delete node.parent;
            }
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_afterMultiSelectChange", 719);
_yuitest_coverline("build/tree/tree.js", 720);
this.multiSelect = e.newVal; // for faster lookups
        _yuitest_coverline("build/tree/tree.js", 721);
this.unselect();
    },

    // -- Default Event Handlers -----------------------------------------------
    _defAddFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defAddFn", 725);
_yuitest_coverline("build/tree/tree.js", 726);
var node   = e.node,
            parent = e.parent;

        _yuitest_coverline("build/tree/tree.js", 729);
node.parent = parent;

        _yuitest_coverline("build/tree/tree.js", 731);
parent.children.splice(e.index, 0, node);

        _yuitest_coverline("build/tree/tree.js", 733);
parent.canHaveChildren = true;
        _yuitest_coverline("build/tree/tree.js", 734);
parent._isIndexStale   = true;

        // If the node is marked as selected, we need go through the select
        // flow.
        _yuitest_coverline("build/tree/tree.js", 738);
if (node.isSelected()) {
            _yuitest_coverline("build/tree/tree.js", 739);
this.selectNode(node);
        }
    },

    _defClearFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defClearFn", 743);
_yuitest_coverline("build/tree/tree.js", 744);
var newRootNode = e.rootNode;

        _yuitest_coverline("build/tree/tree.js", 746);
if (this.rootNode) {
            _yuitest_coverline("build/tree/tree.js", 747);
this.destroyNode(this.rootNode, {silent: true});
        }

        _yuitest_coverline("build/tree/tree.js", 750);
this._nodeMap     = {};
        _yuitest_coverline("build/tree/tree.js", 751);
this._selectedMap = {};

        _yuitest_coverline("build/tree/tree.js", 753);
this._nodeMap[newRootNode.id] = newRootNode;
        _yuitest_coverline("build/tree/tree.js", 754);
this.rootNode = newRootNode;
    },

    _defCloseFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defCloseFn", 757);
_yuitest_coverline("build/tree/tree.js", 758);
delete e.node.state.open;
    },

    _defOpenFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defOpenFn", 761);
_yuitest_coverline("build/tree/tree.js", 762);
e.node.state.open = true;
    },

    _defRemoveFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defRemoveFn", 765);
_yuitest_coverline("build/tree/tree.js", 766);
var node = e.node;

        _yuitest_coverline("build/tree/tree.js", 768);
delete node.state.selected;
        _yuitest_coverline("build/tree/tree.js", 769);
delete this._selectedMap[node.id];

        _yuitest_coverline("build/tree/tree.js", 771);
if (e.destroy) {
            _yuitest_coverline("build/tree/tree.js", 772);
this.destroyNode(node, {silent: true});
        } else {_yuitest_coverline("build/tree/tree.js", 773);
if (e.parent) {
            _yuitest_coverline("build/tree/tree.js", 774);
this._removeNodeFromParent(node);
        } else {_yuitest_coverline("build/tree/tree.js", 775);
if (this.rootNode === node) {
            // Guess we'll need a new root node!
            _yuitest_coverline("build/tree/tree.js", 777);
this.rootNode = this.createNode(this._rootNodeConfig);
        }}}
    },

    _defSelectFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defSelectFn", 781);
_yuitest_coverline("build/tree/tree.js", 782);
if (!this.get('multiSelect')) {
            _yuitest_coverline("build/tree/tree.js", 783);
this.unselect();
        }

        _yuitest_coverline("build/tree/tree.js", 786);
e.node.state.selected = true;
        _yuitest_coverline("build/tree/tree.js", 787);
this._selectedMap[e.node.id] = e.node;
    },

    _defUnselectFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defUnselectFn", 790);
_yuitest_coverline("build/tree/tree.js", 791);
delete e.node.state.selected;
        _yuitest_coverline("build/tree/tree.js", 792);
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
                _yuitest_coverfunc("build/tree/tree.js", "getter", 813);
_yuitest_coverline("build/tree/tree.js", 814);
return this.rootNode;
            },

            readOnly: true
        }
    }
});

_yuitest_coverline("build/tree/tree.js", 822);
Y.Tree = Y.mix(Tree, Y.Tree);


}, '@VERSION@', {"requires": ["base-build", "tree-node"]});
