YUI.add('widget-build-tests', function(Y) {

    // NOTE: This test suite has some funky floor/round, < 1 checks to work around the FF, subpixel getXY/setXY behavior.
    // In general, this level of testing should be captured at the unit test level anyway. The idea here is to make sure 
    // the examples have a certain degree of visual fidelity.

    var suite = new Y.Test.Suite('widget-build example test suite'),
        TIMEOUT = 10000;

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        content : Y.one("#content"),

        setHTML : Y.one("#setHTML"),

        section : Y.one("#section"),

        x : Y.one("#x"),

        y : Y.one("#y"),

        move : Y.one("#move"),

        run : Y.one("#run"),

        widgetOneForm : Y.one("#widget1-example"),

        widgetTwoForm : Y.one("#widget2-example"),

        widgetThreeForm : Y.one("#widget3-example"),

        clickFormSubmit : function(form) {

            // In non-IE browsers, clicking the submit will peform the default action,
            // of submitting the form. In IE, we need to do both
            form.one("button[type=submit]").simulate("click");

            if (Y.UA.ie && Y.UA.ie < 9) {
                form.simulate("submit");
            }
        },

        isCentered : function(nodeOneRegion, nodeTwo, message) {
            var nodeTwoRegion = nodeTwo.get("region");

            Y.Assert.isTrue(nodeOneRegion.left + Math.floor(nodeOneRegion.width/2) - nodeTwo.get("offsetWidth")/2 - nodeTwoRegion.left < 1, message);
            Y.Assert.isTrue(nodeOneRegion.top + Math.floor(nodeOneRegion.height/2) - nodeTwo.get("offsetHeight")/2 - nodeTwoRegion.top < 1, message);
        },

        checkWidgetOneInitialRender : function() {
            var widget1 = Y.one(".yui3-standardmodule");

            Y.Assert.areEqual("Module Header", widget1.one(".yui3-standardmodule-content .yui3-widget-hd").get("text"));
            Y.Assert.areEqual("Module Body", widget1.one(".yui3-standardmodule-content .yui3-widget-bd").get("text"));
            Y.Assert.areEqual("Module Footer", widget1.one(".yui3-standardmodule-content .yui3-widget-ft").get("text"));

            Y.Assert.areEqual("12em", widget1.getStyle("height"));
            Y.Assert.areEqual("12em", widget1.getStyle("width"));

            Y.Assert.areEqual("static", widget1.getComputedStyle("position"));
        },

        checkWidgetTwoInitialRender : function() {
            var widget2 = Y.one(".yui3-positionable");

            Y.Assert.areEqual("Positionable Widget", widget2.one(".yui3-positionable-content").get("text"));

            Y.Assert.isNull(widget2.one(".yui3-widget-hd"));
            Y.Assert.isNull(widget2.one(".yui3-widget-bd"));
            Y.Assert.isNull(widget2.one(".yui3-widget-ft"));

            Y.Assert.areEqual("absolute", widget2.getComputedStyle("position"));
            Y.Assert.areEqual("1", widget2.getComputedStyle("zIndex"));
            Y.Assert.areEqual("10em", widget2.getStyle("width"));

            var xy = Y.one("#widget2-example > p").getXY();
            var widget2XY = widget2.getXY();

            Y.Assert.areEqual(Math.round(xy[0]), Math.round(widget2XY[0]));
            Y.Assert.areEqual(Math.round(xy[1]), Math.round(widget2XY[1]));

            Y.Assert.areEqual(""+Math.round(xy[0]), this.x.get("value"));
            Y.Assert.areEqual(""+Math.round(xy[1]), this.y.get("value"));
        },

        checkWidgetThreeInitialRender : function() {
            var widget3 = Y.one(".yui3-alignable");

            Y.Assert.areEqual("Alignable Widget", widget3.one(".yui3-alignable-content strong").get("text"));

            var alignmentInfo = widget3.all(".yui3-alignable-content div p");

            Y.Assert.areEqual("#widget3-example", alignmentInfo.item(0).get("text"));
            Y.Assert.areEqual("[center, center]", alignmentInfo.item(1).get("text"));

            Y.Assert.isNull(widget3.one(".yui3-widget-hd"));
            Y.Assert.isNull(widget3.one(".yui3-widget-bd"));
            Y.Assert.isNull(widget3.one(".yui3-widget-ft"));

            Y.Assert.areEqual("absolute", widget3.getComputedStyle("position"));
            Y.Assert.areEqual("1", widget3.getComputedStyle("zIndex"));
            Y.Assert.areEqual("14em", widget3.getStyle("width"));

            this.isCentered(Y.one("#widget3-example").get("region"), widget3, "#widget3-example, [center, center] failed");

            // Hacky because we don't get the exact same values in FF (subpixel issues) from the DOM. Assuming widget-position unit tests
            // check specifics. The idea here is to test the approx example visual
        },

        'test initial render' : function() {

            var test = this,

                condition = function() {
                    return Y.one("#widget1-example .yui3-standardmodule") !== null &&
                        Y.one("#widget2-example .yui3-positionable") !== null &&
                        Y.one("#widget3-example .yui3-alignable") !== null;
                },

                success = function() {
                    var widget1 = Y.one(".yui3-standardmodule"),
                        widget2 = Y.one(".yui3-positionable"),
                        widget3 = Y.one(".yui3-alignable");

                    test.checkWidgetOneInitialRender();
                    test.checkWidgetTwoInitialRender();
                    test.checkWidgetThreeInitialRender();
                },

                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + TIMEOUT + "ms.");
                };

            test.poll(condition, 100, TIMEOUT, success, failure);
        },

        'test widget1 set content' : function() {
            var widget1 = Y.one(".yui3-standardmodule");

            this.content.set("value", "Foo");
            this.section.set("selectedIndex", 0);

            this.clickFormSubmit(this.widgetOneForm);

            Y.Assert.areEqual("Foo", widget1.one(".yui3-standardmodule-content .yui3-widget-hd").get("text"));

            this.content.set("value", "Bar");
            this.section.set("selectedIndex", 1);

            this.clickFormSubmit(this.widgetOneForm);

            Y.Assert.areEqual("Bar", widget1.one(".yui3-standardmodule-content .yui3-widget-bd").get("text"));

            this.content.set("value", "FooBar");
            this.section.set("selectedIndex", 2);

            this.clickFormSubmit(this.widgetOneForm);

            Y.Assert.areEqual("FooBar", widget1.one(".yui3-standardmodule-content .yui3-widget-ft").get("text"));
        },

        'test widget2 position' : function() {
            var widget2 = Y.one(".yui3-positionable"),
                currentXY = widget2.getXY(),
                newXY;

            this.x.set("value", Math.round(currentXY[0]) + 10);
            this.y.set("value", Math.round(currentXY[1]) + 20);

            this.clickFormSubmit(this.widgetTwoForm);

            newXY = widget2.getXY();

            Y.Assert.isTrue(Math.round(currentXY[0]) + 10 - newXY[0] < 1);
            Y.Assert.isTrue(Math.round(currentXY[1]) + 20 - newXY[1] < 1);

            this.x.set("value", 0);
            this.y.set("value", 0);

            this.clickFormSubmit(this.widgetTwoForm);

            newXY = widget2.getXY();

            Y.Assert.isTrue((newXY[0] - 0) < 1);
            Y.Assert.isTrue((newXY[1] - 0) < 1);
        },

        'test widget 3 align' : function() {
            var test = this,
                currAlignment = Y.one("#alignment"),
                widget3 = Y.Node.one(".yui3-alignable"),
                container = Y.Node.one("#widget3-example");

                stepDelay = 2500,

                steps = [
                    function() {
                        test.resume(function() {

                            //alignable.set("align", {node:"#widget3-example", points:["lc", "rc"]});
                            //currAlignment.set("innerHTML", "<p>#widget3-example</p><p>[left-center, right-center]</p>");

                            var out = currAlignment.all("p"),
                                widgetRegion = widget3.get("region"),
                                alignRegion = container.get("region");

                            Y.Assert.areEqual("#widget3-example", out.item(0).get("text"));
                            Y.Assert.areEqual("[left-center, right-center]", out.item(1).get("text"));

                            Y.Assert.isTrue(Math.abs(alignRegion.right - widgetRegion.left) < 1, "widget3-example, lc, rc failed on lr");
                            Y.Assert.isTrue((widgetRegion.top + Math.floor(widgetRegion.height/2)) - (alignRegion.top + Math.floor(alignRegion.height/2)) < 1, "widget3-example, lc, rc failed on cc");

                            test.wait();
                        });
                    },
                    function() {
                        test.resume(function() {

                            //alignable.set("align", {node:"#widget3-example", points:["tr", "br"]});
                            //currAlignment.set("innerHTML", "<p>#widget3-example</p><p>[top-right, bottom-right]</p>");

                            var out = currAlignment.all("p"),
                                widgetRegion = widget3.get("region"),
                                alignRegion = container.get("region");

                            Y.Assert.areEqual("#widget3-example", out.item(0).get("text"));
                            Y.Assert.areEqual("[top-right, bottom-right]", out.item(1).get("text"));

                            Y.Assert.isTrue(Math.abs(alignRegion.right - widgetRegion.right) < 1, "widget3-example, tr, br failed on rr");
                            Y.Assert.isTrue(Math.abs(widgetRegion.top - alignRegion.bottom) < 1, "widget3-example, tr, br failed on tb");

                            test.wait();
                        });
                    },
                    function() {
                        test.resume(function() {

                            //alignable.set("centered", "#widget3-example");
                            //currAlignment.set("innerHTML", "<p>#widget3-example</p><p>centered</p>");

                            var out = currAlignment.all("p"),
                                alignRegion = container.get("region");

                            Y.Assert.areEqual("#widget3-example", out.item(0).get("text"));
                            Y.Assert.areEqual("centered", out.item(1).get("text"));

                            test.isCentered(alignRegion, widget3, "#widget3-example, centered failed");

                            test.wait();
                        });

                    },
                    function() {
                        test.resume(function() {

                            //alignable.set("align", {points:["rc", "rc"]});
                            //currAlignment.set("innerHTML", "<p>viewport</p><p>[right-center, right-center]</p>");

                            var out = currAlignment.all("p"),
                                widgetRegion = widget3.get("region"),
                                alignRegion = widget3.get("viewportRegion");

                            Y.Assert.areEqual("viewport", out.item(0).get("text"));
                            Y.Assert.areEqual("[right-center, right-center]", out.item(1).get("text"));

                            Y.Assert.isTrue(Math.abs(alignRegion.right - widgetRegion.right) < 1, "viewport, rc, rc failed on rr");
                            Y.Assert.isTrue((widgetRegion.top + Math.floor(widgetRegion.height/2)) - (alignRegion.top + Math.floor(alignRegion.height/2)) < 1, "viewport, rc, rc failed on cc");

                            test.wait();
                        });
                    },
                    function() {
                        test.resume(function() {

                            //alignable.set("centered", true);
                            //currAlignment.set("innerHTML", "<p>viewport</p><p>centered</p>");

                            var out = currAlignment.all("p");

                            Y.Assert.areEqual("viewport", out.item(0).get("text"));
                            Y.Assert.areEqual("centered", out.item(1).get("text"));

                            test.isCentered(widget3.get("viewportRegion"), widget3, "viewport, centered failed");

                            test.wait();
                        });
                    },
                    function() {
                        test.resume(function() {

                            //alignable.set("align", {node:"#widget3-example", points:["cc", "cc"]});
                            //currAlignment.set("innerHTML", "<p>#widget3-example</p><p>[center, center]</p>");

                            var out = currAlignment.all("p"),
                                alignRegion = container.get("region");

                            Y.Assert.areEqual("#widget3-example", out.item(0).get("text"));
                            Y.Assert.areEqual("[center, center]", out.item(1).get("text"));

                           test.isCentered(alignRegion, widget3, "#widget3-example, [center, center] failed"); 
                        });
                    }
                ],

                q = new Y.AsyncQueue();

            for (var i = 0; i < steps.length; i++) {
                q.add({
                    timeout: (i === 0) ? 500 : stepDelay,
                    fn:steps[i]
                });
            }

            this.run.simulate("click");

            q.run();

            test.wait();
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['async-queue', 'node', 'node-event-simulate']})