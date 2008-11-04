/**
 * @module widget-stdmod
 */
    var L = Y.Lang,
        Node = Y.Node,
        UA = Y.UA,
        Widget = Y.Widget,

        UI = Widget.UI_SRC,
        UI_SRC = {src:UI},

        EMPTY = "",
        HD = "hd",
        BD = "bd",
        FT = "ft",
        HEADER = "header",
        BODY = "body",
        FOOTER = "footer",
        FILL_HEIGHT = "fillHeight",
        STDMOD = "stdmod",

        PX = "px",
        NODE_SUFFIX = "Node",
        INNER_HTML = "innerHTML",
        FIRST_CHILD = "firstChild",

        CONTENT_BOX = "contentBox",
        BOUNDING_BOX = "boundingBox",

        HEIGHT = "height",
        OFFSET_HEIGHT = "offsetHeight",
        AUTO = "auto",

        HeaderChange = "headerChange",
        BodyChange = "bodyChange",
        FooterChange = "footerChange",
        FillHeightChange = "fillHeightChange",
        ContentUpdated = "contentUpdated",

        STD_TEMPLATE = "<div></div>",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI";

    /**
     * @class WidgetStdMod
     */
    function StdMod(config) {
        
        this._stdModNode = this.get(CONTENT_BOX);

        this.HTML_PARSER = Y.merge(this.HTML_PARSER, StdMod.prototype.HTML_PARSER);

        Y.after(this._renderUIStdMod, this, RENDERUI);
        Y.after(this._bindUIStdMod, this, BINDUI);
        Y.after(this._syncUIStdMod, this, SYNCUI);
    }

    StdMod.HEADER = HEADER;
    StdMod.BODY = BODY;
    StdMod.FOOTER = FOOTER;
    StdMod.AFTER = "after";
    StdMod.BEFORE = "before";
    StdMod.REPLACE = "replace";

    var STD_HEADER = StdMod.HEADER,
        STD_BODY = StdMod.BODY,
        STD_FOOTER = StdMod.FOOTER,
        AFTER = StdMod.AFTER,
        BEFORE = StdMod.BEFORE,
        REPLACE = StdMod.REPLACE;

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

        _syncUIStdMod : function() {
            this._uiSetSection(STD_HEADER, this.get(HEADER));
            this._uiSetSection(STD_BODY, this.get(BODY));
            this._uiSetSection(STD_FOOTER, this.get(FOOTER));
            this._uiSetFillHeight(this.get(FILL_HEIGHT));
        },

        _renderUIStdMod : function() {
            this._stdModNode.addClass(Widget.getClassName(STDMOD));
        },

        _bindUIStdMod : function() {
            this.after(HeaderChange, this._onHeaderChange);
            this.after(BodyChange, this._onBodyChange);
            this.after(FooterChange, this._onFooterChange);
            this.after(FillHeightChange, this._onFillHeightChange);
            this.after(ContentUpdated, this._fillHeight);
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
                var height = this.get(HEIGHT);
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
            this.fire(ContentUpdated);
        },

        _renderSection : function(section) {

            var contentBox = this.get(CONTENT_BOX),
                sectionNode = this._findStdModSection(section);

            // TODO: Preparing for the Node/NodeList change
            if (!sectionNode) {
                sectionNode = this._getStdModTemplate(section);
            }

            this._insertStdModSection(contentBox, section, sectionNode);

            this[section + NODE_SUFFIX] = sectionNode;
            return this[section + NODE_SUFFIX];
        },

        _insertStdModSection : function(contentBox, section, sectionNode) {
            var fc = contentBox.get(FIRST_CHILD);

            if (section === STD_FOOTER || !fc) {
                contentBox.appendChild(sectionNode);
            } else {
                if (section === STD_HEADER) {
                    contentBox.insertBefore(sectionNode, fc);
                } else {
                    // BODY
                    var footer = this[STD_FOOTER + NODE_SUFFIX];
                    if (footer) {
                        contentBox.insertBefore(sectionNode, footer);
                    } else {
                        contentBox.appendChild(sectionNode);
                    }
                }
            }
        },

        _getStdModTemplate : function(section) {
            var template = StdMod._TEMPLATES[section],
                cfg;

            if (!template) {
                cfg = StdMod.TEMPLATES[section];
                StdMod._TEMPLATES[section] = template = Node.create(cfg.html);
                template.addClass(this._getStdModClassName(section));
            }
            return template.cloneNode(true);
        },

        _getStdModClassName : function(section) {
            return Widget.getClassName(StdMod.TEMPLATES[section].className);
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

        _findStdModSection: function(STD_HEADER) {
            var sectionNode = this.get(CONTENT_BOX).query("." + this._getStdModClassName(STD_HEADER));
            if (!sectionNode || (sectionNode.size && sectionNode.size() > 0)) {
                return null;                
            } else {
                return sectionNode;
            }
        },

        HTML_PARSER : {
            header: function(contentBox) {
                var node = this._findStdModSection(STD_HEADER);
                return (node) ? node.get(INNER_HTML) : "";
            },

            body : function(contentBox) {
                var node = this._findStdModSection(STD_BODY);
                return (node) ? node.get(INNER_HTML) : "";
            },

            footer : function(contentBox) {
                var node = this._findStdModSection(STD_FOOTER);
                return (node) ? node.get(INNER_HTML) : "";
            }
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

        fillHeight : function(node) {
            if (node) {
                var boundingBox = this.get(BOUNDING_BOX),
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

                    total = parseInt(boundingBox.getComputedStyle(HEIGHT), 10);
                    if (L.isNumber(total)) {
                        remaining = total - filled;

                        if (remaining >= 0) {
                            node.setStyle(HEIGHT, remaining + PX);
                        }

                        // Re-adjust height if required, to account for el padding and border
                        var offsetHeight = this.get(CONTENT_BOX).get(OFFSET_HEIGHT); 
                        if (offsetHeight != total) {
                            remaining = remaining - (offsetHeight - total);
                            node.setStyle(HEIGHT, remaining + PX);
                        }
                    }
                }
            }
        }
    };

    Y.WidgetStdMod = StdMod;
