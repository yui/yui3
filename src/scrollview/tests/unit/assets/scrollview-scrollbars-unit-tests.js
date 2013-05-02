YUI.add('scrollview-scrollbars-unit-tests', function (Y, NAME) {

    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 2000,
        LONG_WAIT = 4000,
        simulateMousewheel = Y.simulateMousewheel, /* Only supported in Chrome */
        scrollbarsTestSuite = new Y.Test.Suite({name:"Scrollview: Scrollbars"}),
        unitTestSuite = new Y.Test.Suite({name:"Unit Tests"}),
        unitTestSuiteDev = new Y.Test.Suite({name:"Tests In Development"}),
        renderNewScrollview = Y.renderNewScrollview,
        getTransform = Y.getTransform;

    unitTestSuite.add(new Y.Test.Case({
        name: "API Tests",

        //---------------------------------------------
        // Setup and tear down
        //---------------------------------------------

        setUp : function () {
            // Empty
        },

        tearDown : function () {
            // Firefox & phantom.js complain
            if (Y.UA.gecko || Y.UA.phantomjs) {
                this.scrollview.destroy();
            }
            Y.one('#container').empty(true);
        },

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

            Test.wait();
        },

        "Ensure offset is correct for horiz ScrollView": function() {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = scrollview._maxScrollX,
                bars = scrollview.scrollbars.get('horizontalNode'),
                widgetWidth = scrollview.get('width').replace('px', ''),
                barsWidth = 30, // @TODO don't hardcode
                matrix = [];

            this.scrollview = scrollview;

            scrollview.once('scrollEnd', function(){
                Test.resume(function () {
                    transform = getTransform(bars);
                    Y.Assert.areEqual(widgetWidth - barsWidth, transform.x);
                });
            });

            scrollview.scrollTo(distance, 0, 500); // args = x, y, duration, easing

            Test.wait();
        },

        "Ensure offset is correct for vert ScrollView": function() {
            var Test = this,
                scrollview = renderNewScrollview('y'),
                distance = scrollview._maxScrollY,
                bars = scrollview.scrollbars.get('verticalNode'),
                widgetHeight = scrollview.get('height').replace('px', ''),
                barsHeight = bars.get('scrollHeight'),
                matrix = [];

            this.scrollview = scrollview;

            scrollview.once('scrollEnd', function(){
                Test.resume(function () {
                    transform = getTransform(bars);
                    Y.Assert.areEqual(widgetHeight - barsHeight, transform.y);
                });
            });

            scrollview.scrollTo(0, distance, 500); // args = x, y, duration, easing

            Test.wait();
        }

    }));

    /** To aid development */
    if (unitTestSuiteDev.items.length > 0) {
        scrollbarsTestSuite.add(unitTestSuiteDev);
    }
    else {
        scrollbarsTestSuite.add(unitTestSuite);
    }

    Y.Test.Runner.add(scrollbarsTestSuite);

}, null, {requires: ['test', 'node-event-simulate', 'scrollview', 'scrollview-test-utils']});
