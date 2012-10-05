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
_yuitest_coverage["build/tree-node/tree-node.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tree-node/tree-node.js",
    code: []
};
_yuitest_coverage["build/tree-node/tree-node.js"].code=["YUI.add('tree-node', function (Y, NAME) {","","/**","Provides the `Tree.Node` class, which represents a tree node contained in a","`Tree` data structure.","","@module tree","@submodule tree-node","**/","","/**","Represents a tree node in a `Tree` data structure.","","@class Tree.Node","@param {Tree} tree `Tree` instance with which this node should be associated.","@param {Object} [config] Configuration hash for this node.","","    @param {Boolean} [config.canHaveChildren=false] Whether or not this node can","        contain child nodes. Will be automatically set to `true` if not","        specified and `config.children` contains one or more children.","","    @param {Tree.Node[]} [config.children] Array of `Tree.Node` instances","        for child nodes of this node.","","    @param {Object} [config.data] Implementation-specific data related to this","        node. You may add arbitrary properties to this hash for your own use.","","    @param {String} [config.id] Unique id for this node. This id must be unique","        among all tree nodes on the entire page, and will also be used as this","        node's DOM id when it's rendered by a TreeView. A unique id will be","        automatically generated unless you specify a custom value.","","    @param {HTML} [config.label=''] User-visible HTML label for this node.","","    @param {Object} [config.state] State hash for this node. You may add","        arbitrary state properties to this hash for your own use. See the","        docs for `Tree.Node`'s `state` property for details on state values used","        internally by `Tree.Node`.","","@constructor","**/","","function TreeNode(tree, config) {","    config || (config = {});","","    this.id   = this._yuid = config.id || this.id || Y.guid('treeNode-');","    this.tree = tree;","","    if ('label' in config) {","        this.label = config.label;","    }","","    this.children = config.children || [];","    this.data     = config.data || {};","    this.state    = config.state || {};","","    if (config.canHaveChildren) {","        this.canHaveChildren = config.canHaveChildren;","    } else if (this.children.length) {","        this.canHaveChildren = true;","    }","","    // If this node has children, loop through them and ensure their parent","    // references are all set to this node.","    for (var i = 0, len = this.children.length; i < len; i++) {","        this.children[i].parent = this;","    }","}","","TreeNode.prototype = {","    // -- Public Properties ----------------------------------------------------","","    /**","    Whether or not this node can contain child nodes.","","    This value is falsy by default unless child nodes are added at instantiation","    time, in which case it will be automatically set to `true`. You can also","    manually set it to `true` to indicate that a node can have children even if","    it doesn't currently have any children.","","    Note that regardless of the value of this property, appending, prepending,","    or inserting a node into this node will cause `canHaveChildren` to be set to","    true automatically.","","    @property {Boolean} canHaveChildren","    **/","","    /**","    Child nodes contained within this node.","","    @property {Tree.Node[]} children","    @default []","    @readOnly","    **/","","    /**","    Arbitrary implementation-specific data related to this node.","","    This property is created by setting a `data` property in the config object","    passed to Tree.Node's constructor. It may contain any serializable data","    you want to store on this node instance.","","    @property {Object} data","    @default {}","    **/","","    /**","    Unique id for this node.","","    @property {String} id","    @readOnly","    **/","","    /**","    User-visible HTML label for this node.","","    This value may be rendered as HTML without sanitization, so *do not* put","    untrusted user input here without escaping it first using `Y.Escape.html()`.","","    @property {HTML} label","    @default ''","    **/","    label: '',","","    /**","    Parent node of this node, or `undefined` if this is an unattached node or","    the root node.","","    @property {Tree.Node} parent","    @readOnly","    **/","","    /**","    Current state of this node.","","    @property {Object} state","    @param {Boolean} [open=false] Whether or not this node is open (expanded).","    @param {Boolean} [selected=false] Whether or not this node is selected.","    **/","","    /**","    The Tree instance with which this node is associated.","","    @property {Tree} tree","    @readOnly","    **/","","    // -- Protected Properties -------------------------------------------------","","    /**","    Mapping of child node ids to indices.","","    @property {Object} _indexMap","    @protected","    **/","","    /**","    Flag indicating whether the `_indexMap` is stale and needs to be rebuilt.","","    @property {Boolean} _isIndexStale","    @default true","    @protected","    **/","    _isIndexStale: true,","","    /**","    Simple way to type-check that this is an instance of Tree.Node.","","    @property {Boolean} _isYUITreeNode","    @default true","    @protected","    **/","    _isYUITreeNode: true,","","    /**","    Array of property names on this node that should be serialized to JSON when","    `toJSON()` is called.","","    Note that the `children` and `state` properties are special cases that are","    managed outside of this list.","","    @property {String[]} _serializable","    @protected","    **/","    _serializable: ['canHaveChildren', 'data', 'id', 'label'],","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends the given tree node or array of nodes to the end of this node's","    children.","","    @method append","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to append","        to the given parent. Node config objects will automatically be converted","        into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were appended.","    **/","    append: function (node, options) {","        return this.tree.appendNode(this, node, options);","    },","","    // TODO: clone()?","","    /**","    Closes this node if it's currently open.","","    @method close","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `close` event","            will be suppressed.","    @chainable","    **/","    close: function (options) {","        this.tree.closeNode(this, options);","        return this;","    },","","    /**","    Removes all children from this node. The removed children will still be","    reusable unless the `destroy` option is truthy.","","    @method empty","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {Tree.Node[]} Array of removed child nodes.","    **/","    empty: function (options) {","        return this.tree.emptyNode(this, options);","    },","","    /**","    Returns `true` if this node has one or more child nodes.","","    @method hasChildren","    @return {Boolean} `true` if this node has one or more child nodes, `false`","        otherwise.","    **/","    hasChildren: function () {","        return !!this.children.length;","    },","","    /**","    Returns the numerical index of this node within its parent node, or `-1` if","    this node doesn't have a parent node.","","    @method index","    @return {Number} Index of this node within its parent node, or `-1` if this","        node doesn't have a parent node.","    **/","    index: function () {","        return this.parent ? this.parent.indexOf(this) : -1;","    },","","    /**","    Returns the numerical index of the given child node, or `-1` if the node is","    not a child of this node.","","    @method indexOf","    @param {Tree.Node} node Child node.","    @return {Number} Index of the child, or `-1` if the node is not a child of","        this node.","    **/","    indexOf: function (node) {","        var index;","","        if (this._isIndexStale) {","            this._reindex();","        }","","        index = this._indexMap[node.id];","","        return typeof index === 'undefined' ? -1 : index;","    },","","    /**","    Inserts a node or array of nodes at the specified index under this node, or","    appends them to this node if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insert","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to insert","        under the given parent. Node config objects will automatically be","        converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {Tree.Node[]} Node or array of nodes that were inserted.","    **/","    insert: function (node, options) {","        return this.tree.insertNode(this, node, options);","    },","","    /**","    Returns `true` if this node has been inserted into a tree, `false` if it is","    merely associated with a tree and has not yet been inserted.","","    @method isInTree","    @return {Boolean} `true` if this node has been inserted into a tree, `false`","        otherwise.","    **/","    isInTree: function () {","        if (this.tree.rootNode === this) {","            return true;","        }","","        return !!(this.parent && this.parent.isInTree());","    },","","    /**","    Returns `true` if this node is currently open.","","    @method isOpen","    @return {Boolean} `true` if this node is currently open, `false` otherwise.","    **/","    isOpen: function () {","        return !!this.state.open || this.isRoot();","    },","","    /**","    Returns `true` if this node is the root of the tree.","","    @method isRoot","    @return {Boolean} `true` if this node is the root of the tree, `false`","        otherwise.","    **/","    isRoot: function () {","        return this.tree.rootNode === this;","    },","","    /**","    Returns `true` if this node is currently selected.","","    @method isSelected","    @return {Boolean} `true` if this node is currently selected, `false`","        otherwise.","    **/","    isSelected: function () {","        return !!this.state.selected;","    },","","    /**","    Opens this node if it's currently closed.","","    @method open","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `open` event","            will be suppressed.","    @chainable","    **/","    open: function (options) {","        this.tree.openNode(this, options);","        return this;","    },","","    /**","    Prepends a node or array of nodes at the beginning of this node's children.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prepend","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to prepend","        to this node. Node config objects will automatically be converted into","        node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were prepended.","    **/","    prepend: function (node, options) {","        return this.tree.prependNode(this, node, options);","    },","","    /**","    Removes this node from its parent node.","","    @method remove","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, this node and all","            its children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @chainable","    **/","    remove: function (options) {","        return this.tree.removeNode(this, options);","    },","","    /**","    Selects this node.","","    @method select","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `select` event","            will be suppressed.","    @chainable","    **/","    select: function (options) {","        this.tree.selectNode(this, options);","        return this;","    },","","    /**","    Returns the total number of nodes contained within this node, including all","    descendants of this node's children.","","    @method size","    @return {Number} Total number of nodes contained within this node, including","        all descendants.","    **/","    size: function () {","        var children = this.children,","            len      = children.length,","            total    = len;","","        for (var i = 0; i < len; i++) {","            total += children[i].size();","        }","","        return total;","    },","","    /**","    Toggles the open/closed state of this node.","","    @method toggle","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, events will be","            suppressed.","    @chainable","    **/","    toggle: function (options) {","        this.tree.toggleNode(this, options);","        return this;","    },","","    /**","    Serializes this node to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized node object.","    **/","    toJSON: function () {","        var obj   = {},","            state = this.state,","            i, key, len;","","        // Do nothing if this node is marked as destroyed.","        if (state.destroyed) {","            return null;","        }","","        // Serialize properties explicitly marked as serializable.","        for (i = 0, len = this._serializable.length; i < len; i++) {","            key = this._serializable[i];","","            if (key in this) {","                obj[key] = this[key];","            }","        }","","        // Serialize state values.","        obj.state = {};","","        if (state.open) {","            obj.state.open = true;","        }","","        if (state.selected) {","            obj.state.selected = true;","        }","","        // Serialize child nodes.","        if (this.canHaveChildren) {","            obj.children = [];","","            for (i = 0, len = this.children.length; i < len; i++) {","                obj.children.push(this.children[i].toJSON());","            }","        }","","        return obj;","    },","","    /**","    Unselects this node.","","    @method unselect","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselect: function (options) {","        this.tree.unselectNode(this, options);","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","    _reindex: function () {","        var children = this.children,","            indexMap = {},","            i, len;","","        for (i = 0, len = children.length; i < len; i++) {","            indexMap[children[i].id] = i;","        }","","        this._indexMap     = indexMap;","        this._isIndexStale = false;","    }","};","","Y.namespace('Tree').Node = TreeNode;","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/tree-node/tree-node.js"].lines = {"1":0,"43":0,"44":0,"46":0,"47":0,"49":0,"50":0,"53":0,"54":0,"55":0,"57":0,"58":0,"59":0,"60":0,"65":0,"66":0,"70":0,"204":0,"219":0,"220":0,"237":0,"248":0,"260":0,"273":0,"275":0,"276":0,"279":0,"281":0,"307":0,"319":0,"320":0,"323":0,"333":0,"344":0,"355":0,"368":0,"369":0,"389":0,"405":0,"418":0,"419":0,"431":0,"435":0,"436":0,"439":0,"452":0,"453":0,"463":0,"468":0,"469":0,"473":0,"474":0,"476":0,"477":0,"482":0,"484":0,"485":0,"488":0,"489":0,"493":0,"494":0,"496":0,"497":0,"501":0,"514":0,"515":0,"520":0,"524":0,"525":0,"528":0,"529":0,"533":0};
_yuitest_coverage["build/tree-node/tree-node.js"].functions = {"TreeNode:43":0,"append:203":0,"close:218":0,"empty:236":0,"hasChildren:247":0,"index:259":0,"indexOf:272":0,"insert:306":0,"isInTree:318":0,"isOpen:332":0,"isRoot:343":0,"isSelected:354":0,"open:367":0,"prepend:388":0,"remove:404":0,"select:417":0,"size:430":0,"toggle:451":0,"toJSON:462":0,"unselect:513":0,"_reindex:519":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tree-node/tree-node.js"].coveredLines = 72;
_yuitest_coverage["build/tree-node/tree-node.js"].coveredFunctions = 22;
_yuitest_coverline("build/tree-node/tree-node.js", 1);
YUI.add('tree-node', function (Y, NAME) {

/**
Provides the `Tree.Node` class, which represents a tree node contained in a
`Tree` data structure.

@module tree
@submodule tree-node
**/

/**
Represents a tree node in a `Tree` data structure.

@class Tree.Node
@param {Tree} tree `Tree` instance with which this node should be associated.
@param {Object} [config] Configuration hash for this node.

    @param {Boolean} [config.canHaveChildren=false] Whether or not this node can
        contain child nodes. Will be automatically set to `true` if not
        specified and `config.children` contains one or more children.

    @param {Tree.Node[]} [config.children] Array of `Tree.Node` instances
        for child nodes of this node.

    @param {Object} [config.data] Implementation-specific data related to this
        node. You may add arbitrary properties to this hash for your own use.

    @param {String} [config.id] Unique id for this node. This id must be unique
        among all tree nodes on the entire page, and will also be used as this
        node's DOM id when it's rendered by a TreeView. A unique id will be
        automatically generated unless you specify a custom value.

    @param {HTML} [config.label=''] User-visible HTML label for this node.

    @param {Object} [config.state] State hash for this node. You may add
        arbitrary state properties to this hash for your own use. See the
        docs for `Tree.Node`'s `state` property for details on state values used
        internally by `Tree.Node`.

@constructor
**/

_yuitest_coverfunc("build/tree-node/tree-node.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tree-node/tree-node.js", 43);
function TreeNode(tree, config) {
    _yuitest_coverfunc("build/tree-node/tree-node.js", "TreeNode", 43);
_yuitest_coverline("build/tree-node/tree-node.js", 44);
config || (config = {});

    _yuitest_coverline("build/tree-node/tree-node.js", 46);
this.id   = this._yuid = config.id || this.id || Y.guid('treeNode-');
    _yuitest_coverline("build/tree-node/tree-node.js", 47);
this.tree = tree;

    _yuitest_coverline("build/tree-node/tree-node.js", 49);
if ('label' in config) {
        _yuitest_coverline("build/tree-node/tree-node.js", 50);
this.label = config.label;
    }

    _yuitest_coverline("build/tree-node/tree-node.js", 53);
this.children = config.children || [];
    _yuitest_coverline("build/tree-node/tree-node.js", 54);
this.data     = config.data || {};
    _yuitest_coverline("build/tree-node/tree-node.js", 55);
this.state    = config.state || {};

    _yuitest_coverline("build/tree-node/tree-node.js", 57);
if (config.canHaveChildren) {
        _yuitest_coverline("build/tree-node/tree-node.js", 58);
this.canHaveChildren = config.canHaveChildren;
    } else {_yuitest_coverline("build/tree-node/tree-node.js", 59);
if (this.children.length) {
        _yuitest_coverline("build/tree-node/tree-node.js", 60);
this.canHaveChildren = true;
    }}

    // If this node has children, loop through them and ensure their parent
    // references are all set to this node.
    _yuitest_coverline("build/tree-node/tree-node.js", 65);
for (var i = 0, len = this.children.length; i < len; i++) {
        _yuitest_coverline("build/tree-node/tree-node.js", 66);
this.children[i].parent = this;
    }
}

_yuitest_coverline("build/tree-node/tree-node.js", 70);
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

    @property {Tree.Node[]} children
    @default []
    @readOnly
    **/

    /**
    Arbitrary implementation-specific data related to this node.

    This property is created by setting a `data` property in the config object
    passed to Tree.Node's constructor. It may contain any serializable data
    you want to store on this node instance.

    @property {Object} data
    @default {}
    **/

    /**
    Unique id for this node.

    @property {String} id
    @readOnly
    **/

    /**
    User-visible HTML label for this node.

    This value may be rendered as HTML without sanitization, so *do not* put
    untrusted user input here without escaping it first using `Y.Escape.html()`.

    @property {HTML} label
    @default ''
    **/
    label: '',

    /**
    Parent node of this node, or `undefined` if this is an unattached node or
    the root node.

    @property {Tree.Node} parent
    @readOnly
    **/

    /**
    Current state of this node.

    @property {Object} state
    @param {Boolean} [open=false] Whether or not this node is open (expanded).
    @param {Boolean} [selected=false] Whether or not this node is selected.
    **/

    /**
    The Tree instance with which this node is associated.

    @property {Tree} tree
    @readOnly
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
    Simple way to type-check that this is an instance of Tree.Node.

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
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config
        object, array of child nodes, or array of node config objects to append
        to the given parent. Node config objects will automatically be converted
        into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were appended.
    **/
    append: function (node, options) {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "append", 203);
_yuitest_coverline("build/tree-node/tree-node.js", 204);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "close", 218);
_yuitest_coverline("build/tree-node/tree-node.js", 219);
this.tree.closeNode(this, options);
        _yuitest_coverline("build/tree-node/tree-node.js", 220);
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
    @return {Tree.Node[]} Array of removed child nodes.
    **/
    empty: function (options) {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "empty", 236);
_yuitest_coverline("build/tree-node/tree-node.js", 237);
return this.tree.emptyNode(this, options);
    },

    /**
    Returns `true` if this node has one or more child nodes.

    @method hasChildren
    @return {Boolean} `true` if this node has one or more child nodes, `false`
        otherwise.
    **/
    hasChildren: function () {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "hasChildren", 247);
_yuitest_coverline("build/tree-node/tree-node.js", 248);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "index", 259);
_yuitest_coverline("build/tree-node/tree-node.js", 260);
return this.parent ? this.parent.indexOf(this) : -1;
    },

    /**
    Returns the numerical index of the given child node, or `-1` if the node is
    not a child of this node.

    @method indexOf
    @param {Tree.Node} node Child node.
    @return {Number} Index of the child, or `-1` if the node is not a child of
        this node.
    **/
    indexOf: function (node) {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "indexOf", 272);
_yuitest_coverline("build/tree-node/tree-node.js", 273);
var index;

        _yuitest_coverline("build/tree-node/tree-node.js", 275);
if (this._isIndexStale) {
            _yuitest_coverline("build/tree-node/tree-node.js", 276);
this._reindex();
        }

        _yuitest_coverline("build/tree-node/tree-node.js", 279);
index = this._indexMap[node.id];

        _yuitest_coverline("build/tree-node/tree-node.js", 281);
return typeof index === 'undefined' ? -1 : index;
    },

    /**
    Inserts a node or array of nodes at the specified index under this node, or
    appends them to this node if no index is specified.

    If a node being inserted is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method insert
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
    insert: function (node, options) {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "insert", 306);
_yuitest_coverline("build/tree-node/tree-node.js", 307);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "isInTree", 318);
_yuitest_coverline("build/tree-node/tree-node.js", 319);
if (this.tree.rootNode === this) {
            _yuitest_coverline("build/tree-node/tree-node.js", 320);
return true;
        }

        _yuitest_coverline("build/tree-node/tree-node.js", 323);
return !!(this.parent && this.parent.isInTree());
    },

    /**
    Returns `true` if this node is currently open.

    @method isOpen
    @return {Boolean} `true` if this node is currently open, `false` otherwise.
    **/
    isOpen: function () {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "isOpen", 332);
_yuitest_coverline("build/tree-node/tree-node.js", 333);
return !!this.state.open || this.isRoot();
    },

    /**
    Returns `true` if this node is the root of the tree.

    @method isRoot
    @return {Boolean} `true` if this node is the root of the tree, `false`
        otherwise.
    **/
    isRoot: function () {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "isRoot", 343);
_yuitest_coverline("build/tree-node/tree-node.js", 344);
return this.tree.rootNode === this;
    },

    /**
    Returns `true` if this node is currently selected.

    @method isSelected
    @return {Boolean} `true` if this node is currently selected, `false`
        otherwise.
    **/
    isSelected: function () {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "isSelected", 354);
_yuitest_coverline("build/tree-node/tree-node.js", 355);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "open", 367);
_yuitest_coverline("build/tree-node/tree-node.js", 368);
this.tree.openNode(this, options);
        _yuitest_coverline("build/tree-node/tree-node.js", 369);
return this;
    },

    /**
    Prepends a node or array of nodes at the beginning of this node's children.

    If a node being prepended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method prepend
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config
        object, array of child nodes, or array of node config objects to prepend
        to this node. Node config objects will automatically be converted into
        node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were prepended.
    **/
    prepend: function (node, options) {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "prepend", 388);
_yuitest_coverline("build/tree-node/tree-node.js", 389);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "remove", 404);
_yuitest_coverline("build/tree-node/tree-node.js", 405);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "select", 417);
_yuitest_coverline("build/tree-node/tree-node.js", 418);
this.tree.selectNode(this, options);
        _yuitest_coverline("build/tree-node/tree-node.js", 419);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "size", 430);
_yuitest_coverline("build/tree-node/tree-node.js", 431);
var children = this.children,
            len      = children.length,
            total    = len;

        _yuitest_coverline("build/tree-node/tree-node.js", 435);
for (var i = 0; i < len; i++) {
            _yuitest_coverline("build/tree-node/tree-node.js", 436);
total += children[i].size();
        }

        _yuitest_coverline("build/tree-node/tree-node.js", 439);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "toggle", 451);
_yuitest_coverline("build/tree-node/tree-node.js", 452);
this.tree.toggleNode(this, options);
        _yuitest_coverline("build/tree-node/tree-node.js", 453);
return this;
    },

    /**
    Serializes this node to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized node object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "toJSON", 462);
_yuitest_coverline("build/tree-node/tree-node.js", 463);
var obj   = {},
            state = this.state,
            i, key, len;

        // Do nothing if this node is marked as destroyed.
        _yuitest_coverline("build/tree-node/tree-node.js", 468);
if (state.destroyed) {
            _yuitest_coverline("build/tree-node/tree-node.js", 469);
return null;
        }

        // Serialize properties explicitly marked as serializable.
        _yuitest_coverline("build/tree-node/tree-node.js", 473);
for (i = 0, len = this._serializable.length; i < len; i++) {
            _yuitest_coverline("build/tree-node/tree-node.js", 474);
key = this._serializable[i];

            _yuitest_coverline("build/tree-node/tree-node.js", 476);
if (key in this) {
                _yuitest_coverline("build/tree-node/tree-node.js", 477);
obj[key] = this[key];
            }
        }

        // Serialize state values.
        _yuitest_coverline("build/tree-node/tree-node.js", 482);
obj.state = {};

        _yuitest_coverline("build/tree-node/tree-node.js", 484);
if (state.open) {
            _yuitest_coverline("build/tree-node/tree-node.js", 485);
obj.state.open = true;
        }

        _yuitest_coverline("build/tree-node/tree-node.js", 488);
if (state.selected) {
            _yuitest_coverline("build/tree-node/tree-node.js", 489);
obj.state.selected = true;
        }

        // Serialize child nodes.
        _yuitest_coverline("build/tree-node/tree-node.js", 493);
if (this.canHaveChildren) {
            _yuitest_coverline("build/tree-node/tree-node.js", 494);
obj.children = [];

            _yuitest_coverline("build/tree-node/tree-node.js", 496);
for (i = 0, len = this.children.length; i < len; i++) {
                _yuitest_coverline("build/tree-node/tree-node.js", 497);
obj.children.push(this.children[i].toJSON());
            }
        }

        _yuitest_coverline("build/tree-node/tree-node.js", 501);
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
        _yuitest_coverfunc("build/tree-node/tree-node.js", "unselect", 513);
_yuitest_coverline("build/tree-node/tree-node.js", 514);
this.tree.unselectNode(this, options);
        _yuitest_coverline("build/tree-node/tree-node.js", 515);
return this;
    },

    // -- Protected Methods ----------------------------------------------------
    _reindex: function () {
        _yuitest_coverfunc("build/tree-node/tree-node.js", "_reindex", 519);
_yuitest_coverline("build/tree-node/tree-node.js", 520);
var children = this.children,
            indexMap = {},
            i, len;

        _yuitest_coverline("build/tree-node/tree-node.js", 524);
for (i = 0, len = children.length; i < len; i++) {
            _yuitest_coverline("build/tree-node/tree-node.js", 525);
indexMap[children[i].id] = i;
        }

        _yuitest_coverline("build/tree-node/tree-node.js", 528);
this._indexMap     = indexMap;
        _yuitest_coverline("build/tree-node/tree-node.js", 529);
this._isIndexStale = false;
    }
};

_yuitest_coverline("build/tree-node/tree-node.js", 533);
Y.namespace('Tree').Node = TreeNode;


}, '@VERSION@', {"requires": ["yui-base"]});
