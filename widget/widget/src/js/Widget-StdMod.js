YUI.add("widget-stdmod", function(Y) {

        var L = Y.Lang,
            Node = Y.Node,

            HD = "hd",
            BD = "bd",
            FT = "ft",
            HEADER = "header",
            FOOTER = "footer",
            BODY = "body",
            NODE = "Node",
            INNER_HTML = "innerHTML",

            STD_TEMPLATE_HTML = "<div></div>",

            RENDERUI = "renderUI",
            BINDUI = "bindUI",
            SYNCUI = "syncUI";

        function StdMod(config) {
            // TODO: If Plugin
            // PositionExtras.constructor.superclass.apply(this, arguments);
            // this._initPositionExtras();
        }

        StdMod.ATTRS = {
            header: {
                value:null
            },
            footer: {
                value:null
            },
            body: {
                value:null
            }
            
        };

        StdMod.TEMPLATES = {};
        StdMod._TEMPLATES = {};

        var tmpl = StdMod.TEMPLATES;
        tmpl[HEADER] = {
            html : STD_TEMPLATE,
            class : HD
        };
        tmpl[BODY] = {
            html : STD_TEMPLATE,
            class : BD
        };
        tmpl[FOOTER] = {
            html : STD_TEMPLATE,
            class : FT
        };

        StdMod.prototype = {

            _initStdMod : function() {
                Y.after(this._renderUIStdMod, this, RENDERUI);
                Y.after(this._syncUIStdMod, this, SYNCUI);
                Y.after(this._bindUIStdMod, this, BINDUI);
            },

            _renderUIStdMod : function() {
                var contentBox = this.get(CONTENT_BOX);

                // TODO: PE
                this._renderHeader();
                this._renderBody();
                this._renderFooter();
            },

            _renderHeader : function() {
                this._renderSection(HEADER);
            },

            _renderBody : function() {
                this._renderSection(BODY);
            },
            
            _renderFooter : function() {
                this._renderSection(FOOTER);
            },
            
            _renderSection : function(section) {
                this[section + NODE] = contentBox.appendChild(this._getStdModTemplate(section));
            },

            _syncUIStdMod : function() {
                this._uiSetSection(HEADER, this.get(HEADER));
                this._uiSetSection(BODY, this.get(BODY));
                this._uiSetSection(FOOTER, this.get(FOOTER));
            },

            _bindUIStdMod : function() {
                this.after(HeaderChange, this._onHeaderChange);
                this.after(BodyChange, this._onBodyChange);
                this.after(FooterChange, this._onFooterChange);
            },

            _uiSetSection : function(section, val, where) {
                var node = this[section + NODE];
                if (val instanceof Node) {
                    _addNodeRef(node, val, where);
                } else {
                    _addNodeHTML(node, val, where);
                }
            },

            _addNodeHTML : function(node, html, where) {
                if (where == "after") {
                    node.set(INNER_HTML, node.get(INNER_HTML) + html);
                } else if (where == "before") {
                    node.set(INNER_HTML, html + node.get(INNER_HTML));
                } else {
                    node.set(INNER_HTML, html);
                }
            },

            _addNodeRef : function(node, ref, where) {
                var append = true;
                if (where == "before") {
                    if (node.get("firstChild")) {
                        node.insertBefore(ref, node.get("firstChild"));
                        append = false;
                    }
                } else if (where != "after") { // replace
                    node.set(INNER_HTML, "");
                }
                if (append) {
                    node.appendChild(ref);
                }
            },

            setBody : function(val) {
                this.set(BODY, val);
            },

            setHeader : function() {
                this.set(HEADER, val);
            },

            setFooter : function() {
                this.set(FOOTER, val);
            },

            appendToBody : function() {
            },
            
            appendToHeader : function() {
            },

            appendToFooter : function() {
            },

            _getStdModTemplate : function(section) {
                var template = StdMod._TEMPLATES[section], 
                    t;

                if (!template) {
                    t = StdMod.TEMPLATES[section];
                    StdMod._TEMPLATES[section] = template = Node.create(t.html);
                    // TODO: Replace with ClassNameManager static version
                    template.addClass(Y.config.classNamePrefix + Widget.NAME + "-t.class"); 
                }
                return template.cloneNode(true);
            }
        };

        Y.WidgetStdMod = StdMod;

    }, "3.0.0");
