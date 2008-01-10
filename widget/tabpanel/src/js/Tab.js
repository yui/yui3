(function() {
var Y = YAHOO.util;

var Tab = function(widget) {
    this.constructor.superclass.constructor.apply(this, arguments);
};

var proto  = {
    initializer: function() {
        var button = this.get('button');
        var panel = this.get('panel');

        button.on('activeChange', this._onActiveChange, this, true); // TODO: convert to Event delegation
        button.set('deactivationEvent', null); // cancel Button default
        panel.set('visible', this.get('active'));

    },

    renderer: function() {
        this.get('button').render();
        this.get('panel').render();
    },

    _onActiveChange: function(evt) {
        this.set('active', evt.newValue);
    },

    _setButton: function(val) {
        if (YAHOO.lang.isString(val)) {
            return new YAHOO.widget.Button({ id: val });
        }
    },

    _setPanel: function(val) {
        if (YAHOO.lang.isString(val)) {
            return new YAHOO.widget.Panel({ id: val });
        }
    },

    _setLabel: function(val) {
        this.get('button').set('text', val);
    },

    _setContent: function(val) {
        this.get('panel').set('content', val);
    },

    _setActive: function(val) {
        var button = this.get('button');
        var panel = this.get('panel');
        
        if (button.get('active') !== val) {
            button.set('active', val);
        }

        if (panel.get('visible') !== val) {
            panel.set('visible', val);
        }
    },

    _setActivationEvent: function(val) {
        button.set('activationEvent', this.get('activationEvent'));
    },

};

YAHOO.lang.extend(Tab, YAHOO.widget.Widget, proto);

Tab.NAME = "Tab";

// Discuss: need naming convention for View related methods?
Tab.CONFIG = {
    button: {
        set: proto._setButton
    },

    panel: {
        set: proto._setPanel
    },

    label: {
        set: proto._setLabel,
        validator: YAHOO.lang.isString,
    },

    content: {
        set: proto._setContent,
        validator: YAHOO.lang.isString,
    },

    active: {
        set: proto._setActive
    },

    activationEvent: function() {
        set: proto._setActivationEvent
        value: 'click'
    },
    foo: null
};

YAHOO.widget.Tab = Tab;
})();
