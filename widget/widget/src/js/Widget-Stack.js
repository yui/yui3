/**
 * @module widget-stack
 */
YUI.add("widget-stack", function(Y) {

    var Lang = Y.Lang,
        UA = Y.UA,
        Node = Y.Node,

        ZINDEX = "zIndex",
        SHIM = "shim",
        VISIBLE = "visible",

        BOUNDING_BOX = "boundingBox",

        RENDER_UI = "renderUI",
        BIND_UI = "bindUI",
        SYNC_UI = "syncUI",

        OFFSET_WIDTH = "offsetWidth",
        OFFSET_HEIGHT = "offsetHeight",

        WIDTH = "width",
        HEIGHT = "height",
        PX = "px",

        // HANDLE KEYS
        SHIM_DEFERRED = "shimdeferred",
        SHIM_RESIZE = "shimresize",

        // Events
        VisibleChange = "visibleChange",
        WidthChange = "widthChange",
        HeightChange = "heightChange",
        ShimChange = "shimChange",
        ZIndexChange = "zindexChange",

        // CSS
        STACKED = "stacked",
        SHOW_SCROLLBARS = "show-scrollbars",
        HIDE_SCROLLBARS = "hide-scrollbars";

    /**
     * @class WidgetStack
     */
    function Stack(config) {
        this._initStack();
    }

    // Static Properties
    Stack.ATTRS = {
        shim: {
            value: (UA.ie == 6)
        },

        zIndex: {
            value:0,
            set: function(val) {
                return this._setZIndex(val);
            }
        }
    };

    Stack.SHIM_TEMPLATE = '<iframe class="yui-widget-shim" frameborder="0" title="Widget Stacking Shim" src="javascript:false"></iframe>';

    Stack._getShimTemplate = function() {
        if (!Stack._SHIM_TEMPLATE) {
            Stack._SHIM_TEMPLATE = Node.create(Stack.SHIM_TEMPLATE);
        }
        return Stack._SHIM_TEMPLATE;
    };

    Stack.prototype = {

        _initStack : function() {
            this._stackEl = this.get(BOUNDING_BOX);

            // WIDGET METHOD OVERLAP
            Y.after(this._renderUIStack, this, RENDER_UI);
            Y.after(this._syncUIStack, this, SYNC_UI);
            Y.after(this._bindUIStack, this, BIND_UI);
        },

        _syncUIStack: function() {
            this._uiSetShim(this.get(SHIM));
            this._uiSetZIndex(this.get(ZINDEX));
        },

        _bindUIStack: function() {
            this.after(ShimChange, this._onShimChange);
            this.after(ZIndexChange, this._onZIndexChange);
        },

        _renderUIStack: function() {
            this._stackEl.addClass(this.getClassName(STACKED));

            // TODO:DEPENDENCY Env.os
            var isMac = navigator.userAgent.toLowerCase().indexOf("macintosh") != -1;
            if (isMac && UA.gecko && UA.gecko <= 1.9) {
                this._fixMacGeckoScrollbars();
            }
        },

        _setZIndex: function(zIndex) {
            if (L.isString(zIndex)) {
                zIndex = parseInt(zIndex, 10);
            }
            if (!L.isNumber(zIndex)) {
                zIndex = 0;
            }
            return zIndex;
        },

        _onShimChange : function(e) {
            this._uiSetShim(e.newVal);
        },

        _onZIndexChange : function(e) {
            this._uiSetZIndex(e.newVal);
        },

        _uiSetZIndex: function (zIndex) {
            this._stackEl.setStyle(ZINDEX, zIndex);
        },

        _uiSetShim: function (enable) {

            var handles;

            if (enable) {
                // Lazy creation
                if (this.get(VISIBLE)) {
                    this._createShim();
                } else {
                    this._createShimDeferred();
                }
            } else {
                this._destroyShim();
            }
        },

        // TODO: Move to generic widget/base support
        _createShimDeferred : function() {

            var createBeforeVisible = function(e) {
                if (e.newVal == true) {
                    this._createShim();
                }
            };

            var handles = this._stackHandles[SHIM_DEFERRED] = this._stackHandles[SHIM_DEFERRED] || [];
            handles.push(this.on(VisibleChange, createBeforeVisible));
        },

        _addShimResizeHandlers : function() {

            var sizeShim = this.sizeShim,
                handles = this._stackHandles[SHIM_RESIZE] = this._stackHandles[SHIM_RESIZE] || [];

            handles.push(this.after(VisibleChange, sizeShim));
            handles.push(this.after(WidthChange, sizeShim));
            handles.push(this.after(HeightChange, sizeShim));
        },

        _detachHandles : function(handleKey) {
            var handles = this._stackHandles[handleKey];
            if (handles) {
                for (var i = handles.length; i <= 0; --i) {
                    handles[i].detach();
                    delete handles[i];
                }
            }
        },

        _createShim : function() {
            var shimEl = this._shimEl,
                stackEl = this._stackEl;

            if (!shimEl) {
                shimEl = this._shimEl = Stack._getShimTemplate().cloneNode(false);
                stackEl.insertBefore(shimEl, stackEl.get("firstChild"));

                if (UA.ie == 6) {
                    this._addShimResizeHandlers();
                }
                this._detachHandles(SHIM_DEFERRED);
            }
        },

        _destroyShim : function() {
            if (this._shimEl) {
                this._shimEl.get("parentNode").removeChild(this._shimEl);
                this._shimEl == null;

                this._detachHandles(SHIM_DEFERRED);
                this._detachHandles(SHIM_RESIZE);
            }
        },

        _fixMacGeckoScrollbars: function() {
            this._toggleMacGeckoScroll();
            this.after(VisibleChange, this._toggleMacGeckoScroll);
        },

        _toggleMacGeckoScroll : function() {
            if (this.get(VISIBLE)) {
                this._showMacGeckoScroll();
            } else {
                this._hideMacGeckoScroll();
            }
        },

        _hideMacGeckoScrollbars: function () {
            this._stackEl.replaceClass(this.getClassName(SHOW_SCROLLBARS), this.getClassName(HIDE_SCROLLBARS));
        },

        _showMacGeckoScrollbars: function () {
            this._stackEl.replaceClass(this.getClassName(HIDE_SCROLLBARS), this.getClassName(SHOW_SCROLLBARS));
        },

        /**
         * For IE6, synchronizes the size and position of iframe shim to that of 
         * Widget bounding box which it is protecting. For all other browsers,
         * this method does not do anything.
         *
         * @method sizeIframe
         */
        sizeShim: function () {
            var shim = this._shimEl,
                el = this._stackEl;

            if (shim && UA.ie === 6 && this.get(VISIBLE)) {
                shim.setStyle(WIDTH, el.get(OFFSET_WIDTH) + PX);
                shim.setStyle(HEIGHT, el.get(OFFSET_HEIGHT) + PX);
            }
        },

        HTML_PARSER : {
            zIndex: function() {
                return this.get(BOUNDING_BOX).getStyle(ZINDEX);
            }
        }
        // TODO: HTML_PARSER for initial zIndex population
    };

    Y.WidgetStack = Stack;

}, "3.0.0");

