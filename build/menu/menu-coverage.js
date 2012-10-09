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
_yuitest_coverage["build/menu/menu.js"].code=["YUI.add('menu', function (Y, NAME) {","","/**","Provides the `Y.Menu` widget.","","@module menu","@main menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@extends Menu.Base","@uses View","**/","","var getClassName = Y.ClassNameManager.getClassName,","","/**","Fired when a clickable menu item is clicked.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defClickFn","**/","EVT_ITEM_CLICK = 'itemClick',","","Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Closes all open submenus of this menu.","","    @method closeSubMenus","    @chainable","    **/","    closeSubMenus: function () {","        // Close all open submenus.","        Y.Object.each(this._openMenus, function (item) {","            item.close();","        }, this);","","        return this;","    },","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    hide: function () {","        if (this.rendered) {","            this.get('container').removeClass(this.classNames.open);","        }","","        return this;","    },","","    isVisible: function () {","        // TODO: maintain state internally rather than relying on the \"open\" class.","        return this.rendered && this.get('container').hasClass(this.classNames.open);","    },","","    /**","    Renders this Menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode;","","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        switch (item.type) {","            case 'separator':","                htmlNode.set('role', 'separator');","                break;","","            case 'item':","            case 'heading':","                var labelNode = htmlNode.one('.' + classNames.label),","                    labelId   = labelNode.get('id');","","                labelNode.setHTML(item.label);","","                if (!labelId) {","                    labelId = Y.guid();","                    labelNode.set('id', labelId);","                }","","                htmlNode.set('aria-labelledby', labelId);","","                if (item.type === 'heading') {","                    htmlNode.set('role', 'heading');","                } else {","                    htmlNode.set('role', 'menuitem');","","                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                    if (item.canHaveChildren) {","                        htmlNode.addClass(classNames.canHaveChildren);","                        htmlNode.toggleClass(classNames.open, item.isOpen());","","                        if (item.hasChildren()) {","                            htmlNode.addClass(classNames.hasChildren);","","                            if (options.renderChildren) {","                                this.renderChildren(item, {","                                    container: htmlNode","                                });","                            }","                        }","                    }","                }","                break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    show: function () {","        if (this.rendered) {","            this.get('container').addClass(this.classNames.open);","        }","","        return this;","    },","","    toggle: function () {","        if (this.rendered) {","            this.get('container').toggleClass(this.classNames.open);","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add   : this._afterAdd,","                clear : this._afterClear,","                close : this._afterClose,","                open  : this._afterOpen,","                remove: this._afterRemove","            }),","","            container.on('hover', this._onMenuMouseEnter,","                    this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick,","                    '.' + classNames.item + '>.' + classNames.label, this),","","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave,","                    '.' + classNames.canHaveChildren, this),","","            container.after('clickoutside', this._afterOutsideClick, this)","        );","    },","","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        switch (anchor) {","        case 'tl-tr':","            return {","                bottom: parentRegion.top + nodeRegion.height,","                left  : parentRegion.right,","                right : parentRegion.right + nodeRegion.width,","                top   : parentRegion.top","            };","","        case 'bl-br':","            return {","                bottom: parentRegion.bottom,","                left  : parentRegion.right,","                right : parentRegion.right + nodeRegion.width,","                top   : parentRegion.bottom - nodeRegion.height","            };","","        case 'tr-tl':","            return {","                bottom: parentRegion.top + nodeRegion.height,","                left  : parentRegion.left - nodeRegion.width,","                right : parentRegion.left,","                top   : parentRegion.top","            };","","        case 'br-bl':","            return {","                bottom: parentRegion.bottom,","                left  : parentRegion.left - nodeRegion.width,","                right : parentRegion.left,","                top   : parentRegion.bottom - nodeRegion.height","            };","        }","    },","","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var anchors = (item.parent && item.parent.data.menuAnchors) || [","                {point: 'tl-tr'},","                {point: 'bl-br'},","                {point: 'tr-tl'},","                {point: 'br-bl'}","            ],","","            childrenNode   = htmlNode.one('.' + this.classNames.children),","            childrenRegion = childrenNode.get('region'),","            parentRegion   = htmlNode.get('region'),","            viewportRegion = htmlNode.get('viewportRegion');","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchor;","","        for (var i = 0, len = anchors.length; i < len; i++) {","            anchor = anchors[i];","","            anchor.region = this._getAnchorRegion(anchor.point, childrenRegion,","                    parentRegion);","","            anchor.score = this._inRegion(anchor.region, viewportRegion);","        }","","        // Sort the anchors by score. Unscored regions will be given a low","        // default score so that they're sorted after scored regions.","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    _afterOutsideClick: function () {","        this.closeSubMenus();","    },","","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            isDisabled = item.isDisabled();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e._event.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defClickFn","            });","        }","","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e,","            item       : item","        });","    },","","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id')),","            self = this;","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id')),","            self = this;","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","    _defClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggle();","        } else {","            this.closeSubMenus();","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {\"requires\": [\"classnamemanager\", \"event-hover\", \"event-outside\", \"menu-base\", \"menu-templates\", \"node-screen\", \"view\"], \"skinnable\": true});"];
_yuitest_coverage["build/menu/menu.js"].lines = {"1":0,"19":0,"65":0,"66":0,"67":0,"69":0,"73":0,"75":0,"76":0,"78":0,"79":0,"82":0,"95":0,"96":0,"99":0,"112":0,"113":0,"116":0,"120":0,"121":0,"124":0,"129":0,"142":0,"144":0,"147":0,"148":0,"150":0,"153":0,"157":0,"158":0,"161":0,"163":0,"181":0,"183":0,"186":0,"187":0,"194":0,"195":0,"196":0,"199":0,"200":0,"203":0,"204":0,"210":0,"211":0,"214":0,"232":0,"234":0,"237":0,"238":0,"245":0,"247":0,"248":0,"252":0,"255":0,"257":0,"258":0,"259":0,"262":0,"264":0,"265":0,"267":0,"269":0,"271":0,"272":0,"273":0,"275":0,"276":0,"278":0,"279":0,"286":0,"289":0,"290":0,"293":0,"297":0,"298":0,"301":0,"305":0,"306":0,"309":0,"315":0,"317":0,"320":0,"343":0,"347":0,"349":0,"357":0,"365":0,"373":0,"383":0,"385":0,"387":0,"388":0,"392":0,"398":0,"404":0,"413":0,"415":0,"430":0,"432":0,"433":0,"435":0,"438":0,"443":0,"444":0,"445":0,"446":0,"447":0,"448":0,"449":0,"451":0,"457":0,"460":0,"461":0,"468":0,"469":0,"472":0,"476":0,"477":0,"479":0,"480":0,"482":0,"485":0,"487":0,"491":0,"495":0,"501":0,"504":0,"505":0,"508":0,"509":0,"511":0,"512":0,"516":0,"520":0,"521":0,"524":0,"525":0,"527":0,"528":0,"529":0,"534":0,"539":0,"543":0,"544":0,"545":0,"547":0,"548":0,"553":0,"557":0,"559":0,"560":0,"561":0,"566":0,"570":0,"572":0,"573":0,"576":0,"578":0,"579":0,"580":0,"585":0,"590":0,"591":0,"594":0,"595":0,"598":0,"599":0,"604":0,"611":0,"614":0,"616":0,"617":0,"620":0,"621":0,"626":0,"629":0,"631":0,"632":0,"635":0,"636":0,"641":0,"645":0,"647":0,"649":0,"650":0,"656":0,"658":0,"659":0,"660":0,"662":0,"664":0,"669":0};
_yuitest_coverage["build/menu/menu.js"].functions = {"initializer:64":0,"(anonymous 2):78":0,"destructor:72":0,"(anonymous 3):95":0,"closeSubMenus:93":0,"getHTMLNode:111":0,"hide:119":0,"isVisible:127":0,"render:141":0,"renderChildren:180":0,"renderNode:231":0,"show:296":0,"toggle:304":0,"_attachMenuEvents:314":0,"_detachMenuEvents:342":0,"_getAnchorRegion:346":0,"_hideMenu:382":0,"_inRegion:391":0,"(anonymous 4):443":0,"_positionMenu:412":0,"_afterAdd:466":0,"_afterClear:500":0,"_afterClose:515":0,"_afterOpen:533":0,"_afterOutsideClick:565":0,"_afterRemove:569":0,"_onItemClick:584":0,"(anonymous 5):620":0,"_onItemMouseEnter:610":0,"(anonymous 6):635":0,"_onItemMouseLeave:625":0,"_onMenuMouseEnter:640":0,"(anonymous 7):649":0,"_onMenuMouseLeave:644":0,"_defClickFn:655":0,"(anonymous 1):1":0};
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

    hide: function () {
        _yuitest_coverfunc("build/menu/menu.js", "hide", 119);
_yuitest_coverline("build/menu/menu.js", 120);
if (this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 121);
this.get('container').removeClass(this.classNames.open);
        }

        _yuitest_coverline("build/menu/menu.js", 124);
return this;
    },

    isVisible: function () {
        // TODO: maintain state internally rather than relying on the "open" class.
        _yuitest_coverfunc("build/menu/menu.js", "isVisible", 127);
_yuitest_coverline("build/menu/menu.js", 129);
return this.rendered && this.get('container').hasClass(this.classNames.open);
    },

    /**
    Renders this Menu into its container.

    If the container hasn't already been added to the current document, it will
    be appended to the `<body>` element.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/menu/menu.js", "render", 141);
_yuitest_coverline("build/menu/menu.js", 142);
var container = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 144);
container.addClass(this.classNames.menu);

        // Detect touchscreen devices.
        _yuitest_coverline("build/menu/menu.js", 147);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/menu/menu.js", 148);
container.addClass(this.classNames.touch);
        } else {
            _yuitest_coverline("build/menu/menu.js", 150);
container.addClass(this.classNames.noTouch);
        }

        _yuitest_coverline("build/menu/menu.js", 153);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/menu/menu.js", 157);
if (!container.inDoc()) {
            _yuitest_coverline("build/menu/menu.js", 158);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/menu/menu.js", 161);
this.rendered = true;

        _yuitest_coverline("build/menu/menu.js", 163);
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
        _yuitest_coverfunc("build/menu/menu.js", "renderChildren", 180);
_yuitest_coverline("build/menu/menu.js", 181);
options || (options = {});

        _yuitest_coverline("build/menu/menu.js", 183);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 186);
if (!childrenNode) {
            _yuitest_coverline("build/menu/menu.js", 187);
childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        _yuitest_coverline("build/menu/menu.js", 194);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/menu/menu.js", 195);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/menu/menu.js", 196);
childrenNode.set('role', 'menu');
        }

        _yuitest_coverline("build/menu/menu.js", 199);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/menu/menu.js", 200);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/menu/menu.js", 203);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 204);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/menu/menu.js", 210);
if (container) {
            _yuitest_coverline("build/menu/menu.js", 211);
container.append(childrenNode);
        }

        _yuitest_coverline("build/menu/menu.js", 214);
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
        _yuitest_coverfunc("build/menu/menu.js", "renderNode", 231);
_yuitest_coverline("build/menu/menu.js", 232);
options || (options = {});

        _yuitest_coverline("build/menu/menu.js", 234);
var classNames = this.classNames,
            htmlNode   = item._htmlNode;

        _yuitest_coverline("build/menu/menu.js", 237);
if (!htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 238);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        _yuitest_coverline("build/menu/menu.js", 245);
switch (item.type) {
            case 'separator':
                _yuitest_coverline("build/menu/menu.js", 247);
htmlNode.set('role', 'separator');
                _yuitest_coverline("build/menu/menu.js", 248);
break;

            case 'item':
            case 'heading':
                _yuitest_coverline("build/menu/menu.js", 252);
var labelNode = htmlNode.one('.' + classNames.label),
                    labelId   = labelNode.get('id');

                _yuitest_coverline("build/menu/menu.js", 255);
labelNode.setHTML(item.label);

                _yuitest_coverline("build/menu/menu.js", 257);
if (!labelId) {
                    _yuitest_coverline("build/menu/menu.js", 258);
labelId = Y.guid();
                    _yuitest_coverline("build/menu/menu.js", 259);
labelNode.set('id', labelId);
                }

                _yuitest_coverline("build/menu/menu.js", 262);
htmlNode.set('aria-labelledby', labelId);

                _yuitest_coverline("build/menu/menu.js", 264);
if (item.type === 'heading') {
                    _yuitest_coverline("build/menu/menu.js", 265);
htmlNode.set('role', 'heading');
                } else {
                    _yuitest_coverline("build/menu/menu.js", 267);
htmlNode.set('role', 'menuitem');

                    _yuitest_coverline("build/menu/menu.js", 269);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                    _yuitest_coverline("build/menu/menu.js", 271);
if (item.canHaveChildren) {
                        _yuitest_coverline("build/menu/menu.js", 272);
htmlNode.addClass(classNames.canHaveChildren);
                        _yuitest_coverline("build/menu/menu.js", 273);
htmlNode.toggleClass(classNames.open, item.isOpen());

                        _yuitest_coverline("build/menu/menu.js", 275);
if (item.hasChildren()) {
                            _yuitest_coverline("build/menu/menu.js", 276);
htmlNode.addClass(classNames.hasChildren);

                            _yuitest_coverline("build/menu/menu.js", 278);
if (options.renderChildren) {
                                _yuitest_coverline("build/menu/menu.js", 279);
this.renderChildren(item, {
                                    container: htmlNode
                                });
                            }
                        }
                    }
                }
                _yuitest_coverline("build/menu/menu.js", 286);
break;
        }

        _yuitest_coverline("build/menu/menu.js", 289);
if (options.container) {
            _yuitest_coverline("build/menu/menu.js", 290);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/menu/menu.js", 293);
return htmlNode;
    },

    show: function () {
        _yuitest_coverfunc("build/menu/menu.js", "show", 296);
_yuitest_coverline("build/menu/menu.js", 297);
if (this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 298);
this.get('container').addClass(this.classNames.open);
        }

        _yuitest_coverline("build/menu/menu.js", 301);
return this;
    },

    toggle: function () {
        _yuitest_coverfunc("build/menu/menu.js", "toggle", 304);
_yuitest_coverline("build/menu/menu.js", 305);
if (this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 306);
this.get('container').toggleClass(this.classNames.open);
        }

        _yuitest_coverline("build/menu/menu.js", 309);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_attachMenuEvents", 314);
_yuitest_coverline("build/menu/menu.js", 315);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/menu/menu.js", 317);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/menu/menu.js", 320);
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
        _yuitest_coverfunc("build/menu/menu.js", "_detachMenuEvents", 342);
_yuitest_coverline("build/menu/menu.js", 343);
(new Y.EventHandle(this._menuEvents)).detach();
    },

    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {
        _yuitest_coverfunc("build/menu/menu.js", "_getAnchorRegion", 346);
_yuitest_coverline("build/menu/menu.js", 347);
switch (anchor) {
        case 'tl-tr':
            _yuitest_coverline("build/menu/menu.js", 349);
return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.top
            };

        case 'bl-br':
            _yuitest_coverline("build/menu/menu.js", 357);
return {
                bottom: parentRegion.bottom,
                left  : parentRegion.right,
                right : parentRegion.right + nodeRegion.width,
                top   : parentRegion.bottom - nodeRegion.height
            };

        case 'tr-tl':
            _yuitest_coverline("build/menu/menu.js", 365);
return {
                bottom: parentRegion.top + nodeRegion.height,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.top
            };

        case 'br-bl':
            _yuitest_coverline("build/menu/menu.js", 373);
return {
                bottom: parentRegion.bottom,
                left  : parentRegion.left - nodeRegion.width,
                right : parentRegion.left,
                top   : parentRegion.bottom - nodeRegion.height
            };
        }
    },

    _hideMenu: function (item, htmlNode) {
        _yuitest_coverfunc("build/menu/menu.js", "_hideMenu", 382);
_yuitest_coverline("build/menu/menu.js", 383);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 385);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/menu/menu.js", 387);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/menu/menu.js", 388);
delete item.data.menuAnchor;
    },

    _inRegion: function (inner, outer) {
        _yuitest_coverfunc("build/menu/menu.js", "_inRegion", 391);
_yuitest_coverline("build/menu/menu.js", 392);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/menu/menu.js", 398);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/menu/menu.js", 404);
return (
            Math.min(outer.bottom - inner.bottom, 0) +
            Math.min(inner.left - outer.left, 0) +
            Math.min(outer.right - inner.right, 0) +
            Math.min(inner.top - outer.top, 0)
        );
    },

    _positionMenu: function (item, htmlNode) {
        _yuitest_coverfunc("build/menu/menu.js", "_positionMenu", 412);
_yuitest_coverline("build/menu/menu.js", 413);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/menu/menu.js", 415);
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
        _yuitest_coverline("build/menu/menu.js", 430);
var anchor;

        _yuitest_coverline("build/menu/menu.js", 432);
for (var i = 0, len = anchors.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 433);
anchor = anchors[i];

            _yuitest_coverline("build/menu/menu.js", 435);
anchor.region = this._getAnchorRegion(anchor.point, childrenRegion,
                    parentRegion);

            _yuitest_coverline("build/menu/menu.js", 438);
anchor.score = this._inRegion(anchor.region, viewportRegion);
        }

        // Sort the anchors by score. Unscored regions will be given a low
        // default score so that they're sorted after scored regions.
        _yuitest_coverline("build/menu/menu.js", 443);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 4)", 443);
_yuitest_coverline("build/menu/menu.js", 444);
if (a.score === b.score) {
                _yuitest_coverline("build/menu/menu.js", 445);
return 0;
            } else {_yuitest_coverline("build/menu/menu.js", 446);
if (a.score === true) {
                _yuitest_coverline("build/menu/menu.js", 447);
return -1;
            } else {_yuitest_coverline("build/menu/menu.js", 448);
if (b.score === true) {
                _yuitest_coverline("build/menu/menu.js", 449);
return 1;
            } else {
                _yuitest_coverline("build/menu/menu.js", 451);
return b.score - a.score;
            }}}
        });

        // Remember which anchors we used for this item so that we can default
        // that anchor for submenus of this item if necessary.
        _yuitest_coverline("build/menu/menu.js", 457);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/menu/menu.js", 460);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/menu/menu.js", 461);
childrenNode.setXY([anchorRegion.left, anchorRegion.top]);
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverfunc("build/menu/menu.js", "_afterAdd", 466);
_yuitest_coverline("build/menu/menu.js", 468);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 469);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 472);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/menu/menu.js", 476);
if (parent === this.rootNode) {
            _yuitest_coverline("build/menu/menu.js", 477);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/menu/menu.js", 479);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/menu/menu.js", 480);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/menu/menu.js", 482);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/menu/menu.js", 485);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/menu/menu.js", 487);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/menu/menu.js", 491);
return;
            }
        }

        _yuitest_coverline("build/menu/menu.js", 495);
htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: true
        }), e.index);
    },

    _afterClear: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClear", 500);
_yuitest_coverline("build/menu/menu.js", 501);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/menu/menu.js", 504);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 505);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 508);
delete this._childrenNode;
        _yuitest_coverline("build/menu/menu.js", 509);
this.rendered = false;

        _yuitest_coverline("build/menu/menu.js", 511);
this.get('container').empty();
        _yuitest_coverline("build/menu/menu.js", 512);
this.render();
    },

    _afterClose: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterClose", 515);
_yuitest_coverline("build/menu/menu.js", 516);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/menu/menu.js", 520);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/menu/menu.js", 521);
item.children[i].close();
        }

        _yuitest_coverline("build/menu/menu.js", 524);
item.close();
        _yuitest_coverline("build/menu/menu.js", 525);
delete this._openMenus[item.id];

        _yuitest_coverline("build/menu/menu.js", 527);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 528);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 529);
htmlNode.removeClass(this.classNames.open);
        }
    },

    _afterOpen: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterOpen", 533);
_yuitest_coverline("build/menu/menu.js", 534);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/menu/menu.js", 539);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/menu/menu.js", 543);
if (parent.isOpen()) {
                _yuitest_coverline("build/menu/menu.js", 544);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/menu/menu.js", 545);
child = parent.children[i];

                    _yuitest_coverline("build/menu/menu.js", 547);
if (child !== item) {
                        _yuitest_coverline("build/menu/menu.js", 548);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/menu/menu.js", 553);
parent.open();
            }
        }

        _yuitest_coverline("build/menu/menu.js", 557);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/menu/menu.js", 559);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 560);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/menu/menu.js", 561);
htmlNode.addClass(this.classNames.open);
        }
    },

    _afterOutsideClick: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_afterOutsideClick", 565);
_yuitest_coverline("build/menu/menu.js", 566);
this.closeSubMenus();
    },

    _afterRemove: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_afterRemove", 569);
_yuitest_coverline("build/menu/menu.js", 570);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/menu/menu.js", 572);
if (!this.rendered) {
            _yuitest_coverline("build/menu/menu.js", 573);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 576);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/menu/menu.js", 578);
if (htmlNode) {
            _yuitest_coverline("build/menu/menu.js", 579);
htmlNode.remove(true);
            _yuitest_coverline("build/menu/menu.js", 580);
delete e.node._htmlNode;
        }
    },

    _onItemClick: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemClick", 584);
_yuitest_coverline("build/menu/menu.js", 585);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            isDisabled = item.isDisabled();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/menu/menu.js", 590);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/menu/menu.js", 591);
e._event.preventDefault();
        }

        _yuitest_coverline("build/menu/menu.js", 594);
if (isDisabled) {
            _yuitest_coverline("build/menu/menu.js", 595);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 598);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/menu/menu.js", 599);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defClickFn
            });
        }

        _yuitest_coverline("build/menu/menu.js", 604);
this.fire(EVT_ITEM_CLICK, {
            originEvent: e,
            item       : item
        });
    },

    _onItemMouseEnter: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseEnter", 610);
_yuitest_coverline("build/menu/menu.js", 611);
var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        _yuitest_coverline("build/menu/menu.js", 614);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 616);
if (item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 617);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 620);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 5)", 620);
_yuitest_coverline("build/menu/menu.js", 621);
item.open();
        }, 200); // TODO: make timeouts configurable
    },

    _onItemMouseLeave: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_onItemMouseLeave", 625);
_yuitest_coverline("build/menu/menu.js", 626);
var item = this.getNodeById(e.currentTarget.get('id')),
            self = this;

        _yuitest_coverline("build/menu/menu.js", 629);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/menu/menu.js", 631);
if (!item.isOpen()) {
            _yuitest_coverline("build/menu/menu.js", 632);
return;
        }

        _yuitest_coverline("build/menu/menu.js", 635);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 6)", 635);
_yuitest_coverline("build/menu/menu.js", 636);
item.close();
        }, 300);
    },

    _onMenuMouseEnter: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseEnter", 640);
_yuitest_coverline("build/menu/menu.js", 641);
clearTimeout(this._timeouts.menu);
    },

    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/menu/menu.js", "_onMenuMouseLeave", 644);
_yuitest_coverline("build/menu/menu.js", 645);
var self = this;

        _yuitest_coverline("build/menu/menu.js", 647);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/menu/menu.js", 649);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/menu/menu.js", "(anonymous 7)", 649);
_yuitest_coverline("build/menu/menu.js", 650);
self.closeSubMenus();
        }, 500);
    },

    // -- Default Event Handlers -----------------------------------------------
    _defClickFn: function (e) {
        _yuitest_coverfunc("build/menu/menu.js", "_defClickFn", 655);
_yuitest_coverline("build/menu/menu.js", 656);
var item = e.item;

        _yuitest_coverline("build/menu/menu.js", 658);
if (item.canHaveChildren) {
            _yuitest_coverline("build/menu/menu.js", 659);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/menu/menu.js", 660);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/menu/menu.js", 662);
e.item.toggle();
        } else {
            _yuitest_coverline("build/menu/menu.js", 664);
this.closeSubMenus();
        }
    }
});

_yuitest_coverline("build/menu/menu.js", 669);
Y.Menu = Y.mix(Menu, Y.Menu);


}, '@VERSION@', {"requires": ["classnamemanager", "event-hover", "event-outside", "menu-base", "menu-templates", "node-screen", "view"], "skinnable": true});
