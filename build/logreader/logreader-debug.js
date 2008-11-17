YUI.add('logreader', function(Y) {

/**
 * LogReader creates a visualization for Y.log statements.  Log messages
 * include a category such as "info" or "warn", a source, and various timing
 * info.  Messages are rendered to the Reader in asynchronous buffered batches
 * so as to avoid interfering with the operation of your page.
 *
 * @class LogReader
 * @extends Widget
 */

var getCN = Y.ClassNameManager.getClassName,
    LOGREADER     = 'logreader',
    ENTRY         = 'entry',
    RESET         = 'reset',
    CHECKED       = 'checked',
    CLEAR         = 'clear',
    PAUSE         = 'pause',
    PAUSED        = 'paused',
    INFO          = 'info',
    WARN          = 'warn',
    ERROR         = 'error',
    INNER_HTML    = 'innerHTML',
    UI            = 'ui',
    CLICK         = 'click',
    CONTENT_BOX   = 'contentBox',

    C_ENTRY       = getCN(LOGREADER,ENTRY),
    C_PAUSED      = getCN(LOGREADER,PAUSE),
    C_CHECKBOX    = getCN(LOGREADER,'checkbox'),
    C_CLEAR       = getCN(LOGREADER,CLEAR),
    C_ENTRY_META  = getCN(LOGREADER,ENTRY,'meta'),

    RE_AMP = /&/g,
    RE_LT  = /</g,
    RE_GT  = />/g,

    RE_INLINE_SOURCE = /^(\S+)\s/,

    ESC_AMP = '&#38;',
    ESC_LT  = '&#60;',
    ESC_GT  = '&#62;',
    
    L = Y.Lang,
    isString = L.isString,
    isNumber = L.isNumber,
    isObject = L.isObject,
    
    // Here for defaulting in ATTRS.entryTemplate.value
    ENTRY_TEMPLATE =
        '<pre class="'+C_ENTRY+'">'+
            '<div class="'+C_ENTRY_META+'">'+
                '<p>'+
                    '<span class="'+getCN(LOGREADER,ENTRY,'cat')+'">'+
                        '{label}</span>'+
                    '<span class="'+getCN(LOGREADER,ENTRY,'time')+'">'+
                        ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                    '</span>'+
                '</p>'+
                '<p class="'+getCN(LOGREADER,ENTRY,'src')+'">'+
                    '{sourceAndDetail}'+
                '</p>'+
            '</div>'+
            '<p class="'+getCN(LOGREADER,ENTRY,'content')+'">{message}</p>'+
        '</pre>';

function LogReader() {
    this.constructor.superclass.constructor.apply(this,arguments);
}

Y.mix(LogReader, {

    /**
     * The identity of the widget.
     *
     * @property LogReader.NAME
     * @type String
     * @static
     */
    NAME : LOGREADER,

    LOG_LEVEL_INFO :  3,
    LOG_LEVEL_WARN :  2,
    LOG_LEVEL_ERROR : 1,

    HEAD_TEMPLATE :    '<div class="'+getCN(LOGREADER,'hd')+'"></div>',

    CONSOLE_TEMPLATE : '<div class="'+getCN(LOGREADER,'console')+'"></div>',

    FOOT_TEMPLATE :
        '<div class="'+getCN(LOGREADER,'ft')+'">'+
            '<div class="'+getCN(LOGREADER,'controls')+'">'+
                '<label class="'+getCN(LOGREADER,'label')+'">'+
                    '<input type="checkbox" class="'+
                        C_CHECKBOX+' '+C_PAUSED+'" value="1"> '+
                        PAUSE+
                '</label>' +
                '<input type="button" class="'+getCN(LOGREADER,'button')+' '+C_CLEAR+'"'+
                    ' value="'+CLEAR+'">'+
            '</div>'+
        '</div>',

    ENTRY_TEMPLATE : ENTRY_TEMPLATE,

    ATTRS : {

        /**
         * Strings used in the LogReader UI.  Default locale en-us.
         *
         * @attribute strings
         * @type Object
         */
        strings : {
            value : {
                PAUSE : "Pause",
                CLEAR : "Clear"
            }
        },

        /**
         * Title appearing in the head of the LogReader console.
         *
         * @attribute title
         * @type String
         * @default "Log Console"
         */
        title : {
            value : "Log Console",
            validator : isString
        },

        /**
         * Boolean to pause the outputting of new messages to the console.
         * When paused, messages will accumulate in the buffer.
         *
         * @attribute paused
         * @type boolean
         * @default false
         */
        paused : {
            value : false,
            validator : L.isBoolean
        },

        /**
         * If a category is not specified in the Y.log(..) statement, this
         * category will be used.
         *
         * @attribute defaultCategory
         * @type String
         * @default "info"
         */
        defaultCategory : {
            value : INFO,
            validator : isString
        },

        /**
         * If a source is not specified in the Y.log(..) statement, this
         * source will be used.
         *
         * @attribute defaultSource
         * @type String
         * @default "global"
         */
        defaultSource   : {
            value : 'global',
            validator : isString
        },

        /**
         * The markup template to use to render log entries.  Bracketed
         * placeholders {likeThis} will be replaced with the appropriate data
         * from the entry object.
         *
         * @attribute entryTemplate
         * @type String
         * @deafult (see LogReader.ENTRY_TEMPLATE)
         */
        entryTemplate : {
            value : ENTRY_TEMPLATE,
            validator : isString
        },

        logLevel : {
            value : Y.config.logLevel,
            validator : function (v) {
                return this._validateLogLevel(v);
            },
            set : function (v) {
                return this._setLogLevel(v);
            }
        },

        printTimeout : {
            value : 100,
            validator : isNumber
        },

        consoleLimit : {
            value : 500,
            validator : isNumber
        },

        newestOnTop : {
            value : true
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
    _title     : null,
    _console   : null,
    _foot      : null,

    _timeout   : null,

    buffer     : null,

    // API methods
    clearConsole : function () {
        // TODO: clear event listeners from console contents
        this._console.set(INNER_HTML,'');

        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }

        this.buffer = [];
    },

    reset : function () {
        this.fire(RESET);
    },

    printBuffer: function () {
        // Called from timeout, so calls to Y.log will not be caught by the
        // recursion protection in event.  Turn off logging while printing.
        var debug = Y.debug;
        Y.debug = false;

        if (!this.get(PAUSED) && this.get('rendered')) {
            clearTimeout(this._timeout);
            this._timeout = null;
            var messages = this.buffer,
                i,len;

            this.buffer = [];

            // TODO: use doc frag?
            for (i = 0, len = messages.length; i < len; ++i) {
                this.printLogEntry(messages[i]);

                this._trimOldEntries();
            }
        }

        Y.debug = debug;
    },

    printLogEntry : function (m) {
        m = this._htmlEscapeMessage(m);

        var n = Y.Node.create(Y.Lang.substitute(this.get('entryTemplate'),m));

        n.addClass(this.getClassName(ENTRY,m.category));
        n.addClass(this.getClassName(ENTRY,m.source));

        this._addToConsole(n);
    },

    
    // Widget core methods
    initializer : function (cfg) {
        this.buffer    = [];

        Y.on('yui:log',Y.bind(this._onYUILog,this));

        this.publish(ENTRY, { defaultFn: this._defEntryFn });
        this.publish(RESET, { defaultFn: this._defResetFn });

        this._onPauseClick = Y.bind(this._onPauseClick,this);
        this.clearConsole  = Y.bind(this.clearConsole,this);
    },

    renderUI : function () {
        this._initHead();
        this._initConsole();
        this._initFoot();
    },

    syncUI : function () {
        this.set(PAUSED,this.get(PAUSED));
    },

    bindUI : function () {
        this.get(CONTENT_BOX).query('input[type=checkbox].'+C_PAUSED).
            on(CLICK,this._onPauseClick);

        this.get(CONTENT_BOX).query('input[type=button].'+C_CLEAR).
            on(CLICK,this.clearConsole);
        
        // Attribute changes
        this.after('titleChange',         this._afterTitleChange);
        this.after('pausedChange',        this._afterPausedChange);
        this.after('consoleLimitChange',  this._afterConsoleLimitChange);
    },

    
    // Support methods
    _initHead : function () {
        var n = this.get(CONTENT_BOX),
            head;

        head = Y.Node.create(LogReader.HEAD_TEMPLATE);

        this._title = head.appendChild(Y.Node.create(
            '<h4>'+this.get('title')+'</h4>'));

        n.insertBefore(head, n.get('firstChild') || null);
    },

    _initConsole : function () {
        this._console = this.get(CONTENT_BOX).insertBefore(
            Y.Node.create(LogReader.CONSOLE_TEMPLATE),
            this._foot || null);
    },

    _initFoot : function () {
        var S = this.getStrings(), nodes;

        this._foot = Y.Node.create(LogReader.FOOT_TEMPLATE);
        nodes = this._foot.queryAll('.'+C_PAUSED);
        if (nodes) {
            nodes.set(INNER_HTML,' '+S.PAUSE);
        }
        nodes = this._foot.queryAll('.'+C_CLEAR);
        if (nodes) {
            nodes.set('value',S.CLEAR);
        }

        this.get(CONTENT_BOX).appendChild(this._foot);
    },

    _isInLogLevel : function (msg,cat) {
        var lvl = this.get('logLevel'),
            mlvl = cat === ERROR ? LogReader.LOG_LEVEL_ERROR :
                    cat === WARN ? LogReader.LOG_LEVEL_WARN  :
                                   LogReader.LOG_LEVEL_INFO;

        return lvl >= mlvl;
    },

    _normalizeMessage : function (msg,cat,src) {
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
        m.source          = RE_INLINE_SOURCE.test(m.sourceAndDetail) ?
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
        if (!this.get(PAUSED) && !this._timeout) {
            this._timeout = setTimeout(
                                Y.bind(this.printBuffer,this),
                                this.get('printTimeout'));
        }
    },

    _addToConsole : function (node) {
        var toTop = this.get('newestOnTop');

        this._console.insertBefore(node,toTop ?
            this._console.get('firstChild') : null);

        if (!toTop) {
            this._console.set('scrollTop', this._console.get('scrollHeight'));
        }
    },

    _htmlEscapeMessage : function (m) {
        m = Y.clone(m);
        m.message         = this._escapeHTML(m.message);
        m.label           = this._escapeHTML(m.label);
        m.source          = this._escapeHTML(m.source);
        m.sourceAndDetail = this._escapeHTML(m.sourceAndDetail);
        m.category        = this._escapeHTML(m.category);

        return m;
    },

    _trimOldEntries : function () {
        if (this._console) {
            var entries = this._console.queryAll('.'+C_ENTRY),
                i = entries ? entries.size() - this.get('consoleLimit') : 0;

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

    _escapeHTML : function (s) {
        return isString(s) ?
            s.replace(RE_AMP,ESC_AMP).
              replace(RE_LT, ESC_LT).
              replace(RE_GT, ESC_GT) :
            s;
    },


    // DOM event handlers
    _onPauseClick : function (e) {
        // TODO: label click cause problems?
        var paused = e.target.get(CHECKED);

        this.set(PAUSED,paused,{src:UI});
    },


    // Attribute setters and validators
    _setLogLevel : function (v) {
        if (isString(v)) {
            v = v.toLowerCase();
            v = v === ERROR ?
                        LogReader.LOG_LEVEL_ERROR :
                        v === WARN ?
                            LogReader.LOG_LEVEL_WARN :
                            LogReader.LOG_LEVEL_INFO;
        } else if (!isNumber(v)) {
            v = LogReader.LOG_LEVEL_INFO;
        }

        return v;
    },

    _validateLogLevel : function (v) {
        return v === LogReader.LOG_LEVEL_INFO ||
               v === LogReader.LOG_LEVEL_WARN ||
               v === LogReader.LOG_LEVEL_ERROR;
    },


    // Attribute event handlers
    _afterTitleChange : function (e) {
        this._title.set(INNER_HTML,e.newVal);
    },

    _afterPausedChange : function (e) {
        var paused = e.newVal;

        if (e.src !== UI) {
            this._foot.queryAll('input[type=checkbox].'+C_PAUSED).
                set(CHECKED,paused);
        }

        if (!paused) {
            this._schedulePrint();
        } else if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    },

    _afterConsoleLimitChange : function () {
        this._trimOldEntries();
    },


    // Custom event listeners and default functions
    _onYUILog : function (msg,cat,src) {
        var debug = Y.config.debug;
        Y.config.debug = false;

        if (!this.get('disabled') && this._isInLogLevel(msg,cat,src)) {
            this.fire(ENTRY, {
                message : this._normalizeMessage.apply(this,arguments)
            });
        }

        Y.config.debug = debug;
    },

    _defResetFn : function () {
        this.clearConsole();
        this.set('startTime',new Date());
        this.set('disabled',false);
        this.set(PAUSED,false);
    },

    _defEntryFn : function (e) {
        if (e.message) {
            this.buffer.push(e.message);
            this._schedulePrint();
        }
    }

});

Y.log.Reader = LogReader;


}, '@VERSION@' ,{requires:['substitute','widget']});
