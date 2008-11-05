/**
 * @module widget-stack
 */
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
        ContentUpdated = "contentUpdated",

        // CSS
        STACKED = "stacked",
        SHOW_SCROLLBARS = "show-scrollbars",
        HIDE_SCROLLBARS = "hide-scrollbars";

    /**
     * @class WidgetStack
     * @param {Object} User configuration object
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
    /**
     * Static property used to define the default attribute 
     * configuration for the Widget.
     * 
     * @property WidgetStack.ATTRS
     */
    Stack.ATTRS = {
        /**
         * @attribute shim
         * @type boolean
         * @default false, for all browsers other than IE6, for which a shim is enabled by default.
         * 
         * @description Boolean flag to indicate whether or not a shim should be added to the Widgets
         * boundingBox, to protect it from select box bleedthrough.
         */
        shim: {
            value: (UA.ie == 6)
        },

        /**
         * @attribute zIndex
         * @type number
         * @default 0
         * @description The z-index to apply to the Widgets boundingBox. Non-numerical values for 
         * zIndex will be converted to 0
         */
        zIndex: {
            value:0,
            set: function(val) {
                return this._setZIndex(val);
            }
        }
    };

    /**
     * The HTML parsing rules for the WidgetStack class.
     * 
     * @property WidgetStack.HTML_PARSER
     * @type Object
     */
    Stack.HTML_PARSER = {
        zIndex: function(contentBox) {
            return contentBox.getStyle(ZINDEX);
        }
    };

    /**
     * Default class used to mark the shim element
     * @property WidgetStack.SHIM_CLASS
     */
    Stack.SHIM_CLASS = Widget.getClassName(SHIM);

    /**
     * Default class used to mark the boundingBox of a stacked widget.
     * @property WidgetStack.STACKED_CLASS
     */
    Stack.STACKED_CLASS = Widget.getClassName(STACKED);

    /**
     * Default markup template used to generate the shim element.
     * @property WidgetStack.SHIM_TEMPLATE
     */
    Stack.SHIM_TEMPLATE = '<iframe class="' + Stack.SHIM_CLASS + '" frameborder="0" title="Widget Stacking Shim" src="javascript:false"></iframe>';

    Stack.prototype = {

        /**
         * Synchronizes the UI to match the Widgets stack state.
         * This method in invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         *
         * @method _syncUIStack
         * @protected
         */
        _syncUIStack: function() {
            this._uiSetShim(this.get(SHIM));
            this._uiSetZIndex(this.get(ZINDEX));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to 
         * Widget stack related state changes.
         *
         * This method in invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         *
         * @method _bindUIStack
         * @protected
         */
        _bindUIStack: function() {
            this.after(ShimChange, this._onShimChange);
            this.after(ZIndexChange, this._onZIndexChange);
        },

        /**
         * Creates/Initializes the DOM to support stackability.
         *
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         *
         * @method _renderUIStack
         * @protected
         */
        _renderUIStack: function() {
            this._stackNode.addClass(Stack.STACKED_CLASS);

            // TODO:DEPENDENCY Env.os
            var isMac = navigator.userAgent.toLowerCase().indexOf("macintosh") != -1;
            if (isMac && UA.gecko && UA.gecko <= 1.9) {
                this._fixMacGeckoScrollbars();
            }
        },

        /**
         * Default setter for zIndex attribute changes. Normalizes zIndex values to 
         * numbers, converting non-numerical values to 0.
         *
         * @method _setZIndex
         * @param {Any} zIndex
         * @return {Number} Normalized zIndex
         */
        _setZIndex: function(zIndex) {
            if (L.isString(zIndex)) {
                zIndex = parseInt(zIndex, 10);
            }
            if (!L.isNumber(zIndex)) {
                zIndex = 0;
            }
            return zIndex;
        },

        /**
         * Default attribute change listener for the shim attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _onShimChange
         * @param {Event.Facade} e The Event Facade
         */
        _onShimChange : function(e) {
            this._uiSetShim(e.newVal);
        },

        /**
         * Default attribute change listener for the zIndex attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _onZIndexChange
         * @param {Event.Facade} e The Event Facade
         */
        _onZIndexChange : function(e) {
            this._uiSetZIndex(e.newVal);
        },

        /**
         * Updates the UI to reflect the zIndex value passed in.
         * @method _uiSetZIndex
         * @protected
         * @param {number} zIndex The zindex to be reflected in the UI
         */
        _uiSetZIndex: function (zIndex) {
            this._stackNode.setStyle(ZINDEX, zIndex);
        },

        /**
         * Updates the UI to enable/disable the shim. If the widget is not currently visible,
         * the shim is not created, until it is made visible, for performance reasons.
         * 
         * @method _uiSetShim
         * @protected
         * @param {boolean} enable If true, creates/renders the shim, if false, removes it.
         */
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

        /**
         * Sets up change handlers for teh visible attribute, to defer shim creation/rendering 
         * until the Widget is made visible.
         * 
         * @method _renderShimDeferred
         * @private
         */
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

        /**
         * Sets up event listeners to resize the shim when the size of the Widget changes.
         *
         * NOTE: This method is only used for IE6 currently, since it doesn't support a way to
         * resize the shim purely through CSS, when the Widget does not have an explicit width/height 
         * set.
         *
         * @method _addShimResizeHandlers
         * @private
         */
        _addShimResizeHandlers : function() {

            this._stackHandles[SHIM_RESIZE] = this._stackHandles[SHIM_RESIZE] || [];

            var sizeShim = this.sizeShim,
                handles = this._stackHandles[SHIM_RESIZE];

            this.sizeShim();

            handles.push(this.after(VisibleChange, sizeShim));
            handles.push(this.after(WidthChange, sizeShim));
            handles.push(this.after(HeightChange, sizeShim));
            handles.push(this.after(ContentUpdated, sizeShim));
        },

        /**
         * Detachs any handles stored for the provided key
         *
         * @method _detachStackHandles
         * @param String handleKey The key defining the group of handles which should be detached
         * @private
         */
        _detachStackHandles : function(handleKey) {
            var handles = this._stackHandles[handleKey];
            if (handles) {
                for (var i = handles.length; i <= 0; --i) {
                    handles[i].detach();
                    delete handles[i];
                }
            }
        },

        /**
         * Creates the shim element, adds it to the DOM, and 
         *
         * @method _renderShim
         * @private
         */
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

        /**
         * Creates the shim element, and adds it to the DOM
         *
         * @method _renderShim
         * @private
         */
        _destroyShim : function() {
            if (this._shimNode) {
                this._shimNode.get("parentNode").removeChild(this._shimNode);
                this._shimNode = null;

                this._detachStackHandles(SHIM_DEFERRED);
                this._detachStackHandles(SHIM_RESIZE);
            }
        },

        /**
         * Applies the CSS classes required to fix scrollbar bleedthrough, for FF2/Mac
         * 
         * @method _fixMacGeckoScrollbars
         * @private
         */
        _fixMacGeckoScrollbars: function() {
            this._toggleMacGeckoScrollbars();
            this.after(VisibleChange, this._toggleMacGeckoScrollbars);
        },

        /**
         * Flip the hide/show scrollbar classes applied to the Widget based on visibility, 
         * to prevent scrollbar bleedthrough on FF2/Mac,
         *
         * @method _toggleMacGeckoScrollbars
         * @private
         */
        _toggleMacGeckoScrollbars : function() {
            if (this.get(VISIBLE)) {
                this._showMacGeckoScrollbars();
            } else {
                this._hideMacGeckoScrollbars();
            }
        },

        /**
         * Set CSS classes on the Widgets boundingBox, to prevent scrollbar bleedthrough on FF2/Mac, when the Widget is hidden.
         *
         * @method _hideMacGeckoScrollbars
         * @private
         */
        _hideMacGeckoScrollbars: function () {
            this._stackNode.replaceClass(Widget.getClassName(SHOW_SCROLLBARS), Widget.getClassName(HIDE_SCROLLBARS));
        },

        /**
         * Set CSS classes on the Widgets boundingBox, to prevent scrollbar bleedthrough on FF2/Mac, when the Widget is visible.
         *
         * @method _hideMacGeckoScrollbars
         * @private
         */
        _showMacGeckoScrollbars: function () {
            this._stackNode.replaceClass(Widget.getClassName(HIDE_SCROLLBARS), Widget.getClassName(SHOW_SCROLLBARS));
        },

        /**
         * For IE6, synchronizes the size and position of iframe shim to that of 
         * Widget bounding box which it is protecting. For all other browsers,
         * this method does not do anything.
         *
         * @method sizeShim
         */
        sizeShim: function () {
            var shim = this._shimNode,
                node = this._stackNode;

            if (shim && UA.ie === 6 && this.get(VISIBLE)) {
                shim.setStyle(WIDTH, node.get(OFFSET_WIDTH) + PX);
                shim.setStyle(HEIGHT, node.get(OFFSET_HEIGHT) + PX);
            }
        },

        /**
         * Creates a cloned shim node, from html string template, for use on a new instance.
         *
         * @method _getShimTemplate
         * @private
         */
        _getShimTemplate : function() {
            if (!Stack._SHIM_TEMPLATE) {
                Stack._SHIM_TEMPLATE = Node.create(Stack.SHIM_TEMPLATE);
            }
            return Stack._SHIM_TEMPLATE.cloneNode(true);
        }
    };

    Y.WidgetStack = Stack;