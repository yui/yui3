YUI.add("widget-stdmod", function(Y) {

    var L = Y.Lang,
        Node = Y.Node,
        UA = Y.UA,

        EMPTY = "",
        HD = "hd",
        BD = "bd",
        FT = "ft",
        HEADER = "header",
        BODY = "body",
        FOOTER = "footer",

        PX = "px",
        NODE_SUFFIX = "Node",
        INNER_HTML = "innerHTML",
        FIRST_CHILD = "firstChild",
        CONTENT_BOX = "contentBox",

        HEIGHT = "height",
        OFFSET_HEIGHT = "offsetHeight",
        AUTO = "auto",

        HeaderChange = "headerChange",
        BodyChange = "bodyChange",
        FooterChange = "footerChange",
        HeightChange = "heightChange",

        STD_TEMPLATE = "<div></div>",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI";

    function StdMod(config) {
        // TODO: If Plugin
        // PositionExtras.constructor.superclass.apply(this, arguments);
        // this._initPositionExtras();
    }

    StdMod.ATTRS = {
        header: {},
        footer: {},
        body: {}
    };

    var HEADER_SECT = StdMod.HEADER = HEADER;
    var BODY_SECT = StdMod.BODY = BODY;
    var FOOTER_SECT = StdMod.FOOTER = FOOTER;
    
    var AFTER = StdMod.AFTER = "after";
    var BEFORE = StdMod.BEFORE = "before";
    var REPLACE = StdMod.REPLACE = "replace";

    StdMod.TEMPLATES = {};
    StdMod._TEMPLATES = {};

    var tmpl = StdMod.TEMPLATES;
    tmpl[HEADER_SECT] = {
        html : STD_TEMPLATE,
        className : HD
    };
    tmpl[BODY_SECT] = {
        html : STD_TEMPLATE,
        className : BD
    };
    tmpl[FOOTER_SECT] = {
        html : STD_TEMPLATE,
        className : FT
    };

    StdMod.prototype = {

        _initStdMod : function() {
            Y.after(this._renderUIStdMod, this, RENDERUI);
            Y.after(this._bindUIStdMod, this, BINDUI);
            Y.after(this._syncUIStdMod, this, SYNCUI);
        },

        _renderUIStdMod : function() {
            // Lazily render module sections
        },

        _syncUIStdMod : function() {
            this._uiSetSection(HEADER_SECT, this.get(HEADER));
            this._uiSetSection(BODY_SECT, this.get(BODY));
            this._uiSetSection(FOOTER_SECT, this.get(FOOTER));

            this._uiStdModFillHeight();
        },

        _bindUIStdMod : function() {
            this.after(HeaderChange, this._onHeaderChange);
            this.after(BodyChange, this._onBodyChange);
            this.after(FooterChange, this._onFooterChange);

            this.after(HeightChange, this._uiStdModFillHeight);
        },

        _renderSection : function(section) {
            var contentBox = this.get(CONTENT_BOX);
            return this[section + NODE_SUFFIX] = contentBox.appendChild(this._getStdModTemplate(section));
        },

        _onHeaderChange : function(e) {
            this._uiSetSection(HEADER_SECT, e.newVal);
        },

        _onBodyChange : function(e) {
            this._uiSetSection(BODY_SECT, e.newVal);
        },

        _onFooterChange : function(e) {
            this._uiSetSection(FOOTER_SECT, e.newVal);
        },

        _uiStdModFillHeight : function() {
            // TODO: Expose config for which node gets to fill out
            var height = this.get(HEIGHT);
            if (height != EMPTY && height != AUTO) {
                this.fillHeight(this.bodyNode);    
            }
        },

        _uiSetSection : function(section, val, where) {
            var node = this[section + NODE_SUFFIX] || this._renderSection(section);
            if (val instanceof Node) {
                this._addNodeRef(node, val, where);
            } else {
                this._addNodeHTML(node, val, where);
            }
        },

        _addNodeHTML : function(node, html, where) {
            if (where == AFTER) {
                node.set(INNER_HTML, node.get(INNER_HTML) + html);
            } else if (where == BEFORE) {
                node.set(INNER_HTML, html + node.get(INNER_HTML));
            } else {
                node.set(INNER_HTML, html);
            }
        },

        _addNodeRef : function(node, ref, where) {
            var append = true;
            if (where == BEFORE) {
                if (node.get(FIRST_CHILD)) {
                    node.insertBefore(ref, node.get(FIRST_CHILD));
                    append = false;
                }
            } else if (where != AFTER) { // replace
                node.set(INNER_HTML, EMPTY);
            }
            if (append) {
                node.appendChild(ref);
            }
        },

        setBody : function(val) {
            this.set(BODY, val);
        },

        setHeader : function(val) {
            this.set(HEADER, val);
        },

        setFooter : function(val) {
            this.set(FOOTER, val);
        },

        appendToBody : function(val) {
        },

        appendToHeader : function(val) {
        },

        appendToFooter : function(val) {
        },

        _getStdModTemplate : function(section) {
            var template = StdMod._TEMPLATES[section], 
                cfg;

            if (!template) {
                cfg = StdMod.TEMPLATES[section];
                StdMod._TEMPLATES[section] = template = Node.create(cfg.html);
                // TODO: Replace with ClassNameManager static version
                template.addClass(Y.config.classNamePrefix + Y.Widget.NAME + "-" + cfg.className); 
            }
            return template.cloneNode(true);
        },

        _getPreciseHeight : function(node) {
            var height = node.get(OFFSET_HEIGHT);

            if (node.getBoundingClientRect) {
                var rect = node.getBoundingClientRect();
                height = rect.bottom - rect.top;
            }

            return height;
        },

        /**
         * <p>
         * Sets the height on the provided header, body or footer element to 
         * fill out the height of the container. It determines the height of the 
         * containers content box, based on it's configured height value, and 
         * sets the height of the autofillheight element to fill out any 
         * space remaining after the other standard module element heights 
         * have been accounted for.
         * </p>
         * <p><strong>NOTE:</strong> This method is not designed to work if an explicit 
         * height has not been set on the container, since for an "auto" height container, 
         * the heights of the header/body/footer will drive the height of the container.</p>
         *
         * @method fillHeight
         * @param {Node} node The node which should be resized to fill out the height
         * of the container element.
         */
        fillHeight : function(node) {
            node = node || this.bodyNode;
            if (node) {
                var contentBox = this.get(CONTENT_BOX),
                    stdModNodes = [this.headerNode, this.bodyNode, this.footerNode],
                    stdModNode,
                    total = 0,
                    filled = 0,
                    remaining = 0,
                    validNode = false;

                for (var i = 0, l = stdModNodes.length; i < l; i++) {
                    stdModNode = stdModNodes[i];
                    if (stdModNode) {
                        if (stdModNode !== node) {
                            filled += this._getPreciseHeight(stdModNode);
                        } else {
                            validNode = true;
                        }
                    }
                }

                if (validNode) {

                    if (UA.ie || UA.opera) {
                        // Need to set height to 0, to allow height to be reduced
                        node.setStyle(HEIGHT, 0 + PX);
                    }

                    total = parseFloat(contentBox.getComputedStyle(HEIGHT));
                    if (L.isNumber(total)) {
                        remaining = total - filled;

                        if (remaining >= 0) {
                            node.setStyle(HEIGHT, remaining + PX);
                        }
    
                        // Re-adjust height if required, to account for el padding and border
                        var offsetHeight = node.get(OFFSET_HEIGHT); 
                        if (offsetHeight != remaining) {
                            remaining = remaining - (offsetHeight - remaining);
                        }
                        node.setStyle(HEIGHT, remaining + PX);
                    }
                }
            }
        }
    };

    Y.WidgetStdMod = StdMod;

}, "3.0.0");
