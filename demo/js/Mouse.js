(function() {

    var M = function(Y) {

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
                var root = this.owner._node;
                for (var evt in Mouse.Events) {
                    // Won't work until Y.detach supports node facade. Using unsafe getDOMNode for now
                    Y.detach(Mouse.Events[evt], Y.bind(this.handler, this), Y.Node.getDOMNode(root));
                }
            },

            _initUI: function() {
                var root = this.owner._node;
                for (var i = 0, len = Mouse.EVENTS.length; i < len; ++i) {
                    // Won't work until on supports node facade. Using unsafe getDOMNode for now
                    Y.on(Mouse.EVENTS[i], Y.bind(this.handler, this), Y.Node.getDOMNode(root));
                }
            }
        };

        Y.extend(Mouse, P, proto);
        P.add(Mouse);
        P.Mouse = Mouse;
    };

    YUI.add("mouseplugin", M, "3.0.0");
})();
