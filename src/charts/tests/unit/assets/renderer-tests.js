YUI.add('renderer-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: Renderer"),
        DOC = Y.config.doc,

    RendererTests = new Y.Test.Case({
        name: "Renderer Tests",
       
        setUp: function() {
            var BaseRenderer = Y.Base.create("baseRenderer", Y.Base, [Y.Renderer]);
            this.renderer = new BaseRenderer();
        },

        tearDown: function() {
            this.renderer.destroy();
            Y.Event.purgeElement(DOC, false);
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
