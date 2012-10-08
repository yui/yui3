/**
Provides the `Y.Menu` widget.

@module menu
@main menu
**/

/**
Menu widget.

@class Menu
@constructor
@extends Menu.Base
@uses View
**/

var getClassName = Y.ClassNameManager.getClassName,

/**
Fired when a clickable menu item is clicked.

@event itemClick
@param {Menu.Item} item Menu item that was clicked.
@param {EventFacade} originEvent Original click event.
@preventable _defClickFn
**/
EVT_ITEM_CLICK = 'itemClick',

Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {

    /**
    CSS class names used by this menu.

    @property {Object} classNames
    **/
    classNames: {
        canHaveChildren: getClassName('menu-can-have-children'),
        children       : getClassName('menu-children'),
        disabled       : getClassName('menu-disabled'),
        hasChildren    : getClassName('menu-has-children'),
        heading        : getClassName('menu-heading'),
        item           : getClassName('menu-item'),
        label          : getClassName('menu-label'),
        menu           : getClassName('menu'),
        noTouch        : getClassName('menu-notouch'),
        open           : getClassName('menu-open'),
        selected       : getClassName('menu-selected'),
        separator      : getClassName('menu-separator'),
        touch          : getClassName('menu-touch')
    },

    /**
    Whether or not this menu has been rendered.

    @property {Boolean} rendered
    @default false
    **/
    rendered: false,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        this._openMenus = {};
        this._published = {};
        this._timeouts  = {};

        this._attachMenuEvents();
    },

    destructor: function () {
        this._detachMenuEvents();

        delete this._openMenus;
        delete this._published;

        Y.Object.each(this._timeouts, function (timeout) {
            clearTimeout(timeout);
        }, this);

        delete this._timeouts;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Closes all open submenus of this menu.

    @method closeSubMenus
    @chainable
    **/
    closeSubMenus: function () {
        // Close all open submenus.
        Y.Object.each(this._openMenus, function (item) {
            item.close();
        }, this);

        return this;
    },

    /**
    Returns the HTML node (as a `Y.Node` instance) associated with the specified
    menu item, if any.

    @method getHTMLNode
    @param {Menu.Item} item Menu item.
    @return {Node} `Y.Node` instance associated with the given tree node, or
        `undefined` if one was not found.
    **/
    getHTMLNode: function (item) {
        if (!item._htmlNode) {
            item._htmlNode = this.get('container').one('#' + item.id);
        }

        return item._htmlNode;
    },

    /**
    Renders this Menu into its container.

    If the container hasn't already been added to the current document, it will
    be appended to the `<body>` element.

    @method render
    @chainable
    **/
    render: function () {
        var container = this.get('container');

        container.addClass(this.classNames.menu);

        // Detect touchscreen devices.
        if ('ontouchstart' in Y.config.win) {
            container.addClass(this.classNames.touch);
        } else {
            container.addClass(this.classNames.noTouch);
        }

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
    Renders the children of the specified menu item.

    If a container is specified, it will be assumed to be an existing rendered
    menu item, and the children will be rendered (or re-rendered) inside it.

    @method renderChildren
    @param {Menu.Item} menuItem Menu item whose children should be rendered.
    @param {Object} [options] Options.
        @param {Node} [options.container] `Y.Node` instance of a container into
            which the children should be rendered. If the container already
            contains rendered children, they will be re-rendered in place.
    @return {Node} `Y.Node` instance containing the rendered children.
    **/
    renderChildren: function (treeNode, options) {
        options || (options = {});

        var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        if (!childrenNode) {
            childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        if (treeNode.isRoot()) {
            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            childrenNode.set('role', 'menu');
        }

        if (treeNode.hasChildren()) {
            childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        for (var i = 0, len = treeNode.children.length; i < len; i++) {
            this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        if (container) {
            container.append(childrenNode);
        }

        return childrenNode;
    },

    /**
    Renders the specified menu item and its children (if any).

    If a container is specified, the rendered node will be appended to it.

    @method renderNode
    @param {Menu.Item} menuItem Tree node to render.
    @param {Object} [options] Options.
        @param {Node} [options.container] `Y.Node` instance of a container to
            which the rendered tree node should be appended.
        @param {Boolean} [options.renderChildren=false] Whether or not to render
            this node's children.
    @return {Node} `Y.Node` instance of the rendered menu item.
    **/
    renderNode: function (item, options) {
        options || (options = {});

        var classNames = this.classNames,
            htmlNode   = item._htmlNode;

        if (!htmlNode) {
            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        switch (item.type) {
            case 'separator':
                htmlNode.set('role', 'separator');
                break;

            case 'item':
            case 'heading':
                var labelNode = htmlNode.one('.' + classNames.label),
                    labelId   = labelNode.get('id');

                labelNode.setHTML(item.label);

                if (!labelId) {
                    labelId = Y.guid();
                    labelNode.set('id', labelId);
                }

                htmlNode.set('aria-labelledby', labelId);

                if (item.type === 'heading') {
                    htmlNode.set('role', 'heading');
                } else {
                    htmlNode.set('role', 'menuitem');

                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                    if (item.canHaveChildren) {
                        htmlNode.addClass(classNames.canHaveChildren);
                        htmlNode.toggleClass(classNames.open, item.isOpen());

                        if (item.hasChildren()) {
                            htmlNode.addClass(classNames.hasChildren);

                            if (options.renderChildren) {
                                this.renderChildren(item, {
                                    container: htmlNode
                                });
                            }
                        }
                    }
                }
                break;
        }

        if (options.container) {
            options.container.append(htmlNode);
        }

        return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachMenuEvents: function () {
        this._menuEvents || (this._menuEvents = []);

        var classNames = this.classNames,
            container  = this.get('container');

        this._menuEvents.push(
            this.after({
                add   : this._afterAdd,
                clear : this._afterClear,
                close : this._afterClose,
                open  : this._afterOpen,
                remove: this._afterRemove
            }),

            container.on('hover', this._onMenuMouseEnter,
                    this._onMenuMouseLeave, this),

            container.delegate('click', this._onItemClick,
                    '.' + classNames.item + '>.' + classNames.label, this),

            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave,
                    '.' + classNames.canHaveChildren, this),

            container.after('clickoutside', this._afterOutsideClick, this)
        );
    },

    _detachMenuEvents: function () {
        (new Y.EventHandle(this._menuEvents)).detach();
    },

    _getAnchorRegion: function (anchor, parentRegion, nodeRegion) {
        switch (anchor) {
        case 'tr':
            return {
                bottom: parentRegion.bottom,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.bottom - nodeRegion.height
            };

        case 'bl':
            return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.top
            };

        case 'tl':
            return {
                bottom: parentRegion.bottom,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.bottom - nodeRegion.height
            };

        default: // 'br' is the default anchor
            return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.top
            };
        }
    },

    _hideMenu: function (item, htmlNode) {
        htmlNode || (htmlNode = this.getHTMLNode(item));

        var childrenNode = htmlNode.one('.' + this.classNames.children);

        childrenNode.setXY([-10000, -10000]);
        delete item.data.menuAnchor;
    },

    _inRegion: function (inner, outer) {
        if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        return (
            Math.min(outer.bottom - inner.bottom, 0) +
            Math.min(inner.left - outer.left, 0) +
            Math.min(outer.right - inner.right, 0) +
            Math.min(inner.top - outer.top, 0)
        );
    },

    _positionMenu: function (item, htmlNode) {
        htmlNode || (htmlNode = this.getHTMLNode(item));

        var anchors = (item.parent && item.parent.data.menuAnchors) || [
                {point: 'br'},
                {point: 'bl'},
                {point: 'tr'},
                {point: 'tl'}
            ],

            childrenNode   = htmlNode.one('.' + this.classNames.children),
            childrenRegion = childrenNode.get('region'),
            parentRegion   = htmlNode.get('region'),
            viewportRegion = htmlNode.get('viewportRegion');

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        var anchor,
            anchorRegion;

        for (var i = 0, len = anchors.length; i < len; i++) {
            anchor = anchors[i];

            anchorRegion = anchor.region = this._getAnchorRegion(anchor.point, parentRegion, childrenRegion);
            anchor.score = this._inRegion(anchorRegion, viewportRegion);
        }

        // Sort the anchors by score. Unscored regions will be given a low
        // default score so that they're sorted after scored regions.
        anchors.sort(function (a, b) {
            if (a.score === b.score) {
                return 0;
            } else if (a.score === true) {
                return -1;
            } else if (b.score === true) {
                return 1;
            } else {
                return b.score - a.score;
            }
        });

        // Remember which anchors we used for this item so that we can default
        // that anchor for submenus of this item if necessary.
        item.data.menuAnchors = anchors;

        // Position the submenu.
        anchorRegion = anchors[0].region;
        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the menu hasn't been rendered yet.
        if (!this.rendered) {
            return;
        }

        var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        if (parent === this.rootNode) {
            htmlChildrenNode = this._childrenNode;
        } else {
            htmlNode = this.getHTMLNode(parent);
            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                htmlNode || (htmlNode = this.renderNode(parent));

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
        this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        if (!this.rendered) {
            return;
        }

        delete this._childrenNode;
        this.rendered = false;

        this.get('container').empty();
        this.render();
    },

    _afterClose: function (e) {
        var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        for (var i = 0, len = item.children.length; i < len; i++) {
            item.children[i].close();
        }

        item.close();
        delete this._openMenus[item.id];

        if (htmlNode) {
            this._hideMenu(item, htmlNode);
            htmlNode.removeClass(this.classNames.open);
        }
    },

    _afterOpen: function (e) {
        var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            if (parent.isOpen()) {
                for (var i = 0, len = parent.children.length; i < len; i++) {
                    child = parent.children[i];

                    if (child !== item) {
                        child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                parent.open();
            }
        }

        this._openMenus[item.id] = item;

        if (htmlNode) {
            this._positionMenu(item, htmlNode);
            htmlNode.addClass(this.classNames.open);
        }
    },

    _afterOutsideClick: function () {
        this.closeSubMenus();
    },

    _afterRemove: function (e) {
        delete this._openMenus[e.node.id];

        if (!this.rendered) {
            return;
        }

        var htmlNode = this.getHTMLNode(e.node);

        if (htmlNode) {
            htmlNode.remove(true);
            delete e.node._htmlNode;
        }
    },

    _onItemClick: function (e) {
        var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            isDisabled = item.isDisabled();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        if (isDisabled || item.url === '#') {
            e._event.preventDefault();
        }

        if (isDisabled) {
            return;
        }

        if (!this._published[EVT_ITEM_CLICK]) {
            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defClickFn
            });
        }

        this.fire(EVT_ITEM_CLICK, {
            originEvent: e,
            item       : item
        });
    },

    _onItemMouseEnter: function (e) {
        var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        clearTimeout(this._timeouts.item);

        if (item.isOpen()) {
            return;
        }

        this._timeouts.item = setTimeout(function () {
            item.open();
        }, 200); // TODO: make timeouts configurable
    },

    _onItemMouseLeave: function (e) {
        var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        clearTimeout(this._timeouts.item);

        if (!item.isOpen()) {
            return;
        }

        this._timeouts.item = setTimeout(function () {
            item.close();
        }, 300);
    },

    _onMenuMouseEnter: function () {
        clearTimeout(this._timeouts.menu);
    },

    _onMenuMouseLeave: function () {
        var self = this;

        clearTimeout(this._timeouts.menu);

        this._timeouts.menu = setTimeout(function () {
            self.closeSubMenus();
        }, 500);
    },

    // -- Default Event Handlers -----------------------------------------------
    _defClickFn: function (e) {
        var item = e.item;

        if (item.canHaveChildren) {
            clearTimeout(this._timeouts.item);
            clearTimeout(this._timeouts.menu);

            e.item.toggle();
        } else {
            this.closeSubMenus();
        }
    }
});

Y.Menu = Y.mix(Menu, Y.Menu);
