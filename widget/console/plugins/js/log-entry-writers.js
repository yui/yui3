var getCN = Y.ClassNameManager.getClassName,
    TYPE  = 'type',
    VERBOSE = 'verbose',

    C_ENTRY_TYPE  = getCN(LOGREADER,ENTRY,TYPE),

    isNumber = Y.Lang.isNumber,
    
    abs = Math.abs;

function CollapsableConsole() {
    CollapsableConsole.superclass.apply(this,arguments);
}

// collapsable, filterable, templatable
Y.mix(CollapsableConsole,{
    NAME : 'collapsableconsole',

    NS : 'collapsableconsole',

    STRINGS : {
        COLLAPSE : "Collapse",
        EXPAND   : "Expand"
    },

    ATTRS : {
        /**
         * A map of HTML markup templates for the _entryFromTemplate
         * entryWriter to use to render log messages into the LogReader console.
         *
         * <code>myReader.set('templates.verbose',htmlTemplate);</code>
         * to alter how messages are rendered if myReader is configured to use
         * verbose output.  Also available by default is 'templates.basic'.
         *
         * To add a new template,
         * <pre>myReader.set('templates.my_template',htmlTemplate);
         * myReader.set('defaultTemplate','my_template');</pre>
         *
         * @attribute templates
         * @type Object
         */
        templates : {
            value : {
                // Populated during instance initialization
                verbose : null,
                basic   : null
            }
        },

        /**
         * The default template to use to render log messages.  Available
         * templates are held in the templates attribute.  Set the value to
         * the key of the templates config object representing the markup
         * template you wish to use by default.
         *
         * Out of the box, values VERBOSE and 'basic' are supported.
         *
         * @attribute defaultTemplate
         * @type String
         * @default "verbose"
         */
        defaultTemplate : {
            value : VERBOSE
        },

        entryWriters : {
            value: {
                entry : '_entryFromTemplate'
            }
        },

        defaultWriter : {
            value : ENTRY
        },

        // convenience attrib for managing defaultTemplate
        verbose : {
            value: true,
            set : function (val) {
                this.set('defaultTemplate',
                    (val ? Y.log.Reader.VERBOSE : Y.log.Reader.BASIC));

                return !!val;
            }
        }

    }
});

Y.extend(CollapsableConsole, {
    _values : null,

    _tickSize : null,

    initializer : function () {
        var lr = this._owner;

        this._initTemplates();
    },

    _initTemplates : function () {
        // For verbose log entries
        this.set('templates.verbose', Y.LogReader.ENTRY_TEMPLATE);

        // For basic log entries
        this.set('templates.basic',
            '<pre class="'+C_ENTRY+'">'+
                '<p>'+
                    '<span class="'+C_ENTRY_META+'">'+
                        '<span class="'+C_ENTRY_CAT+'">'+
                            '{label}</span>'+
                        '<span class="'+C_ENTRY_TIME+'">'+
                            ' {totalTime}ms (+{elapsedTime}) {localTime}:'+
                        '</span>'+
                        '<span class="'+C_ENTRY_SRC+'">'+
                            ' {sourceAndDetail}'+
                        '</span>:'+
                    '</span>'+
                    ' {message}'+
                '</p>'+
            '</pre>');
    },

    printLogEntry : function (m) {
        var writers = this.get('entryWriters'),
            wr = writers[m.category] || writers[this.get('defaultWriter')],
            output;

        output = typeof wr === 'function' ?  wr.call(this,m) : this[wr](m);
        ....
    },

    _entryFromTemplate : function (m) {
        m = this._htmlEscapeMessage(m);

        var templates = this.get('templates'),
            t = templates[m.category] || templates[this.get('defaultTemplate')],
            n = Y.Node.create(Y.Lang.substitute(t,m));

        n.addClass(this.getClassName(C_ENTRY_TYPE,m.category));
        n.addClass(this.getClassname(C_ENTRY_TYPE,m.source));

        return n;
    },

    bindUI : function () {
        var head = this._owner._head,
            controls;

        // get the buttons' container then
        controls.on('click', this._handleClick);

        this.after('collapsedChange', this._afterCollapsedChange);
    },

    syncUI : function () {
        this.set(COLLAPSED,this.get(COLLAPSED));
    },

    _handleClick : function (e) {
        var t = e.target;

        if (t.hasClass(C_COLLAPSE)) {
            this.set(COLLAPSED, true);
        } else if (t.hasClass(C_EXPAND)) {
            this.set(COLLAPSED, false);
        }
    },

    _afterCollapsedChange : function (e) {
        this._owner._addOrRemoveClass(C_COLLAPSE,e.newVal);
    }

});

Y.Plugin.CollapsableConsole = CollapsableConsole;
