YUI.add('renderer-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: Renderer"),

    RendererTests = new Y.Test.Case({
        name: "Renderer Tests",
       
        setUp: function() {
            var BaseRenderer = Y.Base.create("baseRenderer", Y.Base, [Y.Renderer]);
            this.renderer = new BaseRenderer();
        },

        tearDown: function() {
            this.renderer.destroy();
        },

        "test: _copyObject" : function() {
            var originalObject  = {
                    x: 5,
                    y: 6,
                    child: {
                        color: "#0ff",
                        grandChild: {
                            color: "#00f"   
                        }
                    }
                },
                newObject = this.renderer._copyObject(originalObject),
                key;
            Y.Assert.areEqual(originalObject.x, newObject.x, "The new object's x property should be " + originalObject.x + ".");
            Y.Assert.areEqual(originalObject.y, newObject.y, "The new object's y property should be " + originalObject.y + ".");
            Y.Assert.areEqual(
                originalObject.child.color,
                newObject.child.color,
                "The color property of the newObject's child property should be " + originalObject.child.color + "."
            );
            Y.Assert.areEqual(
                originalObject.child.grandChild.color,
                newObject.child.grandChild.color,
                "The color property of the newObject's child's grandChild property should be " + originalObject.child.grandChild.color + "."
            );
            newObject.x = 10;
            newObject.y = 15;
            newObject.child.color = "#9aa";
            newObject.child.grandChild.color = "#9aa";
            Y.Assert.areEqual(5, originalObject.x, "The originalObject's x property should still be 5.");
            Y.Assert.areEqual(6, originalObject.y, "The originalObject's y property should still be 6.");
            Y.Assert.areEqual("#0ff", originalObject.child.color, "The originalObject's child's color property should be #0ff.");
            Y.Assert.areEqual("#00f", originalObject.child.grandChild.color, "The originalObject's child's grandChild's color property should be #00f.");
        },

        testRenderer: function() {
            var renderer = this.renderer,
                defaultPadding = 5,
                open = 15,
                close = 20,
                high = 30,
                low = 5,
                complexName = "complex",
                styles,
                padding,
                complex;
            renderer.set("styles", {
                padding: {
                    left: defaultPadding,
                    top: defaultPadding,
                    right: defaultPadding,
                    bottom: defaultPadding
                },
                complex: {
                    type: complexName,
                    values: {
                        open: 15,
                        close: 20,
                        high: 30,
                        low: 5
                    }
                }
            });
            styles = renderer.get("styles");
            padding = styles.padding;
            complex = styles.complex;

            Y.Assert.areEqual(defaultPadding, padding.top, "The top padding should be " + defaultPadding + ".");
            Y.Assert.areEqual(defaultPadding, padding.right, "The right padding should be " + defaultPadding + ".");
            Y.Assert.areEqual(defaultPadding, padding.bottom, "The bottom padding should be " + defaultPadding + ".");
            Y.Assert.areEqual(defaultPadding, padding.left, "The left padding should be " + defaultPadding + ".");
            Y.Assert.areEqual(complexName, complex.type, "The value of styles.complex.type should be " + complexName + ".");
            Y.Assert.areEqual(open, complex.values.open, "The value of styles.complex.values.open should be " + open + ".");
            Y.Assert.areEqual(close, complex.values.close, "The value of styles.complex.values.close should be " + close + ".");
            Y.Assert.areEqual(high, complex.values.high, "The value of styles.complex.values.high should be " + high + ".");
            Y.Assert.areEqual(low, complex.values.low, "The value of styles.complex.values.low should be " + low + ".");
            renderer.set("styles", {
                padding: 0
            });
            renderer.set("styles", {
                padding: {
                    left: defaultPadding,
                    top: defaultPadding,
                    right: defaultPadding,
                    bottom: defaultPadding
                }
            });
            styles = renderer.get("styles");
            padding = styles.padding;
            Y.Assert.areEqual(defaultPadding, padding.top, "The top padding should be " + defaultPadding + ".");
            Y.Assert.areEqual(defaultPadding, padding.right, "The right padding should be " + defaultPadding + ".");
            Y.Assert.areEqual(defaultPadding, padding.bottom, "The bottom padding should be " + defaultPadding + ".");
            Y.Assert.areEqual(defaultPadding, padding.left, "The left padding should be " + defaultPadding + ".");
        }
        
    });

    suite.add(RendererTests);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-base', 'test']});
