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
_yuitest_coverage["build/menu/menu.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/menu/menu.js",
    code: []
};
_yuitest_coverage["build/menu/menu.js"].code=["YUI.add('menu', function (Y, NAME) {","","/**","Provides the `Y.Menu` widget.","","@module menu","@main menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@extends Menu.Base","@uses View","**/","","var getClassName = Y.ClassNameManager.getClassName,","","/**","Fired when any clickable menu item is clicked.","","You can subscribe to clicks on a specific menu item by subscribing to","\"itemClick#id\", where \"id\" is the item id of the item you want to subscribe to.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defItemClickFn","**/","EVT_ITEM_CLICK = 'itemClick',","","Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        hidden         : getClassName('menu-hidden'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Hides this menu.","","    @method hide","    @chainable","    **/","    hide: function () {","        this.set('visible', false);","        return this;","    },","","    /**","    Renders this menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode,","            isHidden   = item.isHidden();","","        // Create an HTML node for this menu item if one doesn't already exist.","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        // Mark the HTML node as hidden if the item is hidden.","        htmlNode.set('aria-hidden', isHidden);","        htmlNode.toggleClass(classNames.hidden, isHidden);","","        switch (item.type) {","            case 'separator':","                htmlNode.set('role', 'separator');","                break;","","            case 'item':","            case 'heading':","                var labelNode = htmlNode.one('.' + classNames.label),","                    labelId   = labelNode.get('id');","","                labelNode.setHTML(item.label);","","                if (!labelId) {","                    labelId = Y.guid();","                    labelNode.set('id', labelId);","                }","","                htmlNode.set('aria-labelledby', labelId);","","                if (item.type === 'heading') {","                    htmlNode.set('role', 'heading');","                } else {","                    htmlNode.set('role', 'menuitem');","","                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                    if (item.canHaveChildren) {","                        htmlNode.addClass(classNames.canHaveChildren);","                        htmlNode.toggleClass(classNames.open, item.isOpen());","","                        if (item.hasChildren()) {","                            htmlNode.addClass(classNames.hasChildren);","","                            if (options.renderChildren) {","                                this.renderChildren(item, {","                                    container: htmlNode","                                });","                            }","                        }","                    }","                }","                break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    /**","    Repositions this menu so that it is anchored to a specified node, region, or","    set of pixel coordinates.","","    The menu will be displayed at the most advantageous position relative to the","    anchor point to ensure that as much of the menu as possible is visible","    within the viewport.","","    @method reposition","    @param {Node|Number[]|Object} anchorPoint Anchor point at which this menu","        should be positioned. The point may be specified as a `Y.Node`","        reference, a region object, or an array of X and Y pixel coordinates.","    @chainable","    **/","    reposition: function (anchorPoint) {","        var container = this.get('container'),","            anchorRegion, menuRegion;","","        if (Y.Lang.isArray(anchorPoint)) {","            anchorRegion = {","                bottom: anchorPoint[1],","                left  : anchorPoint[0],","                right : anchorPoint[0],","                top   : anchorPoint[1]","            };","        } else if (anchorPoint._node) {","            anchorRegion = anchorPoint.get('region');","        } else {","            anchorRegion = anchorPoint;","        }","","        menuRegion = this._getSortedAnchorRegions(","            ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],","            container.get('region'),","            anchorRegion","        )[0].region;","","        container.setXY([menuRegion.left, menuRegion.top]);","","        return this;","    },","","    /**","    Shows this menu.","","    @method show","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    show: function (options) {","        if (options && options.anchorPoint) {","            this.reposition(options.anchorPoint);","        }","","        this.set('visible', true);","        return this;","    },","","    /**","    Toggles the visibility of this menu, showing it if it's currently hidden or","    hiding it if it's currently visible.","","    @method toggle","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    toggle: function (options) {","        return this[this.get('visible') ? 'hide' : 'show'](options);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches menu events.","","    @method _attachMenuEvents","    @protected","    **/","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add          : this._afterAdd,","                clear        : this._afterClear,","                close        : this._afterClose,","                disable      : this._afterDisable,","                enable       : this._afterEnable,","                hide         : this._afterHide,","                open         : this._afterOpen,","                remove       : this._afterRemove,","                show         : this._afterShow,","                visibleChange: this._afterVisibleChange","            }),","","            container.on('hover', this._onMenuMouseEnter,","                    this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick,","                    '.' + classNames.item + '>.' + classNames.label, this),","","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave,","                    '.' + classNames.canHaveChildren, this),","","            container.after('clickoutside', this._afterClickOutside, this)","        );","    },","","    /**","    Detaches menu events.","","    @method _detachMenuEvents","    @protected","    **/","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    /**","    Given an anchor point and the regions currently occupied by a child node","    (the node being anchored) and a parent node (the node being anchored to),","    returns a region object representing the coordinates the anchored node will","    occupy when anchored to the given point on the parent.","","    An anchor point is a string like \"tl-bl\", which means \"anchor the top left","    point of _nodeRegion_ to the bottom left point of _parentRegion_\".","","    Any combination of top/bottom/left/right anchor points may be used as long","    as they follow this format. Here are a few examples:","","      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of","        _parentRegion_.","      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of","        _parentRegion_.","      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of","        _parentRegion_.","      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of","        _parentRegion_.","","    @method _getAnchorRegion","    @param {String} anchor Anchor point. See above for details.","    @param {Object} nodeRegion Region object for the node to be anchored (that","        is, the node that will be repositioned).","    @param {Object} parentRegion Region object for the node that will be","        anchored to (that is, the node that will not move).","    @return {Object} Region that will be occupied by the anchored node.","    @protected","    **/","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        var region = {};","","        anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {","            var lookup = {","                    b: 'bottom',","                    l: 'left',","                    r: 'right',","                    t: 'top'","                };","","            region[lookup[p1]] = parentRegion[lookup[p3]];","            region[lookup[p2]] = parentRegion[lookup[p4]];","        });","","        'bottom' in region || (region.bottom = region.top + nodeRegion.height);","        'left' in region   || (region.left = region.right - nodeRegion.width);","        'right' in region  || (region.right = region.left + nodeRegion.width);","        'top' in region    || (region.top = region.bottom - nodeRegion.height);","","        return region;","    },","","    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {","        containerRegion || (containerRegion = Y.DOM.viewportRegion());","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchors = [],","            i, len, point, region;","","        for (i = 0, len = points.length; i < len; i++) {","            point = points[i];","","            // Allow arrays of strings or arrays of objects like {point: '...'}.","            if (point.point) {","                point = point.point;","            }","","            region = this._getAnchorRegion(point, nodeRegion, parentRegion);","","            anchors.push({","                point : point,","                region: region,","                score : this._inRegion(region, containerRegion)","            });","        }","","        // Sort the anchors in descending order by score (higher score is","        // better).","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Return the sorted anchors.","        return anchors;","    },","","    /**","    Hides the specified menu container by moving its htmlNode offscreen.","","    @method _hideMenu","    @param {Menu.Item} item Menu item.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    /**","    Returns `true` if the given _inner_ region is contained entirely within the","    given _outer_ region. If it's not a perfect fit, returns a numerical score","    indicating how much of the _inner_ region fits within the _outer_ region.","    A higher score indicates a better fit.","","    @method _inRegion","    @param {Object} inner Inner region.","    @param {Object} outer Outer region.","    @return {Boolean|Number} `true` if the _inner_ region fits entirely within","        the _outer_ region or, if not, a numerical score indicating how much of","        the inner region fits.","    @protected","    **/","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    /**","    Intelligently positions the _htmlNode_ of the given submenu _item_ relative","    to its parent so that as much as possible of the submenu will be visible","    within the viewport.","","    @method _positionMenu","    @param {Menu.Item} item Menu item to position.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children),","","            anchors = this._getSortedAnchorRegions(","                (item.parent && item.parent.data.menuAnchors) || [","                    'tl-tr', 'bl-br', 'tr-tl', 'br-bl'","                ],","                childrenNode.get('region'),","                htmlNode.get('region')","            );","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `add` events for this menu.","","    @method _afterAdd","    @param {EventFacade} e","    @protected","    **/","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    /**","    Handles `clear` events for this menu.","","    @method _afterClear","    @protected","    **/","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    /**","    Handles `clickoutside` events for this menu.","","    @method _afterClickOutside","    @protected","    **/","    _afterClickOutside: function () {","        this.closeSubMenus();","    },","","    /**","    Handles `close` events for this menu.","","    @method _afterClose","    @param {EventFacade} e","    @protected","    **/","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    /**","    Handles `disable` events for this menu.","","    @method _afterDisable","    @param {EventFacade} e","    @protected","    **/","    _afterDisable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `enable` events for this menu.","","    @method _afterEnable","    @param {EventFacade} e","    @protected","    **/","    _afterEnable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `hide` events for this menu.","","    @method _afterHide","    @param {EventFacade} e","    @protected","    **/","    _afterHide: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', true);","        }","    },","","    /**","    Handles `open` events for this menu.","","    @method _afterOpen","    @param {EventFacade} e","    @protected","    **/","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    /**","    Handles `remove` events for this menu.","","    @method _afterRemove","    @param {EventFacade} e","    @protected","    **/","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    /**","    Handles `show` events for this menu.","","    @method _afterShow","    @param {EventFacade} e","    @protected","    **/","    _afterShow: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', false);","        }","    },","","    /**","    Handles `visibleChange` events for this menu.","","    @method _afterVisibleChange","    @param {EventFacade} e","    @protected","    **/","    _afterVisibleChange: function (e) {","        this.get('container').toggleClass(this.classNames.open, e.newVal);","    },","","    /**","    Handles click events on menu items.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            eventName  = EVT_ITEM_CLICK + '#' + item.id,","            isDisabled = item.isDisabled() || item.isHidden();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[eventName]) {","            this._published[eventName] = this.publish(eventName, {","                defaultFn: this._defSpecificItemClickFn","            }) ;","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defItemClickFn","            });","        }","","        this.fire(eventName, {","            originEvent: e,","            item       : item","        });","    },","","    /**","    Handles delegated `mouseenter` events on menu items.","","    @method _onItemMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen() || item.isDisabled()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    /**","    Handles delegated `mouseleave` events on menu items.","","    @method _onItemMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    /**","    Handles `mouseenter` events on this menu.","","    @method _onMenuMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    /**","    Handles `mouseleave` events on this menu.","","    @method _onMenuMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the generic `itemClick` event.","","    @method _defItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defItemClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggle();","        } else {","            this.closeSubMenus();","            this.hide();","        }","    },","","    /**","    Default handler for item-specific `itemClick#<id>` events.","","    @method _defSpecificItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defSpecificItemClickFn: function (e) {","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e.originEvent,","            item       : e.item","        });","    }","}, {","    ATTRS: {","        /**","        Whether or not this menu is visible. Changing this attribute's value","        will also change the visibility of this menu.","","        @attribute {Boolean} visible","        @default false","        **/","        visible: {","            value: false","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {","    \"requires\": [","        \"classnamemanager\",","        \"event-hover\",","        \"event-outside\",","        \"menu-base\",","        \"menu-templates\",","        \"node-screen\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/menu/menu.js"].lines = {"1":0,"19":0,"69":0,"70":0,"71":0,"73":0,"77":0,"79":0,"80":0,"82":0,"83":0,"86":0,"101":0,"102":0,"105":0,"115":0,"116":0,"129":0,"131":0,"134":0,"135":0,"137":0,"140":0,"144":0,"145":0,"148":0,"150":0,"168":0,"170":0,"173":0,"174":0,"181":0,"182":0,"183":0,"186":0,"187":0,"190":0,"191":0,"197":0,"198":0,"201":0,"219":0,"221":0,"226":0,"227":0,"235":0,"236":0,"238":0,"240":0,"241":0,"245":0,"248":0,"250":0,"251":0,"252":0,"255":0,"257":0,"258":0,"260":0,"262":0,"264":0,"265":0,"266":0,"268":0,"269":0,"271":0,"272":0,"279":0,"282":0,"283":0,"286":0,"304":0,"307":0,"308":0,"314":0,"315":0,"317":0,"320":0,"326":0,"328":0,"343":0,"344":0,"347":0,"348":0,"364":0,"376":0,"378":0,"381":0,"415":0,"449":0,"451":0,"452":0,"459":0,"460":0,"463":0,"464":0,"465":0,"466":0,"468":0,"472":0,"477":0,"480":0,"481":0,"484":0,"485":0,"488":0,"490":0,"499":0,"500":0,"501":0,"502":0,"503":0,"504":0,"505":0,"507":0,"512":0,"524":0,"526":0,"528":0,"529":0,"547":0,"553":0,"559":0,"578":0,"580":0,"592":0,"595":0,"596":0,"610":0,"611":0,"614":0,"618":0,"619":0,"621":0,"622":0,"624":0,"627":0,"629":0,"633":0,"637":0,"649":0,"652":0,"653":0,"656":0,"657":0,"659":0,"660":0,"670":0,"681":0,"685":0,"686":0,"689":0,"690":0,"692":0,"693":0,"694":0,"706":0,"708":0,"709":0,"721":0,"723":0,"724":0,"736":0,"738":0,"739":0,"740":0,"752":0,"757":0,"761":0,"762":0,"763":0,"765":0,"766":0,"771":0,"775":0,"777":0,"778":0,"779":0,"791":0,"793":0,"794":0,"797":0,"799":0,"800":0,"801":0,"813":0,"815":0,"816":0,"817":0,"829":0,"840":0,"846":0,"847":0,"850":0,"851":0,"854":0,"855":0,"860":0,"861":0,"866":0,"880":0,"882":0,"884":0,"885":0,"888":0,"889":0,"901":0,"903":0,"905":0,"906":0,"909":0,"910":0,"922":0,"933":0,"935":0,"937":0,"938":0,"952":0,"954":0,"955":0,"956":0,"958":0,"960":0,"961":0,"973":0,"993":0};
_yuitest_coverage["build/menu/menu.js"].functions = {"initializer:68":0,"(anonymous 2):82":0,"destructor:76":0,"getHTMLNode:100":0,"hide:114":0,"render:128":0,"renderChildren:167":0,"renderNode:218":0,"reposition:303":0,"show:342":0,"toggle:363":0,"_attachMenuEvents:375":0,"_detachMenuEvents:414":0,"(anonymous 3):451":0,"_getAnchorRegion:448":0,"(anonymous 4):499":0,"_getSortedAnchorRegions:471":0,"_hideMenu:523":0,"_inRegion:546":0,"_positionMenu:577":0,"_afterAdd:608":0,"_afterClear:648":0,"_afterClickOutside:669":0,"_afterClose:680":0,"_afterDisable:705":0,"_afterEnable:720":0,"_afterHide:735":0,"_afterOpen:751":0,"_afterRemove:790":0,"_afterShow:812":0,"_afterVisibleChange:828":0,"_onItemClick:839":0,"(anonymous 5):888":0,"_onItemMouseEnter:879":0,"(anonymous 6):909":0,"_onItemMouseLeave:900":0,"_onMenuMouseEnter:921":0,"(anonymous 7):937":0,"_onMenuMouseLeave:932":0,"_defItemClickFn:951":0,"_defSpecificItemClickFn:972":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu/menu.js"].coveredLines = 226;
_yuitest_coverage["build/menu/menu.js"].coveredFunctions = 42;
_yuitest_coverline("build/menu/menu.js", 1);
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

_yuitest_coverfunc("build/menu/menu.js", "(anonymous 1)", 1);
_yuitest_coverline("build/menu/menu.js", 19);
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
        _yuitest_coverfunc("build/menu/menu.js", "initializer", 68);
_yuitest_coverline("build/menu/menu.js", 69);
this._openMenus = {};
        _yuitest_coverline("build/menu/menu.js", 70);
this._published = {};
        _yuitest_coverline("build/menu/menu.js", 71);
this._timeouts  = {};

        _yuitest_coverline("build/menu/menu.js", 73);
this._attachMenuEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/menu/menu.js", "destructor", 76);
_yuitest_coverline("build/menu/menu.js", 77);
this._detachMenuEvents();

        _yuitest_coverline("build/menu/menu.js", 79);
delete this._openMenus;
        _yuitest_coverline("build/menu/menu.js", 80);
delete this._published;

        _yuitest_coverline("build/menu/menu.js", 82);
Y.Object.each(this._timeouts, function (timeout) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 2)", 82);
_yuitest_coverline("build/menu/menu.js", 83);
clearTimeout(timeout);
        }, this);

        _yuitest_coverline("build/menu/menu.js", 86);
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
        _yuitest_coverfunc("build/menu/menu.js", "getHTMLNode", 100);
_yuitest_coverline("build/menu/menu.js", 101);
if (!item._htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 102);
item._htmlNode = this.get('container').one('#' + item.id);
        }

        _yuitest_coverline("build/menu/menu.js", 105);
return item._htmlNode;
    },

    /**
    Hides this menu.

    @method hide
    @chainable
    **/
    hide: function () {
        _yuitest_coverfunc("build/menu/menu.js", "hide", 114);
_yuitest_coverline("build/menu/menu.js", 115);
this.set('visible', false);
        _yuitest_coverline("build/menu/menu.js", 116);
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
        _yuitest_coverfunc("build/menu/menu.js", "render", 128);
_yuitest_coverline("build/menu/menu.js", 129);
var container = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 131);
container.addClass(this.classNames.menu);

        // Detect touchscreen devices.
        _yuitest_coverline("build/menu/menu.js", 134);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/menu/menu.js", 135);
container.addClass(this.classNames.touch);
        } else {
            _yuitest_coverline("build/menu/menu.js", 137);
container.addClass(this.classNames.noTouch);
        }

        _yuitest_coverline("build/menu/menu.js", 140);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/menu/menu.js", 144);
if (!container.inDoc()) {
            _yuitest_coverline("build/menu/menu.js", 145);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/menu/menu.js", 148);
this.rendered = true;

        _yuitest_coverline("build/menu/menu.js", 150);
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
        _yuitest_coverfunc("build/menu/menu.js", "renderChildren", 167);
_yuitest_coverline("build/menu/menu.js", 168);
options || (options = {});

        _yuitest_coverline("build/menu/menu.js", 170);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 173);
if (!childrenNode) {
            _yuitest_coverline("build/menu/menu.js", 174);
childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        _yuitest_coverline("build/menu/menu.js", 181);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/menu/menu.js", 182);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/menu/menu.js", 183);
childrenNode.set('role', 'menu');
        }

        _yuitest_coverline("build/menu/menu.js", 186);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/menu/menu.js", 187);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/menu/menu.js", 190);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 191);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/menu/menu.js", 197);
if (container) {
            _yuitest_coverline("build/menu/menu.js", 198);
container.append(childrenNode);
        }

        _yuitest_coverline("build/menu/menu.js", 201);
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
        _yuitest_coverfunc("build/menu/menu.js", "renderNode", 218);
_yuitest_coverline("build/menu/menu.js", 219);
options || (options = {});

        _yuitest_coverline("build/menu/menu.js", 221);
var classNames = this.classNames,
            htmlNode   = item._htmlNode,
            isHidden   = item.isHidden();

        // Create an HTML node for this menu item if one doesn't already exist.
        _yuitest_coverline("build/menu/menu.js", 226);
if (!htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 227);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        // Mark the HTML node as hidden if the item is hidden.
        _yuitest_coverline("build/menu/menu.js", 235);
htmlNode.set('aria-hidden', isHidden);
        _yuitest_coverline("build/menu/menu.js", 236);
htmlNode.toggleClass(classNames.hidden, isHidden);

        _yuitest_coverline("build/menu/menu.js", 238);
switch (item.type) {
            case 'separator':
                _yuitest_coverline("build/menu/menu.js", 240);
htmlNode.set('role', 'separator');
                _yuitest_coverline("build/menu/menu.js", 241);
break;

            case 'item':
            case 'heading':
                _yuitest_coverline("build/menu/menu.js", 245);
var labelNode = htmlNode.one('.' + classNames.label),
                    labelId   = labelNode.get('id');

                _yuitest_coverline("build/menu/menu.js", 248);
labelNode.setHTML(item.label);

                _yuitest_coverline("build/menu/menu.js", 250);
if (!labelId) {
                    _yuitest_coverline("build/menu/menu.js", 251);
labelId = Y.guid();
                    _yuitest_coverline("build/menu/menu.js", 252);
labelNode.set('id', labelId);
                }

                _yuitest_coverline("build/menu/menu.js", 255);
htmlNode.set('aria-labelledby', labelId);

                _yuitest_coverline("build/menu/menu.js", 257);
if (item.type === 'heading') {
                    _yuitest_coverline("build/menu/menu.js", 258);
htmlNode.set('role', 'heading');
                } else {
                    _yuitest_coverline("build/menu/menu.js", 260);
htmlNode.set('role', 'menuitem');

                    _yuitest_coverline("build/menu/menu.js", 262);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                    _yuitest_coverline("build/menu/menu.js", 264);
if (item.canHaveChildren) {
                        _yuitest_coverline("build/menu/menu.js", 265);
htmlNode.addClass(classNames.canHaveChildren);
                        _yuitest_coverline("build/menu/menu.js", 266);
htmlNode.toggleClass(classNames.open, item.isOpen());

                        _yuitest_coverline("build/menu/menu.js", 268);
if (item.hasChildren()) {
                            _yuitest_coverline("build/menu/menu.js", 269);
htmlNode.addClass(classNames.hasChildren);

                            _yuitest_coverline("build/menu/menu.js", 271);
if (options.renderChildren) {
                                _yuitest_coverline("build/menu/menu.js", 272);
this.renderChildren(item, {
                                    container: htmlNode
                                });
                            }
                        }
                    }
                }
                _yuitest_coverline("build/menu/menu.js", 279);
break;
        }

        _yuitest_coverline("build/menu/menu.js", 282);
if (options.container) {
            _yuitest_coverline("build/menu/menu.js", 283);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/menu/menu.js", 286);
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
        _yuitest_coverfunc("build/menu/menu.js", "reposition", 303);
_yuitest_coverline("build/menu/menu.js", 304);
var container = this.get('container'),
            anchorRegion, menuRegion;

        _yuitest_coverline("build/menu/menu.js", 307);
if (Y.Lang.isArray(anchorPoint)) {
            _yuitest_coverline("build/menu/menu.js", 308);
anchorRegion = {
                bottom: anchorPoint[1],
                left  : anchorPoint[0],
                right : anchorPoint[0],
                top   : anchorPoint[1]
            };
        } else {_yuitest_coverline("build/menu/menu.js", 314);
if (anchorPoint._node) {
            _yuitest_coverline("build/menu/menu.js", 315);
anchorRegion = anchorPoint.get('region');
        } else {
            _yuitest_coverline("build/menu/menu.js", 317);
anchorRegion = anchorPoint;
        }}

        _yuitest_coverline("build/menu/menu.js", 320);
menuRegion = this._getSortedAnchorRegions(
            ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],
            container.get('region'),
            anchorRegion
        )[0].region;

        _yuitest_coverline("build/menu/menu.js", 326);
container.setXY([menuRegion.left, menuRegion.top]);

        _yuitest_coverline("build/menu/menu.js", 328);
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
        _yuitest_coverfunc("build/menu/menu.js", "show", 342);
_yuitest_coverline("build/menu/menu.js", 343);
if (options && options.anchorPoint) {
            _yuitest_coverline("build/menu/menu.js", 344);
this.reposition(options.anchorPoint);
        }

        _yuitest_coverline("build/menu/menu.js", 347);
this.set('visible', true);
        _yuitest_coverline("build/menu/menu.js", 348);
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
        _yuitest_coverfunc("build/menu/menu.js", "toggle", 363);
_yuitest_coverline("build/menu/menu.js", 364);
return this[this.get('visible') ? 'hide' : 'show'](options);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches menu events.

    @method _attachMenuEvents
    @protected
    **/
    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_attachMenuEvents", 375);
_yuitest_coverline("build/menu/menu.js", 376);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/menu/menu.js", 378);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 381);
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
        _yuitest_coverfunc("build/menu/menu.js", "_detachMenuEvents", 414);
_yuitest_coverline("build/menu/menu.js", 415);
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
        _yuitest_coverfunc("build/menu/menu.js", "_getAnchorRegion", 448);
_yuitest_coverline("build/menu/menu.js", 449);
var region = {};

        _yuitest_coverline("build/menu/menu.js", 451);
anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 3)", 451);
_yuitest_coverline("build/menu/menu.js", 452);
var lookup = {
                    b: 'bottom',
                    l: 'left',
                    r: 'right',
                    t: 'top'
                };

            _yuitest_coverline("build/menu/menu.js", 459);
region[lookup[p1]] = parentRegion[lookup[p3]];
            _yuitest_coverline("build/menu/menu.js", 460);
region[lookup[p2]] = parentRegion[lookup[p4]];
        });

        _yuitest_coverline("build/menu/menu.js", 463);
'bottom' in region || (region.bottom = region.top + nodeRegion.height);
        _yuitest_coverline("build/menu/menu.js", 464);
'left' in region   || (region.left = region.right - nodeRegion.width);
        _yuitest_coverline("build/menu/menu.js", 465);
'right' in region  || (region.right = region.left + nodeRegion.width);
        _yuitest_coverline("build/menu/menu.js", 466);
'top' in region    || (region.top = region.bottom - nodeRegion.height);

        _yuitest_coverline("build/menu/menu.js", 468);
return region;
    },

    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {
        _yuitest_coverfunc("build/menu/menu.js", "_getSortedAnchorRegions", 471);
_yuitest_coverline("build/menu/menu.js", 472);
containerRegion || (containerRegion = Y.DOM.viewportRegion());

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        _yuitest_coverline("build/menu/menu.js", 477);
var anchors = [],
            i, len, point, region;

        _yuitest_coverline("build/menu/menu.js", 480);
for (i = 0, len = points.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 481);
point = points[i];

            // Allow arrays of strings or arrays of objects like {point: '...'}.
            _yuitest_coverline("build/menu/menu.js", 484);
if (point.point) {
                _yuitest_coverline("build/menu/menu.js", 485);
point = point.point;
            }

            _yuitest_coverline("build/menu/menu.js", 488);
region = this._getAnchorRegion(point, nodeRegion, parentRegion);

            _yuitest_coverline("build/menu/menu.js", 490);
anchors.push({
                point : point,
                region: region,
                score : this._inRegion(region, containerRegion)
            });
        }

        // Sort the anchors in descending order by score (higher score is
        // better).
        _yuitest_coverline("build/menu/menu.js", 499);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 4)", 499);
_yuitest_coverline("build/menu/menu.js", 500);
if (a.score === b.score) {
                _yuitest_coverline("build/menu/menu.js", 501);
return 0;
            } else {_yuitest_coverline("build/menu/menu.js", 502);
if (a.score === true) {
                _yuitest_coverline("build/menu/menu.js", 503);
return -1;
            } else {_yuitest_coverline("build/menu/menu.js", 504);
if (b.score === true) {
                _yuitest_coverline("build/menu/menu.js", 505);
return 1;
            } else {
                _yuitest_coverline("build/menu/menu.js", 507);
return b.score - a.score;
            }}}
        });

        // Return the sorted anchors.
        _yuitest_coverline("build/menu/menu.js", 512);
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
        _yuitest_coverfunc("build/menu/menu.js", "_hideMenu", 523);
_yuitest_coverline("build/menu/menu.js", 524);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 526);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 528);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/menu/menu.js", 529);
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
        _yuitest_coverfunc("build/menu/menu.js", "_inRegion", 546);
_yuitest_coverline("build/menu/menu.js", 547);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/menu/menu.js", 553);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/menu/menu.js", 559);
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
        _yuitest_coverfunc("build/menu/menu.js", "_positionMenu", 577);
_yuitest_coverline("build/menu/menu.js", 578);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 580);
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
        _yuitest_coverline("build/menu/menu.js", 592);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/menu/menu.js", 595);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/menu/menu.js", 596);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterAdd", 608);
_yuitest_coverline("build/menu/menu.js", 610);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 611);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 614);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/menu/menu.js", 618);
if (parent === this.rootNode) {
            _yuitest_coverline("build/menu/menu.js", 619);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/menu/menu.js", 621);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/menu/menu.js", 622);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/menu/menu.js", 624);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/menu/menu.js", 627);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/menu/menu.js", 629);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/menu/menu.js", 633);
return;
            }
        }

        _yuitest_coverline("build/menu/menu.js", 637);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterClear", 648);
_yuitest_coverline("build/menu/menu.js", 649);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/menu/menu.js", 652);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 653);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 656);
delete this._childrenNode;
        _yuitest_coverline("build/menu/menu.js", 657);
this.rendered = false;

        _yuitest_coverline("build/menu/menu.js", 659);
this.get('container').empty();
        _yuitest_coverline("build/menu/menu.js", 660);
this.render();
    },

    /**
    Handles `clickoutside` events for this menu.

    @method _afterClickOutside
    @protected
    **/
    _afterClickOutside: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClickOutside", 669);
_yuitest_coverline("build/menu/menu.js", 670);
this.closeSubMenus();
    },

    /**
    Handles `close` events for this menu.

    @method _afterClose
    @param {EventFacade} e
    @protected
    **/
    _afterClose: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClose", 680);
_yuitest_coverline("build/menu/menu.js", 681);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/menu/menu.js", 685);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 686);
item.children[i].close();
        }

        _yuitest_coverline("build/menu/menu.js", 689);
item.close();
        _yuitest_coverline("build/menu/menu.js", 690);
delete this._openMenus[item.id];

        _yuitest_coverline("build/menu/menu.js", 692);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 693);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 694);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterDisable", 705);
_yuitest_coverline("build/menu/menu.js", 706);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/menu/menu.js", 708);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 709);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterEnable", 720);
_yuitest_coverline("build/menu/menu.js", 721);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/menu/menu.js", 723);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 724);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterHide", 735);
_yuitest_coverline("build/menu/menu.js", 736);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/menu/menu.js", 738);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 739);
htmlNode.addClass(this.classNames.hidden);
            _yuitest_coverline("build/menu/menu.js", 740);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterOpen", 751);
_yuitest_coverline("build/menu/menu.js", 752);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/menu/menu.js", 757);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/menu/menu.js", 761);
if (parent.isOpen()) {
                _yuitest_coverline("build/menu/menu.js", 762);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/menu/menu.js", 763);
child = parent.children[i];

                    _yuitest_coverline("build/menu/menu.js", 765);
if (child !== item) {
                        _yuitest_coverline("build/menu/menu.js", 766);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/menu/menu.js", 771);
parent.open();
            }
        }

        _yuitest_coverline("build/menu/menu.js", 775);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/menu/menu.js", 777);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 778);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 779);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterRemove", 790);
_yuitest_coverline("build/menu/menu.js", 791);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/menu/menu.js", 793);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 794);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 797);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/menu/menu.js", 799);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 800);
htmlNode.remove(true);
            _yuitest_coverline("build/menu/menu.js", 801);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterShow", 812);
_yuitest_coverline("build/menu/menu.js", 813);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/menu/menu.js", 815);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 816);
htmlNode.removeClass(this.classNames.hidden);
            _yuitest_coverline("build/menu/menu.js", 817);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterVisibleChange", 828);
_yuitest_coverline("build/menu/menu.js", 829);
this.get('container').toggleClass(this.classNames.open, e.newVal);
    },

    /**
    Handles click events on menu items.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
    _onItemClick: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemClick", 839);
_yuitest_coverline("build/menu/menu.js", 840);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            eventName  = EVT_ITEM_CLICK + '#' + item.id,
            isDisabled = item.isDisabled() || item.isHidden();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/menu/menu.js", 846);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/menu/menu.js", 847);
e.preventDefault();
        }

        _yuitest_coverline("build/menu/menu.js", 850);
if (isDisabled) {
            _yuitest_coverline("build/menu/menu.js", 851);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 854);
if (!this._published[eventName]) {
            _yuitest_coverline("build/menu/menu.js", 855);
this._published[eventName] = this.publish(eventName, {
                defaultFn: this._defSpecificItemClickFn
            }) ;
        }

        _yuitest_coverline("build/menu/menu.js", 860);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/menu/menu.js", 861);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defItemClickFn
            });
        }

        _yuitest_coverline("build/menu/menu.js", 866);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseEnter", 879);
_yuitest_coverline("build/menu/menu.js", 880);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/menu/menu.js", 882);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 884);
if (item.isOpen() || item.isDisabled()) {
            _yuitest_coverline("build/menu/menu.js", 885);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 888);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 5)", 888);
_yuitest_coverline("build/menu/menu.js", 889);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseLeave", 900);
_yuitest_coverline("build/menu/menu.js", 901);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/menu/menu.js", 903);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 905);
if (!item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 906);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 909);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 6)", 909);
_yuitest_coverline("build/menu/menu.js", 910);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseEnter", 921);
_yuitest_coverline("build/menu/menu.js", 922);
clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseLeave", 932);
_yuitest_coverline("build/menu/menu.js", 933);
var self = this;

        _yuitest_coverline("build/menu/menu.js", 935);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/menu/menu.js", 937);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 7)", 937);
_yuitest_coverline("build/menu/menu.js", 938);
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
        _yuitest_coverfunc("build/menu/menu.js", "_defItemClickFn", 951);
_yuitest_coverline("build/menu/menu.js", 952);
var item = e.item;

        _yuitest_coverline("build/menu/menu.js", 954);
if (item.canHaveChildren) {
            _yuitest_coverline("build/menu/menu.js", 955);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/menu/menu.js", 956);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/menu/menu.js", 958);
e.item.toggle();
        } else {
            _yuitest_coverline("build/menu/menu.js", 960);
this.closeSubMenus();
            _yuitest_coverline("build/menu/menu.js", 961);
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
        _yuitest_coverfunc("build/menu/menu.js", "_defSpecificItemClickFn", 972);
_yuitest_coverline("build/menu/menu.js", 973);
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

_yuitest_coverline("build/menu/menu.js", 993);
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
