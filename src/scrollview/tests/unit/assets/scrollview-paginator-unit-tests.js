YUI.add('scrollview-paginator-unit-tests', function (Y, NAME) {

    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 5000,
        simulateMousewheel = Y.simulateMousewheel, /* Only supported in Chrome */
        paginatorTestSuite = new Y.Test.Suite({name:"Scrollview Paginator Tests"}),
        unitTestSuite = new Y.Test.Suite({name:"Unit Tests"}),
        unitTestSuiteDev = new Y.Test.Suite({name:"Tests In Development"}),
        functionalTestSuite = new Y.Test.Suite({name:"Functional Tests"});

    unitTestSuite.add(new Y.Test.Case({
        name: "Lifecycle",

        setUp : function () { /* empty */ },
        tearDown : function () { Y.one('#container').empty(true); },

        "Ensure rendering & initial state are correct": function() {
            var scrollview = renderNewScrollview('x', 'x'),
                bb = scrollview.get('boundingBox'),
                cb = scrollview.get('contentBox'),
                id = cb.get('id'),
                ul = cb.all('> ul'),
                li = cb.all('> ul > li');

            Y.Assert.isTrue(bb.hasClass('yui3-scrollview'), "BoundingBox does not contain class 'yui3-scrollview'");
            // @TODO:  False-positive. This is having issues in IE7, fix
            // Y.Assert.isTrue(bb.hasClass('yui3-scrollview-horiz'), "BoundingBox does not contain class 'yui3-scrollview-horiz'");
            Y.Assert.isTrue(bb.hasClass('yui3-scrollview-paged'), "BoundingBox does not contain class 'yui3-scrollview-paged'");
            Y.Assert.isTrue(cb.hasClass('yui3-scrollview-content'), "ContentBox does not contain class 'yui3-scrollview-content'");
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Public API",

        setUp : function () { /* empty */ },
        tearDown : function () { Y.one('#container').empty(true); },

        "sv.next() should advance to the next page" : function () {
            var Test = this,
                sv = renderNewScrollview('x', 'x');

            sv.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(300, sv.get('scrollX'));
                });
            });

            sv.pages.next();
            Test.wait(WAIT);
        },

        "sv.next() on last index should do nothing" : function () {
            var Test = this,
                sv = renderNewScrollview('x', undefined, 9),
                eventsFired = 0;

            sv.once('scrollEnd', function () {
                eventsFired++;
            });

            Y.later(500, this, function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, eventsFired);
                    Y.Assert.areEqual(2700, sv.get('scrollX'));
                });
            });

            sv.pages.next();

            Test.wait(WAIT);
        },

        "sv.prev() should advance to the previous page" : function () {
            var Test = this,
                sv = renderNewScrollview('y', 'y', 2);

            sv.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(100, sv.get('scrollY'));
                });
            });

            sv.pages.prev();

            Test.wait(WAIT);
        },

        "sv.prev() on index 0 should do nothing" : function () {
            var Test = this,
                sv = renderNewScrollview('y', 'y'),
                eventsFired = 0;

            sv.once('scrollEnd', function () {
                eventsFired++;
            });

            Y.later(500, this, function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, eventsFired);
                    Y.Assert.areEqual(0, sv.get('scrollY'));
                });
            });

            sv.pages.prev();

            Test.wait(WAIT);
        },

        "scrollTo (deprecated) should animate to the specified index" : function () {
            var Test = this,
                sv = renderNewScrollview('y', 'y');

            sv.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(5, sv.pages.get('index'));
                    Y.Assert.areEqual(500, sv.get('scrollY'));
                });
            });

            sv.pages.scrollTo(5);

            Test.wait(WAIT);
        },

        "scrollToIndex should animate to the specified index" : function () {
            var Test = this,
                sv = renderNewScrollview('y', 'y');

            sv.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(5, sv.pages.get('index'));
                    Y.Assert.areEqual(500, sv.get('scrollY'));
                });
            });

            sv.pages.scrollToIndex(5);

            Test.wait(WAIT);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - indexChange on X paginator",

        setUp : function () {
            this.scrollview = renderNewScrollview('xy', 'x');
            this.mockEvent = new Y.Test.Mock();
            this.mockEvent.newVal = 3;
            this.mockEvent.src = 'ui';
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Changing the index on a dual axis instance with X pagination will update the host's _maxScrollY" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            paginator._afterIndexChange(mockEvent);
            Y.Assert.areEqual(2700, scrollview._maxScrollX);
            Y.Assert.areEqual(0, scrollview.get('scrollX'));
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - indexChange on Y paginator",

        setUp : function () {
            this.scrollview = renderNewScrollview('xy', 'y');
            this.mockEvent = new Y.Test.Mock();
            this.mockEvent.newVal = 3;
            this.mockEvent.src = 'ui';
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Changing the index on a dual axis instance with Y pagination will update the host's _maxScrollY" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            paginator._afterIndexChange(mockEvent);
            Y.Assert.areEqual(100, scrollview._maxScrollY);
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - flick",

        setUp : function () {
            this.scrollview = renderNewScrollview('x', 'x');
            this.mockEvent = new Y.Test.Mock();
            this.mockEvent.flick = {velocity: '-1', axis:'x'};
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Flicks on disabled widgets do nothing" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            scrollview.set('disabled', true);
            response = paginator._beforeHostFlick(mockEvent);
            Y.Assert.isFalse(response);
        },

        "Flicks when out of bounds should be prevented" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            scrollview.set('scrollX', -1000);
            response = paginator._beforeHostFlick(mockEvent);
            Y.Assert.isInstanceOf(Y.Do.Prevent, response);
        },

        "Flick right should advance the page" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            scrollview._gesture = true;

            response = paginator._beforeHostFlick(mockEvent);
            Y.Assert.areEqual(1, paginator.get('index'));
            Y.Assert.isInstanceOf(Y.Do.Prevent, response);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - mousewheel",

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Mousewheel on x instances should do nothing" : function ( ) {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x', 'x'),
                paginator = scrollview.pages,
                Mock = Y.Test.Mock,
                eventMock = new Mock(),
                response;

            eventMock.wheelDelta = -1;
            eventMock.target = scrollview.get('contentBox').one('li');

            response = paginator._beforeHostMousewheel(eventMock);

            Y.Assert.isUndefined(response);
            Y.Assert.areEqual(0, paginator.get('index'));
        },

        "Up mousewheels on y instances should" : function ( ) {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('y', 'y', 2),
                paginator = scrollview.pages,
                Mock = Y.Test.Mock,
                eventMock = new Mock(),
                response;

            eventMock.wheelDelta = 1;
            eventMock.target = scrollview.get('contentBox').one('li');

            Mock.expect(eventMock, {
                method: 'preventDefault',
                args: []
            });

            response = paginator._beforeHostMousewheel(eventMock);

            Y.Assert.isInstanceOf(Y.Do.Prevent, response);
            Mock.verify(eventMock);
            Y.Assert.areEqual(1, paginator.get('index'));
        },

        "Down mousewheels on y instances should" : function ( ) {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('y', 'y'),
                paginator = scrollview.pages,
                Mock = Y.Test.Mock,
                eventMock = new Mock(),
                response;

            eventMock.wheelDelta = -1;
            eventMock.target = scrollview.get('contentBox').one('li');

            Mock.expect(eventMock, {
                method: 'preventDefault',
                args: []
            });

            response = paginator._beforeHostMousewheel(eventMock);

            Y.Assert.isInstanceOf(Y.Do.Prevent, response);
            Mock.verify(eventMock);
            Y.Assert.areEqual(1, paginator.get('index'));
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture",

        setUp : function () {
            this.scrollview = renderNewScrollview('x', 'x');
            this.mockEvent = new Y.Test.Mock();
            this.mockEvent.flick = {velocity: '-1', axis:'x'};
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Large forward drags should advance to the next page" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            scrollview._gesture = {axis:'x', deltaX: 100000};

            response = paginator._afterHostGestureMoveEnd(mockEvent);
            Y.Assert.areEqual(1, paginator.get('index'));
        },

        "Short forward drags should snap back" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            scrollview._gesture = {axis:'x', deltaX: 1};

            response = paginator._afterHostGestureMoveEnd(mockEvent);
            Y.Assert.areEqual(0, paginator.get('index'));
        },

        "Large backward drags should advance to the previous page" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            paginator.set('index', 1);

            scrollview._gesture = {axis:'x', deltaX: -100000};

            response = paginator._afterHostGestureMoveEnd(mockEvent);
            Y.Assert.areEqual(0, paginator.get('index'));
        },

        "Short backward drags should snap back" : function () {
            var Test = this,
                scrollview = this.scrollview,
                paginator = scrollview.pages,
                mockEvent = this.mockEvent,
                response;

            paginator.set('index', 1);
            scrollview._gesture = {axis:'x', deltaX: -1};

            response = paginator._afterHostGestureMoveEnd(mockEvent);
            Y.Assert.areEqual(1, paginator.get('index'));
        }

    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - scrollTo",

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        '_beforeHostScrollTo without a gesture should return the input args' : function () {
            var scrollview = this.scrollview = renderNewScrollview('x', 'x'),
                args = [2 /*x*/, 2  /*y*/, undefined, undefined, undefined],
                response = scrollview.pages._beforeHostScrollTo.apply(scrollview.pages, args);

            Y.ArrayAssert.itemsAreSame(args, response.newArgs);
        },

        '_beforeHostScrollTo on an x-axis should null the y-value' : function () {
            var scrollview = this.scrollview = renderNewScrollview('x', 'x'),
                response;

            scrollview._gesture = { axis: 'x' };
            response = scrollview.pages._beforeHostScrollTo(2 /*x*/, 2  /*y*/);
            Y.Assert.isNull(response.newArgs[1]);
        },

        '_beforeHostScrollTo on an y-axis should null a y-value' : function () {
            var scrollview = this.scrollview = renderNewScrollview('y', 'y'),
                response;

            scrollview._gesture = { axis: 'y' };
            response = scrollview.pages._beforeHostScrollTo(2 /*x*/, 2  /*y*/);
            Y.Assert.isNull(response.newArgs[0]);
        },

        "Gestures against the grain should select the index page's node to transition" : function () {
            var scrollview = this.scrollview = renderNewScrollview('y', 'y'),
                paginator = this.scrollview.pages,
                response;

            scrollview._gesture = { axis: 'x' };
            response = scrollview.pages._beforeHostScrollTo(2 /*x*/, 2  /*y*/);
            Y.Assert.isNotNull(response.newArgs[4]);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "optimizeMemory",

        setUp : function () {
            this.scrollview = renderNewScrollview(undefined, undefined, 0, true);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        'Optimized instances should hide nodes outside the buffer' : function () {
            var scrollview = this.scrollview,
                paginator = scrollview.pages,
                stage, pageNodes;

            pageNodes = paginator._getPageNodes();
            pageNodes.each(function (node, i) {
                if (i < 2) {
                    Y.Assert.isFalse(node.hasClass('yui3-scrollview-hidden'));
                }
                else {
                    Y.Assert.isTrue(node.hasClass('yui3-scrollview-hidden'));
                }
            });
        }
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
                scrollview = renderNewScrollview('x', undefined, 0, true),
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

    /** To aid development */
    console.log(unitTestSuiteDev.items);
    if (unitTestSuiteDev.items.length > 0) {
        paginatorTestSuite.add(unitTestSuiteDev);
    }
    else {
        paginatorTestSuite.add(unitTestSuite);
        paginatorTestSuite.add(functionalTestSuite);
    }

    Y.Test.Runner.add(paginatorTestSuite);

    /*
        Additional test ideas:
        - gestures
        - next() past total
        - lazyload
        - Forced axis vs auto-detection
        - Make sure scrollEnd only fires once
    */

    function renderNewScrollview (scrollViewAxis, paginatorAxis, startIndex, optimizeMemory) {

        var config = {},
            guid = Y.guid(),
            html,
            scrollview,
            widgetClass;

        config.srcNode = '#' + guid;
        config.axis = scrollViewAxis;

        switch(scrollViewAxis) {
            case 'x':
                config.width = "300px";
                widgetClass = 'horizontal';
                break;
            case 'y':
                config.height = "100px";
                widgetClass = 'vertical';
                break;
            case 'xy':
            default:
                config.height = "100px";
                config.width = "300px";
                widgetClass = 'horizontal';
                break;
        }

        config.plugins = [{
            fn:Y.Plugin.ScrollViewPaginator,
            cfg:{
                index: startIndex || 0,
                _optimizeMemory: optimizeMemory || false,
                axis: paginatorAxis,
                selector:">ul>li"
            }
        }];
        html = "<div class='" + widgetClass + "'><div id='" + guid + "'><ul><li>a</li><li>b</li><li>c</li><li>e</li><li>f</li><li>g</li><li>h</li><li>i</li><li>j</li><li>k</li></ul></div></div>",
        Y.one('#container').append(html);

        scrollview = new Y.ScrollView(config);
        scrollview.render();

        return scrollview;
    }

}, null, {requires: ['test', 'node-event-simulate', 'scrollview-base', 'scrollview-paginator', 'scrollview-mousewheel-simulate']});
