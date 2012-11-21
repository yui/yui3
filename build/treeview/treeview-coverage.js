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
_yuitest_coverage["build/treeview/treeview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/treeview/treeview.js",
    code: []
};
_yuitest_coverage["build/treeview/treeview.js"].code=["YUI.add('treeview', function (Y, NAME) {","","/**","Provides the `Y.TreeView` widget.","","@module treeview","@main treeview","**/","","/**","TreeView widget.","","@class TreeView","@constructor","@extends View","@uses Tree","**/","","var getClassName = Y.ClassNameManager.getClassName,","","TreeView = Y.Base.create('treeView', Y.View, [Y.Tree], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this treeview.","","    @property {Object} classNames","    @param {String} canHaveChildren Class name indicating that a tree node can","        contain child nodes (whether or not it actually does).","    @param {String} children Class name for a list of child nodes.","    @param {String} hasChildren Class name indicating that a tree node has one","        or more child nodes.","    @param {String} indicator Class name for an open/closed indicator.","    @param {String} label Class name for a tree node's user-visible label.","    @param {String} node Class name for a tree node item.","    @param {String} noTouch Class name added to the TreeView container when not","        using a touchscreen device.","    @param {String} open Class name indicating that a tree node is open.","    @param {String} row Class name for a row container encompassing the","        indicator and label within a tree node.","    @param {String} selected Class name for a tree node that's selected.","    @param {String} touch Class name added to the TreeView container when using","        a touchscreen device.","    @param {String} treeview Class name for the TreeView container.","    **/","    classNames: {","        canHaveChildren: getClassName('treeview-can-have-children'),","        children       : getClassName('treeview-children'),","        hasChildren    : getClassName('treeview-has-children'),","        indicator      : getClassName('treeview-indicator'),","        label          : getClassName('treeview-label'),","        node           : getClassName('treeview-node'),","        noTouch        : getClassName('treeview-notouch'),","        open           : getClassName('treeview-open'),","        row            : getClassName('treeview-row'),","        selected       : getClassName('treeview-selected'),","        touch          : getClassName('treeview-touch'),","        treeview       : getClassName('treeview')","    },","","    /**","    Whether or not this TreeView has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a TreeView instance.","","    @property {Boolean} _isYUITreeView","    @default true","    @protected","    **/","    _isYUITreeView: true,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._attachTreeViewEvents();","    },","","    destructor: function () {","        this._detachTreeViewEvents();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    `Tree.Node` instance, if any.","","    @method getHTMLNode","    @param {Tree.Node} treeNode Tree node.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (treeNode) {","        if (!treeNode._htmlNode) {","            treeNode._htmlNode = this.get('container').one('#' + treeNode.id);","        }","","        return treeNode._htmlNode;","    },","","    /**","    Renders this TreeView into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.treeview);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified tree node.","","    If a container is specified, it will be assumed to be an existing rendered","    tree node, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Tree.Node} treeNode Tree node whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(TreeView.Templates.children({","                classNames: this.classNames,","                node      : treeNode,","                treeview  : this","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'tree');","        } else {","            childrenNode.set('role', 'group');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified tree node and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Tree.Node} treeNode Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered tree node.","    **/","    renderNode: function (treeNode, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = treeNode._htmlNode;","","        if (!htmlNode) {","            htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({","                classNames: classNames,","                node      : treeNode,","                treeview  : this","            }));","        }","","        var labelNode = htmlNode.one('.' + classNames.label),","            labelId   = labelNode.get('id');","","        labelNode.setHTML(treeNode.label);","","        if (!labelId) {","            labelId = Y.guid();","            labelNode.set('id', labelId);","        }","","        htmlNode.set('aria-labelledby', labelId);","        htmlNode.set('role', 'treeitem');","","        if (treeNode.canHaveChildren) {","            htmlNode.addClass(classNames.canHaveChildren);","            htmlNode.toggleClass(classNames.open, treeNode.isOpen());","","            if (treeNode.hasChildren()) {","                htmlNode.addClass(classNames.hasChildren);","","                if (options.renderChildren) {","                    this.renderChildren(treeNode, {","                        container: htmlNode","                    });","                }","            }","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachTreeViewEvents: function () {","        this._treeViewEvents || (this._treeViewEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._treeViewEvents.push(","            // Custom events.","            this.after({","                add              : this._afterAdd,","                close            : this._afterClose,","                multiSelectChange: this._afterTreeViewMultiSelectChange, // sheesh","                open             : this._afterOpen,","                remove           : this._afterRemove,","                select           : this._afterSelect,","                unselect         : this._afterUnselect","            }),","","            // DOM events.","            container.on('mousedown', this._onMouseDown, this),","","            container.delegate('click', this._onIndicatorClick, '.' + classNames.indicator, this),","            container.delegate('click', this._onRowClick, '.' + classNames.row, this),","            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.canHaveChildren + ' > .' + classNames.row, this)","        );","    },","","    _detachTreeViewEvents: function () {","        (new Y.EventHandle(this._treeViewEvents)).detach();","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _afterAdd: function (e) {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode = this.renderNode(parent);","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    _afterClear: function () {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    _afterClose: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.open);","        htmlNode.set('aria-expanded', false);","    },","","    _afterOpen: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.addClass(this.classNames.open);","        htmlNode.set('aria-expanded', true);","    },","","    _afterRemove: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    _afterSelect: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.addClass(this.classNames.selected);","","        if (this.multiSelect) {","            // It's only necessary to set aria-selected when multi-selection is","            // enabled and focus can't be used to track the selection state.","            htmlNode.set('aria-selected', true);","        } else {","            htmlNode.set('tabIndex', 0).focus();","        }","    },","","    _afterTreeViewMultiSelectChange: function (e) {","        var container = this.get('container'),","            rootList  = container.one('> .' + this.classNames.children),","            htmlNodes = container.all('.' + this.classNames.node);","","        if (e.newVal) {","            rootList.set('aria-multiselectable', true);","            htmlNodes.set('aria-selected', false);","        } else {","            // When multiselect is disabled, aria-selected must not be set on","            // any nodes, since focus is used to indicate selection.","            rootList.removeAttribute('aria-multiselectable');","            htmlNodes.removeAttribute('aria-selected');","        }","    },","","    _afterUnselect: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.selected);","","        if (this.multiSelect) {","            htmlNode.set('aria-selected', false);","        }","","        htmlNode.removeAttribute('tabIndex');","    },","","    _onIndicatorClick: function (e) {","        var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);","","        // Indicator clicks shouldn't toggle selection state, so don't allow","        // this event to propagate to the _onRowClick() handler.","        e.stopImmediatePropagation();","","        this.getNodeById(rowNode.getData('node-id')).toggle();","    },","","    _onMouseDown: function (e) {","        // This prevents the tree from momentarily grabbing focus before focus","        // is set on a node.","        e.preventDefault();","    },","","    _onRowClick: function (e) {","        var node = this.getNodeById(e.currentTarget.getData('node-id'));","","        if (this.multiSelect) {","            node[node.isSelected() ? 'unselect' : 'select']();","        } else {","            node.select();","        }","    },","","    _onRowDoubleClick: function (e) {","        this.getNodeById(e.currentTarget.getData('node-id')).toggle();","    }","});","","Y.TreeView = Y.mix(TreeView, Y.TreeView);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"classnamemanager\", \"tree\", \"treeview-templates\", \"view\"], \"skinnable\": true});"];
_yuitest_coverage["build/treeview/treeview.js"].lines = {"1":0,"19":0,"83":0,"87":0,"102":0,"103":0,"106":0,"119":0,"121":0,"124":0,"125":0,"127":0,"130":0,"134":0,"135":0,"138":0,"140":0,"158":0,"160":0,"163":0,"164":0,"171":0,"172":0,"173":0,"175":0,"178":0,"179":0,"182":0,"183":0,"189":0,"190":0,"193":0,"211":0,"213":0,"216":0,"217":0,"224":0,"227":0,"229":0,"230":0,"231":0,"234":0,"235":0,"237":0,"238":0,"239":0,"241":0,"242":0,"244":0,"245":0,"252":0,"253":0,"256":0,"262":0,"264":0,"267":0,"289":0,"296":0,"297":0,"300":0,"304":0,"305":0,"307":0,"308":0,"310":0,"313":0,"315":0,"319":0,"323":0,"330":0,"331":0,"334":0,"335":0,"337":0,"338":0,"342":0,"344":0,"345":0,"349":0,"351":0,"352":0,"356":0,"358":0,"359":0,"360":0,"365":0,"367":0,"369":0,"372":0,"374":0,"379":0,"383":0,"384":0,"385":0,"389":0,"390":0,"395":0,"397":0,"399":0,"400":0,"403":0,"407":0,"411":0,"413":0,"419":0,"423":0,"425":0,"426":0,"428":0,"433":0,"437":0};
_yuitest_coverage["build/treeview/treeview.js"].functions = {"initializer:82":0,"destructor:86":0,"getHTMLNode:101":0,"render:118":0,"renderChildren:157":0,"renderNode:210":0,"_attachTreeViewEvents:261":0,"_detachTreeViewEvents:288":0,"_afterAdd:294":0,"_afterClear:328":0,"_afterClose:341":0,"_afterOpen:348":0,"_afterRemove:355":0,"_afterSelect:364":0,"_afterTreeViewMultiSelectChange:378":0,"_afterUnselect:394":0,"_onIndicatorClick:406":0,"_onMouseDown:416":0,"_onRowClick:422":0,"_onRowDoubleClick:432":0,"(anonymous 1):1":0};
_yuitest_coverage["build/treeview/treeview.js"].coveredLines = 111;
_yuitest_coverage["build/treeview/treeview.js"].coveredFunctions = 21;
_yuitest_coverline("build/treeview/treeview.js", 1);
YUI.add('treeview', function (Y, NAME) {

/**
Provides the `Y.TreeView` widget.

@module treeview
@main treeview
**/

/**
TreeView widget.

@class TreeView
@constructor
@extends View
@uses Tree
**/

_yuitest_coverfunc("build/treeview/treeview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/treeview/treeview.js", 19);
var getClassName = Y.ClassNameManager.getClassName,

TreeView = Y.Base.create('treeView', Y.View, [Y.Tree], {
    // -- Public Properties ----------------------------------------------------

    /**
    CSS class names used by this treeview.

    @property {Object} classNames
    @param {String} canHaveChildren Class name indicating that a tree node can
        contain child nodes (whether or not it actually does).
    @param {String} children Class name for a list of child nodes.
    @param {String} hasChildren Class name indicating that a tree node has one
        or more child nodes.
    @param {String} indicator Class name for an open/closed indicator.
    @param {String} label Class name for a tree node's user-visible label.
    @param {String} node Class name for a tree node item.
    @param {String} noTouch Class name added to the TreeView container when not
        using a touchscreen device.
    @param {String} open Class name indicating that a tree node is open.
    @param {String} row Class name for a row container encompassing the
        indicator and label within a tree node.
    @param {String} selected Class name for a tree node that's selected.
    @param {String} touch Class name added to the TreeView container when using
        a touchscreen device.
    @param {String} treeview Class name for the TreeView container.
    **/
    classNames: {
        canHaveChildren: getClassName('treeview-can-have-children'),
        children       : getClassName('treeview-children'),
        hasChildren    : getClassName('treeview-has-children'),
        indicator      : getClassName('treeview-indicator'),
        label          : getClassName('treeview-label'),
        node           : getClassName('treeview-node'),
        noTouch        : getClassName('treeview-notouch'),
        open           : getClassName('treeview-open'),
        row            : getClassName('treeview-row'),
        selected       : getClassName('treeview-selected'),
        touch          : getClassName('treeview-touch'),
        treeview       : getClassName('treeview')
    },

    /**
    Whether or not this TreeView has been rendered.

    @property {Boolean} rendered
    @default false
    **/
    rendered: false,

    // -- Protected Properties -------------------------------------------------

    /**
    Simple way to type-check that this is a TreeView instance.

    @property {Boolean} _isYUITreeView
    @default true
    @protected
    **/
    _isYUITreeView: true,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "initializer", 82);
_yuitest_coverline("build/treeview/treeview.js", 83);
this._attachTreeViewEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "destructor", 86);
_yuitest_coverline("build/treeview/treeview.js", 87);
this._detachTreeViewEvents();
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Returns the HTML node (as a `Y.Node` instance) associated with the specified
    `Tree.Node` instance, if any.

    @method getHTMLNode
    @param {Tree.Node} treeNode Tree node.
    @return {Node} `Y.Node` instance associated with the given tree node, or
        `undefined` if one was not found.
    **/
    getHTMLNode: function (treeNode) {
        _yuitest_coverfunc("build/treeview/treeview.js", "getHTMLNode", 101);
_yuitest_coverline("build/treeview/treeview.js", 102);
if (!treeNode._htmlNode) {
            _yuitest_coverline("build/treeview/treeview.js", 103);
treeNode._htmlNode = this.get('container').one('#' + treeNode.id);
        }

        _yuitest_coverline("build/treeview/treeview.js", 106);
return treeNode._htmlNode;
    },

    /**
    Renders this TreeView into its container.

    If the container hasn't already been added to the current document, it will
    be appended to the `<body>` element.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "render", 118);
_yuitest_coverline("build/treeview/treeview.js", 119);
var container = this.get('container');

        _yuitest_coverline("build/treeview/treeview.js", 121);
container.addClass(this.classNames.treeview);

        // Detect touchscreen devices.
        _yuitest_coverline("build/treeview/treeview.js", 124);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/treeview/treeview.js", 125);
container.addClass(this.classNames.touch);
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 127);
container.addClass(this.classNames.noTouch);
        }

        _yuitest_coverline("build/treeview/treeview.js", 130);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/treeview/treeview.js", 134);
if (!container.inDoc()) {
            _yuitest_coverline("build/treeview/treeview.js", 135);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/treeview/treeview.js", 138);
this.rendered = true;

        _yuitest_coverline("build/treeview/treeview.js", 140);
return this;
    },

    /**
    Renders the children of the specified tree node.

    If a container is specified, it will be assumed to be an existing rendered
    tree node, and the children will be rendered (or re-rendered) inside it.

    @method renderChildren
    @param {Tree.Node} treeNode Tree node whose children should be rendered.
    @param {Object} [options] Options.
        @param {Node} [options.container] `Y.Node` instance of a container into
            which the children should be rendered. If the container already
            contains rendered children, they will be re-rendered in place.
    @return {Node} `Y.Node` instance containing the rendered children.
    **/
    renderChildren: function (treeNode, options) {
        _yuitest_coverfunc("build/treeview/treeview.js", "renderChildren", 157);
_yuitest_coverline("build/treeview/treeview.js", 158);
options || (options = {});

        _yuitest_coverline("build/treeview/treeview.js", 160);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/treeview/treeview.js", 163);
if (!childrenNode) {
            _yuitest_coverline("build/treeview/treeview.js", 164);
childrenNode = Y.Node.create(TreeView.Templates.children({
                classNames: this.classNames,
                node      : treeNode,
                treeview  : this
            }));
        }

        _yuitest_coverline("build/treeview/treeview.js", 171);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/treeview/treeview.js", 172);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/treeview/treeview.js", 173);
childrenNode.set('role', 'tree');
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 175);
childrenNode.set('role', 'group');
        }

        _yuitest_coverline("build/treeview/treeview.js", 178);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/treeview/treeview.js", 179);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/treeview/treeview.js", 182);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/treeview/treeview.js", 183);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/treeview/treeview.js", 189);
if (container) {
            _yuitest_coverline("build/treeview/treeview.js", 190);
container.append(childrenNode);
        }

        _yuitest_coverline("build/treeview/treeview.js", 193);
return childrenNode;
    },

    /**
    Renders the specified tree node and its children (if any).

    If a container is specified, the rendered node will be appended to it.

    @method renderNode
    @param {Tree.Node} treeNode Tree node to render.
    @param {Object} [options] Options.
        @param {Node} [options.container] `Y.Node` instance of a container to
            which the rendered tree node should be appended.
        @param {Boolean} [options.renderChildren=false] Whether or not to render
            this node's children.
    @return {Node} `Y.Node` instance of the rendered tree node.
    **/
    renderNode: function (treeNode, options) {
        _yuitest_coverfunc("build/treeview/treeview.js", "renderNode", 210);
_yuitest_coverline("build/treeview/treeview.js", 211);
options || (options = {});

        _yuitest_coverline("build/treeview/treeview.js", 213);
var classNames = this.classNames,
            htmlNode   = treeNode._htmlNode;

        _yuitest_coverline("build/treeview/treeview.js", 216);
if (!htmlNode) {
            _yuitest_coverline("build/treeview/treeview.js", 217);
htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({
                classNames: classNames,
                node      : treeNode,
                treeview  : this
            }));
        }

        _yuitest_coverline("build/treeview/treeview.js", 224);
var labelNode = htmlNode.one('.' + classNames.label),
            labelId   = labelNode.get('id');

        _yuitest_coverline("build/treeview/treeview.js", 227);
labelNode.setHTML(treeNode.label);

        _yuitest_coverline("build/treeview/treeview.js", 229);
if (!labelId) {
            _yuitest_coverline("build/treeview/treeview.js", 230);
labelId = Y.guid();
            _yuitest_coverline("build/treeview/treeview.js", 231);
labelNode.set('id', labelId);
        }

        _yuitest_coverline("build/treeview/treeview.js", 234);
htmlNode.set('aria-labelledby', labelId);
        _yuitest_coverline("build/treeview/treeview.js", 235);
htmlNode.set('role', 'treeitem');

        _yuitest_coverline("build/treeview/treeview.js", 237);
if (treeNode.canHaveChildren) {
            _yuitest_coverline("build/treeview/treeview.js", 238);
htmlNode.addClass(classNames.canHaveChildren);
            _yuitest_coverline("build/treeview/treeview.js", 239);
htmlNode.toggleClass(classNames.open, treeNode.isOpen());

            _yuitest_coverline("build/treeview/treeview.js", 241);
if (treeNode.hasChildren()) {
                _yuitest_coverline("build/treeview/treeview.js", 242);
htmlNode.addClass(classNames.hasChildren);

                _yuitest_coverline("build/treeview/treeview.js", 244);
if (options.renderChildren) {
                    _yuitest_coverline("build/treeview/treeview.js", 245);
this.renderChildren(treeNode, {
                        container: htmlNode
                    });
                }
            }
        }

        _yuitest_coverline("build/treeview/treeview.js", 252);
if (options.container) {
            _yuitest_coverline("build/treeview/treeview.js", 253);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/treeview/treeview.js", 256);
return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachTreeViewEvents: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "_attachTreeViewEvents", 261);
_yuitest_coverline("build/treeview/treeview.js", 262);
this._treeViewEvents || (this._treeViewEvents = []);

        _yuitest_coverline("build/treeview/treeview.js", 264);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/treeview/treeview.js", 267);
this._treeViewEvents.push(
            // Custom events.
            this.after({
                add              : this._afterAdd,
                close            : this._afterClose,
                multiSelectChange: this._afterTreeViewMultiSelectChange, // sheesh
                open             : this._afterOpen,
                remove           : this._afterRemove,
                select           : this._afterSelect,
                unselect         : this._afterUnselect
            }),

            // DOM events.
            container.on('mousedown', this._onMouseDown, this),

            container.delegate('click', this._onIndicatorClick, '.' + classNames.indicator, this),
            container.delegate('click', this._onRowClick, '.' + classNames.row, this),
            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.canHaveChildren + ' > .' + classNames.row, this)
        );
    },

    _detachTreeViewEvents: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "_detachTreeViewEvents", 288);
_yuitest_coverline("build/treeview/treeview.js", 289);
(new Y.EventHandle(this._treeViewEvents)).detach();
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterAdd", 294);
_yuitest_coverline("build/treeview/treeview.js", 296);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 297);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 300);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/treeview/treeview.js", 304);
if (parent === this.rootNode) {
            _yuitest_coverline("build/treeview/treeview.js", 305);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 307);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/treeview/treeview.js", 308);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/treeview/treeview.js", 310);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/treeview/treeview.js", 313);
htmlNode = this.renderNode(parent);

                _yuitest_coverline("build/treeview/treeview.js", 315);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/treeview/treeview.js", 319);
return;
            }
        }

        _yuitest_coverline("build/treeview/treeview.js", 323);
htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: true
        }), e.index);
    },

    _afterClear: function () {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterClear", 328);
_yuitest_coverline("build/treeview/treeview.js", 330);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 331);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 334);
delete this._childrenNode;
        _yuitest_coverline("build/treeview/treeview.js", 335);
this.rendered = false;

        _yuitest_coverline("build/treeview/treeview.js", 337);
this.get('container').empty();
        _yuitest_coverline("build/treeview/treeview.js", 338);
this.render();
    },

    _afterClose: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterClose", 341);
_yuitest_coverline("build/treeview/treeview.js", 342);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 344);
htmlNode.removeClass(this.classNames.open);
        _yuitest_coverline("build/treeview/treeview.js", 345);
htmlNode.set('aria-expanded', false);
    },

    _afterOpen: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterOpen", 348);
_yuitest_coverline("build/treeview/treeview.js", 349);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 351);
htmlNode.addClass(this.classNames.open);
        _yuitest_coverline("build/treeview/treeview.js", 352);
htmlNode.set('aria-expanded', true);
    },

    _afterRemove: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterRemove", 355);
_yuitest_coverline("build/treeview/treeview.js", 356);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 358);
if (htmlNode) {
            _yuitest_coverline("build/treeview/treeview.js", 359);
htmlNode.remove(true);
            _yuitest_coverline("build/treeview/treeview.js", 360);
delete e.node._htmlNode;
        }
    },

    _afterSelect: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterSelect", 364);
_yuitest_coverline("build/treeview/treeview.js", 365);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 367);
htmlNode.addClass(this.classNames.selected);

        _yuitest_coverline("build/treeview/treeview.js", 369);
if (this.multiSelect) {
            // It's only necessary to set aria-selected when multi-selection is
            // enabled and focus can't be used to track the selection state.
            _yuitest_coverline("build/treeview/treeview.js", 372);
htmlNode.set('aria-selected', true);
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 374);
htmlNode.set('tabIndex', 0).focus();
        }
    },

    _afterTreeViewMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterTreeViewMultiSelectChange", 378);
_yuitest_coverline("build/treeview/treeview.js", 379);
var container = this.get('container'),
            rootList  = container.one('> .' + this.classNames.children),
            htmlNodes = container.all('.' + this.classNames.node);

        _yuitest_coverline("build/treeview/treeview.js", 383);
if (e.newVal) {
            _yuitest_coverline("build/treeview/treeview.js", 384);
rootList.set('aria-multiselectable', true);
            _yuitest_coverline("build/treeview/treeview.js", 385);
htmlNodes.set('aria-selected', false);
        } else {
            // When multiselect is disabled, aria-selected must not be set on
            // any nodes, since focus is used to indicate selection.
            _yuitest_coverline("build/treeview/treeview.js", 389);
rootList.removeAttribute('aria-multiselectable');
            _yuitest_coverline("build/treeview/treeview.js", 390);
htmlNodes.removeAttribute('aria-selected');
        }
    },

    _afterUnselect: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterUnselect", 394);
_yuitest_coverline("build/treeview/treeview.js", 395);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 397);
htmlNode.removeClass(this.classNames.selected);

        _yuitest_coverline("build/treeview/treeview.js", 399);
if (this.multiSelect) {
            _yuitest_coverline("build/treeview/treeview.js", 400);
htmlNode.set('aria-selected', false);
        }

        _yuitest_coverline("build/treeview/treeview.js", 403);
htmlNode.removeAttribute('tabIndex');
    },

    _onIndicatorClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onIndicatorClick", 406);
_yuitest_coverline("build/treeview/treeview.js", 407);
var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);

        // Indicator clicks shouldn't toggle selection state, so don't allow
        // this event to propagate to the _onRowClick() handler.
        _yuitest_coverline("build/treeview/treeview.js", 411);
e.stopImmediatePropagation();

        _yuitest_coverline("build/treeview/treeview.js", 413);
this.getNodeById(rowNode.getData('node-id')).toggle();
    },

    _onMouseDown: function (e) {
        // This prevents the tree from momentarily grabbing focus before focus
        // is set on a node.
        _yuitest_coverfunc("build/treeview/treeview.js", "_onMouseDown", 416);
_yuitest_coverline("build/treeview/treeview.js", 419);
e.preventDefault();
    },

    _onRowClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onRowClick", 422);
_yuitest_coverline("build/treeview/treeview.js", 423);
var node = this.getNodeById(e.currentTarget.getData('node-id'));

        _yuitest_coverline("build/treeview/treeview.js", 425);
if (this.multiSelect) {
            _yuitest_coverline("build/treeview/treeview.js", 426);
node[node.isSelected() ? 'unselect' : 'select']();
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 428);
node.select();
        }
    },

    _onRowDoubleClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onRowDoubleClick", 432);
_yuitest_coverline("build/treeview/treeview.js", 433);
this.getNodeById(e.currentTarget.getData('node-id')).toggle();
    }
});

_yuitest_coverline("build/treeview/treeview.js", 437);
Y.TreeView = Y.mix(TreeView, Y.TreeView);


}, '@VERSION@', {"requires": ["base-build", "classnamemanager", "tree", "treeview-templates", "view"], "skinnable": true});
