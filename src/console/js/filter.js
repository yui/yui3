var getCN = Y.ClassNameManager.getClassName;

function ConsoleFilters() {
    ConsoleFilters.superclass.apply(this,arguments);
}

Y.mix(ConsoleFilters,{
    NAME : 'console-filters',

    NS : 'filter',

    CATEGORIES_TEMPLATE :
        '<div class="{controls} {categories}"></div>',

    SOURCES_TEMPLATE :
        '<div class="{controls} {sources}"></div>',

    FILTER_TEMPLATE :
        '<label class="{filter_label}">'+
            '<input type="checkbox" value="{filter_name}" '+
                'class="{filter} {filter_type}">'+
        '</label>',

    CHROME_CLASSES : {
        controls     : Y.Console.CHROME_CLASSES.console_controls_class,
        categories   : getCN('console','filters','categories'),
        sources      : getCN('console','filters','sources'),
        category     : getCN('console','filter','category'),
        source       : getCN('console','filter','source'),
        filter       : getCN('console','filter'),
        filter_label : getCN('console','filter','label')
    },

    ATTRS : {
        /**
         * Default visibility applied to new categories and sources.
         *
         * @attribute defaultVisibility
         * @type {Boolean}
         * @default true
         */
        defaultVisibility : {
            value : true,
            validator : Y.Lang.isBoolean
        },

        /**
         * <p>Map of entry categories to their visibility status.  Update a
         * particular category's visibility by setting the subattribute to true
         * (visible) or false (hidden).</p>
         *
         * <p>For example, yconsole.filter.set('category.info', false) to hide
         * log entries with the category/logLevel of 'info'.</p>
         *
         * <p>Similarly, yconsole.filter.get('category.warn') will return a
         * boolean indicating whether that category is currently being included
         * in the UI.</p>
         *
         * <p>Unlike the YUI instance configuration's logInclude and logExclude
         * properties, filtered entries are only hidden from the UI, but
         * can be made visible again.</p>
         *
         * @attribute category
         * @type Object
         */
        category : {
            value : {},
            setter : function (v,k) {
                return this._setCategory(v,k);
            }
        },

        /**
         * <p>Map of entry sources to their visibility status.  Update a
         * particular sources's visibility by setting the subattribute to true
         * (visible) or false (hidden).</p>
         *
         * <p>For example, yconsole.filter.set('sources.slider', false) to hide
         * log entries originating from Y.Slider.</p>
         *
         * @attribute source
         * @type Object
         */
        source : {
            value : {},
            setter : function (v,k) {
                return this._setSource(v,k);
            }
        }
    }
});

Y.extend(ConsoleFilters, Y.Plugin.Base, {

    _categories : null,

    _sources : null,

    initializer : function () {
        this.doAfter("printLogEntry", this._afterPrintLogEntry);

        this.doAfter("renderUI", this.renderUI);
        this.doAfter("syncUI", this.syncUI);
        this.doAfter("bindUI", this.bindUI);
    },

    destructor : function () {
        if (this._categories) {
            this._categories.get('parentNode').removeChild(this._categories);
        }
        if (this._sources) {
            this._sources.get('parentNode').removeChild(this._sources);
        }

        var update = [];

        Y.Object.each(this.get('category'), function (v, k) {
            if (!v) {
                update.push(k.replace(/category\./,''));
            }
        });

        Y.Object.each(this.get('source'), function (v, k) {
            if (!v) {
                update.push(k.replace(/source\./,''));
            }
        });

        // Make everything visible again
        if (update.length) {
            Y.Array.each(update, function (item) {
               this._updateConsole(item,true);
            });
        }
    },

    renderUI : function () {
        var foot = this.get('host').get('contentBox').query('.yui-console-ft'),
            html;

        if (foot) {
            html = Y.substitute(
                        ConsoleFilters.CATEGORIES_TEMPLATE,
                        ConsoleFilters.CHROME_CLASSES);

            this._categories = foot.appendChild(Y.Node.create(html));

            html = Y.substitute(
                        ConsoleFilters.SOURCES_TEMPLATE,
                        ConsoleFilters.CHROME_CLASSES);

            this._sources = foot.appendChild(Y.Node.create(html));
        }
    },

    bindUI : function () {
        var cb = this.get('host').get('contentBox');
        
        cb.query('.yui-console-ft .yui-console-category-filters').
           on('click', this._onCategoryCheckboxClick);

        cb.query('.yui-console-ft .yui-console-source-filters').
           on('click', this._onSourceCheckboxClick);
            
        this.after('categoryChange',this._afterCategoryChange);
        this.after('sourceChange',  this._afterSourceChange);
    },

    syncUI : function () {
        Y.each(this.get('category'), function (v, k) {
            this._uiSetCheckbox('category', k, v);
        }, this);

        Y.each(this.get('source'), function (v, k) {
            this._uiSetCheckbox('source', k, v);
        }, this);
    },

    _afterPrintLogEntry : function (m) {
        var visible = this.get('defaultVisibility');

        if (!(m.category in this.get('category'))) {
            this.set("category." + m.category, visible);
        }
        if (!(m.source in this.get('source'))) {
            this.set("source." + m.source, visible);
        }
    },

    _afterCategoryChange : function (e) {
        var cat     = e.subAttrName.replace(/category\./, ''),
            visible = e.newVal;

        this._updateConsole(cat, visible);

        if (!e.fromUI) {
            this._uiSetCheckbox('category', cat, visible);
        }
    },

    _afterSourceChange : function (e) {
        var src     = e.subAttrName.replace(/source\./, ''),
            visible = e.newVal;

        this._updateConsole(src, visible);

        if (e && !e.fromUI) {
            this._uiSetCheckbox('source', src, visible);
        }
    },

    _updateConsole : function (item, visible) {
        var body = this.get('host').get('contentBox').
                    query('.'+Y.Console.CHROME_CLASSES.console_body_class),
            sel  = '.' + Y.Console.ENTRY_CLASSES.entry_class +
                   '.' + getCN('console','entry',item);

        if (body) {
            body.setStyle('display','none');
            body.queryAll(sel).setStyle('display','');
            body.setStyle('display','');
        }
    },

    _uiSetCheckbox : function (type, item, checked) {
        if (type && item) {
            var container = type === 'category' ?
                                this._categories :
                                this._sources,
                checkbox = container.query('input[type=checkbox].' +
                                getCN('console','filter',item));
                
            if (!checkbox) {
                checkbox = this._createCheckbox(container, type, item).
                            get('firstChild');
            }
            
            checkbox.set('checked', checked);
        }
    },

    _onCategoryCheckboxClick : function (e) {
        var t = e.target, cat;

        if (t.hasClass(ConsoleFilters.CHROME_CLASSES.filter)) {
            cat = t.get('value');
            if (cat && cat in this.get('category')) {
                this.set('category.' + cat, t.get('checked'), { fromUI: true });
            }
        }
    },

    _onSourceCheckboxClick : function (e) {
        var t = e.target, src;

        if (t.hasClass(ConsoleFilters.CHROME_CLASSES.filter)) {
            src = t.get('value');
            if (src && src in this.get('sources')) {
                this.set('source.' + src, t.get('checked'), { fromUI: true });
            }
        }
    },

    hideCategory : function (cat, multiple) {
        if (multiple) {
            Y.Array.each(arguments, arguments.callee, this);
        } else {
            this.set('category.' + cat, false);
        }
    },

    showCategory : function (cat, multiple) {
        if (multiple) {
            Y.Array.each(arguments, arguments.callee, this);
        } else {
            this.set('category.' + cat, true);
        }
    },

    hideSource : function (src, multiple) {
        if (multiple) {
            Y.Array.each(arguments, arguments.callee, this);
        } else {
            this.set('category.' + src, false);
        }
    },

    showSource : function (src, multiple) {
        if (multiple) {
            Y.Array.each(arguments, arguments.callee, this);
        } else {
            this.set('category.' + src, true);
        }
    },

    _createCheckbox : function (container, type, name) {
        return container.appendChild(
            Y.Node.create(
                Y.substitute(
                    ConsoleFilters.FILTER_TEMPLATE,
                    Y.merge(ConsoleFilters.CHROME_CLASSES, {
                        filter_name  : name,
                        filter_type  : type
                    }))));
    },

    _setCategory : function (v, cat) {
        return cat.split(/\./).length == 2 ? !!v : Y.Attribute.INVALID_VALUE;
    },

    _setSource : function (v, src) {
        return src.split(/\./).length == 2 ? !!v : Y.Attribute.INVALID_VALUE;
    }
});

Y.Plugin.ConsoleFilters = ConsoleFilters;
