(function () {

    var Y = YAHOO.util,
        W = YAHOO.widget,
        YUI = YAHOO.lang.CONST;

    var _instances = {};

    /**
     * The Overlay represents a positioned widget.
     *
     * @param {Element} node
     * @param {Object} attributes
     */
    function Overlay(node, attributes) {
        YAHOO.widget.Overlay.superclass.constructor.apply(this, arguments);
    };

    // Static Widget API Impls
    Overlay.NAME = "Overlay";

    Overlay.CONFIG = {
        'x': {
            set : function(val) {
                this.__.node.setStyle('left', val + "px");
            },
            validator : function(val) {
                return YAHOO.lang.isNumber(val);
            },
            value : 0
        },
        'y' : {
            set : function(val) {
                this.__.node.setStyle('top', val + "px");
            },
            validator : function(val) {
                return YAHOO.lang.isNumber(val);
            },
            value : 0
        },
        'zindex' : {
            set : function(val) {
                this.__.node.setStyle('z-index', val);
            },
            validator : function(val) {
                return YAHOO.lang.isNumber(val);
            },
            value : 2
        }
        // Leaving out iframe for the demo, unless we have time
    };

    Overlay.CLASSES = {
        ROOT : YUI.PREFIX + Overlay.NAME.toLowerCase(),
        HD : "hd",
        BD : "hd",
        FT : "ft"
    };

    Overlay.EVENTS = {
        BEFORE_MOVE : "beforeMove",
        MOVE : "move",
        BEFORE_MOVED_TO_TOP : "beforeMovedToTop",
        MOVED_TO_TOP : "movedToTop",
        BEFORE_MOVED_FROM_TOP : "beforeMovedFromTop",
        MOVED_FROM_TOP : "movedFromTop"
    };

    var proto = {
        initializer : function() {
            _instances[this.__.node.get('id')] = this;
        },

        destructor : function() {
            delete _instances[this.__.node.get('id')];
        },

        eraser : function() {
            this.__.node.get('node').innerHTML = "";
        },

        renderer : function() {
            // TODO: move up in heirarchy? Have Widget classes mark all nodes
            this.__.node.addClass(Overlay.CLASSES.ROOT);
        },

        moveTo : function(x,y) {
            if (this.fireEvent(Overlay.EVENTS.BEFORE_MOVE, this.get('x'), this.get('y')) !== false) {
                if (YAHOO.lang.isNumber(x)) {
                    this.set('x', x);
                }
                if (YAHOO.lang.isNumber(y)) {
                    this.set('y', y);
                }
                this.fireEvent(Overlay.EVENTS.MOVE, this.get('x'), this.get('y'));
            }
        },

        bringToTop : function() {

            function zIndexComparator(o1, o2) {
                var z1 = o1.get('zindex'),
                    z2 = o2.get('zindex');

                if (z1 > z2) {
                    return -1;
                } else if (z1 < z2) {
                    return 1;
                } else {
                    return 0;
                }
            }

            // TODO: optimize - sort during insertion? Always keep sorted array?
            var sorted = [];
            for (var oid in _instances) {
                if (YAHOO.lang.hasOwnProperty(_instances, oid)) {
                    sorted.push(_instances[oid]);
                }
            }

            if (sorted.length > 1) {
                sorted.sort(zIndexComparator);

                var oTop = sorted[0],
                    oNext = sorted[1],
                    bBump = false;

                if (oTop !== this) {
                    bBump = true;
                } else if (oNext.get('zindex') === this.get('zindex')) {
                    bBump = true;
                }

                if (bBump) {
                    var E = Overlay.EVENTS;
                    // TODO: Should "from", be able to stop "to"?
                    if (oTop.fireEvent(E.BEFORE_MOVED_FROM_TOP) !== false && this.fireEvent(E.BEFORE_MOVED_TO_TOP) !== false) {
                        this.set('zindex', oTop.get('zindex') + 1);
                        oTop.fire(E.MOVED_FROM_TOP);
                        this.fire(E.MOVED_TO_TOP);
                    }
                }
            }
        },
    };

    YAHOO.lang.extend(Overlay, W.Widget, proto);
    YAHOO.widget.Overlay = Overlay;
}());