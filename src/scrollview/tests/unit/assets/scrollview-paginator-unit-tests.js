YUI.add('scrollview-paginator-unit-tests', function (Y, NAME) {

    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 5000,
        suite = new Y.Test.Suite({name:"Scrollview: Paginator"}),
        simulateMousewheel = Y.simulateMousewheel;

    suite.add(new Y.Test.Case({
        name: "API Tests",
        _should: {
            ignore: {
                // Ignore PhantomJS because of lack of gesture simulation support/issues
                //"Move x should advance 1 page right": (Y.UA.phantomjs),
                //"Move left on X should snap back": (Y.UA.phantomjs),
                //"optimizeMemory should hide nodes not near the viewport" : (Y.UA.phantomjs || Y.UA.ie),
                //"Disabled scrollviews should not advance page index on flick" : (Y.UA.phantomjs),

                // TODO: Fix for IE (#2533100)
                "Dual axis should allow scrolling on both X & Y axes" : (Y.UA.ie),

                // Mousewheel emulation is currently only supported in Chrome
                "mousewheel down should move the SV down" : (Y.UA.phantomjs || Y.UA.ie || Y.UA.gecko || Y.UA.android)
            }
        },

        //---------------------------------------------
        // Setup and tear down
        //---------------------------------------------

        setUp : function () {
            // empty
        },

        tearDown : function () {
            // this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        //---------------------------------------------
        // Instantiation
        //---------------------------------------------

        "Ensure rendering & initial state are correct": function() {
            var scrollview = renderNewScrollview('x'),
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
        },

        "sv.next() should advance to the next page" : function () {
            var Test = this,
                sv = renderNewScrollview('x');

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
                sv = renderNewScrollview('x', 9),
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
                sv = renderNewScrollview('y', 2);

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
                sv = renderNewScrollview('y'),
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
                sv = renderNewScrollview('y');

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
                sv = renderNewScrollview('y');

            sv.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(5, sv.pages.get('index'));
                    Y.Assert.areEqual(500, sv.get('scrollY'));
                });
            });

            sv.pages.scrollToIndex(5);

            Test.wait(WAIT);
        },


        /*
        The default anim duration is 300ms so this test is designed to
        check that the duration can be changed
        */
        "scrollToIndex should animate with a longer anim duration": function () {
            var Test = this,
                sv = renderNewScrollview('y'),
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
                scrollview = renderNewScrollview('x');

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
                scrollview = renderNewScrollview('x'),
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
                scrollview = renderNewScrollview('x', 0, true),
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
                        Test.wait(1000);
                    }
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    xdist: -100
                },
                duration: DURATION
            });

            Test.wait(1000);
        },

        "mousewheel down should move the SV down": function () {

            var Test = this,
                scrollview = renderNewScrollview('y');

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
                scrollview = renderNewScrollview('xy'),
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
                scrollview = renderNewScrollview('x');

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

        /*
            Additional tests:
            - gestures
            - next() past total
            - lazyload
            - Forced axis vs auto-detection
            - Make sure scrollEnd only fires once
        */

    }));

    Y.Test.Runner.add(suite);

    function renderNewScrollview (axis, startIndex, optimizeMemory) {

        var config = {},
            guid = Y.guid(),
            html,
            scrollview,
            widgetClass,
            axis;

        config.srcNode = '#' + guid;

        if (axis === 'y') {
            config.height = "100px";
            widgetClass = 'vertical';
            pAxis = axis;
        }
        else if (axis === 'x') {
            config.width = "300px";
            widgetClass = 'horizontal';
            pAxis = axis;
        }
        else if (axis === 'xy') {
            config.height = "100px";
            config.width = "300px";
            widgetClass = 'horizontal';
            config.axis = 'xy';
            pAxis = 'x';
        }

        config.plugins = [{
            fn:Y.Plugin.ScrollViewPaginator,
            cfg:{
                index: startIndex || 0,
                _optimizeMemory: optimizeMemory || false,
                axis: pAxis,
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