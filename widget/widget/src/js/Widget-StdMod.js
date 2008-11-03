YUI.add("widget-stdmod", function(Y) {

    var L = Y.Lang,
        Node = Y.Node,
        UA = Y.UA,
        
        UI = Y.Widget.UI_SRC,
        UI_SRC = {src:UI},

        EMPTY = "",
        HD = "hd",
        BD = "bd",
        FT = "ft",
        HEADER = "header",
        BODY = "body",
        FOOTER = "footer",
        FILL_HEIGHT = "fillHeight",

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
        FillHeightChange = "fillHeightChange",
        ContentChange = "contentChange",

        STD_TEMPLATE = "<div></div>",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI";
        
    var STD_HEADER = StdMod.HEADER = HEADER;
    var STD_BODY = StdMod.BODY = BODY;
    var STD_FOOTER = StdMod.FOOTER = FOOTER;
    
    var AFTER = StdMod.AFTER = "after";
    var BEFORE = StdMod.BEFORE = "before";
    var REPLACE = StdMod.REPLACE = "replace";

    function StdMod(config) {
        // TODO: If Plugin
        // PositionExtras.constructor.superclass.apply(this, arguments);
        // this._initPositionExtras();
    }

    StdMod.ATTRS = {
        header: {},
        footer: {},
        body: {},
        fillHeight: {
            value: StdMod.BODY,
            validator: function(val) {
                 return this._validateFillHeight(val);               
            }
        }
    };

    StdMod.TEMPLATES = {};
    StdMod._TEMPLATES = {};

    var tmpl = StdMod.TEMPLATES;
    tmpl[STD_HEADER] = {
        html : STD_TEMPLATE,
        className : HD
    };
    tmpl[STD_BODY] = {
        html : STD_TEMPLATE,
        className : BD
    };
    tmpl[STD_FOOTER] = {
        html : STD_TEMPLATE,
        className : FT
    };

    StdMod.prototype = {

        _initStdMod : function() {
            // Not doing anything in renderUI. Lazily create sections
            Y.after(this._bindUIStdMod, this, BINDUI);
            Y.after(this._syncUIStdMod, this, SYNCUI);
        },

        _syncUIStdMod : function() {
            this._uiSetSection(STD_HEADER, this.get(HEADER));
            this._uiSetSection(STD_BODY, this.get(BODY));
            this._uiSetSection(STD_FOOTER, this.get(FOOTER));
            this._uiSetFillHeight(this.get(FILL_HEIGHT));
        },

        _bindUIStdMod : function() {
            this.after(HeaderChange, this._onHeaderChange);
            this.after(BodyChange, this._onBodyChange);
            this.after(FooterChange, this._onFooterChange);
            this.after(FillHeightChange, this._onFillHeightChange);

            this.after(ContentChange, this._fillHeight);
            // this.after(HeaderChange, this._fillHeight);
            // this.after(BodyChange, this._fillHeight);
            //this.after(FooterChange, this._fillHeight);
        },

        _onHeaderChange : function(e) {
            if (e.src != UI) {
                this._uiSetSection(STD_HEADER, e.newVal);
            }
        },

        _onBodyChange : function(e) {
            if (e.src != UI) {
                this._uiSetSection(STD_BODY, e.newVal);
            }
        },

        _onFooterChange : function(e) {
            if (e.src != UI) {
                this._uiSetSection(STD_FOOTER, e.newVal);
            }
        },

        _setStdModSection : function(section, val, where) {
            this._uiSetSection(section, val, where);
            this.set(section, this.getStdModNode(section).get(INNER_HTML), UI_SRC);
        },

        _onFillHeightChange: function (e) {
            this._uiSetFillHeight(e.newVal);
        },

        _validateFillHeight : function(val) {
            return val == StdMod.BODY || val == StdMod.HEADER || val == StdMod.FOOTER;    
        },

        _uiSetFillHeight : function(fillSection) {
            var fillNode = this.getStdModNode(fillSection);
            var currNode = this._currFillNode;

            if (currNode && fillNode !== currNode){
                currNode.setStyle(HEIGHT, EMPTY);
            }

            if (fillNode) {
                this._currFillNode = fillNode;
            }

            this._fillHeight();
        },

        _fillHeight : function() {
            if (this.get(FILL_HEIGHT)) {
                var height = this.get(CONTENT_BOX).getStyle(HEIGHT);
                if (height != EMPTY && height != AUTO) {
                    this.fillHeight(this._currFillNode);    
                }
            }
        },

        _uiSetSection : function(section, val, where) {
            var node = this.getStdModNode(section) || this._renderSection(section);
            if (val instanceof Node) {
                this._addNodeRef(node, val, where);
            } else {
                this._addNodeHTML(node, val, where);
            }
            this.fire(ContentChange);
        },

        _renderSection : function(section) {
            var contentBox = this.get(CONTENT_BOX);
            return this[section + NODE_SUFFIX] = contentBox.appendChild(this._getStdModTemplate(section));
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

        _getPreciseHeight : function(node) {
            var height = node.get(OFFSET_HEIGHT);

            if (node.getBoundingClientRect) {
                var rect = node.getBoundingClientRect();
                height = rect.bottom - rect.top;
            }

            return height;
        },

        setBody : function(val, where) {
            this._setStdModSection(STD_BODY, val, where);
        },

        setHeader : function(val, where) {
            this._setStdModSection(STD_HEADER, val, where);
        },

        setFooter : function(val, where) {
            this._setStdModSection(STD_FOOTER, val, where);
        },

        getStdModNode : function(section) {
            return this[section + NODE_SUFFIX];
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
            if (node) {
                var contentBox = this.get(CONTENT_BOX),
                    stdModNodes = [this.headerNode, this.bodyNode, this.footerNode],
                    stdModNode,
                    total = 0,
                    filled = 0,
                    remaining = 0,
                    validNode = false;

                // TODO: Fix margin bug, non-IE
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
