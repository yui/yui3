YUI.add('logreader', function(Y) {

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
        CAT_CHECKS  : 'yui-log-categories',
        SRC_CHECKS  : 'yui-log-sources',
        CATEGORY    : 'yui-log-category',
        SOURCE      : 'yui-log-source',
        ENTRY       : 'yui-log-entry',
        VERBOSE     : 'yui-log-verbose',
        ENTRY_META  : 'yui-log-entry-meta',
        ENTRY_CAT   : 'yui-log-entry-cat',
        ENTRY_SRC   : 'yui-log-entry-src',
        ENTRY_TIME  : 'yui-log-entry-time',
        ENTRY_TYPE  : 'yui-log-entry-type',
        HIDE_BASE   : 'yui-log-hide-',
        ENTRY_TYPE_BASE : 'yui-log-entry-type-'
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

        title : {
            value : "Log Console"
        },

        // accept messages
        enabled : {
            value : true
        },

        // display messages received
        active : {
            value : true
        },

        defaultCategory : {
            value : 'info'
        },

        defaultSource   : {
            value : 'global'
        },

        entryTypes       : { // display these entry types
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

        templates : {
            value : {
                verbose : null,
                basic   : null
            }
        },

        defaultTemplate : {
            value : 'verbose'
        },

        entryWriters : {
            value: {
                entry : '_entryFromTemplate'
            }
        },

        defaultWriter : {
            value : 'entry'
        },

        printTimeout : {
            value : 100,
            validator : Y.Lang.isNumber
        },

        consoleLimit : {
            value : 500
        },

        footerEnabled : {
            value : true
        },

        // convenience attrib for managing defaultTemplate
        verbose : {
            value: true,
            set : function (val) {
                this.set('defaultTemplate',
                    (val ? Y.log.Reader.VERBOSE : Y.log.Reader.BASIC));

                return !!val;
            }
        },

        newestOnTop : {
            value : true
        },

        collapsed : {
            value : false
        },

        startTime : {
            value : new Date()
        },

        lastTime : {
            value : new Date()
        }

    }

});

Y.extend(Y.log.Reader,Y.Widget,{
    _head      : null,
    _title     : null,
    _console   : null,
    _foot      : null,
    _catChecks : null,
    _srcChecks : null,

    _timeout   : null,

    buffer     : null,

    initializer : function (cfg) {
        this.buffer    = [];

        // HACK: AttributeProvider should clone object values but doesn't yet
        this._initObjectAttributes();

        this._initTemplates();

        Y.on('yui:log',Y.bind(this._handleLogEntry,this));
        //this.unplug('mouse');
    },

    // HACK: AttributeProvider should clone object attribute values
    _initObjectAttributes : function () {
        var attrs = ['entryTypes','templates','entryWriters'],
            i = attrs.length - 1;

        for (;i>=0;--i) {
            this.set(attrs[i],Y.clone(this.get(attrs[i])),true);
        }
    },

    _initTemplates : function () {
        var C = Y.log.Reader.CLASSES;

        // For verbose log entries
        this.set('templates.verbose',
            '<pre class="'+C.ENTRY+' '+C.VERBOSE+'">'+
                '<div class="'+C.ENTRY_META+'">'+
                    '<p>'+
                        '<span class="'+C.ENTRY_CAT+'">{label}</span>'+
                        '<span class="'+C.ENTRY_TIME+'">'+
                            ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                        '</span>'+
                    '</p>'+
                    '<p class="'+C.ENTRY_SRC+'">{sourceAndDetail}</p>'+
                '</div>'+
                '<p>{message}</p>'+
            '</pre>');

        // For basic log entries
        this.set('templates.basic',
            '<pre class="'+C.ENTRY+'">'+
                '<p>'+
                    '<span class="'+C.ENTRY_META+'">'+
                        '<span class="'+C.ENTRY_CAT+'">{label}</span>'+
                        '<span class="'+C.ENTRY_TIME+'">'+
                            ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                        '</span>'+
                        '<span class="'+C.ENTRY_SRC+'">'+
                            ' {sourceAndDetail}'+
                        '</span>:'+
                    '</span>'+
                    ' {message}'+
                '</p>'+
            '</pre>');
    },

    renderer : function () {
        Y.log.Reader.superclass.renderer.apply(this,arguments);

        this.renderUI();
        this.syncUI();
        this.bindUI();
    },

    renderUI : function () {
        if (!this.get('rendered')) {
            this.get('contentBox').set('innerHTML','');

            this.get('contentBox').addClass(Y.log.Reader.CLASSES.CONTAINER);

            this._renderHead();
            this._renderConsole();
            this._renderFoot();
        }
    },

    _renderHead : function () {
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

        this.get('contentBox').insertBefore(this._head,this.get('contentBox').get('firstChild')||null);
    },

    _renderConsole : function () {
        this._console = this.get('contentBox').insertBefore(
            Y.Node.create('<div class="'+Y.log.Reader.CLASSES.CONSOLE+'"></div>'),
            this._foot || null);
    },

    _renderFoot : function () {
        var C = Y.log.Reader.CLASSES,
            S = Y.log.Reader.STRINGS,
            entryTypes,t;

        this._foot = Y.Node.create(
            '<div class="'+C.FT+'">'+
                '<div class="'+C.CONTROLS+'">'+
                    '<label class="'+C.LABEL+'">'+
                        '<input type="checkbox" class="'+
                            C.CHECKBOX+' '+C.ACTIVE+'" value="1"> '+
                            S.ACTIVE+
                    '</label>'+
                    '<input type="button" class="'+C.BUTTON+' '+C.CLEAR+'"'+
                        ' value="'+S.CLEAR+'">'+
                '</div>');

        this._catChecks = this._foot.appendChild(Y.Node.create(
            '<div class="'+C.CONTROLS + ' ' + C.CAT_CHECKS + '"></div>'));
            
        this._srcChecks = this._foot.appendChild(Y.Node.create(
            '<div class="'+C.CONTROLS + ' ' + C.SRC_CHECKS + '"></div>'));

        // Add the category entryType checks
        entryTypes = this.get('entryTypes.category');
        for (t in entryTypes) {
            if (entryTypes.hasOwnProperty(t)) {
                this._catChecks.appendChild(
                    this._createEntryType(C.CATEGORY,t));
            }
        }

        // Add the source entryType checks
        entryTypes = this.get('entryTypes.source');
        for (t in entryTypes) {
            if (entryTypes.hasOwnProperty(t)) {
                this._srcChecks.appendChild(
                    this._createEntryType(C.SOURCE,t));
            }
        }

        this.get('contentBox').appendChild(this._foot);
    },

    syncUI : function () {
        var C = Y.log.Reader.CLASSES,
            entryTypes;

        // Set active check
        this._setActive(this.get('active'));

        // Set the collapsed class state
        this._setCollapsed(this.get('collapsed'));

        // Add/remove the hidden foot class
        this._setFooterEnabled(this.get('footerEnabled'));

        // Category entryType checks
        entryTypes = this.get('entryTypes.category');
        this._foot.queryAll('input[type=checkbox].'+C.CATEGORY).each(
            function (check) {
                check.set('checked', (check.get('value') in entryTypes) ?
                    entryTypes[check.get('value')] : true);
            });
            
        // Source entryType checks
        entryTypes = this.get('entryTypes.source');
        this._foot.queryAll('input[type=checkbox].'+C.SOURCE).each(
            function (check) {
                check.set('checked', (check.get('value') in entryTypes) ?
                    entryTypes[check.get('value')] : true);
            });
    },

    bindUI : function () {
        // UI control click events
        // (collapse, expand, active, clear, categories, sources)
        // move to queryAll(..).on('click',..)
        var controls = this.get('contentBox').queryAll('.'+Y.log.Reader.CLASSES.CONTROLS),
            i = controls.size() - 1;
            
        for (;i>=0;--i) {
            controls.item(i).on('click',Y.bind(this._handleControlClick,this));
        }
        
        // Attribute changes
        this.after('titleChange',         Y.bind(this._setTitle,this));
        this.after('activeChange',        Y.bind(this._setActive,this));
        this.after('collapsedChange',     Y.bind(this._setCollapsed,this));
        this.after('consoleLimitChange',  Y.bind(this._setConsoleLimit,this));
        this.after('footerEnabledChange', Y.bind(this._setFooterEnabled,this));
        // HACK: will point to this._setEntryType or something like that
        this.after('entryTypesChange',    Y.bind(this._handleEntryTypesChange,this));
    },

    _handleControlClick : function (e) {
        var C = Y.log.Reader.CLASSES,
            t = e.target;

        if (t.hasClass(C.COLLAPSE)) {
            this.set('collapsed', true);
        } else if (t.hasClass(C.EXPAND)) {
            this.set('collapsed', false);
        } else if (t.hasClass(C.ACTIVE)) {
            this.set('active', t.get('checked'));
        } else if (t.hasClass(C.CLEAR)) {
            this.clearConsole();
        } else if (t.hasClass(C.FILTER)) {
            this.set('entryTypes.' +
                (t.hasClass(C.CATEGORY) ? 'category.' : 'source.') +
                t.get('value'),
                t.get('checked'));
        }
    },

    _setTitle : function (v) {
        v = typeof v == 'object' ? v.newVal : v;

        this._title.set('innerHTML',v);
    },

    _setActive : function (b) {
        b = typeof b == 'object' ? b.newVal : b;

        // TODO: this should be this._head.queryAll(..).set('checked',!!b)
        var checks = this._foot.queryAll(
                        'input[type=checkbox].'+Y.log.Reader.CLASSES.ACTIVE),
            i = checks.size() - 1;

        for (;i>=0;--i) {
            checks.item(i).set('checked',!!b);
        }

        if (b) {
            this._schedulePrint();
        } else if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    },

    _setCollapsed : function (b) {
        b = typeof b == 'object' ? b.newVal : b;

        this.get('contentBox')[b?'addClass':'removeClass'](Y.log.Reader.CLASSES.COLLAPSE);
    },

    _setConsoleLimit : function (v) {
        v = typeof v === 'object' ? v.newVal : v;
        this._trimOldEntries(v);
    },

    clearConsole : function () {
        // TODO: clear event listeners from console contents
        this._console.set('innerHTML','');

        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }

        this.buffer = [];
    },

    reset : function () {
        this.clearConsole();
        this.set('startTime',new Date());
        this.set('enabled',true);
        this.set('active',true);

        this.fire('reset');
    },

    _handleLogEntry : function (msg,cat,src) {
        if (this.get('enabled')) {
            var m     = this.normalizeMessage(msg,cat,src),
                known = this.get('entryTypes');

            if (m) {
                // New category?
                if (m.category && !(m.category in known.category)) {
                    this.createCategory(m.category,true);
                }

                // New source?
                if (m.source && !(m.source in known.source)) {
                    this.createSource(m.source,true);
                }

                // buffer the output
                this.buffer.push(m);
                this._schedulePrint();
            }
        }
    },

    normalizeMessage : function (msg,cat,src) {
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
        m.label           = m.category;
        m.localTime       = m.time.toLocaleTimeString ? 
                            m.time.toLocaleTimeString() : (m.time + '');
        m.elapsedTime     = m.time - this.get('lastTime');
        m.totalTime       = m.time - this.get('startTime');

        this.set('lastTime',m.time);

        return m;
    },

    _schedulePrint : function () {
        if (this.get('active') && !this._timeout) {
            this._timeout = setTimeout(
                Y.bind(this.printBuffer,this),
                this.get('printTimeout'));
        }
    },

    printBuffer: function () {
        // Called from timeout, so calls to Y.log will not be caught by the
        // recursion protection in event.  Turn off logging while printing.
        var debug = Y.debug;
        Y.debug = false;

        if (this.get('active') && this.get('rendered')) {
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

        Y.debug = debug;
    },

    printLogEntry : function (m) {
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
    },

    _entryFromTemplate : function (m) {
        m = this._htmlEscapeMessage(m);

        var templates = this.get('templates'),
            t = templates[m.category] || templates[this.get('defaultTemplate')],
            n = Y.Node.create(Y.Lang.substitute(t,m));

        n.addClass(this._filterClass(m.category));
        n.addClass(this._filterClass(m.source));

        return n;
    },

    _htmlEscapeMessage : function (m) {
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

        return m;
    },

    _trimOldEntries : function (max) {
        if (this._console) {
            var entries = this._console.get('childNodes'),
                i = entries.size() - ((max|0)||this.get('consoleLimit'));

            if (i > 0) {
                if (this.get('newestOnTop')) {
                    for (var l = entries.size(); i<l; i++) {
                        this._console.removeChild(entries.item(i));
                    }
                } else {
                    for (;i>=0;--i) {
                        this._console.removeChild(entries.item(i));
                    }
                }
            }
        }
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
        // TODO: should be this._foot.queryAll(..).set('checked',checked)
        var checks = this._foot.queryAll('input[type=checkbox].'+
                        this._filterClass(name)),
            i = checks.size() - 1;

        for (;i>=0;--i) {
            checks.item(i).set('checked',checked);
        }

        this._filterEntries(name, !checked);
    },

    _filterEntries : function (name,on) {
        // add or remove the filter class from the root node
        this.get('contentBox')[on?'addClass':'removeClass'](this._filterClass(name,true));
    },

    _setFooterEnabled : function (show) {
        this.get('contentBox')[show?'removeClass':'addClass'](Y.log.Reader.CLASSES.HIDE_FT);
    },

    createCategory : function (name, show) {
        this.set('entryTypes.category.'+name, !!show);
    },
    createSource : function (name, show) {
        this.set('entryTypes.source.'+name, !!show);
    },

    _createEntryType : function (type,name) {
        var C     = Y.log.Reader.CLASSES,
            label = Y.Node.create(
                '<label class="'+C.LABEL+'">'+
                    '<input type="checkbox" value="'+name+'" class="'+
                        C.FILTER+' '+type+' '+this._filterClass(name)+'"> '+
                        name+
                '</label>');

        Y.StyleSheet('logreader').setCSS('.'+this._filterClass(name,true)+' .'+Y.log.Reader.CLASSES.CONSOLE+' .'+this._filterClass(name),
            {display: 'none'});

        return label;
    },

    _filterClass : function (name,hide) {
        return Y.log.Reader.CLASSES[(hide ? 'HIDE_BASE' : 'ENTRY_TYPE_BASE')]+name;
    },

    _handleEntryTypesChange : function (e) {
        // We have to determine all terminal paths that have changed in case
        // a branch node in the obj structure was changed.

        // Build a list of paths to compare against the previous value
        var C = Y.log.Reader.CLASSES,
            buildPaths = function (o) {
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
                        this._createEntryType(C.CATEGORY,name));
                } else {
                    this._srcChecks.appendChild(
                        this._createEntryType(C.SOURCE,name));
                }

                this._setEntryType(name,val(e.newVal,aPaths[i]));
            }
        }
    }

});


}, '@VERSION@' ,{requires:['substitute','stylesheet','widget']});
