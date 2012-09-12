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
_yuitest_coverage["build/treeview-tree/treeview-tree.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/treeview-tree/treeview-tree.js",
    code: []
};
_yuitest_coverage["build/treeview-tree/treeview-tree.js"].code=["YUI.add('treeview-tree', function (Y, NAME) {","","/**","Provides the `Y.TreeView.Tree` class, which is the underlying data structure for","`Y.TreeView`.","","@module treeview","@submodule treeview-tree","**/","","/**","Underlying UI-agnostic data structure and API for `Y.TreeView`.","","@class TreeView.Tree","@param {Object} [config] Config options.","    @param {Object[]|TreeView.Node[]} [config.nodes] Array of tree node config","        objects or `TreeView.Node` instances to add to this tree at","        initialization time.","    @param {Object|TreeView.Node} [config.rootNode] Node to use as the root node","        of this tree.","@constructor","@extends Base","**/","","var Lang = Y.Lang,","","    /**","    Fired when a node is added to the TreeView. The `src` property will indicate","    how the node was added (\"append\", \"insert\", \"prepend\", etc.).","","    @event add","    @param {Number} index Index at which the node will be added.","    @param {TreeView.Node} node Node being added.","    @param {TreeView.Node} parent Parent node to which the node will be added.","    @param {String} src Source of the event (\"append\", \"insert\", \"prepend\",","        etc.).","    @preventable _defAddFn","    **/","    EVT_ADD = 'add',","","    /**","    Fired when the TreeView is cleared.","","    @event clear","    @param {TreeView.Node} rootNode New root node of the tree (the old root node","        is always destroyed when a tree is cleared).","    @preventable _defClearFn","    **/","    EVT_CLEAR = 'clear',","","    /**","    Fired when a node is closed.","","    @event close","    @param {TreeView.Node} node Node being closed.","    @preventable _defCloseFn","    **/","    EVT_CLOSE = 'close',","","    /**","    Fired when a node is opened.","","    @event open","    @param {TreeView.Node} node Node being opened.","    @preventable _defOpenFn","    **/","    EVT_OPEN = 'open',","","    /**","    Fired when a node is removed from the TreeView.","","    @event remove","    @param {Boolean} destroy Whether or not the node will be destroyed after","        being removed from the tree.","    @param {TreeView.Node} node Node being removed.","    @param {TreeView.Node} parent Parent node from which the node will be","        removed.","    @preventable _defRemoveFn","    **/","    EVT_REMOVE = 'remove',","","    /**","    Fired when a node is selected.","","    @event select","    @param {TreeView.Node} node Node being selected.","    @preventable _defSelectFn","    **/","    EVT_SELECT = 'select',","","    /**","    Fired when a node is unselected.","","    @event unselect","    @param {TreeView.Node} node Node being unselected.","    @preventable _defUnselectFn","    **/","    EVT_UNSELECT = 'unselect';","","Y.namespace('TreeView').Tree = Y.Base.create('tree', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Root node of the tree.","","    @property {TreeView.Node} rootNode","    @readOnly","    **/","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a TreeView.Tree instance.","","    @property {Boolean} _isYUITree","    @default true","    @protected","    **/","    _isYUITree: true,","","    /**","    Mapping of node ids to node instances for nodes in this tree.","","    @property {Object} _nodeMap","    @protected","    **/","","    /**","    Default config object for the root node.","","    @property {Object} _rootNodeConfig","    @protected","    **/","    _rootNodeConfig: {canHaveChildren: true},","","    /**","    Mapping of node ids to node instances for nodes in this tree that are","    currently selected.","","    @property {Object} _selectedMap","    @protected","    **/","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        config || (config = {});","","        /**","        Hash of published custom events.","","        @property {Object} _published","        @default {}","        @protected","        **/","        this._published || (this._published = {});","","        this._nodeMap = {};","","        this.clear(config.rootNode, {silent: true});","        this._attachTreeEvents();","","        if (config.nodes) {","            this.appendNode(this.rootNode, config.nodes, {silent: true});","        }","    },","","    destructor: function () {","        this.destroyNode(this.rootNode, {silent: true});","","        this._detachTreeEvents();","","        delete this.rootNode;","        delete this._nodeMap;","        delete this._published;","        delete this._selectedMap;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends a node or array of nodes as the last child of the specified parent","    node.","","    If a node being appended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method appendNode","    @param {TreeView.Node} parent Parent node.","    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to append to the given parent. Node config objects will","        automatically be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {TreeView.Node|TreeView.Node[]} Node or array of nodes that were","        appended.","    **/","    appendNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: parent.children.length,","            src  : 'append'","        }));","    },","","    /**","    Clears this tree by destroying the root node and all its children. If a","    `rootNode` argument is provided, that node will become the root node of this","    tree; otherwise, a new root node will be created.","","    @method clear","    @param {Object|TreeView.Node} [rootNode] If specified, this node will be","        used as the new root node.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `clear` event","            will be suppressed.","    @chainable","    **/","    clear: function (rootNode, options) {","        return this._fire(EVT_CLEAR, {","            rootNode: this.createNode(rootNode || this._rootNodeConfig)","        }, {","            defaultFn: this._defClearFn,","            silent   : options && options.silent","        });","    },","","    /**","    Closes the specified node if it isn't already closed.","","    @method closeNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `close` event","            will be suppressed.","    @chainable","    **/","    closeNode: function (node, options) {","        if (node.canHaveChildren && node.isOpen()) {","            this._fire(EVT_CLOSE, {node: node}, {","                defaultFn: this._defCloseFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Creates and returns a new `TreeView.Node` instance associated with (but not","    yet appended to) this tree.","","    @method createNode","    @param {Object|TreeView.Node} [config] Node configuration. If a","        `TreeView.Node` instance is specified instead of a config object, that","        node will be adopted into this tree (if it doesn't already belong to","        this tree) and removed from any other tree to which it belongs.","    @return {TreeView.Node} New node.","    **/","    createNode: function (config) {","        config || (config = {});","","        // If `config` is already a node, just ensure it's in the node map and","        // return it.","        if (config._isYUITreeNode) {","            this._adoptNode(config);","            return config;","        }","","        // First, create nodes for any children of this node.","        if (config.children) {","            var children = [];","","            for (var i = 0, len = config.children.length; i < len; i++) {","                children.push(this.createNode(config.children[i]));","            }","","            config = Y.merge(config, {children: children});","        }","","        var node = new Y.TreeView.Node(this, config);","        return this._nodeMap[node.id] = node;","    },","","    /**","    Removes and destroys a node and all its child nodes. Once destroyed, a node","    is eligible for garbage collection and cannot be reused or re-added to the","    tree.","","    @method destroyNode","    @param {TreeView.Node} node Node to destroy.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @chainable","    **/","    destroyNode: function (node, options) {","        var child, i, len;","","        options || (options = {});","","        for (i = 0, len = node.children.length; i < len; i++) {","            child = node.children[i];","","            // Manually remove the child from its parent; this makes destroying","            // all children of the parent much faster since there's no splicing","            // involved.","            delete child.parent;","","            // Destroy the child.","            this.destroyNode(child, options);","        }","","        if (node.parent) {","            this.removeNode(node, options);","        }","","        delete node.children;","        delete node.data;","        delete node.state;","        delete node.tree;","        delete node._htmlNode;","        delete node._indexMap;","","        delete this._nodeMap[node.id];","","        node.state = {destroyed: true};","","        return this;","    },","","    /**","    Removes all children from the specified node. The removed children will","    still be reusable unless the `destroy` option is truthy.","","    @method emptyNode","    @param {TreeView.Node} node Node to empty.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {TreeView.Node[]} Array of removed child nodes.","    **/","    emptyNode: function (node, options) {","        var removed = [];","","        while (node.children.length) {","            removed.push(this.removeNode(node.children[0], options));","        }","","        return removed;","    },","","    /**","    Returns the tree node with the specified id, or `undefined` if the node","    doesn't exist in this tree.","","    @method getNodeById","    @param {String} id Node id.","    @return {TreeView.Node} Node, or `undefined` if not found.","    **/","    getNodeById: function (id) {","        return this._nodeMap[id];","    },","","    /**","    Returns an array of nodes that are currently selected.","","    @method getSelectedNodes","    @return {TreeView.Node[]} Array of selected nodes.","    **/","    getSelectedNodes: function () {","        return Y.Object.values(this._selectedMap);","    },","","    /**","    Inserts a node or array of nodes at the specified index under the given","    parent node, or appends them to the parent if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insertNode","    @param {TreeView.Node} parent Parent node.","    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to insert under the given parent. Node config objects will","        automatically be converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {TreeView.Node[]} Node or array of nodes that were inserted.","    **/","    insertNode: function (parent, node, options) {","        options || (options = {});","        parent  || (parent = this.rootNode);","","        var index = options.index;","","        if (typeof index === 'undefined') {","            index = this.rootNode.children.length;","        }","","        // If `node` is an array, recurse to insert each node it contains.","        if (Lang.isArray(node)) {","            var inserted = [];","","            node = node.concat(); // avoid modifying the passed array","","            for (var i = 0, len = node.length; i < len; i++) {","                inserted.push(this.insertNode(parent, node[i], options));","","                if ('index' in options) {","                    options.index += 1;","                }","            }","","            return inserted;","        }","","        node = this.createNode(node);","","        this._fire(EVT_ADD, {","            index : index,","            node  : node,","            parent: parent,","            src   : options.src || 'insert'","        }, {","            defaultFn: this._defAddFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Opens the specified node if it isn't already open.","","    @method openNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `open` event","            will be suppressed.","    @chainable","    **/","    openNode: function (node, options) {","        if (node.canHaveChildren && !node.isOpen()) {","            this._fire(EVT_OPEN, {node: node}, {","                defaultFn: this._defOpenFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Prepends a node or array of nodes at the beginning of the specified parent","    node.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prependNode","    @param {TreeView.Node} parent Parent node.","    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to prepend to the given parent. Node config objects will","        automatically be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {TreeView.Node|TreeView.Node[]} Node or array of nodes that were","        prepended.","    **/","    prependNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: 0,","            src  : 'prepend'","        }));","    },","","    /**","    Removes the specified node from its parent node. The removed node will still","    be reusable unless the `destroy` option is truthy.","","    @method removeNode","    @param {TreeView.Node} node Node to remove.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the node and all its","            children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @return {TreeView.Node} Node that was removed.","    **/","    removeNode: function (node, options) {","        options || (options = {});","","        this._fire(EVT_REMOVE, {","            destroy: !!options.destroy,","            node   : node,","            parent : node.parent,","            src    : options.src || 'remove'","        }, {","            defaultFn: this._defRemoveFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Selects the specified node.","","    @method selectNode","    @param {TreeView.Node} node Node to select.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `select` event","            will be suppressed.","    @chainable","    **/","    selectNode: function (node, options) {","        // Instead of calling node.isSelected(), we look for the node in this","        // tree's selectedMap, which ensures that the `select` event will fire","        // in cases such as a node being added to this tree with its selected","        // state already set to true.","        if (!this._selectedMap[node.id]) {","            this._fire(EVT_SELECT, {node: node}, {","                defaultFn: this._defSelectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Returns the total number of nodes in this tree, at all levels.","","    Use `rootNode.children.length` to get only the number of top-level nodes.","","    @method size","    @return {Number} Total number of nodes in this tree.","    **/","    size: function () {","        return this.rootNode.size();","    },","","    /**","    Toggles the open/closed state of the specified node.","","    @method toggleNode","    @param {TreeView.Node} node Node to toggle.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, events will be","            suppressed.","    @chainable","    **/","    toggleNode: function (node, options) {","        return node.isOpen() ? this.closeNode(node, options) :","            this.openNode(node, options);","    },","","    /**","    Serializes this tree to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized tree object.","    **/","    toJSON: function () {","        return this.rootNode.toJSON();","    },","","    /**","    Unselects all selected nodes.","","    @method unselect","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselect: function (options) {","        for (var id in this._selectedMap) {","            if (this._selectedMap.hasOwnProperty(id)) {","                this.unselectNode(this._selectedMap[id], options);","            }","        }","","        return this;","    },","","    /**","    Unselects the specified node.","","    @method unselectNode","    @param {TreeView.Node} node Node to unselect.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselectNode: function (node, options) {","        if (node.isSelected() || this._selectedMap[node.id]) {","            this._fire(EVT_UNSELECT, {node: node}, {","                defaultFn: this._defUnselectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Moves the specified node and all its children from another tree to this","    tree.","","    @method _adoptNode","    @param {TreeView.Node} node Node to adopt.","    @param {Object} [options] Options to pass along to `removeNode()`.","    @protected","    **/","    _adoptNode: function (node, options) {","        var oldTree = node.tree;","","        if (oldTree === this) {","            return;","        }","","        for (var i = 0, len = node.children.length; i < len; i++) {","            this._adoptNode(node.children[i], {silent: true});","        }","","        oldTree.removeNode(node, options);","","        // TODO: update selectedMap?","        delete oldTree._nodeMap[node.id];","        this._nodeMap[node.id] = node;","        node.tree = this;","    },","","    _attachTreeEvents: function () {","        this._treeEvents || (this._treeEvents = []);","","        this._treeEvents.push(","            this.after('multiSelectChange', this._afterMultiSelectChange)","        );","    },","","    _detachTreeEvents: function () {","        (new Y.EventHandle(this._treeEvents)).detach();","        this._treeEvents = [];","    },","","    /**","    Utility method for lazily publishing and firing events.","","    @method _fire","    @param {String} name Event name to fire.","    @param {Object} facade Event facade.","    @param {Object} [options] Options.","        @param {Function} [options.defaultFn] Default handler for this event.","        @param {Boolean} [options.silent=false] Whether the default handler","            should be executed directly without actually firing the event.","    @chainable","    @protected","    **/","    _fire: function (name, facade, options) {","        if (options && options.silent) {","            if (options.defaultFn) {","                options.defaultFn.call(this, facade);","            }","        } else {","            if (options && options.defaultFn && !this._published[name]) {","                this._published[name] = this.publish(name, {","                    defaultFn: options.defaultFn","                });","            }","","            this.fire(name, facade);","        }","","        return this;","    },","","    /**","    Removes the specified node from its parent node if it has one.","","    @method _removeNodeFromParent","    @param {TreeView.Node} node Node to remove.","    @protected","    **/","    _removeNodeFromParent: function (node) {","        var parent = node.parent,","            index;","","        if (parent) {","            index = parent.indexOf(node);","","            if (index > -1) {","                parent.children.splice(index, 1);","                parent._isIndexStale = true;","                delete node.parent;","            }","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterMultiSelectChange: function (e) {","        this.multiSelect = e.newVal; // for faster lookups","        this.unselect();","    },","","    // -- Default Event Handlers -----------------------------------------------","    _defAddFn: function (e) {","        var node   = e.node,","            parent = e.parent;","","        node.parent = parent;","","        parent.children.splice(e.index, 0, node);","","        parent.canHaveChildren = true;","        parent._isIndexStale   = true;","","        // If the node is marked as selected, we need go through the select","        // flow.","        if (node.isSelected()) {","            this.selectNode(node);","        }","    },","","    _defClearFn: function (e) {","        var newRootNode = e.rootNode;","","        if (this.rootNode) {","            this.destroyNode(this.rootNode, {silent: true});","        }","","        this._nodeMap     = {};","        this._selectedMap = {};","","        this._nodeMap[newRootNode.id] = newRootNode;","        this.rootNode = newRootNode;","    },","","    _defCloseFn: function (e) {","        delete e.node.state.open;","    },","","    _defOpenFn: function (e) {","        e.node.state.open = true;","    },","","    _defRemoveFn: function (e) {","        var node = e.node;","","        delete node.state.selected;","        delete this._selectedMap[node.id];","","        if (e.destroy) {","            this.destroyNode(node, {silent: true});","        } else if (e.parent) {","            this._removeNodeFromParent(node);","        } else if (this.rootNode === node) {","            // Guess we'll need a new root node!","            this.rootNode = this.createNode(this._rootNodeConfig);","        }","    },","","    _defSelectFn: function (e) {","        if (!this.get('multiSelect')) {","            this.unselect();","        }","","        e.node.state.selected = true;","        this._selectedMap[e.node.id] = e.node;","    },","","    _defUnselectFn: function (e) {","        delete e.node.state.selected;","        delete this._selectedMap[e.node.id];","    }","}, {","    ATTRS: {","        /**","        Whether or not to allow multiple nodes to be selected at once.","","        @attribute {Boolean} multiSelect","        @default false","        **/","        multiSelect: {","            value: false","        },","","        /**","        Root node of this treeview.","","        @attribute {TreeView.Node} rootNode","        @readOnly","        **/","        rootNode: {","            getter: function () {","                return this.rootNode;","            },","","            readOnly: true","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"treeview-node\"]});"];
_yuitest_coverage["build/treeview-tree/treeview-tree.js"].lines = {"1":0,"25":0,"100":0,"146":0,"155":0,"157":0,"159":0,"160":0,"162":0,"163":0,"168":0,"170":0,"172":0,"173":0,"174":0,"175":0,"200":0,"220":0,"238":0,"239":0,"245":0,"260":0,"264":0,"265":0,"266":0,"270":0,"271":0,"273":0,"274":0,"277":0,"280":0,"281":0,"297":0,"299":0,"301":0,"302":0,"307":0,"310":0,"313":0,"314":0,"317":0,"318":0,"319":0,"320":0,"321":0,"322":0,"324":0,"326":0,"328":0,"346":0,"348":0,"349":0,"352":0,"364":0,"374":0,"401":0,"402":0,"404":0,"406":0,"407":0,"411":0,"412":0,"414":0,"416":0,"417":0,"419":0,"420":0,"424":0,"427":0,"429":0,"439":0,"452":0,"453":0,"459":0,"482":0,"503":0,"505":0,"515":0,"533":0,"534":0,"540":0,"552":0,"566":0,"577":0,"590":0,"591":0,"592":0,"596":0,"610":0,"611":0,"617":0,"632":0,"634":0,"635":0,"638":0,"639":0,"642":0,"645":0,"646":0,"647":0,"651":0,"653":0,"659":0,"660":0,"677":0,"678":0,"679":0,"682":0,"683":0,"688":0,"691":0,"702":0,"705":0,"706":0,"708":0,"709":0,"710":0,"711":0,"718":0,"719":0,"724":0,"727":0,"729":0,"731":0,"732":0,"736":0,"737":0,"742":0,"744":0,"745":0,"748":0,"749":0,"751":0,"752":0,"756":0,"760":0,"764":0,"766":0,"767":0,"769":0,"770":0,"771":0,"772":0,"773":0,"775":0,"780":0,"781":0,"784":0,"785":0,"789":0,"790":0,"812":0};
_yuitest_coverage["build/treeview-tree/treeview-tree.js"].functions = {"initializer:145":0,"destructor:167":0,"appendNode:199":0,"clear:219":0,"closeNode:237":0,"createNode:259":0,"destroyNode:296":0,"emptyNode:345":0,"getNodeById:363":0,"getSelectedNodes:373":0,"insertNode:400":0,"openNode:451":0,"prependNode:481":0,"removeNode:502":0,"selectNode:528":0,"size:551":0,"toggleNode:565":0,"toJSON:576":0,"unselect:589":0,"unselectNode:609":0,"_adoptNode:631":0,"_attachTreeEvents:650":0,"_detachTreeEvents:658":0,"_fire:676":0,"_removeNodeFromParent:701":0,"_afterMultiSelectChange:717":0,"_defAddFn:723":0,"_defClearFn:741":0,"_defCloseFn:755":0,"_defOpenFn:759":0,"_defRemoveFn:763":0,"_defSelectFn:779":0,"_defUnselectFn:788":0,"getter:811":0,"(anonymous 1):1":0};
_yuitest_coverage["build/treeview-tree/treeview-tree.js"].coveredLines = 152;
_yuitest_coverage["build/treeview-tree/treeview-tree.js"].coveredFunctions = 35;
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 1);
YUI.add('treeview-tree', function (Y, NAME) {

/**
Provides the `Y.TreeView.Tree` class, which is the underlying data structure for
`Y.TreeView`.

@module treeview
@submodule treeview-tree
**/

/**
Underlying UI-agnostic data structure and API for `Y.TreeView`.

@class TreeView.Tree
@param {Object} [config] Config options.
    @param {Object[]|TreeView.Node[]} [config.nodes] Array of tree node config
        objects or `TreeView.Node` instances to add to this tree at
        initialization time.
    @param {Object|TreeView.Node} [config.rootNode] Node to use as the root node
        of this tree.
@constructor
@extends Base
**/

_yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "(anonymous 1)", 1);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 25);
var Lang = Y.Lang,

    /**
    Fired when a node is added to the TreeView. The `src` property will indicate
    how the node was added ("append", "insert", "prepend", etc.).

    @event add
    @param {Number} index Index at which the node will be added.
    @param {TreeView.Node} node Node being added.
    @param {TreeView.Node} parent Parent node to which the node will be added.
    @param {String} src Source of the event ("append", "insert", "prepend",
        etc.).
    @preventable _defAddFn
    **/
    EVT_ADD = 'add',

    /**
    Fired when the TreeView is cleared.

    @event clear
    @param {TreeView.Node} rootNode New root node of the tree (the old root node
        is always destroyed when a tree is cleared).
    @preventable _defClearFn
    **/
    EVT_CLEAR = 'clear',

    /**
    Fired when a node is closed.

    @event close
    @param {TreeView.Node} node Node being closed.
    @preventable _defCloseFn
    **/
    EVT_CLOSE = 'close',

    /**
    Fired when a node is opened.

    @event open
    @param {TreeView.Node} node Node being opened.
    @preventable _defOpenFn
    **/
    EVT_OPEN = 'open',

    /**
    Fired when a node is removed from the TreeView.

    @event remove
    @param {Boolean} destroy Whether or not the node will be destroyed after
        being removed from the tree.
    @param {TreeView.Node} node Node being removed.
    @param {TreeView.Node} parent Parent node from which the node will be
        removed.
    @preventable _defRemoveFn
    **/
    EVT_REMOVE = 'remove',

    /**
    Fired when a node is selected.

    @event select
    @param {TreeView.Node} node Node being selected.
    @preventable _defSelectFn
    **/
    EVT_SELECT = 'select',

    /**
    Fired when a node is unselected.

    @event unselect
    @param {TreeView.Node} node Node being unselected.
    @preventable _defUnselectFn
    **/
    EVT_UNSELECT = 'unselect';

_yuitest_coverline("build/treeview-tree/treeview-tree.js", 100);
Y.namespace('TreeView').Tree = Y.Base.create('tree', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Root node of the tree.

    @property {TreeView.Node} rootNode
    @readOnly
    **/

    // -- Protected Properties -------------------------------------------------

    /**
    Simple way to type-check that this is a TreeView.Tree instance.

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
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "initializer", 145);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 146);
config || (config = {});

        /**
        Hash of published custom events.

        @property {Object} _published
        @default {}
        @protected
        **/
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 155);
this._published || (this._published = {});

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 157);
this._nodeMap = {};

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 159);
this.clear(config.rootNode, {silent: true});
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 160);
this._attachTreeEvents();

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 162);
if (config.nodes) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 163);
this.appendNode(this.rootNode, config.nodes, {silent: true});
        }
    },

    destructor: function () {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "destructor", 167);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 168);
this.destroyNode(this.rootNode, {silent: true});

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 170);
this._detachTreeEvents();

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 172);
delete this.rootNode;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 173);
delete this._nodeMap;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 174);
delete this._published;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 175);
delete this._selectedMap;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Appends a node or array of nodes as the last child of the specified parent
    node.

    If a node being appended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method appendNode
    @param {TreeView.Node} parent Parent node.
    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,
        node config object, array of child nodes, or array of node config
        objects to append to the given parent. Node config objects will
        automatically be converted into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {TreeView.Node|TreeView.Node[]} Node or array of nodes that were
        appended.
    **/
    appendNode: function (parent, node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "appendNode", 199);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 200);
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
    @param {Object|TreeView.Node} [rootNode] If specified, this node will be
        used as the new root node.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `clear` event
            will be suppressed.
    @chainable
    **/
    clear: function (rootNode, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "clear", 219);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 220);
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
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "closeNode", 237);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 238);
if (node.canHaveChildren && node.isOpen()) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 239);
this._fire(EVT_CLOSE, {node: node}, {
                defaultFn: this._defCloseFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 245);
return this;
    },

    /**
    Creates and returns a new `TreeView.Node` instance associated with (but not
    yet appended to) this tree.

    @method createNode
    @param {Object|TreeView.Node} [config] Node configuration. If a
        `TreeView.Node` instance is specified instead of a config object, that
        node will be adopted into this tree (if it doesn't already belong to
        this tree) and removed from any other tree to which it belongs.
    @return {TreeView.Node} New node.
    **/
    createNode: function (config) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "createNode", 259);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 260);
config || (config = {});

        // If `config` is already a node, just ensure it's in the node map and
        // return it.
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 264);
if (config._isYUITreeNode) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 265);
this._adoptNode(config);
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 266);
return config;
        }

        // First, create nodes for any children of this node.
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 270);
if (config.children) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 271);
var children = [];

            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 273);
for (var i = 0, len = config.children.length; i < len; i++) {
                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 274);
children.push(this.createNode(config.children[i]));
            }

            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 277);
config = Y.merge(config, {children: children});
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 280);
var node = new Y.TreeView.Node(this, config);
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 281);
return this._nodeMap[node.id] = node;
    },

    /**
    Removes and destroys a node and all its child nodes. Once destroyed, a node
    is eligible for garbage collection and cannot be reused or re-added to the
    tree.

    @method destroyNode
    @param {TreeView.Node} node Node to destroy.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, `remove` events will
            be suppressed.
    @chainable
    **/
    destroyNode: function (node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "destroyNode", 296);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 297);
var child, i, len;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 299);
options || (options = {});

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 301);
for (i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 302);
child = node.children[i];

            // Manually remove the child from its parent; this makes destroying
            // all children of the parent much faster since there's no splicing
            // involved.
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 307);
delete child.parent;

            // Destroy the child.
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 310);
this.destroyNode(child, options);
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 313);
if (node.parent) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 314);
this.removeNode(node, options);
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 317);
delete node.children;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 318);
delete node.data;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 319);
delete node.state;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 320);
delete node.tree;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 321);
delete node._htmlNode;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 322);
delete node._indexMap;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 324);
delete this._nodeMap[node.id];

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 326);
node.state = {destroyed: true};

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 328);
return this;
    },

    /**
    Removes all children from the specified node. The removed children will
    still be reusable unless the `destroy` option is truthy.

    @method emptyNode
    @param {TreeView.Node} node Node to empty.
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, the children will
            also be destroyed, which makes them available for garbage collection
            and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, `remove` events will
            be suppressed.
    @return {TreeView.Node[]} Array of removed child nodes.
    **/
    emptyNode: function (node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "emptyNode", 345);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 346);
var removed = [];

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 348);
while (node.children.length) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 349);
removed.push(this.removeNode(node.children[0], options));
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 352);
return removed;
    },

    /**
    Returns the tree node with the specified id, or `undefined` if the node
    doesn't exist in this tree.

    @method getNodeById
    @param {String} id Node id.
    @return {TreeView.Node} Node, or `undefined` if not found.
    **/
    getNodeById: function (id) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "getNodeById", 363);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 364);
return this._nodeMap[id];
    },

    /**
    Returns an array of nodes that are currently selected.

    @method getSelectedNodes
    @return {TreeView.Node[]} Array of selected nodes.
    **/
    getSelectedNodes: function () {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "getSelectedNodes", 373);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 374);
return Y.Object.values(this._selectedMap);
    },

    /**
    Inserts a node or array of nodes at the specified index under the given
    parent node, or appends them to the parent if no index is specified.

    If a node being inserted is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method insertNode
    @param {TreeView.Node} parent Parent node.
    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,
        node config object, array of child nodes, or array of node config
        objects to insert under the given parent. Node config objects will
        automatically be converted into node instances.

    @param {Object} [options] Options.
        @param {Number} [options.index] Index at which to insert the child node.
            If not specified, the node will be appended as the last child of the
            parent.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.

    @return {TreeView.Node[]} Node or array of nodes that were inserted.
    **/
    insertNode: function (parent, node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "insertNode", 400);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 401);
options || (options = {});
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 402);
parent  || (parent = this.rootNode);

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 404);
var index = options.index;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 406);
if (typeof index === 'undefined') {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 407);
index = this.rootNode.children.length;
        }

        // If `node` is an array, recurse to insert each node it contains.
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 411);
if (Lang.isArray(node)) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 412);
var inserted = [];

            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 414);
node = node.concat(); // avoid modifying the passed array

            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 416);
for (var i = 0, len = node.length; i < len; i++) {
                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 417);
inserted.push(this.insertNode(parent, node[i], options));

                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 419);
if ('index' in options) {
                    _yuitest_coverline("build/treeview-tree/treeview-tree.js", 420);
options.index += 1;
                }
            }

            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 424);
return inserted;
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 427);
node = this.createNode(node);

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 429);
this._fire(EVT_ADD, {
            index : index,
            node  : node,
            parent: parent,
            src   : options.src || 'insert'
        }, {
            defaultFn: this._defAddFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 439);
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
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "openNode", 451);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 452);
if (node.canHaveChildren && !node.isOpen()) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 453);
this._fire(EVT_OPEN, {node: node}, {
                defaultFn: this._defOpenFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 459);
return this;
    },

    /**
    Prepends a node or array of nodes at the beginning of the specified parent
    node.

    If a node being prepended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method prependNode
    @param {TreeView.Node} parent Parent node.
    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,
        node config object, array of child nodes, or array of node config
        objects to prepend to the given parent. Node config objects will
        automatically be converted into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {TreeView.Node|TreeView.Node[]} Node or array of nodes that were
        prepended.
    **/
    prependNode: function (parent, node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "prependNode", 481);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 482);
return this.insertNode(parent, node, Y.merge(options, {
            index: 0,
            src  : 'prepend'
        }));
    },

    /**
    Removes the specified node from its parent node. The removed node will still
    be reusable unless the `destroy` option is truthy.

    @method removeNode
    @param {TreeView.Node} node Node to remove.
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, the node and all its
            children will also be destroyed, which makes them available for
            garbage collection and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, the `remove` event
            will be suppressed.
    @return {TreeView.Node} Node that was removed.
    **/
    removeNode: function (node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "removeNode", 502);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 503);
options || (options = {});

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 505);
this._fire(EVT_REMOVE, {
            destroy: !!options.destroy,
            node   : node,
            parent : node.parent,
            src    : options.src || 'remove'
        }, {
            defaultFn: this._defRemoveFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 515);
return node;
    },

    /**
    Selects the specified node.

    @method selectNode
    @param {TreeView.Node} node Node to select.
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
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "selectNode", 528);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 533);
if (!this._selectedMap[node.id]) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 534);
this._fire(EVT_SELECT, {node: node}, {
                defaultFn: this._defSelectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 540);
return this;
    },

    /**
    Returns the total number of nodes in this tree, at all levels.

    Use `rootNode.children.length` to get only the number of top-level nodes.

    @method size
    @return {Number} Total number of nodes in this tree.
    **/
    size: function () {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "size", 551);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 552);
return this.rootNode.size();
    },

    /**
    Toggles the open/closed state of the specified node.

    @method toggleNode
    @param {TreeView.Node} node Node to toggle.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, events will be
            suppressed.
    @chainable
    **/
    toggleNode: function (node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "toggleNode", 565);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 566);
return node.isOpen() ? this.closeNode(node, options) :
            this.openNode(node, options);
    },

    /**
    Serializes this tree to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized tree object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "toJSON", 576);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 577);
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
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "unselect", 589);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 590);
for (var id in this._selectedMap) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 591);
if (this._selectedMap.hasOwnProperty(id)) {
                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 592);
this.unselectNode(this._selectedMap[id], options);
            }
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 596);
return this;
    },

    /**
    Unselects the specified node.

    @method unselectNode
    @param {TreeView.Node} node Node to unselect.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselectNode: function (node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "unselectNode", 609);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 610);
if (node.isSelected() || this._selectedMap[node.id]) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 611);
this._fire(EVT_UNSELECT, {node: node}, {
                defaultFn: this._defUnselectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 617);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Moves the specified node and all its children from another tree to this
    tree.

    @method _adoptNode
    @param {TreeView.Node} node Node to adopt.
    @param {Object} [options] Options to pass along to `removeNode()`.
    @protected
    **/
    _adoptNode: function (node, options) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_adoptNode", 631);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 632);
var oldTree = node.tree;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 634);
if (oldTree === this) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 635);
return;
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 638);
for (var i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 639);
this._adoptNode(node.children[i], {silent: true});
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 642);
oldTree.removeNode(node, options);

        // TODO: update selectedMap?
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 645);
delete oldTree._nodeMap[node.id];
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 646);
this._nodeMap[node.id] = node;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 647);
node.tree = this;
    },

    _attachTreeEvents: function () {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_attachTreeEvents", 650);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 651);
this._treeEvents || (this._treeEvents = []);

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 653);
this._treeEvents.push(
            this.after('multiSelectChange', this._afterMultiSelectChange)
        );
    },

    _detachTreeEvents: function () {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_detachTreeEvents", 658);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 659);
(new Y.EventHandle(this._treeEvents)).detach();
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 660);
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
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_fire", 676);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 677);
if (options && options.silent) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 678);
if (options.defaultFn) {
                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 679);
options.defaultFn.call(this, facade);
            }
        } else {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 682);
if (options && options.defaultFn && !this._published[name]) {
                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 683);
this._published[name] = this.publish(name, {
                    defaultFn: options.defaultFn
                });
            }

            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 688);
this.fire(name, facade);
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 691);
return this;
    },

    /**
    Removes the specified node from its parent node if it has one.

    @method _removeNodeFromParent
    @param {TreeView.Node} node Node to remove.
    @protected
    **/
    _removeNodeFromParent: function (node) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_removeNodeFromParent", 701);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 702);
var parent = node.parent,
            index;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 705);
if (parent) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 706);
index = parent.indexOf(node);

            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 708);
if (index > -1) {
                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 709);
parent.children.splice(index, 1);
                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 710);
parent._isIndexStale = true;
                _yuitest_coverline("build/treeview-tree/treeview-tree.js", 711);
delete node.parent;
            }
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_afterMultiSelectChange", 717);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 718);
this.multiSelect = e.newVal; // for faster lookups
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 719);
this.unselect();
    },

    // -- Default Event Handlers -----------------------------------------------
    _defAddFn: function (e) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_defAddFn", 723);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 724);
var node   = e.node,
            parent = e.parent;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 727);
node.parent = parent;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 729);
parent.children.splice(e.index, 0, node);

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 731);
parent.canHaveChildren = true;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 732);
parent._isIndexStale   = true;

        // If the node is marked as selected, we need go through the select
        // flow.
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 736);
if (node.isSelected()) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 737);
this.selectNode(node);
        }
    },

    _defClearFn: function (e) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_defClearFn", 741);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 742);
var newRootNode = e.rootNode;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 744);
if (this.rootNode) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 745);
this.destroyNode(this.rootNode, {silent: true});
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 748);
this._nodeMap     = {};
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 749);
this._selectedMap = {};

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 751);
this._nodeMap[newRootNode.id] = newRootNode;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 752);
this.rootNode = newRootNode;
    },

    _defCloseFn: function (e) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_defCloseFn", 755);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 756);
delete e.node.state.open;
    },

    _defOpenFn: function (e) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_defOpenFn", 759);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 760);
e.node.state.open = true;
    },

    _defRemoveFn: function (e) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_defRemoveFn", 763);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 764);
var node = e.node;

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 766);
delete node.state.selected;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 767);
delete this._selectedMap[node.id];

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 769);
if (e.destroy) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 770);
this.destroyNode(node, {silent: true});
        } else {_yuitest_coverline("build/treeview-tree/treeview-tree.js", 771);
if (e.parent) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 772);
this._removeNodeFromParent(node);
        } else {_yuitest_coverline("build/treeview-tree/treeview-tree.js", 773);
if (this.rootNode === node) {
            // Guess we'll need a new root node!
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 775);
this.rootNode = this.createNode(this._rootNodeConfig);
        }}}
    },

    _defSelectFn: function (e) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_defSelectFn", 779);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 780);
if (!this.get('multiSelect')) {
            _yuitest_coverline("build/treeview-tree/treeview-tree.js", 781);
this.unselect();
        }

        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 784);
e.node.state.selected = true;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 785);
this._selectedMap[e.node.id] = e.node;
    },

    _defUnselectFn: function (e) {
        _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "_defUnselectFn", 788);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 789);
delete e.node.state.selected;
        _yuitest_coverline("build/treeview-tree/treeview-tree.js", 790);
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

        @attribute {TreeView.Node} rootNode
        @readOnly
        **/
        rootNode: {
            getter: function () {
                _yuitest_coverfunc("build/treeview-tree/treeview-tree.js", "getter", 811);
_yuitest_coverline("build/treeview-tree/treeview-tree.js", 812);
return this.rootNode;
            },

            readOnly: true
        }
    }
});


}, '@VERSION@', {"requires": ["base-build", "treeview-node"]});
