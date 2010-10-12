
(function() {

var stateChangeListener,
    GLOBAL_ENV   = YUI.Env,
    config       = YUI.config,
    doc          = config.doc,
    docElement   = doc && doc.documentElement,
    EVENT_NAME   = 'onreadystatechange',
    pollInterval = config.pollInterval || 40;

if (!GLOBAL_ENV._ieready) {
    GLOBAL_ENV._ieready = function() {
        GLOBAL_ENV._ready();
    };

/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller/Diego Perini */
// Internet Explorer: use the doScroll() method on the root element.
// This isolates what appears to be a safe moment to manipulate the
// DOM prior to when the document's readyState suggests it is safe to do so.
    if (self !== self.top) {
        stateChangeListener = function() {
            if (doc.readyState == 'complete') {
                GLOBAL_ENV.Env.remove(doc, EVENT_NAME, stateChangeListener);
                GLOBAL_ENV.ieready();
            }
        };
        GLOBAL_ENV.Env.add(doc, EVENT_NAME, stateChangeListener);
    } else {
        GLOBAL_ENV._dri = setInterval(function() {
            try {
                docElement.doScroll('left');
                clearInterval(GLOBAL_ENV._dri);
                GLOBAL_ENV._dri = null;
                GLOBAL_ENV._ieready();
            } catch (domNotReady) { }
        }, pollInterval);
    }
}

})();
YUI.add('event-base-ie', function(Y) {

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

Y.DOMEventFacade = IEEventFacade;


}, '@VERSION@' );
