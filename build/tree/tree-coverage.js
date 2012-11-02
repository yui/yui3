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
_yuitest_coverage["build/tree/tree.js"].code=["YUI.add('tree', function (Y, NAME) {","","/**","Provides the `Tree` class.","","@module tree","**/","","/**","The `Tree` class represents a generic tree data structure. A tree has a root","node, which may contain any number of child nodes, which may themselves contain","child nodes, ad infinitum.","","This class doesn't expose any UI, but is extended by the `TreeView` class, which","does.","","@class Tree","@param {Object} [config] Config options.","    @param {Object[]|Tree.Node[]} [config.nodes] Array of tree node config","        objects or `Tree.Node` instances to add to this tree at initialization","        time.","    @param {Object|Tree.Node} [config.rootNode] Node to use as the root node of","        this tree.","@constructor","@extends Base","**/","","var Lang = Y.Lang,","","    /**","    Fired when a node is added to this Tree. The `src` property will indicate","    how the node was added (\"append\", \"insert\", \"prepend\", etc.).","","    @event add","    @param {Number} index Index at which the node will be added.","    @param {Tree.Node} node Node being added.","    @param {Tree.Node} parent Parent node to which the node will be added.","    @param {String} src Source of the event (\"append\", \"insert\", \"prepend\",","        etc.).","    @preventable _defAddFn","    **/","    EVT_ADD = 'add',","","    /**","    Fired when this Tree is cleared.","","    @event clear","    @param {Tree.Node} rootNode New root node of this tree (the old root node is","        always destroyed when a tree is cleared).","    @preventable _defClearFn","    **/","    EVT_CLEAR = 'clear',","","    /**","    Fired when a node is closed.","","    @event close","    @param {Tree.Node} node Node being closed.","    @preventable _defCloseFn","    **/","    EVT_CLOSE = 'close',","","    /**","    Fired when a node is opened.","","    @event open","    @param {Tree.Node} node Node being opened.","    @preventable _defOpenFn","    **/","    EVT_OPEN = 'open',","","    /**","    Fired when a node is removed from this Tree.","","    @event remove","    @param {Boolean} destroy Whether or not the node will be destroyed after","        being removed from this tree.","    @param {Tree.Node} node Node being removed.","    @param {Tree.Node} parent Parent node from which the node will be removed.","    @preventable _defRemoveFn","    **/","    EVT_REMOVE = 'remove',","","    /**","    Fired when a node is selected.","","    @event select","    @param {Tree.Node} node Node being selected.","    @preventable _defSelectFn","    **/","    EVT_SELECT = 'select',","","    /**","    Fired when a node is unselected.","","    @event unselect","    @param {Tree.Node} node Node being unselected.","    @preventable _defUnselectFn","    **/","    EVT_UNSELECT = 'unselect';","","var Tree = Y.Base.create('tree', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Root node of this Tree.","","    @property {Tree.Node} rootNode","    @readOnly","    **/","","    /**","    The `Tree.Node` class or subclass that should be used for nodes created by","    this tree.","","    You may specific an actual class reference or a string that resolves to a","    class reference at runtime.","","    @property {String|Tree.Node} nodeClass","    @default Y.Tree.Node","    **/","    nodeClass: Y.Tree.Node,","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a Tree instance.","","    @property {Boolean} _isYUITree","    @default true","    @protected","    **/","    _isYUITree: true,","","    /**","    Mapping of node ids to node instances for nodes in this tree.","","    @property {Object} _nodeMap","    @protected","    **/","","    /**","    Default config object for the root node.","","    @property {Object} _rootNodeConfig","    @protected","    **/","    _rootNodeConfig: {canHaveChildren: true},","","    /**","    Mapping of node ids to node instances for nodes in this tree that are","    currently selected.","","    @property {Object} _selectedMap","    @protected","    **/","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        config || (config = {});","","        /**","        Hash of published custom events.","","        @property {Object} _published","        @default {}","        @protected","        **/","        this._published || (this._published = {});","","        this._nodeMap = {};","","        if (typeof this.nodeClass === 'string') {","            // Look for a namespaced node class on `Y`.","            this.nodeClass = Y.Object.getValue(Y, this.nodeClass.split('.'));","","            if (!this.nodeClass) {","                Y.error('Tree: Node class not found: ' + this.nodeClass);","            }","        }","","        this.clear(config.rootNode, {silent: true});","        this._attachTreeEvents();","","        if (config.nodes) {","            this.appendNode(this.rootNode, config.nodes, {silent: true});","        }","    },","","    destructor: function () {","        this.destroyNode(this.rootNode, {silent: true});","","        this._detachTreeEvents();","","        delete this.rootNode;","        delete this._nodeMap;","        delete this._published;","        delete this._selectedMap;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends a node or array of nodes as the last child of the specified parent","    node.","","    If a node being appended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method appendNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to append","        to the given parent. Node config objects will automatically be converted","        into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        appended.","    **/","    appendNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: parent.children.length,","            src  : 'append'","        }));","    },","","    /**","    Clears this tree by destroying the root node and all its children. If a","    `rootNode` argument is provided, that node will become the root node of this","    tree; otherwise, a new root node will be created.","","    @method clear","    @param {Object|Tree.Node} [rootNode] If specified, this node will be used as","        the new root node.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `clear` event","            will be suppressed.","    @chainable","    **/","    clear: function (rootNode, options) {","        return this._fire(EVT_CLEAR, {","            rootNode: this.createNode(rootNode || this._rootNodeConfig)","        }, {","            defaultFn: this._defClearFn,","            silent   : options && options.silent","        });","    },","","    /**","    Closes the specified node if it isn't already closed.","","    @method closeNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `close` event","            will be suppressed.","    @chainable","    **/","    closeNode: function (node, options) {","        if (node.canHaveChildren && node.isOpen()) {","            this._fire(EVT_CLOSE, {node: node}, {","                defaultFn: this._defCloseFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Creates and returns a new `Tree.Node` instance associated with (but not","    yet appended to) this tree.","","    @method createNode","    @param {Object|Tree.Node} [config] Node configuration. If a `Tree.Node`","        instance is specified instead of a config object, that node will be","        adopted into this tree (if it doesn't already belong to this tree) and","        removed from any other tree to which it belongs.","    @return {Tree.Node} New node.","    **/","    createNode: function (config) {","        config || (config = {});","","        // If `config` is already a node, just ensure it's in the node map and","        // return it.","        if (config._isYUITreeNode) {","            this._adoptNode(config);","            return config;","        }","","        // First, create nodes for any children of this node.","        if (config.children) {","            var children = [];","","            for (var i = 0, len = config.children.length; i < len; i++) {","                children.push(this.createNode(config.children[i]));","            }","","            config = Y.merge(config, {children: children});","        }","","        var node = new this.nodeClass(this, config);","        return this._nodeMap[node.id] = node;","    },","","    /**","    Removes and destroys a node and all its child nodes. Once destroyed, a node","    is eligible for garbage collection and cannot be reused or re-added to the","    tree.","","    @method destroyNode","    @param {Tree.Node} node Node to destroy.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @chainable","    **/","    destroyNode: function (node, options) {","        var child, i, len;","","        options || (options = {});","","        for (i = 0, len = node.children.length; i < len; i++) {","            child = node.children[i];","","            // Manually remove the child from its parent; this makes destroying","            // all children of the parent much faster since there's no splicing","            // involved.","            delete child.parent;","","            // Destroy the child.","            this.destroyNode(child, options);","        }","","        if (node.parent) {","            this.removeNode(node, options);","        }","","        delete node.children;","        delete node.data;","        delete node.state;","        delete node.tree;","        delete node._htmlNode;","        delete node._indexMap;","","        delete this._nodeMap[node.id];","","        node.state = {destroyed: true};","","        return this;","    },","","    /**","    Removes all children from the specified node. The removed children will","    still be reusable unless the `destroy` option is truthy.","","    @method emptyNode","    @param {Tree.Node} node Node to empty.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {Tree.Node[]} Array of removed child nodes.","    **/","    emptyNode: function (node, options) {","        var removed = [];","","        while (node.children.length) {","            removed.push(this.removeNode(node.children[0], options));","        }","","        return removed;","    },","","    /**","    Returns the tree node with the specified id, or `undefined` if the node","    doesn't exist in this tree.","","    @method getNodeById","    @param {String} id Node id.","    @return {Tree.Node} Node, or `undefined` if not found.","    **/","    getNodeById: function (id) {","        return this._nodeMap[id];","    },","","    /**","    Returns an array of nodes that are currently selected.","","    @method getSelectedNodes","    @return {Tree.Node[]} Array of selected nodes.","    **/","    getSelectedNodes: function () {","        return Y.Object.values(this._selectedMap);","    },","","    /**","    Inserts a node or array of nodes at the specified index under the given","    parent node, or appends them to the parent if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insertNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to insert","        under the given parent. Node config objects will automatically be","        converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {Tree.Node[]} Node or array of nodes that were inserted.","    **/","    insertNode: function (parent, node, options) {","        options || (options = {});","        parent  || (parent = this.rootNode);","","        var index = options.index;","","        if (typeof index === 'undefined') {","            index = this.rootNode.children.length;","        }","","        // If `node` is an array, recurse to insert each node it contains.","        if (Lang.isArray(node)) {","            var inserted = [];","","            node = node.concat(); // avoid modifying the passed array","","            for (var i = 0, len = node.length; i < len; i++) {","                inserted.push(this.insertNode(parent, node[i], options));","","                if ('index' in options) {","                    options.index += 1;","                }","            }","","            return inserted;","        }","","        node = this.createNode(node);","","        this._fire(EVT_ADD, {","            index : index,","            node  : node,","            parent: parent,","            src   : options.src || 'insert'","        }, {","            defaultFn: this._defAddFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Opens the specified node if it isn't already open.","","    @method openNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `open` event","            will be suppressed.","    @chainable","    **/","    openNode: function (node, options) {","        if (node.canHaveChildren && !node.isOpen()) {","            this._fire(EVT_OPEN, {node: node}, {","                defaultFn: this._defOpenFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Prepends a node or array of nodes at the beginning of the specified parent","    node.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prependNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to prepend to the given parent. Node config objects will","        automatically be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        prepended.","    **/","    prependNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: 0,","            src  : 'prepend'","        }));","    },","","    /**","    Removes the specified node from its parent node. The removed node will still","    be reusable unless the `destroy` option is truthy.","","    @method removeNode","    @param {Tree.Node} node Node to remove.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the node and all its","            children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @return {Tree.Node} Node that was removed.","    **/","    removeNode: function (node, options) {","        options || (options = {});","","        this._fire(EVT_REMOVE, {","            destroy: !!options.destroy,","            node   : node,","            parent : node.parent,","            src    : options.src || 'remove'","        }, {","            defaultFn: this._defRemoveFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Selects the specified node.","","    @method selectNode","    @param {Tree.Node} node Node to select.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `select` event","            will be suppressed.","    @chainable","    **/","    selectNode: function (node, options) {","        // Instead of calling node.isSelected(), we look for the node in this","        // tree's selectedMap, which ensures that the `select` event will fire","        // in cases such as a node being added to this tree with its selected","        // state already set to true.","        if (!this._selectedMap[node.id]) {","            this._fire(EVT_SELECT, {node: node}, {","                defaultFn: this._defSelectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Returns the total number of nodes in this tree, at all levels.","","    Use `rootNode.children.length` to get only the number of top-level nodes.","","    @method size","    @return {Number} Total number of nodes in this tree.","    **/","    size: function () {","        return this.rootNode.size();","    },","","    /**","    Toggles the open/closed state of the specified node.","","    @method toggleNode","    @param {Tree.Node} node Node to toggle.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, events will be","            suppressed.","    @chainable","    **/","    toggleNode: function (node, options) {","        return node.isOpen() ? this.closeNode(node, options) :","            this.openNode(node, options);","    },","","    /**","    Serializes this tree to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized tree object.","    **/","    toJSON: function () {","        return this.rootNode.toJSON();","    },","","    /**","    Unselects all selected nodes.","","    @method unselect","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselect: function (options) {","        for (var id in this._selectedMap) {","            if (this._selectedMap.hasOwnProperty(id)) {","                this.unselectNode(this._selectedMap[id], options);","            }","        }","","        return this;","    },","","    /**","    Unselects the specified node.","","    @method unselectNode","    @param {Tree.Node} node Node to unselect.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselectNode: function (node, options) {","        if (node.isSelected() || this._selectedMap[node.id]) {","            this._fire(EVT_UNSELECT, {node: node}, {","                defaultFn: this._defUnselectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Moves the specified node and all its children from another tree to this","    tree.","","    @method _adoptNode","    @param {Tree.Node} node Node to adopt.","    @param {Object} [options] Options to pass along to `removeNode()`.","    @protected","    **/","    _adoptNode: function (node, options) {","        var oldTree = node.tree;","","        if (oldTree === this) {","            return;","        }","","        for (var i = 0, len = node.children.length; i < len; i++) {","            this._adoptNode(node.children[i], {silent: true});","        }","","        oldTree.removeNode(node, options);","","        // TODO: update selectedMap?","        delete oldTree._nodeMap[node.id];","        this._nodeMap[node.id] = node;","        node.tree = this;","    },","","    _attachTreeEvents: function () {","        this._treeEvents || (this._treeEvents = []);","","        this._treeEvents.push(","            this.after('multiSelectChange', this._afterMultiSelectChange)","        );","    },","","    _detachTreeEvents: function () {","        (new Y.EventHandle(this._treeEvents)).detach();","        this._treeEvents = [];","    },","","    /**","    Utility method for lazily publishing and firing events.","","    @method _fire","    @param {String} name Event name to fire.","    @param {Object} facade Event facade.","    @param {Object} [options] Options.","        @param {Function} [options.defaultFn] Default handler for this event.","        @param {Boolean} [options.silent=false] Whether the default handler","            should be executed directly without actually firing the event.","    @chainable","    @protected","    **/","    _fire: function (name, facade, options) {","        if (options && options.silent) {","            if (options.defaultFn) {","                options.defaultFn.call(this, facade);","            }","        } else {","            if (options && options.defaultFn && !this._published[name]) {","                this._published[name] = this.publish(name, {","                    defaultFn: options.defaultFn","                });","            }","","            this.fire(name, facade);","        }","","        return this;","    },","","    /**","    Removes the specified node from its parent node if it has one.","","    @method _removeNodeFromParent","    @param {Tree.Node} node Node to remove.","    @protected","    **/","    _removeNodeFromParent: function (node) {","        var parent = node.parent,","            index;","","        if (parent) {","            index = parent.indexOf(node);","","            if (index > -1) {","                parent.children.splice(index, 1);","                parent._isIndexStale = true;","                delete node.parent;","            }","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterMultiSelectChange: function (e) {","        this.multiSelect = e.newVal; // for faster lookups","        this.unselect();","    },","","    // -- Default Event Handlers -----------------------------------------------","    _defAddFn: function (e) {","        var node   = e.node,","            parent = e.parent;","","        // Remove the node from its existing parent if it has one.","        this._removeNodeFromParent(node);","","        // Add the node to its new parent at the desired index.","        node.parent = parent;","        parent.children.splice(e.index, 0, node);","","        parent.canHaveChildren = true;","        parent._isIndexStale   = true;","","        // If the node is marked as selected, we need go through the select","        // flow.","        if (node.isSelected()) {","            this.selectNode(node);","        }","    },","","    _defClearFn: function (e) {","        var newRootNode = e.rootNode;","","        if (this.rootNode) {","            this.destroyNode(this.rootNode, {silent: true});","        }","","        this._nodeMap     = {};","        this._selectedMap = {};","","        this._nodeMap[newRootNode.id] = newRootNode;","        this.rootNode = newRootNode;","    },","","    _defCloseFn: function (e) {","        delete e.node.state.open;","    },","","    _defOpenFn: function (e) {","        e.node.state.open = true;","    },","","    _defRemoveFn: function (e) {","        var node = e.node;","","        delete node.state.selected;","        delete this._selectedMap[node.id];","","        if (e.destroy) {","            this.destroyNode(node, {silent: true});","        } else if (e.parent) {","            this._removeNodeFromParent(node);","        } else if (this.rootNode === node) {","            // Guess we'll need a new root node!","            this.rootNode = this.createNode(this._rootNodeConfig);","        }","    },","","    _defSelectFn: function (e) {","        if (!this.get('multiSelect')) {","            this.unselect();","        }","","        e.node.state.selected = true;","        this._selectedMap[e.node.id] = e.node;","    },","","    _defUnselectFn: function (e) {","        delete e.node.state.selected;","        delete this._selectedMap[e.node.id];","    }","}, {","    ATTRS: {","        /**","        Whether or not to allow multiple nodes to be selected at once.","","        @attribute {Boolean} multiSelect","        @default false","        **/","        multiSelect: {","            value: false","        },","","        /**","        Root node of this treeview.","","        @attribute {Tree.Node} rootNode","        @readOnly","        **/","        rootNode: {","            getter: function () {","                return this.rootNode;","            },","","            readOnly: true","        }","    }","});","","Y.Tree = Y.mix(Tree, Y.Tree);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"tree-node\"]});"];
_yuitest_coverage["build/tree/tree.js"].lines = {"1":0,"28":0,"102":0,"160":0,"169":0,"171":0,"173":0,"175":0,"177":0,"178":0,"182":0,"183":0,"185":0,"186":0,"191":0,"193":0,"195":0,"196":0,"197":0,"198":0,"223":0,"243":0,"261":0,"262":0,"268":0,"283":0,"287":0,"288":0,"289":0,"293":0,"294":0,"296":0,"297":0,"300":0,"303":0,"304":0,"320":0,"322":0,"324":0,"325":0,"330":0,"333":0,"336":0,"337":0,"340":0,"341":0,"342":0,"343":0,"344":0,"345":0,"347":0,"349":0,"351":0,"369":0,"371":0,"372":0,"375":0,"387":0,"397":0,"424":0,"425":0,"427":0,"429":0,"430":0,"434":0,"435":0,"437":0,"439":0,"440":0,"442":0,"443":0,"447":0,"450":0,"452":0,"462":0,"475":0,"476":0,"482":0,"505":0,"526":0,"528":0,"538":0,"556":0,"557":0,"563":0,"575":0,"589":0,"600":0,"613":0,"614":0,"615":0,"619":0,"633":0,"634":0,"640":0,"655":0,"657":0,"658":0,"661":0,"662":0,"665":0,"668":0,"669":0,"670":0,"674":0,"676":0,"682":0,"683":0,"700":0,"701":0,"702":0,"705":0,"706":0,"711":0,"714":0,"725":0,"728":0,"729":0,"731":0,"732":0,"733":0,"734":0,"741":0,"742":0,"747":0,"751":0,"754":0,"755":0,"757":0,"758":0,"762":0,"763":0,"768":0,"770":0,"771":0,"774":0,"775":0,"777":0,"778":0,"782":0,"786":0,"790":0,"792":0,"793":0,"795":0,"796":0,"797":0,"798":0,"799":0,"801":0,"806":0,"807":0,"810":0,"811":0,"815":0,"816":0,"838":0,"846":0};
_yuitest_coverage["build/tree/tree.js"].functions = {"initializer:159":0,"destructor:190":0,"appendNode:222":0,"clear:242":0,"closeNode:260":0,"createNode:282":0,"destroyNode:319":0,"emptyNode:368":0,"getNodeById:386":0,"getSelectedNodes:396":0,"insertNode:423":0,"openNode:474":0,"prependNode:504":0,"removeNode:525":0,"selectNode:551":0,"size:574":0,"toggleNode:588":0,"toJSON:599":0,"unselect:612":0,"unselectNode:632":0,"_adoptNode:654":0,"_attachTreeEvents:673":0,"_detachTreeEvents:681":0,"_fire:699":0,"_removeNodeFromParent:724":0,"_afterMultiSelectChange:740":0,"_defAddFn:746":0,"_defClearFn:767":0,"_defCloseFn:781":0,"_defOpenFn:785":0,"_defRemoveFn:789":0,"_defSelectFn:805":0,"_defUnselectFn:814":0,"getter:837":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tree/tree.js"].coveredLines = 158;
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
        _yuitest_coverfunc("build/tree/tree.js", "initializer", 159);
_yuitest_coverline("build/tree/tree.js", 160);
config || (config = {});

        /**
        Hash of published custom events.

        @property {Object} _published
        @default {}
        @protected
        **/
        _yuitest_coverline("build/tree/tree.js", 169);
this._published || (this._published = {});

        _yuitest_coverline("build/tree/tree.js", 171);
this._nodeMap = {};

        _yuitest_coverline("build/tree/tree.js", 173);
if (typeof this.nodeClass === 'string') {
            // Look for a namespaced node class on `Y`.
            _yuitest_coverline("build/tree/tree.js", 175);
this.nodeClass = Y.Object.getValue(Y, this.nodeClass.split('.'));

            _yuitest_coverline("build/tree/tree.js", 177);
if (!this.nodeClass) {
                _yuitest_coverline("build/tree/tree.js", 178);
Y.error('Tree: Node class not found: ' + this.nodeClass);
            }
        }

        _yuitest_coverline("build/tree/tree.js", 182);
this.clear(config.rootNode, {silent: true});
        _yuitest_coverline("build/tree/tree.js", 183);
this._attachTreeEvents();

        _yuitest_coverline("build/tree/tree.js", 185);
if (config.nodes) {
            _yuitest_coverline("build/tree/tree.js", 186);
this.appendNode(this.rootNode, config.nodes, {silent: true});
        }
    },

    destructor: function () {
        _yuitest_coverfunc("build/tree/tree.js", "destructor", 190);
_yuitest_coverline("build/tree/tree.js", 191);
this.destroyNode(this.rootNode, {silent: true});

        _yuitest_coverline("build/tree/tree.js", 193);
this._detachTreeEvents();

        _yuitest_coverline("build/tree/tree.js", 195);
delete this.rootNode;
        _yuitest_coverline("build/tree/tree.js", 196);
delete this._nodeMap;
        _yuitest_coverline("build/tree/tree.js", 197);
delete this._published;
        _yuitest_coverline("build/tree/tree.js", 198);
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
        _yuitest_coverfunc("build/tree/tree.js", "appendNode", 222);
_yuitest_coverline("build/tree/tree.js", 223);
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
        _yuitest_coverfunc("build/tree/tree.js", "clear", 242);
_yuitest_coverline("build/tree/tree.js", 243);
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
        _yuitest_coverfunc("build/tree/tree.js", "closeNode", 260);
_yuitest_coverline("build/tree/tree.js", 261);
if (node.canHaveChildren && node.isOpen()) {
            _yuitest_coverline("build/tree/tree.js", 262);
this._fire(EVT_CLOSE, {node: node}, {
                defaultFn: this._defCloseFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/tree/tree.js", 268);
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
        _yuitest_coverfunc("build/tree/tree.js", "createNode", 282);
_yuitest_coverline("build/tree/tree.js", 283);
config || (config = {});

        // If `config` is already a node, just ensure it's in the node map and
        // return it.
        _yuitest_coverline("build/tree/tree.js", 287);
if (config._isYUITreeNode) {
            _yuitest_coverline("build/tree/tree.js", 288);
this._adoptNode(config);
            _yuitest_coverline("build/tree/tree.js", 289);
return config;
        }

        // First, create nodes for any children of this node.
        _yuitest_coverline("build/tree/tree.js", 293);
if (config.children) {
            _yuitest_coverline("build/tree/tree.js", 294);
var children = [];

            _yuitest_coverline("build/tree/tree.js", 296);
for (var i = 0, len = config.children.length; i < len; i++) {
                _yuitest_coverline("build/tree/tree.js", 297);
children.push(this.createNode(config.children[i]));
            }

            _yuitest_coverline("build/tree/tree.js", 300);
config = Y.merge(config, {children: children});
        }

        _yuitest_coverline("build/tree/tree.js", 303);
var node = new this.nodeClass(this, config);
        _yuitest_coverline("build/tree/tree.js", 304);
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
        _yuitest_coverfunc("build/tree/tree.js", "destroyNode", 319);
_yuitest_coverline("build/tree/tree.js", 320);
var child, i, len;

        _yuitest_coverline("build/tree/tree.js", 322);
options || (options = {});

        _yuitest_coverline("build/tree/tree.js", 324);
for (i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/tree/tree.js", 325);
child = node.children[i];

            // Manually remove the child from its parent; this makes destroying
            // all children of the parent much faster since there's no splicing
            // involved.
            _yuitest_coverline("build/tree/tree.js", 330);
delete child.parent;

            // Destroy the child.
            _yuitest_coverline("build/tree/tree.js", 333);
this.destroyNode(child, options);
        }

        _yuitest_coverline("build/tree/tree.js", 336);
if (node.parent) {
            _yuitest_coverline("build/tree/tree.js", 337);
this.removeNode(node, options);
        }

        _yuitest_coverline("build/tree/tree.js", 340);
delete node.children;
        _yuitest_coverline("build/tree/tree.js", 341);
delete node.data;
        _yuitest_coverline("build/tree/tree.js", 342);
delete node.state;
        _yuitest_coverline("build/tree/tree.js", 343);
delete node.tree;
        _yuitest_coverline("build/tree/tree.js", 344);
delete node._htmlNode;
        _yuitest_coverline("build/tree/tree.js", 345);
delete node._indexMap;

        _yuitest_coverline("build/tree/tree.js", 347);
delete this._nodeMap[node.id];

        _yuitest_coverline("build/tree/tree.js", 349);
node.state = {destroyed: true};

        _yuitest_coverline("build/tree/tree.js", 351);
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
        _yuitest_coverfunc("build/tree/tree.js", "emptyNode", 368);
_yuitest_coverline("build/tree/tree.js", 369);
var removed = [];

        _yuitest_coverline("build/tree/tree.js", 371);
while (node.children.length) {
            _yuitest_coverline("build/tree/tree.js", 372);
removed.push(this.removeNode(node.children[0], options));
        }

        _yuitest_coverline("build/tree/tree.js", 375);
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
        _yuitest_coverfunc("build/tree/tree.js", "getNodeById", 386);
_yuitest_coverline("build/tree/tree.js", 387);
return this._nodeMap[id];
    },

    /**
    Returns an array of nodes that are currently selected.

    @method getSelectedNodes
    @return {Tree.Node[]} Array of selected nodes.
    **/
    getSelectedNodes: function () {
        _yuitest_coverfunc("build/tree/tree.js", "getSelectedNodes", 396);
_yuitest_coverline("build/tree/tree.js", 397);
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
        _yuitest_coverfunc("build/tree/tree.js", "insertNode", 423);
_yuitest_coverline("build/tree/tree.js", 424);
options || (options = {});
        _yuitest_coverline("build/tree/tree.js", 425);
parent  || (parent = this.rootNode);

        _yuitest_coverline("build/tree/tree.js", 427);
var index = options.index;

        _yuitest_coverline("build/tree/tree.js", 429);
if (typeof index === 'undefined') {
            _yuitest_coverline("build/tree/tree.js", 430);
index = this.rootNode.children.length;
        }

        // If `node` is an array, recurse to insert each node it contains.
        _yuitest_coverline("build/tree/tree.js", 434);
if (Lang.isArray(node)) {
            _yuitest_coverline("build/tree/tree.js", 435);
var inserted = [];

            _yuitest_coverline("build/tree/tree.js", 437);
node = node.concat(); // avoid modifying the passed array

            _yuitest_coverline("build/tree/tree.js", 439);
for (var i = 0, len = node.length; i < len; i++) {
                _yuitest_coverline("build/tree/tree.js", 440);
inserted.push(this.insertNode(parent, node[i], options));

                _yuitest_coverline("build/tree/tree.js", 442);
if ('index' in options) {
                    _yuitest_coverline("build/tree/tree.js", 443);
options.index += 1;
                }
            }

            _yuitest_coverline("build/tree/tree.js", 447);
return inserted;
        }

        _yuitest_coverline("build/tree/tree.js", 450);
node = this.createNode(node);

        _yuitest_coverline("build/tree/tree.js", 452);
this._fire(EVT_ADD, {
            index : index,
            node  : node,
            parent: parent,
            src   : options.src || 'insert'
        }, {
            defaultFn: this._defAddFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/tree/tree.js", 462);
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
        _yuitest_coverfunc("build/tree/tree.js", "openNode", 474);
_yuitest_coverline("build/tree/tree.js", 475);
if (node.canHaveChildren && !node.isOpen()) {
            _yuitest_coverline("build/tree/tree.js", 476);
this._fire(EVT_OPEN, {node: node}, {
                defaultFn: this._defOpenFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/tree/tree.js", 482);
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
        _yuitest_coverfunc("build/tree/tree.js", "prependNode", 504);
_yuitest_coverline("build/tree/tree.js", 505);
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
        _yuitest_coverfunc("build/tree/tree.js", "removeNode", 525);
_yuitest_coverline("build/tree/tree.js", 526);
options || (options = {});

        _yuitest_coverline("build/tree/tree.js", 528);
this._fire(EVT_REMOVE, {
            destroy: !!options.destroy,
            node   : node,
            parent : node.parent,
            src    : options.src || 'remove'
        }, {
            defaultFn: this._defRemoveFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/tree/tree.js", 538);
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
        _yuitest_coverfunc("build/tree/tree.js", "selectNode", 551);
_yuitest_coverline("build/tree/tree.js", 556);
if (!this._selectedMap[node.id]) {
            _yuitest_coverline("build/tree/tree.js", 557);
this._fire(EVT_SELECT, {node: node}, {
                defaultFn: this._defSelectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/tree/tree.js", 563);
return this;
    },

    /**
    Returns the total number of nodes in this tree, at all levels.

    Use `rootNode.children.length` to get only the number of top-level nodes.

    @method size
    @return {Number} Total number of nodes in this tree.
    **/
    size: function () {
        _yuitest_coverfunc("build/tree/tree.js", "size", 574);
_yuitest_coverline("build/tree/tree.js", 575);
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
        _yuitest_coverfunc("build/tree/tree.js", "toggleNode", 588);
_yuitest_coverline("build/tree/tree.js", 589);
return node.isOpen() ? this.closeNode(node, options) :
            this.openNode(node, options);
    },

    /**
    Serializes this tree to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized tree object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/tree/tree.js", "toJSON", 599);
_yuitest_coverline("build/tree/tree.js", 600);
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
        _yuitest_coverfunc("build/tree/tree.js", "unselect", 612);
_yuitest_coverline("build/tree/tree.js", 613);
for (var id in this._selectedMap) {
            _yuitest_coverline("build/tree/tree.js", 614);
if (this._selectedMap.hasOwnProperty(id)) {
                _yuitest_coverline("build/tree/tree.js", 615);
this.unselectNode(this._selectedMap[id], options);
            }
        }

        _yuitest_coverline("build/tree/tree.js", 619);
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
        _yuitest_coverfunc("build/tree/tree.js", "unselectNode", 632);
_yuitest_coverline("build/tree/tree.js", 633);
if (node.isSelected() || this._selectedMap[node.id]) {
            _yuitest_coverline("build/tree/tree.js", 634);
this._fire(EVT_UNSELECT, {node: node}, {
                defaultFn: this._defUnselectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/tree/tree.js", 640);
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
        _yuitest_coverfunc("build/tree/tree.js", "_adoptNode", 654);
_yuitest_coverline("build/tree/tree.js", 655);
var oldTree = node.tree;

        _yuitest_coverline("build/tree/tree.js", 657);
if (oldTree === this) {
            _yuitest_coverline("build/tree/tree.js", 658);
return;
        }

        _yuitest_coverline("build/tree/tree.js", 661);
for (var i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/tree/tree.js", 662);
this._adoptNode(node.children[i], {silent: true});
        }

        _yuitest_coverline("build/tree/tree.js", 665);
oldTree.removeNode(node, options);

        // TODO: update selectedMap?
        _yuitest_coverline("build/tree/tree.js", 668);
delete oldTree._nodeMap[node.id];
        _yuitest_coverline("build/tree/tree.js", 669);
this._nodeMap[node.id] = node;
        _yuitest_coverline("build/tree/tree.js", 670);
node.tree = this;
    },

    _attachTreeEvents: function () {
        _yuitest_coverfunc("build/tree/tree.js", "_attachTreeEvents", 673);
_yuitest_coverline("build/tree/tree.js", 674);
this._treeEvents || (this._treeEvents = []);

        _yuitest_coverline("build/tree/tree.js", 676);
this._treeEvents.push(
            this.after('multiSelectChange', this._afterMultiSelectChange)
        );
    },

    _detachTreeEvents: function () {
        _yuitest_coverfunc("build/tree/tree.js", "_detachTreeEvents", 681);
_yuitest_coverline("build/tree/tree.js", 682);
(new Y.EventHandle(this._treeEvents)).detach();
        _yuitest_coverline("build/tree/tree.js", 683);
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
        _yuitest_coverfunc("build/tree/tree.js", "_fire", 699);
_yuitest_coverline("build/tree/tree.js", 700);
if (options && options.silent) {
            _yuitest_coverline("build/tree/tree.js", 701);
if (options.defaultFn) {
                _yuitest_coverline("build/tree/tree.js", 702);
options.defaultFn.call(this, facade);
            }
        } else {
            _yuitest_coverline("build/tree/tree.js", 705);
if (options && options.defaultFn && !this._published[name]) {
                _yuitest_coverline("build/tree/tree.js", 706);
this._published[name] = this.publish(name, {
                    defaultFn: options.defaultFn
                });
            }

            _yuitest_coverline("build/tree/tree.js", 711);
this.fire(name, facade);
        }

        _yuitest_coverline("build/tree/tree.js", 714);
return this;
    },

    /**
    Removes the specified node from its parent node if it has one.

    @method _removeNodeFromParent
    @param {Tree.Node} node Node to remove.
    @protected
    **/
    _removeNodeFromParent: function (node) {
        _yuitest_coverfunc("build/tree/tree.js", "_removeNodeFromParent", 724);
_yuitest_coverline("build/tree/tree.js", 725);
var parent = node.parent,
            index;

        _yuitest_coverline("build/tree/tree.js", 728);
if (parent) {
            _yuitest_coverline("build/tree/tree.js", 729);
index = parent.indexOf(node);

            _yuitest_coverline("build/tree/tree.js", 731);
if (index > -1) {
                _yuitest_coverline("build/tree/tree.js", 732);
parent.children.splice(index, 1);
                _yuitest_coverline("build/tree/tree.js", 733);
parent._isIndexStale = true;
                _yuitest_coverline("build/tree/tree.js", 734);
delete node.parent;
            }
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_afterMultiSelectChange", 740);
_yuitest_coverline("build/tree/tree.js", 741);
this.multiSelect = e.newVal; // for faster lookups
        _yuitest_coverline("build/tree/tree.js", 742);
this.unselect();
    },

    // -- Default Event Handlers -----------------------------------------------
    _defAddFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defAddFn", 746);
_yuitest_coverline("build/tree/tree.js", 747);
var node   = e.node,
            parent = e.parent;

        // Remove the node from its existing parent if it has one.
        _yuitest_coverline("build/tree/tree.js", 751);
this._removeNodeFromParent(node);

        // Add the node to its new parent at the desired index.
        _yuitest_coverline("build/tree/tree.js", 754);
node.parent = parent;
        _yuitest_coverline("build/tree/tree.js", 755);
parent.children.splice(e.index, 0, node);

        _yuitest_coverline("build/tree/tree.js", 757);
parent.canHaveChildren = true;
        _yuitest_coverline("build/tree/tree.js", 758);
parent._isIndexStale   = true;

        // If the node is marked as selected, we need go through the select
        // flow.
        _yuitest_coverline("build/tree/tree.js", 762);
if (node.isSelected()) {
            _yuitest_coverline("build/tree/tree.js", 763);
this.selectNode(node);
        }
    },

    _defClearFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defClearFn", 767);
_yuitest_coverline("build/tree/tree.js", 768);
var newRootNode = e.rootNode;

        _yuitest_coverline("build/tree/tree.js", 770);
if (this.rootNode) {
            _yuitest_coverline("build/tree/tree.js", 771);
this.destroyNode(this.rootNode, {silent: true});
        }

        _yuitest_coverline("build/tree/tree.js", 774);
this._nodeMap     = {};
        _yuitest_coverline("build/tree/tree.js", 775);
this._selectedMap = {};

        _yuitest_coverline("build/tree/tree.js", 777);
this._nodeMap[newRootNode.id] = newRootNode;
        _yuitest_coverline("build/tree/tree.js", 778);
this.rootNode = newRootNode;
    },

    _defCloseFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defCloseFn", 781);
_yuitest_coverline("build/tree/tree.js", 782);
delete e.node.state.open;
    },

    _defOpenFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defOpenFn", 785);
_yuitest_coverline("build/tree/tree.js", 786);
e.node.state.open = true;
    },

    _defRemoveFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defRemoveFn", 789);
_yuitest_coverline("build/tree/tree.js", 790);
var node = e.node;

        _yuitest_coverline("build/tree/tree.js", 792);
delete node.state.selected;
        _yuitest_coverline("build/tree/tree.js", 793);
delete this._selectedMap[node.id];

        _yuitest_coverline("build/tree/tree.js", 795);
if (e.destroy) {
            _yuitest_coverline("build/tree/tree.js", 796);
this.destroyNode(node, {silent: true});
        } else {_yuitest_coverline("build/tree/tree.js", 797);
if (e.parent) {
            _yuitest_coverline("build/tree/tree.js", 798);
this._removeNodeFromParent(node);
        } else {_yuitest_coverline("build/tree/tree.js", 799);
if (this.rootNode === node) {
            // Guess we'll need a new root node!
            _yuitest_coverline("build/tree/tree.js", 801);
this.rootNode = this.createNode(this._rootNodeConfig);
        }}}
    },

    _defSelectFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defSelectFn", 805);
_yuitest_coverline("build/tree/tree.js", 806);
if (!this.get('multiSelect')) {
            _yuitest_coverline("build/tree/tree.js", 807);
this.unselect();
        }

        _yuitest_coverline("build/tree/tree.js", 810);
e.node.state.selected = true;
        _yuitest_coverline("build/tree/tree.js", 811);
this._selectedMap[e.node.id] = e.node;
    },

    _defUnselectFn: function (e) {
        _yuitest_coverfunc("build/tree/tree.js", "_defUnselectFn", 814);
_yuitest_coverline("build/tree/tree.js", 815);
delete e.node.state.selected;
        _yuitest_coverline("build/tree/tree.js", 816);
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
                _yuitest_coverfunc("build/tree/tree.js", "getter", 837);
_yuitest_coverline("build/tree/tree.js", 838);
return this.rootNode;
            },

            readOnly: true
        }
    }
});

_yuitest_coverline("build/tree/tree.js", 846);
Y.Tree = Y.mix(Tree, Y.Tree);


}, '@VERSION@', {"requires": ["base-build", "tree-node"]});
