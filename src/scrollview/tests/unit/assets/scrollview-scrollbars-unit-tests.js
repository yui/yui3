YUI.add('scrollview-scrollbars-unit-tests', function (Y, NAME) {

    var WAIT = 4000,
        simulateMousewheel = Y.simulateMousewheel, /* Only supported in Chrome */
        scrollbarsTestSuite = new Y.Test.Suite({name:"Scrollview: Scrollbars"}),
        unitTestSuite = new Y.Test.Suite({name:"Unit Tests"}),
        unitTestSuiteDev = new Y.Test.Suite({name:"Tests In Development"}),
        renderNewScrollview = Y.renderNewScrollview,
        nativeTransitions = Y.Transition.useNative,
        Mock = Y.Test.Mock,
        setUp = function () {

        },
        tearDown = function () {
            delete Y.SCROLLVIEW_TEST_UTIL_WIDGET_WIDTH;
            delete Y.SCROLLVIEW_TEST_UTIL_WIDGET_HEIGHT;
            Y.one('#container').empty(true);
        };

    unitTestSuite.add(new Y.Test.Case({
        name: "Rendering",

        setUp: setUp,
        tearDown: tearDown,

        "_updateBars should correctly position horizontal scrollbars": function() {

            var width = 30,
                duration = 3,
                axis = 'X',
                scrollview = renderNewScrollview(axis),
                scrollbarMock = getMockScrollbarNode(axis, width, duration);

            scrollbarMock.transition = function (transform) {
                if (nativeTransitions) {
                    Y.Assert.areEqual(this.expected.scrollbar.duration, transform.duration);
                    Y.Assert.areEqual(this.expected.scrollbar.transform, transform.transform);
                }
                else {
                    Y.Assert.areEqual(this.expected.scrollbar.duration, transform.duration);
                    Y.Assert.areEqual(this.expected.scrollbar.left, transform.left);
                }
            };

            scrollview.scrollbars._updateBar(scrollbarMock, undefined, duration, true);
        },

       "_updateBars should correctly position vertical scrollbars": function() {

            var height = Y.SCROLLVIEW_TEST_UTIL_WIDGET_HEIGHT = 30,
                duration = 4,
                axis = 'Y',
                scrollview = renderNewScrollview(axis),
                scrollbarMock = getMockScrollbarNode(axis, height, duration);

            scrollbarMock.transition = function (transform) {

                if (nativeTransitions) {
                    Y.Assert.areEqual(this.expected.scrollbar.duration, transform.duration);
                    Y.Assert.areEqual(this.expected.scrollbar.transform, transform.transform);
                }
                else {
                    Y.Assert.areEqual(this.expected.scrollbar.duration, transform.duration);
                    Y.Assert.areEqual(this.expected.scrollbar.top, transform.top);
                }
            };

            scrollview.scrollbars._updateBar(scrollbarMock, undefined, duration, false);
        },

         "_renderBar(.., false) should remove the scrollbar from the widget": function() {
            var height = Y.SCROLLVIEW_TEST_UTIL_WIDGET_HEIGHT = 30,
                duration = 4,
                axis = 'X',
                scrollview = renderNewScrollview(axis),
                bars = scrollview.scrollbars,
                scrollbarMock = getMockScrollbarNode(axis, height, duration);

            scrollbarMock.inDoc = function () {
                return true;
            };

            Mock.expect(scrollbarMock, {
                method: 'remove',
                args: []
            });

            Mock.expect(scrollbarMock, {
                method: 'clearData',
                args: [Mock.Value.String]
            });

            bars._renderBar(scrollbarMock, false);

            Mock.verify(scrollbarMock);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Rendering",

        setUp: setUp,
        tearDown: tearDown,

        "Ensure rendering & initial state are correct": function() {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                bars = scrollview.scrollbars,
                node = bars.get('horizontalNode'),
                children = node.all('>span');

            this.scrollview = scrollview;

            Y.later(100, null, function () {
                scrollview.on('render', function(){
                    Test.resume(function () {
                        Y.Assert.isTrue(node.hasClass('yui3-scrollview-scrollbar'), "BoundingBox does not contain class 'yui3-scrollview-scrollbar'");
                        Y.Assert.isTrue(node.hasClass('yui3-scrollview-scrollbar-horiz'), "ContentBox does not contain class 'yui3-scrollview-scrollbar-horiz'");
                        Y.Assert.isTrue(children.item(0).hasClass('yui3-scrollview-child'), "Scrollbar child does not contain class 'yui3-scrollview-child'");
                        Y.Assert.isTrue(children.item(0).hasClass('yui3-scrollview-first'), "Scrollbar child does not contain class 'yui3-scrollview-first'");
                        Y.Assert.isTrue(children.item(1).hasClass('yui3-scrollview-middle'), "Scrollbar child does not contain class 'yui3-scrollview-middle'");
                        Y.Assert.isTrue(children.item(2).hasClass('yui3-scrollview-last'), "Scrollbar child does not contain class 'yui3-scrollview-last'");
                        Y.Assert.areEqual(3, children._nodes.length);
                    });
                });
            });

            Test.wait(WAIT);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Movement",

        setUp: setUp,
        tearDown: tearDown,

        "Ensure offset is correct for horizontal ScrollView": function() {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = scrollview._maxScrollX,
                bars = scrollview.scrollbars,
                node = bars.get('horizontalNode'),
                transitionSteps = [
                    {
                        duration: '0.5',
                        transform: 'translateX(270px)',
                        opacity: undefined,
                        left: '270px'
                    },
                    {
                        duration: '0.6',
                        opacity: '1',
                        transform: undefined
                    },
                    {
                        duration: '0.6',
                        opacity: '1',
                        transform: undefined
                    },
                    {
                        duration: '0.6',
                        opacity: '0',
                        transform: undefined
                    }
                ];

            node.transition = function (transition) {
                var expected = transitionSteps.shift();

                Test.resume(function () {
                    if (Y.Transition.useNative) {
                        Y.Assert.areEqual(expected.duration, transition.duration);
                        Y.Assert.areEqual(expected.transform, transition.transform);
                        Y.Assert.areEqual(expected.opacity, transition.opacity);
                    }
                    else {
                        Y.Assert.areEqual(expected.duration, transition.duration);
                        Y.Assert.areEqual(expected.left, transition.left);
                        Y.Assert.areEqual(expected.opacity, transition.opacity);
                    }

                    if (transitionSteps.length !== 0) {
                        Test.wait(WAIT);
                    }
                });
            };

            Y.later(1, this, function () {
                scrollview.scrollTo(distance, 0, 500);
            });

            Test.wait(WAIT);
        },

        "Ensure offset is correct for vertical ScrollView": function() {
            var Test = this,
                scrollview = renderNewScrollview('y'),
                distance = scrollview._maxScrollY,
                bars = scrollview.scrollbars,
                node = bars.get('verticalNode'),
                transitionSteps = [
                    {
                        duration: '0.5',
                        transform: 'translateY(90px)',
                        opacity: undefined,
                        top: '90px'
                    },
                    {
                        duration: '0.6',
                        opacity: '1',
                        transform: undefined
                    },
                    {
                        duration: '0.6',
                        opacity: '1',
                        transform: undefined
                    },
                    {
                        duration: '0.6',
                        opacity: '0',
                        transform: undefined
                    }
                ];

            node.transition = function (transition) {
                var expected = transitionSteps.shift();

                Test.resume(function () {
                    if (Y.Transition.useNative) {
                        Y.Assert.areEqual(expected.duration, transition.duration);
                        Y.Assert.areEqual(expected.transform, transition.transform);
                        Y.Assert.areEqual(expected.opacity, transition.opacity);
                    }
                    else {
                        Y.Assert.areEqual(expected.duration, transition.duration);
                        Y.Assert.areEqual(expected.top, transition.top);
                        Y.Assert.areEqual(expected.opacity, transition.opacity);
                    }

                    if (transitionSteps.length !== 0) {
                        Test.wait(WAIT);
                    }
                });
            };

            Y.later(1, this, function () {
                scrollview.scrollTo(0, distance, 500); // args = x, y, duration, easing
            });

            Test.wait(WAIT);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Utility",

        setUp: setUp,
        tearDown: tearDown,

        "_clearChildCache should attempt to clear the child cache": function() {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                bars = scrollview.scrollbars,
                nodeMock = new Mock();

            Mock.expect(nodeMock, {
                method: 'clearData',
                args: ["childCache"]
            });

            bars._clearChildCache(nodeMock);
            Mock.verify(nodeMock);
        }
    }));

    /*
     * To aid development.
     */
    if (unitTestSuiteDev.items.length > 0) {
        scrollbarsTestSuite.add(unitTestSuiteDev);
    }
    else {
        scrollbarsTestSuite.add(unitTestSuite);
    }

    Y.Test.Runner.add(scrollbarsTestSuite);


    /*
     * Utility functions
     */
    function getMockScrollbarNode(axis, size, duration) {
        var fcSize = 12,
            lcSize = 9,
            expected = {
                scrollbar: {
                    duration: duration,
                    transform: 'translate' + axis + '(0px)',
                    left: '0px',
                    top: '0px'
                },
                middleChild: {
                    duration: duration,
                    transform: 'scale' + axis + '(' + (size - fcSize - lcSize) + ')',
                    width: '9px'
                },
                lastChild: {
                    duration: duration,
                    transform: 'translate' + axis + '(' + (size - lcSize) + 'px)'
                }
            };

        return {
            expected: expected,
            transition: function () {
                // To be populated/replaced later with some assertions
            },
            getData: function () {
                return {
                    mc: getScrollbarChildNodeMock(expected.middleChild),
                    lc: getScrollbarChildNodeMock(expected.lastChild),
                    fcSize: fcSize,
                    lcSize: lcSize
                };
            }
        };
    }

    function getScrollbarChildNodeMock(expected) {
        return {
            transition: function (transform) {
                if (nativeTransitions) {
                    Y.Assert.areEqual(expected.duration, transform.duration);
                    Y.Assert.areEqual(expected.transform, transform.transform);
                }
                else {
                    Y.Assert.areEqual(expected.duration, transform.duration);
                    Y.Assert.areEqual(expected.width, transform.width);
                }
            }
        };
    }

}, null, {requires: ['test', 'node-event-simulate', 'scrollview', 'scrollview-test-utils']});
