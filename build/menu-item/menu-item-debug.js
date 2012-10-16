YUI.add('menu-item', function (Y, NAME) {

/**
Provides the `Menu.Item` class.

@module menu
@submodule menu-item
**/

/**
Represents a single menu item in a `Menu`.

@class Menu.Item
@constructor
@param {Menu} menu `Menu` instance with which this node should be associated.
@param {Object} [config] Configuration hash for this menu item. Supports all the
    config properties of `Tree.Node` in addition to the following.

    @param {Object} [config.state] State hash for this menu item.

        @param {Boolean} [config.state.disabled=false] If `true`, this menu item
            will be disabled, and will not be clickable or selectable.

    @param {String} [config.type='item'] Type of this menu item. May be 'item',
        'heading', or 'separator'.

    @param {String} [config.url='#'] URL associated with this item. If this item
        is of type 'item', clicking on the item will navigate to this URL.

@extends Tree.Node
**/

function MenuItem(menu, config) {
    config || (config = {});

    this.id   = this._yuid = config.id || Y.guid('menuItem-');
    this.type = config.type || 'item';
    this.url  = config.url || '#';

    MenuItem.superclass.constructor.call(this, menu, config);
}

Y.extend(MenuItem, Y.Tree.Node, {
    _serializable: Y.Tree.Node.prototype._serializable.concat('type', 'url'),

    /**
    Disables this menu item. Disabled items are not clickable or selectable.

    @method disable
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `disable` event
            will be suppressed.
    @chainable
    **/
    disable: function (options) {
        this.tree.disableItem(this, options)
        return this;
    },

    /**
    Enables this menu item.

    @method enable
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `enable` event
            will be suppressed.
    @chainable
    **/
    enable: function (options) {
        this.tree.enableItem(this, options);
        return this;
    },

    /**
    Returns `true` if this menu item is currently disabled.

    @method isDisabled
    @return {Boolean} `true` if this menu item is currently disabled, `false`
        otherwise.
    **/
    isDisabled: function () {
        return !!this.state.disabled;
    }
});

Y.namespace('Menu').Item = MenuItem;


}, '@VERSION@', {"requires": ["oop", "tree-node"]});
