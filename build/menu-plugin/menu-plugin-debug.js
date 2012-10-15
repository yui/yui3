YUI.add('menu-plugin', function (Y, NAME) {

/**
Provides the `Y.Plugin.Menu` Node plugin.

@module menu
@submodule menu-plugin
**/

/**
Node plugin that toggles a dropdown menu when the host node is clicked.

### Example

    YUI().use('menu-plugin', function (Y) {
        var button = Y.one('#button');

        // Plug a dropdown menu into the button.
        button.plug(Y.Plugin.Menu, {
            items: [
                {label: 'Item One'},
                {label: 'Item Two'},
                {label: 'Item Three'}
            ]
        });

        // The menu will automatically be displayed whenever the button is
        // clicked, but you can also toggle it manually.
        button.menu.toggle();
    });

@class Plugin.Menu
@constructor
@extends Menu
@uses Plugin.Base
**/

Y.namespace('Plugin').Menu = Y.Base.create('menuPlugin', Y.Menu, [Y.Plugin.Base], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        this._host = config.host;

        this._published = {};
        this._attachMenuPluginEvents();
    },

    // -- Protected Methods ----------------------------------------------------
    _attachMenuPluginEvents: function () {
        // This event will be cleaned up by Y.Menu.
        this._menuEvents.push(
            Y.one('doc').after('click', this._afterDocClick, this)
        );

        this.afterHostEvent('click', this._afterAnchorClick);
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterAnchorClick: function () {
        if (!this.rendered) {
            this.render();
        }

        if (this.get('visible')) {
            this.hide();
        } else {
            var container = this.get('container'),

                menuRegion = this._getSortedAnchorRegions(
                    ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],
                    container.get('region'),
                    this._host.get('region')
                )[0].region;

            container.setXY([menuRegion.left, menuRegion.top]);
            this.show();
        }
    },

    _afterDocClick: function (e) {
        var container = this.get('container'),
            host      = this._host;

        if (!e.target.ancestor(function (node) {
            return node === container || node === host;
        }, true)) {
            this.hide();
        }
    }
}, {
    NS: 'menu'
});


}, '@VERSION@', {"requires": ["menu", "node-pluginhost", "plugin"]});
