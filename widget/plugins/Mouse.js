(function() {
    var Y = YAHOO.util;
    Mouse = function(owner) {
        owner.subscribe('render', function() { this.init(owner); }, this, true);
    };

    Mouse.EVENTS = [
        'click',
        'mouseup',
        'mousedown',
        'mouseover',
        'mouseout',
        'mousemove',
        'dblclick'
    ];

    Mouse.prototype = {
        name: 'mouse',
        init: function(owner) {
            this.owner = owner;
            var root = this.owner._node;
            for (var i = 0, len = Mouse.EVENTS.length;  i < len; ++i) {
                Y.Event.on(root, Mouse.EVENTS[i], this.handler, this, true);
            }
        },

        handler: function(evt) {
            this.owner.fireEvent(evt.type, evt);
        },

        destructor: function() {
            for (var evt in Mouse.Events) {
                Y.Event.removeListener(root, Mouse.Events[evt], this.handler, evt, this);
            }
        },

        toString: function() {
            return 'Mouse Plugin';
        }
    };

    YAHOO.plugins = YAHOO.plugins || {};
    YAHOO.plugins.Mouse = Mouse;
})();
