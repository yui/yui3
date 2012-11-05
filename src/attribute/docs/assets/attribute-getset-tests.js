YUI.add('attribute-getset-tests', function(Y) {

    var suite = new Y.Test.Suite('attribute-getset example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example Tests',

        BUFFER : 5,

        x : Y.one("#x"),

        y : Y.one("#y"),

        color : Y.one("#color"),

        setXY : Y.one("#setXY"),

        setAll : Y.one("#setAll"),

        getAll : Y.one("#getAll"),

        container : Y.one("#boxParent"),

        box : Y.one("#boxParent .yui3-box"),

        xForm : Y.one("#setX"),

        yForm : Y.one("#setY"),

        colorForm : Y.one("#setColor"),

        clickFormSubmit : function(form) {

            // In non-IE browsers, clicking the submit will peform the default action,
            // of submitting the form. In IE, we need to do both
            form.one("button[type=submit]").simulate("click");

            if (Y.UA.ie && Y.UA.ie < 9) {
                form.simulate("submit");
            }
        },

        getBounds : function() {

            var parentRegion = this.container.get("region"),
                boxRegion = this.box.get("region"),
                boxWidth = boxRegion.right - boxRegion.left,
                boxHeight = boxRegion.bottom - boxRegion.top;

            return [
                [Math.ceil(parentRegion.left + this.BUFFER), Math.floor(parentRegion.right - boxWidth - this.BUFFER)],
                [Math.ceil(parentRegion.top + this.BUFFER), Math.floor(parentRegion.bottom - boxHeight - this.BUFFER)]
            ];

        },

        random : function(min, max) {
            var range = max - min; 
            return Math.floor(min + (Math.random() * range));
        },

        assertPixelsAreEqual : function(posExpected, posActual, msg) {
   //         Y.Assert.areEqual(posExpected, posActual, msg);
            Y.Assert.isTrue(this.closeEnough(posExpected, posActual), "The position should be " + posExpected + " instead of " + posActual + ".");
        },

        'Initial State' : function() {
            var boxRegion = this.box.get("region"),
                containerRegion = this.container.get("region"),

                originalTop = boxRegion.top - containerRegion.top,
                originalLeft = boxRegion.left - containerRegion.left;

            this.assertPixelsAreEqual(this.BUFFER, originalTop, "Box top not aligned");
            this.assertPixelsAreEqual(this.BUFFER, originalLeft, "Box left not aligned");

            Y.Assert.areEqual(Math.ceil(boxRegion.left), parseInt(this.x.get("value"), 10)); // ceil, to account for sub-pixel logic in constraints
            Y.Assert.areEqual(Math.ceil(boxRegion.top), parseInt(this.y.get("value"), 10)); // ceil, to account for sub-pixel logic in constraints

            Y.Assert.areEqual("#808000", this.color.get("value"));
        },

        'set X in bounds' : function() {
            var xy = this.getBounds(),
                region,
                xValue = this.random(xy[0][0], xy[0][1]);

            this.x.set("value", xValue);

            this.clickFormSubmit(this.xForm);

            region = this.box.get("region");

            this.assertPixelsAreEqual(xValue, region.left);
        },

        'set X out of bounds' : function() {
            var xy = this.getBounds(),
                region,
                xValue = xy[0][1] + this.random(10, 2000); // some random range above the max

            this.x.set("value", xValue);

            this.clickFormSubmit(this.xForm);

            region = this.box.get("region");

            this.assertPixelsAreEqual(region.left, xy[0][1]);

            xValue = xy[0][0] - this.random(10, 2000); // some random range below the min

            this.x.set("value", xValue);
            this.clickFormSubmit(this.xForm);

            region = this.box.get("region");

            this.assertPixelsAreEqual(region.left, xy[0][0]);
        },

        'set Y in bounds' : function() {
            var xy = this.getBounds(),
                region,
                yValue = this.random(xy[1][0], xy[1][1]);

            this.y.set("value", yValue);
            this.clickFormSubmit(this.yForm);

            region = this.box.get("region");

            this.assertPixelsAreEqual(yValue, region.top);
        },

        'set Y out of bounds' : function() {

            var xy = this.getBounds(),
                region,
                yValue = xy[1][1] + this.random(10, 2000);

            this.y.set("value", yValue);
            this.clickFormSubmit(this.yForm);

            region = this.box.get("region");

            this.assertPixelsAreEqual(region.top, xy[1][1]);

            yValue = xy[1][0] - this.random(10, 2000);

            this.y.set("value", yValue);
            this.clickFormSubmit(this.yForm);

            region = this.box.get("region");

            this.assertPixelsAreEqual(region.top, xy[1][0]);
        },

        'set XY in bounds' : function() {
            var xy = this.getBounds(),
                region,
                xValue = this.random(xy[0][0], xy[0][1]),
                yValue = this.random(xy[1][0], xy[1][1]);

            this.x.set("value", xValue);
            this.y.set("value", yValue);

            this.setXY.simulate("click");

            region = this.box.get("region");

            this.assertPixelsAreEqual(xValue, region.left);
            this.assertPixelsAreEqual(yValue, region.top);
        },

        'set XY out of bounds' : function() {
            var xy = this.getBounds(),
                region,
                xValue = xy[0][1] + this.random(10, 2000),
                yValue = xy[1][1] + this.random(10, 2000);

            this.x.set("value", xValue);
            this.y.set("value", yValue);

            this.setXY.simulate("click");

            region = this.box.get("region");

            this.assertPixelsAreEqual(region.left, xy[0][1]);
            this.assertPixelsAreEqual(region.top, xy[1][1]);

            xValue = xy[0][0] - this.random(10, 2000);
            yValue = xy[1][0] - this.random(10, 2000);

            this.x.set("value", xValue);
            this.y.set("value", yValue);

            this.setXY.simulate("click");

            region = this.box.get("region");

            this.assertPixelsAreEqual(region.left, xy[0][0]);
            this.assertPixelsAreEqual(region.top, xy[1][0]);
        },

        'set valid colors' : function() {
            this.color.set("value", "red");
            this.clickFormSubmit(this.colorForm);

            // To normalize the fact that IE removes spaces in between rgb values.
            var red = /rgb\(255,\s?0,\s?0\)/;
            var green = /rgb\(0,\s?255,\s?0\)/;

            Y.Assert.isTrue(red.test(this.box.getComputedStyle("backgroundColor")));

            this.color.set("value", "#00ff00");
            this.clickFormSubmit(this.colorForm);

            Y.Assert.isTrue(green.test(this.box.getComputedStyle("backgroundColor")));
        },

        'set invalid color' : function() {
            var prevVal = this.box.getComputedStyle("backgroundColor");

            this.color.set("value", "#00ff00ff");
            this.clickFormSubmit(this.colorForm);

            Y.Assert.areEqual(prevVal, this.box.getComputedStyle("backgroundColor"));
        },

        'set all' : function() {
            var xy = this.getBounds(),
                region,
                xValue = this.random(xy[0][0], xy[0][1]),
                yValue = this.random(xy[1][0], xy[1][1]),
                red = /rgb\(255,\s?0,\s?0\)/;            

            this.x.set("value", xValue);
            this.y.set("value", yValue);
            this.color.set("value", "red");

            this.setAll.simulate("click");

            region = this.box.get("region");

            Y.Assert.isTrue(red.test(this.box.getComputedStyle("backgroundColor")));

            this.assertPixelsAreEqual(xValue, region.left);
            this.assertPixelsAreEqual(yValue, region.top);
        },

        'get all' : function() {

            var xy = this.getBounds(),
                xValue = xy[0][1] + this.random(10, 2000),
                yValue = xy[1][1] + this.random(10, 2000),
                red = "#FF0000";

            this.x.set("value", xValue);
            this.y.set("value", yValue);
            this.color.set("value", "red");

            this.setAll.simulate("click");
            this.getAll.simulate("click");

            // Normalized through getters/setters
            Y.Assert.areEqual(red, this.color.get("value"));

            this.assertPixelsAreEqual(xy[0][1], parseInt(this.x.get("value"), 10));
            this.assertPixelsAreEqual(xy[1][1], parseInt(this.y.get("value"), 10));

        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
