(function() {
    var Y = YAHOO.util,
        C = YAHOO.lang.CONST;

    function Button(attributes) {
        YAHOO.log('constructor called', 'life', 'Button');
        Button.superclass.constructor.call(this, attributes);
    };

    var proto = {
        initializer: function(attributes) {
            YAHOO.log('initializer called', 'life', 'Button');
        },

        renderer: function(attributes) {
            YAHOO.log('renderer called', 'life', 'Button');
            this.initUI();
        },

        destructor: function() {
            YAHOO.log('destructor called', 'life', 'Button');
        },

        initUI: function() {
            this.on('activeChange', this._onActiveChange);
            this.on('textChange', this._onTextChange);

            if (this.get('text') === undefined) { // set from node if not user provided
                this.set('text', this._getDefaultText());
            }

            this.syncUI();
        },

        syncUI: function() {
            this._uiSetActive(this.get('active'));
            this._uiSetText(this.get('text'));
        },

        _getDefaultText: function() {
            return this.getNodeAttr('innerHTML');
        },

        _onActivate: function() {
            this.set('active', true);
        },

        _onDeactivate: function() {
            this.set('active', false);
        },

        _onActiveChange: function(evt) {
            this._uiSetActive(evt.newValue);
        },

        _onTextChange: function(evt) {
            this._uiSetText(evt.newValue);
        },

        _setActivationEvent: function(val) {
            this.unsubscribe(this.get('activationEvent'), this._onActivate);
            this.on(val, this._onActivate);
        },

        _setDeactivationEvent: function(val) {
            this.unsubscribe(this.get('deactivationEvent'), this._onDeactivate);
            this.on(val, this._onDeactivate);
        },

        _uiSetActive: function(val) {
            if (val) {
                Y.Dom.addClass(this._node, C.CLASSES.ACTIVE);
            } else {
                Y.Dom.removeClass(this._node, C.CLASSES.ACTIVE);
            }
        },
        _uiSetText: function(val) {
            this._node.innerHTML = val;
        }
    };

    Button.NAME = 'Button';

    Button.CONFIG = {
        'active': {
            value: false,
        },

        'text': {},

        'activationEvent': {
            set: proto._setActivationEvent,
            value: 'mousedown'
        },

        'deactivationEvent': {
            set: proto._setDeactivationEvent,
            value: 'mouseup'
        }
    };

    YAHOO.lang.extend(Button, YAHOO.widget.Widget, proto);
    YAHOO.widget.Button = Button;
})();
