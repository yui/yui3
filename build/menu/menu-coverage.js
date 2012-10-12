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
_yuitest_coverage["build/menu/menu.js"].code=["YUI.add('menu', function (Y, NAME) {","","/**","Provides the `Y.Menu` widget.","","@module menu","@main menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@extends Menu.Base","@uses View","**/","","var getClassName = Y.ClassNameManager.getClassName,","","/**","Fired when any clickable menu item is clicked.","","You can subscribe to clicks on a specific menu item by subscribing to","\"itemClick#id\", where \"id\" is the item id of the item you want to subscribe to.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defItemClickFn","**/","EVT_ITEM_CLICK = 'itemClick',","","Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Closes all open submenus of this menu.","","    @method closeSubMenus","    @chainable","    **/","    closeSubMenus: function () {","        // Close all open submenus.","        Y.Object.each(this._openMenus, function (item) {","            item.close();","        }, this);","","        return this;","    },","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Hides this menu.","","    @method hide","    @chainable","    **/","    hide: function () {","        this.set('visible', false);","        return this;","    },","","    /**","    Renders this menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode;","","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        switch (item.type) {","            case 'separator':","                htmlNode.set('role', 'separator');","                break;","","            case 'item':","            case 'heading':","                var labelNode = htmlNode.one('.' + classNames.label),","                    labelId   = labelNode.get('id');","","                labelNode.setHTML(item.label);","","                if (!labelId) {","                    labelId = Y.guid();","                    labelNode.set('id', labelId);","                }","","                htmlNode.set('aria-labelledby', labelId);","","                if (item.type === 'heading') {","                    htmlNode.set('role', 'heading');","                } else {","                    htmlNode.set('role', 'menuitem');","","                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                    if (item.canHaveChildren) {","                        htmlNode.addClass(classNames.canHaveChildren);","                        htmlNode.toggleClass(classNames.open, item.isOpen());","","                        if (item.hasChildren()) {","                            htmlNode.addClass(classNames.hasChildren);","","                            if (options.renderChildren) {","                                this.renderChildren(item, {","                                    container: htmlNode","                                });","                            }","                        }","                    }","                }","                break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    /**","    Shows this menu.","","    @method show","    @chainable","    **/","    show: function () {","        this.set('visible', true);","        return this;","    },","","    /**","    Toggles the visibility of this menu, showing it if it's currently hidden or","    hiding it if it's currently visible.","","    @method toggle","    @chainable","    **/","    toggle: function () {","        this.set('visible', !this.get('visible'));","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches menu events.","","    @method _attachMenuEvents","    @protected","    **/","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add          : this._afterAdd,","                clear        : this._afterClear,","                close        : this._afterClose,","                open         : this._afterOpen,","                remove       : this._afterRemove,","                visibleChange: this._afterVisibleChange","            }),","","            container.on('hover', this._onMenuMouseEnter,","                    this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick,","                    '.' + classNames.item + '>.' + classNames.label, this),","","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave,","                    '.' + classNames.canHaveChildren, this),","","            container.after('clickoutside', this._afterClickOutside, this)","        );","    },","","    /**","    Detaches menu events.","","    @method _detachMenuEvents","    @protected","    **/","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    /**","    Given an anchor point and the regions currently occupied by a child node","    (the node being anchored) and a parent node (the node being anchored to),","    returns a region object representing the coordinates the anchored node will","    occupy when anchored to the given point on the parent.","","    An anchor point is a string like \"tl-bl\", which means \"anchor the top left","    point of _nodeRegion_ to the bottom left point of _parentRegion_\".","","    Any combination of top/bottom/left/right anchor points may be used as long","    as they follow this format. Here are a few examples:","","      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of","        _parentRegion_.","      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of","        _parentRegion_.","      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of","        _parentRegion_.","      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of","        _parentRegion_.","","    @method _getAnchorRegion","    @param {String} anchor Anchor point. See above for details.","    @param {Object} nodeRegion Region object for the node to be anchored (that","        is, the node that will be repositioned).","    @param {Object} parentRegion Region object for the node that will be","        anchored to (that is, the node that will not move).","    @return {Object} Region that will be occupied by the anchored node.","    @protected","    **/","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        var region = {};","","        anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {","            var lookup = {","                    b: 'bottom',","                    l: 'left',","                    r: 'right',","                    t: 'top'","                };","","            region[lookup[p1]] = parentRegion[lookup[p3]];","            region[lookup[p2]] = parentRegion[lookup[p4]];","        });","","        'bottom' in region || (region.bottom = region.top + nodeRegion.height);","        'left' in region   || (region.left = region.right - nodeRegion.width);","        'right' in region  || (region.right = region.left + nodeRegion.width);","        'top' in region    || (region.top = region.bottom - nodeRegion.height);","","        return region;","    },","","    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {","        containerRegion || (containerRegion = Y.DOM.viewportRegion());","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchors = [],","            i, len, point, region;","","        for (i = 0, len = points.length; i < len; i++) {","            point = points[i];","","            // Allow arrays of strings or arrays of objects like {point: '...'}.","            if (point.point) {","                point = point.point;","            }","","            region = this._getAnchorRegion(point, nodeRegion, parentRegion);","","            anchors.push({","                point : point,","                region: region,","                score : this._inRegion(region, containerRegion)","            });","        }","","        // Sort the anchors in descending order by score (higher score is","        // better).","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Return the sorted anchors.","        return anchors;","    },","","    /**","    Hides this specified menu item by moving its htmlNode offscreen.","","    @method _hideMenu","    @param {Menu.Item} item Menu item.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    /**","    Returns `true` if the given _inner_ region is contained entirely within the","    given _outer_ region. If it's not a perfect fit, returns a numerical score","    indicating how much of the _inner_ region fits within the _outer_ region.","    A higher score indicates a better fit.","","    @method _inRegion","    @param {Object} inner Inner region.","    @param {Object} outer Outer region.","    @return {Boolean|Number} `true` if the _inner_ region fits entirely within","        the _outer_ region or, if not, a numerical score indicating how much of","        the inner region fits.","    @protected","    **/","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    /**","    Intelligently positions the _htmlNode_ of the given submenu _item_ relative","    to its parent so that as much as possible of the submenu will be visible","    within the viewport.","","    @method _positionMenu","    @param {Menu.Item} item Menu item to position.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children),","","            anchors = this._getSortedAnchorRegions(","                (item.parent && item.parent.data.menuAnchors) || [","                    'tl-tr', 'bl-br', 'tr-tl', 'br-bl'","                ],","                childrenNode.get('region'),","                htmlNode.get('region')","            );","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `add` events for this menu.","","    @method _afterAdd","    @param {EventFacade} e","    @protected","    **/","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    /**","    Handles `clear` events for this menu.","","    @method _afterClear","    @protected","    **/","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    /**","    Handles `clickoutside` events for this menu.","","    @method _afterClickOutside","    @protected","    **/","    _afterClickOutside: function () {","        this.closeSubMenus();","    },","","    /**","    Handles `close` events for this menu.","","    @method _afterClose","    @param {EventFacade} e","    @protected","    **/","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    /**","    Handles `open` events for this menu.","","    @method _afterOpen","    @param {EventFacade} e","    @protected","    **/","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    /**","    Handles `remove` events for this menu.","","    @method _afterRemove","    @param {EventFacade} e","    @protected","    **/","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    /**","    Handles `visibleChange` events for this menu.","","    @method _afterVisibleChange","    @param {EventFacade} e","    @protected","    **/","    _afterVisibleChange: function (e) {","        this.get('container').toggleClass(this.classNames.open, e.newVal);","    },","","    /**","    Handles click events on menu items.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            eventName  = EVT_ITEM_CLICK + '#' + item.id,","            isDisabled = item.isDisabled();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e._event.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[eventName]) {","            this._published[eventName] = this.publish(eventName, {","                defaultFn: this._defSpecificItemClickFn","            }) ;","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defItemClickFn","            });","        }","","        this.fire(eventName, {","            originEvent: e,","            item       : item","        });","    },","","    /**","    Handles delegated `mouseenter` events on menu items.","","    @method _onItemMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id')),","            self = this;","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    /**","    Handles delegated `mouseleave` events on menu items.","","    @method _onItemMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id')),","            self = this;","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    /**","    Handles `mouseenter` events on this menu.","","    @method _onMenuMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    /**","    Handles `mouseleave` events on this menu.","","    @method _onMenuMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the generic `itemClick` event.","","    @method _defItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defItemClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggle();","        } else {","            this.closeSubMenus();","        }","    },","","    /**","    Default handler for item-specific `itemClick#<id>` events.","","    @method _defSpecificItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defSpecificItemClickFn: function (e) {","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e.originEvent,","            item       : e.item","        });","    }","}, {","    ATTRS: {","        /**","        Whether or not this menu is visible. Changing this attribute's value","        will also change the visibility of this menu.","","        @attribute {Boolean} visible","        @default false","        **/","        visible: {","            value: false","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {\"requires\": [\"classnamemanager\", \"event-hover\", \"event-outside\", \"menu-base\", \"menu-templates\", \"node-screen\", \"view\"], \"skinnable\": true});"];
_yuitest_coverage["build/menu/menu.js"].lines = {"1":0,"19":0,"68":0,"69":0,"70":0,"72":0,"76":0,"78":0,"79":0,"81":0,"82":0,"85":0,"98":0,"99":0,"102":0,"115":0,"116":0,"119":0,"129":0,"130":0,"143":0,"145":0,"148":0,"149":0,"151":0,"154":0,"158":0,"159":0,"162":0,"164":0,"182":0,"184":0,"187":0,"188":0,"195":0,"196":0,"197":0,"200":0,"201":0,"204":0,"205":0,"211":0,"212":0,"215":0,"233":0,"235":0,"238":0,"239":0,"246":0,"248":0,"249":0,"253":0,"256":0,"258":0,"259":0,"260":0,"263":0,"265":0,"266":0,"268":0,"270":0,"272":0,"273":0,"274":0,"276":0,"277":0,"279":0,"280":0,"287":0,"290":0,"291":0,"294":0,"304":0,"305":0,"316":0,"317":0,"329":0,"331":0,"334":0,"364":0,"398":0,"400":0,"401":0,"408":0,"409":0,"412":0,"413":0,"414":0,"415":0,"417":0,"421":0,"426":0,"429":0,"430":0,"433":0,"434":0,"437":0,"439":0,"448":0,"449":0,"450":0,"451":0,"452":0,"453":0,"454":0,"456":0,"461":0,"473":0,"475":0,"477":0,"478":0,"496":0,"502":0,"508":0,"527":0,"529":0,"541":0,"544":0,"545":0,"559":0,"560":0,"563":0,"567":0,"568":0,"570":0,"571":0,"573":0,"576":0,"578":0,"582":0,"586":0,"598":0,"601":0,"602":0,"605":0,"606":0,"608":0,"609":0,"619":0,"630":0,"634":0,"635":0,"638":0,"639":0,"641":0,"642":0,"643":0,"655":0,"660":0,"664":0,"665":0,"666":0,"668":0,"669":0,"674":0,"678":0,"680":0,"681":0,"682":0,"694":0,"696":0,"697":0,"700":0,"702":0,"703":0,"704":0,"716":0,"727":0,"733":0,"734":0,"737":0,"738":0,"741":0,"742":0,"747":0,"748":0,"753":0,"767":0,"770":0,"772":0,"773":0,"776":0,"777":0,"789":0,"792":0,"794":0,"795":0,"798":0,"799":0,"811":0,"822":0,"824":0,"826":0,"827":0,"841":0,"843":0,"844":0,"845":0,"847":0,"849":0,"861":0,"881":0};
_yuitest_coverage["build/menu/menu.js"].functions = {"initializer:67":0,"(anonymous 2):81":0,"destructor:75":0,"(anonymous 3):98":0,"closeSubMenus:96":0,"getHTMLNode:114":0,"hide:128":0,"render:142":0,"renderChildren:181":0,"renderNode:232":0,"show:303":0,"toggle:315":0,"_attachMenuEvents:328":0,"_detachMenuEvents:363":0,"(anonymous 4):400":0,"_getAnchorRegion:397":0,"(anonymous 5):448":0,"_getSortedAnchorRegions:420":0,"_hideMenu:472":0,"_inRegion:495":0,"_positionMenu:526":0,"_afterAdd:557":0,"_afterClear:597":0,"_afterClickOutside:618":0,"_afterClose:629":0,"_afterOpen:654":0,"_afterRemove:693":0,"_afterVisibleChange:715":0,"_onItemClick:726":0,"(anonymous 6):776":0,"_onItemMouseEnter:766":0,"(anonymous 7):798":0,"_onItemMouseLeave:788":0,"_onMenuMouseEnter:810":0,"(anonymous 8):826":0,"_onMenuMouseLeave:821":0,"_defItemClickFn:840":0,"_defSpecificItemClickFn:860":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu/menu.js"].coveredLines = 202;
_yuitest_coverage["build/menu/menu.js"].coveredFunctions = 39;
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
        _yuitest_coverfunc("build/menu/menu.js", "initializer", 67);
_yuitest_coverline("build/menu/menu.js", 68);
this._openMenus = {};
        _yuitest_coverline("build/menu/menu.js", 69);
this._published = {};
        _yuitest_coverline("build/menu/menu.js", 70);
this._timeouts  = {};

        _yuitest_coverline("build/menu/menu.js", 72);
this._attachMenuEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/menu/menu.js", "destructor", 75);
_yuitest_coverline("build/menu/menu.js", 76);
this._detachMenuEvents();

        _yuitest_coverline("build/menu/menu.js", 78);
delete this._openMenus;
        _yuitest_coverline("build/menu/menu.js", 79);
delete this._published;

        _yuitest_coverline("build/menu/menu.js", 81);
Y.Object.each(this._timeouts, function (timeout) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 2)", 81);
_yuitest_coverline("build/menu/menu.js", 82);
clearTimeout(timeout);
        }, this);

        _yuitest_coverline("build/menu/menu.js", 85);
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
        _yuitest_coverfunc("build/menu/menu.js", "closeSubMenus", 96);
_yuitest_coverline("build/menu/menu.js", 98);
Y.Object.each(this._openMenus, function (item) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 3)", 98);
_yuitest_coverline("build/menu/menu.js", 99);
item.close();
        }, this);

        _yuitest_coverline("build/menu/menu.js", 102);
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
        _yuitest_coverfunc("build/menu/menu.js", "getHTMLNode", 114);
_yuitest_coverline("build/menu/menu.js", 115);
if (!item._htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 116);
item._htmlNode = this.get('container').one('#' + item.id);
        }

        _yuitest_coverline("build/menu/menu.js", 119);
return item._htmlNode;
    },

    /**
    Hides this menu.

    @method hide
    @chainable
    **/
    hide: function () {
        _yuitest_coverfunc("build/menu/menu.js", "hide", 128);
_yuitest_coverline("build/menu/menu.js", 129);
this.set('visible', false);
        _yuitest_coverline("build/menu/menu.js", 130);
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
        _yuitest_coverfunc("build/menu/menu.js", "render", 142);
_yuitest_coverline("build/menu/menu.js", 143);
var container = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 145);
container.addClass(this.classNames.menu);

        // Detect touchscreen devices.
        _yuitest_coverline("build/menu/menu.js", 148);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/menu/menu.js", 149);
container.addClass(this.classNames.touch);
        } else {
            _yuitest_coverline("build/menu/menu.js", 151);
container.addClass(this.classNames.noTouch);
        }

        _yuitest_coverline("build/menu/menu.js", 154);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/menu/menu.js", 158);
if (!container.inDoc()) {
            _yuitest_coverline("build/menu/menu.js", 159);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/menu/menu.js", 162);
this.rendered = true;

        _yuitest_coverline("build/menu/menu.js", 164);
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
        _yuitest_coverfunc("build/menu/menu.js", "renderChildren", 181);
_yuitest_coverline("build/menu/menu.js", 182);
options || (options = {});

        _yuitest_coverline("build/menu/menu.js", 184);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 187);
if (!childrenNode) {
            _yuitest_coverline("build/menu/menu.js", 188);
childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        _yuitest_coverline("build/menu/menu.js", 195);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/menu/menu.js", 196);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/menu/menu.js", 197);
childrenNode.set('role', 'menu');
        }

        _yuitest_coverline("build/menu/menu.js", 200);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/menu/menu.js", 201);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/menu/menu.js", 204);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 205);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/menu/menu.js", 211);
if (container) {
            _yuitest_coverline("build/menu/menu.js", 212);
container.append(childrenNode);
        }

        _yuitest_coverline("build/menu/menu.js", 215);
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
        _yuitest_coverfunc("build/menu/menu.js", "renderNode", 232);
_yuitest_coverline("build/menu/menu.js", 233);
options || (options = {});

        _yuitest_coverline("build/menu/menu.js", 235);
var classNames = this.classNames,
            htmlNode   = item._htmlNode;

        _yuitest_coverline("build/menu/menu.js", 238);
if (!htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 239);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        _yuitest_coverline("build/menu/menu.js", 246);
switch (item.type) {
            case 'separator':
                _yuitest_coverline("build/menu/menu.js", 248);
htmlNode.set('role', 'separator');
                _yuitest_coverline("build/menu/menu.js", 249);
break;

            case 'item':
            case 'heading':
                _yuitest_coverline("build/menu/menu.js", 253);
var labelNode = htmlNode.one('.' + classNames.label),
                    labelId   = labelNode.get('id');

                _yuitest_coverline("build/menu/menu.js", 256);
labelNode.setHTML(item.label);

                _yuitest_coverline("build/menu/menu.js", 258);
if (!labelId) {
                    _yuitest_coverline("build/menu/menu.js", 259);
labelId = Y.guid();
                    _yuitest_coverline("build/menu/menu.js", 260);
labelNode.set('id', labelId);
                }

                _yuitest_coverline("build/menu/menu.js", 263);
htmlNode.set('aria-labelledby', labelId);

                _yuitest_coverline("build/menu/menu.js", 265);
if (item.type === 'heading') {
                    _yuitest_coverline("build/menu/menu.js", 266);
htmlNode.set('role', 'heading');
                } else {
                    _yuitest_coverline("build/menu/menu.js", 268);
htmlNode.set('role', 'menuitem');

                    _yuitest_coverline("build/menu/menu.js", 270);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                    _yuitest_coverline("build/menu/menu.js", 272);
if (item.canHaveChildren) {
                        _yuitest_coverline("build/menu/menu.js", 273);
htmlNode.addClass(classNames.canHaveChildren);
                        _yuitest_coverline("build/menu/menu.js", 274);
htmlNode.toggleClass(classNames.open, item.isOpen());

                        _yuitest_coverline("build/menu/menu.js", 276);
if (item.hasChildren()) {
                            _yuitest_coverline("build/menu/menu.js", 277);
htmlNode.addClass(classNames.hasChildren);

                            _yuitest_coverline("build/menu/menu.js", 279);
if (options.renderChildren) {
                                _yuitest_coverline("build/menu/menu.js", 280);
this.renderChildren(item, {
                                    container: htmlNode
                                });
                            }
                        }
                    }
                }
                _yuitest_coverline("build/menu/menu.js", 287);
break;
        }

        _yuitest_coverline("build/menu/menu.js", 290);
if (options.container) {
            _yuitest_coverline("build/menu/menu.js", 291);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/menu/menu.js", 294);
return htmlNode;
    },

    /**
    Shows this menu.

    @method show
    @chainable
    **/
    show: function () {
        _yuitest_coverfunc("build/menu/menu.js", "show", 303);
_yuitest_coverline("build/menu/menu.js", 304);
this.set('visible', true);
        _yuitest_coverline("build/menu/menu.js", 305);
return this;
    },

    /**
    Toggles the visibility of this menu, showing it if it's currently hidden or
    hiding it if it's currently visible.

    @method toggle
    @chainable
    **/
    toggle: function () {
        _yuitest_coverfunc("build/menu/menu.js", "toggle", 315);
_yuitest_coverline("build/menu/menu.js", 316);
this.set('visible', !this.get('visible'));
        _yuitest_coverline("build/menu/menu.js", 317);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches menu events.

    @method _attachMenuEvents
    @protected
    **/
    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_attachMenuEvents", 328);
_yuitest_coverline("build/menu/menu.js", 329);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/menu/menu.js", 331);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 334);
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
        _yuitest_coverfunc("build/menu/menu.js", "_detachMenuEvents", 363);
_yuitest_coverline("build/menu/menu.js", 364);
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
        _yuitest_coverfunc("build/menu/menu.js", "_getAnchorRegion", 397);
_yuitest_coverline("build/menu/menu.js", 398);
var region = {};

        _yuitest_coverline("build/menu/menu.js", 400);
anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 4)", 400);
_yuitest_coverline("build/menu/menu.js", 401);
var lookup = {
                    b: 'bottom',
                    l: 'left',
                    r: 'right',
                    t: 'top'
                };

            _yuitest_coverline("build/menu/menu.js", 408);
region[lookup[p1]] = parentRegion[lookup[p3]];
            _yuitest_coverline("build/menu/menu.js", 409);
region[lookup[p2]] = parentRegion[lookup[p4]];
        });

        _yuitest_coverline("build/menu/menu.js", 412);
'bottom' in region || (region.bottom = region.top + nodeRegion.height);
        _yuitest_coverline("build/menu/menu.js", 413);
'left' in region   || (region.left = region.right - nodeRegion.width);
        _yuitest_coverline("build/menu/menu.js", 414);
'right' in region  || (region.right = region.left + nodeRegion.width);
        _yuitest_coverline("build/menu/menu.js", 415);
'top' in region    || (region.top = region.bottom - nodeRegion.height);

        _yuitest_coverline("build/menu/menu.js", 417);
return region;
    },

    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {
        _yuitest_coverfunc("build/menu/menu.js", "_getSortedAnchorRegions", 420);
_yuitest_coverline("build/menu/menu.js", 421);
containerRegion || (containerRegion = Y.DOM.viewportRegion());

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        _yuitest_coverline("build/menu/menu.js", 426);
var anchors = [],
            i, len, point, region;

        _yuitest_coverline("build/menu/menu.js", 429);
for (i = 0, len = points.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 430);
point = points[i];

            // Allow arrays of strings or arrays of objects like {point: '...'}.
            _yuitest_coverline("build/menu/menu.js", 433);
if (point.point) {
                _yuitest_coverline("build/menu/menu.js", 434);
point = point.point;
            }

            _yuitest_coverline("build/menu/menu.js", 437);
region = this._getAnchorRegion(point, nodeRegion, parentRegion);

            _yuitest_coverline("build/menu/menu.js", 439);
anchors.push({
                point : point,
                region: region,
                score : this._inRegion(region, containerRegion)
            });
        }

        // Sort the anchors in descending order by score (higher score is
        // better).
        _yuitest_coverline("build/menu/menu.js", 448);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 5)", 448);
_yuitest_coverline("build/menu/menu.js", 449);
if (a.score === b.score) {
                _yuitest_coverline("build/menu/menu.js", 450);
return 0;
            } else {_yuitest_coverline("build/menu/menu.js", 451);
if (a.score === true) {
                _yuitest_coverline("build/menu/menu.js", 452);
return -1;
            } else {_yuitest_coverline("build/menu/menu.js", 453);
if (b.score === true) {
                _yuitest_coverline("build/menu/menu.js", 454);
return 1;
            } else {
                _yuitest_coverline("build/menu/menu.js", 456);
return b.score - a.score;
            }}}
        });

        // Return the sorted anchors.
        _yuitest_coverline("build/menu/menu.js", 461);
return anchors;
    },

    /**
    Hides this specified menu item by moving its htmlNode offscreen.

    @method _hideMenu
    @param {Menu.Item} item Menu item.
    @param {Node} [htmlNode] HTML node for the menu item.
    @protected
    **/
    _hideMenu: function (item, htmlNode) {
        _yuitest_coverfunc("build/menu/menu.js", "_hideMenu", 472);
_yuitest_coverline("build/menu/menu.js", 473);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 475);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 477);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/menu/menu.js", 478);
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
        _yuitest_coverfunc("build/menu/menu.js", "_inRegion", 495);
_yuitest_coverline("build/menu/menu.js", 496);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/menu/menu.js", 502);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/menu/menu.js", 508);
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
        _yuitest_coverfunc("build/menu/menu.js", "_positionMenu", 526);
_yuitest_coverline("build/menu/menu.js", 527);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 529);
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
        _yuitest_coverline("build/menu/menu.js", 541);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/menu/menu.js", 544);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/menu/menu.js", 545);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterAdd", 557);
_yuitest_coverline("build/menu/menu.js", 559);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 560);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 563);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/menu/menu.js", 567);
if (parent === this.rootNode) {
            _yuitest_coverline("build/menu/menu.js", 568);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/menu/menu.js", 570);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/menu/menu.js", 571);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/menu/menu.js", 573);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/menu/menu.js", 576);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/menu/menu.js", 578);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/menu/menu.js", 582);
return;
            }
        }

        _yuitest_coverline("build/menu/menu.js", 586);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterClear", 597);
_yuitest_coverline("build/menu/menu.js", 598);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/menu/menu.js", 601);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 602);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 605);
delete this._childrenNode;
        _yuitest_coverline("build/menu/menu.js", 606);
this.rendered = false;

        _yuitest_coverline("build/menu/menu.js", 608);
this.get('container').empty();
        _yuitest_coverline("build/menu/menu.js", 609);
this.render();
    },

    /**
    Handles `clickoutside` events for this menu.

    @method _afterClickOutside
    @protected
    **/
    _afterClickOutside: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClickOutside", 618);
_yuitest_coverline("build/menu/menu.js", 619);
this.closeSubMenus();
    },

    /**
    Handles `close` events for this menu.

    @method _afterClose
    @param {EventFacade} e
    @protected
    **/
    _afterClose: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClose", 629);
_yuitest_coverline("build/menu/menu.js", 630);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/menu/menu.js", 634);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 635);
item.children[i].close();
        }

        _yuitest_coverline("build/menu/menu.js", 638);
item.close();
        _yuitest_coverline("build/menu/menu.js", 639);
delete this._openMenus[item.id];

        _yuitest_coverline("build/menu/menu.js", 641);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 642);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 643);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterOpen", 654);
_yuitest_coverline("build/menu/menu.js", 655);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/menu/menu.js", 660);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/menu/menu.js", 664);
if (parent.isOpen()) {
                _yuitest_coverline("build/menu/menu.js", 665);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/menu/menu.js", 666);
child = parent.children[i];

                    _yuitest_coverline("build/menu/menu.js", 668);
if (child !== item) {
                        _yuitest_coverline("build/menu/menu.js", 669);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/menu/menu.js", 674);
parent.open();
            }
        }

        _yuitest_coverline("build/menu/menu.js", 678);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/menu/menu.js", 680);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 681);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 682);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterRemove", 693);
_yuitest_coverline("build/menu/menu.js", 694);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/menu/menu.js", 696);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 697);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 700);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/menu/menu.js", 702);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 703);
htmlNode.remove(true);
            _yuitest_coverline("build/menu/menu.js", 704);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterVisibleChange", 715);
_yuitest_coverline("build/menu/menu.js", 716);
this.get('container').toggleClass(this.classNames.open, e.newVal);
    },

    /**
    Handles click events on menu items.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
    _onItemClick: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemClick", 726);
_yuitest_coverline("build/menu/menu.js", 727);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            eventName  = EVT_ITEM_CLICK + '#' + item.id,
            isDisabled = item.isDisabled();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/menu/menu.js", 733);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/menu/menu.js", 734);
e._event.preventDefault();
        }

        _yuitest_coverline("build/menu/menu.js", 737);
if (isDisabled) {
            _yuitest_coverline("build/menu/menu.js", 738);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 741);
if (!this._published[eventName]) {
            _yuitest_coverline("build/menu/menu.js", 742);
this._published[eventName] = this.publish(eventName, {
                defaultFn: this._defSpecificItemClickFn
            }) ;
        }

        _yuitest_coverline("build/menu/menu.js", 747);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/menu/menu.js", 748);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defItemClickFn
            });
        }

        _yuitest_coverline("build/menu/menu.js", 753);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseEnter", 766);
_yuitest_coverline("build/menu/menu.js", 767);
var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        _yuitest_coverline("build/menu/menu.js", 770);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 772);
if (item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 773);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 776);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 6)", 776);
_yuitest_coverline("build/menu/menu.js", 777);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseLeave", 788);
_yuitest_coverline("build/menu/menu.js", 789);
var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        _yuitest_coverline("build/menu/menu.js", 792);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 794);
if (!item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 795);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 798);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 7)", 798);
_yuitest_coverline("build/menu/menu.js", 799);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseEnter", 810);
_yuitest_coverline("build/menu/menu.js", 811);
clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseLeave", 821);
_yuitest_coverline("build/menu/menu.js", 822);
var self = this;

        _yuitest_coverline("build/menu/menu.js", 824);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/menu/menu.js", 826);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 8)", 826);
_yuitest_coverline("build/menu/menu.js", 827);
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
        _yuitest_coverfunc("build/menu/menu.js", "_defItemClickFn", 840);
_yuitest_coverline("build/menu/menu.js", 841);
var item = e.item;

        _yuitest_coverline("build/menu/menu.js", 843);
if (item.canHaveChildren) {
            _yuitest_coverline("build/menu/menu.js", 844);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/menu/menu.js", 845);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/menu/menu.js", 847);
e.item.toggle();
        } else {
            _yuitest_coverline("build/menu/menu.js", 849);
this.closeSubMenus();
        }
    },

    /**
    Default handler for item-specific `itemClick#<id>` events.

    @method _defSpecificItemClickFn
    @param {EventFacade} e
    @protected
    **/
    _defSpecificItemClickFn: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_defSpecificItemClickFn", 860);
_yuitest_coverline("build/menu/menu.js", 861);
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

_yuitest_coverline("build/menu/menu.js", 881);
Y.Menu = Y.mix(Menu, Y.Menu);


}, '@VERSION@', {"requires": ["classnamemanager", "event-hover", "event-outside", "menu-base", "menu-templates", "node-screen", "view"], "skinnable": true});
