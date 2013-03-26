/**
Adds support for Widgets to subscribe to DOM events. Event callbacks will
default their `this` object to the widget. Events will be subscribed from the
widget's boundingBox.

@module eventx
@submodule eventx-dom-widget
@for Widget
**/
var DOM_EVENTS = Y.Event.DOM_EVENTS,
    DOMEvent   = Y.Event.DOMEvent;

if (!Y.Widget.events) {
    Y.EventTarget.configure(Y.Widget);
}

Y.Widget.publish('@dom-events', {
    test: function (target, args /*, details*/) {
        return DOM_EVENTS[args[0]];
    },

    subscribe: function (target, args, details) {
        var sub;

        if (target.get('rendered')) {
            sub = DOMEvent.subscribe(target.get('boundingBox'), args, details);
            if (sub) {
                sub.target = target;
            }
        } else {
            sub = target.after('render', '_afterRenderSubscribe', this,
                                target, args, details);
        }

        return sub;
    },

    _afterRenderSubscribe: function (e, target, args, details) {
        this.subscribe(target, args, details);
    },

    unsubscribe: function (target, args) {
        if (target.get('rendered')) {
            DOMEvent.unsubscribe(target.get('boundingBox'), args);
        /*
        } else {
            var subs, payload, i, len;

            // What a tremendous hassle. Detach any _afterRenderSubscribe subs
            // that contain in their payload the detach args passed here. The
            // edge case that this protects against is
            // 1. widget.on('click', ...)
            // 2. widget.detach('click', ...);
            // 3. widget.render()
            // It's so not worth the code weight, so I commented it out. If you
            // run into this issue, first of all, congratulations! Secondly,
            // you must be doing something really complicated. And thirdly,
            // this is the code you'll need to get yourself out of trouble,
            // but you're probably better off avoiding the need for this code.
            subs = target._yuievt.subs.render;
            subs = subs && subs.after;

            if (subs) {
                for (i = 0, len = subs.length; i < len; ++i) {
                    if (subs[i].callback === '_afterRenderSubscribe') {
                        // payload is [target, args, details] from subscribe
                        payload = subs[i].payload;

                        if (payload
                        &&  payload[0] === target
                        &&  args[0] === payload[1][0]
                        &&  (!args[1] || args[1] === payload[1][1])
                        &&  (!args[2] || args[2] === payload[2].phase)) {
                            subs[i].detach();
                        }
                }
            }
        */
        }
    }
}, null, ['subscribe', 'unsubscribe']);
