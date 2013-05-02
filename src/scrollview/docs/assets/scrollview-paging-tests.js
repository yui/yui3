YUI.add('scrollview-paging-tests', function(Y) {

    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 5000,
        suite = new Y.Test.Suite('scrollview-paging test suite');

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        setUp : function () {
            this.li = Y.one('#scrollview-content li');
            this.container = Y.one('#scrollview');
            this.content = Y.one('#scrollview-content');
        },

        tearDown : function () { },


        'Clicking next should advance the page' : function () {
            var Test = this,
                container = this.container,
                content = this.content,
                expected = -328;

            Y.one('#scrollview-next').simulate('click');

            Y.later(1000, this, function () {
                Test.resume(function () {
                    var transform = getTransform(content);

                    if (transform.x == expected) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail("X offset should be " + expected + ", but got " + transform.x);
                    }
                });
            }, 3000);

            Test.wait();
        }

        /* This should be possible to test, but simulating a flick doesn't scroll the widget. Issue in gestureSimulate or paginator-plugin? */
        /*'Flick should snap scrollview to page #2' : function () {
            var Test = this,
                container = this.container,
                content = this.content,
                expected = -656;

            container.simulateGesture('flick', {
                distance: -1000,
                axis: 'x'
            });

            Test.wait(function () {
                var transform = getTransform(content);

                if (transform.x == expected) {
                    Y.Assert.pass();
                }
                else {
                    Y.Assert.fail();
                }
            }, 3000);
        }*/
    }));



    /**
     * The following tests would qualify as functional tests and should
     * probably be moved into a different (non-CI) directory.
     * They currently pass, so leaving here until better coverage can
     * be obtained in the -unit- tests (above).
     */
    functionalTestSuite.add(new Y.Test.Case({
        name: "Scrolling",
        _should: {
            ignore: {
                // Ignore PhantomJS because of lack of gesture simulation support/issues
                "Move x should advance 1 page right": (Y.UA.phantomjs || (Y.UA.ie >= 10)),
                "Move left on X should snap back": (Y.UA.phantomjs || (Y.UA.ie >= 10)),
                "optimizeMemory should hide nodes not near the viewport" : (Y.UA.phantomjs || (Y.UA.ie >= 9)),
                "Disabled scrollviews should not advance page index on flick" : (Y.UA.phantomjs || (Y.UA.ie >= 10)),

                // TODO: Fix for IE (#2533100)
                "Dual axis should allow scrolling on both X & Y axes" : (Y.UA.ie),

                // Mousewheel emulation is currently only supported in Chrome
                "mousewheel down should move the SV down" : (Y.UA.phantomjs || Y.UA.ie || Y.UA.gecko || Y.UA.android)
            }
        },

        setUp : function () { /* empty */ },
        tearDown : function () { Y.one('#container').empty(true); },

        /*
         * The default anim duration is 300ms so this test is designed to
         * check that the duration can be changed
         */
        "scrollToIndex should animate with a longer anim duration": function () {
            var Test = this,
                sv = renderNewScrollview('y', 'y'),
                startTime = Y.Lang.now();

            sv.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.isTrue(Y.Lang.now() - startTime > 1000, 'Animation took less time than expected');
                });
            });

            sv.pages.scrollToIndex(5, 1500);
            Test.wait(WAIT);
        },

        "Move x should advance 1 page right": function() {

            var Test = this,
                scrollview = renderNewScrollview('x', 'x');

            scrollview.once('scrollEnd', function(){
                Test.resume(function(){
                    Y.Assert.areEqual(1, scrollview.pages.get('index'));
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                    Y.Assert.areEqual(300, scrollview.get('scrollX'));
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    xdist: -500
                },
                duration: DURATION
            });

            Test.wait(WAIT);
        },

        "Move left on X should snap back": function() {

            var Test = this,
                scrollview = renderNewScrollview('x', 'x'),
                distance = 100;

            scrollview.once('scrollEnd', function(){
                Test.resume(function(){
                    Y.Assert.areEqual(0, scrollview.pages.get('index'));
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    xdist: distance
                },
                duration: SLOW_DURATION
            });

            Test.wait(WAIT);
        },

        "optimizeMemory should hide nodes not near the viewport": function() {

            var Test = this,
                scrollview = renderNewScrollview('x', null, 0, true),
                distance = 100;

            scrollview.on('scrollEnd', function(){
                Test.resume(function(){
                    var index = scrollview.pages.get('index'),
                        total = scrollview.pages.get('total'),
                        pageNodes = scrollview.pages._getPageNodes();

                    if (node = pageNodes.item(index-3)) { Y.Assert.isTrue(node.hasClass('yui3-scrollview-hidden')); }
                    if (node = pageNodes.item(index-2)) { Y.Assert.isFalse(node.hasClass('yui3-scrollview-hidden')); }
                    if (node = pageNodes.item(index-1)) { Y.Assert.isFalse(node.hasClass('yui3-scrollview-hidden')); }
                    if (node = pageNodes.item(index))   { Y.Assert.isFalse(node.hasClass('yui3-scrollview-hidden')); }
                    if (node = pageNodes.item(index+1)) { Y.Assert.isTrue(node.hasClass('yui3-scrollview-hidden')); }

                    if (index+1 < total) {
                        scrollview.get('contentBox').simulateGesture('move', {
                            path: {
                                xdist: -100
                            },
                            duration: DURATION
                        });
                        Test.wait(WAIT);
                    }
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    xdist: -100
                },
                duration: DURATION
            });

            Test.wait(WAIT);
        },

        "mousewheel down should move the SV down": function () {

            var Test = this,
                scrollview = renderNewScrollview('y', 'y');

            scrollview.once('scrollEnd', function(){
                Test.resume(function(){
                    Y.Assert.areEqual(1, scrollview.pages.get('index'));
                });
            });

            Y.later(100, null, function () {
                simulateMousewheel(Y.one("#container li"), true);
            });

            Test.wait(WAIT);
        },

        "Dual axis should allow scrolling on both X & Y axes": function () {
            var Test = this,
                scrollview = renderNewScrollview('xy', 'x'),
                scrollToX = 300,
                scrollToY = 20;

            scrollview.once('scrollEnd', function(){

                Test.resume(function(){
                    Y.Assert.areEqual(1, scrollview.pages.get('index'));
                    Y.Assert.areEqual(scrollToX, scrollview.get('scrollX'));

                    scrollview.once('scrollEnd', function(){
                        Test.resume(function(){
                            Y.Assert.areEqual(1, scrollview.pages.get('index'));
                            Y.Assert.areEqual(scrollToX, scrollview.get('scrollX'));
                            Y.Assert.areEqual(scrollToY, scrollview.get('scrollY'));
                        });
                    });

                    Y.later(100, null, function () {
                        scrollview.scrollTo(scrollToX, scrollToY, 200);
                    });

                    Test.wait(WAIT);

                });

            });

            Y.later(100, null, function () {
                scrollview.pages.set('index', 1);
            });

            Test.wait(WAIT);
        },

        "Disabled scrollviews should not advance page index on flick": function() {

            var Test = this,
                scrollview = renderNewScrollview('x', 'x');

            scrollview.set('disabled', true);

            Y.later('100', null, function(){
                Test.resume(function(){
                    scrollview.set('disabled', false);

                    scrollview.once('scrollEnd', function(){
                        Test.resume(function(){
                            Y.Assert.areEqual(1, scrollview.pages.get('index'));
                            Y.Assert.areEqual(0, scrollview.get('scrollY'));
                            Y.Assert.areEqual(300, scrollview.get('scrollX'));
                        });
                    });

                    Y.Assert.areEqual(0, scrollview.pages.get('index'));
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));

                    scrollview.get('contentBox').simulateGesture('move', {
                        path: {
                            xdist: -500
                        },
                        duration: DURATION
                    });

                    Test.wait(WAIT);
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    xdist: -500
                },
                duration: DURATION
            });

            Test.wait(WAIT);
        }
    }));






    function getTransform(node) {
        var transform = {x: null, y: null},
            matrix;

        if (Y.Transition.useNative) {
            matrix = node.getStyle('transform').replace('matrix(', '').replace(')', '').split(',');
            transform.x = matrix[4].trim();
            transform.y = matrix[5].trim();
        }
        else {
            transform.x = node.getStyle('left').replace('px', '');
            transform.y = node.getStyle('top').replace('px', '');
        }

        return transform;
    }

    Y.Test.Runner.add(suite);

}, '', {requires:['event-touch', 'node', 'node-event-simulate', 'transition']});
