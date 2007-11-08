(function () {

    var Y = YAHOO.util,
        W = YAHOO.widget,
        YUI = YAHOO.lang.CONST;

    /**
     * The Module represents a statically positioned widget, supporting the
     * standard module rendering format
     *
     * @param {Element} node
     * @param {Object} attributes
     */
    function Module(node, attributes) {
        YAHOO.widget.Module.superclass.constructor.apply(this, arguments);
    };

    // Static Widget API Impls
    Module.NAME = "Module";

    Module.CONFIG = {
    };

    Module.CLASSES = {
        ROOT : YUI.PREFIX + Module.NAME.toLowerCase(),
        HD : "hd",
        BD : "hd",
        FT : "ft"
    };

    Module.EVENTS = {
        CONTENT_CHANGE : "contentChange",
        BEFORE_HD_CHANGE : "beforeHeaderChanged",
        HD_CHANGE : "headerChanged",
        BEFORE_BD_CHANGE : "beforeBodyChanged",
        BD_CHANGE : "bodyChanged",
        BEFORE_FT_CHANGE : "beforeFooterChanged",
        FT_CHANGE : "footerChanged"
    };

    var ME = Module.EVENTS;

    var proto = {
        
        header : null,
        body : null,
        footer : null,
        
        initializer : function() {
            YAHOO.log('initializer called ' + this.toString(), 'life', this.constructor.NAME);

            function fireCC() {
                this.fireEvent(ME.CONTENT_CHANGE);
            }
            this.subscribe(ME.BD_CHANGE, fireCC);
            this.subscribe(ME.HD_CHANGE, fireCC);
            this.subscribe(ME.FT_CHANGE, fireCC);
        },

        destructor : function() {
            YAHOO.log('destructor called ' + this.toString(), 'life', this.constructor.NAME);
            this.header = null;
            this.body = null;
            this.footer = null;

            this.unsubscribeAll();

            // Where does this go?
            this.erase();
            this.renderer = null;
        },

        renderer : ModuleRenderer,

        setBody : function(bd) {
            if (this.fireEvent(ME.BEFORE_BD_CHANGE) !== false) {
                this.body = bd;
                this.fireEvent(ME.BD_CHANGE);
            }
        },

        setHeader : function(hd) {
            if (this.fireEvent(ME.BEFORE_HD_CHANGE) !== false) {
                this.header = hd;
                this.fireEvent(ME.HD_CHANGE);
            }
        },

        setFooter : function(ft) {
            if (this.fireEvent(ME.BEFORE_FT_CHANGE) !== false) {
                this.footer = ft;
                this.fireEvent(ME.FT_CHANGE);
            }
        },
    };

    YAHOO.lang.extend(Module, YAHOO.widget.Widget, proto);
    YAHOO.widget.Module = Module;

    function ModuleRenderer(module) {
        this.module = module;
        this.node = this.module.get('node').get('node');
        this.doc = this.node.ownerDocument;
        this._createModuleTemplate();
    }

    ModuleRenderer.prototype = {
        
        __ : {},
        _ : {},
        
        headerEl : null,
        bodyEl : null,
        footerEl : null,

        render : function () {
            this.renderHeader()
            this.renderBody();
            this.renderFooter();

            if (!this.__.subChg) {
                this.module.subscribe(ME.HD_CHANGE, this.renderHeader, this, true);
                this.module.subscribe(ME.BD_CHANGE, this.renderBody, this, true);
                this.module.subscribe(ME.FT_CHANGE, this.renderFooter, this, true);
                this.__.subChg = true;
            }
        },

        renderHeader : function() {
            if (!this.headerEl) {
               this.createHeader();
            }
            this._addContent(this.headerEl, this.module.header);
        },

        renderBody : function() {
            if (!this.bodyEl) {
               this.createBody();
            }
            this._addContent(this.bodyEl, this.module.body);
        },

        renderFooter : function() {
            if (!this.footerEl) {
               this.createFooter();
            }
            this._addContent(this.footerEl, this.module.footer);
        },

        erase : function() {
            Y.Event.purgeElement(this.headerEl, true);
            Y.Event.purgeElement(this.bodyEl, true);
            Y.Event.purgeElement(this.footerEl, true);
            this.node.innerHTML = "";
            this.headerEl = null;
            this.footerEl = null;
            this.bodyEl = null;
        },

        createHeader : function() {
            this.headerEl = this.__.hdTemplate.cloneNode(false);
            if (this.bodyEl) {
                this.node.insertBefore(this.headerEl, this.bodyEl);
            } else {
                this.node.appendChild(this.headerEl);
            }
        },

        createBody : function() {
            this.bodyEl = this.__.bdTemplate.cloneNode(false);
            if (this.footerEl) {
                this.node.insertBefore(this.bodyEl, this.footerEl);
            } else {
                this.node.appendChild(this.bodyEl);
            }
        },

        createFooter : function() {
            this.footerEl = this.__.ftTemplate.cloneNode(false);
            this.node.appendChild(this.footerEl);
        },

        _createModuleTemplate : function() {
            if (!this.__.modTemplate) {
                this.__.modTemplate = document.createElement("div");

                this.__.modTemplate.innerHTML = ("<div class=\"" + 
                    Module.CLASSES.HD + "\"></div>" + "<div class=\"" + 
                    Module.CLASSES.BD + "\"></div><div class=\"" + 
                    Module.CLASSES.FT + "\"></div>");

                this.__.hdTemplate = this.__.modTemplate.firstChild;
                this.__.bdTemplate = this.__.hdTemplate.nextSibling;
                this.__.ftTemplate = this.__.bdTemplate.nextSibling;
            }
        },

        _addContent : function(el, content) {
            if (content && el) {
                if (content.tagName) {
                    Y.Event.purgeElement(el, true);
                    el.innerHTML = "";
                    el.appendChild(content);
                } else {
                    el.innerHTML = content.toString();
                }
            }
        }
    };

    YAHOO.widget.ModuleRenderer = ModuleRenderer;
})();