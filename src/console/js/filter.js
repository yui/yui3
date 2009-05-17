var getCN = Y.ClassNameManager.getClassName,
    CONSOLE = 'console',
    FILTERS = 'filters',
    FILTER  = 'filter',
    CATEGORY   = 'category',
    SOURCE     = 'source',

    DOT = '.',
    DISPLAY = 'display',
    EMPTY   = '',
    NONE    = 'none',

    C_BODY       = DOT + Y.Console.CHROME_CLASSES.console_bd_class,
    C_FOOT       = DOT + Y.Console.CHROME_CLASSES.console_ft_class,
    C_ENTRY      = DOT + Y.Console.ENTRY_CLASSES.entry_class,
    C_CATEGORIES = ' .' + getCN(CONSOLE,CATEGORY,FILTERS),
    C_SOURCES    = ' .' + getCN(CONSOLE,SOURCE,FILTERS),

    SEL_CHECK    = 'input[type=checkbox].';

function ConsoleFilters() {
    ConsoleFilters.superclass.constructor.apply(this,arguments);
}

Y.mix(ConsoleFilters,{
    NAME : 'console-filters',

    NS : FILTER,

    CATEGORIES_TEMPLATE :
        '<div class="{controls} {categories}"></div>',

    SOURCES_TEMPLATE :
        '<div class="{controls} {sources}"></div>',

    FILTER_TEMPLATE :
        '<label class="{filter_label}">'+
            '<input type="checkbox" value="{filter_name}" '+
                'class="{filter} {filter_type}"> {filter_name}'+
        '</label>',

    CHROME_CLASSES : {
        controls     : Y.Console.CHROME_CLASSES.console_controls_class,
        categories   : getCN(CONSOLE,FILTERS,'categories'),
        sources      : getCN(CONSOLE,FILTERS,'sources'),
        category     : getCN(CONSOLE,FILTER,CATEGORY),
        source       : getCN(CONSOLE,FILTER,SOURCE),
        filter       : getCN(CONSOLE,FILTER),
        filter_label : getCN(CONSOLE,FILTER,'label')
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
            validator : function (v,k) {
                return this._validateCategory(k,v);
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
            validator : function (v,k) {
                return this._validateSource(k,v);
            }
        }
    }
});

Y.extend(ConsoleFilters, Y.Plugin.Base, {

    _entries : null,

    _categories : null,

    _sources : null,

    initializer : function () {
        this._entries = [];

        this.get('host').on("entry", this._onEntry, this);

        this.doAfter("renderUI", this.renderUI);
        this.doAfter("syncUI", this.syncUI);
        this.doAfter("bindUI", this.bindUI);

        this.doAfter("clearConsole", this._afterClearConsole);

        if (this.get('host').get('rendered')) {
            this.renderUI();
            this.syncUI();
            this.bindUI();
        }
    },

    destructor : function () {
        //TODO: grab last {consoleLimit} entries and update the console with
        //them (no filtering)
        this._entries = [];

        if (this._categories) {
            this._categories.get('parentNode').removeChild(this._categories);
        }
        if (this._sources) {
            this._sources.get('parentNode').removeChild(this._sources);
        }
    },

    renderUI : function () {
        var foot = this.get('host').get('contentBox').query(C_FOOT),
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
        this._categories.on('click', Y.bind(this._onCategoryCheckboxClick, this));

        this._sources.on('click', Y.bind(this._onSourceCheckboxClick, this));
            
        this.after('categoryChange',this._afterCategoryChange);
        this.after('sourceChange',  this._afterSourceChange);
    },

    syncUI : function () {
        Y.each(this.get(CATEGORY), function (v, k) {
            this._uiSetCheckbox(CATEGORY, k, v);
        }, this);

        Y.each(this.get(SOURCE), function (v, k) {
            this._uiSetCheckbox(SOURCE, k, v);
        }, this);

        this._updateConsole();
    },

    _onEntry : function (e) {
        this._entries.push(e.message);

        var cat = 'category.' + e.message.category,
            src = 'source.' + e.message.source,
            cat_filter = this.get(cat),
            src_filter = this.get(src),
            visible;

        if (cat_filter === undefined) {
            visible = this.get('defaultVisibility');
            this.set(cat, visible);
            cat_filter = visible;
        }

        if (src_filter === undefined) {
            visible = this.get('defaultVisibility');
            this.set(src, visible);
            src_filter = visible;
        }
        
        if (!cat_filter || !src_filter) {
            e.preventDefault();
        }
    },

    _afterClearConsole : function () {
        this._entries = [];
    },

    _afterCategoryChange : function (e) {
        var cat     = e.subAttrName.replace(/category\./, EMPTY),
            visible = e.newVal;

        this._updateConsole();

        if (cat && !e.fromUI) {
            this._uiSetCheckbox(CATEGORY, cat, visible);
        }
    },

    _afterSourceChange : function (e) {
        var src     = e.subAttrName.replace(/source\./, EMPTY),
            visible = e.newVal;

        this._updateConsole();

        if (src && !e.fromUI) {
            this._uiSetCheckbox(SOURCE, src, visible);
        }
    },

    _updateConsole : function () {
        var body = this.get('host').get('contentBox').query(C_BODY);

        if (body) {
            body.setStyle(DISPLAY,NONE);

            body.set('innerHTML','');

            // create array of displayed entries by walking from the end of
            // _entries and calling host.printLogEntry for all matching entries
            // until consoleLimit or i < 0

            body.setStyle(DISPLAY,EMPTY);
        }
    },

    _uiSetCheckbox : function (type, item, checked) {
        if (type && item) {
            var container = type === CATEGORY ?
                                this._categories :
                                this._sources,
                checkbox = container.query(SEL_CHECK +
                                getCN(CONSOLE,FILTER,item));
                
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
            if (cat && cat in this.get(CATEGORY)) {
                this.set('category.' + cat, t.get('checked'), { fromUI: true });
            }
        }
    },

    _onSourceCheckboxClick : function (e) {
        var t = e.target, src;

        if (t.hasClass(ConsoleFilters.CHROME_CLASSES.filter)) {
            src = t.get('value');
            if (src && src in this.get(SOURCE)) {
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

    _validateCategory : function (cat, v) {
        return Y.Lang.isObject(v,true) && cat.split(/\./).length < 3;
    },

    _validateSource : function (src, v) {
        return Y.Lang.isObject(v,true) && src.split(/\./).length < 3;
    }

});

Y.Plugin.ConsoleFilters = ConsoleFilters;
