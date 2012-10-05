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

var MenuBase = Y.Base.create('menuBase', Y.Tree, [], {
    nodeClass: Y.Menu.Item,

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        config || (config = {});

        if (config.items) {
            this.appendNode(this.rootNode, config.items, {silent: true});
        }
    }
});

Y.namespace('Menu').Base = MenuBase;
