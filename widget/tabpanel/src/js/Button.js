(function() {
    var Y = YAHOO.util,
        C = YAHOO.lang.CONST;

    function Button(attributes) {
        YAHOO.log('constructor called', 'life', 'Button');
        Button.superclass.constructor.call(this, attributes);
    }

    var proto = {
        initializer: function(attributes) {
            YAHOO.log('initializer called', 'life', 'Button');
        },

        destructor: function() {
            YAHOO.log('destructor called', 'life', 'Button');
        },

        _handleActivation: function() {
            this.set('active', true);
        },

        _handleDeactivation: function() {
            this.set('active', false);
        }
    };

    Button.NAME = "Button";

    Button.CONFIG = {
        'active': {
            set: function(val) {
                if (val) {
                    Y.Dom.addClass(this._node, C.CLASSES.ACTIVE);
                } else {
                    Y.Dom.removeClass(this._node, C.CLASSES.ACTIVE);
                }
            },
            value: false,
        },

        'text': {
            set: function(val) {
                this._node.innerHTML = val;
            }
        },

        'activationEvent': {
            set: function(val) {
                this.unsubscribe(this.get('activationEvent'), this._handleActivation);
                this.on(val, this._handleActivation);
            },
            value: 'mousedown'
        },

        'deactivationEvent': {
            set: function(val) {
                this.unsubscribe(this.get('deactivationEvent'), this._handleDeactivation);
                this.on(val, this._handleDeactivation);
            },
            value: 'mouseup'
        }
    };

    YAHOO.lang.extend(Button, YAHOO.widget.Widget, proto);
    YAHOO.widget.Button = Button;
})();
