YUI.add('wheel-tests', function (Y) {

    var win    = Y.config.win,
        doc    = Y.config.doc,
        Assert = Y.Assert,
        node   = Y.one('#tester'),
        domNode = node.getDOMNode();

    var createWheelEvent;

    // Chrome
    if ((function () {
        try {
            return !!doc.createEvent('WheelEvent').initWebKitWheelEvent;
        } catch (e) {
            return false;
        }
    }())) {
        createWheelEvent = function (deltaY) {
            var evt = doc.createEvent('WheelEvent');
            evt.initWebKitWheelEvent(
                0,      /* deltaX*/
                -deltaY,      /* deltaY */
                window, /* view */
                0,      /* screenX */
                0,      /* screenY */
                0,      /* clientX */
                0,      /* clientY */
                false,  /* ctrlKey */
                false,  /* altKey */
                false,  /* shiftKey */
                false   /* metaKey */);
            return evt;
        };
    // Modern IE
    } else if ((function () {
        try {
            return !!doc.createEvent('WheelEvent').initWheelEvent;
        } catch (e) {
            return false;
        }
    }())) {
        createWheelEvent = function (deltaY) {
            var evt = doc.createEvent('WheelEvent');
            evt.initWheelEvent('wheel',  /* type */
                               true,   /* bubbles */
                               true,   /* cancelable */
                               window, /* view */
                               0,      /* detail */
                               1,      /* screenX */
                               2,      /* screenY */
                               3,      /* clientX */
                               4,      /* clientY */
                               5,      /* button */
                               null,   /* relatedTarget */
                               "",     /* modifiers */
                               6,      /* deltaX*/
                               7,      /* deltaY */
                               8,      /* deltaZ*/
                               9       /* deltaMode */ );
            return evt;
        };
    } else if (doc.createEventObject) {
        createWheelEvent = function (deltaY) {
            var evt = doc.createEventObject();
            evt.type = 'wheelevent';
            return evt;
        };
    } else {
        createWheelEvent = function (deltaY) {
            var evt = doc.createEvent('MouseScrollEvents');
            evt.initMouseEvent('wheel',  /* type */
                                true,   /* bubbles */
                                true,   /* cancelable */
                                window, /* view */
                                0,      /* detail */
                                0,      /* screenX */
                                0,      /* screenY */
                                0,      /* clientX */
                                0,      /* clientY */
                                false,  /* ctrlKey */
                                false,  /* altKey */
                                false,  /* shiftKey */
                                false,  /* metaKey */
                                0,      /* button */
                                null    /* related target */
                            );
            return evt;
        };
    }

    Y.MouseWheelSuite.add(new Y.Test.Case({
        name: 'W3C wheel event',

        _should: {
            ignore: {
                'test wheel implementation': !win.WheelEvent,
                'test mousewheel implementation': !!win.WheelEvent
            }
        },

        // Modern IE
        'test wheel implementation': function () {
            var deltaY = 50,
                mouseEvent = createWheelEvent(deltaY),
                test = this;

            node.once('wheel', function (e) {
                test.resume(function () {
                    Assert.areSame(0, e.deltaX, 'Wrong deltaX event payloed');
                    Assert.areSame(0, e.deltaZ, 'Wrong deltaZ event payloed');
                    Assert.areSame(1, e.deltaMode, 'Wrong deltaMode event payloed');
                });
            });

            setTimeout(function () {
                domNode.dispatchEvent(mouseEvent);
            }, 0);

            test.wait();
        },

        'test mousewheel implementation': function () {
            var mouseEvent = createWheelEvent(50),
                test = this;

            node.once('wheel', function (e) {
                test.resume(function () {
                    Assert.areSame(0, e.deltaX, 'Wrong deltaX event payloed');
                    Assert.areSame(0, e.deltaZ, 'Wrong deltaZ event payloed');
                    Assert.areSame(1, e.deltaMode, 'Wrong deltaMode event payloed');
                });
            });

            setTimeout(function () {
                if (domNode.dispatchEvent) {
                    domNode.dispatchEvent(mouseEvent);
                } else {
                    domNode.fireEvent('onmousewheel', mouseEvent);
                }
            }, 0);

            test.wait();
        }
    }));

});
