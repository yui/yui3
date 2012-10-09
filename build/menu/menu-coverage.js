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
_yuitest_coverage["build/menu/menu.js"].code=["YUI.add('menu', function (Y, NAME) {","","/**","Provides the `Y.Menu` widget.","","@module menu","@main menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@extends Menu.Base","@uses View","**/","","var getClassName = Y.ClassNameManager.getClassName,","","/**","Fired when a clickable menu item is clicked.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defClickFn","**/","EVT_ITEM_CLICK = 'itemClick',","","Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Closes all open submenus of this menu.","","    @method closeSubMenus","    @chainable","    **/","    closeSubMenus: function () {","        // Close all open submenus.","        Y.Object.each(this._openMenus, function (item) {","            item.close();","        }, this);","","        return this;","    },","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Hides this menu.","","    @method hide","    @chainable","    **/","    hide: function () {","        if (this.rendered) {","            this.get('container').removeClass(this.classNames.open);","        }","","        return this;","    },","","    /**","    Returns `true` if this menu is currently visible.","","    @method isVisible","    @return {Boolean} `true` if this menu is currently visible, `false`","        otherwise.","    **/","    isVisible: function () {","        // TODO: maintain state internally rather than relying on the \"open\" class.","        return this.rendered && this.get('container').hasClass(this.classNames.open);","    },","","    /**","    Renders this menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode;","","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        switch (item.type) {","            case 'separator':","                htmlNode.set('role', 'separator');","                break;","","            case 'item':","            case 'heading':","                var labelNode = htmlNode.one('.' + classNames.label),","                    labelId   = labelNode.get('id');","","                labelNode.setHTML(item.label);","","                if (!labelId) {","                    labelId = Y.guid();","                    labelNode.set('id', labelId);","                }","","                htmlNode.set('aria-labelledby', labelId);","","                if (item.type === 'heading') {","                    htmlNode.set('role', 'heading');","                } else {","                    htmlNode.set('role', 'menuitem');","","                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                    if (item.canHaveChildren) {","                        htmlNode.addClass(classNames.canHaveChildren);","                        htmlNode.toggleClass(classNames.open, item.isOpen());","","                        if (item.hasChildren()) {","                            htmlNode.addClass(classNames.hasChildren);","","                            if (options.renderChildren) {","                                this.renderChildren(item, {","                                    container: htmlNode","                                });","                            }","                        }","                    }","                }","                break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    /**","    Shows this menu.","","    @method show","    @chainable","    **/","    show: function () {","        if (this.rendered) {","            this.get('container').addClass(this.classNames.open);","        }","","        return this;","    },","","    /**","    Toggles the visibility of this menu, showing it if it's currently hidden or","    hiding it if it's currently visible.","","    @method toggle","    @chainable","    **/","    toggle: function () {","        if (this.rendered) {","            this.get('container').toggleClass(this.classNames.open);","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches menu events.","","    @method _attachMenuEvents","    @protected","    **/","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add   : this._afterAdd,","                clear : this._afterClear,","                close : this._afterClose,","                open  : this._afterOpen,","                remove: this._afterRemove","            }),","","            container.on('hover', this._onMenuMouseEnter,","                    this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick,","                    '.' + classNames.item + '>.' + classNames.label, this),","","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave,","                    '.' + classNames.canHaveChildren, this),","","            container.after('clickoutside', this._afterOutsideClick, this)","        );","    },","","    /**","    Detaches menu events.","","    @method _detachMenuEvents","    @protected","    **/","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    /**","    Given an anchor point and the regions currently occupied by a child node","    (the node being anchored) and a parent node (the node being anchored to),","    returns a region object representing the coordinates the anchored node will","    occupy when anchored to the given point on the parent.","","    The following anchor points are currently supported:","","      * `'bl-br'`: Anchor the bottom left of the child to the bottom right of","        the parent.","      * `'br-bl'`: Anchor the bottom right of the child to the bottom left of","        the parent.","      * `'tl-tr'`: Anchor the top left of the child to the top right of the","        parent.","      * `'tr-tl'`: Anchor the top right of the child to the top left of the","        parent.","","    @method _getAnchorRegion","    @param {String} anchor Anchor point. See above for supported points.","    @param {Object} nodeRegion Region object for the node to be anchored (that","        is, the node that will be repositioned).","    @param {Object} parentRegion Region object for the node that will be","        anchored to (that is, the node that will not move).","    @return {Object} Region that will be occupied by the anchored node.","    @protected","    **/","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        switch (anchor) {","        case 'tl-tr':","            return {","                bottom: parentRegion.top + nodeRegion.height,","                left  : parentRegion.right,","                right : parentRegion.right + nodeRegion.width,","                top   : parentRegion.top","            };","","        case 'bl-br':","            return {","                bottom: parentRegion.bottom,","                left  : parentRegion.right,","                right : parentRegion.right + nodeRegion.width,","                top   : parentRegion.bottom - nodeRegion.height","            };","","        case 'tr-tl':","            return {","                bottom: parentRegion.top + nodeRegion.height,","                left  : parentRegion.left - nodeRegion.width,","                right : parentRegion.left,","                top   : parentRegion.top","            };","","        case 'br-bl':","            return {","                bottom: parentRegion.bottom,","                left  : parentRegion.left - nodeRegion.width,","                right : parentRegion.left,","                top   : parentRegion.bottom - nodeRegion.height","            };","        }","    },","","    /**","    Hides this specified menu item by moving its htmlNode offscreen.","","    @method _hideMenu","    @param {Menu.Item} item Menu item.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    /**","    Returns `true` if the given _inner_ region is contained entirely within the","    given _outer_ region. If it's not a perfect fit, returns a numerical score","    indicating how much of the _inner_ region fits within the _outer_ region.","    A higher score indicates a better fit.","","    @method _inRegion","    @param {Object} inner Inner region.","    @param {Object} outer Outer region.","    @return {Boolean|Number} `true` if the _inner_ region fits entirely within","        the _outer_ region or, if not, a numerical score indicating how much of","        the inner region fits.","    @protected","    **/","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    /**","    Intelligently positions the _htmlNode_ of the given submenu _item_ relative","    to its parent so that as much as possible of the submenu will be visible","    within the viewport.","","    @method _positionMenu","    @param {Menu.Item} item Menu item to position.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var anchors = (item.parent && item.parent.data.menuAnchors) || [","                {point: 'tl-tr'},","                {point: 'bl-br'},","                {point: 'tr-tl'},","                {point: 'br-bl'}","            ],","","            childrenNode   = htmlNode.one('.' + this.classNames.children),","            childrenRegion = childrenNode.get('region'),","            parentRegion   = htmlNode.get('region'),","            viewportRegion = htmlNode.get('viewportRegion');","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchor;","","        for (var i = 0, len = anchors.length; i < len; i++) {","            anchor = anchors[i];","","            anchor.region = this._getAnchorRegion(anchor.point, childrenRegion,","                    parentRegion);","","            anchor.score = this._inRegion(anchor.region, viewportRegion);","        }","","        // Sort the anchors by score.","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `add` events for this menu.","","    @method _afterAdd","    @param {EventFacade} e","    @protected","    **/","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    /**","    Handles `clear` events for this menu.","","    @method _afterClear","    @protected","    **/","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    /**","    Handles `close` events for this menu.","","    @method _afterClose","    @param {EventFacade} e","    @protected","    **/","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    /**","    Handles `open` events for this menu.","","    @method _afterOpen","    @param {EventFacade} e","    @protected","    **/","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    /**","    Handles `clickoutside` events for this menu.","","    @method _afterOutsideClick","    @protected","    **/","    _afterOutsideClick: function () {","        this.closeSubMenus();","    },","","    /**","    Handles `remove` events for this menu.","","    @method _afterRemove","    @param {EventFacade} e","    @protected","    **/","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    /**","    Handles click events on menu items.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            isDisabled = item.isDisabled();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e._event.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defClickFn","            });","        }","","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e,","            item       : item","        });","    },","","    /**","    Handles delegated `mouseenter` events on menu items.","","    @method _onItemMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id')),","            self = this;","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    /**","    Handles delegated `mouseleave` events on menu items.","","    @method _onItemMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id')),","            self = this;","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    /**","    Handles `mouseenter` events on this menu.","","    @method _onMenuMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    /**","    Handles `mouseleave` events on this menu.","","    @method _onMenuMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the `itemClick` event.","","    @method _defClickFn","    @param {EventFacade} e","    @protected","    **/","    _defClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggle();","        } else {","            this.closeSubMenus();","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {\"requires\": [\"classnamemanager\", \"event-hover\", \"event-outside\", \"menu-base\", \"menu-templates\", \"node-screen\", \"view\"], \"skinnable\": true});"];
_yuitest_coverage["build/menu/menu.js"].lines = {"1":0,"19":0,"65":0,"66":0,"67":0,"69":0,"73":0,"75":0,"76":0,"78":0,"79":0,"82":0,"95":0,"96":0,"99":0,"112":0,"113":0,"116":0,"126":0,"127":0,"130":0,"142":0,"155":0,"157":0,"160":0,"161":0,"163":0,"166":0,"170":0,"171":0,"174":0,"176":0,"194":0,"196":0,"199":0,"200":0,"207":0,"208":0,"209":0,"212":0,"213":0,"216":0,"217":0,"223":0,"224":0,"227":0,"245":0,"247":0,"250":0,"251":0,"258":0,"260":0,"261":0,"265":0,"268":0,"270":0,"271":0,"272":0,"275":0,"277":0,"278":0,"280":0,"282":0,"284":0,"285":0,"286":0,"288":0,"289":0,"291":0,"292":0,"299":0,"302":0,"303":0,"306":0,"316":0,"317":0,"320":0,"331":0,"332":0,"335":0,"347":0,"349":0,"352":0,"381":0,"411":0,"413":0,"421":0,"429":0,"437":0,"455":0,"457":0,"459":0,"460":0,"478":0,"484":0,"490":0,"509":0,"511":0,"526":0,"528":0,"529":0,"531":0,"534":0,"538":0,"539":0,"540":0,"541":0,"542":0,"543":0,"544":0,"546":0,"552":0,"555":0,"556":0,"570":0,"571":0,"574":0,"578":0,"579":0,"581":0,"582":0,"584":0,"587":0,"589":0,"593":0,"597":0,"609":0,"612":0,"613":0,"616":0,"617":0,"619":0,"620":0,"631":0,"635":0,"636":0,"639":0,"640":0,"642":0,"643":0,"644":0,"656":0,"661":0,"665":0,"666":0,"667":0,"669":0,"670":0,"675":0,"679":0,"681":0,"682":0,"683":0,"694":0,"705":0,"707":0,"708":0,"711":0,"713":0,"714":0,"715":0,"727":0,"732":0,"733":0,"736":0,"737":0,"740":0,"741":0,"746":0,"760":0,"763":0,"765":0,"766":0,"769":0,"770":0,"782":0,"785":0,"787":0,"788":0,"791":0,"792":0,"804":0,"815":0,"817":0,"819":0,"820":0,"834":0,"836":0,"837":0,"838":0,"840":0,"842":0,"847":0};
_yuitest_coverage["build/menu/menu.js"].functions = {"initializer:64":0,"(anonymous 2):78":0,"destructor:72":0,"(anonymous 3):95":0,"closeSubMenus:93":0,"getHTMLNode:111":0,"hide:125":0,"isVisible:140":0,"render:154":0,"renderChildren:193":0,"renderNode:244":0,"show:315":0,"toggle:330":0,"_attachMenuEvents:346":0,"_detachMenuEvents:380":0,"_getAnchorRegion:410":0,"_hideMenu:454":0,"_inRegion:477":0,"(anonymous 4):538":0,"_positionMenu:508":0,"_afterAdd:568":0,"_afterClear:608":0,"_afterClose:630":0,"_afterOpen:655":0,"_afterOutsideClick:693":0,"_afterRemove:704":0,"_onItemClick:726":0,"(anonymous 5):769":0,"_onItemMouseEnter:759":0,"(anonymous 6):791":0,"_onItemMouseLeave:781":0,"_onMenuMouseEnter:803":0,"(anonymous 7):819":0,"_onMenuMouseLeave:814":0,"_defClickFn:833":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu/menu.js"].coveredLines = 193;
_yuitest_coverage["build/menu/menu.js"].coveredFunctions = 36;
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
        _yuitest_coverfunc("build/menu/menu.js", "initializer", 64);
_yuitest_coverline("build/menu/menu.js", 65);
this._openMenus = {};
        _yuitest_coverline("build/menu/menu.js", 66);
this._published = {};
        _yuitest_coverline("build/menu/menu.js", 67);
this._timeouts  = {};

        _yuitest_coverline("build/menu/menu.js", 69);
this._attachMenuEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/menu/menu.js", "destructor", 72);
_yuitest_coverline("build/menu/menu.js", 73);
this._detachMenuEvents();

        _yuitest_coverline("build/menu/menu.js", 75);
delete this._openMenus;
        _yuitest_coverline("build/menu/menu.js", 76);
delete this._published;

        _yuitest_coverline("build/menu/menu.js", 78);
Y.Object.each(this._timeouts, function (timeout) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 2)", 78);
_yuitest_coverline("build/menu/menu.js", 79);
clearTimeout(timeout);
        }, this);

        _yuitest_coverline("build/menu/menu.js", 82);
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
        _yuitest_coverfunc("build/menu/menu.js", "closeSubMenus", 93);
_yuitest_coverline("build/menu/menu.js", 95);
Y.Object.each(this._openMenus, function (item) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 3)", 95);
_yuitest_coverline("build/menu/menu.js", 96);
item.close();
        }, this);

        _yuitest_coverline("build/menu/menu.js", 99);
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
        _yuitest_coverfunc("build/menu/menu.js", "getHTMLNode", 111);
_yuitest_coverline("build/menu/menu.js", 112);
if (!item._htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 113);
item._htmlNode = this.get('container').one('#' + item.id);
        }

        _yuitest_coverline("build/menu/menu.js", 116);
return item._htmlNode;
    },

    /**
    Hides this menu.

    @method hide
    @chainable
    **/
    hide: function () {
        _yuitest_coverfunc("build/menu/menu.js", "hide", 125);
_yuitest_coverline("build/menu/menu.js", 126);
if (this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 127);
this.get('container').removeClass(this.classNames.open);
        }

        _yuitest_coverline("build/menu/menu.js", 130);
return this;
    },

    /**
    Returns `true` if this menu is currently visible.

    @method isVisible
    @return {Boolean} `true` if this menu is currently visible, `false`
        otherwise.
    **/
    isVisible: function () {
        // TODO: maintain state internally rather than relying on the "open" class.
        _yuitest_coverfunc("build/menu/menu.js", "isVisible", 140);
_yuitest_coverline("build/menu/menu.js", 142);
return this.rendered && this.get('container').hasClass(this.classNames.open);
    },

    /**
    Renders this menu into its container.

    If the container hasn't already been added to the current document, it will
    be appended to the `<body>` element.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/menu/menu.js", "render", 154);
_yuitest_coverline("build/menu/menu.js", 155);
var container = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 157);
container.addClass(this.classNames.menu);

        // Detect touchscreen devices.
        _yuitest_coverline("build/menu/menu.js", 160);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/menu/menu.js", 161);
container.addClass(this.classNames.touch);
        } else {
            _yuitest_coverline("build/menu/menu.js", 163);
container.addClass(this.classNames.noTouch);
        }

        _yuitest_coverline("build/menu/menu.js", 166);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/menu/menu.js", 170);
if (!container.inDoc()) {
            _yuitest_coverline("build/menu/menu.js", 171);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/menu/menu.js", 174);
this.rendered = true;

        _yuitest_coverline("build/menu/menu.js", 176);
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
        _yuitest_coverfunc("build/menu/menu.js", "renderChildren", 193);
_yuitest_coverline("build/menu/menu.js", 194);
options || (options = {});

        _yuitest_coverline("build/menu/menu.js", 196);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 199);
if (!childrenNode) {
            _yuitest_coverline("build/menu/menu.js", 200);
childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        _yuitest_coverline("build/menu/menu.js", 207);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/menu/menu.js", 208);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/menu/menu.js", 209);
childrenNode.set('role', 'menu');
        }

        _yuitest_coverline("build/menu/menu.js", 212);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/menu/menu.js", 213);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/menu/menu.js", 216);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 217);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/menu/menu.js", 223);
if (container) {
            _yuitest_coverline("build/menu/menu.js", 224);
container.append(childrenNode);
        }

        _yuitest_coverline("build/menu/menu.js", 227);
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
        _yuitest_coverfunc("build/menu/menu.js", "renderNode", 244);
_yuitest_coverline("build/menu/menu.js", 245);
options || (options = {});

        _yuitest_coverline("build/menu/menu.js", 247);
var classNames = this.classNames,
            htmlNode   = item._htmlNode;

        _yuitest_coverline("build/menu/menu.js", 250);
if (!htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 251);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        _yuitest_coverline("build/menu/menu.js", 258);
switch (item.type) {
            case 'separator':
                _yuitest_coverline("build/menu/menu.js", 260);
htmlNode.set('role', 'separator');
                _yuitest_coverline("build/menu/menu.js", 261);
break;

            case 'item':
            case 'heading':
                _yuitest_coverline("build/menu/menu.js", 265);
var labelNode = htmlNode.one('.' + classNames.label),
                    labelId   = labelNode.get('id');

                _yuitest_coverline("build/menu/menu.js", 268);
labelNode.setHTML(item.label);

                _yuitest_coverline("build/menu/menu.js", 270);
if (!labelId) {
                    _yuitest_coverline("build/menu/menu.js", 271);
labelId = Y.guid();
                    _yuitest_coverline("build/menu/menu.js", 272);
labelNode.set('id', labelId);
                }

                _yuitest_coverline("build/menu/menu.js", 275);
htmlNode.set('aria-labelledby', labelId);

                _yuitest_coverline("build/menu/menu.js", 277);
if (item.type === 'heading') {
                    _yuitest_coverline("build/menu/menu.js", 278);
htmlNode.set('role', 'heading');
                } else {
                    _yuitest_coverline("build/menu/menu.js", 280);
htmlNode.set('role', 'menuitem');

                    _yuitest_coverline("build/menu/menu.js", 282);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                    _yuitest_coverline("build/menu/menu.js", 284);
if (item.canHaveChildren) {
                        _yuitest_coverline("build/menu/menu.js", 285);
htmlNode.addClass(classNames.canHaveChildren);
                        _yuitest_coverline("build/menu/menu.js", 286);
htmlNode.toggleClass(classNames.open, item.isOpen());

                        _yuitest_coverline("build/menu/menu.js", 288);
if (item.hasChildren()) {
                            _yuitest_coverline("build/menu/menu.js", 289);
htmlNode.addClass(classNames.hasChildren);

                            _yuitest_coverline("build/menu/menu.js", 291);
if (options.renderChildren) {
                                _yuitest_coverline("build/menu/menu.js", 292);
this.renderChildren(item, {
                                    container: htmlNode
                                });
                            }
                        }
                    }
                }
                _yuitest_coverline("build/menu/menu.js", 299);
break;
        }

        _yuitest_coverline("build/menu/menu.js", 302);
if (options.container) {
            _yuitest_coverline("build/menu/menu.js", 303);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/menu/menu.js", 306);
return htmlNode;
    },

    /**
    Shows this menu.

    @method show
    @chainable
    **/
    show: function () {
        _yuitest_coverfunc("build/menu/menu.js", "show", 315);
_yuitest_coverline("build/menu/menu.js", 316);
if (this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 317);
this.get('container').addClass(this.classNames.open);
        }

        _yuitest_coverline("build/menu/menu.js", 320);
return this;
    },

    /**
    Toggles the visibility of this menu, showing it if it's currently hidden or
    hiding it if it's currently visible.

    @method toggle
    @chainable
    **/
    toggle: function () {
        _yuitest_coverfunc("build/menu/menu.js", "toggle", 330);
_yuitest_coverline("build/menu/menu.js", 331);
if (this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 332);
this.get('container').toggleClass(this.classNames.open);
        }

        _yuitest_coverline("build/menu/menu.js", 335);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches menu events.

    @method _attachMenuEvents
    @protected
    **/
    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_attachMenuEvents", 346);
_yuitest_coverline("build/menu/menu.js", 347);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/menu/menu.js", 349);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 352);
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

    /**
    Detaches menu events.

    @method _detachMenuEvents
    @protected
    **/
    _detachMenuEvents: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_detachMenuEvents", 380);
_yuitest_coverline("build/menu/menu.js", 381);
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
        _yuitest_coverfunc("build/menu/menu.js", "_getAnchorRegion", 410);
_yuitest_coverline("build/menu/menu.js", 411);
switch (anchor) {
        case 'tl-tr':
            _yuitest_coverline("build/menu/menu.js", 413);
return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.top
            };

        case 'bl-br':
            _yuitest_coverline("build/menu/menu.js", 421);
return {
                bottom: parentRegion.bottom,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.bottom - nodeRegion.height
            };

        case 'tr-tl':
            _yuitest_coverline("build/menu/menu.js", 429);
return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.top
            };

        case 'br-bl':
            _yuitest_coverline("build/menu/menu.js", 437);
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
        _yuitest_coverfunc("build/menu/menu.js", "_hideMenu", 454);
_yuitest_coverline("build/menu/menu.js", 455);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 457);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 459);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/menu/menu.js", 460);
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
        _yuitest_coverfunc("build/menu/menu.js", "_inRegion", 477);
_yuitest_coverline("build/menu/menu.js", 478);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/menu/menu.js", 484);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/menu/menu.js", 490);
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
        _yuitest_coverfunc("build/menu/menu.js", "_positionMenu", 508);
_yuitest_coverline("build/menu/menu.js", 509);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 511);
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
        _yuitest_coverline("build/menu/menu.js", 526);
var anchor;

        _yuitest_coverline("build/menu/menu.js", 528);
for (var i = 0, len = anchors.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 529);
anchor = anchors[i];

            _yuitest_coverline("build/menu/menu.js", 531);
anchor.region = this._getAnchorRegion(anchor.point, childrenRegion,
                    parentRegion);

            _yuitest_coverline("build/menu/menu.js", 534);
anchor.score = this._inRegion(anchor.region, viewportRegion);
        }

        // Sort the anchors by score.
        _yuitest_coverline("build/menu/menu.js", 538);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 4)", 538);
_yuitest_coverline("build/menu/menu.js", 539);
if (a.score === b.score) {
                _yuitest_coverline("build/menu/menu.js", 540);
return 0;
            } else {_yuitest_coverline("build/menu/menu.js", 541);
if (a.score === true) {
                _yuitest_coverline("build/menu/menu.js", 542);
return -1;
            } else {_yuitest_coverline("build/menu/menu.js", 543);
if (b.score === true) {
                _yuitest_coverline("build/menu/menu.js", 544);
return 1;
            } else {
                _yuitest_coverline("build/menu/menu.js", 546);
return b.score - a.score;
            }}}
        });

        // Remember which anchors we used for this item so that we can default
        // that anchor for submenus of this item if necessary.
        _yuitest_coverline("build/menu/menu.js", 552);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/menu/menu.js", 555);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/menu/menu.js", 556);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterAdd", 568);
_yuitest_coverline("build/menu/menu.js", 570);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 571);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 574);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/menu/menu.js", 578);
if (parent === this.rootNode) {
            _yuitest_coverline("build/menu/menu.js", 579);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/menu/menu.js", 581);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/menu/menu.js", 582);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/menu/menu.js", 584);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/menu/menu.js", 587);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/menu/menu.js", 589);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/menu/menu.js", 593);
return;
            }
        }

        _yuitest_coverline("build/menu/menu.js", 597);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterClear", 608);
_yuitest_coverline("build/menu/menu.js", 609);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/menu/menu.js", 612);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 613);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 616);
delete this._childrenNode;
        _yuitest_coverline("build/menu/menu.js", 617);
this.rendered = false;

        _yuitest_coverline("build/menu/menu.js", 619);
this.get('container').empty();
        _yuitest_coverline("build/menu/menu.js", 620);
this.render();
    },

    /**
    Handles `close` events for this menu.

    @method _afterClose
    @param {EventFacade} e
    @protected
    **/
    _afterClose: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClose", 630);
_yuitest_coverline("build/menu/menu.js", 631);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/menu/menu.js", 635);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 636);
item.children[i].close();
        }

        _yuitest_coverline("build/menu/menu.js", 639);
item.close();
        _yuitest_coverline("build/menu/menu.js", 640);
delete this._openMenus[item.id];

        _yuitest_coverline("build/menu/menu.js", 642);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 643);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 644);
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
        _yuitest_coverfunc("build/menu/menu.js", "_afterOpen", 655);
_yuitest_coverline("build/menu/menu.js", 656);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/menu/menu.js", 661);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/menu/menu.js", 665);
if (parent.isOpen()) {
                _yuitest_coverline("build/menu/menu.js", 666);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/menu/menu.js", 667);
child = parent.children[i];

                    _yuitest_coverline("build/menu/menu.js", 669);
if (child !== item) {
                        _yuitest_coverline("build/menu/menu.js", 670);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/menu/menu.js", 675);
parent.open();
            }
        }

        _yuitest_coverline("build/menu/menu.js", 679);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/menu/menu.js", 681);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 682);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 683);
htmlNode.addClass(this.classNames.open);
        }
    },

    /**
    Handles `clickoutside` events for this menu.

    @method _afterOutsideClick
    @protected
    **/
    _afterOutsideClick: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_afterOutsideClick", 693);
_yuitest_coverline("build/menu/menu.js", 694);
this.closeSubMenus();
    },

    /**
    Handles `remove` events for this menu.

    @method _afterRemove
    @param {EventFacade} e
    @protected
    **/
    _afterRemove: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterRemove", 704);
_yuitest_coverline("build/menu/menu.js", 705);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/menu/menu.js", 707);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 708);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 711);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/menu/menu.js", 713);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 714);
htmlNode.remove(true);
            _yuitest_coverline("build/menu/menu.js", 715);
delete e.node._htmlNode;
        }
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
            isDisabled = item.isDisabled();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/menu/menu.js", 732);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/menu/menu.js", 733);
e._event.preventDefault();
        }

        _yuitest_coverline("build/menu/menu.js", 736);
if (isDisabled) {
            _yuitest_coverline("build/menu/menu.js", 737);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 740);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/menu/menu.js", 741);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defClickFn
            });
        }

        _yuitest_coverline("build/menu/menu.js", 746);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseEnter", 759);
_yuitest_coverline("build/menu/menu.js", 760);
var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        _yuitest_coverline("build/menu/menu.js", 763);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 765);
if (item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 766);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 769);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 5)", 769);
_yuitest_coverline("build/menu/menu.js", 770);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseLeave", 781);
_yuitest_coverline("build/menu/menu.js", 782);
var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        _yuitest_coverline("build/menu/menu.js", 785);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 787);
if (!item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 788);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 791);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 6)", 791);
_yuitest_coverline("build/menu/menu.js", 792);
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
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseEnter", 803);
_yuitest_coverline("build/menu/menu.js", 804);
clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseLeave", 814);
_yuitest_coverline("build/menu/menu.js", 815);
var self = this;

        _yuitest_coverline("build/menu/menu.js", 817);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/menu/menu.js", 819);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 7)", 819);
_yuitest_coverline("build/menu/menu.js", 820);
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
        _yuitest_coverfunc("build/menu/menu.js", "_defClickFn", 833);
_yuitest_coverline("build/menu/menu.js", 834);
var item = e.item;

        _yuitest_coverline("build/menu/menu.js", 836);
if (item.canHaveChildren) {
            _yuitest_coverline("build/menu/menu.js", 837);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/menu/menu.js", 838);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/menu/menu.js", 840);
e.item.toggle();
        } else {
            _yuitest_coverline("build/menu/menu.js", 842);
this.closeSubMenus();
        }
    }
});

_yuitest_coverline("build/menu/menu.js", 847);
Y.Menu = Y.mix(Menu, Y.Menu);


}, '@VERSION@', {"requires": ["classnamemanager", "event-hover", "event-outside", "menu-base", "menu-templates", "node-screen", "view"], "skinnable": true});
