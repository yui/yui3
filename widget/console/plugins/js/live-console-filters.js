var getCN = Y.ClassNameManager.getClassName,
    LOGREADER  = 'logreader',
    COLLAPSED  = 'collapsed',
    CATEGORIES = 'categories',
    SOURCES    = 'sources',
    
    C_FT       = getCN(LOGREADER,'ft'),
    C_HIDE_FT  = getCN(LOGREADER,'hide','ft'),
    C_LABEL    = getCN(LOGREADER,'label'),
    C_CHECKBOX = getCN(LOGREADER,'checkbox'),
    C_CAT_CHECKS  = getCN(LOGREADER,CATEGORIES),
    C_SRC_CHECKS  = getCN(LOGREADER,SOURCES),
    C_FILTER      = getCN(LOGREADER,'filter'),
    C_CATEGORY    = getCN(LOGREADER,CATEGORY),
    C_SOURCE      = getCN(LOGREADER,SOURCE);

function LiveConsoleFilters() {
    LiveConsoleFilters.superclass.apply(this,arguments);
}

// collapsable, filterable, templatable
Y.mix(LiveConsoleFilters,{
    NAME : 'liveconsolefilters',

    NS : 'liveconsolefilters',

    STRINGS : {
    },

    ATTRS : {
        /**
         * Map of known entry types to their filter status.  By default there
         * are two groups of entryTypes: category and source.  Each contains
         * a map of the known categories or sources, respectively.
         *
         * For example, myReader.get('entryTypes.category.warn') will return a
         * boolean indicating whether entries with the category "warn" should
         * be displayed in the console.
         *
         * The default structure is:
         * <pre>entryTypes : {
         *     category : {
         *         info : true,
         *         warn : true,
         *         error: true,
         *         time : true
         *     },
         *     source : {
         *         global : true
         *     }
         * }</pre>
         *
         * Unknown categories or sources used in log statements will add to to
         * this structure, defaulting their display flag to true. E.g.
         * <code>Y.log("my message","stuff_i_care_about","my_app");</code>
         * will cause entryTypes.category.stuff_i_care_about : true and
         * entryTypes.source.my_app : true to be added to the map and
         * appropriate filter controls added to the LogReader display.
         *
         * @attribute entryTypes
         * @type Object
         */
        entryTypes       : {
            value : {
                category : {
                    info : true,
                    warn : true,
                    error: true,
                    time : true
                },
                source   : {
                    global : true
                }
            }
        },

        footerEnabled : {
            value : true
        }

    }
});

Y.extend(LiveConsoleFilters, {
    _foot : null,
    _catChecks : null,
    _srcChecks : null,

    initializer : function () {
        var lr = this._owner;

        // HACK: AttributeProvider should clone object values but doesn't yet
        this._initObjectAttributes();

    },

    // HACK: AttributeProvider should clone object attribute values
    _initObjectAttributes : function () {
        var attrs = ['entryTypes','templates','entryWriters'],
            i = attrs.length - 1;

        for (;i>=0;--i) {
            this.set(attrs[i],Y.clone(this.get(attrs[i])),true);
        }
    },

    renderUI : function () {
        this._renderFoot();
    },

    bindUI : function () {
        this.after('footerEnabledChange', this._afterFooterEnabled);
        this.after('entryTypesChange',    this._afterEntryTypesChange);
    },

    syncUI : function () {
        this.set(FOOTER_ENABLED,this.get(FOOTER_ENABLED));

        // Category entryType checks
        entryTypes = this.get('entryTypes.category');
        this._foot.queryAll('input[type=checkbox].'+C_CATEGORY).each(
            function (check) {
                check.set(CHECKED, (check.get(VALUE) in entryTypes) ?
                    entryTypes[check.get(VALUE)] : true);
            });
            
        // Source entryType checks
        entryTypes = this.get('entryTypes.source');
        this._foot.queryAll('input[type=checkbox].'+C_SOURCE).each(
            function (check) {
                check.set(CHECKED, (check.get(VALUE) in entryTypes) ?
                    entryTypes[check.get(VALUE)] : true);
            });
    },

    _initFoot : function () {
        this._catChecks = this._foot.appendChild(Y.Node.create(
            '<div class="'+C_CONTROLS+' '+C_CAT_CHECKS+'"></div>'));
            
        this._srcChecks = this._foot.appendChild(Y.Node.create(
            '<div class="'+C_CONTROLS+' '+C_SRC_CHECKS + '"></div>'));

        // Add the category entryType checks
        entryTypes = this.get('entryTypes.category');
        for (t in entryTypes) {
            if (entryTypes.hasOwnProperty(t)) {
                this._catChecks.appendChild(
                    this._createEntryType(C_CATEGORY,t));
            }
        }

        // Add the source entryType checks
        entryTypes = this.get('entryTypes.source');
        for (t in entryTypes) {
            if (entryTypes.hasOwnProperty(t)) {
                this._srcChecks.appendChild(
                    this._createEntryType(C_SOURCE,t));
            }
        }
    }

    _onNewEntry : function (e,m) {
        if (m) {
            // New category?
            if (m.category && !(m.category in known.category)) {
                this.createCategory(m.category,true);
            }

            // New source?
            if (m.source && !(m.source in known.source)) {
                this.createSource(m.source,true);
            }
        }
    },

    _onControlClick : function (e) {
        var t = e.target;

        if (t.hasClass(C_FILTER)) {
            this.set('entryTypes.' +
                (t.hasClass(C_CATEGORY) ? 'category.' : 'source.') +
                t.get(VALUE),
                t.get(CHECKED));
        }
    },

    _afterCollapsedChange : function (e) {
        this._owner._addOrRemoveClass(C_COLLAPSE,e.newVal);
    },

    // Log entry display filtering methods
    hideEntries : function (name) {
        var entryTypes = this.get('entryTypes'),t;

        for (t in entryTypes) {
            if (entryTypes.hasOwnProperty(t) &&
                entryTypes[t].hasOwnProperty(name)) {
                this.set('entryTypes.'+t+'.'+name, false);
            }
        }
    },

    showEntries : function (name) {
        var entryTypes = this.get('entryTypes'),t;

        for (t in entryTypes) {
            if (entryTypes.hasOwnProperty(t) &&
                entryTypes[t].hasOwnProperty(name)) {
                this.set('entryTypes.'+t+'.'+name, true);
            }
        }
    },

    _setEntryType : function (name,checked) {
        // TODO: should be this._foot.queryAll(..).set(CHECKED,checked)
        var checks = this._foot.queryAll('input[type=checkbox].'+
                        this.getClassName(C_ENTRY_TYPE,name)),
            i = checks.size() - 1;

        for (;i>=0;--i) {
            checks.item(i).set(CHECKED,checked);
        }

        this._filterEntries(name, !checked);
    },

    _filterEntries : function (name,on) {
        this._addOrRemoveClass(this.getClassName(C_HIDE_BASE,name),on);
    },

    _setFooterEnabled : function (show) {
        this._addOrRemoveClass(C_HIDE_FT,!show);
    },

    createCategory : function (name, show) {
        this.set('entryTypes.category.'+name, !!show);
    },
    createSource : function (name, show) {
        this.set('entryTypes.source.'+name, !!show);
    },

    _createEntryType : function (type,name) {
        var label = Y.Node.create(
                '<label class="'+C_LABEL+'">'+
                    '<input type="checkbox" value="'+name+'" class="'+
                        C_FILTER+' '+type+' '+
                        this.getClassName(C_ENTRY_TYPE,name)+'"> '+
                        name+
                '</label>'),
            selector = '.'  + this.getClassName(C_HIDE_BASE,name) +
                       ' .' + C_CONSOLE +
                       ' .' + this.getClassName(C_ENTRY_TYPE,name);

        Y.StyleSheet(LOGREADER).set(selector, {display: 'none'});

        return label;
    },

    _handleEntryTypesChange : function (e) {
        // We have to determine all terminal paths that have changed in case
        // a branch node in the obj structure was changed.

        // Build a list of paths to compare against the previous value
        var buildPaths = function (o) {
                var paths = [];

                function drill(o,p) {
                    if (typeof o === 'object') {
                        for (var k in o) {
                            if (o.hasOwnProperty(k)) {
                                drill(o[k],p.concat(k));
                            }
                        }
                    } else if (p) {
                        paths.push(p);
                    }
                }

                drill(o,[]);

                return paths;
            },
            val = function (o,p) {
                var v = o,
                    i = 0, l = p.length;

                for (;i<l && v !== undefined; ++i) {
                    v = v[p[i]];
                }

                return v;
            },
            bPaths  = buildPaths(e.prevVal),
            aPaths  = buildPaths(e.newVal),
            done = {},
            i = 0, l = bPaths.length,
            name,on;

        for (;i<l;++i) {
            on = val(e.newVal,bPaths[i]);
            // TODO: this does not handle deletions
            if (val(e.prevVal,bPaths[i]) !== on) {
                // Change to existing entryType bool
                name = bPaths[i][1];
                this._setEntryType(name,on);
            }
            done[bPaths[i].join('.')] = true;
        }
        for (i=0,l=aPaths.length;i<l;++i) {
            if (!done[aPaths[i].join('.')]) {
                // New entryType check
                name = aPaths[i][1];
                if (aPaths[i][0] == 'category') {
                    this._catChecks.appendChild(
                        this._createEntryType(C_CATEGORY,name));
                } else {
                    this._srcChecks.appendChild(
                        this._createEntryType(C_SOURCE,name));
                }

                this._setEntryType(name,val(e.newVal,aPaths[i]));
            }
        }
    },

});

Y.Plugin.CollapsableConsole = CollapsableConsole;
