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
_yuitest_coverage["build/treeview/treeview.js"].code=["YUI.add('treeview', function (Y, NAME) {","","/**","Provides the `Y.TreeView` widget.","","@module treeview","@main treeview","**/","","/**","TreeView widget.","","@class TreeView","@constructor","@extends View","@uses TreeView.Tree","**/","","var getClassName = Y.ClassNameManager.getClassName,","","TreeView = Y.Base.create('treeView', Y.View, [Y.TreeView.Tree], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this treeview.","","    @property {Object} classNames","    @param {String} canHaveChildren Class name indicating that a tree node can","        contain child nodes (whether or not it actually does).","    @param {String} children Class name for a list of child nodes.","    @param {String} hasChildren Class name indicating that a tree node has one","        or more child nodes.","    @param {String} indicator Class name for an open/closed indicator.","    @param {String} label Class name for a tree node's user-visible label.","    @param {String} node Class name for a tree node item.","    @param {String} noTouch Class name added to the TreeView container when not","        using a touchscreen device.","    @param {String} open Class name indicating that a tree node is open.","    @param {String} row Class name for a row container encompassing the","        indicator and label within a tree node.","    @param {String} selected Class name for a tree node that's selected.","    @param {String} touch Class name added to the TreeView container when using","        a touchscreen device.","    @param {String} treeview Class name for the TreeView container.","    **/","    classNames: {","        canHaveChildren: getClassName('treeview-can-have-children'),","        children       : getClassName('treeview-children'),","        hasChildren    : getClassName('treeview-has-children'),","        indicator      : getClassName('treeview-indicator'),","        label          : getClassName('treeview-label'),","        node           : getClassName('treeview-node'),","        noTouch        : getClassName('treeview-notouch'),","        open           : getClassName('treeview-open'),","        row            : getClassName('treeview-row'),","        selected       : getClassName('treeview-selected'),","        touch          : getClassName('treeview-touch'),","        treeview       : getClassName('treeview')","    },","","    /**","    Whether or not this TreeView has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a TreeView instance.","","    @property {Boolean} _isYUITreeView","    @default true","    @protected","    **/","    _isYUITreeView: true,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._attachTreeViewEvents();","    },","","    destructor: function () {","        this._detachTreeViewEvents();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    `TreeView.Node` instance, if any.","","    @method getHTMLNode","    @param {TreeView.Node} treeNode Tree node.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (treeNode) {","        if (!treeNode._htmlNode) {","            treeNode._htmlNode = this.get('container').one('#' + treeNode.id);","        }","","        return treeNode._htmlNode;","    },","","    /**","    Renders this TreeView into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.treeview);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, container);","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    renderChildren: function (treeNode, container) {","        var childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(TreeView.Templates.children({","                classNames: this.classNames,","                node      : treeNode,","                treeview  : this","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'tree');","        } else {","            childrenNode.set('role', 'group');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], childrenNode);","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    renderNode: function (treeNode, container) {","        var classNames = this.classNames,","            htmlNode   = treeNode._htmlNode;","","        if (!htmlNode) {","            htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({","                classNames: classNames,","                node      : treeNode,","                treeview  : this","            }));","        }","","        var labelNode = htmlNode.one('.' + classNames.label),","            labelId   = labelNode.get('id');","","        labelNode.setHTML(treeNode.label);","","        if (!labelId) {","            labelId = Y.guid();","            labelNode.set('id', labelId);","        }","","        htmlNode.set('aria-labelledby', labelId);","        htmlNode.set('role', 'treeitem');","","        if (treeNode.canHaveChildren) {","            htmlNode.addClass(classNames.canHaveChildren);","            htmlNode.toggleClass(classNames.open, treeNode.isOpen());","","            if (treeNode.hasChildren()) {","                htmlNode.addClass(classNames.hasChildren);","                this.renderChildren(treeNode, htmlNode);","            }","        }","","        if (container) {","            container.append(htmlNode);","        }","","        return htmlNode;","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachTreeViewEvents: function () {","        this._treeViewEvents || (this._treeViewEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._treeViewEvents.push(","            // Custom events.","            this.after({","                add              : this._afterAdd,","                close            : this._afterClose,","                multiSelectChange: this._afterTreeViewMultiSelectChange, // sheesh","                open             : this._afterOpen,","                remove           : this._afterRemove,","                select           : this._afterSelect,","                unselect         : this._afterUnselect","            }),","","            // DOM events.","            container.on('mousedown', this._onMouseDown, this),","","            container.delegate('click', this._onIndicatorClick, '.' + classNames.indicator, this),","            container.delegate('click', this._onRowClick, '.' + classNames.row, this),","            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.hasChildren + ' > .' + classNames.row, this)","        );","    },","","    _detachTreeViewEvents: function () {","        (new Y.EventHandle(this._treeViewEvents)).detach();","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _afterAdd: function (e) {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        this._childrenNode.insert(this.renderNode(e.node), e.index);","    },","","    _afterClear: function (e) {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    _afterClose: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.open);","        htmlNode.set('aria-expanded', false);","    },","","    _afterOpen: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.addClass(this.classNames.open);","        htmlNode.set('aria-expanded', true);","    },","","    _afterRemove: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    _afterSelect: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.addClass(this.classNames.selected);","","        if (this.multiSelect) {","            // It's only necessary to set aria-selected when multi-selection is","            // enabled and focus can't be used to track the selection state.","            htmlNode.set('aria-selected', true);","        } else {","            htmlNode.set('tabIndex', 0).focus();","        }","    },","","    _afterTreeViewMultiSelectChange: function (e) {","        var container = this.get('container'),","            rootList  = container.one('> .' + this.classNames.children),","            htmlNodes = container.all('.' + this.classNames.node);","","        if (e.newVal) {","            rootList.set('aria-multiselectable', true);","            htmlNodes.set('aria-selected', false);","        } else {","            // When multiselect is disabled, aria-selected must not be set on","            // any nodes, since focus is used to indicate selection.","            rootList.removeAttribute('aria-multiselectable');","            htmlNodes.removeAttribute('aria-selected');","        }","    },","","    _afterUnselect: function (e) {","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.selected);","","        if (this.multiSelect) {","            htmlNode.set('aria-selected', false);","        }","","        htmlNode.removeAttribute('tabIndex');","    },","","    _onIndicatorClick: function (e) {","        var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);","","        // Indicator clicks shouldn't toggle selection state, so don't allow","        // this event to propagate to the _onRowClick() handler.","        e.stopImmediatePropagation();","","        this.getNodeById(rowNode.getData('node-id')).toggle();","    },","","    _onMouseDown: function (e) {","        // This prevents the tree from momentarily grabbing focus before focus","        // is set on a node.","        e.preventDefault();","    },","","    _onRowClick: function (e) {","        var node = this.getNodeById(e.currentTarget.getData('node-id'));","","        if (this.multiSelect) {","            node[node.isSelected() ? 'unselect' : 'select']();","        } else {","            node.select();","        }","    },","","    _onRowDoubleClick: function (e) {","        this.getNodeById(e.currentTarget.getData('node-id')).toggle();","    }","});","","Y.TreeView = Y.mix(TreeView, Y.TreeView);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"classnamemanager\", \"treeview-templates\", \"treeview-tree\", \"view\"], \"skinnable\": true});"];
_yuitest_coverage["build/treeview/treeview.js"].lines = {"1":0,"19":0,"83":0,"87":0,"102":0,"103":0,"106":0,"119":0,"121":0,"124":0,"125":0,"127":0,"130":0,"132":0,"133":0,"136":0,"138":0,"142":0,"144":0,"145":0,"152":0,"153":0,"154":0,"156":0,"159":0,"160":0,"163":0,"164":0,"167":0,"168":0,"171":0,"175":0,"178":0,"179":0,"186":0,"189":0,"191":0,"192":0,"193":0,"196":0,"197":0,"199":0,"200":0,"201":0,"203":0,"204":0,"205":0,"209":0,"210":0,"213":0,"219":0,"221":0,"224":0,"246":0,"253":0,"254":0,"257":0,"262":0,"263":0,"266":0,"267":0,"269":0,"270":0,"274":0,"276":0,"277":0,"281":0,"283":0,"284":0,"288":0,"290":0,"291":0,"292":0,"297":0,"299":0,"301":0,"304":0,"306":0,"311":0,"315":0,"316":0,"317":0,"321":0,"322":0,"327":0,"329":0,"331":0,"332":0,"335":0,"339":0,"343":0,"345":0,"351":0,"355":0,"357":0,"358":0,"360":0,"365":0,"369":0};
_yuitest_coverage["build/treeview/treeview.js"].functions = {"initializer:82":0,"destructor:86":0,"getHTMLNode:101":0,"render:118":0,"renderChildren:141":0,"renderNode:174":0,"_attachTreeViewEvents:218":0,"_detachTreeViewEvents:245":0,"_afterAdd:251":0,"_afterClear:260":0,"_afterClose:273":0,"_afterOpen:280":0,"_afterRemove:287":0,"_afterSelect:296":0,"_afterTreeViewMultiSelectChange:310":0,"_afterUnselect:326":0,"_onIndicatorClick:338":0,"_onMouseDown:348":0,"_onRowClick:354":0,"_onRowDoubleClick:364":0,"(anonymous 1):1":0};
_yuitest_coverage["build/treeview/treeview.js"].coveredLines = 99;
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
@uses TreeView.Tree
**/

_yuitest_coverfunc("build/treeview/treeview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/treeview/treeview.js", 19);
var getClassName = Y.ClassNameManager.getClassName,

TreeView = Y.Base.create('treeView', Y.View, [Y.TreeView.Tree], {
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
    `TreeView.Node` instance, if any.

    @method getHTMLNode
    @param {TreeView.Node} treeNode Tree node.
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
this._childrenNode = this.renderChildren(this.rootNode, container);

        _yuitest_coverline("build/treeview/treeview.js", 132);
if (!container.inDoc()) {
            _yuitest_coverline("build/treeview/treeview.js", 133);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/treeview/treeview.js", 136);
this.rendered = true;

        _yuitest_coverline("build/treeview/treeview.js", 138);
return this;
    },

    renderChildren: function (treeNode, container) {
        _yuitest_coverfunc("build/treeview/treeview.js", "renderChildren", 141);
_yuitest_coverline("build/treeview/treeview.js", 142);
var childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/treeview/treeview.js", 144);
if (!childrenNode) {
            _yuitest_coverline("build/treeview/treeview.js", 145);
childrenNode = Y.Node.create(TreeView.Templates.children({
                classNames: this.classNames,
                node      : treeNode,
                treeview  : this
            }));
        }

        _yuitest_coverline("build/treeview/treeview.js", 152);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/treeview/treeview.js", 153);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/treeview/treeview.js", 154);
childrenNode.set('role', 'tree');
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 156);
childrenNode.set('role', 'group');
        }

        _yuitest_coverline("build/treeview/treeview.js", 159);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/treeview/treeview.js", 160);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/treeview/treeview.js", 163);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/treeview/treeview.js", 164);
this.renderNode(treeNode.children[i], childrenNode);
        }

        _yuitest_coverline("build/treeview/treeview.js", 167);
if (container) {
            _yuitest_coverline("build/treeview/treeview.js", 168);
container.append(childrenNode);
        }

        _yuitest_coverline("build/treeview/treeview.js", 171);
return childrenNode;
    },

    renderNode: function (treeNode, container) {
        _yuitest_coverfunc("build/treeview/treeview.js", "renderNode", 174);
_yuitest_coverline("build/treeview/treeview.js", 175);
var classNames = this.classNames,
            htmlNode   = treeNode._htmlNode;

        _yuitest_coverline("build/treeview/treeview.js", 178);
if (!htmlNode) {
            _yuitest_coverline("build/treeview/treeview.js", 179);
htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({
                classNames: classNames,
                node      : treeNode,
                treeview  : this
            }));
        }

        _yuitest_coverline("build/treeview/treeview.js", 186);
var labelNode = htmlNode.one('.' + classNames.label),
            labelId   = labelNode.get('id');

        _yuitest_coverline("build/treeview/treeview.js", 189);
labelNode.setHTML(treeNode.label);

        _yuitest_coverline("build/treeview/treeview.js", 191);
if (!labelId) {
            _yuitest_coverline("build/treeview/treeview.js", 192);
labelId = Y.guid();
            _yuitest_coverline("build/treeview/treeview.js", 193);
labelNode.set('id', labelId);
        }

        _yuitest_coverline("build/treeview/treeview.js", 196);
htmlNode.set('aria-labelledby', labelId);
        _yuitest_coverline("build/treeview/treeview.js", 197);
htmlNode.set('role', 'treeitem');

        _yuitest_coverline("build/treeview/treeview.js", 199);
if (treeNode.canHaveChildren) {
            _yuitest_coverline("build/treeview/treeview.js", 200);
htmlNode.addClass(classNames.canHaveChildren);
            _yuitest_coverline("build/treeview/treeview.js", 201);
htmlNode.toggleClass(classNames.open, treeNode.isOpen());

            _yuitest_coverline("build/treeview/treeview.js", 203);
if (treeNode.hasChildren()) {
                _yuitest_coverline("build/treeview/treeview.js", 204);
htmlNode.addClass(classNames.hasChildren);
                _yuitest_coverline("build/treeview/treeview.js", 205);
this.renderChildren(treeNode, htmlNode);
            }
        }

        _yuitest_coverline("build/treeview/treeview.js", 209);
if (container) {
            _yuitest_coverline("build/treeview/treeview.js", 210);
container.append(htmlNode);
        }

        _yuitest_coverline("build/treeview/treeview.js", 213);
return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachTreeViewEvents: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "_attachTreeViewEvents", 218);
_yuitest_coverline("build/treeview/treeview.js", 219);
this._treeViewEvents || (this._treeViewEvents = []);

        _yuitest_coverline("build/treeview/treeview.js", 221);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/treeview/treeview.js", 224);
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
            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.hasChildren + ' > .' + classNames.row, this)
        );
    },

    _detachTreeViewEvents: function () {
        _yuitest_coverfunc("build/treeview/treeview.js", "_detachTreeViewEvents", 245);
_yuitest_coverline("build/treeview/treeview.js", 246);
(new Y.EventHandle(this._treeViewEvents)).detach();
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterAdd", 251);
_yuitest_coverline("build/treeview/treeview.js", 253);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 254);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 257);
this._childrenNode.insert(this.renderNode(e.node), e.index);
    },

    _afterClear: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterClear", 260);
_yuitest_coverline("build/treeview/treeview.js", 262);
if (!this.rendered) {
            _yuitest_coverline("build/treeview/treeview.js", 263);
return;
        }

        _yuitest_coverline("build/treeview/treeview.js", 266);
delete this._childrenNode;
        _yuitest_coverline("build/treeview/treeview.js", 267);
this.rendered = false;

        _yuitest_coverline("build/treeview/treeview.js", 269);
this.get('container').empty();
        _yuitest_coverline("build/treeview/treeview.js", 270);
this.render();
    },

    _afterClose: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterClose", 273);
_yuitest_coverline("build/treeview/treeview.js", 274);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 276);
htmlNode.removeClass(this.classNames.open);
        _yuitest_coverline("build/treeview/treeview.js", 277);
htmlNode.set('aria-expanded', false);
    },

    _afterOpen: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterOpen", 280);
_yuitest_coverline("build/treeview/treeview.js", 281);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 283);
htmlNode.addClass(this.classNames.open);
        _yuitest_coverline("build/treeview/treeview.js", 284);
htmlNode.set('aria-expanded', true);
    },

    _afterRemove: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterRemove", 287);
_yuitest_coverline("build/treeview/treeview.js", 288);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 290);
if (htmlNode) {
            _yuitest_coverline("build/treeview/treeview.js", 291);
htmlNode.remove(true);
            _yuitest_coverline("build/treeview/treeview.js", 292);
delete e.node._htmlNode;
        }
    },

    _afterSelect: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterSelect", 296);
_yuitest_coverline("build/treeview/treeview.js", 297);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 299);
htmlNode.addClass(this.classNames.selected);

        _yuitest_coverline("build/treeview/treeview.js", 301);
if (this.multiSelect) {
            // It's only necessary to set aria-selected when multi-selection is
            // enabled and focus can't be used to track the selection state.
            _yuitest_coverline("build/treeview/treeview.js", 304);
htmlNode.set('aria-selected', true);
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 306);
htmlNode.set('tabIndex', 0).focus();
        }
    },

    _afterTreeViewMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterTreeViewMultiSelectChange", 310);
_yuitest_coverline("build/treeview/treeview.js", 311);
var container = this.get('container'),
            rootList  = container.one('> .' + this.classNames.children),
            htmlNodes = container.all('.' + this.classNames.node);

        _yuitest_coverline("build/treeview/treeview.js", 315);
if (e.newVal) {
            _yuitest_coverline("build/treeview/treeview.js", 316);
rootList.set('aria-multiselectable', true);
            _yuitest_coverline("build/treeview/treeview.js", 317);
htmlNodes.set('aria-selected', false);
        } else {
            // When multiselect is disabled, aria-selected must not be set on
            // any nodes, since focus is used to indicate selection.
            _yuitest_coverline("build/treeview/treeview.js", 321);
rootList.removeAttribute('aria-multiselectable');
            _yuitest_coverline("build/treeview/treeview.js", 322);
htmlNodes.removeAttribute('aria-selected');
        }
    },

    _afterUnselect: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_afterUnselect", 326);
_yuitest_coverline("build/treeview/treeview.js", 327);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/treeview/treeview.js", 329);
htmlNode.removeClass(this.classNames.selected);

        _yuitest_coverline("build/treeview/treeview.js", 331);
if (this.multiSelect) {
            _yuitest_coverline("build/treeview/treeview.js", 332);
htmlNode.set('aria-selected', false);
        }

        _yuitest_coverline("build/treeview/treeview.js", 335);
htmlNode.removeAttribute('tabIndex');
    },

    _onIndicatorClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onIndicatorClick", 338);
_yuitest_coverline("build/treeview/treeview.js", 339);
var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);

        // Indicator clicks shouldn't toggle selection state, so don't allow
        // this event to propagate to the _onRowClick() handler.
        _yuitest_coverline("build/treeview/treeview.js", 343);
e.stopImmediatePropagation();

        _yuitest_coverline("build/treeview/treeview.js", 345);
this.getNodeById(rowNode.getData('node-id')).toggle();
    },

    _onMouseDown: function (e) {
        // This prevents the tree from momentarily grabbing focus before focus
        // is set on a node.
        _yuitest_coverfunc("build/treeview/treeview.js", "_onMouseDown", 348);
_yuitest_coverline("build/treeview/treeview.js", 351);
e.preventDefault();
    },

    _onRowClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onRowClick", 354);
_yuitest_coverline("build/treeview/treeview.js", 355);
var node = this.getNodeById(e.currentTarget.getData('node-id'));

        _yuitest_coverline("build/treeview/treeview.js", 357);
if (this.multiSelect) {
            _yuitest_coverline("build/treeview/treeview.js", 358);
node[node.isSelected() ? 'unselect' : 'select']();
        } else {
            _yuitest_coverline("build/treeview/treeview.js", 360);
node.select();
        }
    },

    _onRowDoubleClick: function (e) {
        _yuitest_coverfunc("build/treeview/treeview.js", "_onRowDoubleClick", 364);
_yuitest_coverline("build/treeview/treeview.js", 365);
this.getNodeById(e.currentTarget.getData('node-id')).toggle();
    }
});

_yuitest_coverline("build/treeview/treeview.js", 369);
Y.TreeView = Y.mix(TreeView, Y.TreeView);


}, '@VERSION@', {"requires": ["base-build", "classnamemanager", "treeview-templates", "treeview-tree", "view"], "skinnable": true});
