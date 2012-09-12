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
_yuitest_coverage["build/treeview-node/treeview-node.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/treeview-node/treeview-node.js",
    code: []
};
_yuitest_coverage["build/treeview-node/treeview-node.js"].code=["YUI.add('treeview-node', function (Y, NAME) {","","/**","Provides the `TreeView.Node` class, which represents a tree node contained in a","`TreeView.Tree` data structure.","","@module treeview","@submodule treeview-node","**/","","/**","Represents a tree node in a `TreeView.Tree` data structure.","","@class TreeView.Node","@param {TreeView.Tree} tree `TreeView.Tree` instance with which this node should","    be associated.","","@param {Object} [config] Configuration hash for this node.","","    @param {Boolean} [config.canHaveChildren=false] Whether or not this node can","        contain child nodes. Will be automatically set to `true` if not","        specified and `config.children` contains one or more children.","    @param {TreeView.Node[]} [config.children] Array of `TreeView.Node`","        instances for child nodes of this node.","    @param {Object} [config.data] Implementation-specific data related to this","        node. You may add arbitrary properties to this hash for your own use.","    @param {String} [config.id] Unique id for this node. This id must be unique","        among all TreeView nodes on the entire page, and will also be used as","        this node's DOM id when it's rendered. A unique id will be automatically","        generated unless you specify a custom value.","    @param {HTML} [config.label=''] User-visible HTML label for this node.","    @param {Object} [config.state] State hash for this node. You may add","        arbitrary state properties to this hash for your own use. See the","        docs for `TreeView.Node`'s `state` property for details on state values","        used internally by `TreeView.Node`.","","@constructor","**/","","function TreeNode(tree, config) {","    config || (config = {});","","    this.id   = this._yuid = config.id || Y.guid('treeNode-');","    this.tree = tree;","","    if ('label' in config) {","        this.label = config.label;","    }","","    this.children = config.children || [];","    this.data     = config.data || {};","    this.state    = config.state || {};","","    if (config.canHaveChildren) {","        this.canHaveChildren = config.canHaveChildren;","    } else if (this.children.length) {","        this.canHaveChildren = true;","    }","}","","TreeNode.prototype = {","    // -- Public Properties ----------------------------------------------------","","    /**","    Whether or not this node can contain child nodes.","","    This value is falsy by default unless child nodes are added at instantiation","    time, in which case it will be automatically set to `true`. You can also","    manually set it to `true` to indicate that a node can have children even if","    it doesn't currently have any children.","","    Note that regardless of the value of this property, appending, prepending,","    or inserting a node into this node will cause `canHaveChildren` to be set to","    true automatically.","","    @property {Boolean} canHaveChildren","    **/","","    /**","    Child nodes contained within this node.","","    @property {TreeView.Node[]} children","    @default []","    **/","","    /**","    Arbitrary implementation-specific data related to this node.","","    This property is created by setting a `data` property in the config object","    passed to TreeView.Node's constructor. It may contain any serializable data","    you want to store on this node instance.","","    @property {Object} data","    @default {}","    **/","","    /**","    Unique id for this node.","","    @property {String} id","    **/","","    /**","    User-visible HTML label for this node.","","    This value is rendered as HTML without sanitization, so *do not* put","    untrusted user input here without escaping it first using `Y.Escape.html()`.","","    @property {HTML} label","    @default ''","    **/","    label: '',","","    /**","    Parent node of this node, or `undefined` if this is an unattached node or","    the root node.","","    @property {TreeView.Node} parent","    **/","","    /**","    Current state of this node.","","    @property {Object} state","    @param {Boolean} [open=false] Whether or not this node is open (expanded).","    @param {Boolean} [selected=false] Whether or not this node is selected.","    **/","","    /**","    The TreeView.Tree instance with which this node is associated.","","    @property {TreeView.Tree} tree","    **/","","    // -- Protected Properties -------------------------------------------------","","    /**","    Mapping of child node ids to indices.","","    @property {Object} _indexMap","    @protected","    **/","","    /**","    Flag indicating whether the `_indexMap` is stale and needs to be rebuilt.","","    @property {Boolean} _isIndexStale","    @default true","    @protected","    **/","    _isIndexStale: true,","","    /**","    Simple way to type-check that this is an instance of TreeView.Node.","","    @property {Boolean} _isYUITreeNode","    @default true","    @protected","    **/","    _isYUITreeNode: true,","","    /**","    Array of property names on this node that should be serialized to JSON when","    `toJSON()` is called.","","    Note that the `children` and `state` properties are special cases that are","    managed outside of this list.","","    @property {String[]} _serializable","    @protected","    **/","    _serializable: ['canHaveChildren', 'data', 'id', 'label'],","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends the given tree node or array of nodes to the end of this node's","    children.","","    @method append","    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to append to the given parent. Node config objects will","        automatically be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {TreeView.Node|TreeView.Node[]} Node or array of nodes that were","        appended.","    **/","    append: function (node, options) {","        return this.tree.appendNode(this, node, options);","    },","","    // TODO: clone()?","","    /**","    Closes this node if it's currently open.","","    @method close","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `close` event","            will be suppressed.","    @chainable","    **/","    close: function (options) {","        this.tree.closeNode(this, options);","        return this;","    },","","    /**","    Removes all children from this node. The removed children will still be","    reusable unless the `destroy` option is truthy.","","    @method empty","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {TreeView.Node[]} Array of removed child nodes.","    **/","    empty: function (options) {","        return this.tree.emptyNode(this, options);","    },","","    /**","    Returns `true` if this node has one or more child nodes.","","    @method hasChildren","    @return {Boolean} `true` if this node has one or more child nodes, `false`","        otherwise.","    **/","    hasChildren: function () {","        return !!this.children.length;","    },","","    /**","    Returns the numerical index of this node within its parent node, or `-1` if","    this node doesn't have a parent node.","","    @method index","    @return {Number} Index of this node within its parent node, or `-1` if this","        node doesn't have a parent node.","    **/","    index: function () {","        return this.parent ? this.parent.indexOf(this) : -1;","    },","","    /**","    Returns the numerical index of the given child node, or `-1` if the node is","    not a child of this node.","","    @method indexOf","    @param {TreeView.Node} node Child node.","    @return {Number} Index of the child, or `-1` if the node is not a child of","        this node.","    **/","    indexOf: function (node) {","        var index;","","        if (this._isIndexStale) {","            this._reindex();","        }","","        index = this._indexMap[node.id];","","        return typeof index === 'undefined' ? -1 : index;","    },","","    /**","    Inserts a node or array of nodes at the specified index under this node, or","    appends them to this node if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insert","    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to insert under the given parent. Node config objects will","        automatically be converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {TreeView.Node[]} Node or array of nodes that were inserted.","    **/","    insert: function (node, options) {","        return this.tree.insertNode(this, node, options);","    },","","    /**","    Returns `true` if this node has been inserted into a tree, `false` if it is","    merely associated with a tree and has not yet been inserted.","","    @method isInTree","    @return {Boolean} `true` if this node has been inserted into a tree, `false`","        otherwise.","    **/","    isInTree: function () {","        if (this.tree.rootNode === this) {","            return true;","        }","","        return !!(this.parent && this.parent.isInTree());","    },","","    /**","    Returns `true` if this node is currently open.","","    @method isOpen","    @return {Boolean} `true` if this node is currently open, `false` otherwise.","    **/","    isOpen: function () {","        return !!this.state.open || this.isRoot();","    },","","    /**","    Returns `true` if this node is the root of the tree.","","    @method isRoot","    @return {Boolean} `true` if this node is the root of the tree, `false`","        otherwise.","    **/","    isRoot: function () {","        return this.tree.rootNode === this;","    },","","    /**","    Returns `true` if this node is currently selected.","","    @method isSelected","    @return {Boolean} `true` if this node is currently selected, `false`","        otherwise.","    **/","    isSelected: function () {","        return !!this.state.selected;","    },","","    /**","    Opens this node if it's currently closed.","","    @method open","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `open` event","            will be suppressed.","    @chainable","    **/","    open: function (options) {","        this.tree.openNode(this, options);","        return this;","    },","","    /**","    Prepends a node or array of nodes at the beginning of this node's children.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prepend","    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to prepend to this node. Node config objects will automatically","        be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {TreeView.Node|TreeView.Node[]} Node or array of nodes that were","        prepended.","    **/","    prepend: function (node, options) {","        return this.tree.prependNode(this, node, options);","    },","","    /**","    Removes this node from its parent node.","","    @method remove","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, this node and all","            its children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @chainable","    **/","    remove: function (options) {","        return this.tree.removeNode(this, options);","    },","","    /**","    Selects this node.","","    @method select","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `select` event","            will be suppressed.","    @chainable","    **/","    select: function (options) {","        this.tree.selectNode(this, options);","        return this;","    },","","    /**","    Returns the total number of nodes contained within this node, including all","    descendants of this node's children.","","    @method size","    @return {Number} Total number of nodes contained within this node, including","        all descendants.","    **/","    size: function () {","        var children = this.children,","            len      = children.length,","            total    = len;","","        for (var i = 0; i < len; i++) {","            total += children[i].size();","        }","","        return total;","    },","","    /**","    Toggles the open/closed state of this node.","","    @method toggle","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, events will be","            suppressed.","    @chainable","    **/","    toggle: function (options) {","        this.tree.toggleNode(this, options);","        return this;","    },","","    /**","    Serializes this node to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized node object.","    **/","    toJSON: function () {","        var obj   = {},","            state = this.state,","            i, key, len;","","        // Do nothing if this node is marked as destroyed.","        if (state.destroyed) {","            return null;","        }","","        // Serialize properties explicitly marked as serializable.","        for (i = 0, len = this._serializable.length; i < len; i++) {","            key = this._serializable[i];","","            if (key in this) {","                obj[key] = this[key];","            }","        }","","        // Serialize state values.","        obj.state = {};","","        if (state.open) {","            obj.state.open = true;","        }","","        if (state.selected) {","            obj.state.selected = true;","        }","","        // Serialize child nodes.","        if (this.canHaveChildren) {","            obj.children = [];","","            for (i = 0, len = this.children.length; i < len; i++) {","                obj.children.push(this.children[i].toJSON());","            }","        }","","        return obj;","    },","","    /**","    Unselects this node.","","    @method unselect","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselect: function (options) {","        this.tree.unselectNode(this, options);","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","    _reindex: function () {","        var children = this.children,","            indexMap = {},","            i, len;","","        for (i = 0, len = children.length; i < len; i++) {","            indexMap[children[i].id] = i;","        }","","        this._indexMap     = indexMap;","        this._isIndexStale = false;","    }","};","","Y.namespace('TreeView').Node = TreeNode;","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/treeview-node/treeview-node.js"].lines = {"1":0,"40":0,"41":0,"43":0,"44":0,"46":0,"47":0,"50":0,"51":0,"52":0,"54":0,"55":0,"56":0,"57":0,"61":0,"192":0,"207":0,"208":0,"225":0,"236":0,"248":0,"261":0,"263":0,"264":0,"267":0,"269":0,"295":0,"307":0,"308":0,"311":0,"321":0,"332":0,"343":0,"356":0,"357":0,"378":0,"394":0,"407":0,"408":0,"420":0,"424":0,"425":0,"428":0,"441":0,"442":0,"452":0,"457":0,"458":0,"462":0,"463":0,"465":0,"466":0,"471":0,"473":0,"474":0,"477":0,"478":0,"482":0,"483":0,"485":0,"486":0,"490":0,"503":0,"504":0,"509":0,"513":0,"514":0,"517":0,"518":0,"522":0};
_yuitest_coverage["build/treeview-node/treeview-node.js"].functions = {"TreeNode:40":0,"append:191":0,"close:206":0,"empty:224":0,"hasChildren:235":0,"index:247":0,"indexOf:260":0,"insert:294":0,"isInTree:306":0,"isOpen:320":0,"isRoot:331":0,"isSelected:342":0,"open:355":0,"prepend:377":0,"remove:393":0,"select:406":0,"size:419":0,"toggle:440":0,"toJSON:451":0,"unselect:502":0,"_reindex:508":0,"(anonymous 1):1":0};
_yuitest_coverage["build/treeview-node/treeview-node.js"].coveredLines = 70;
_yuitest_coverage["build/treeview-node/treeview-node.js"].coveredFunctions = 22;
_yuitest_coverline("build/treeview-node/treeview-node.js", 1);
YUI.add('treeview-node', function (Y, NAME) {

/**
Provides the `TreeView.Node` class, which represents a tree node contained in a
`TreeView.Tree` data structure.

@module treeview
@submodule treeview-node
**/

/**
Represents a tree node in a `TreeView.Tree` data structure.

@class TreeView.Node
@param {TreeView.Tree} tree `TreeView.Tree` instance with which this node should
    be associated.

@param {Object} [config] Configuration hash for this node.

    @param {Boolean} [config.canHaveChildren=false] Whether or not this node can
        contain child nodes. Will be automatically set to `true` if not
        specified and `config.children` contains one or more children.
    @param {TreeView.Node[]} [config.children] Array of `TreeView.Node`
        instances for child nodes of this node.
    @param {Object} [config.data] Implementation-specific data related to this
        node. You may add arbitrary properties to this hash for your own use.
    @param {String} [config.id] Unique id for this node. This id must be unique
        among all TreeView nodes on the entire page, and will also be used as
        this node's DOM id when it's rendered. A unique id will be automatically
        generated unless you specify a custom value.
    @param {HTML} [config.label=''] User-visible HTML label for this node.
    @param {Object} [config.state] State hash for this node. You may add
        arbitrary state properties to this hash for your own use. See the
        docs for `TreeView.Node`'s `state` property for details on state values
        used internally by `TreeView.Node`.

@constructor
**/

_yuitest_coverfunc("build/treeview-node/treeview-node.js", "(anonymous 1)", 1);
_yuitest_coverline("build/treeview-node/treeview-node.js", 40);
function TreeNode(tree, config) {
    _yuitest_coverfunc("build/treeview-node/treeview-node.js", "TreeNode", 40);
_yuitest_coverline("build/treeview-node/treeview-node.js", 41);
config || (config = {});

    _yuitest_coverline("build/treeview-node/treeview-node.js", 43);
this.id   = this._yuid = config.id || Y.guid('treeNode-');
    _yuitest_coverline("build/treeview-node/treeview-node.js", 44);
this.tree = tree;

    _yuitest_coverline("build/treeview-node/treeview-node.js", 46);
if ('label' in config) {
        _yuitest_coverline("build/treeview-node/treeview-node.js", 47);
this.label = config.label;
    }

    _yuitest_coverline("build/treeview-node/treeview-node.js", 50);
this.children = config.children || [];
    _yuitest_coverline("build/treeview-node/treeview-node.js", 51);
this.data     = config.data || {};
    _yuitest_coverline("build/treeview-node/treeview-node.js", 52);
this.state    = config.state || {};

    _yuitest_coverline("build/treeview-node/treeview-node.js", 54);
if (config.canHaveChildren) {
        _yuitest_coverline("build/treeview-node/treeview-node.js", 55);
this.canHaveChildren = config.canHaveChildren;
    } else {_yuitest_coverline("build/treeview-node/treeview-node.js", 56);
if (this.children.length) {
        _yuitest_coverline("build/treeview-node/treeview-node.js", 57);
this.canHaveChildren = true;
    }}
}

_yuitest_coverline("build/treeview-node/treeview-node.js", 61);
TreeNode.prototype = {
    // -- Public Properties ----------------------------------------------------

    /**
    Whether or not this node can contain child nodes.

    This value is falsy by default unless child nodes are added at instantiation
    time, in which case it will be automatically set to `true`. You can also
    manually set it to `true` to indicate that a node can have children even if
    it doesn't currently have any children.

    Note that regardless of the value of this property, appending, prepending,
    or inserting a node into this node will cause `canHaveChildren` to be set to
    true automatically.

    @property {Boolean} canHaveChildren
    **/

    /**
    Child nodes contained within this node.

    @property {TreeView.Node[]} children
    @default []
    **/

    /**
    Arbitrary implementation-specific data related to this node.

    This property is created by setting a `data` property in the config object
    passed to TreeView.Node's constructor. It may contain any serializable data
    you want to store on this node instance.

    @property {Object} data
    @default {}
    **/

    /**
    Unique id for this node.

    @property {String} id
    **/

    /**
    User-visible HTML label for this node.

    This value is rendered as HTML without sanitization, so *do not* put
    untrusted user input here without escaping it first using `Y.Escape.html()`.

    @property {HTML} label
    @default ''
    **/
    label: '',

    /**
    Parent node of this node, or `undefined` if this is an unattached node or
    the root node.

    @property {TreeView.Node} parent
    **/

    /**
    Current state of this node.

    @property {Object} state
    @param {Boolean} [open=false] Whether or not this node is open (expanded).
    @param {Boolean} [selected=false] Whether or not this node is selected.
    **/

    /**
    The TreeView.Tree instance with which this node is associated.

    @property {TreeView.Tree} tree
    **/

    // -- Protected Properties -------------------------------------------------

    /**
    Mapping of child node ids to indices.

    @property {Object} _indexMap
    @protected
    **/

    /**
    Flag indicating whether the `_indexMap` is stale and needs to be rebuilt.

    @property {Boolean} _isIndexStale
    @default true
    @protected
    **/
    _isIndexStale: true,

    /**
    Simple way to type-check that this is an instance of TreeView.Node.

    @property {Boolean} _isYUITreeNode
    @default true
    @protected
    **/
    _isYUITreeNode: true,

    /**
    Array of property names on this node that should be serialized to JSON when
    `toJSON()` is called.

    Note that the `children` and `state` properties are special cases that are
    managed outside of this list.

    @property {String[]} _serializable
    @protected
    **/
    _serializable: ['canHaveChildren', 'data', 'id', 'label'],

    // -- Public Methods -------------------------------------------------------

    /**
    Appends the given tree node or array of nodes to the end of this node's
    children.

    @method append
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
    append: function (node, options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "append", 191);
_yuitest_coverline("build/treeview-node/treeview-node.js", 192);
return this.tree.appendNode(this, node, options);
    },

    // TODO: clone()?

    /**
    Closes this node if it's currently open.

    @method close
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `close` event
            will be suppressed.
    @chainable
    **/
    close: function (options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "close", 206);
_yuitest_coverline("build/treeview-node/treeview-node.js", 207);
this.tree.closeNode(this, options);
        _yuitest_coverline("build/treeview-node/treeview-node.js", 208);
return this;
    },

    /**
    Removes all children from this node. The removed children will still be
    reusable unless the `destroy` option is truthy.

    @method empty
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, the children will
            also be destroyed, which makes them available for garbage collection
            and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, `remove` events will
            be suppressed.
    @return {TreeView.Node[]} Array of removed child nodes.
    **/
    empty: function (options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "empty", 224);
_yuitest_coverline("build/treeview-node/treeview-node.js", 225);
return this.tree.emptyNode(this, options);
    },

    /**
    Returns `true` if this node has one or more child nodes.

    @method hasChildren
    @return {Boolean} `true` if this node has one or more child nodes, `false`
        otherwise.
    **/
    hasChildren: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "hasChildren", 235);
_yuitest_coverline("build/treeview-node/treeview-node.js", 236);
return !!this.children.length;
    },

    /**
    Returns the numerical index of this node within its parent node, or `-1` if
    this node doesn't have a parent node.

    @method index
    @return {Number} Index of this node within its parent node, or `-1` if this
        node doesn't have a parent node.
    **/
    index: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "index", 247);
_yuitest_coverline("build/treeview-node/treeview-node.js", 248);
return this.parent ? this.parent.indexOf(this) : -1;
    },

    /**
    Returns the numerical index of the given child node, or `-1` if the node is
    not a child of this node.

    @method indexOf
    @param {TreeView.Node} node Child node.
    @return {Number} Index of the child, or `-1` if the node is not a child of
        this node.
    **/
    indexOf: function (node) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "indexOf", 260);
_yuitest_coverline("build/treeview-node/treeview-node.js", 261);
var index;

        _yuitest_coverline("build/treeview-node/treeview-node.js", 263);
if (this._isIndexStale) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 264);
this._reindex();
        }

        _yuitest_coverline("build/treeview-node/treeview-node.js", 267);
index = this._indexMap[node.id];

        _yuitest_coverline("build/treeview-node/treeview-node.js", 269);
return typeof index === 'undefined' ? -1 : index;
    },

    /**
    Inserts a node or array of nodes at the specified index under this node, or
    appends them to this node if no index is specified.

    If a node being inserted is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method insert
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
    insert: function (node, options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "insert", 294);
_yuitest_coverline("build/treeview-node/treeview-node.js", 295);
return this.tree.insertNode(this, node, options);
    },

    /**
    Returns `true` if this node has been inserted into a tree, `false` if it is
    merely associated with a tree and has not yet been inserted.

    @method isInTree
    @return {Boolean} `true` if this node has been inserted into a tree, `false`
        otherwise.
    **/
    isInTree: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "isInTree", 306);
_yuitest_coverline("build/treeview-node/treeview-node.js", 307);
if (this.tree.rootNode === this) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 308);
return true;
        }

        _yuitest_coverline("build/treeview-node/treeview-node.js", 311);
return !!(this.parent && this.parent.isInTree());
    },

    /**
    Returns `true` if this node is currently open.

    @method isOpen
    @return {Boolean} `true` if this node is currently open, `false` otherwise.
    **/
    isOpen: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "isOpen", 320);
_yuitest_coverline("build/treeview-node/treeview-node.js", 321);
return !!this.state.open || this.isRoot();
    },

    /**
    Returns `true` if this node is the root of the tree.

    @method isRoot
    @return {Boolean} `true` if this node is the root of the tree, `false`
        otherwise.
    **/
    isRoot: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "isRoot", 331);
_yuitest_coverline("build/treeview-node/treeview-node.js", 332);
return this.tree.rootNode === this;
    },

    /**
    Returns `true` if this node is currently selected.

    @method isSelected
    @return {Boolean} `true` if this node is currently selected, `false`
        otherwise.
    **/
    isSelected: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "isSelected", 342);
_yuitest_coverline("build/treeview-node/treeview-node.js", 343);
return !!this.state.selected;
    },

    /**
    Opens this node if it's currently closed.

    @method open
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `open` event
            will be suppressed.
    @chainable
    **/
    open: function (options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "open", 355);
_yuitest_coverline("build/treeview-node/treeview-node.js", 356);
this.tree.openNode(this, options);
        _yuitest_coverline("build/treeview-node/treeview-node.js", 357);
return this;
    },

    /**
    Prepends a node or array of nodes at the beginning of this node's children.

    If a node being prepended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method prepend
    @param {Object|Object[]|TreeView.Node|TreeView.Node[]} node Child node,
        node config object, array of child nodes, or array of node config
        objects to prepend to this node. Node config objects will automatically
        be converted into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {TreeView.Node|TreeView.Node[]} Node or array of nodes that were
        prepended.
    **/
    prepend: function (node, options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "prepend", 377);
_yuitest_coverline("build/treeview-node/treeview-node.js", 378);
return this.tree.prependNode(this, node, options);
    },

    /**
    Removes this node from its parent node.

    @method remove
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, this node and all
            its children will also be destroyed, which makes them available for
            garbage collection and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, the `remove` event
            will be suppressed.
    @chainable
    **/
    remove: function (options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "remove", 393);
_yuitest_coverline("build/treeview-node/treeview-node.js", 394);
return this.tree.removeNode(this, options);
    },

    /**
    Selects this node.

    @method select
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `select` event
            will be suppressed.
    @chainable
    **/
    select: function (options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "select", 406);
_yuitest_coverline("build/treeview-node/treeview-node.js", 407);
this.tree.selectNode(this, options);
        _yuitest_coverline("build/treeview-node/treeview-node.js", 408);
return this;
    },

    /**
    Returns the total number of nodes contained within this node, including all
    descendants of this node's children.

    @method size
    @return {Number} Total number of nodes contained within this node, including
        all descendants.
    **/
    size: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "size", 419);
_yuitest_coverline("build/treeview-node/treeview-node.js", 420);
var children = this.children,
            len      = children.length,
            total    = len;

        _yuitest_coverline("build/treeview-node/treeview-node.js", 424);
for (var i = 0; i < len; i++) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 425);
total += children[i].size();
        }

        _yuitest_coverline("build/treeview-node/treeview-node.js", 428);
return total;
    },

    /**
    Toggles the open/closed state of this node.

    @method toggle
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, events will be
            suppressed.
    @chainable
    **/
    toggle: function (options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "toggle", 440);
_yuitest_coverline("build/treeview-node/treeview-node.js", 441);
this.tree.toggleNode(this, options);
        _yuitest_coverline("build/treeview-node/treeview-node.js", 442);
return this;
    },

    /**
    Serializes this node to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized node object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "toJSON", 451);
_yuitest_coverline("build/treeview-node/treeview-node.js", 452);
var obj   = {},
            state = this.state,
            i, key, len;

        // Do nothing if this node is marked as destroyed.
        _yuitest_coverline("build/treeview-node/treeview-node.js", 457);
if (state.destroyed) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 458);
return null;
        }

        // Serialize properties explicitly marked as serializable.
        _yuitest_coverline("build/treeview-node/treeview-node.js", 462);
for (i = 0, len = this._serializable.length; i < len; i++) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 463);
key = this._serializable[i];

            _yuitest_coverline("build/treeview-node/treeview-node.js", 465);
if (key in this) {
                _yuitest_coverline("build/treeview-node/treeview-node.js", 466);
obj[key] = this[key];
            }
        }

        // Serialize state values.
        _yuitest_coverline("build/treeview-node/treeview-node.js", 471);
obj.state = {};

        _yuitest_coverline("build/treeview-node/treeview-node.js", 473);
if (state.open) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 474);
obj.state.open = true;
        }

        _yuitest_coverline("build/treeview-node/treeview-node.js", 477);
if (state.selected) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 478);
obj.state.selected = true;
        }

        // Serialize child nodes.
        _yuitest_coverline("build/treeview-node/treeview-node.js", 482);
if (this.canHaveChildren) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 483);
obj.children = [];

            _yuitest_coverline("build/treeview-node/treeview-node.js", 485);
for (i = 0, len = this.children.length; i < len; i++) {
                _yuitest_coverline("build/treeview-node/treeview-node.js", 486);
obj.children.push(this.children[i].toJSON());
            }
        }

        _yuitest_coverline("build/treeview-node/treeview-node.js", 490);
return obj;
    },

    /**
    Unselects this node.

    @method unselect
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselect: function (options) {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "unselect", 502);
_yuitest_coverline("build/treeview-node/treeview-node.js", 503);
this.tree.unselectNode(this, options);
        _yuitest_coverline("build/treeview-node/treeview-node.js", 504);
return this;
    },

    // -- Protected Methods ----------------------------------------------------
    _reindex: function () {
        _yuitest_coverfunc("build/treeview-node/treeview-node.js", "_reindex", 508);
_yuitest_coverline("build/treeview-node/treeview-node.js", 509);
var children = this.children,
            indexMap = {},
            i, len;

        _yuitest_coverline("build/treeview-node/treeview-node.js", 513);
for (i = 0, len = children.length; i < len; i++) {
            _yuitest_coverline("build/treeview-node/treeview-node.js", 514);
indexMap[children[i].id] = i;
        }

        _yuitest_coverline("build/treeview-node/treeview-node.js", 517);
this._indexMap     = indexMap;
        _yuitest_coverline("build/treeview-node/treeview-node.js", 518);
this._isIndexStale = false;
    }
};

_yuitest_coverline("build/treeview-node/treeview-node.js", 522);
Y.namespace('TreeView').Node = TreeNode;


}, '@VERSION@', {"requires": ["yui-base"]});
