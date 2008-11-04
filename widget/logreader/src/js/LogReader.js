var CLASS_CONTAINER   = 'container',
    CLASS_HD          = 'hd',
    CLASS_CONSOLE     = 'console',
    CLASS_FT          = 'ft',
    CLASS_HIDE_FT     = 'hide-ft',
    CLASS_CONTROLS    = 'controls',
    CLASS_BUTTON      = 'button',
    CLASS_LABEL       = 'label',
    CLASS_CHECKBOX    = 'checkbox',
    CLASS_COLLAPSE    = 'collapse', // for .foo .foo { ... }
    CLASS_EXPAND      = 'expand',
    CLASS_ACTIVE      = 'active',
    CLASS_CLEAR       = 'clear',
    CLASS_CAT_CHECKS  = 'categories',
    CLASS_SRC_CHECKS  = 'sources',
    CLASS_FILTER      = 'filter',
    CLASS_CATEGORY    = 'category',
    CLASS_SOURCE      = 'source',
    CLASS_ENTRY       = 'entry',
    CLASS_VERBOSE     = 'verbose',
    CLASS_ENTRY_META  = 'entry-meta',
    CLASS_ENTRY_CAT   = 'entry-cat',
    CLASS_ENTRY_SRC   = 'entry-src',
    CLASS_ENTRY_TIME  = 'entry-time',
    CLASS_ENTRY_TYPE  = 'entry-type',
    CLASS_HIDE_BASE   = 'hide',
    CLASS_ENTRY_TYPE_BASE = 'entry-type',

    HAS_CLASS         = 'hasClass',
    ADD_CLASS         = 'addClass',
    REMOVE_CLASS      = 'removeClass',
    GET_CLASS_NAME    = 'getClassName';

/**
 * Creates a log output console
 */
function LogReader() {
    this.constructor.superclass.constructor.apply(this,arguments);
}

Y.mix(LogReader, {

    NAME : 'logreader',

    VERBOSE : 'verbose',
    BASIC   : 'basic',

    ATTRS : {

        strings : {
            value : {
                COLLAPSE    : "Collapse",
                EXPAND      : "Expand",
                ACTIVE      : "Active",
                CLEAR       : "Clear"
            }
        },

        title : {
            value : "Log Console"
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

Y.extend(LogReader,Y.Widget,{
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

        // bind to self a few instance methods for ease of use later
        this.printBuffer = Y.bind(this.printBuffer,this);
        this._handleControlClick = Y.bind(this._handleControlClick,this);
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
        // For verbose log entries
        this.set('templates.verbose',
            '<pre class="'+this[GET_CLASS_NAME](CLASS_ENTRY)+
                       ' '+this[GET_CLASS_NAME](CLASS_VERBOSE)+'">'+
                '<div class="'+this[GET_CLASS_NAME](CLASS_ENTRY_META)+'">'+
                    '<p>'+
                        '<span class="'+
                            this[GET_CLASS_NAME](CLASS_ENTRY_CAT)+'">'+
                            '{label}</span>'+
                        '<span class="'+
                            this[GET_CLASS_NAME](CLASS_ENTRY_TIME)+'">'+
                            ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                        '</span>'+
                    '</p>'+
                    '<p class="'+this[GET_CLASS_NAME](CLASS_ENTRY_SRC)+'">'+
                        '{sourceAndDetail}'+
                    '</p>'+
                '</div>'+
                '<p>{message}</p>'+
            '</pre>');

        // For basic log entries
        this.set('templates.basic',
            '<pre class="'+this[GET_CLASS_NAME](CLASS_ENTRY)+'">'+
                '<p>'+
                    '<span class="'+this[GET_CLASS_NAME](CLASS_ENTRY_META)+'">'+
                        '<span class="'+
                            this[GET_CLASS_NAME](CLASS_ENTRY_CAT)+'">'+
                            '{label}</span>'+
                        '<span class="'+
                            this[GET_CLASS_NAME](CLASS_ENTRY_TIME)+'">'+
                            ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                        '</span>'+
                        '<span class="'+
                            this[GET_CLASS_NAME](CLASS_ENTRY_SRC)+'">'+
                            ' {sourceAndDetail}'+
                        '</span>:'+
                    '</span>'+
                    ' {message}'+
                '</p>'+
            '</pre>');
    },

    renderUI : function () {
        if (!this.get('rendered')) {
            this.get('contentBox').set('innerHTML','');

            this.get('contentBox')[ADD_CLASS](this[GET_CLASS_NAME](CLASS_CONTAINER));

            this._renderHead();
            this._renderConsole();
            this._renderFoot();
        }
    },

    _renderHead : function () {
        var S = this.getStrings(),
            n = this.get('contentBox');

        this._head = Y.Node.create(
            '<div class="'+this[GET_CLASS_NAME](CLASS_HD)+'">'+
                '<div class="'+this[GET_CLASS_NAME](CLASS_CONTROLS)+'">'+
                    '<input type="button" class="'+
                        this[GET_CLASS_NAME](CLASS_BUTTON)+' '+
                        this[GET_CLASS_NAME](CLASS_COLLAPSE)+'"'+
                        ' value="'+S.COLLAPSE+'">'+
                    '<input type="button" class="'+
                        this[GET_CLASS_NAME](CLASS_BUTTON)+' '+
                        this[GET_CLASS_NAME](CLASS_EXPAND)+'"' +
                        ' value="'+S.EXPAND+'">'+
                '</div>'+
                '<h4>'+this.get('title')+'</h4>'+
            '</div>');

        this._title = this._head.query('h4');

        n.insertBefore(this._head, n.get('firstChild') || null);
    },

    _renderConsole : function () {
        this._console = this.get('contentBox').insertBefore(
            Y.Node.create(
                '<div class="'+this[GET_CLASS_NAME](CLASS_CONSOLE)+'"></div>'),
            this._foot || null);
    },

    _renderFoot : function () {
        var S = this.getStrings(),
            entryTypes,t;

        this._foot = Y.Node.create(
            '<div class="'+this[GET_CLASS_NAME](CLASS_FT)+'">'+
                '<div class="'+this[GET_CLASS_NAME](CLASS_CONTROLS)+'">'+
                    '<label class="'+this[GET_CLASS_NAME](CLASS_LABEL)+'">'+
                        '<input type="checkbox" class="'+
                            this[GET_CLASS_NAME](CLASS_CHECKBOX)+' '+
                            this[GET_CLASS_NAME](CLASS_ACTIVE)+'" value="1"> '+
                            S.ACTIVE+
                    '</label>'+
                    '<input type="button" class="'+
                        this[GET_CLASS_NAME](CLASS_BUTTON)+' '+
                        this[GET_CLASS_NAME](CLASS_CLEAR)+'"'+
                        ' value="'+S.CLEAR+'">'+
                '</div>');

        this._catChecks = this._foot.appendChild(Y.Node.create(
            '<div class="'+
                this[GET_CLASS_NAME](CLASS_CONTROLS)+' '+
                this[GET_CLASS_NAME](CLASS_CAT_CHECKS)+'"></div>'));
            
        this._srcChecks = this._foot.appendChild(Y.Node.create(
            '<div class="'+
                this[GET_CLASS_NAME](CLASS_CONTROLS)+' '+
                this[GET_CLASS_NAME](CLASS_SRC_CHECKS) + '"></div>'));

        // Add the category entryType checks
        entryTypes = this.get('entryTypes.category');
        for (t in entryTypes) {
            if (entryTypes.hasOwnProperty(t)) {
                this._catChecks.appendChild(
                    this._createEntryType(this[GET_CLASS_NAME](CLASS_CATEGORY),t));
            }
        }

        // Add the source entryType checks
        entryTypes = this.get('entryTypes.source');
        for (t in entryTypes) {
            if (entryTypes.hasOwnProperty(t)) {
                this._srcChecks.appendChild(
                    this._createEntryType(this[GET_CLASS_NAME](CLASS_SOURCE),t));
            }
        }

        this.get('contentBox').appendChild(this._foot);
    },

    syncUI : function () {
        var entryTypes;

        // Set active check
        this._setActive(this.get('active'));

        // Set the collapsed class state
        this._setCollapsed(this.get('collapsed'));

        // Add/remove the hidden foot class
        this._setFooterEnabled(this.get('footerEnabled'));

        // Category entryType checks
        entryTypes = this.get('entryTypes.category');
        this._foot.queryAll('input[type=checkbox].'+
            this[GET_CLASS_NAME](CLASS_CATEGORY)).each(
            function (check) {
                check.set('checked', (check.get('value') in entryTypes) ?
                    entryTypes[check.get('value')] : true);
            });
            
        // Source entryType checks
        entryTypes = this.get('entryTypes.source');
        this._foot.queryAll('input[type=checkbox].'+
            this[GET_CLASS_NAME](CLASS_SOURCE)).each(
            function (check) {
                check.set('checked', (check.get('value') in entryTypes) ?
                    entryTypes[check.get('value')] : true);
            });
    },

    bindUI : function () {
        // UI control click events
        // (collapse, expand, active, clear, categories, sources)
        // move to queryAll(..).on('click',..)
        var controls = this.get('contentBox').
                        queryAll('.'+this[GET_CLASS_NAME](CLASS_CONTROLS)),
            i = controls.size() - 1;
            
        for (;i>=0;--i) {
            controls.item(i).on('click',this._handleControlClick);
        }
        
        // Attribute changes
        this.after('titleChange',         this._setTitle);
        this.after('activeChange',        this._setActive);
        this.after('collapsedChange',     this._setCollapsed);
        this.after('consoleLimitChange',  this._setConsoleLimit);
        this.after('footerEnabledChange', this._setFooterEnabled);
        // HACK: will point to this._setEntryType or something like that
        this.after('entryTypesChange',    this._handleEntryTypesChange);
    },

    _handleControlClick : function (e) {
        var t = e.target;

        if (t[HAS_CLASS](this[GET_CLASS_NAME](CLASS_COLLAPSE))) {
            this.set('collapsed', true);
        } else if (t[HAS_CLASS](this[GET_CLASS_NAME](CLASS_EXPAND))) {
            this.set('collapsed', false);
        } else if (t[HAS_CLASS](this[GET_CLASS_NAME](CLASS_ACTIVE))) {
            this.set('active', t.get('checked'));
        } else if (t[HAS_CLASS](this[GET_CLASS_NAME](CLASS_CLEAR))) {
            this.clearConsole();
        } else if (t[HAS_CLASS](this[GET_CLASS_NAME](CLASS_FILTER))) {
            this.set('entryTypes.' +
                (t[HAS_CLASS](this[GET_CLASS_NAME](CLASS_CATEGORY)) ? 'category.' : 'source.') +
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
                        'input[type=checkbox].'+
                        this[GET_CLASS_NAME](CLASS_ACTIVE)),
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

        this.get('contentBox')[b?ADD_CLASS:REMOVE_CLASS](
            this[GET_CLASS_NAME](CLASS_COLLAPSE));
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
                                this.printBuffer,
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
            wr = writers[m.category] || writers[this.get('defaultWriter')],
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

        n[ADD_CLASS](this[GET_CLASS_NAME](CLASS_ENTRY_TYPE_BASE,m.category));
        n[ADD_CLASS](this[GET_CLASS_NAME](CLASS_ENTRY_TYPE_BASE,m.source));

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
                        this[GET_CLASS_NAME](CLASS_ENTRY_TYPE_BASE,name)),
            i = checks.size() - 1;

        for (;i>=0;--i) {
            checks.item(i).set('checked',checked);
        }

        this._filterEntries(name, !checked);
    },

    _filterEntries : function (name,on) {
        // add or remove the filter class from the root node
        this.get('contentBox')[on?ADD_CLASS:REMOVE_CLASS](
            this[GET_CLASS_NAME](CLASS_HIDE_BASE,name));
    },

    _setFooterEnabled : function (show) {
        this.get('contentBox')[show?REMOVE_CLASS:ADD_CLASS](
            this[GET_CLASS_NAME](CLASS_HIDE_FT));
    },

    createCategory : function (name, show) {
        this.set('entryTypes.category.'+name, !!show);
    },
    createSource : function (name, show) {
        this.set('entryTypes.source.'+name, !!show);
    },

    _createEntryType : function (type,name) {
        var label = Y.Node.create(
                '<label class="'+this[GET_CLASS_NAME](CLASS_LABEL)+'">'+
                    '<input type="checkbox" value="'+name+'" class="'+
                        this[GET_CLASS_NAME](CLASS_FILTER)+' '+type+' '+
                        this[GET_CLASS_NAME](CLASS_ENTRY_TYPE_BASE,name)+'"> '+
                        name+
                '</label>'),
            selector = '.'  + this[GET_CLASS_NAME](CLASS_HIDE_BASE,name) +
                       ' .' + this[GET_CLASS_NAME](CLASS_CONSOLE) +
                       ' .' + this[GET_CLASS_NAME](CLASS_ENTRY_TYPE_BASE,name);

        Y.StyleSheet('logreader').set(selector, {display: 'none'});

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
                        this._createEntryType(
                            this[GET_CLASS_NAME](CLASS_CATEGORY),name));
                } else {
                    this._srcChecks.appendChild(
                        this._createEntryType(
                            this[GET_CLASS_NAME](CLASS_SOURCE),name));
                }

                this._setEntryType(name,val(e.newVal,aPaths[i]));
            }
        }
    }

});

Y.log.Reader = LogReader;
