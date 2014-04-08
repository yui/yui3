YUI.add('series-spline-tests', function(Y) {
    var DOC = Y.config.doc,
        MockSplineSeries = Y.Base.create("mockSplineSeries", Y.SplineSeries, [], {
            _splineDrawn: false,

            drawSpline: function() {
                this._splineDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: SplineSeries");
    Y.SplineSeriesTest = function() {
        Y.SplineSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.SplineSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.SplineSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockSplineSeries = new MockSplineSeries();
            series.drawSeries.apply(mockSplineSeries);
            Y.Assert.isTrue(mockSplineSeries._splineDrawn, "The drawSpline method should have been called.");     
        }
    });
    
    suite.add(new Y.SplineSeriesTest({
        name: "SplineSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-spline', 'chart-test-template']});
