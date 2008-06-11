/**
 * @extension Y.widget.Stack
 *
 * @requires-events show, hide, widthChange, heightChange
 * @requires-attrs root
 * @requires-methods none
 */
YUI.add("widget-stack", function(Y) {

    var Lang = Y.Lang,
        UA = Y.UA,
        Node = Y.Node,

        ZINDEX = "zindex",
        SHIM = "shim",
        VISIBLE = "visible",
        ROOT = "root",
        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI",

        OFFSET_WIDTH = "offsetWidth",
        OFFSET_HEIGHT = "offsetHeight",
        WIDTH = "width",
        HEIGHT = "height",
        PX = "px",

        TextResize = "window:textresize",
        Visible = "visibleChange",
        Width = "widthChange",
        Height = "heightChange",
        Shim = "shimChange",
        ZIndex = "zindexChange";

    function Stack(config) {
        /* TODO: If PLUGIN */
        // Stack.constructor.superclass.apply(this, arguments);
    }

    // Static Properties
    Stack.ATTRS = {
        shim: {
            value: (UA.ie == 6)
        },
        zindex: {
            value:2
        }
    };

    Stack.CLASSNAMES = {
        stacked: "yui-stacked",
        shim: "yui-shim",
        hideScrollbars: "yui-hidescrollbars",
        showScrollbars: "yui-showscrollbars"
    };

    var CLASSNAMES = Stack.CLASSNAMES;

    Stack.SHIM_TEMPLATE = ["iframe", { "class":CLASSNAMES.shim, title: "Widget Stacking Shim", src:"javascript:false" }];

    Stack.prototype = {
        
        initStack : function() {
            this._stackEl = this.get(ROOT);
    
            // WIDGET METHOD OVERLAP
            Y.after(this._stackRenderUI, this, RENDERUI);
            Y.after(this._stackSyncUI, this, SYNCUI);
            Y.after(this._stackBindUI, this, BINDUI);
        },

        _stackSyncUI: function() {
            this._uiSetShim();
            this._uiSetZIndex();
        },

        _stackBindUI: function() {
            this.onUI(Shim, Y.bind(this._uiSetShim, this));
            this.onUI(ZIndex, Y.bind(this._uiSetZIndex, this));
        },

        _stackRenderUI: function() {
            this._stackEl.addClass(CLASSNAMES.stacked);

            // TODO:DEPENDENCY Env.os
            if (UA.os && UA.os.mac && UA.gecko && UA.gecko <= 1.9) {
                this._applyMacGeckoFix();
            }
        },

        /**
         * For IE6, syncronizes the size and position of iframe shim to that of 
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

        _uiSetZIndex: function () {
            var z = this.get(ZINDEX);
            if (!Lang.isNumber(z) && z != "auto") {
                z = this._stackEl.getStyle(ZINDEX);
                if (isNaN(z)) {
                    z = 0;
                }
                // TODO: Dependancy - to avoid recursive loop
                // this.setUI(ZINDEX, z, true);
            }
            this._stackEl.setStyle("zIndex", this.get(ZINDEX));
        },

        /**
         * The default set method for the "shim" property.
         */
        _uiSetShim: function () {

            function onBeforeVisible(e) {
                if (e.newVal == true) {
                    this._createShim();
                    this.detachListeners("shimdeferred");
                }
            }

            if (this.get(SHIM)) {
                if (this.get(VISIBLE)) {
                    this._createShim();
                } else {
                    var ol = {};
                    ol[Visible] = {fn:Y.bind(onBeforeVisible, this), when:"before"};
                    this.attachListeners("shimdeferred", ol);
                }
            } else {
                this._destroyShim();
                this.detachListeners("shimdeferred");
            }
        },

        _createShim : function() {
            var shimEl = this._shimEl,
                stackEl = this._stackEl;

            if (!shimEl) {
                shimEl = this._getShimTemplate().cloneNode(false);
                stackEl.insertBefore(shimEl, stackEl.get("firstChild"));

                this._shimEl = shimEl;

                if (UA.ie == 6) {
                    var ol = {};
                    ol[Visible] = ol[TextResize] = ol[Width] = ol[Height] = Y.bind(this.sizeShim, this);
                    this.attachListeners("iesyncshim", ol);
                    this.sizeShim();
                }
            }
        },

        _destroyShim : function() {
            if (this._shimEl) {
                this._shimEl.get("parentNode").removeChild(this._shimEl);
            }
        },

        _getShimTemplate : function() {
            if (!Stack._shimTmpl) {
                var template = Node.create(Stack.SHIM_TEMPLATE);
                if (UA.ie) {
                    /*
                         Need to set the "frameBorder" property to 0 
                         supress the default <iframe> border in IE.
                         Setting the CSS "border" property alone 
                         doesn't supress it.
                    */
                    template.setAttribute("frameBorder", 0);
                }
                Stack._shimTmpl = template;
            }
            return Stack._shimTmpl;
        },

        _applyMacGeckoFix: function() {
            this._toggleMacGeckoScroll();
            this.on(Visible, Y.bind(this._toggleMacGeckoScroll, this));
        },

        _toggleMacGeckoScroll : function() {
            if (this.get(VISIBLE)) {
                this._showMacGeckoScroll();
            } else {
                this._hideMacGeckoScroll();
            }
        },

        /**
        * Adds a CSS class ("hide-scrollbars") and removes a CSS class
        * ("show-scrollbars") to the Overlay to fix a bug in Gecko on Mac OS X
        * (https://bugzilla.mozilla.org/show_bug.cgi?id=187435)
        * 
        * Only applied by default for FF less than 1.9
        * 
        * @method _hideMacGeckoScrollbars
        */
        _hideMacGeckoScroll: function () {
            this._stackEl.replaceClass(CLASSNAMES.showScrollbars, CLASSNAMES.hideScrollbars);
        },

        /**
        * Adds a CSS class ("show-scrollbars") and removes a CSS class 
        * ("hide-scrollbars") to the Overlay to fix a bug in Gecko on Mac OS X 
        * (https://bugzilla.mozilla.org/show_bug.cgi?id=187435)
        * 
        * Only applied by default for FF less than 1.9
        * 
        * @method _showMacGeckoScrollbars
        */
        _showMacGeckoScroll: function () {
            this._stackEl.replaceClass(CLASSNAMES.hideScrollbars, CLASSNAMES.showScrollbars);
        }
    };

    Y.WidgetStack = Stack;

    /* TODO: If Plugin */
    /*
    Y.extend(Stack, Y.Base, proto);
    */

}, "3.0.0");

