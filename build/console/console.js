YUI.add('console', function(Y) {

/**
 * Console creates a visualization for Y.log statements.  Log messages
 * include a log level such as "info" or "warn" (also called the category), a
 * source, and various timing info.  Messages are rendered to the Console in
 * asynchronous buffered batches so as to avoid interfering with the operation
 * of your page.
 *
 * @class Console
 * @extends Widget
 */

var getCN = Y.ClassNameManager.getClassName,
    CONSOLE       = 'console',
    ENTRY         = 'entry',
    RESET         = 'reset',
    CHECKED       = 'checked',
    TITLE         = 'title',
    PAUSE         = 'pause',
    PAUSED        = 'paused',
    CLEAR         = 'clear',
    INFO          = 'info',
    WARN          = 'warn',
    ERROR         = 'error',
    INNER_HTML    = 'innerHTML',
    CLICK         = 'click',
    CONTENT_BOX   = 'contentBox',
    DISABLED      = 'disabled',
    START_TIME    = 'startTime',
    LAST_TIME     = 'lastTime',

    DOT = '.',

    C_ENTRY            = getCN(CONSOLE,ENTRY),
    C_PAUSE            = getCN(CONSOLE,PAUSE),
    C_CHECKBOX         = getCN(CONSOLE,'checkbox'),
    C_BUTTON           = getCN(CONSOLE,'button'),
    C_CLEAR            = getCN(CONSOLE,CLEAR),
    C_PAUSE_LABEL      = getCN(CONSOLE,PAUSE,'label'),
    C_ENTRY_META       = getCN(CONSOLE,ENTRY,'meta'),
    C_ENTRY_CAT        = getCN(CONSOLE,ENTRY,'cat'),
    C_ENTRY_SRC        = getCN(CONSOLE,ENTRY,'src'),
    C_ENTRY_TIME       = getCN(CONSOLE,ENTRY,'time'),
    C_ENTRY_CONTENT    = getCN(CONSOLE,ENTRY,'content'),
    C_CONSOLE_HD       = getCN(CONSOLE,'hd'),
    C_CONSOLE_BD       = getCN(CONSOLE,'bd'),
    C_CONSOLE_FT       = getCN(CONSOLE,'ft'),
    C_CONSOLE_CONTROLS = getCN(CONSOLE,'controls'),
    C_CONSOLE_TITLE    = getCN(CONSOLE,TITLE),

    RE_INLINE_SOURCE = /^(\S+)\s/,
    RE_AMP = /&/g,
    RE_LT  = /</g,
    RE_GT  = />/g,

    ESC_AMP = '&#38;',
    ESC_LT  = '&#60;',
    ESC_GT  = '&#62;',
    
    L = Y.Lang,
    isString   = L.isString,
    isNumber   = L.isNumber,
    isObject   = L.isObject,
    merge      = Y.merge,
    substitute = Y.substitute,
    create     = Y.Node.create,
    
    // Here for defaulting in ATTRS.entryTemplate.value
    ENTRY_TEMPLATE =
        '<pre class="{entry_class}">'+
            '<div class="{entry_meta_class}">'+
                '<p>'+
                    '<span class="{entry_cat_class}">'+
                        '{label}</span>'+
                    '<span class="{entry_time_class}">'+
                        ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                    '</span>'+
                '</p>'+
                '<p class="{entry_src_class}">'+
                    '{sourceAndDetail}'+
                '</p>'+
            '</div>'+
            '<p class="{entry_content_class}">{message}</p>'+
        '</pre>';

function Console() {
    Console.superclass.constructor.apply(this,arguments);
}

Y.mix(Console, {

    /**
     * The identity of the widget.
     *
     * @property Console.NAME
     * @type String
     * @static
     */
    NAME : CONSOLE,

    LOG_LEVEL_INFO  : 3,
    LOG_LEVEL_WARN  : 2,
    LOG_LEVEL_ERROR : 1,

    ENTRY_CLASSES   : {
        entry_class         : C_ENTRY,
        entry_meta_class    : C_ENTRY_META,
        entry_cat_class     : C_ENTRY_CAT,
        entry_src_class     : C_ENTRY_SRC,
        entry_time_class    : C_ENTRY_TIME,
        entry_content_class : C_ENTRY_CONTENT
    },

    CHROME_CLASSES  : {
        console_hd_class       : C_CONSOLE_HD,
        console_bd_class       : C_CONSOLE_BD,
        console_ft_class       : C_CONSOLE_FT,
        console_controls_class : C_CONSOLE_CONTROLS,
        console_checkbox_class : C_CHECKBOX,
        console_pause_class    : C_PAUSE,
        console_pause_label_class : C_PAUSE_LABEL,
        console_button_class   : C_BUTTON,
        console_clear_class    : C_CLEAR,
        console_title_class    : C_CONSOLE_TITLE
    },

    HEAD_TEMPLATE    :
        '<div class="{console_hd_class}">'+
            '<h4 class="{console_title_class}">{str_title}</h4>'+
        '</div>',

    CONSOLE_TEMPLATE : '<div class="{console_bd_class}"></div>',

    FOOT_TEMPLATE :
        '<div class="{console_ft_class}">'+
            '<div class="{console_controls_class}">'+
                '<input type="checkbox" class="{console_checkbox_class} '+
                        '{console_pause_class}" value="1"> '+
                '<label class="{console_pause_label_class}">'+
                    '{str_pause}</label>' +
                '<input type="button" class="'+
                    '{console_button_class} {console_clear_class}" '+
                    'value="{str_clear}">'+
            '</div>'+
        '</div>',

    ATTRS : {

        /**
         * Strings used in the Console UI.  Default locale en-us.
         *
         * @attribute strings
         * @type Object
         */
        strings : {
            value : {
                title : "Log Console",
                pause : "Pause",
                clear : "Clear"
            }
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
         * @default (see Console.ENTRY_TEMPLATE)
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

        scrollIntoView : {
            value : true
        },

        startTime : {
            value : new Date()
        },

        lastTime : {
            value : new Date(),
            readOnly: true
        }

    }

});

Y.extend(Console,Y.Widget,{
    _title     : null,
    _console   : null,
    _foot      : null,

    _timeout   : null,

    buffer     : null,

    // API methods
    log : function () {
        return Y.log.apply(Y,arguments);
    },

    clearConsole : function () {
        // TODO: clear event listeners from console contents
        this._console.set(INNER_HTML,'');

        this._clearTimeout();

        this.buffer = [];

        return this;
    },

    reset : function () {
        this.fire(RESET);
        
        return this;
    },

    printBuffer: function () {
        // Called from timeout, so calls to Y.log will not be caught by the
        // recursion protection in event.  Turn off logging while printing.
        var debug = Y.config.debug;
        Y.config.debug = false;

        if (!this.get(PAUSED) && this.get('rendered')) {
            this._clearTimeout();

            var messages = this.buffer,
                i,len;

            this.buffer = [];

            // TODO: use doc frag
            for (i = 0, len = messages.length; i < len; ++i) {
                this.printLogEntry(messages[i]);
            }

            this._trimOldEntries();
        }

        Y.config.debug = debug;

        return this;
    },

    printLogEntry : function (m) {
        m = merge(
                this._htmlEscapeMessage(m),
                Console.ENTRY_CLASSES,
                {
                    cat_class : this.getClassName(ENTRY,m.category),
                    src_class : this.getClassName(ENTRY,m.source)
                });

        var n = create(substitute(this.get('entryTemplate'),m));

        this._addToConsole(n);

        return this;
    },

    
    // Widget core methods
    initializer : function (cfg) {
        this.buffer    = [];

        Y.on('yui:log',Y.bind(this._onYUILog,this));

        this.publish(ENTRY, { defaultFn: this._defEntryFn });
        this.publish(RESET, { defaultFn: this._defResetFn });
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
        this.get(CONTENT_BOX).query('input[type=checkbox].'+C_PAUSE).
            on(CLICK,this._onPauseClick,this);

        this.get(CONTENT_BOX).query('input[type=button].'+C_CLEAR).
            on(CLICK,this._onClearClick,this);
        
        // Attribute changes
        this.after('stringsChange',       this._afterStringsChange);
        this.after('pausedChange',        this._afterPausedChange);
        this.after('consoleLimitChange',  this._afterConsoleLimitChange);
    },

    
    // Support methods
    // TODO: HTML_PARSER
    _initHead : function () {
        var cb   = this.get(CONTENT_BOX),
            info = merge(Console.CHROME_CLASSES, {
                str_title : this.get('strings.title')
            });

        cb.insertBefore(
            create(substitute(Console.HEAD_TEMPLATE,info)),
            cb.get('firstChild') || null);
    },

    _initConsole : function () {
        this._console = this.get(CONTENT_BOX).insertBefore(
            create(substitute(Console.CONSOLE_TEMPLATE,Console.CHROME_CLASSES)),
            this._foot || null);
    },

    _initFoot : function () {
        var info = merge(Console.CHROME_CLASSES, {
                str_pause : this.get('strings.pause'),
                str_clear : this.get('strings.clear')
            });

        this._foot = create(substitute(Console.FOOT_TEMPLATE,info));

        this.get(CONTENT_BOX).appendChild(this._foot);
    },

    _isInLogLevel : function (msg,cat) {
        var lvl = this.get('logLevel'),
            mlvl = cat === ERROR ? Console.LOG_LEVEL_ERROR :
                    cat === WARN ? Console.LOG_LEVEL_WARN  :
                                   Console.LOG_LEVEL_INFO;

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
        m.elapsedTime     = m.time - this.get(LAST_TIME);
        m.totalTime       = m.time - this.get(START_TIME);

        this._set(LAST_TIME,m.time);

        return m;
    },

    _schedulePrint : function () {
        if (!this.get(PAUSED) && !this._timeout) {
            this._timeout = Y.later(
                                this.get('printTimeout'),
                                this,this.printBuffer);
        }
    },

    _addToConsole : function (node) {
        var toTop = this.get('newestOnTop'), scrollTop;

        this._console.insertBefore(node,toTop ?
            this._console.get('firstChild') : null);

        if (this.get('scrollIntoView')) {
            scrollTop = toTop ? 0 : this._console.get('scrollHeight');

            this._console.set('scrollTop', scrollTop);
        }
    },

    _htmlEscapeMessage : function (m) {
        m = Y.clone(m);
        m.message         = this._encodeHTML(m.message);
        m.label           = this._encodeHTML(m.label);
        m.source          = this._encodeHTML(m.source);
        m.sourceAndDetail = this._encodeHTML(m.sourceAndDetail);
        m.category        = this._encodeHTML(m.category);

        return m;
    },

    _trimOldEntries : function () {
        if (this._console) {
            var entries = this._console.queryAll(DOT+C_ENTRY),
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

    _encodeHTML : function (s) {
        return isString(s) ?
            s.replace(RE_AMP,ESC_AMP).
              replace(RE_LT, ESC_LT).
              replace(RE_GT, ESC_GT) :
            s;
    },

    _clearTimeout : function () {
        if (this._timeout) {
            this._timeout.cancel();
            this._timeout = null;
        }
    },

    // DOM event handlers
    _onPauseClick : function (e) {
        var paused = e.target.get(CHECKED);

        this.set(PAUSED,paused,{ src: Y.Widget.UI_SRC });
    },

    _onClearClick : function (e) {
        this.clearConsole();
    },


    // Attribute setters and validators
    _setLogLevel : function (v) {
        if (isString(v)) {
            v = v.toLowerCase();
            v = v === ERROR ?
                        Console.LOG_LEVEL_ERROR :
                        v === WARN ?
                            Console.LOG_LEVEL_WARN :
                            Console.LOG_LEVEL_INFO;
        } else if (!isNumber(v)) {
            v = Console.LOG_LEVEL_INFO;
        }

        return v;
    },

    _validateLogLevel : function (v) {
        return v === Console.LOG_LEVEL_INFO ||
               v === Console.LOG_LEVEL_WARN ||
               v === Console.LOG_LEVEL_ERROR;
    },


    // Attribute event handlers
    _afterStringsChange : function (e) {
        var prop   = e.subAttrName ? e.subAttrName.split(DOT)[1] : null,
            cb     = this.get(CONTENT_BOX),
            before = e.prevVal,
            after  = e.newVal,
            el;

        if ((!prop || prop === TITLE) && before.title !== after.title) {
            el = cb.query(DOT+C_CONSOLE_TITLE);
            if (el) {
                el.set(INNER_HTML,after.title);
            }
        }

        if ((!prop || prop === PAUSE) && before.pause !== after.pause) {
            el = cb.query(DOT+C_PAUSE_LABEL);
            if (el) {
                el.set(INNER_HTML,after.pause);
            }
        }

        if ((!prop || prop === CLEAR) && before.clear !== after.clear) {
            el = cb.query(DOT+C_CLEAR);
            if (el) {
                el.set('value',after.clear);
            }
        }
    },

    _afterPausedChange : function (e) {
        var paused = e.newVal;

        if (e.src !== Y.Widget.SRC_UI) {
            var node = this._foot.queryAll('input[type=checkbox].'+C_PAUSE);
            if (node) {
                node.set(CHECKED,paused);
            }
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

        if (!this.get(DISABLED) && this._isInLogLevel(msg,cat,src)) {

            // TODO: needed?
            var debug = Y.config.debug;
            Y.config.debug = false;

            this.fire(ENTRY, {
                message : this._normalizeMessage.apply(this,arguments)
            });

            Y.config.debug = debug;
        }
    },

    _defResetFn : function () {
        this.clearConsole();
        this.set(START_TIME,new Date());
        this.set(DISABLED,false);
        this.set(PAUSED,false);
    },

    _defEntryFn : function (e) {
        if (e.message) {
            this.buffer.push(e.message);
            this._schedulePrint();
        }
    }

});

Y.Console = Console;


}, '@VERSION@' ,{requires:['substitute','widget']});
