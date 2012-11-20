YUI.add('widget-tooltip-tests', function(Y) {
    
    var suite = new Y.Test.Suite('widget-tooltip example test suite'),
        TIMEOUT = 10000;

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        tt1 : Y.one("#tt1"),

        tt2 : Y.one("#tt2"),

        tt3 : Y.one("#tt3"),

        tt4 : Y.one("#tt4"),

        prevent : Y.one("#prevent"),

        pageToClientXY : function(trigger, xOffset, yOffset) {
            var triggerXY = trigger.getXY(),
                x = triggerXY[0] + xOffset,
                y = triggerXY[1] + yOffset,
                doc = Y.one("document");

            return [x - doc.get("scrollLeft"), y - doc.get("scrollTop")];
        },

        assertTooltipVisible : function(tooltip) {
            Y.Assert.isFalse(tooltip.hasClass("yui3-tooltip-hidden"), "Tooltip still has hidden class");
            Y.Assert.areEqual("visible", tooltip.getComputedStyle("visibility"), "Tooltip is not visible");
        },

        assertTooltipHidden : function(tooltip) {
            Y.Assert.isTrue(tooltip.hasClass("yui3-tooltip-hidden"), "Tooltip does not have hidden class");
            Y.Assert.areEqual("hidden", tooltip.getComputedStyle("visibility"), "Tooltip is not hidden");
        },

        cleanupTooltip : function(trigger) {
            trigger.simulate("mouseout");
            this.wait(function() {
                Y.Assert.pass();
            }, 10);
        },

        'test initial render' : function() {

            var test = this,

                condition = function() {
                    return Y.one(".yui3-tooltip") !== null;
                },

                success = function() {
                    var tooltip = Y.one(".yui3-tooltip");

                    Y.Assert.isTrue(tooltip.hasClass("yui3-widget"));
                    Y.Assert.isTrue(tooltip.hasClass("yui3-widget-positioned"));
                    Y.Assert.isTrue(tooltip.hasClass("yui3-widget-stacked"));

                    Y.Assert.areEqual("2", tooltip.getComputedStyle("zIndex"));
                    Y.Assert.areEqual("absolute", tooltip.getComputedStyle("position"));
                    Y.Assert.areEqual("-10000px", tooltip.getComputedStyle("top"));
                    Y.Assert.areEqual("-10000px", tooltip.getComputedStyle("left"));
                    
                    test.assertTooltipHidden(tooltip);

                    Y.Assert.areEqual(0, tooltip.one(".yui3-tooltip-content").get("childNodes").size());
                },

                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + TIMEOUT + "ms.");
                };

            test.poll(condition, 100, TIMEOUT, success, failure);

        },

        'test mouseover tt1' : function() {
            var tooltip = Y.one(".yui3-tooltip"),
                test = this,
                trigger = this.tt1,
                clientXY = test.pageToClientXY(trigger, 5, 5),
                title = trigger.get("title");

            trigger.simulate("mouseover", {
                clientX: clientXY[0],
                clientY: clientXY[1]
            });

            test.wait(function() {

                Y.Assert.areEqual(title, tooltip.one(".yui3-tooltip-content").get("text"));
                Y.Assert.areEqual("", trigger.get("title"));

                test.assertTooltipVisible(tooltip);

                test.cleanupTooltip(trigger);

            }, 250); // wait for showDelay
        },

        'test mouseover, mouseout tt1' : function() {

            var tooltip = Y.one(".yui3-tooltip"),
                test = this,
                trigger = this.tt1,
                clientXY = test.pageToClientXY(trigger, 40, 5),
                title = trigger.get("title");

            trigger.simulate("mouseover", {
                clientX: clientXY[0],
                clientY: clientXY[1]
            });

            test.wait(function() {

                Y.Assert.areEqual(title, tooltip.one(".yui3-tooltip-content").get("text"));
                Y.Assert.areEqual("", trigger.get("title"));

                test.assertTooltipVisible(tooltip);

                trigger.simulate("mouseout");

                test.wait(function() {
                    test.assertTooltipHidden(tooltip);
                    Y.Assert.areEqual("Tooltip 1", trigger.get("title"));
                }, 10); // wait for hideDelay

            }, 250); // wait for showDelay
        },

        'test tt1 autoHideDelay' : function() {
            var tooltip = Y.one(".yui3-tooltip"),
                test = this,
                trigger = this.tt1,
                clientXY = test.pageToClientXY(trigger, 5, 5),
                title = trigger.get("title");

            trigger.simulate("mouseover", {
                clientX: clientXY[0],
                clientY: clientXY[1]
            });

            test.wait(function() {

                Y.Assert.areEqual(title, tooltip.one(".yui3-tooltip-content").get("text"));
                Y.Assert.areEqual("", trigger.get("title"));

                test.assertTooltipVisible(tooltip);

                test.wait(function() {

                    test.assertTooltipHidden(tooltip);
                    test.cleanupTooltip(trigger);

                }, 2000); // autoHideDelay

            }, 250); // wait for showDelay
        },

        'test mouseover tt2' : function() {
            
            var tooltip = Y.one(".yui3-tooltip"),
                test = this,
                trigger = this.tt2,
                clientXY = test.pageToClientXY(trigger, 5, 5),
                title = trigger.get("title");

            Y.Assert.areEqual("Tooltip 2", title);

            trigger.simulate("mouseover", {
                clientX: clientXY[0],
                clientY: clientXY[1]
            });

            Y.Assert.areEqual("Tooltip 2 (from triggerEvent)", tooltip.one(".yui3-tooltip-content").get("text"));

            test.wait(function() {
                test.assertTooltipVisible(tooltip);
                test.cleanupTooltip(trigger);
            }, 250); // wait for showDelay
        },

        'test mouseover tt1, mouseover tt2' : function() {
            var tooltip = Y.one(".yui3-tooltip"),
                test = this,

                trigger = this.tt1,
                trigger2 = this.tt2,

                clientXY = test.pageToClientXY(trigger, 40, 5),
                clientXY2 = test.pageToClientXY(trigger2, 10, 7),

                title = trigger.get("title");

            trigger.simulate("mouseover", {
                clientX: clientXY[0],
                clientY: clientXY[1]
            });

            test.wait(function() {

                Y.Assert.areEqual(title, tooltip.one(".yui3-tooltip-content").get("text"));
                Y.Assert.areEqual("", trigger.get("title"));

                test.assertTooltipVisible(tooltip);

                trigger.simulate("mouseout");

                trigger2.simulate("mouseover", {
                    clientX : clientXY2[0],
                    clientY : clientXY2[1] 
                });

                test.assertTooltipVisible(tooltip);

                Y.Assert.areEqual("Tooltip 2 (from triggerEvent)", tooltip.one(".yui3-tooltip-content").get("text"));

                test.cleanupTooltip(trigger2);

            }, 250); // wait for showDelay
        },

        'test mouseover tt3' : function() {
            
            var tooltip = Y.one(".yui3-tooltip"),
                test = this,
                trigger = this.tt3,
                clientXY = test.pageToClientXY(trigger, 5, 5),
                title = trigger.get("title");

            Y.Assert.areEqual("Tooltip 3", title);

            trigger.simulate("mouseover", {
                clientX: clientXY[0],
                clientY: clientXY[1]
            });

            Y.Assert.areEqual("Tooltip 3 (from lookup)", tooltip.one(".yui3-tooltip-content").get("text"));

            test.wait(function() {

                test.assertTooltipVisible(tooltip);
                test.cleanupTooltip(trigger);

            }, 250); // wait for showDelay
        },

        'test mouseover tt4' : function() {

            var tooltip = Y.one(".yui3-tooltip"),
                test = this,
                trigger = this.tt4,
                clientXY = test.pageToClientXY(trigger, 5, 5),
                title = trigger.get("title");

            trigger.simulate("mouseover", {
                clientX: clientXY[0],
                clientY: clientXY[1]
            });

            test.wait(function() {

                Y.Assert.areEqual(title, tooltip.one(".yui3-tooltip-content").get("text"));
                Y.Assert.areEqual("", trigger.get("title"));

                test.assertTooltipVisible(tooltip);
                test.cleanupTooltip(trigger);

            }, 250); // wait for showDelay
        },

        'test tt4 prevented' : function() {

            var tooltip = Y.one(".yui3-tooltip"),
                test = this,
                trigger = this.tt4,
                clientXY = test.pageToClientXY(trigger, 5, 5),
                title = trigger.get("title");

            this.prevent.set("checked", true);

            trigger.simulate("mouseover", {
                clientX: clientXY[0],
                clientY: clientXY[1]
            });

            test.assertTooltipHidden(tooltip);

            // Make sure we're still hidden after the showDelay
            test.wait(function() {

                Y.Assert.areEqual(title, tooltip.one(".yui3-tooltip-content").get("text"));
                Y.Assert.areEqual("", trigger.get("title"));

                test.assertTooltipHidden(tooltip);
                test.cleanupTooltip(trigger);

            }, 250); // wait for showDelay
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['node', 'node-event-simulate']})