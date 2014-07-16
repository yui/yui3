YUI.add('scrollview-base-unit-tests', function (Y, NAME) {

    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 5000,
        simulateMousewheel = Y.simulateMousewheel,
        baseTestSuite = new Y.Test.Suite("Scrollview: Base"),
        unitTestSuite = new Y.Test.Suite("Unit Tests"),
        unitTestSuiteDev = new Y.Test.Suite("In development tests"),
        functionalTestSuite = new Y.Test.Suite("Functional Tests"),
        renderNewScrollview = Y.renderNewScrollview,
        getMockMousewheelEvent = Y.getMockMousewheelEvent,
        getMockGestureEvent = Y.getMockGestureEvent,
        getMockGestureObject = Y.getMockGestureObject,
        isIE = (Y.UA.ie > 0);

    unitTestSuite.add(new Y.Test.Case({
        name: "Lifecycle",

        setUp : function () {
            cleanup();
        },

        tearDown : function () {
            Y.one('#container').empty(true);
        },

        "Ensure initial state is correct": function () {
            var scrollview = renderNewScrollview('x'),
                attrs = Y.ScrollView.ATTRS;

            // Loop through each ATTR and ensure its value matches the default to ensure any setters work properly.
            Y.Object.each(attrs, function (data, attr) {
                var val;

                if (data.value !== undefined) {
                    val = data.value;
                    if (Y.Lang.isObject(val)) {
                        Y.ObjectAssert.areEqual(val, scrollview.get(attr));  // areEqual is deprecated, but still works
                    }
                    else {
                        Y.Assert.areEqual(val, scrollview.get(attr));
                    }
                }
            });
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Attributes",

        setUp : function () {
            cleanup();
        },

        tearDown : function () {
            Y.one('#container').empty(true);
        },

        "Deprecated static values should set appropriate ATTRs": function () {

            Y.ScrollView.FRAME_STEP = 1;
            Y.ScrollView.SNAP_DURATION = 2;
            Y.ScrollView.SNAP_EASING = 3;
            Y.ScrollView.EASING = 'cubic-bezier(0, 0, 0, 0)';
            Y.ScrollView.BOUNCE_RANGE = 5;

            var scrollview = renderNewScrollview('x');

            Y.Assert.areEqual(Y.ScrollView.FRAME_STEP, scrollview.get('frameDuration'));
            Y.Assert.areEqual(Y.ScrollView.SNAP_DURATION, scrollview.get('snapDuration'));
            Y.Assert.areEqual(Y.ScrollView.SNAP_EASING, scrollview.get('snapEasing'));
            Y.Assert.areEqual(Y.ScrollView.EASING, scrollview.get('easing'));
            Y.Assert.areEqual(Y.ScrollView.BOUNCE_RANGE, scrollview.get('bounceRange'));
        },

        // Axis setters
        "Forced axis to X should evaluate properly": function () {
            var Test = this,
                scrollview = renderNewScrollview('x');

            Y.Assert.areEqual(true, scrollview.get('axis').x);
            Y.Assert.areEqual(false, scrollview.get('axis').y);
        },

        "Forced axis to Y should evaluate properly": function () {
            var Test = this,
                scrollview = renderNewScrollview('y');

            Y.Assert.areEqual(false, scrollview.get('axis').x);
            Y.Assert.areEqual(true, scrollview.get('axis').y);
        },

        "Forced axis to XY should evaluate properly": function () {
            var Test = this,
                scrollview = renderNewScrollview('xy');

            Y.Assert.areEqual(true, scrollview.get('axis').x);
            Y.Assert.areEqual(true, scrollview.get('axis').y);
        },

        "An unspecified axis for a widget of these dimensions should autocalculate to x:true and y:true": function () {
            var Test = this,
                scrollview = renderNewScrollview();

            Y.Assert.isTrue(scrollview.get('axis').x);
            Y.Assert.isTrue(scrollview.get('axis').y);
        },

        "Changing flick to false should work" :function () {
            var Test = this,
                Mock = Y.Test.Mock,
                scrollview = renderNewScrollview();

            Y.Assert.isObject(scrollview.get('flick'));
            scrollview.set('flick', false);
            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.isFalse(scrollview.get('flick'));
                });
            });

            Test.wait(WAIT);
        },

        "Changing drag to false should work" :function () {
            var Test = this,
                Mock = Y.Test.Mock,
                scrollview = renderNewScrollview();

            Y.Assert.isTrue(scrollview.get('drag'));
            scrollview.set('drag', false);
            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.isFalse(scrollview.get('drag'));
                });
            });

            Test.wait(WAIT);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Rendering",

        setUp : function () {
            cleanup();
        },

        tearDown : function () {
            Y.one('#container').empty(true);
        },

        "Ensure initial rendering is correct": function () {
            var scrollview = renderNewScrollview('x'),
                bb = scrollview.get('boundingBox'),
                cb = scrollview.get('contentBox'),
                id = cb.get('id'),
                ul = cb.all('> ul'),
                li = cb.all('> ul > li');

                Y.Assert.areEqual(10, li.size());
                Y.Assert.isTrue(bb.hasClass('yui3-scrollview'), "BoundingBox does not contain class 'yui3-scrollview'");
                Y.Assert.isTrue(cb.hasClass('yui3-scrollview-content'), "ContentBox does not contain class 'yui3-scrollview-content'");
                Y.Assert.isTrue(bb.hasClass('yui3-scrollview-horiz'), "BoundingBox does not contain class 'yui3-scrollview-horiz'");
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Public API",

        setUp : function () {
            cleanup();
        },

        tearDown : function () {
            Y.one('#container').empty(true);
        },

        // Scroll{X/Y} setters
        "set('scrollX') to a positive distance should move it that distance": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 20;

            // Assume it starts @ 0
            Y.Assert.areEqual(0, scrollview.get('scrollX'));
            scrollview.set('scrollX', distance);
            Y.Assert.areEqual(distance, scrollview.get('scrollX'));
        },

        "set('scrollY') to a positive distance should move it that distance": function () {
            var Test = this,
                scrollview = renderNewScrollview('y'),
                distance = 20;

            // Assume it starts @ 0
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            scrollview.set('scrollY', distance);
            Y.Assert.areEqual(distance, scrollview.get('scrollY'));
        },

        // scrollTo
        "scrollTo on X should scroll": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.on('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(distance, scrollview.get('scrollX'));
                });
            });

            scrollview.scrollTo(distance, null, DURATION);

            Test.wait(WAIT);
        },

        "scrollTo on Y should scroll": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.on('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(distance, scrollview.get('scrollY'));
                });
            });

            scrollview.scrollTo(null, distance, DURATION);

            Test.wait(WAIT);
        },

        // Properties
        "lastScrolledAmt should be correct": function () {

            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(distance, scrollview.lastScrolledAmt);
                });
            });

            scrollview.set('scrollX', distance, {duration: 10});

            Test.wait(WAIT);
        },

        "Disabled scrollview should not scroll with scrollTo": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.set('disabled', true);
            scrollview.scrollTo(distance, null);
            scrollview.set('scrollY', distance);

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });
            Test.wait(WAIT);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Events",

        setUp : function () {
            cleanup();
        },

        tearDown : function () {
            Y.one('#container').empty(true);
        },

        "Ensure the 'scrollEnd' event fires": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = scrollview._maxScrollX,
                eventsFired = 0;

            // Ensure scrollEnd fires
            scrollview.once('scrollEnd', function () {
                eventsFired++;
                Y.Assert.areEqual(distance, scrollview.get('scrollX'));
                Y.Assert.areEqual(0, scrollview.get('scrollY'));
                Y.Assert.areEqual(1, eventsFired);
            });

            scrollview.scrollTo(distance, 0, DURATION); // args = x, y, duration, easing
        },

        "Widget resize should trigger heightChange": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                eventsFired = 0;

            // Ensure scrollEnd fires
            scrollview.after('heightChange', function () {
                Y.later(100, scrollview, function () {
                    Test.resume(function () {
                        eventsFired++;
                        Y.Assert.areEqual(1, eventsFired);
                    });
                });
            });

            Y.later(10, scrollview, function () {
                scrollview.set('height', 123);
            });

            Test.wait(WAIT);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture start",

        setUp : function () {
            cleanup();
            this.scrollview = renderNewScrollview('x');
            this.mockEvent = getMockGestureEvent(0, 0);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Disabled scrollviews should do nothing" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            scrollview.set('disabled', true);

            response = scrollview._onGestureMoveStart(mockEvent);
            Y.Assert.isFalse(response);
        },

        "Gesture start should create a _gesture object" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            response = scrollview._onGestureMoveStart(mockEvent);

            gesture = scrollview._gesture;

            Y.Assert.isNull(null, gesture.axis);
            Y.Assert.areEqual(0, gesture.startX);
            Y.Assert.areEqual(0, gesture.startY);
            Y.Assert.areEqual(0, gesture.startClientX);
            Y.Assert.isNull(gesture.endClientX);
            Y.Assert.isNull(gesture.endClientY);
            Y.Assert.isNull(gesture.deltaX);
            Y.Assert.isNull(gesture.deltaY);
            Y.Assert.isNull(gesture.flick);
            Y.Assert.isObject(gesture.onGestureMove);
            Y.Assert.isObject(gesture.onGestureMoveEnd);
        },

        "scrollview._prevent.start should preventDefault" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            scrollview._prevent.start = true;

            response = scrollview._onGestureMoveStart(mockEvent);

            Y.Mock.verify(mockEvent);
        },

        "Flicks should cancel any flicks in progress" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                canceledFlicks = 0,
                response;

            scrollview._flickAnim = {
                cancel: function () {
                    canceledFlicks += 1;
                }
            };

            response = scrollview._onGestureMoveStart(mockEvent);
            Y.Assert.isUndefined(scrollview._flickAnim);
            Y.Assert.areEqual(1, canceledFlicks);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture X",

        setUp : function () {
            cleanup();
            this.scrollview = renderNewScrollview('x');
            this.mockEvent = getMockGestureEvent(2, 0);
            this.scrollview._gesture = getMockGestureObject(null, 5, 0);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "scrollview._prevent.start should preventDefault" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            scrollview._prevent.start = true;

            response = scrollview._onGestureMove(mockEvent);

            Y.Mock.verify(mockEvent);
        },

        "gesture on X should update the scrollX values" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;
            response = scrollview._onGestureMove(mockEvent);

            Y.Assert.areEqual(3, scrollview._gesture.deltaX);
            Y.Assert.areEqual(0, scrollview._gesture.deltaY);
            Y.Assert.areEqual(8, scrollview.get('scrollX'));
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture Y",

        setUp : function () {
            cleanup();
            this.scrollview = renderNewScrollview('y');
            this.mockEvent = getMockGestureEvent(0, 3);
            this.scrollview._gesture = getMockGestureObject('y', 0, 6);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "scrollview._prevent.start should preventDefault" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            scrollview._prevent.end = true;

            response = scrollview._onGestureMoveEnd(mockEvent);

            Y.Mock.verify(mockEvent);
        }
    }));



    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture end",

        setUp : function () {
            cleanup();
            this.scrollview = renderNewScrollview('x');
            this.mockEvent = getMockGestureEvent(3, 0);
            this.scrollview._gesture = getMockGestureObject(null, 6, 0);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "gesture on X should update the scrollX values" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    // If the test gets here, everything passed.
                    Y.Assert.isTrue(true);
                });
            });

            Y.later(1, null, function () {
                response = scrollview._onGestureMoveEnd(mockEvent);
            });

            Test.wait(WAIT);
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - flick",

        setUp : function () {
            cleanup();
            this.scrollview = renderNewScrollview('x');
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "flick on a disabled instance should do nothing" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x');

            scrollview.set('disabled', true);

            response = scrollview._flick();

            Y.Assert.isFalse(response);
        },

        "flick should bar" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x');


            response = scrollview._flick({
                flick: {
                    axis: 'x',
                    velocity: '-1'
                }
            });

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areNotEqual(0, scrollview.get('scrollX'));
                });
            });

            Test.wait(WAIT);
        },

        "_flickFrame on X should set scrollX with the correct value" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x');

            scrollview._flickFrame(-0.02, 'x', 0);
            Y.Assert.areNotEqual(0, scrollview.get('scrollX'));
            Y.Assert.areEqual(0, scrollview.get('scrollY'));

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areNotEqual(0, scrollview.get('scrollX'));
                });
            });

            Test.wait(WAIT);
        },

        "_flickFrame on Y should set scrollX with the correct value" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('y');

            scrollview._flickFrame(-0.02, 'y', 0);
            Y.Assert.areEqual(0, scrollview.get('scrollX'));
            Y.Assert.areNotEqual(0, scrollview.get('scrollY'));

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areNotEqual(0, scrollview.get('scrollY'));
                });
            });

            Test.wait(WAIT);
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - snap",

        setUp : function () {
            cleanup();
            this.scrollview = renderNewScrollview('x');
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "snapBack on X should work properly" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x');

            scrollview.set('scrollX', -100);
            Y.Assert.areEqual(-100, scrollview.get('scrollX'));
            scrollview._snapBack();
            Y.Assert.areEqual(0, scrollview.get('scrollX'));
        },

        "snapBack on Y should work properly" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('y');

            scrollview.set('scrollY', -100);
            Y.Assert.areEqual(-100, scrollview.get('scrollY'));
            scrollview._snapBack();
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - mousewheel",

        setUp : function () {
            cleanup();
            this.scrollview = renderNewScrollview('y');
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "mousewheel up from 0 should do nothing" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = getMockMousewheelEvent(1, this.scrollview.get('boundingBox'));

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            scrollview._mousewheel(mockEvent);
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            Y.Mock.verify(mockEvent);
        },

        "mousewheel up from 10 should move the Y offset to 0" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = getMockMousewheelEvent(1, this.scrollview.get('boundingBox'));

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            scrollview.set('scrollY', 10);
            Y.Assert.areEqual(10, scrollview.get('scrollY'));
            scrollview._mousewheel(mockEvent);
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            Y.Mock.verify(mockEvent);
        },

        "mousewheel down from 0 should move the Y offset down" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = getMockMousewheelEvent(-1, this.scrollview.get('boundingBox'));

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            scrollview._mousewheel(mockEvent);
            Y.Assert.areEqual(10, scrollview.get('scrollY'));
            Y.Mock.verify(mockEvent);
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Misc methods",

        setUp : function () {
            cleanup();
            this.scrollview = renderNewScrollview('y');
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "afterAxisChange should update the cached axis property" :function () {
            var Test = this,
                scrollview = this.scrollview;

            Y.Assert.isFalse(scrollview._cAxis.x);
            Y.Assert.isTrue(scrollview._cAxis.y);
            scrollview._afterAxisChange({newVal: {x:true, y:false}});
            Y.Assert.isTrue(scrollview._cAxis.x);
            Y.Assert.isFalse(scrollview._cAxis.y);
        },

        "_afterScrollEnd should delete sv._flickAnim" :function () {
            var Test = this,
                Mock = Y.Test.Mock,
                scrollview = this.scrollview;

            // Cannot mock cancel() to ensure it is fired because the object is deleted at the end of _afterScrollEnd()
            scrollview._flickAnim = {cancel:function(){}};
            scrollview._afterScrollEnd();
            Y.Assert.isUndefined(scrollview._flickAnim);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "IE tests",
        _should: {
            ignore: {
                '_iePreventSelect should return false' : !isIE,
                '_ieRestoreSelect should exist' : !isIE,
                '_fixIESelect should exist' : !isIE
            }
        },

        "_iePreventSelect should return false": function () {
            var scrollview = renderNewScrollview('x');
            var result = scrollview._iePreventSelect();

            Y.Assert.isFalse(result);
        },

        "_ieRestoreSelect should exist": function () {
            var scrollview = renderNewScrollview('x');

            Y.Assert.isFunction(scrollview._ieRestoreSelect);
        },

        "_fixIESelect should exist": function () {
            var scrollview = renderNewScrollview('x');

            Y.Assert.isFunction(scrollview._fixIESelect);
        }
    }));



    if (unitTestSuiteDev.items.length > 0) {
        baseTestSuite.add(unitTestSuiteDev);
    }
    else {
        baseTestSuite.add(unitTestSuite);
        baseTestSuite.add(functionalTestSuite);
    }

    Y.Test.Runner.add(baseTestSuite);

    function cleanup() {
        delete Y.ScrollView.FRAME_STEP;
        delete Y.ScrollView.SNAP_DURATION;
        delete Y.ScrollView.SNAP_EASING;
        delete Y.ScrollView.EASING;
        delete Y.ScrollView.BOUNCE_RANGE;
    }

    /*
        Additional test ideas:
        - Don't scroll Y if a X axis
        - Don't scroll X if a Y axis
        - sv._prevent.start
        - sv._prevent.end
        - Flick while already executing a flick
        - Forced axis vs auto-detection
        - Make sure scrollEnd only fires once
        - setScroll after disabling
        - Flick while flicking
        - swipe to OOB
    */
    /*
    Not possible until (if) bounding constraints are added to scrollTo.  Difficult because
    that is also an internal API that needs to be able to overscroll at times (drags, then snapback)

    "scrollTo above the max width should move it to max X": function () {
        var Test = this,
            scrollview = renderNewScrollview(false),
            bounds = scrollview._getBounds();

        scrollview.on('scrollEnd', function () {
            Test.resume(function () {
                Y.Assert.areEqual(2700, scrollview.get('scrollX'));
            })
        });

            // Assume it starts @ 0
            Y.Assert.areEqual(0, scrollview.get('scrollX'));

            scrollview.scrollTo(2700, null, DURATION);

        Test.wait(WAIT);
    },

    "scrollTo above the max height should move it to max Y": function () {
        var Test = this,
            scrollview = renderNewScrollview(false),
            max = scrollview._maxScrollY;

        scrollview.on('scrollEnd', function () {
            Test.resume(function () {
                Y.Assert.areEqual(max, scrollview.get('scrollX'));
            })
        });

        // Assume it starts @ 0
        Y.Assert.areEqual(0, scrollview.get('scrollY'));

        scrollview.scrollTo(null, max+1, DURATION);

        Test.wait(WAIT);
    },
    */

}, null, {requires: ['test', 'node-event-simulate', 'scrollview-base', 'scrollview-test-utils']});
