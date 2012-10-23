YUI.add('menu-base', function (Y, NAME) {

/**
Provides `Menu.Base`.

@module menu
@submodule menu-base
**/

/**
Base menu functionality.

@class Menu.Base
@constructor
@param {Object} [config] Config options.
    @param {Menu.Item[]|Object[]} [config.items] Array of `Menu.Item` instances
        or menu item config objects to add to this menu.
@extends Tree
**/

/**
Fired when a menu item is disabled.

@event disable
@param {Menu.Item} item Menu item that was disabled.
@preventable _defDisableFn
**/
var EVT_DISABLE = 'disable';

/**
Fired when a menu item is enabled.

@event enable
@param {Menu.Item} item Menu item that was enabled.
@preventable _defEnableFn
**/
var EVT_ENABLE = 'enable';

/**
Fired when a menu item is hidden.

@event hide
@param {Menu.Item} item Menu item that was hidden.
@preventable _defHideFn
**/
var EVT_HIDE = 'hide';

/**
Fired when a menu item is shown.

@event show
@param {Menu.Item} item Menu item that was shown.
@preventable _defShowFn
**/
var EVT_SHOW = 'show';

var MenuBase = Y.Base.create('menuBase', Y.Tree, [], {
    nodeClass: Y.Menu.Item,

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        config || (config = {});

        if (config.items) {
            this.appendNode(this.rootNode, config.items, {silent: true});
        }
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
    Disables the specified menu item.

    @method disableItem
    @param {Menu.Item} item Menu item to disable.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `disable` event
            will be suppressed.
    @chainable
    **/
    disableItem: function (item, options) {
        if (!item.isDisabled()) {
            this._fire(EVT_DISABLE, {item: item}, {
                defaultFn: this._defDisableFn,
                silent   : options && options.silent
            });
        }

        return this;
    },

    /**
    Enables the specified menu item.

    @method enableItem
    @param {Menu.Item} item Menu item to enable.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `enable` event
            will be suppressed.
    @chainable
    **/
    enableItem: function (item, options) {
        if (item.isDisabled()) {
            this._fire(EVT_ENABLE, {item: item}, {
                defaultFn: this._defEnableFn,
                silent   : options && options.silent
            });
        }

        return this;
    },

    /**
    Hides the specified menu item.

    @method hideItem
    @param {Menu.Item} item Menu item to hide.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `hide` event
            will be suppressed.
    @chainable
    **/
    hideItem: function (item, options) {
        if (!item.isHidden()) {
            this._fire(EVT_HIDE, {item: item}, {
                defaultFn: this._defHideFn,
                silent   : options && options.silent
            });
        }

        return this;
    },

    /**
    Shows the specified menu item.

    @method showItem
    @param {Menu.Item} item Menu item to show.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `show` event
            will be suppressed.
    @chainable
    **/
    showItem: function (item, options) {
        if (item.isHidden()) {
            this._fire(EVT_SHOW, {item: item}, {
                defaultFn: this._defShowFn,
                silent   : options && options.silent
            });
        }

        return this;
    },

    // -- Default Event Handlers -----------------------------------------------

    /**
    Default handler for the `disable` event.

    @method _defDisableFn
    @param {EventFacade} e
    @protected
    **/
    _defDisableFn: function (e) {
        e.item.state.disabled = true;
    },

    /**
    Default handler for the `enable` event.

    @method _defEnableFn
    @param {EventFacade} e
    @protected
    **/
    _defEnableFn: function (e) {
        delete e.item.state.disabled;
    },

    /**
    Default handler for the `hide` event.

    @method _defHideFn
    @param {EventFacade} e
    @protected
    **/
    _defHideFn: function (e) {
        e.item.state.hidden = true;
    },

    /**
    Default handler for the `show` event.

    @method _defShowFn
    @param {EventFacade} e
    @protected
    **/
    _defShowFn: function (e) {
        delete e.item.state.hidden;
    }
});

Y.namespace('Menu').Base = MenuBase;


}, '@VERSION@', {"requires": ["menu-item", "tree"]});
