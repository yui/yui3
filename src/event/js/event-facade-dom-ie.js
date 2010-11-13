/*
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event
 * @submodule event-base
 */

var IEEventFacade = function() {
        // IEEventFacade.superclass.constructor.apply(this, arguments);
        Y.DOM2EventFacade.apply(this, arguments);
    };

Y.extend(IEEventFacade, Y.DOM2EventFacade, {

    init: function() {

        IEEventFacade.superclass.init.apply(this, arguments);

        var e = this._event,
            resolve = Y.DOM2EventFacade.resolve,
            x, y, d, b, de, t;

        this.target = resolve(e.srcElement);

        if (('clientX' in e) && (!x) && (0 !== x)) {
            x = e.clientX;
            y = e.clientY;

            d = Y.config.doc;
            b = d.body;
            de = d.documentElement;

            x += (de.scrollLeft || (b && b.scrollLeft) || 0);
            y += (de.scrollTop  || (b && b.scrollTop)  || 0);

            this.pageX = x;
            this.pageY = y;
        }

        if (e.type == "mouseout") {
            t = e.toElement;
        } else if (e.type == "mouseover") {
            t = e.fromElement;
        }

        this.relatedTarget = resolve(t);

        // which should contain the unicode key code if this is a key event
        // if (e.charCode) {
        //     this.which = e.charCode;
        // }

        // for click events, which is normalized for which mouse button was
        // clicked.
        if (e.button) {
            switch (e.button) {
                case 2:
                    this.which = 3;
                    break;
                case 4:
                    this.which = 2;
                    break;
                default:
                    this.which = e.button;
            }

            this.button = this.which;
        }

    },

    stopPropagation: function() {
        var e = this._event;
        e.cancelBubble = true;
        this._wrapper.stopped = 1;
        this.stopped = 1;
    },

    stopImmediatePropagation: function() {
        this.stopPropagation();
        this._wrapper.stopped = 2;
        this.stopped = 2;
    },

    preventDefault: function(returnValue) {
        this._event.returnValue = returnValue || false;
        this._wrapper.prevented = 1;
        this.prevented = 1;
    }

});

if (Y.UA.ie) {
    Y.DOMEventFacade = IEEventFacade;
}
