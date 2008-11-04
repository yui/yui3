    var L = Y.Lang,
        UA = Y.UA,
        Node = Y.Node,
        Widget = Y.Widget,

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
        ZIndexChange = "zIndexChange",
        ContentChange = "contentChange",

        // CSS
        STACKED = "stacked",
        SHOW_SCROLLBARS = "show-scrollbars",
        HIDE_SCROLLBARS = "hide-scrollbars";

    /**
     * @class WidgetStack
     */
    function Stack(config) {
        this._stackNode = this.get(BOUNDING_BOX);
        this._stackHandles = {};

        // WIDGET METHOD OVERLAP
        Y.after(this._renderUIStack, this, RENDER_UI);
        Y.after(this._syncUIStack, this, SYNC_UI);
        Y.after(this._bindUIStack, this, BIND_UI);
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

    Stack.SHIM_CLASS = Widget.getClassName(SHIM);
    Stack.STACKED_CLASS = Widget.getClassName(STACKED);
    Stack.SHIM_TEMPLATE = '<iframe class="' + Stack.SHIM_CLASS + '" frameborder="0" title="Widget Stacking Shim" src="javascript:false"></iframe>';

    Stack.prototype = {

        _syncUIStack: function() {
            this._uiSetShim(this.get(SHIM));
            this._uiSetZIndex(this.get(ZINDEX));
        },

        _bindUIStack: function() {
            this.after(ShimChange, this._onShimChange);
            this.after(ZIndexChange, this._onZIndexChange);
        },

        _renderUIStack: function() {
            this._stackNode.addClass(Stack.STACKED_CLASS);

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
            this._stackNode.setStyle(ZINDEX, zIndex);
        },

        _uiSetShim: function (enable) {
            if (enable) {
                // Lazy creation
                if (this.get(VISIBLE)) {
                    this._renderShim();
                } else {
                    this._renderShimDeferred();
                }
            } else {
                this._destroyShim();
            }
        },

        _renderShimDeferred : function() {

            this._stackHandles[SHIM_DEFERRED] = this._stackHandles[SHIM_DEFERRED] || [];

            var handles = this._stackHandles[SHIM_DEFERRED],
                createBeforeVisible = function(e) {
                    if (e.newVal) {
                        this._renderShim();
                    }
                };

            handles.push(this.on(VisibleChange, createBeforeVisible));
        },

        _addShimResizeHandlers : function() {

            this._stackHandles[SHIM_RESIZE] = this._stackHandles[SHIM_RESIZE] || [];

            var sizeShim = this.sizeShim,
                handles = this._stackHandles[SHIM_RESIZE];

            this.sizeShim();

            handles.push(this.after(VisibleChange, sizeShim));
            handles.push(this.after(WidthChange, sizeShim));
            handles.push(this.after(HeightChange, sizeShim));
            handles.push(this.after(ContentChange, sizeShim));
        },

        _detachStackHandles : function(handleKey) {
            var handles = this._stackHandles[handleKey];
            if (handles) {
                for (var i = handles.length; i <= 0; --i) {
                    handles[i].detach();
                    delete handles[i];
                }
            }
        },

        _renderShim : function() {
            var shimEl = this._shimNode,
                stackEl = this._stackNode;

            if (!shimEl) {
                shimEl = this._shimNode = this._getShimTemplate();
                stackEl.insertBefore(shimEl, stackEl.get("firstChild"));

                if (UA.ie == 6) {
                    this._addShimResizeHandlers();
                }
                this._detachStackHandles(SHIM_DEFERRED);
            }
        },

        _destroyShim : function() {
            if (this._shimNode) {
                this._shimNode.get("parentNode").removeChild(this._shimNode);
                this._shimNode = null;

                this._detachStackHandles(SHIM_DEFERRED);
                this._detachStackHandles(SHIM_RESIZE);
            }
        },

        _fixMacGeckoScrollbars: function() {
            this._toggleMacGeckoScrollbars();
            this.after(VisibleChange, this._toggleMacGeckoScrollbars);
        },

        _toggleMacGeckoScrollbars : function() {
            if (this.get(VISIBLE)) {
                this._showMacGeckoScrollbars();
            } else {
                this._hideMacGeckoScrollbars();
            }
        },

        _hideMacGeckoScrollbars: function () {
            this._stackNode.replaceClass(Widget.getClassName(SHOW_SCROLLBARS), Widget.getClassName(HIDE_SCROLLBARS));
        },

        _showMacGeckoScrollbars: function () {
            this._stackNode.replaceClass(Widget.getClassName(HIDE_SCROLLBARS), Widget.getClassName(SHOW_SCROLLBARS));
        },

        /**
         * For IE6, synchronizes the size and position of iframe shim to that of 
         * Widget bounding box which it is protecting. For all other browsers,
         * this method does not do anything.
         *
         * @method sizeIframe
         */
        sizeShim: function () {
            var shim = this._shimNode,
                node = this._stackNode;

            if (shim && UA.ie === 6 && this.get(VISIBLE)) {
                shim.setStyle(WIDTH, node.get(OFFSET_WIDTH) + PX);
                shim.setStyle(HEIGHT, node.get(OFFSET_HEIGHT) + PX);
            }
        },

        _getShimTemplate : function() {
            if (!Stack._SHIM_TEMPLATE) {
                Stack._SHIM_TEMPLATE = Node.create(Stack.SHIM_TEMPLATE);
            }
            return Stack._SHIM_TEMPLATE.cloneNode(true);
        },

        HTML_PARSER : {
            zIndex: function(contentBox) {
                return contentBox.getStyle(ZINDEX);
            }
        }
    };

    Y.WidgetStack = Stack;