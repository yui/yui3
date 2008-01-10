(function() {
    var Y = YAHOO.util,
        C = YAHOO.lang.CONST;

    function Panel(attributes) {
        YAHOO.log('constructor called', 'life', 'Panel');
        Panel.superclass.constructor.call(this, attributes);
    }

    var proto = {
        initializer: function(attributes) {
            YAHOO.log('initializer called', 'life', 'Panel');
        },

        renderer: function() {
            this.initUI();
            this.syncUI();
        },

        initUI: function() {
            this.on('contentChange', this._onContentChange);

            if (this.get('content') === undefined) { // set from node if not user provided
                this.set('content', this._getDefaultContent());
            }
        },

        syncUI: function() {
            this._uiSetContent(this.get('content'));
        },

        destructor: function() {
            YAHOO.log('destructor called', 'life', 'Panel');
        },

        _getDefaultContent: function() {
            return this.getNodeAttr('innerHTML');
        },

        _onContentChange: function(evt) {
            this._uiSetContent(evt.newValue);
        },

        _uiSetContent: function(val) {
            this.setNodeAttr('innerHTML', val);
        }
    };

    Panel.NAME = "Panel";

    Panel.CONFIG = {
        'content': {}
    };

    YAHOO.lang.extend(Panel, YAHOO.widget.Widget, proto);
    YAHOO.widget.Panel = Panel;
})();
