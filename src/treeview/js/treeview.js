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
        this._attachTreeViewEvents();
    },

    destructor: function () {
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
        if (!treeNode._htmlNode) {
            treeNode._htmlNode = this.get('container').one('#' + treeNode.id);
        }

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
        var container = this.get('container');

        container.addClass(this.classNames.treeview);

        // Detect touchscreen devices.
        if ('ontouchstart' in Y.config.win) {
            container.addClass(this.classNames.touch);
        } else {
            container.addClass(this.classNames.noTouch);
        }

        this._childrenNode = this.renderChildren(this.rootNode, container);

        if (!container.inDoc()) {
            Y.one('body').append(container);
        }

        this.rendered = true;

        return this;
    },

    renderChildren: function (treeNode, container) {
        var childrenNode = container && container.one('.' + this.classNames.children);

        if (!childrenNode) {
            childrenNode = Y.Node.create(TreeView.Templates.children({
                classNames: this.classNames,
                node      : treeNode,
                treeview  : this
            }));
        }

        if (treeNode.isRoot()) {
            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            childrenNode.set('role', 'tree');
        } else {
            childrenNode.set('role', 'group');
        }

        if (treeNode.hasChildren()) {
            childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        for (var i = 0, len = treeNode.children.length; i < len; i++) {
            this.renderNode(treeNode.children[i], childrenNode);
        }

        if (container) {
            container.append(childrenNode);
        }

        return childrenNode;
    },

    renderNode: function (treeNode, container) {
        var classNames = this.classNames,
            htmlNode   = treeNode._htmlNode;

        if (!htmlNode) {
            htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({
                classNames: classNames,
                node      : treeNode,
                treeview  : this
            }));
        }

        var labelNode = htmlNode.one('.' + classNames.label),
            labelId   = labelNode.get('id');

        labelNode.setHTML(treeNode.label);

        if (!labelId) {
            labelId = Y.guid();
            labelNode.set('id', labelId);
        }

        htmlNode.set('aria-labelledby', labelId);
        htmlNode.set('role', 'treeitem');

        if (treeNode.canHaveChildren) {
            htmlNode.addClass(classNames.canHaveChildren);
            htmlNode.toggleClass(classNames.open, treeNode.isOpen());

            if (treeNode.hasChildren()) {
                htmlNode.addClass(classNames.hasChildren);
                this.renderChildren(treeNode, htmlNode);
            }
        }

        if (container) {
            container.append(htmlNode);
        }

        return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachTreeViewEvents: function () {
        this._treeViewEvents || (this._treeViewEvents = []);

        var classNames = this.classNames,
            container  = this.get('container');

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
        (new Y.EventHandle(this._treeViewEvents)).detach();
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        if (!this.rendered) {
            return;
        }

        this._childrenNode.insert(this.renderNode(e.node), e.index);
    },

    _afterClear: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        if (!this.rendered) {
            return;
        }

        delete this._childrenNode;
        this.rendered = false;

        this.get('container').empty();
        this.render();
    },

    _afterClose: function (e) {
        var htmlNode = this.getHTMLNode(e.node);

        htmlNode.removeClass(this.classNames.open);
        htmlNode.set('aria-expanded', false);
    },

    _afterOpen: function (e) {
        var htmlNode = this.getHTMLNode(e.node);

        htmlNode.addClass(this.classNames.open);
        htmlNode.set('aria-expanded', true);
    },

    _afterRemove: function (e) {
        var htmlNode = this.getHTMLNode(e.node);

        if (htmlNode) {
            htmlNode.remove(true);
            delete e.node._htmlNode;
        }
    },

    _afterSelect: function (e) {
        var htmlNode = this.getHTMLNode(e.node);

        htmlNode.addClass(this.classNames.selected);

        if (this.multiSelect) {
            // It's only necessary to set aria-selected when multi-selection is
            // enabled and focus can't be used to track the selection state.
            htmlNode.set('aria-selected', true);
        } else {
            htmlNode.set('tabIndex', 0).focus();
        }
    },

    _afterTreeViewMultiSelectChange: function (e) {
        var container = this.get('container'),
            rootList  = container.one('> .' + this.classNames.children),
            htmlNodes = container.all('.' + this.classNames.node);

        if (e.newVal) {
            rootList.set('aria-multiselectable', true);
            htmlNodes.set('aria-selected', false);
        } else {
            // When multiselect is disabled, aria-selected must not be set on
            // any nodes, since focus is used to indicate selection.
            rootList.removeAttribute('aria-multiselectable');
            htmlNodes.removeAttribute('aria-selected');
        }
    },

    _afterUnselect: function (e) {
        var htmlNode = this.getHTMLNode(e.node);

        htmlNode.removeClass(this.classNames.selected);

        if (this.multiSelect) {
            htmlNode.set('aria-selected', false);
        }

        htmlNode.removeAttribute('tabIndex');
    },

    _onIndicatorClick: function (e) {
        var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);

        // Indicator clicks shouldn't toggle selection state, so don't allow
        // this event to propagate to the _onRowClick() handler.
        e.stopImmediatePropagation();

        this.getNodeById(rowNode.getData('node-id')).toggle();
    },

    _onMouseDown: function (e) {
        // This prevents the tree from momentarily grabbing focus before focus
        // is set on a node.
        e.preventDefault();
    },

    _onRowClick: function (e) {
        var node = this.getNodeById(e.currentTarget.getData('node-id'));

        if (this.multiSelect) {
            node[node.isSelected() ? 'unselect' : 'select']();
        } else {
            node.select();
        }
    },

    _onRowDoubleClick: function (e) {
        this.getNodeById(e.currentTarget.getData('node-id')).toggle();
    }
});

Y.TreeView = Y.mix(TreeView, Y.TreeView);
