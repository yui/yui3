YUI.add('attribute-getset-tests', function(Y) {

    var suite = new Y.Test.Suite('attribute-getset example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example Tests',

        BUFFER : 5,

        x : Y.one("#x"),

        y : Y.one("#y"),

        color : Y.one("#color"),

        setX : Y.one("#setX button[type=submit]"),

        setY : Y.one("#setY button[type=submit]"),

        setColor : Y.one("#setColor button[type=submit]"),

        setXY : Y.one("#setXY"),

        setAll : Y.one("#setAll"),

        getAll : Y.one("#getAll"),

        container : Y.one("#boxParent"),

        box : Y.one("#boxParent .yui3-box"),

        getBounds : function() {

            var parentRegion = this.container.get("region");

            return [
                [Math.round(parentRegion.left + this.BUFFER), Math.round(parentRegion.right - this.box.get("offsetWidth") - this.BUFFER)],
                [Math.round(parentRegion.top + this.BUFFER), Math.round(parentRegion.bottom - this.box.get("offsetHeight") - this.BUFFER)]
            ];

        },

        random : function(min, max) {
            var range = max - min; 
            return Math.floor(min + (Math.random() * range));
        },

        'Initial State' : function() {
            var boxRegion = this.box.get("region");
            var containerRegion = this.container.get("region");

            Y.Assert.areEqual(this.BUFFER, boxRegion.top - containerRegion.top, "Box top not aligned");
            Y.Assert.areEqual(this.BUFFER, boxRegion.left - containerRegion.left, "Box left not aligned");

            Y.Assert.areEqual(boxRegion.left, parseInt(this.x.get("value"), 10));
            Y.Assert.areEqual(boxRegion.top, parseInt(this.y.get("value"), 10));
            Y.Assert.areEqual("#808000", this.color.get("value"));
        },

        'set X in bounds' : function() {
            var xy = this.getBounds();
            var xValue = this.random(xy[0][0], xy[0][1]);

            this.x.set("value", xValue);
            this.setX.simulate("click");

            var region = this.box.get("region");

            Y.Assert.areEqual(xValue, region.left);
        },

        'set X out of bounds' : function() {
            var xy = this.getBounds();
            var xValue = xy[0][1] + this.random(10, 2000); // some random range above the max

            this.x.set("value", xValue);
            this.setX.simulate("click");

            var region = this.box.get("region");

            Y.Assert.areEqual(region.left, xy[0][1]);

            xValue = xy[0][0] - this.random(10, 2000); // some random range below the min

            this.x.set("value", xValue);
            this.setX.simulate("click");

            region = this.box.get("region");

            Y.Assert.areEqual(region.left, xy[0][0]);
        },

        'set Y in bounds' : function() {
            var xy = this.getBounds();
            var yValue = this.random(xy[1][0], xy[1][1]);

            this.y.set("value", yValue);
            this.setY.simulate("click");

            var region = this.box.get("region");

            Y.Assert.areEqual(yValue, region.top);
        },

        'set Y out of bounds' : function() {
            var xy = this.getBounds();
            var yValue = xy[1][1] + this.random(10, 2000);

            this.y.set("value", yValue);
            this.setY.simulate("click");

            var region = this.box.get("region");

            Y.Assert.areEqual(region.top, xy[1][1]);

            yValue = xy[1][0] - this.random(10, 2000);

            this.y.set("value", yValue);
            this.setY.simulate("click");

            region = this.box.get("region");

            Y.Assert.areEqual(region.top, xy[1][0]);
        },

        'set XY in bounds' : function() {
            var xy = this.getBounds();

            var xValue = this.random(xy[0][0], xy[0][1]);
            var yValue = this.random(xy[1][0], xy[1][1]);

            this.x.set("value", xValue);
            this.y.set("value", yValue);

            this.setXY.simulate("click");

            var region = this.box.get("region");

            Y.Assert.areEqual(xValue, region.left);
            Y.Assert.areEqual(yValue, region.top);
        },

        'set XY out of bounds' : function() {
            var xy = this.getBounds();

            var xValue = xy[0][1] + this.random(10, 2000);
            var yValue = xy[1][1] + this.random(10, 2000);

            this.x.set("value", xValue);
            this.y.set("value", yValue);

            this.setXY.simulate("click");

            var region = this.box.get("region");

            Y.Assert.areEqual(region.left, xy[0][1]);
            Y.Assert.areEqual(region.top, xy[1][1]);

            xValue = xy[0][0] - this.random(10, 2000);
            yValue = xy[1][0] - this.random(10, 2000);

            this.x.set("value", xValue);
            this.y.set("value", yValue);

            this.setXY.simulate("click");

            region = this.box.get("region");

            Y.Assert.areEqual(region.left, xy[0][0]);
            Y.Assert.areEqual(region.top, xy[1][0]);
        },

        'set valid colors' : function() {
            this.color.set("value", "red");
            this.setColor.simulate("click");

            // To normalize the fact that IE removes spaces in between rgb values.
            var red = /rgb\(255,\s?0,\s?0\)/;
            var green = /rgb\(0,\s?255,\s?0\)/;

            Y.Assert.isTrue(red.test(this.box.getComputedStyle("backgroundColor")));

            this.color.set("value", "#00ff00");
            this.setColor.simulate("click");

            Y.Assert.isTrue(green.test(this.box.getComputedStyle("backgroundColor")));
        },

        'set invalid color' : function() {
            var prevVal = this.box.getComputedStyle("backgroundColor");

            this.color.set("value", "#00ff00ff");
            this.setColor.simulate("click");

            Y.Assert.areEqual(prevVal, this.box.getComputedStyle("backgroundColor"));
        },

        'set all' : function() {
            var xy = this.getBounds();

            var xValue = this.random(xy[0][0], xy[0][1]);
            var yValue = this.random(xy[1][0], xy[1][1]);
            var red = /rgb\(255,\s?0,\s?0\)/;            

            this.x.set("value", xValue);
            this.y.set("value", yValue);
            this.color.set("value", "red");

            this.setAll.simulate("click");

            region = this.box.get("region");

            Y.Assert.isTrue(red.test(this.box.getComputedStyle("backgroundColor")));
            Y.Assert.areEqual(xValue, region.left);
            Y.Assert.areEqual(yValue, region.top);
        },

        'get all' : function() {

            var xy = this.getBounds();

            var xValue = xy[0][1] + this.random(10, 2000);
            var yValue = xy[1][1] + this.random(10, 2000);

            var red = "#FF0000";

            this.x.set("value", xValue);
            this.y.set("value", yValue);
            this.color.set("value", "red");

            this.setAll.simulate("click");
            this.getAll.simulate("click");

            // Normalized through getters/setters
            Y.Assert.areEqual(red, this.color.get("value"));
            Y.Assert.areEqual(xy[0][1], parseInt(this.x.get("value"), 10));
            Y.Assert.areEqual(xy[1][1], parseInt(this.y.get("value"), 10));

        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
