YUI.add('series-area-tests', function(Y) {
    var DOC = Y.config.doc,
        MockAreaSeries = Y.Base.create("mockAreaSeries", Y.AreaSeries, [], {
            _getClosingPoints: function() {
                return [];
            },

            _fillDrawn: false,

            drawFill: function() {
                this._fillDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: AreaSeries");
    Y.AreaSeriesTest = function() {
        Y.AreaSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.AreaSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.AreaSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockAreaSeries = new MockAreaSeries();
            series.drawSeries.apply(mockAreaSeries);
            Y.Assert.isTrue(mockAreaSeries._fillDrawn, "The drawFill method should have been called.");     
        },

        "test: _setStyles()" : function() {
            var series = this.series,
                testStyles1 = {
                    color: "#f00",
                    alpha: 1
                },
                testStyles2 = {
                    color: "#00f",
                    alpha: 0.5
                },
                key,
                setStyles;
            series.set("styles", {
                area: testStyles1
            });
            setStyles = series.get("styles").area;
            for(key in testStyles1) {
                if(testStyles1.hasOwnProperty(key)) {
                    Y.Assert.isTrue(setStyles.hasOwnProperty(key), "The area property of the styles attribute should contain a value for " + key + ".");
                    Y.Assert.areEqual(testStyles1[key], setStyles[key], "The " + key + " property of the styles attribute should equal " + testStyles1[key] + ".");
                }
            }
            series.set("styles", testStyles2);
            setStyles = series.get("styles").area;
            for(key in testStyles2) {
                if(testStyles2.hasOwnProperty(key)) {
                    Y.Assert.isTrue(setStyles.hasOwnProperty(key), "The area property of the styles attribute should contain a value for " + key + ".");
                    Y.Assert.areEqual(testStyles2[key], setStyles[key], "The " + key + " property of the styles attribute should equal " + testStyles2[key] + ".");
                }
            }
        }
    });
    
    suite.add(new Y.AreaSeriesTest({
        name: "AreaSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-area', 'chart-test-template']});
