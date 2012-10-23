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

    }
});

Y.namespace('Menu').Base = MenuBase;
