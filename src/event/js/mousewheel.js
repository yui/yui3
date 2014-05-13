/**
 * Adds mousewheel event support
 * @module event
 * @submodule event-mousewheel
 */
var DOM_MOUSE_SCROLL = 'DOMMouseScroll',
    win = Y.config.win,
    doc = Y.config.doc,
    eventDef = {
        detach: function (node, sub) {
            sub._handle.detach();
        },
        _createFacade: function (domEvent, node, deltaY) {
            var facade = new Y.DOMEventFacade(domEvent, node);
            facade.type = 'wheel';
            facade.deltaX = 0;
            facade.deltaY = deltaY;
            facade.deltaZ = 0;
            facade.deltaMode = 1;
            return facade;
        }
    };

function attach() {
    return Y.Event._attach(arguments, {
        facade: false
    });
}

if (win.WheelEvent) {
    eventDef.on = function (node, sub, notifier) {
        var self = this;
        sub._handle = attach('wheel', function (domEvent) {
            notifier.fire(self._createFacade(domEvent, node, domEvent.deltaY));
        }, win);
    };
} else if ('onmousewheel' in doc) {
    eventDef.on = function (node, sub, notifier) {
        var self = this;
        sub._handle = attach('mousewheel', function (domEvent) {
            notifier.fire(self._createFacade(domEvent, node,
                - 1/40 * ('wheelDeltaX' in domEvent ? domEvent.wheelDeltaX : domEvent.wheelDelta)));
        }, doc);
    };
} else {
    eventDef.on = function (node, sub, notifier) {
        var self = this;
        sub._handle = attach('MozMousePixelScroll', function (domEvent) {
            notifier.fire(self._createFacade(domEvent, node, domEvent.detail));
        }, win);
    };
}

/**
Mousewheel event. Alias for the `wheel` event

@event mousewheel
@for YUI
@see wheel
@param {String} type Set to `'wheel'`.
**/
Y.Event.define('mousewheel', eventDef, true);

/**
The W3C `wheel` event. This listener is automatically attached to the correct
target, so one should not be supplied/

@event wheel
@for YUI
@param {Number} deltaX Set to 0.
@param {Number} deltaY Expected amount that the page will scroll along the
    y-axis according to the deltaMode units.
@param {Number} deltaZ Set to 0.
@param {Number} deltaMode Set to 1. Unit indicator (pixels, lines, or pages) for
    the deltaY attribute.
**/
Y.Event.define('wheel', eventDef, true);
