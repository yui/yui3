YUI.add('series-combospline-stacked-tests', function(Y) {
    var DOC = Y.config.doc,
        MockStackedComboSplineSeries = Y.Base.create("mockStackedComboSplineSeries", Y.Base, [], {
            _splineDrawn: false,
            
            _fillDrawn: false,

            _markersDrawn: false,

            _showAreaFill: false,

            _showLines: false,

            _showMarkers: false,

            get: function(val) {
                return this["_" + val];
            },

            drawSpline: function() {
                this._splineDrawn = true;
            },

            drawStackedAreaSpline: function() {
                this._fillDrawn = true;
            },

            drawPlots: function() {
                this._markersDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: StackedComboSplineSeries");
    Y.StackedComboSplineSeriesTest = function() {
        Y.StackedComboSplineSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.StackedComboSplineSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.StackedComboSplineSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockStackedComboSplineSeries = new MockStackedComboSplineSeries();
            series.drawSeries.apply(mockStackedComboSplineSeries);
            Y.Assert.isFalse(mockStackedComboSplineSeries._splineDrawn, "The drawSpline method should not have been called.");     
            Y.Assert.isFalse(mockStackedComboSplineSeries._fillDrawn, "The drawFill method should not have been called.");     
            Y.Assert.isFalse(mockStackedComboSplineSeries._markersDrawn, "The drawMarkers method should not have been called.");     
            mockStackedComboSplineSeries._showLines = true;
            mockStackedComboSplineSeries._showAreaFill = true;
            mockStackedComboSplineSeries._showMarkers = true;
            series.drawSeries.apply(mockStackedComboSplineSeries);
            Y.Assert.isTrue(mockStackedComboSplineSeries._splineDrawn, "The drawSpline method should have been called.");     
            Y.Assert.isTrue(mockStackedComboSplineSeries._fillDrawn, "The drawFill method should have been called.");     
            Y.Assert.isTrue(mockStackedComboSplineSeries._markersDrawn, "The drawMarkers method should have been called.");     
        }
    });
    
    suite.add(new Y.StackedComboSplineSeriesTest({
        name: "StackedComboSplineSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-combospline-stacked', 'chart-test-template']});
