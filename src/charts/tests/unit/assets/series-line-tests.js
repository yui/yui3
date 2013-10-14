YUI.add('series-line-tests', function(Y) {
    var DOC = Y.config.doc,
        MockLineSeries = Y.Base.create("mockLineSeries", Y.LineSeries, [], {
            _linesDrawn: false,

            drawLines: function() {
                this._linesDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: LineSeries");
    Y.LineSeriesTest = function() {
        Y.LineSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.LineSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.LineSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockLineSeries = new MockLineSeries();
            series.drawSeries.apply(mockLineSeries);
            Y.Assert.isTrue(mockLineSeries._linesDrawn, "The drawLines method should have been called.");     
        },

        "test: _setStyles()" : function() {
            var series = this.series,
                testStyles1 = {
                    weight: 1,
                    color: "#f00",
                    alpha: 1
                },
                testStyles2 = {
                    weight: 2,
                    color: "#00f",
                    alpha: 0.5
                },
                key,
                setStyles;
            series.set("styles", {
                line: testStyles1
            });
            setStyles = series.get("styles").line;
            for(key in testStyles1) {
                if(testStyles1.hasOwnProperty(key)) {
                    Y.Assert.isTrue(setStyles.hasOwnProperty(key), "The line property of the styles attribute should contain a value for " + key + ".");
                    Y.Assert.areEqual(testStyles1[key], setStyles[key], "The " + key + " property of the styles attribute should equal " + testStyles1[key] + ".");
                }
            }
            series.set("styles", testStyles2);
            setStyles = series.get("styles").line;
            for(key in testStyles2) {
                if(testStyles2.hasOwnProperty(key)) {
                    Y.Assert.isTrue(setStyles.hasOwnProperty(key), "The line property of the styles attribute should contain a value for " + key + ".");
                    Y.Assert.areEqual(testStyles2[key], setStyles[key], "The " + key + " property of the styles attribute should equal " + testStyles2[key] + ".");
                }
            }
        }
    });
    
    suite.add(new Y.LineSeriesTest({
        name: "LineSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-line', 'chart-test-template']});
