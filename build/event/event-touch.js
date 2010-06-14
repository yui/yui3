YUI.add('event-touch', function(Y) {

var SCALE = "scale",
    ROTATION = "rotation";

Y.DOMEventFacade.prototype._touch = function(e, currentTarget, wrapper) {

    var i,l, etCached, et,touchCache;


    if (e.touches) {

        this.touches = [];
        touchCache = {};

        for (i = 0, l = e.touches.length; i < l; ++i) {
            et = e.touches[i];
            touchCache[Y.stamp(et)] = this.touches[i] = new Y.DOMEventFacade(et, currentTarget, wrapper);
        }
    }

    if (e.targetTouches) {

        this.targetTouches = [];

        for (i = 0, l = e.targetTouches.length; i < l; ++i) {
            et = e.targetTouches[i];
            etCached = touchCache && touchCache[Y.stamp(et, true)];

            this.targetTouches[i] = etCached || new Y.DOMEventFacade(et, currentTarget, wrapper);
            
        }
    }

    if (e.changedTouches) {

        this.changedTouches = [];

        for (i = 0, l = e.changedTouches.length; i < l; ++i) {
            et = e.changedTouches[i];
            etCached = touchCache && touchCache[Y.stamp(et, true)];

            this.changedTouches[i] = etCached || new Y.DOMEventFacade(et, currentTarget, wrapper);
            
        }
    }

    if (SCALE in e) {
        this.scale = e.scale;
    }

    if (ROTATION in e) {
        this.rotation = e.rotation;
    }
};

if (Y.Node.DOM_EVENTS) {
    Y.mix(Y.Node.DOM_EVENTS, {
        touchstart:1,
        touchmove:1,
        touchend:1,
        touchcancel:1,
        gesturestart:1,
        gesturechange:1,
        gestureend:1
    });
}


}, '@VERSION@' ,{requires:['node-base']});
