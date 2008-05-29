YUI.add("mouseplugin", function(Y) {

    var P = Y.Plugin;

    function Mouse(config) {
        Mouse.superclass.constructor.apply(this, arguments);
    }

    Mouse.EVENTS = [
        'click',
        'mouseup',
        'mousedown',
        'mouseover',
        'mouseout',
        'mousemove',
        'dblclick'
    ];

    Mouse.NAME = "mouse";
    Mouse.NS = "mouse";

    // Mouse has No Attributes
    // Mouse.ATTRS = null;

    var proto = {

        initializer: function(config) {
            if (!this.owner.rendered) {
                this.listen(this.owner, "render", Y.bind(this._initUI, this));
            } else {
                this._initUI();
            }
        },

        handler: function(evt) {
            this.owner.fire(evt.type, evt);
        },

        destructor: function() {
            // If the plugin is being destroyed before render is called
            if (this._handles) {
                for (var i = 0, len = this._handles.length; i < len; ++i) {
                    this._handles[i].detach();
                }
            }
        },

        _initUI: function() {
            var root = this.owner._root;
            this._handles = [];
            for (var i = 0, len = Mouse.EVENTS.length; i < len; ++i) {
                this._handles.push(Y.on(Mouse.EVENTS[i], Y.bind(this.handler, this), root));
            }
        }
    };

    Y.extend(Mouse, P, proto);
    P.Mouse = Mouse;

}, "3.0.0");

