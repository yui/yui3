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
_yuitest_coverage["build/menu/menu.js"].code=["YUI.add('menu', function (Y, NAME) {","","/**","Provides the `Y.Menu` widget.","","@module menu","@main menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@extends Menu.Base","@uses View","**/","","var getClassName = Y.ClassNameManager.getClassName,","","/**","Fired when a clickable menu item is clicked.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defClickFn","**/","EVT_ITEM_CLICK = 'itemClick',","","Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Closes all open submenus of this menu.","","    @method closeSubMenus","    @chainable","    **/","    closeSubMenus: function () {","        // Close all open submenus.","        Y.Object.each(this._openMenus, function (item) {","            item.close();","        }, this);","","        return this;","    },","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Renders this Menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode;","","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        switch (item.type) {","            case 'separator':","                htmlNode.set('role', 'separator');","                break;","","            case 'item':","            case 'heading':","                var labelNode = htmlNode.one('.' + classNames.label),","                    labelId   = labelNode.get('id');","","                labelNode.setHTML(item.label);","","                if (!labelId) {","                    labelId = Y.guid();","                    labelNode.set('id', labelId);","                }","","                htmlNode.set('aria-labelledby', labelId);","","                if (item.type === 'heading') {","                    htmlNode.set('role', 'heading');","                } else {","                    htmlNode.set('role', 'menuitem');","","                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                    if (item.canHaveChildren) {","                        htmlNode.addClass(classNames.canHaveChildren);","                        htmlNode.toggleClass(classNames.open, item.isOpen());","","                        if (item.hasChildren()) {","                            htmlNode.addClass(classNames.hasChildren);","","                            if (options.renderChildren) {","                                this.renderChildren(item, {","                                    container: htmlNode","                                });","                            }","                        }","                    }","                }","                break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add   : this._afterAdd,","                clear : this._afterClear,","                close : this._afterClose,","                open  : this._afterOpen,","                remove: this._afterRemove","            }),","","            container.on('hover', this._onMenuMouseEnter,","                    this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick,","                    '.' + classNames.item + '>.' + classNames.label, this),","","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave,","                    '.' + classNames.canHaveChildren, this),","","            container.after('clickoutside', this._afterOutsideClick, this)","        );","    },","","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    _getAnchorRegion: function (anchor, parentRegion, nodeRegion) {","        switch (anchor) {","        case 'tr':","            return {","                bottom: parentRegion.bottom,","                left  : parentRegion.right,","                right : parentRegion.right + nodeRegion.width,","                top   : parentRegion.bottom - nodeRegion.height","            };","","        case 'bl':","            return {","                bottom: parentRegion.top + nodeRegion.height,","                left  : parentRegion.left - nodeRegion.width,","                right : parentRegion.left,","                top   : parentRegion.top","            };","","        case 'tl':","            return {","                bottom: parentRegion.bottom,","                left  : parentRegion.left - nodeRegion.width,","                right : parentRegion.left,","                top   : parentRegion.bottom - nodeRegion.height","            };","","        default: // 'br' is the default anchor","            return {","                bottom: parentRegion.top + nodeRegion.height,","                left  : parentRegion.right,","                right : parentRegion.right + nodeRegion.width,","                top   : parentRegion.top","            };","        }","    },","","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var anchors = (item.parent && item.parent.data.menuAnchors) || [","                {point: 'br'},","                {point: 'bl'},","                {point: 'tr'},","                {point: 'tl'}","            ],","","            childrenNode   = htmlNode.one('.' + this.classNames.children),","            childrenRegion = childrenNode.get('region'),","            parentRegion   = htmlNode.get('region'),","            viewportRegion = htmlNode.get('viewportRegion');","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchor,","            anchorRegion;","","        for (var i = 0, len = anchors.length; i < len; i++) {","            anchor = anchors[i];","","            anchorRegion = anchor.region = this._getAnchorRegion(anchor.point, parentRegion, childrenRegion);","            anchor.score = this._inRegion(anchorRegion, viewportRegion);","        }","","        // Sort the anchors by score. Unscored regions will be given a low","        // default score so that they're sorted after scored regions.","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    _afterOutsideClick: function () {","        this.closeSubMenus();","    },","","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            isDisabled = item.isDisabled();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e._event.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defClickFn","            });","        }","","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e,","            item       : item","        });","    },","","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id')),","            self = this;","","        clearTimeout(this._timeouts[item.id]);","","        if (item.isOpen()) {","            return;","        }","","        this._timeouts[item.id] = setTimeout(function () {","            delete self._timeouts[item.id];","            item.open();","        }, 200);","    },","","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id')),","            self = this;","","        clearTimeout(this._timeouts[item.id]);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts[item.id] = setTimeout(function () {","            delete self._timeouts[item.id];","            item.close();","        }, 300);","    },","","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","        delete this._timeouts.menu;","    },","","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            delete self._timeouts.menu;","            self.closeSubMenus();","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","    _defClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts[item.id]);","            clearTimeout(this._timeouts.menu);","","            delete this._timeouts[item.id];","            delete this._timeouts.menu;","","            e.item.toggle();","        } else {","            this.closeSubMenus();","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {\"requires\": [\"classnamemanager\", \"event-hover\", \"event-outside\", \"menu-base\", \"menu-templates\", \"node-screen\", \"view\"], \"skinnable\": true});"];
_yuitest_coverage["build/menu/menu.js"].lines = {"1":0,"19":0,"65":0,"66":0,"67":0,"69":0,"73":0,"75":0,"76":0,"78":0,"79":0,"82":0,"95":0,"96":0,"99":0,"112":0,"113":0,"116":0,"129":0,"131":0,"134":0,"135":0,"137":0,"140":0,"144":0,"145":0,"148":0,"150":0,"168":0,"170":0,"173":0,"174":0,"181":0,"182":0,"183":0,"186":0,"187":0,"190":0,"191":0,"197":0,"198":0,"201":0,"219":0,"221":0,"224":0,"225":0,"232":0,"234":0,"235":0,"239":0,"242":0,"244":0,"245":0,"246":0,"249":0,"251":0,"252":0,"254":0,"256":0,"258":0,"259":0,"260":0,"262":0,"263":0,"265":0,"266":0,"273":0,"276":0,"277":0,"280":0,"286":0,"288":0,"291":0,"314":0,"318":0,"320":0,"328":0,"336":0,"344":0,"354":0,"356":0,"358":0,"359":0,"363":0,"369":0,"375":0,"384":0,"386":0,"401":0,"404":0,"405":0,"407":0,"408":0,"413":0,"414":0,"415":0,"416":0,"417":0,"418":0,"419":0,"421":0,"427":0,"430":0,"431":0,"438":0,"439":0,"442":0,"446":0,"447":0,"449":0,"450":0,"452":0,"455":0,"457":0,"461":0,"465":0,"471":0,"474":0,"475":0,"478":0,"479":0,"481":0,"482":0,"486":0,"490":0,"491":0,"494":0,"495":0,"497":0,"498":0,"499":0,"504":0,"509":0,"513":0,"514":0,"515":0,"517":0,"518":0,"523":0,"527":0,"529":0,"530":0,"531":0,"536":0,"540":0,"542":0,"543":0,"546":0,"548":0,"549":0,"550":0,"555":0,"560":0,"561":0,"564":0,"565":0,"568":0,"569":0,"574":0,"581":0,"584":0,"586":0,"587":0,"590":0,"591":0,"592":0,"597":0,"600":0,"602":0,"603":0,"606":0,"607":0,"608":0,"613":0,"614":0,"618":0,"620":0,"622":0,"623":0,"624":0,"630":0,"632":0,"633":0,"634":0,"636":0,"637":0,"639":0,"641":0,"646":0};
_yuitest_coverage["build/menu/menu.js"].functions = {"initializer:64":0,"(anonymous 2):78":0,"destructor:72":0,"(anonymous 3):95":0,"closeSubMenus:93":0,"getHTMLNode:111":0,"render:128":0,"renderChildren:167":0,"renderNode:218":0,"_attachMenuEvents:285":0,"_detachMenuEvents:313":0,"_getAnchorRegion:317":0,"_hideMenu:353":0,"_inRegion:362":0,"(anonymous 4):413":0,"_positionMenu:383":0,"_afterAdd:436":0,"_afterClear:470":0,"_afterClose:485":0,"_afterOpen:503":0,"_afterOutsideClick:535":0,"_afterRemove:539":0,"_onItemClick:554":0,"(anonymous 5):590":0,"_onItemMouseEnter:580":0,"(anonymous 6):606":0,"_onItemMouseLeave:596":0,"_onMenuMouseEnter:612":0,"(anonymous 7):622":0,"_onMenuMouseLeave:617":0,"_defClickFn:629":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu/menu.js"].coveredLines = 189;
_yuitest_coverage["build/menu/menu.js"].coveredFunctions = 32;
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
    Renders this Menu into its container.

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
            htmlNode   = item._htmlNode;

        _yuitest_coverline("build/menu/menu.js", 224);
if (!htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 225);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        _yuitest_coverline("build/menu/menu.js", 232);
switch (item.type) {
            case 'separator':
                _yuitest_coverline("build/menu/menu.js", 234);
htmlNode.set('role', 'separator');
                _yuitest_coverline("build/menu/menu.js", 235);
break;

            case 'item':
            case 'heading':
                _yuitest_coverline("build/menu/menu.js", 239);
var labelNode = htmlNode.one('.' + classNames.label),
                    labelId   = labelNode.get('id');

                _yuitest_coverline("build/menu/menu.js", 242);
labelNode.setHTML(item.label);

                _yuitest_coverline("build/menu/menu.js", 244);
if (!labelId) {
                    _yuitest_coverline("build/menu/menu.js", 245);
labelId = Y.guid();
                    _yuitest_coverline("build/menu/menu.js", 246);
labelNode.set('id', labelId);
                }

                _yuitest_coverline("build/menu/menu.js", 249);
htmlNode.set('aria-labelledby', labelId);

                _yuitest_coverline("build/menu/menu.js", 251);
if (item.type === 'heading') {
                    _yuitest_coverline("build/menu/menu.js", 252);
htmlNode.set('role', 'heading');
                } else {
                    _yuitest_coverline("build/menu/menu.js", 254);
htmlNode.set('role', 'menuitem');

                    _yuitest_coverline("build/menu/menu.js", 256);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                    _yuitest_coverline("build/menu/menu.js", 258);
if (item.canHaveChildren) {
                        _yuitest_coverline("build/menu/menu.js", 259);
htmlNode.addClass(classNames.canHaveChildren);
                        _yuitest_coverline("build/menu/menu.js", 260);
htmlNode.toggleClass(classNames.open, item.isOpen());

                        _yuitest_coverline("build/menu/menu.js", 262);
if (item.hasChildren()) {
                            _yuitest_coverline("build/menu/menu.js", 263);
htmlNode.addClass(classNames.hasChildren);

                            _yuitest_coverline("build/menu/menu.js", 265);
if (options.renderChildren) {
                                _yuitest_coverline("build/menu/menu.js", 266);
this.renderChildren(item, {
                                    container: htmlNode
                                });
                            }
                        }
                    }
                }
                _yuitest_coverline("build/menu/menu.js", 273);
break;
        }

        _yuitest_coverline("build/menu/menu.js", 276);
if (options.container) {
            _yuitest_coverline("build/menu/menu.js", 277);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/menu/menu.js", 280);
return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_attachMenuEvents", 285);
_yuitest_coverline("build/menu/menu.js", 286);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/menu/menu.js", 288);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 291);
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
        _yuitest_coverfunc("build/menu/menu.js", "_detachMenuEvents", 313);
_yuitest_coverline("build/menu/menu.js", 314);
(new Y.EventHandle(this._menuEvents)).detach();
    },

    _getAnchorRegion: function (anchor, parentRegion, nodeRegion) {
        _yuitest_coverfunc("build/menu/menu.js", "_getAnchorRegion", 317);
_yuitest_coverline("build/menu/menu.js", 318);
switch (anchor) {
        case 'tr':
            _yuitest_coverline("build/menu/menu.js", 320);
return {
                bottom: parentRegion.bottom,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.bottom - nodeRegion.height
            };

        case 'bl':
            _yuitest_coverline("build/menu/menu.js", 328);
return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.top
            };

        case 'tl':
            _yuitest_coverline("build/menu/menu.js", 336);
return {
                bottom: parentRegion.bottom,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.bottom - nodeRegion.height
            };

        default: // 'br' is the default anchor
            _yuitest_coverline("build/menu/menu.js", 344);
return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.top
            };
        }
    },

    _hideMenu: function (item, htmlNode) {
        _yuitest_coverfunc("build/menu/menu.js", "_hideMenu", 353);
_yuitest_coverline("build/menu/menu.js", 354);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 356);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 358);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/menu/menu.js", 359);
delete item.data.menuAnchor;
    },

    _inRegion: function (inner, outer) {
        _yuitest_coverfunc("build/menu/menu.js", "_inRegion", 362);
_yuitest_coverline("build/menu/menu.js", 363);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/menu/menu.js", 369);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/menu/menu.js", 375);
return (
            Math.min(outer.bottom - inner.bottom, 0) +
            Math.min(inner.left - outer.left, 0) +
            Math.min(outer.right - inner.right, 0) +
            Math.min(inner.top - outer.top, 0)
        );
    },

    _positionMenu: function (item, htmlNode) {
        _yuitest_coverfunc("build/menu/menu.js", "_positionMenu", 383);
_yuitest_coverline("build/menu/menu.js", 384);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 386);
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
        _yuitest_coverline("build/menu/menu.js", 401);
var anchor,
            anchorRegion;

        _yuitest_coverline("build/menu/menu.js", 404);
for (var i = 0, len = anchors.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 405);
anchor = anchors[i];

            _yuitest_coverline("build/menu/menu.js", 407);
anchorRegion = anchor.region = this._getAnchorRegion(anchor.point, parentRegion, childrenRegion);
            _yuitest_coverline("build/menu/menu.js", 408);
anchor.score = this._inRegion(anchorRegion, viewportRegion);
        }

        // Sort the anchors by score. Unscored regions will be given a low
        // default score so that they're sorted after scored regions.
        _yuitest_coverline("build/menu/menu.js", 413);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 4)", 413);
_yuitest_coverline("build/menu/menu.js", 414);
if (a.score === b.score) {
                _yuitest_coverline("build/menu/menu.js", 415);
return 0;
            } else {_yuitest_coverline("build/menu/menu.js", 416);
if (a.score === true) {
                _yuitest_coverline("build/menu/menu.js", 417);
return -1;
            } else {_yuitest_coverline("build/menu/menu.js", 418);
if (b.score === true) {
                _yuitest_coverline("build/menu/menu.js", 419);
return 1;
            } else {
                _yuitest_coverline("build/menu/menu.js", 421);
return b.score - a.score;
            }}}
        });

        // Remember which anchors we used for this item so that we can default
        // that anchor for submenus of this item if necessary.
        _yuitest_coverline("build/menu/menu.js", 427);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/menu/menu.js", 430);
anchorRegion = anchors[0].region;
        _yuitest_coverline("build/menu/menu.js", 431);
childrenNode.setXY([anchorRegion.left, anchorRegion.top]);
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverfunc("build/menu/menu.js", "_afterAdd", 436);
_yuitest_coverline("build/menu/menu.js", 438);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 439);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 442);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/menu/menu.js", 446);
if (parent === this.rootNode) {
            _yuitest_coverline("build/menu/menu.js", 447);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/menu/menu.js", 449);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/menu/menu.js", 450);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/menu/menu.js", 452);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/menu/menu.js", 455);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/menu/menu.js", 457);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/menu/menu.js", 461);
return;
            }
        }

        _yuitest_coverline("build/menu/menu.js", 465);
htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: true
        }), e.index);
    },

    _afterClear: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClear", 470);
_yuitest_coverline("build/menu/menu.js", 471);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/menu/menu.js", 474);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 475);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 478);
delete this._childrenNode;
        _yuitest_coverline("build/menu/menu.js", 479);
this.rendered = false;

        _yuitest_coverline("build/menu/menu.js", 481);
this.get('container').empty();
        _yuitest_coverline("build/menu/menu.js", 482);
this.render();
    },

    _afterClose: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClose", 485);
_yuitest_coverline("build/menu/menu.js", 486);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/menu/menu.js", 490);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 491);
item.children[i].close();
        }

        _yuitest_coverline("build/menu/menu.js", 494);
item.close();
        _yuitest_coverline("build/menu/menu.js", 495);
delete this._openMenus[item.id];

        _yuitest_coverline("build/menu/menu.js", 497);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 498);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 499);
htmlNode.removeClass(this.classNames.open);
        }
    },

    _afterOpen: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterOpen", 503);
_yuitest_coverline("build/menu/menu.js", 504);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/menu/menu.js", 509);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/menu/menu.js", 513);
if (parent.isOpen()) {
                _yuitest_coverline("build/menu/menu.js", 514);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/menu/menu.js", 515);
child = parent.children[i];

                    _yuitest_coverline("build/menu/menu.js", 517);
if (child !== item) {
                        _yuitest_coverline("build/menu/menu.js", 518);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/menu/menu.js", 523);
parent.open();
            }
        }

        _yuitest_coverline("build/menu/menu.js", 527);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/menu/menu.js", 529);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 530);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 531);
htmlNode.addClass(this.classNames.open);
        }
    },

    _afterOutsideClick: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_afterOutsideClick", 535);
_yuitest_coverline("build/menu/menu.js", 536);
this.closeSubMenus();
    },

    _afterRemove: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterRemove", 539);
_yuitest_coverline("build/menu/menu.js", 540);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/menu/menu.js", 542);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 543);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 546);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/menu/menu.js", 548);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 549);
htmlNode.remove(true);
            _yuitest_coverline("build/menu/menu.js", 550);
delete e.node._htmlNode;
        }
    },

    _onItemClick: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemClick", 554);
_yuitest_coverline("build/menu/menu.js", 555);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            isDisabled = item.isDisabled();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/menu/menu.js", 560);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/menu/menu.js", 561);
e._event.preventDefault();
        }

        _yuitest_coverline("build/menu/menu.js", 564);
if (isDisabled) {
            _yuitest_coverline("build/menu/menu.js", 565);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 568);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/menu/menu.js", 569);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defClickFn
            });
        }

        _yuitest_coverline("build/menu/menu.js", 574);
this.fire(EVT_ITEM_CLICK, {
            originEvent: e,
            item       : item
        });
    },

    _onItemMouseEnter: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseEnter", 580);
_yuitest_coverline("build/menu/menu.js", 581);
var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        _yuitest_coverline("build/menu/menu.js", 584);
clearTimeout(this._timeouts[item.id]);

        _yuitest_coverline("build/menu/menu.js", 586);
if (item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 587);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 590);
this._timeouts[item.id] = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 5)", 590);
_yuitest_coverline("build/menu/menu.js", 591);
delete self._timeouts[item.id];
            _yuitest_coverline("build/menu/menu.js", 592);
item.open();
        }, 200);
    },

    _onItemMouseLeave: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseLeave", 596);
_yuitest_coverline("build/menu/menu.js", 597);
var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        _yuitest_coverline("build/menu/menu.js", 600);
clearTimeout(this._timeouts[item.id]);

        _yuitest_coverline("build/menu/menu.js", 602);
if (!item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 603);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 606);
this._timeouts[item.id] = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 6)", 606);
_yuitest_coverline("build/menu/menu.js", 607);
delete self._timeouts[item.id];
            _yuitest_coverline("build/menu/menu.js", 608);
item.close();
        }, 300);
    },

    _onMenuMouseEnter: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseEnter", 612);
_yuitest_coverline("build/menu/menu.js", 613);
clearTimeout(this._timeouts.menu);
        _yuitest_coverline("build/menu/menu.js", 614);
delete this._timeouts.menu;
    },

    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseLeave", 617);
_yuitest_coverline("build/menu/menu.js", 618);
var self = this;

        _yuitest_coverline("build/menu/menu.js", 620);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/menu/menu.js", 622);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 7)", 622);
_yuitest_coverline("build/menu/menu.js", 623);
delete self._timeouts.menu;
            _yuitest_coverline("build/menu/menu.js", 624);
self.closeSubMenus();
        }, 500);
    },

    // -- Default Event Handlers -----------------------------------------------
    _defClickFn: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_defClickFn", 629);
_yuitest_coverline("build/menu/menu.js", 630);
var item = e.item;

        _yuitest_coverline("build/menu/menu.js", 632);
if (item.canHaveChildren) {
            _yuitest_coverline("build/menu/menu.js", 633);
clearTimeout(this._timeouts[item.id]);
            _yuitest_coverline("build/menu/menu.js", 634);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/menu/menu.js", 636);
delete this._timeouts[item.id];
            _yuitest_coverline("build/menu/menu.js", 637);
delete this._timeouts.menu;

            _yuitest_coverline("build/menu/menu.js", 639);
e.item.toggle();
        } else {
            _yuitest_coverline("build/menu/menu.js", 641);
this.closeSubMenus();
        }
    }
});

_yuitest_coverline("build/menu/menu.js", 646);
Y.Menu = Y.mix(Menu, Y.Menu);


}, '@VERSION@', {"requires": ["classnamemanager", "event-hover", "event-outside", "menu-base", "menu-templates", "node-screen", "view"], "skinnable": true});
