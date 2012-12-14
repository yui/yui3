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
        this._attachTreeViewEvents();
    },

    destructor: function () {
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
        var container     = this.get('container'),
            isTouchDevice = 'ontouchstart' in Y.config.win;

        container.addClass(this.classNames.treeview);
        container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);

        this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        if (!container.inDoc()) {
            Y.one('body').append(container);
        }

        this.rendered = true;

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
        options || (options = {});

        var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children),
            lazyRender   = this._lazyRender;

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

            for (var i = 0, len = treeNode.children.length; i < len; i++) {
                var child = treeNode.children[i];

                this.renderNode(child, {
                    container     : childrenNode,
                    renderChildren: !lazyRender || child.isOpen()
                });
            }
        }

        // Keep track of whether or not this node's children have been rendered
        // so we'll know whether we need to render them later if the node is
        // opened.
        treeNode.state.renderedChildren = true;

        if (container) {
            container.append(childrenNode);
        }

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
        options || (options = {});

        var classNames  = this.classNames,
            hasChildren = treeNode.hasChildren(),
            htmlNode    = treeNode._htmlNode;

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

        htmlNode.toggleClass(classNames.canHaveChildren, !!treeNode.canHaveChildren);
        htmlNode.toggleClass(classNames.open, treeNode.isOpen());
        htmlNode.toggleClass(classNames.hasChildren, hasChildren);

        if (hasChildren && options.renderChildren) {
            this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        treeNode.state.rendered = true;

        if (options.container) {
            options.container.append(htmlNode);
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
            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.canHaveChildren + ' > .' + classNames.row, this)
        );
    },

    _detachTreeViewEvents: function () {
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
        return this._lazyRender = value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        if (!this.rendered) {
            return;
        }

        var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        if (parent === this.rootNode) {
            htmlChildrenNode = this._childrenNode;
        } else {
            htmlNode         = this.getHTMLNode(parent);
            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                htmlNode = this.renderNode(parent);

                this.renderChildren(parent, {
                    container: htmlNode
                });

                return;
            }
        }

        htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: true
        }), e.index);
    },

    _afterClear: function () {
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
        if (!this.rendered) {
            return;
        }

        var htmlNode = this.getHTMLNode(e.node);

        htmlNode.removeClass(this.classNames.open);
        htmlNode.set('aria-expanded', false);
    },

    _afterOpen: function (e) {
        if (!this.rendered) {
            return;
        }

        var treeNode = e.node,
            htmlNode = this.getHTMLNode(treeNode);

        // If this node's children haven't been rendered yet, render them.
        if (!treeNode.state.renderedChildren) {
            this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        htmlNode.addClass(this.classNames.open);
        htmlNode.set('aria-expanded', true);
    },

    _afterRemove: function (e) {
        if (!this.rendered) {
            return;
        }

        var htmlNode = this.getHTMLNode(e.node);

        if (htmlNode) {
            htmlNode.remove(true);
            delete e.node._htmlNode;
        }
    },

    _afterSelect: function (e) {
        if (!this.rendered) {
            return;
        }

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
        if (!this.rendered) {
            return;
        }

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
        if (!this.rendered) {
            return;
        }

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

Y.TreeView = Y.mix(TreeView, Y.TreeView);
