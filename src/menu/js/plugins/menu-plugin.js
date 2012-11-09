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
        this._host       = config.host;
        this._hostIsBody = this._host === Y.one('body');

        this._attachMenuPluginEvents();
    },

    destructor: function () {
        clearTimeout(this._pluginHideTimeout);
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Repositions this menu so that it is anchored to a specified node, region, or
    set of pixel coordinates.

    The menu will be displayed at the most advantageous position relative to the
    anchor point to ensure that as much of the menu as possible is visible
    within the viewport.

    If no anchor point is specified, the menu will be positioned relative to its
    host node.

    @method reposition
    @param {Node|Number[]|Object} [anchorPoint] Anchor point at which this menu
        should be positioned. The point may be specified as a `Y.Node`
        reference, a region object, or an array of X and Y pixel coordinates.
    @chainable
    **/
    reposition: function (anchorPoint) {
        return Y.Menu.prototype.reposition.call(this, anchorPoint || this._host);
    },

    // -- Protected Methods ----------------------------------------------------
    _attachMenuPluginEvents: function () {
        var doc = Y.one('doc');

        // Events added to this._menuEvents will be cleaned up by Y.Menu.
        this._menuEvents.push(
            doc.after('mousedown', this._afterDocMouseDown, this)
        );

        this.afterHostEvent('click', this._afterAnchorClick);

        if (this.get('showOnHover')) {
            this.afterHostEvent({
                blur      : this._afterHostBlur,
                focus     : this._afterHostFocus,
                mouseenter: this._afterHostMouseEnter,
                mouseleave: this._afterHostMouseLeave
            });

            this._menuEvents.push(this.get('container').after({
                mouseenter: Y.bind(this._afterContainerMouseEnter, this),
                mouseleave: Y.bind(this._afterContainerMouseLeave, this)
            }));
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterHostBlur: function () {
        this.hide();
    },

    _afterHostClick: function () {
        if (!this.rendered) {
            this.render();
        }

        this.toggle({anchorPoint: this._host});
    },

    _afterHostFocus: function () {
        clearTimeout(this._pluginHideTimeout);

        if (!this.rendered) {
            this.render();
        }

        this.show({anchorPoint: this._host});
    },

    _afterHostMouseEnter: function () {
        clearTimeout(this._pluginHideTimeout);

        if (!this.rendered) {
            this.render();
        }

        this.show({anchorPoint: this._host});
    },

    _afterHostMouseLeave: function () {
        var self = this;

        this._pluginHideTimeout = setTimeout(function () {
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

    _afterDocMouseDown: function (e) {
        if (!this.get('visible')) {
            return;
        }

        var container = this.get('container'),
            host      = this._hostIsBody ? null : this._host;

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
