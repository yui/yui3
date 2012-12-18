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
_yuitest_coverage["build/menu/menu.js"].code=["YUI.add('menu', function (Y, NAME) {","","/**","Provides the `Y.Menu` widget.","","@module menu","@main menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@extends Menu.Base","@uses View","**/","","var getClassName = Y.ClassNameManager.getClassName,","","/**","Fired when any clickable menu item is clicked.","","You can subscribe to clicks on a specific menu item by subscribing to","\"itemClick#id\", where \"id\" is the item id of the item you want to subscribe to.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defItemClickFn","**/","EVT_ITEM_CLICK = 'itemClick',","","Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        hidden         : getClassName('menu-hidden'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Hides this menu.","","    @method hide","    @chainable","    **/","    hide: function () {","        this.set('visible', false);","        return this;","    },","","    /**","    Renders this menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode,","            isHidden   = item.isHidden();","","        // Create an HTML node for this menu item if one doesn't already exist.","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        // Mark the HTML node as hidden if the item is hidden.","        htmlNode.set('aria-hidden', isHidden);","        htmlNode.toggleClass(classNames.hidden, isHidden);","","        switch (item.type) {","            case 'separator':","                htmlNode.set('role', 'separator');","                break;","","            case 'item':","            case 'heading':","                var labelNode = htmlNode.one('.' + classNames.label),","                    labelId   = labelNode.get('id');","","                labelNode.setHTML(item.label);","","                if (!labelId) {","                    labelId = Y.guid();","                    labelNode.set('id', labelId);","                }","","                htmlNode.set('aria-labelledby', labelId);","","                if (item.type === 'heading') {","                    htmlNode.set('role', 'heading');","                } else {","                    htmlNode.set('role', 'menuitem');","","                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                    if (item.canHaveChildren) {","                        htmlNode.addClass(classNames.canHaveChildren);","                        htmlNode.toggleClass(classNames.open, item.isOpen());","","                        if (item.hasChildren()) {","                            htmlNode.addClass(classNames.hasChildren);","","                            if (options.renderChildren) {","                                this.renderChildren(item, {","                                    container: htmlNode","                                });","                            }","                        }","                    }","                }","                break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    /**","    Repositions this menu so that it is anchored to a specified node, region, or","    set of pixel coordinates.","","    The menu will be displayed at the most advantageous position relative to the","    anchor point to ensure that as much of the menu as possible is visible","    within the viewport.","","    @method reposition","    @param {Node|Number[]|Object} anchorPoint Anchor point at which this menu","        should be positioned. The point may be specified as a `Y.Node`","        reference, a region object, or an array of X and Y pixel coordinates.","    @chainable","    **/","    reposition: function (anchorPoint) {","        var container = this.get('container'),","            anchorRegion, menuRegion;","","        if (Y.Lang.isArray(anchorPoint)) {","            anchorRegion = {","                bottom: anchorPoint[1],","                left  : anchorPoint[0],","                right : anchorPoint[0],","                top   : anchorPoint[1]","            };","        } else if (anchorPoint._node) {","            anchorRegion = anchorPoint.get('region');","        } else {","            anchorRegion = anchorPoint;","        }","","        menuRegion = this._getSortedAnchorRegions(","            this.get('alignments'),","            container.get('region'),","            anchorRegion","        )[0].region;","","        container.setXY([menuRegion.left, menuRegion.top]);","","        return this;","    },","","    /**","    Shows this menu.","","    @method show","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    show: function (options) {","        if (options && options.anchorPoint) {","            this.reposition(options.anchorPoint);","        }","","        this.set('visible', true);","        return this;","    },","","    /**","    Toggles the visibility of this menu, showing it if it's currently hidden or","    hiding it if it's currently visible.","","    @method toggle","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    toggle: function (options) {","        return this[this.get('visible') ? 'hide' : 'show'](options);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches menu events.","","    @method _attachMenuEvents","    @protected","    **/","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add          : this._afterAdd,","                clear        : this._afterClear,","                close        : this._afterClose,","                disable      : this._afterDisable,","                enable       : this._afterEnable,","                hide         : this._afterHide,","                open         : this._afterOpen,","                remove       : this._afterRemove,","                show         : this._afterShow,","                visibleChange: this._afterVisibleChange","            }),","","            container.on('hover', this._onMenuMouseEnter, this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick, '.' + classNames.item + '>.' + classNames.label, this),","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave, '.' + classNames.canHaveChildren, this),","","            Y.one('doc').after('mousedown', this._afterDocMouseDown, this)","        );","    },","","    /**","    Detaches menu events.","","    @method _detachMenuEvents","    @protected","    **/","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    /**","    Returns an efficient test function that can be passed to `Y.Node#ancestor()`","    to test whether a node is this menu's container.","","    This is broken out to make overriding easier in subclasses.","","    @method _getAncestorTestFn","    @return {Function} Test function.","    @protected","    **/","    _getAncestorTestFn: function () {","        var container = this.get('container');","","        return (function (node) {","            return node === container;","        });","    },","","    /**","    Given an anchor point and the regions currently occupied by a child node","    (the node being anchored) and a parent node (the node being anchored to),","    returns a region object representing the coordinates the anchored node will","    occupy when anchored to the given point on the parent.","","    An anchor point is a string like \"tl-bl\", which means \"anchor the top left","    point of _nodeRegion_ to the bottom left point of _parentRegion_\".","","    Any combination of top/bottom/left/right anchor points may be used as long","    as they follow this format. Here are a few examples:","","      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of","        _parentRegion_.","      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of","        _parentRegion_.","      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of","        _parentRegion_.","      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of","        _parentRegion_.","","    @method _getAnchorRegion","    @param {String} anchor Anchor point. See above for details.","    @param {Object} nodeRegion Region object for the node to be anchored (that","        is, the node that will be repositioned).","    @param {Object} parentRegion Region object for the node that will be","        anchored to (that is, the node that will not move).","    @return {Object} Region that will be occupied by the anchored node.","    @protected","    **/","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        var region = {};","","        anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {","            var lookup = {","                    b: 'bottom',","                    l: 'left',","                    r: 'right',","                    t: 'top'","                };","","            region[lookup[p1]] = parentRegion[lookup[p3]];","            region[lookup[p2]] = parentRegion[lookup[p4]];","        });","","        'bottom' in region || (region.bottom = region.top + nodeRegion.height);","        'left' in region   || (region.left = region.right - nodeRegion.width);","        'right' in region  || (region.right = region.left + nodeRegion.width);","        'top' in region    || (region.top = region.bottom - nodeRegion.height);","","        return region;","    },","","    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {","        containerRegion || (containerRegion = Y.DOM.viewportRegion());","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchors = [],","            i, len, point, region;","","        for (i = 0, len = points.length; i < len; i++) {","            point = points[i];","","            // Allow arrays of strings or arrays of objects like {point: '...'}.","            if (point.point) {","                point = point.point;","            }","","            region = this._getAnchorRegion(point, nodeRegion, parentRegion);","","            anchors.push({","                point : point,","                region: region,","                score : this._inRegion(region, containerRegion)","            });","        }","","        // Sort the anchors in descending order by score (higher score is","        // better).","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Return the sorted anchors.","        return anchors;","    },","","    /**","    Hides the specified menu container by moving its htmlNode offscreen.","","    @method _hideMenu","    @param {Menu.Item} item Menu item.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    /**","    Returns `true` if the given _inner_ region is contained entirely within the","    given _outer_ region. If it's not a perfect fit, returns a numerical score","    indicating how much of the _inner_ region fits within the _outer_ region.","    A higher score indicates a better fit.","","    @method _inRegion","    @param {Object} inner Inner region.","    @param {Object} outer Outer region.","    @return {Boolean|Number} `true` if the _inner_ region fits entirely within","        the _outer_ region or, if not, a numerical score indicating how much of","        the inner region fits.","    @protected","    **/","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    /**","    Intelligently positions the _htmlNode_ of the given submenu _item_ relative","    to its parent so that as much as possible of the submenu will be visible","    within the viewport.","","    @method _positionMenu","    @param {Menu.Item} item Menu item to position.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children),","","            anchors = this._getSortedAnchorRegions(","                (item.parent && item.parent.data.menuAnchors) || this.get('subMenuAlignments'),","                childrenNode.get('region'),","                htmlNode.get('region')","            );","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `add` events for this menu.","","    @method _afterAdd","    @param {EventFacade} e","    @protected","    **/","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    /**","    Handles `clear` events for this menu.","","    @method _afterClear","    @protected","    **/","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    /**","    Handles `mousedown` events on the document.","","    @method _afterDocMouseDown","    @param {EventFacade} e","    @protected","    **/","    _afterDocMouseDown: function (e) {","        if (!this.get('visible')) {","            return;","        }","","        if (!e.target.ancestor(this._getAncestorTestFn(), true)) {","            this.closeSubMenus();","","            if (this.get('hideOnOutsideClick')) {","                this.hide();","            }","        }","    },","","    /**","    Handles `close` events for this menu.","","    @method _afterClose","    @param {EventFacade} e","    @protected","    **/","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    /**","    Handles `disable` events for this menu.","","    @method _afterDisable","    @param {EventFacade} e","    @protected","    **/","    _afterDisable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `enable` events for this menu.","","    @method _afterEnable","    @param {EventFacade} e","    @protected","    **/","    _afterEnable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `hide` events for this menu.","","    @method _afterHide","    @param {EventFacade} e","    @protected","    **/","    _afterHide: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', true);","        }","    },","","    /**","    Handles `open` events for this menu.","","    @method _afterOpen","    @param {EventFacade} e","    @protected","    **/","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    /**","    Handles `remove` events for this menu.","","    @method _afterRemove","    @param {EventFacade} e","    @protected","    **/","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    /**","    Handles `show` events for this menu.","","    @method _afterShow","    @param {EventFacade} e","    @protected","    **/","    _afterShow: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', false);","        }","    },","","    /**","    Handles `visibleChange` events for this menu.","","    @method _afterVisibleChange","    @param {EventFacade} e","    @protected","    **/","    _afterVisibleChange: function (e) {","        this.get('container').toggleClass(this.classNames.open, e.newVal);","    },","","    /**","    Handles click events on menu items.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            eventName  = EVT_ITEM_CLICK + '#' + item.id,","            isDisabled = item.isDisabled() || item.isHidden();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[eventName]) {","            this._published[eventName] = this.publish(eventName, {","                defaultFn: this._defSpecificItemClickFn","            }) ;","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defItemClickFn","            });","        }","","        this.fire(eventName, {","            originEvent: e,","            item       : item","        });","    },","","    /**","    Handles delegated `mouseenter` events on menu items.","","    @method _onItemMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen() || item.isDisabled()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    /**","    Handles delegated `mouseleave` events on menu items.","","    @method _onItemMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    /**","    Handles `mouseenter` events on this menu.","","    @method _onMenuMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    /**","    Handles `mouseleave` events on this menu.","","    @method _onMenuMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","","            if (self.get('hideOnMouseLeave')) {","                self.hide();","            }","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the generic `itemClick` event.","","    @method _defItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defItemClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggle();","        } else {","            this.closeSubMenus();","            this.hide();","        }","    },","","    /**","    Default handler for item-specific `itemClick#<id>` events.","","    @method _defSpecificItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defSpecificItemClickFn: function (e) {","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e.originEvent,","            item       : e.item","        });","    }","}, {","    ATTRS: {","        /**","        Preferred alignment positions at which this menu should be displayed","        relative to the anchor point when one is provided to the `show()`,","        `toggle()`, or `reposition()` methods.","","        The most optimal alignment position will be chosen automatically based","        on which one allows the most of this menu to be visible within the","        browser's viewport. If multiple positions are equally visible, then the","        optimal position will be chosen based on its order in this array.","","        An alignment position is a string like \"tl-bl\", which means \"align the","        top left of this menu to the bottom left of its anchor point\".","","        Any combination of top/bottom/left/right alignment positions may be used","        as long as they follow this format. Here are a few examples:","","          * `'bl-br'`: Align the bottom left of this menu with the bottom right","            of the anchor point.","          * `'br-bl'`: Align the bottom right of this menu with the bottom left","            of the anchor point.","          * `'tl-tr'`: Align the top left of this menu with the top right of","            the anchor point.","          * `'tr-tl'`: Align the top right of this menu to the top left of this","            anchor point.","","        @attribute {String[]} alignments","        @default ['tl-bl', 'tr-br', 'bl-tl', 'br-tr']","        **/","        alignments: {","            valueFn: function () {","                return ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];","            }","        },","","        /**","        If `true`, this menu will be hidden when the user moves the mouse","        outside the menu.","","        @attribute {Boolean} hideOnMouseLeave","        @default false","        **/","        hideOnMouseLeave: {","            value: false","        },","","        /**","        If `true`, this menu will be hidden when the user clicks somewhere","        outside the menu.","","        @attribute {Boolean} hideOnOutsideClick","        @default true","        **/","        hideOnOutsideClick: {","            value: true","        },","","        /**","        Just like `alignments`, but for submenus of this menu. See the","        `alignments` attribute for details on how alignment positions work.","","        @attribute {String[]} subMenuAlignments","        @default ['tl-tr', 'bl-br', 'tr-tl', 'br-bl']","        **/","        subMenuAlignments: {","            valueFn: function () {","                return ['tl-tr', 'bl-br', 'tr-tl', 'br-bl'];","            }","        },","","        /**","        Whether or not this menu is visible. Changing this attribute's value","        will also change the visibility of this menu.","","        @attribute {Boolean} visible","        @default false","        **/","        visible: {","            value: false","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {","    \"requires\": [","        \"classnamemanager\",","        \"event-hover\",","        \"menu-base\",","        \"menu-templates\",","        \"node-screen\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/menu/menu.js"].lines = {"1":0,"19":0,"69":0,"70":0,"71":0,"73":0,"77":0,"79":0,"80":0,"82":0,"83":0,"86":0,"101":0,"102":0,"105":0,"115":0,"116":0,"129":0,"131":0,"134":0,"135":0,"137":0,"140":0,"144":0,"145":0,"148":0,"150":0,"168":0,"170":0,"173":0,"174":0,"181":0,"182":0,"183":0,"186":0,"187":0,"190":0,"191":0,"197":0,"198":0,"201":0,"219":0,"221":0,"226":0,"227":0,"235":0,"236":0,"238":0,"240":0,"241":0,"245":0,"248":0,"250":0,"251":0,"252":0,"255":0,"257":0,"258":0,"260":0,"262":0,"264":0,"265":0,"266":0,"268":0,"269":0,"271":0,"272":0,"279":0,"282":0,"283":0,"286":0,"304":0,"307":0,"308":0,"314":0,"315":0,"317":0,"320":0,"326":0,"328":0,"343":0,"344":0,"347":0,"348":0,"364":0,"376":0,"378":0,"381":0,"411":0,"425":0,"427":0,"428":0,"463":0,"465":0,"466":0,"473":0,"474":0,"477":0,"478":0,"479":0,"480":0,"482":0,"486":0,"491":0,"494":0,"495":0,"498":0,"499":0,"502":0,"504":0,"513":0,"514":0,"515":0,"516":0,"517":0,"518":0,"519":0,"521":0,"526":0,"538":0,"540":0,"542":0,"543":0,"561":0,"567":0,"573":0,"592":0,"594":0,"604":0,"607":0,"608":0,"622":0,"623":0,"626":0,"630":0,"631":0,"633":0,"634":0,"636":0,"639":0,"641":0,"645":0,"649":0,"661":0,"664":0,"665":0,"668":0,"669":0,"671":0,"672":0,"683":0,"684":0,"687":0,"688":0,"690":0,"691":0,"704":0,"708":0,"709":0,"712":0,"713":0,"715":0,"716":0,"717":0,"729":0,"731":0,"732":0,"744":0,"746":0,"747":0,"759":0,"761":0,"762":0,"763":0,"775":0,"780":0,"784":0,"785":0,"786":0,"788":0,"789":0,"794":0,"798":0,"800":0,"801":0,"802":0,"814":0,"816":0,"817":0,"820":0,"822":0,"823":0,"824":0,"836":0,"838":0,"839":0,"840":0,"852":0,"863":0,"869":0,"870":0,"873":0,"874":0,"877":0,"878":0,"883":0,"884":0,"889":0,"903":0,"905":0,"907":0,"908":0,"911":0,"912":0,"924":0,"926":0,"928":0,"929":0,"932":0,"933":0,"945":0,"956":0,"958":0,"960":0,"961":0,"963":0,"964":0,"979":0,"981":0,"982":0,"983":0,"985":0,"987":0,"988":0,"1000":0,"1037":0,"1072":0,"1089":0};
_yuitest_coverage["build/menu/menu.js"].functions = {"initializer:68":0,"(anonymous 2):82":0,"destructor:76":0,"getHTMLNode:100":0,"hide:114":0,"render:128":0,"renderChildren:167":0,"renderNode:218":0,"reposition:303":0,"show:342":0,"toggle:363":0,"_attachMenuEvents:375":0,"_detachMenuEvents:410":0,"(anonymous 3):427":0,"_getAncestorTestFn:424":0,"(anonymous 4):465":0,"_getAnchorRegion:462":0,"(anonymous 5):513":0,"_getSortedAnchorRegions:485":0,"_hideMenu:537":0,"_inRegion:560":0,"_positionMenu:591":0,"_afterAdd:620":0,"_afterClear:660":0,"_afterDocMouseDown:682":0,"_afterClose:703":0,"_afterDisable:728":0,"_afterEnable:743":0,"_afterHide:758":0,"_afterOpen:774":0,"_afterRemove:813":0,"_afterShow:835":0,"_afterVisibleChange:851":0,"_onItemClick:862":0,"(anonymous 6):911":0,"_onItemMouseEnter:902":0,"(anonymous 7):932":0,"_onItemMouseLeave:923":0,"_onMenuMouseEnter:944":0,"(anonymous 8):960":0,"_onMenuMouseLeave:955":0,"_defItemClickFn:978":0,"_defSpecificItemClickFn:999":0,"valueFn:1036":0,"valueFn:1071":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu/menu.js"].coveredLines = 238;
_yuitest_coverage["build/menu/menu.js"].coveredFunctions = 46;
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
            this.get('alignments'),
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

            container.on('hover', this._onMenuMouseEnter, this._onMenuMouseLeave, this),

            container.delegate('click', this._onItemClick, '.' + classNames.item + '>.' + classNames.label, this),
            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave, '.' + classNames.canHaveChildren, this),

            Y.one('doc').after('mousedown', this._afterDocMouseDown, this)
        );
    },

    /**
    Detaches menu events.

    @method _detachMenuEvents
    @protected
    **/
    _detachMenuEvents: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_detachMenuEvents", 410);
_yuitest_coverline("build/menu/menu.js", 411);
(new Y.EventHandle(this._menuEvents)).detach();
    },

    /**
    Returns an efficient test function that can be passed to `Y.Node#ancestor()`
    to test whether a node is this menu's container.

    This is broken out to make overriding easier in subclasses.

    @method _getAncestorTestFn
    @return {Function} Test function.
    @protected
    **/
    _getAncestorTestFn: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_getAncestorTestFn", 424);
_yuitest_coverline("build/menu/menu.js", 425);
var container = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 427);
return (function (node) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 3)", 427);
_yuitest_coverline("build/menu/menu.js", 428);
return node === container;
        });
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
        _yuitest_coverfunc("build/menu/menu.js", "_getAnchorRegion", 462);
_yuitest_coverline("build/menu/menu.js", 463);
var region = {};

        _yuitest_coverline("build/menu/menu.js", 465);
anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 4)", 465);
_yuitest_coverline("build/menu/menu.js", 466);
var lookup = {
                    b: 'bottom',
                    l: 'left',
                    r: 'right',
                    t: 'top'
                };

            _yuitest_coverline("build/menu/menu.js", 473);
region[lookup[p1]] = parentRegion[lookup[p3]];
            _yuitest_coverline("build/menu/menu.js", 474);
region[lookup[p2]] = parentRegion[lookup[p4]];
        });

        _yuitest_coverline("build/menu/menu.js", 477);
'bottom' in region || (region.bottom = region.top + nodeRegion.height);
        _yuitest_coverline("build/menu/menu.js", 478);
'left' in region   || (region.left = region.right - nodeRegion.width);
        _yuitest_coverline("build/menu/menu.js", 479);
'right' in region  || (region.right = region.left + nodeRegion.width);
        _yuitest_coverline("build/menu/menu.js", 480);
'top' in region    || (region.top = region.bottom - nodeRegion.height);

        _yuitest_coverline("build/menu/menu.js", 482);
return region;
    },

    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {
        _yuitest_coverfunc("build/menu/menu.js", "_getSortedAnchorRegions", 485);
_yuitest_coverline("build/menu/menu.js", 486);
containerRegion || (containerRegion = Y.DOM.viewportRegion());

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        _yuitest_coverline("build/menu/menu.js", 491);
var anchors = [],
            i, len, point, region;

        _yuitest_coverline("build/menu/menu.js", 494);
for (i = 0, len = points.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 495);
point = points[i];

            // Allow arrays of strings or arrays of objects like {point: '...'}.
            _yuitest_coverline("build/menu/menu.js", 498);
if (point.point) {
                _yuitest_coverline("build/menu/menu.js", 499);
point = point.point;
            }

            _yuitest_coverline("build/menu/menu.js", 502);
region = this._getAnchorRegion(point, nodeRegion, parentRegion);

            _yuitest_coverline("build/menu/menu.js", 504);
anchors.push({
                point : point,
                region: region,
                score : this._inRegion(region, containerRegion)
            });
        }

        // Sort the anchors in descending order by score (higher score is
        // better).
        _yuitest_coverline("build/menu/menu.js", 513);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 5)", 513);
_yuitest_coverline("build/menu/menu.js", 514);
if (a.score === b.score) {
                _yuitest_coverline("build/menu/menu.js", 515);
return 0;
            } else {_yuitest_coverline("build/menu/menu.js", 516);
if (a.score === true) {
                _yuitest_coverline("build/menu/menu.js", 517);
return -1;
            } else {_yuitest_coverline("build/menu/menu.js", 518);
if (b.score === true) {
                _yuitest_coverline("build/menu/menu.js", 519);
return 1;
            } else {
                _yuitest_coverline("build/menu/menu.js", 521);
return b.score - a.score;
            }}}
        });

        // Return the sorted anchors.
        _yuitest_coverline("build/menu/menu.js", 526);
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
        _yuitest_coverfunc("build/menu/menu.js", "_hideMenu", 537);
_yuitest_coverline("build/menu/menu.js", 538);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 540);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 542);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/menu/menu.js", 543);
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
        _yuitest_coverfunc("build/menu/menu.js", "_inRegion", 560);
_yuitest_coverline("build/menu/menu.js", 561);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/menu/menu.js", 567);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/menu/menu.js", 573);
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
        _yuitest_coverfunc("build/menu/menu.js", "_positionMenu", 591);
_yuitest_coverline("build/menu/menu.js", 592);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 594);
var childrenNode = htmlNode.one('.' + this.classNames.children),

            anchors = this._getSortedAnchorRegions(
                (item.parent && item.parent.data.menuAnchors) || this.get('subMenuAlignments'),
                childrenNode.get('region'),
                htmlNode.get('region')
            );

        // Remember which anchors we used for this item so that we can default
        // that anchor for submenus of this item if necessary.
        _yuitest_coverline("build/menu/menu.js", 604);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/menu/menu.js", 607);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/menu/menu.js", 608);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterAdd", 620);
_yuitest_coverline("build/menu/menu.js", 622);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 623);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 626);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/menu/menu.js", 630);
if (parent === this.rootNode) {
            _yuitest_coverline("build/menu/menu.js", 631);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/menu/menu.js", 633);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/menu/menu.js", 634);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/menu/menu.js", 636);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/menu/menu.js", 639);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/menu/menu.js", 641);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/menu/menu.js", 645);
return;
            }
        }

        _yuitest_coverline("build/menu/menu.js", 649);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterClear", 660);
_yuitest_coverline("build/menu/menu.js", 661);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/menu/menu.js", 664);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 665);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 668);
delete this._childrenNode;
        _yuitest_coverline("build/menu/menu.js", 669);
this.rendered = false;

        _yuitest_coverline("build/menu/menu.js", 671);
this.get('container').empty();
        _yuitest_coverline("build/menu/menu.js", 672);
this.render();
    },

    /**
    Handles `mousedown` events on the document.

    @method _afterDocMouseDown
    @param {EventFacade} e
    @protected
    **/
    _afterDocMouseDown: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterDocMouseDown", 682);
_yuitest_coverline("build/menu/menu.js", 683);
if (!this.get('visible')) {
            _yuitest_coverline("build/menu/menu.js", 684);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 687);
if (!e.target.ancestor(this._getAncestorTestFn(), true)) {
            _yuitest_coverline("build/menu/menu.js", 688);
this.closeSubMenus();

            _yuitest_coverline("build/menu/menu.js", 690);
if (this.get('hideOnOutsideClick')) {
                _yuitest_coverline("build/menu/menu.js", 691);
this.hide();
            }
        }
    },

    /**
    Handles `close` events for this menu.

    @method _afterClose
    @param {EventFacade} e
    @protected
    **/
    _afterClose: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClose", 703);
_yuitest_coverline("build/menu/menu.js", 704);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/menu/menu.js", 708);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 709);
item.children[i].close();
        }

        _yuitest_coverline("build/menu/menu.js", 712);
item.close();
        _yuitest_coverline("build/menu/menu.js", 713);
delete this._openMenus[item.id];

        _yuitest_coverline("build/menu/menu.js", 715);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 716);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 717);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterDisable", 728);
_yuitest_coverline("build/menu/menu.js", 729);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/menu/menu.js", 731);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 732);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterEnable", 743);
_yuitest_coverline("build/menu/menu.js", 744);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/menu/menu.js", 746);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 747);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterHide", 758);
_yuitest_coverline("build/menu/menu.js", 759);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/menu/menu.js", 761);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 762);
htmlNode.addClass(this.classNames.hidden);
            _yuitest_coverline("build/menu/menu.js", 763);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterOpen", 774);
_yuitest_coverline("build/menu/menu.js", 775);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/menu/menu.js", 780);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/menu/menu.js", 784);
if (parent.isOpen()) {
                _yuitest_coverline("build/menu/menu.js", 785);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/menu/menu.js", 786);
child = parent.children[i];

                    _yuitest_coverline("build/menu/menu.js", 788);
if (child !== item) {
                        _yuitest_coverline("build/menu/menu.js", 789);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/menu/menu.js", 794);
parent.open();
            }
        }

        _yuitest_coverline("build/menu/menu.js", 798);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/menu/menu.js", 800);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 801);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 802);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterRemove", 813);
_yuitest_coverline("build/menu/menu.js", 814);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/menu/menu.js", 816);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 817);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 820);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/menu/menu.js", 822);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 823);
htmlNode.remove(true);
            _yuitest_coverline("build/menu/menu.js", 824);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterShow", 835);
_yuitest_coverline("build/menu/menu.js", 836);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/menu/menu.js", 838);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 839);
htmlNode.removeClass(this.classNames.hidden);
            _yuitest_coverline("build/menu/menu.js", 840);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterVisibleChange", 851);
_yuitest_coverline("build/menu/menu.js", 852);
this.get('container').toggleClass(this.classNames.open, e.newVal);
    },

    /**
    Handles click events on menu items.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
    _onItemClick: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemClick", 862);
_yuitest_coverline("build/menu/menu.js", 863);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            eventName  = EVT_ITEM_CLICK + '#' + item.id,
            isDisabled = item.isDisabled() || item.isHidden();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/menu/menu.js", 869);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/menu/menu.js", 870);
e.preventDefault();
        }

        _yuitest_coverline("build/menu/menu.js", 873);
if (isDisabled) {
            _yuitest_coverline("build/menu/menu.js", 874);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 877);
if (!this._published[eventName]) {
            _yuitest_coverline("build/menu/menu.js", 878);
this._published[eventName] = this.publish(eventName, {
                defaultFn: this._defSpecificItemClickFn
            }) ;
        }

        _yuitest_coverline("build/menu/menu.js", 883);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/menu/menu.js", 884);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defItemClickFn
            });
        }

        _yuitest_coverline("build/menu/menu.js", 889);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseEnter", 902);
_yuitest_coverline("build/menu/menu.js", 903);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/menu/menu.js", 905);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 907);
if (item.isOpen() || item.isDisabled()) {
            _yuitest_coverline("build/menu/menu.js", 908);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 911);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 6)", 911);
_yuitest_coverline("build/menu/menu.js", 912);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseLeave", 923);
_yuitest_coverline("build/menu/menu.js", 924);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/menu/menu.js", 926);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 928);
if (!item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 929);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 932);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 7)", 932);
_yuitest_coverline("build/menu/menu.js", 933);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseEnter", 944);
_yuitest_coverline("build/menu/menu.js", 945);
clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseLeave", 955);
_yuitest_coverline("build/menu/menu.js", 956);
var self = this;

        _yuitest_coverline("build/menu/menu.js", 958);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/menu/menu.js", 960);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 8)", 960);
_yuitest_coverline("build/menu/menu.js", 961);
self.closeSubMenus();

            _yuitest_coverline("build/menu/menu.js", 963);
if (self.get('hideOnMouseLeave')) {
                _yuitest_coverline("build/menu/menu.js", 964);
self.hide();
            }
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
        _yuitest_coverfunc("build/menu/menu.js", "_defItemClickFn", 978);
_yuitest_coverline("build/menu/menu.js", 979);
var item = e.item;

        _yuitest_coverline("build/menu/menu.js", 981);
if (item.canHaveChildren) {
            _yuitest_coverline("build/menu/menu.js", 982);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/menu/menu.js", 983);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/menu/menu.js", 985);
e.item.toggle();
        } else {
            _yuitest_coverline("build/menu/menu.js", 987);
this.closeSubMenus();
            _yuitest_coverline("build/menu/menu.js", 988);
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
        _yuitest_coverfunc("build/menu/menu.js", "_defSpecificItemClickFn", 999);
_yuitest_coverline("build/menu/menu.js", 1000);
this.fire(EVT_ITEM_CLICK, {
            originEvent: e.originEvent,
            item       : e.item
        });
    }
}, {
    ATTRS: {
        /**
        Preferred alignment positions at which this menu should be displayed
        relative to the anchor point when one is provided to the `show()`,
        `toggle()`, or `reposition()` methods.

        The most optimal alignment position will be chosen automatically based
        on which one allows the most of this menu to be visible within the
        browser's viewport. If multiple positions are equally visible, then the
        optimal position will be chosen based on its order in this array.

        An alignment position is a string like "tl-bl", which means "align the
        top left of this menu to the bottom left of its anchor point".

        Any combination of top/bottom/left/right alignment positions may be used
        as long as they follow this format. Here are a few examples:

          * `'bl-br'`: Align the bottom left of this menu with the bottom right
            of the anchor point.
          * `'br-bl'`: Align the bottom right of this menu with the bottom left
            of the anchor point.
          * `'tl-tr'`: Align the top left of this menu with the top right of
            the anchor point.
          * `'tr-tl'`: Align the top right of this menu to the top left of this
            anchor point.

        @attribute {String[]} alignments
        @default ['tl-bl', 'tr-br', 'bl-tl', 'br-tr']
        **/
        alignments: {
            valueFn: function () {
                _yuitest_coverfunc("build/menu/menu.js", "valueFn", 1036);
_yuitest_coverline("build/menu/menu.js", 1037);
return ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];
            }
        },

        /**
        If `true`, this menu will be hidden when the user moves the mouse
        outside the menu.

        @attribute {Boolean} hideOnMouseLeave
        @default false
        **/
        hideOnMouseLeave: {
            value: false
        },

        /**
        If `true`, this menu will be hidden when the user clicks somewhere
        outside the menu.

        @attribute {Boolean} hideOnOutsideClick
        @default true
        **/
        hideOnOutsideClick: {
            value: true
        },

        /**
        Just like `alignments`, but for submenus of this menu. See the
        `alignments` attribute for details on how alignment positions work.

        @attribute {String[]} subMenuAlignments
        @default ['tl-tr', 'bl-br', 'tr-tl', 'br-bl']
        **/
        subMenuAlignments: {
            valueFn: function () {
                _yuitest_coverfunc("build/menu/menu.js", "valueFn", 1071);
_yuitest_coverline("build/menu/menu.js", 1072);
return ['tl-tr', 'bl-br', 'tr-tl', 'br-bl'];
            }
        },

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

_yuitest_coverline("build/menu/menu.js", 1089);
Y.Menu = Y.mix(Menu, Y.Menu);


}, '@VERSION@', {
    "requires": [
        "classnamemanager",
        "event-hover",
        "menu-base",
        "menu-templates",
        "node-screen",
        "view"
    ],
    "skinnable": true
});
