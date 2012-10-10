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
    Hides this menu.

    @method hide
    @chainable
    **/
    hide: function () {
        this.set('visible', false);
        return this;
    },

    /**
    Renders this menu into its container.

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

    /**
    Shows this menu.

    @method show
    @chainable
    **/
    show: function () {
        this.set('visible', true);
        return this;
    },

    /**
    Toggles the visibility of this menu, showing it if it's currently hidden or
    hiding it if it's currently visible.

    @method toggle
    @chainable
    **/
    toggle: function () {
        this.set('visible', !this.get('visible'));
        return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches menu events.

    @method _attachMenuEvents
    @protected
    **/
    _attachMenuEvents: function () {
        this._menuEvents || (this._menuEvents = []);

        var classNames = this.classNames,
            container  = this.get('container');

        this._menuEvents.push(
            this.after({
                add          : this._afterAdd,
                clear        : this._afterClear,
                close        : this._afterClose,
                open         : this._afterOpen,
                remove       : this._afterRemove,
                visibleChange: this._afterVisibleChange
            }),

            container.on('hover', this._onMenuMouseEnter,
                    this._onMenuMouseLeave, this),

            container.delegate('click', this._onItemClick,
                    '.' + classNames.item + '>.' + classNames.label, this),

            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave,
                    '.' + classNames.canHaveChildren, this),

            container.after('clickoutside', this._afterClickOutside, this)
        );
    },

    /**
    Detaches menu events.

    @method _detachMenuEvents
    @protected
    **/
    _detachMenuEvents: function () {
        (new Y.EventHandle(this._menuEvents)).detach();
    },

    /**
    Given an anchor point and the regions currently occupied by a child node
    (the node being anchored) and a parent node (the node being anchored to),
    returns a region object representing the coordinates the anchored node will
    occupy when anchored to the given point on the parent.

    The following anchor points are currently supported:

      * `'bl-br'`: Anchor the bottom left of the child to the bottom right of
        the parent.
      * `'br-bl'`: Anchor the bottom right of the child to the bottom left of
        the parent.
      * `'tl-tr'`: Anchor the top left of the child to the top right of the
        parent.
      * `'tr-tl'`: Anchor the top right of the child to the top left of the
        parent.

    @method _getAnchorRegion
    @param {String} anchor Anchor point. See above for supported points.
    @param {Object} nodeRegion Region object for the node to be anchored (that
        is, the node that will be repositioned).
    @param {Object} parentRegion Region object for the node that will be
        anchored to (that is, the node that will not move).
    @return {Object} Region that will be occupied by the anchored node.
    @protected
    **/
    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {
        switch (anchor) {
        case 'tl-tr':
            return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.top
            };

        case 'bl-br':
            return {
                bottom: parentRegion.bottom,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.bottom - nodeRegion.height
            };

        case 'tr-tl':
            return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.top
            };

        case 'br-bl':
            return {
                bottom: parentRegion.bottom,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.bottom - nodeRegion.height
            };
        }
    },

    /**
    Hides this specified menu item by moving its htmlNode offscreen.

    @method _hideMenu
    @param {Menu.Item} item Menu item.
    @param {Node} [htmlNode] HTML node for the menu item.
    @protected
    **/
    _hideMenu: function (item, htmlNode) {
        htmlNode || (htmlNode = this.getHTMLNode(item));

        var childrenNode = htmlNode.one('.' + this.classNames.children);

        childrenNode.setXY([-10000, -10000]);
        delete item.data.menuAnchor;
    },

    /**
    Returns `true` if the given _inner_ region is contained entirely within the
    given _outer_ region. If it's not a perfect fit, returns a numerical score
    indicating how much of the _inner_ region fits within the _outer_ region.
    A higher score indicates a better fit.

    @method _inRegion
    @param {Object} inner Inner region.
    @param {Object} outer Outer region.
    @return {Boolean|Number} `true` if the _inner_ region fits entirely within
        the _outer_ region or, if not, a numerical score indicating how much of
        the inner region fits.
    @protected
    **/
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

    /**
    Intelligently positions the _htmlNode_ of the given submenu _item_ relative
    to its parent so that as much as possible of the submenu will be visible
    within the viewport.

    @method _positionMenu
    @param {Menu.Item} item Menu item to position.
    @param {Node} [htmlNode] HTML node for the menu item.
    @protected
    **/
    _positionMenu: function (item, htmlNode) {
        htmlNode || (htmlNode = this.getHTMLNode(item));

        var anchors = (item.parent && item.parent.data.menuAnchors) || [
                {point: 'tl-tr'},
                {point: 'bl-br'},
                {point: 'tr-tl'},
                {point: 'br-bl'}
            ],

            childrenNode   = htmlNode.one('.' + this.classNames.children),
            childrenRegion = childrenNode.get('region'),
            parentRegion   = htmlNode.get('region'),
            viewportRegion = htmlNode.get('viewportRegion');

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        var anchor;

        for (var i = 0, len = anchors.length; i < len; i++) {
            anchor = anchors[i];

            anchor.region = this._getAnchorRegion(anchor.point, childrenRegion,
                    parentRegion);

            anchor.score = this._inRegion(anchor.region, viewportRegion);
        }

        // Sort the anchors by score.
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
        var anchorRegion = anchors[0].region;
        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `add` events for this menu.

    @method _afterAdd
    @param {EventFacade} e
    @protected
    **/
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

    /**
    Handles `clear` events for this menu.

    @method _afterClear
    @protected
    **/
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

    /**
    Handles `clickoutside` events for this menu.

    @method _afterClickOutside
    @protected
    **/
    _afterClickOutside: function () {
        this.closeSubMenus();
    },

    /**
    Handles `close` events for this menu.

    @method _afterClose
    @param {EventFacade} e
    @protected
    **/
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

    /**
    Handles `open` events for this menu.

    @method _afterOpen
    @param {EventFacade} e
    @protected
    **/
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

    /**
    Handles `remove` events for this menu.

    @method _afterRemove
    @param {EventFacade} e
    @protected
    **/
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

    /**
    Handles `visibleChange` events for this menu.

    @method _afterVisibleChange
    @param {EventFacade} e
    @protected
    **/
    _afterVisibleChange: function (e) {
        this.get('container').toggleClass(this.classNames.open, e.newVal);
    },

    /**
    Handles click events on menu items.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
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

    /**
    Handles delegated `mouseenter` events on menu items.

    @method _onItemMouseEnter
    @param {EventFacade} e
    @protected
    **/
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

    /**
    Handles delegated `mouseleave` events on menu items.

    @method _onItemMouseLeave
    @param {EventFacade} e
    @protected
    **/
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

    /**
    Handles `mouseenter` events on this menu.

    @method _onMenuMouseEnter
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseEnter: function () {
        clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        var self = this;

        clearTimeout(this._timeouts.menu);

        this._timeouts.menu = setTimeout(function () {
            self.closeSubMenus();
        }, 500);
    },

    // -- Default Event Handlers -----------------------------------------------

    /**
    Default handler for the `itemClick` event.

    @method _defClickFn
    @param {EventFacade} e
    @protected
    **/
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
}, {
    ATTRS: {
        /**
        Whether or not this menu is visible. Changing this attribute's value
        will also change the visibility of this menu.

        @attribute {Boolean} visible
        @default false
        **/
        visible: {
            value: false
        }
    }
});

Y.Menu = Y.mix(Menu, Y.Menu);
