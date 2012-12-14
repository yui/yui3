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
_yuitest_coverage["build/treeview/treeview.js"].code=["YUI.add('treeview', function (Y, NAME) {","","/**","Provides the `Y.TreeView` widget.","","@module treeview","@main treeview","**/","","/**","TreeView widget.","","@class TreeView","@constructor","@extends View","@uses Tree","**/","","var getClassName = Y.ClassNameManager.getClassName,","","TreeView = Y.Base.create('treeView', Y.View, [Y.Tree], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this treeview.","","    @property {Object} classNames","    @param {String} canHaveChildren Class name indicating that a tree node can","        contain child nodes (whether or not it actually does).","    @param {String} children Class name for a list of child nodes.","    @param {String} hasChildren Class name indicating that a tree node has one","        or more child nodes.","    @param {String} indicator Class name for an open/closed indicator.","    @param {String} label Class name for a tree node's user-visible label.","    @param {String} node Class name for a tree node item.","    @param {String} noTouch Class name added to the TreeView container when not","        using a touchscreen device.","    @param {String} open Class name indicating that a tree node is open.","    @param {String} row Class name for a row container encompassing the","        indicator and label within a tree node.","    @param {String} selected Class name for a tree node that's selected.","    @param {String} touch Class name added to the TreeView container when using","        a touchscreen device.","    @param {String} treeview Class name for the TreeView container.","    **/","    classNames: {","        canHaveChildren: getClassName('treeview-can-have-children'),","        children       : getClassName('treeview-children'),","        hasChildren    : getClassName('treeview-has-children'),","        indicator      : getClassName('treeview-indicator'),","        label          : getClassName('treeview-label'),","        node           : getClassName('treeview-node'),","        noTouch        : getClassName('treeview-notouch'),","        open           : getClassName('treeview-open'),","        row            : getClassName('treeview-row'),","        selected       : getClassName('treeview-selected'),","        touch          : getClassName('treeview-touch'),","        treeview       : getClassName('treeview')","    },","","    /**","    Whether or not this TreeView has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a TreeView instance.","","    @property {Boolean} _isYUITreeView","    @default true","    @protected","    **/","    _isYUITreeView: true,","","    /**","    Cached value of the `lazyRender` attribute.","","    @property {Boolean} _lazyRender","    @protected","    **/","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._attachTreeViewEvents();","    },","","    destructor: function () {","        this._detachTreeViewEvents();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    `Tree.Node` instance, if any.","","    @method getHTMLNode","    @param {Tree.Node} treeNode Tree node.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (treeNode) {","        if (!treeNode._htmlNode) {","            treeNode._htmlNode = this.get('container').one('#' + treeNode.id);","        }","","        return treeNode._htmlNode;","    },","","    /**","    Renders this TreeView into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container     = this.get('container'),","            isTouchDevice = 'ontouchstart' in Y.config.win;","","        container.addClass(this.classNames.treeview);","        container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified tree node.","","    If a container is specified, it will be assumed to be an existing rendered","    tree node, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Tree.Node} treeNode Tree node whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children),","            lazyRender   = this._lazyRender;","","        if (!childrenNode) {","            childrenNode = Y.Node.create(TreeView.Templates.children({","                classNames: this.classNames,","                node      : treeNode,","                treeview  : this","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'tree');","        } else {","            childrenNode.set('role', 'group');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","","            for (var i = 0, len = treeNode.children.length; i < len; i++) {","                var child = treeNode.children[i];","","                this.renderNode(child, {","                    container     : childrenNode,","                    renderChildren: !lazyRender || child.isOpen()","                });","            }","        }","","        // Keep track of whether or not this node's children have been rendered","        // so we'll know whether we need to render them later if the node is","        // opened.","        treeNode.state.renderedChildren = true;","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified tree node and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Tree.Node} treeNode Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered tree node.","    **/","    renderNode: function (treeNode, options) {","        options || (options = {});","","        var classNames  = this.classNames,","            hasChildren = treeNode.hasChildren(),","            htmlNode    = treeNode._htmlNode;","","        if (!htmlNode) {","            htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({","                classNames: classNames,","                node      : treeNode,","                treeview  : this","            }));","        }","","        var labelNode = htmlNode.one('.' + classNames.label),","            labelId   = labelNode.get('id');","","        labelNode.setHTML(treeNode.label);","","        if (!labelId) {","            labelId = Y.guid();","            labelNode.set('id', labelId);","        }","","        htmlNode.set('aria-labelledby', labelId);","        htmlNode.set('role', 'treeitem');","","        htmlNode.toggleClass(classNames.canHaveChildren, !!treeNode.canHaveChildren);","        htmlNode.toggleClass(classNames.open, treeNode.isOpen());","        htmlNode.toggleClass(classNames.hasChildren, hasChildren);","","        if (hasChildren && options.renderChildren) {","            this.renderChildren(treeNode, {","                container: htmlNode","            });","        }","","        treeNode.state.rendered = true;","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachTreeViewEvents: function () {","        this._treeViewEvents || (this._treeViewEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._treeViewEvents.push(","            // Custom events.","            this.after({","                add              : this._afterAdd,","                close            : this._afterClose,","                multiSelectChange: this._afterTreeViewMultiSelectChange, // sheesh","                open             : this._afterOpen,","                remove           : this._afterRemove,","                select           : this._afterSelect,","                unselect         : this._afterUnselect","            }),","","            // DOM events.","            container.on('mousedown', this._onMouseDown, this),","","            container.delegate('click', this._onIndicatorClick, '.' + classNames.indicator, this),","            container.delegate('click', this._onRowClick, '.' + classNames.row, this),","            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.canHaveChildren + ' > .' + classNames.row, this)","        );","    },","","    _detachTreeViewEvents: function () {","        (new Y.EventHandle(this._treeViewEvents)).detach();","    },","","    /**","    Setter for the `lazyRender` attribute.","","    Just caches the value in a property for faster lookups.","","    @method _setLazyRender","    @return {Boolean} Value.","    @protected","    **/","    _setLazyRender: function (value) {","        return this._lazyRender = value;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _afterAdd: function (e) {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode         = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode = this.renderNode(parent);","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    _afterClear: function () {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    _afterClose: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.open);","        htmlNode.set('aria-expanded', false);","    },","","    _afterOpen: function (e) {","        if (!this.rendered) {","            return;","        }","","        var treeNode = e.node,","            htmlNode = this.getHTMLNode(treeNode);","","        // If this node's children haven't been rendered yet, render them.","        if (!treeNode.state.renderedChildren) {","            this.renderChildren(treeNode, {","                container: htmlNode","            });","        }","","        htmlNode.addClass(this.classNames.open);","        htmlNode.set('aria-expanded', true);","    },","","    _afterRemove: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    _afterSelect: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.addClass(this.classNames.selected);","","        if (this.multiSelect) {","            // It's only necessary to set aria-selected when multi-selection is","            // enabled and focus can't be used to track the selection state.","            htmlNode.set('aria-selected', true);","        } else {","            htmlNode.set('tabIndex', 0).focus();","        }","    },","","    _afterTreeViewMultiSelectChange: function (e) {","        if (!this.rendered) {","            return;","        }","","        var container = this.get('container'),","            rootList  = container.one('> .' + this.classNames.children),","            htmlNodes = container.all('.' + this.classNames.node);","","        if (e.newVal) {","            rootList.set('aria-multiselectable', true);","            htmlNodes.set('aria-selected', false);","        } else {","            // When multiselect is disabled, aria-selected must not be set on","            // any nodes, since focus is used to indicate selection.","            rootList.removeAttribute('aria-multiselectable');","            htmlNodes.removeAttribute('aria-selected');","        }","    },","","    _afterUnselect: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.selected);","","        if (this.multiSelect) {","            htmlNode.set('aria-selected', false);","        }","","        htmlNode.removeAttribute('tabIndex');","    },","","    _onIndicatorClick: function (e) {","        var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);","","        // Indicator clicks shouldn't toggle selection state, so don't allow","        // this event to propagate to the _onRowClick() handler.","        e.stopImmediatePropagation();","","        this.getNodeById(rowNode.getData('node-id')).toggle();","    },","","    _onMouseDown: function (e) {","        // This prevents the tree from momentarily grabbing focus before focus","        // is set on a node.","        e.preventDefault();","    },","","    _onRowClick: function (e) {","        var node = this.getNodeById(e.currentTarget.getData('node-id'));","","        if (this.multiSelect) {","            node[node.isSelected() ? 'unselect' : 'select']();","        } else {","            node.select();","        }","    },","","    _onRowDoubleClick: function (e) {","        this.getNodeById(e.currentTarget.getData('node-id')).toggle();","    }","}, {","    ATTRS: {","        /**","        When `true`, a node's children won't be rendered until the first time","        that node is opened.","","        This can significantly speed up the time it takes to render a large","        tree, but might not make sense if you're using CSS that doesn't hide the","        contents of closed nodes.","","        @attribute {Boolean} lazyRender","        @default true","        **/","        lazyRender: {","            lazyAdd: false, // to ensure that the setter runs on init","            setter : '_setLazyRender',","            value  : true","        }","    }","});","","Y.TreeView = Y.mix(TreeView, Y.TreeView);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"classnamemanager\", \"tree\", \"treeview-templates\", \"view\"], \"skinnable\": true});"];
_yuitest_coverage["build/treeview/treeview.js"].lines = {"1":0,"19":0,"90":0,"94":0,"109":0,"110":0,"113":0,"126":0,"129":0,"130":0,"132":0,"136":0,"137":0,"140":0,"142":0,"160":0,"162":0,"166":0,"167":0,"174":0,"175":0,"176":0,"178":0,"181":0,"182":0,"184":0,"185":0,"187":0,"197":0,"199":0,"200":0,"203":0,"221":0,"223":0,"227":0,"228":0,"235":0,"238":0,"240":0,"241":0,"242":0,"245":0,"246":0,"248":0,"249":0,"250":0,"252":0,"253":0,"258":0,"260":0,"261":0,"264":0,"270":0,"272":0,"275":0,"297":0,"310":0,"317":0,"318":0,"321":0,"325":0,"326":0,"328":0,"329":0,"331":0,"334":0,"336":0,"340":0,"344":0,"351":0,"352":0,"355":0,"356":0,"358":0,"359":0,"363":0,"364":0,"367":0,"369":0,"370":0,"374":0,"375":0,"378":0,"382":0,"383":0,"388":0,"389":0,"393":0,"394":0,"397":0,"399":0,"400":0,"401":0,"406":0,"407":0,"410":0,"412":0,"414":0,"417":0,"419":0,"424":0,"425":0,"428":0,"432":0,"433":0,"434":0,"438":0,"439":0,"444":0,"445":0,"448":0,"450":0,"452":0,"453":0,"456":0,"460":0,"464":0,"466":0,"472":0,"476":0,"478":0,"479":0,"481":0,"486":0,"509":0};
_yuitest_coverage["build/treeview/treeview.js"].functions = {"initializer:89":0,"destructor:93":0,"getHTMLNode:108":0,"render:125":0,"renderChildren:159":0,"renderNode:220":0,"_attachTreeViewEvents:269":0,"_detachTreeViewEvents:296":0,"_setLazyRender:309":0,"_afterAdd:315":0,"_afterClear:349":0,"_afterClose:362":0,"_afterOpen:373":0,"_afterRemove:392":0,"_afterSelect:405":0,"_afterTreeViewMultiSelectChange:423":0,"_afterUnselect:443":0,"_onIndicatorClick:459":0,"_onMouseDown:469":0,"_onRowClick:475":0,"_onRowDoubleClick:485":0,"(anonymous 1):1":0};
_yuitest_coverage["build/treeview/treeview.js"].coveredLines = 125;
_yuitest_coverage["build/treeview/treeview.js"].coveredFunctions = 22;
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

    /**
    Cached value of the `lazyRender` attribute.

    @property {Boolean} _lazyRender
    @protected
    **/

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "initializer", 89);
_yuitest_coverline("build/treeview/treeview.js", 90);
this._attachTreeViewEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "destructor", 93);
_yuitest_coverline("build/treeview/treeview.js", 94);
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
        _yuitest_coverfunc("build/treeview/treeview.js", "getHTMLNode", 108);
_yuitest_coverline("build/treeview/treeview.js", 109);
if (!treeNode._htmlNode) {
            _yuitest_coverline("build/treeview/treeview.js", 110);
treeNode._htmlNode = this.get('container').one('#' + treeNode.id);
        }

        _yuitest_coverline("build/treeview/treeview.js", 113);
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
        _yuitest_coverfunc("build/treeview/treeview.js", "render", 125);
_yuitest_coverline("build/treeview/treeview.js", 126);
var container     = this.get('container'),
            isTouchDevice = 'ontouchstart' in Y.config.win;

        _yuitest_coverline("build/treeview/treeview.js", 129);
container.addClass(this.classNames.treeview);
        _yuitest_coverline("build/treeview/treeview.js", 130);
container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);

        _yuitest_coverline("build/treeview/treeview.js", 132);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/treeview/treeview.js", 136);
if (!container.inDoc()) {
            _yuitest_coverline("build/treeview/treeview.js", 137);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/treeview/treeview.js", 140);
this.rendered = true;

        _yuitest_coverline("build/treeview/treeview.js", 142);
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
        _yuitest_coverfunc("build/treeview/treeview.js", "renderChildren", 159);
_yuitest_coverline("build/treeview/treeview.js", 160);
options || (options = {});

        _yuitest_coverline("build/treeview/treeview.js", 162);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children),
            lazyRender   = this._lazyRender;

        _yuitest_coverline("build/treeview/treeview.js", 166);
if (!childrenNode) {
            _yuitest_coverline("build/treeview/treeview.js", 167);
childrenNode = Y.Node.create(TreeView.Templates.children({
                classNames: this.classNames,
                node      : treeNode,
                treeview  : this
            }));
        }

        _yuitest_coverline("build/treeview/treeview.js", 174);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/treeview/treeview.js", 175);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/treeview/treeview.js", 176);
childrenNode.set('role', 'tree');
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 178);
childrenNode.set('role', 'group');
        }

        _yuitest_coverline("build/treeview/treeview.js", 181);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/treeview/treeview.js", 182);
childrenNode.set('aria-expanded', treeNode.isOpen());

            _yuitest_coverline("build/treeview/treeview.js", 184);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
                _yuitest_coverline("build/treeview/treeview.js", 185);
var child = treeNode.children[i];

                _yuitest_coverline("build/treeview/treeview.js", 187);
this.renderNode(child, {
                    container     : childrenNode,
                    renderChildren: !lazyRender || child.isOpen()
                });
            }
        }

        // Keep track of whether or not this node's children have been rendered
        // so we'll know whether we need to render them later if the node is
        // opened.
        _yuitest_coverline("build/treeview/treeview.js", 197);
treeNode.state.renderedChildren = true;

        _yuitest_coverline("build/treeview/treeview.js", 199);
if (container) {
            _yuitest_coverline("build/treeview/treeview.js", 200);
container.append(childrenNode);
        }

        _yuitest_coverline("build/treeview/treeview.js", 203);
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
        _yuitest_coverfunc("build/treeview/treeview.js", "renderNode", 220);
_yuitest_coverline("build/treeview/treeview.js", 221);
options || (options = {});

        _yuitest_coverline("build/treeview/treeview.js", 223);
var classNames  = this.classNames,
            hasChildren = treeNode.hasChildren(),
            htmlNode    = treeNode._htmlNode;

        _yuitest_coverline("build/treeview/treeview.js", 227);
if (!htmlNode) {
            _yuitest_coverline("build/treeview/treeview.js", 228);
htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({
                classNames: classNames,
                node      : treeNode,
                treeview  : this
            }));
        }

        _yuitest_coverline("build/treeview/treeview.js", 235);
var labelNode = htmlNode.one('.' + classNames.label),
            labelId   = labelNode.get('id');

        _yuitest_coverline("build/treeview/treeview.js", 238);
labelNode.setHTML(treeNode.label);

        _yuitest_coverline("build/treeview/treeview.js", 240);
if (!labelId) {
            _yuitest_coverline("build/treeview/treeview.js", 241);
labelId = Y.guid();
            _yuitest_coverline("build/treeview/treeview.js", 242);
labelNode.set('id', labelId);
        }

        _yuitest_coverline("build/treeview/treeview.js", 245);
htmlNode.set('aria-labelledby', labelId);
        _yuitest_coverline("build/treeview/treeview.js", 246);
htmlNode.set('role', 'treeitem');

        _yuitest_coverline("build/treeview/treeview.js", 248);
htmlNode.toggleClass(classNames.canHaveChildren, !!treeNode.canHaveChildren);
        _yuitest_coverline("build/treeview/treeview.js", 249);
htmlNode.toggleClass(classNames.open, treeNode.isOpen());
        _yuitest_coverline("build/treeview/treeview.js", 250);
htmlNode.toggleClass(classNames.hasChildren, hasChildren);

        _yuitest_coverline("build/treeview/treeview.js", 252);
if (hasChildren && options.renderChildren) {
            _yuitest_coverline("build/treeview/treeview.js", 253);
this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        _yuitest_coverline("build/treeview/treeview.js", 258);
treeNode.state.rendered = true;

        _yuitest_coverline("build/treeview/treeview.js", 260);
if (options.container) {
            _yuitest_coverline("build/treeview/treeview.js", 261);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/treeview/treeview.js", 264);
return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachTreeViewEvents: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "_attachTreeViewEvents", 269);
_yuitest_coverline("build/treeview/treeview.js", 270);
this._treeViewEvents || (this._treeViewEvents = []);

        _yuitest_coverline("build/treeview/treeview.js", 272);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/treeview/treeview.js", 275);
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
        _yuitest_coverfunc("build/treeview/treeview.js", "_detachTreeViewEvents", 296);
_yuitest_coverline("build/treeview/treeview.js", 297);
(new Y.EventHandle(this._treeViewEvents)).detach();
    },

    /**
    Setter for the `lazyRender` attribute.

    Just caches the value in a property for faster lookups.

    @method _setLazyRender
    @return {Boolean} Value.
    @protected
    **/
    _setLazyRender: function (value) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_setLazyRender", 309);
_yuitest_coverline("build/treeview/treeview.js", 310);
return this._lazyRender = value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterAdd", 315);
_yuitest_coverline("build/treeview/treeview.js", 317);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 318);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 321);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/treeview/treeview.js", 325);
if (parent === this.rootNode) {
            _yuitest_coverline("build/treeview/treeview.js", 326);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 328);
htmlNode         = this.getHTMLNode(parent);
            _yuitest_coverline("build/treeview/treeview.js", 329);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/treeview/treeview.js", 331);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/treeview/treeview.js", 334);
htmlNode = this.renderNode(parent);

                _yuitest_coverline("build/treeview/treeview.js", 336);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/treeview/treeview.js", 340);
return;
            }
        }

        _yuitest_coverline("build/treeview/treeview.js", 344);
htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: true
        }), e.index);
    },

    _afterClear: function () {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterClear", 349);
_yuitest_coverline("build/treeview/treeview.js", 351);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 352);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 355);
delete this._childrenNode;
        _yuitest_coverline("build/treeview/treeview.js", 356);
this.rendered = false;

        _yuitest_coverline("build/treeview/treeview.js", 358);
this.get('container').empty();
        _yuitest_coverline("build/treeview/treeview.js", 359);
this.render();
    },

    _afterClose: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterClose", 362);
_yuitest_coverline("build/treeview/treeview.js", 363);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 364);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 367);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 369);
htmlNode.removeClass(this.classNames.open);
        _yuitest_coverline("build/treeview/treeview.js", 370);
htmlNode.set('aria-expanded', false);
    },

    _afterOpen: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterOpen", 373);
_yuitest_coverline("build/treeview/treeview.js", 374);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 375);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 378);
var treeNode = e.node,
            htmlNode = this.getHTMLNode(treeNode);

        // If this node's children haven't been rendered yet, render them.
        _yuitest_coverline("build/treeview/treeview.js", 382);
if (!treeNode.state.renderedChildren) {
            _yuitest_coverline("build/treeview/treeview.js", 383);
this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        _yuitest_coverline("build/treeview/treeview.js", 388);
htmlNode.addClass(this.classNames.open);
        _yuitest_coverline("build/treeview/treeview.js", 389);
htmlNode.set('aria-expanded', true);
    },

    _afterRemove: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterRemove", 392);
_yuitest_coverline("build/treeview/treeview.js", 393);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 394);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 397);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 399);
if (htmlNode) {
            _yuitest_coverline("build/treeview/treeview.js", 400);
htmlNode.remove(true);
            _yuitest_coverline("build/treeview/treeview.js", 401);
delete e.node._htmlNode;
        }
    },

    _afterSelect: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterSelect", 405);
_yuitest_coverline("build/treeview/treeview.js", 406);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 407);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 410);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 412);
htmlNode.addClass(this.classNames.selected);

        _yuitest_coverline("build/treeview/treeview.js", 414);
if (this.multiSelect) {
            // It's only necessary to set aria-selected when multi-selection is
            // enabled and focus can't be used to track the selection state.
            _yuitest_coverline("build/treeview/treeview.js", 417);
htmlNode.set('aria-selected', true);
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 419);
htmlNode.set('tabIndex', 0).focus();
        }
    },

    _afterTreeViewMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterTreeViewMultiSelectChange", 423);
_yuitest_coverline("build/treeview/treeview.js", 424);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 425);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 428);
var container = this.get('container'),
            rootList  = container.one('> .' + this.classNames.children),
            htmlNodes = container.all('.' + this.classNames.node);

        _yuitest_coverline("build/treeview/treeview.js", 432);
if (e.newVal) {
            _yuitest_coverline("build/treeview/treeview.js", 433);
rootList.set('aria-multiselectable', true);
            _yuitest_coverline("build/treeview/treeview.js", 434);
htmlNodes.set('aria-selected', false);
        } else {
            // When multiselect is disabled, aria-selected must not be set on
            // any nodes, since focus is used to indicate selection.
            _yuitest_coverline("build/treeview/treeview.js", 438);
rootList.removeAttribute('aria-multiselectable');
            _yuitest_coverline("build/treeview/treeview.js", 439);
htmlNodes.removeAttribute('aria-selected');
        }
    },

    _afterUnselect: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterUnselect", 443);
_yuitest_coverline("build/treeview/treeview.js", 444);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 445);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 448);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 450);
htmlNode.removeClass(this.classNames.selected);

        _yuitest_coverline("build/treeview/treeview.js", 452);
if (this.multiSelect) {
            _yuitest_coverline("build/treeview/treeview.js", 453);
htmlNode.set('aria-selected', false);
        }

        _yuitest_coverline("build/treeview/treeview.js", 456);
htmlNode.removeAttribute('tabIndex');
    },

    _onIndicatorClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onIndicatorClick", 459);
_yuitest_coverline("build/treeview/treeview.js", 460);
var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);

        // Indicator clicks shouldn't toggle selection state, so don't allow
        // this event to propagate to the _onRowClick() handler.
        _yuitest_coverline("build/treeview/treeview.js", 464);
e.stopImmediatePropagation();

        _yuitest_coverline("build/treeview/treeview.js", 466);
this.getNodeById(rowNode.getData('node-id')).toggle();
    },

    _onMouseDown: function (e) {
        // This prevents the tree from momentarily grabbing focus before focus
        // is set on a node.
        _yuitest_coverfunc("build/treeview/treeview.js", "_onMouseDown", 469);
_yuitest_coverline("build/treeview/treeview.js", 472);
e.preventDefault();
    },

    _onRowClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onRowClick", 475);
_yuitest_coverline("build/treeview/treeview.js", 476);
var node = this.getNodeById(e.currentTarget.getData('node-id'));

        _yuitest_coverline("build/treeview/treeview.js", 478);
if (this.multiSelect) {
            _yuitest_coverline("build/treeview/treeview.js", 479);
node[node.isSelected() ? 'unselect' : 'select']();
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 481);
node.select();
        }
    },

    _onRowDoubleClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onRowDoubleClick", 485);
_yuitest_coverline("build/treeview/treeview.js", 486);
this.getNodeById(e.currentTarget.getData('node-id')).toggle();
    }
}, {
    ATTRS: {
        /**
        When `true`, a node's children won't be rendered until the first time
        that node is opened.

        This can significantly speed up the time it takes to render a large
        tree, but might not make sense if you're using CSS that doesn't hide the
        contents of closed nodes.

        @attribute {Boolean} lazyRender
        @default true
        **/
        lazyRender: {
            lazyAdd: false, // to ensure that the setter runs on init
            setter : '_setLazyRender',
            value  : true
        }
    }
});

_yuitest_coverline("build/treeview/treeview.js", 509);
Y.TreeView = Y.mix(TreeView, Y.TreeView);


}, '@VERSION@', {"requires": ["base-build", "classnamemanager", "tree", "treeview-templates", "view"], "skinnable": true});
