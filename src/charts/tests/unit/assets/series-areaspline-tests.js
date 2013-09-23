YUI.add('series-areaspline-tests', function(Y) {
    var DOC = Y.config.doc,
        MockAreaSplineSeries = Y.Base.create("mockAreaSplineSeries", Y.AreaSplineSeries, [], {
            _areaSplineDrawn: false,

            drawAreaSpline: function() {
                this._areaSplineDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: AreaSplineSeries");
    Y.AreaSplineSeriesTest = function() {
        Y.AreaSplineSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.AreaSplineSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.AreaSplineSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockAreaSplineSeries = new MockAreaSplineSeries();
            series.drawSeries.apply(mockAreaSplineSeries);
            Y.Assert.isTrue(mockAreaSplineSeries._areaSplineDrawn, "The drawAreaSpline method should have been called.");     
        }
    });
    
    suite.add(new Y.AreaSplineSeriesTest({
        name: "AreaSplineSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-areaspline', 'chart-test-template']});
