YUI.add('menu', function (Y, NAME) {

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
Fired when any clickable menu item is clicked.

You can subscribe to clicks on a specific menu item by subscribing to
"itemClick#id", where "id" is the item id of the item you want to subscribe to.

@event itemClick
@param {Menu.Item} item Menu item that was clicked.
@param {EventFacade} originEvent Original click event.
@preventable _defItemClickFn
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
        hidden         : getClassName('menu-hidden'),
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
            htmlNode   = item._htmlNode,
            isHidden   = item.isHidden();

        // Create an HTML node for this menu item if one doesn't already exist.
        if (!htmlNode) {
            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        // Mark the HTML node as hidden if the item is hidden.
        htmlNode.set('aria-hidden', isHidden);
        htmlNode.toggleClass(classNames.hidden, isHidden);

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
    Repositions this menu so that it is anchored to a specified node, region, or
    set of pixel coordinates.

    The menu will be displayed at the most advantageous position relative to the
    anchor point to ensure that as much of the menu as possible is visible
    within the viewport.

    @method reposition
    @param {Node|Number[]|Object} anchorPoint Anchor point at which this menu
        should be positioned. The point may be specified as a `Y.Node`
        reference, a region object, or an array of X and Y pixel coordinates.
    @chainable
    **/
    reposition: function (anchorPoint) {
        var container = this.get('container'),
            anchorRegion, menuRegion;

        if (Y.Lang.isArray(anchorPoint)) {
            anchorRegion = {
                bottom: anchorPoint[1],
                left  : anchorPoint[0],
                right : anchorPoint[0],
                top   : anchorPoint[1]
            };
        } else if (anchorPoint._node) {
            anchorRegion = anchorPoint.get('region');
        } else {
            anchorRegion = anchorPoint;
        }

        menuRegion = this._getSortedAnchorRegions(
            ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],
            container.get('region'),
            anchorRegion
        )[0].region;

        container.setXY([menuRegion.left, menuRegion.top]);

        return this;
    },

    /**
    Shows this menu.

    @method show
    @param {Object} [options] Options.
        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at
            which this menu should be positioned when shown. The point may be
            specified as a `Y.Node` reference, a region object, or an array of X
            and Y pixel coordinates.
    @chainable
    **/
    show: function (options) {
        if (options && options.anchorPoint) {
            this.reposition(options.anchorPoint);
        }

        this.set('visible', true);
        return this;
    },

    /**
    Toggles the visibility of this menu, showing it if it's currently hidden or
    hiding it if it's currently visible.

    @method toggle
    @param {Object} [options] Options.
        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at
            which this menu should be positioned when shown. The point may be
            specified as a `Y.Node` reference, a region object, or an array of X
            and Y pixel coordinates.
    @chainable
    **/
    toggle: function (options) {
        return this[this.get('visible') ? 'hide' : 'show'](options);
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
                disable      : this._afterDisable,
                enable       : this._afterEnable,
                hide         : this._afterHide,
                open         : this._afterOpen,
                remove       : this._afterRemove,
                show         : this._afterShow,
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

    An anchor point is a string like "tl-bl", which means "anchor the top left
    point of _nodeRegion_ to the bottom left point of _parentRegion_".

    Any combination of top/bottom/left/right anchor points may be used as long
    as they follow this format. Here are a few examples:

      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of
        _parentRegion_.
      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of
        _parentRegion_.
      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of
        _parentRegion_.
      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of
        _parentRegion_.

    @method _getAnchorRegion
    @param {String} anchor Anchor point. See above for details.
    @param {Object} nodeRegion Region object for the node to be anchored (that
        is, the node that will be repositioned).
    @param {Object} parentRegion Region object for the node that will be
        anchored to (that is, the node that will not move).
    @return {Object} Region that will be occupied by the anchored node.
    @protected
    **/
    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {
        var region = {};

        anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {
            var lookup = {
                    b: 'bottom',
                    l: 'left',
                    r: 'right',
                    t: 'top'
                };

            region[lookup[p1]] = parentRegion[lookup[p3]];
            region[lookup[p2]] = parentRegion[lookup[p4]];
        });

        'bottom' in region || (region.bottom = region.top + nodeRegion.height);
        'left' in region   || (region.left = region.right - nodeRegion.width);
        'right' in region  || (region.right = region.left + nodeRegion.width);
        'top' in region    || (region.top = region.bottom - nodeRegion.height);

        return region;
    },

    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {
        containerRegion || (containerRegion = Y.DOM.viewportRegion());

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        var anchors = [],
            i, len, point, region;

        for (i = 0, len = points.length; i < len; i++) {
            point = points[i];

            // Allow arrays of strings or arrays of objects like {point: '...'}.
            if (point.point) {
                point = point.point;
            }

            region = this._getAnchorRegion(point, nodeRegion, parentRegion);

            anchors.push({
                point : point,
                region: region,
                score : this._inRegion(region, containerRegion)
            });
        }

        // Sort the anchors in descending order by score (higher score is
        // better).
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

        // Return the sorted anchors.
        return anchors;
    },

    /**
    Hides the specified menu container by moving its htmlNode offscreen.

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

        var childrenNode = htmlNode.one('.' + this.classNames.children),

            anchors = this._getSortedAnchorRegions(
                (item.parent && item.parent.data.menuAnchors) || [
                    'tl-tr', 'bl-br', 'tr-tl', 'br-bl'
                ],
                childrenNode.get('region'),
                htmlNode.get('region')
            );

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
    Handles `disable` events for this menu.

    @method _afterDisable
    @param {EventFacade} e
    @protected
    **/
    _afterDisable: function (e) {
        var htmlNode = this.getHTMLNode(e.item);

        if (htmlNode) {
            htmlNode.addClass(this.classNames.disabled);
        }
    },

    /**
    Handles `enable` events for this menu.

    @method _afterEnable
    @param {EventFacade} e
    @protected
    **/
    _afterEnable: function (e) {
        var htmlNode = this.getHTMLNode(e.item);

        if (htmlNode) {
            htmlNode.removeClass(this.classNames.disabled);
        }
    },

    /**
    Handles `hide` events for this menu.

    @method _afterHide
    @param {EventFacade} e
    @protected
    **/
    _afterHide: function (e) {
        var htmlNode = this.getHTMLNode(e.item);

        if (htmlNode) {
            htmlNode.addClass(this.classNames.hidden);
            htmlNode.set('aria-hidden', true);
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
    Handles `show` events for this menu.

    @method _afterShow
    @param {EventFacade} e
    @protected
    **/
    _afterShow: function (e) {
        var htmlNode = this.getHTMLNode(e.item);

        if (htmlNode) {
            htmlNode.removeClass(this.classNames.hidden);
            htmlNode.set('aria-hidden', false);
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
            eventName  = EVT_ITEM_CLICK + '#' + item.id,
            isDisabled = item.isDisabled() || item.isHidden();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        if (isDisabled || item.url === '#') {
            e.preventDefault();
        }

        if (isDisabled) {
            return;
        }

        if (!this._published[eventName]) {
            this._published[eventName] = this.publish(eventName, {
                defaultFn: this._defSpecificItemClickFn
            }) ;
        }

        if (!this._published[EVT_ITEM_CLICK]) {
            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defItemClickFn
            });
        }

        this.fire(eventName, {
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
        var item = this.getNodeById(e.currentTarget.get('id'));

        clearTimeout(this._timeouts.item);

        if (item.isOpen() || item.isDisabled()) {
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
        var item = this.getNodeById(e.currentTarget.get('id'));

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
    Default handler for the generic `itemClick` event.

    @method _defItemClickFn
    @param {EventFacade} e
    @protected
    **/
    _defItemClickFn: function (e) {
        var item = e.item;

        if (item.canHaveChildren) {
            clearTimeout(this._timeouts.item);
            clearTimeout(this._timeouts.menu);

            e.item.toggle();
        } else {
            this.closeSubMenus();
            this.hide();
        }
    },

    /**
    Default handler for item-specific `itemClick#<id>` events.

    @method _defSpecificItemClickFn
    @param {EventFacade} e
    @protected
    **/
    _defSpecificItemClickFn: function (e) {
        this.fire(EVT_ITEM_CLICK, {
            originEvent: e.originEvent,
            item       : e.item
        });
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


}, '@VERSION@', {
    "requires": [
        "classnamemanager",
        "event-hover",
        "event-outside",
        "menu-base",
        "menu-templates",
        "node-screen",
        "view"
    ],
    "skinnable": true
});
