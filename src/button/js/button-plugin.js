var ATTRS = Y.ButtonBase.ATTRS;
/**
    var node = Y.one('#my-button').plug({
        label: 'my button'
    });

    node.button.disable();
    node.button.set('label');
*/
function ButtonPlugin(config) {
    ButtonPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonPlugin, Y.ButtonBase, {
    _beforeNodeGet: function (name) {
        var fn = (ATTRS[name] && ATTRS[name].getter);
        if (fn) {
            if  (!fn.call) { // string
                fn = this[fn];
            }

            return new Y.Do.Halt('returning ' + name + ' from button-plugin',
                    fn.call(this));
        }
    },  

    _beforeNodeSet: function (name, val) {
        var fn = (ATTRS[name] && ATTRS[name].setter);
        if (fn) {
            if  (!fn.call) { // string
                fn = this[fn];
            }

            fn.call(this, val);
            return new Y.Do.Halt('setting ' + name + ' from button-plugin',
                    this.getNode());
        }
    },

    _initNode: function(config) {
        var node = config.host;
        this._host = node;
        Y.Do.before(this._beforeNodeGet, node, 'get', this);
        Y.Do.before(this._beforeNodeSet, node, 'set', this);
    },

    enable: function() {
        this.set('disabled', false);
    },

    disable: function() {
        this.set('disabled', true);
    }
}, {
    ATTRS: Y.merge(Y.ButtonBase.ATTRS),
    NAME: 'buttonPlugin',
    NS: 'button'
});

Y.Plugin.Button = ButtonPlugin;
