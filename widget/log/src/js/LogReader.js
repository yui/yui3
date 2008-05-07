// Formerly LogReader
Y.log.Reader = function () {
    this.constructor.superclass.constructor.apply(this,arguments);
};

Y.mix(Y.log.Reader, {

    NAME : 'logreader',

    PLUGINS : [],

    CLASSES : {
        CONTAINER   : 'yui-log',
        HD          : 'yui-log-hd',
        CONSOLE     : 'yui-log-console',
        FT          : 'yui-log-ft',
        HIDE_FT     : 'yui-log-hide-ft',
        CONTROLS    : 'yui-log-controls',
        BUTTON      : 'yui-log-button',
        LABEL       : 'yui-log-label',
        CHECKBOX    : 'yui-log-checkbox',
        COLLAPSE    : 'yui-log-collapse', // .yui-log-collapse .yui-log-collapse
        EXPAND      : 'yui-log-expand',
        ACTIVE      : 'yui-log-active',
        CLEAR       : 'yui-log-clear',
        CAT_FILTERS : 'yui-log-categories',
        SRC_FILTERS : 'yui-log-sources',
        CATEGORY    : 'yui-log-category',
        SOURCE      : 'yui-log-source',
        FILTER      : 'yui-log-filter',
        HIDE_BASE   : 'yui-log-hide-',
        FILTER_BASE : 'yui-log-filter-'
    },

    STRINGS : {
        COLLAPSE    : "Collapse",
        EXPAND      : "Expand",
        ACTIVE      : "Active",
        CLEAR       : "Clear"
    },

    VERBOSE : 'verbose',
    BASIC   : 'basic',

    ATTRS : {

        title : {value: "Log Console"},

        // accept messages
        enabled : {value: true},

        // display messages received
        active : {value: true},

        defaultCategory : {value:'info'},

        defaultSource   : {value:'global'},

        filters         : {
            value:{
                category : {
                    info : false,
                    warn : false,
                    error: false,
                    time : false
                },
                source   : {
                    global : false
                }
            }
        },

        templates : {
            value: {
                verbose : null,
                basic   : null
            }
        },

        defaultTemplate : {value:'verbose'},

        entryWriters : { value: {
            entry : '_entryFromTemplate'
        }},

        defaultWriter : {value:'entry'},

        printTimeout : {
            value:100,
            validator : Y.lang.isNumber
        },

        consoleLimit : {value:500},

        footerEnabled : {value: true},

        // convenience attrib for managing defaultTemplate
        verbose : {
            value: true,
            set : function (val) {
                var d = Y.config.debug;
                Y.config.debug = false;

                this.set('defaultTemplate',
                    (val ? Y.log.Reader.VERBOSE : Y.log.Reader.BASIC));

                Y.config.debug = d;

                return !!val;
            }
        },

        newestOnTop : {value: true},

        collapsed : {value:false},

        startTime : {value:new Date()},

        lastTime : {value:new Date()}

    }

});

Y.extend(Y.log.Reader,Y.Widget,{
    _head : null,
    _title : null,
    _console : null,
    _foot : null,
    _catFilters : null,
    _srcFilters : null,

    _timeout : null,

    buffer : null,

    // Override default AttributeProvider methods to handle object values
    get : function (attr) {
        var d = Y.config.debug;
        Y.config.debug = false;

        var path = attr.split('.'),
            att  = path[0],
            i = 1, l = path.length - 1,
            v = Y.log.Reader.superclass.get.call(this,att);

        if (l) {
            for (;v !== undefined && i<l;++i) {
                v = v[path[i]];
            }

            Y.config.debug = d;
            return v === undefined ? undefined : v[path[i]];
        }


        Y.config.debug = d;
        return v;
    },
    set : function (attr,val,silent) {
        var d = Y.config.debug;
        Y.config.debug = false;

        var path = attr.split('.'),
            att  = path[0],
            i = 1, l = path.length - 1,
            v = l ? Y.clone(this.get(att)) : val,
            o;

        if (l) {
            o = v;
            for (;o !== undefined && i<l;++i) {
                o = o[path[i]];
            }

            if (o === undefined) {
                Y.config.debug = d;

                return this;
            }

            o[path[i]] = val;
        }

        Y.config.debug = d;
        return Y.log.Reader.superclass.set.call(this,att,v,silent);
    },

    initializer : function (cfg) {
        var d = Y.config.debug;
        Y.config.debug = false;

        this.buffer    = [];

        // HACK: AttributeProvider should clone object values but doesn't yet
        this._initObjectAttributes();

        this._initTemplates();

        Y.on('yui:log',Y.bind(this._handleLogEntry,this));

        Y.config.debug = d;
    },

    // HACK: AttributeProvider should clone object attribute values
    _initObjectAttributes : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        var attrs = ['filters','templates','entryWriters'],
            i = attrs.length - 1;

        for (;i>=0;--i) {
            this.set(attrs[i],Y.clone(this.get(attrs[i])),true);
        }

        Y.config.debug = d;
    },

    _initTemplates : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        var C = Y.log.Reader.CLASSES;

        // For verbose log entries
        this.set('templates.verbose',
            '<div class="'+C.MESSAGE+' '+C.VERBOSE+'">'+
                '<pre>'+
                    '<p>'+
                        '<span class="'+C.ENTRY_CAT+'">{label}</span>'+
                        ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                    '</p>'+
                    '<p>{sourceAndDetail}</p>'+
                    '<p>{message}</p>'+
                '</pre>'+
            '</div>');

        // For basic log entries
        this.set('templates.basic',
            '<div class="'+C.MESSAGE+'">'+
                '<pre>'+
                    '<p>'+
                        '<span class="'+C.ENTRY_CAT+'">{label}</span>'+
                        ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                        ' {sourceAndDetail}:'+
                        ' {message}'+
                    '</p>'+
                '</pre>'+
            '</div>');

        Y.config.debug = d;
    },

    renderer : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        Y.log.Reader.superclass.renderer.apply(this,arguments);

        this.renderUI();
        this.syncUI();
        this.bindUI();

        Y.config.debug = d;
    },

    renderUI : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        if (!this.rendered) {
            this._root.innerHTML = '';

            this._root.addClass(Y.log.Reader.CLASSES.CONTAINER);

            this._renderHead();
            this._renderConsole();
            this._renderFoot();
        }

        Y.config.debug = d;
    },

    _renderHead : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        var C = Y.log.Reader.CLASSES,
            S = Y.log.Reader.STRINGS;

        this._head = Y.Node.create(
            '<div class="'+C.HD+'">'+
                '<div class="'+C.CONTROLS+'">'+
                    '<input type="button" class="'+C.BUTTON+' '+C.COLLAPSE+'"'+
                        ' value="'+S.COLLAPSE+'">'+
                    '<input type="button" class="'+C.BUTTON+' '+C.EXPAND+'"' +
                        ' value="'+S.EXPAND+'">'+
                '</div>'+
                '<h4>'+this.get('title')+'</h4>'+
            '</div>');

        this._title = this._head.query('h4');

        this._root.insertBefore(this._head,this._root.get('firstChild')||null);

        Y.config.debug = d;
    },

    _renderConsole : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        this._console = this._root.insertBefore(
            Y.Node.create('<div class="'+Y.log.Reader.CLASSES.CONSOLE+'"></div>'),
            this._foot || null);

        Y.config.debug = d;
    },

    _renderFoot : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        var C = Y.log.Reader.CLASSES,
            S = Y.log.Reader.STRINGS,
            filters,f;

        this._foot = Y.Node.create(
            '<div class="'+C.FT+'">'+
                '<div class="'+C.CONTROLS+'">'+
                    '<label class="'+C.LABEL+'">'+S.ACTIVE+
                        ' <input type="checkbox" class="'+
                            C.CHECKBOX+' '+C.ACTIVE+'" value="1">'+
                    '</label>'+
                    '<input type="button" class="'+C.BUTTON+' '+C.CLEAR+'"'+
                        ' value="'+S.CLEAR+'">'+
                '</div>');

        this._catFilters = this._foot.appendChild(Y.Node.create(
            '<div class="'+C.CONTROLS + ' ' + C.CAT_FILTERS + '"></div>'));
            
        this._srcFilters = this._foot.appendChild(Y.Node.create(
            '<div class="'+C.CONTROLS + ' ' + C.SRC_FILTERS + '"></div>'));

        // Add the category filter checks
        filters = this.get('filters.category');
        for (f in filters) {
            if (Y.object.owns(filters,f)) {
                this._catFilters.appendChild(
                    this._createFilter(C.CATEGORY,f));
            }
        }

        // Add the source filter checks
        filters = this.get('filters.source');
        for (f in filters) {
            if (Y.object.owns(filters,f)) {
                this._srcFilters.appendChild(
                    this._createFilter(C.SOURCE,f));
            }
        }

        this._root.appendChild(this._foot);

        Y.config.debug = d;
    },

    syncUI : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        var C = Y.log.Reader.CLASSES,
            filters;

        // Set active check
        this._setActive(this.get('active'));

        // Set the collapsed class state
        this._setCollapsed(this.get('collapsed'));

        // Add/remove the hidden foot class
        this._setFooterEnabled(this.get('footerEnabled'));

        // Category filter checks
        filters = this.get('filters.category');
        this._foot.queryAll('input[type=checkbox].'+C.CATEGORY).each(
            function (check) {
                check.set('checked', (check.get('value') in filters) ?
                    !!filters[check.get('value')] : false);
            });
            
        // Source filter checks
        filters = this.get('filters.source');
        this._foot.queryAll('input[type=checkbox].'+C.SOURCE).each(
            function (check) {
                check.set('checked', (check.get('value') in filters) ?
                    !!filters[check.get('value')] : false);
            });

        Y.config.debug = d;
    },

    bindUI : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        // UI control click events
        // (collapse, expand, active, clear, filters)
        // move to queryAll(..).on('click',..)
        var controls = this._root.queryAll('.'+Y.log.Reader.CLASSES.CONTROLS),
            i = controls.get('length') - 1;
            
        for (;i>=0;--i) {
            controls.item(i).on('click',Y.bind(this._handleControlClick,this));
        }
        
        // Attribute changes
        this.on('titleChange',         Y.bind(this._setTitle,this));
        this.on('activeChange',        Y.bind(this._setActive,this));
        this.on('collapsedChange',     Y.bind(this._setCollapsed,this));
        this.on('consoleLimitChange',  Y.bind(this._setConsoleLimit,this));
        this.on('footerEnabledChange', Y.bind(this._setFooterEnabled,this));
        // HACK: will point to this._setFilter or something like that
        this.on('filtersChange',       Y.bind(this._handleFiltersChange,this));

        Y.config.debug = d;
    },

    _handleControlClick : function (e) {
        var d = Y.config.debug;
        Y.config.debug = false;

        var C = Y.log.Reader.CLASSES,
            t = e.target;

        if (t.hasClass(C.COLLAPSE)) {
            this.set('collapsed', true);
        } else if (t.hasClass(C.EXPAND)) {
            this.set('collapsed', false);
        } else if (t.hasClass(C.ACTIVE)) {
            this.set('active', false);
        } else if (t.hasClass(C.CLEAR)) {
            this.clearConsole();
        } else if (t.hasClass(C.FILTER)) {
            this.set('filters.' +
                (t.hasClass(C.CATEGORY) ? 'category.' : 'source.') +
                t.get('value'),
                t.get('checked'));
        }

        Y.config.debug = d;
    },

    _setTitle : function (v) {
        var d = Y.config.debug;
        Y.config.debug = false;

        v = typeof v == 'object' ? v.newVal : v;

        this._title.set('innerHTML',v);
        
        Y.config.debug = d;
    },

    _setActive : function (b) {
        var d = Y.config.debug;
        Y.config.debug = false;

        b = typeof b == 'object' ? b.newVal : b;

        // TODO: this should be this._head.queryAll(..).set('checked',!!b)
        var checks = this._head.queryAll(
                        'input[type=checkbox].'+Y.log.Reader.CLASSES.ACTIVE),
            i = checks.get('length') - 1;

        for (;i>=0;--i) {
            checks.item(i).set('checked',!!b);
        }

        if (b) {
            this._schedulePrint();
        } else if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }

        Y.config.debug = d;
    },

    _setCollapsed : function (b) {
        var d = Y.config.debug;
        Y.config.debug = false;

        b = typeof b == 'object' ? b.newVal : b;

        this._root[b?'addClass':'removeClass'](Y.log.Reader.CLASSES.COLLAPSE);

        Y.config.debug = d;
    },

    _setConsoleLimit : function (v) {
        var d = Y.config.debug;
        Y.config.debug = false;

        v = typeof v === 'object' ? v.newVal : v;
        this._trimOldEntries(v);

        Y.config.debug = d;
    },

    clearConsole : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        // TODO: clear event listeners from console contents
        this._console.set('innerHTML','');

        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }

        this.buffer = [];

        Y.config.debug = d;
    },

    reset : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        this.clearConsole();
        this.set('startTime',new Date());
        this.set('enabled',true);
        this.set('active',true);

        this.fire('reset');

        Y.config.debug = d;
    },

    _handleLogEntry : function (msg,cat,src) {
        var d = Y.config.debug;
        Y.config.debug = false;

        if (this.get('enabled')) {
            var m     = this.normalizeMessage(msg,cat,src),
                known = this.get('filters');

            if (m) {
                // New category?
                if (m.category && !(m.category in known.category)) {
                    this.createCategory(m.category,false);
                }

                // New source?
                if (m.source && !(m.source in known.source)) {
                    this.createSource(m.source,false);
                }

                // buffer the output
                this.buffer.push(m);
                this._schedulePrint();
            }
        }

        Y.config.debug = d;
    },

    normalizeMessage : function (msg,cat,src) {
        var d = Y.config.debug;
        Y.config.debug = false;

        var m = {
            time            : new Date(),
            message         : msg,
            category        : cat || this.get('defaultCategory'),
            sourceAndDetail : src || this.get('defaultSource'),
            source          : null,
            label           : null,
            localTime       : null,
            elapsedTime     : null,
            totalTime       : null
        };

        // Extract m.source "Foo" from m.sourceAndDetail "Foo bar baz"
        m.source          = /^(\S+)\s/.test(m.sourceAndDetail) ?
                                RegExp.$1 : m.sourceAndDetail;
        m.label           = m.category.toUpperCase();
        m.localTime       = m.time.toLocaleTimeString ? 
                            m.time.toLocaleTimeString() : (m.time + '');
        m.elapsedTime     = m.time - this.get('lastTime');
        m.totalTime       = m.time - this.get('startTime');

        this.set('lastTime',m.time);

        Y.config.debug = d;

        return m;
    },

    _schedulePrint : function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        if (this.get('active') && !this._timeout) {
            this._timeout = setTimeout(
                Y.bind(this.printBuffer,this),
                this.get('printTimeout'));
        }

        Y.config.debug = d;
    },

    printBuffer: function () {
        var d = Y.config.debug;
        Y.config.debug = false;

        if (this.get('active') && this.rendered) {
            clearTimeout(this._timeout);
            this._timeout = null;
            var messages = this.buffer,
                i = 0, l = messages.length;

            this.buffer = [];

            // TODO: use doc frag?
            for (;i<l;++i) {
                this.printLogEntry(messages[i]);

                this._trimOldEntries();
            }
        }

        Y.config.debug = d;
    },

    printLogEntry : function (m) {
        var d = Y.config.debug;
        Y.config.debug = false;

        var writers = this.get('entryWriters'),
            wr = writers[m.cat] || writers[this.get('defaultWriter')],
            output;

        output = typeof wr === 'function' ?  wr.call(this,m) : this[wr](m);

        if (output) {
            if (this.get('newestOnTop')) {
                this._console.insertBefore(
                    output,this._console.get('firstChild'));
            } else {
                this._console.appendChild(output);
                this._console.set('scrollTop',
                    this._console.get('scrollHeight'));
            }
        }

        Y.config.debug = d;
    },

    _entryFromTemplate : function (m) {
        var d = Y.config.debug;
        Y.config.debug = false;

        m = this._htmlEscapeMessage(m);

        var templates = this.get('templates'),
            t = templates[m.category] || templates[this.get('defaultTemplate')],
            n = Y.Node.create(Y.lang.substitute(t,m));

        n.addClass(this._filterClass(m.category));
        n.addClass(this._filterClass(m.source));

        Y.config.debug = d;

        return n;
    },

    _htmlEscapeMessage : function (m) {
        var d = Y.config.debug;
        Y.config.debug = false;

        function esc(s) {
            return s.replace(/&/g,'&#38;').
                     replace(/</g,'&#60;').
                     replace(/>/g,'&#62;');
        }

        m = Y.clone(m);
        m.message = typeof m.message === 'string' ? esc(m.message) : m.message;
        m.label   = typeof m.label   === 'string' ? esc(m.label)   : m.label;
        m.source  = typeof m.source  === 'string' ? esc(m.source)  : m.source;
        m.sourceAndDetail = typeof m.sourceAndDetail === 'string' ?
            esc(m.sourceAndDetail) : m.sourceAndDetail;
        m.category        = typeof m.category        === 'string' ?
            esc(m.category)        : m.category;

        Y.config.debug = d;

        return m;
    },

    _trimOldEntries : function (max) {
        var d = Y.config.debug;
        Y.config.debug = false;

        if (this._console) {
            var entries = this._console.get('childNodes'),
                idx     = entries.get('length') -
                            ((max|0) || this.get('consoleLimit')),
                del,i;

            if (idx > 0) {
                del = this.get('newestOnTop') ?
                        entries.slice(idx) : entries.slice(0,idx);

                for (i=del.length-1;i>=0;--i) {
                    this._console.removeChild(entries[i]);
                }
            }
        }

        Y.config.debug = d;
    },

    // Log entry display filtering methods
    hideEntries : function (name) {
        var d = Y.config.debug;
        Y.config.debug = false;

        var filters = this.get('filters'),f;
        for (f in filters) {
            if (Y.object.owns(filters,f) && Y.object.owns(filters[f],name)) {
                this.set('filters.'+f+'.'+name, true);
            }
        }

        Y.config.debug = d;
    },

    showEntries : function (name) {
        var d = Y.config.debug;
        Y.config.debug = false;

        var filters = this.get('filters'),f;
        for (f in filters) {
            if (Y.object.owns(filters,f) && Y.object.owns(filters[f],name)) {
                this.set('filters.'+f+'.'+name, true);
            }
        }

        Y.config.debug = d;
    },

    _setFilter : function (name,checked) {
        var d = Y.config.debug;
        Y.config.debug = false;

        // TODO: should be this._foot.queryAll(..).set('checked',checked)
        var checks = this._foot.queryAll('input[type=checkbox].'+
                        this._filterClass(name)),
            i = checks.get('length') - 1;

        for (;i>=0;--i) {
            checks.item(i).set('checked',checked);
        }

        this._filterEntries(name, !!checked);

        Y.config.debug = d;
    },

    _filterEntries : function (name,on) {
        // TODO: break out support for cascading hide class via Y.css plugin ala
        /*
        // add or remove the filter class from the root node
        this._root[on?'addClass':'removeClass'](this._filterClass(name),true);
        */

        var d = Y.config.debug;
        Y.config.debug = false;

        // TODO: should be this._console.queryAll(..).setStyle('display',..);
        var entries = this._console.queryAll('.'+this._filterClass(name)),
            i = entries.get('length') - 1;

        for (;i>=0;--i) {
            entries.item(i).setStyle('display',(on?'none':''));
        }
        
        Y.config.debug = d;
    },

    _setFooterEnabled : function (show) {
        var d = Y.config.debug;
        Y.config.debug = false;

        this._root[show?'removeClass':'addClass'](Y.log.Reader.CLASSES.HIDE_FT);

        Y.config.debug = d;
    },

    createCategory : function (name, filtered) {
        this.set('filters.category.'+name, !!filtered);
    },
    createSource : function (name, filtered) {
        this.set('filters.source.'+name, !!filtered);
    },

    _createFilter : function (type,name) {
        var d = Y.config.debug;
        Y.config.debug = false;

        var C     = Y.log.Reader.CLASSES,
            label = Y.Node.create(
                '<label class="'+C.LABEL+'">'+
                    '<input type="checkbox" value="'+name+'" class="'+
                        C.FILTER+' '+type+' '+this._filterClass(name)+'"> '+
                        name+
                '</label>');

        // TODO: Break this out into a Y.css module
        /*
        if (Y.css && !/^(?:info|warn|error|time)$/.test(name.toLowerCase())) {
            Y.css('.'+this._filterClass(name,true) + ' .'+this._filterClass(name), {display: 'none'});
        }
        */

        Y.config.debug = d;

        return label;
    },

    _filterClass : function (name,hide) {
        return Y.log.Reader.CLASSES[(hide ? 'HIDE_BASE' : 'FILTER_BASE')]+name;
    },

    _handleFiltersChange : function (e) {
        // HACK: until set passes payload, we have to manually determine
        // what changed.

        // Build a list of paths to compare against the previous value
        var C = Y.log.Reader.CLASSES,
            buildPaths = function (o) {
                var paths = [];

                function drill(o,p) {
                    if (typeof o === 'object') {
                        for (var k in o) {
                            if (Y.object.owns(o,k)) {
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
            type,name,on;

        for (;i<l;++i) {
            on = val(e.newVal,bPaths[i]);
            // TODO: this does not handle deletions
            if (val(e.prevVal,bPaths[i]) !== on) {
                // Change to existing filter
                name = bPaths[i][1];
                this._setFilter(name,on);
            }
            done[bPaths[i].join('.')] = true;
        }
        for (i=0,l=aPaths.length;i<l;++i) {
            if (!done[aPaths[i].join('.')]) {
                // New filter check
                type = aPaths[i][0] == 'category'?C.CATEGORY:C.SOURCE;
                name = aPaths[i][1];
                this._createFilter(type,name);
                this._setFilter(name,val(e.newVal,aPaths[i]));
            }
        }
    }

});
