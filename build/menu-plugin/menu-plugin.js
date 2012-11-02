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

    destructor: function () {
        clearTimeout(this._pluginHideTimeout);
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Repositions this dropdown menu so that it is anchored to its host node at
    the most advantageous position to ensure that as much of the menu as
    possible is visible within the viewport.

    @method reposition
    @chainable
    **/
    reposition: function () {
        var container = this.get('container'),

            menuRegion = this._getSortedAnchorRegions(
                ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],
                container.get('region'),
                this._host.get('region')
            )[0].region;

        container.setXY([menuRegion.left, menuRegion.top]);

        return this;
    },

    show: function () {
        this.reposition();
        return Y.Menu.prototype.show.call(this);
    },

    // -- Protected Methods ----------------------------------------------------
    _attachMenuPluginEvents: function () {
        // These events will be cleaned up by Y.Menu.
        this._menuEvents.push(
            Y.one('doc').after('click', this._afterDocClick, this)
        );

        this.afterHostEvent('click', this._afterAnchorClick);

        if (this.get('showOnHover')) {
            this.afterHostEvent({
                blur      : this._afterAnchorBlur,
                focus     : this._afterAnchorFocus,
                mouseenter: this._afterAnchorMouseEnter,
                mouseleave: this._afterAnchorMouseLeave
            });

            this._menuEvents.push(this.get('container').after({
                mouseenter: Y.bind(this._afterContainerMouseEnter, this),
                mouseleave: Y.bind(this._afterContainerMouseLeave, this)
            }));
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterAnchorClick: function () {
        if (!this.rendered) {
            this.render();
        }

        this.toggle();
    },

    _afterAnchorBlur: function () {
        this.hide();
    },

    _afterAnchorFocus: function () {
        clearTimeout(this._pluginHideTimeout);

        if (!this.rendered) {
            this.render();
        }

        this.show();
    },

    _afterAnchorMouseEnter: function () {
        clearTimeout(this._pluginHideTimeout);

        if (!this.rendered) {
            this.render();
        }

        this.show();
    },

    _afterAnchorMouseLeave: function () {
        var self = this;

        this._pluginHideTimeout = setTimeout(function () {
            console.log('anchorTimeout');
            self.hide();
        }, 300);
    },

    _afterContainerMouseEnter: function () {
        clearTimeout(this._pluginHideTimeout);
    },

    _afterContainerMouseLeave: function () {
        var self = this;

        this._pluginHideTimeout = setTimeout(function () {
            self.hide();
        }, 300);
    },

    _afterDocClick: function (e) {
        if (!this.get('visible')) {
            return;
        }

        var container = this.get('container'),
            host      = this._host;

        if (!e.target.ancestor(function (node) {
            return node === container || node === host;
        }, true)) {
            this.hide();
        }
    }
}, {
    NS: 'menu',

    ATTRS: {
        /**
        If `true`, this menu will be shown when the host node is hovered or
        receives focus instead of only being shown when it's clicked.

        @attribute {Boolean} showOnHover
        @default false
        @initOnly
        **/
        showOnHover: {
            value: false,
            writeOnce: 'initOnly'
        }
    }
});


}, '@VERSION@', {"requires": ["event-focus", "menu", "node-pluginhost", "plugin"]});
