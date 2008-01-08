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

        destructor: function() {
            YAHOO.log('destructor called', 'life', 'Panel');
        }
    };

    Panel.NAME = "Panel";

    Panel.CONFIG = {
        'content': {
            set: function(val) {
                this._node.innerHTML = val;
            }
        }
    };

    YAHOO.lang.extend(Panel, YAHOO.widget.Widget, proto);
    YAHOO.widget.Panel = Panel;
})();
