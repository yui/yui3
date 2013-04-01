YUI.add('series-combospline-tests', function(Y) {
    var MockComboSplineSeries = Y.Base.create("mockComboSplineSeries", Y.Base, [], {
            _splineDrawn: false,
            
            _areaSplineDrawn: false,

            _markersDrawn: false,

            _showAreaFill: false,

            _showLines: false,

            _showMarkers: false,


            _getClosingPoints: function() {
                return [true];
            },

            get: function(val) {
                return this["_" + val];
            },

            drawSpline: function() {
                this._splineDrawn = true;
            },

            drawAreaSpline: function() {
                this._areaSplineDrawn = true;
            },

            drawPlots: function() {
                this._markersDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: ComboSplineSeries");
    Y.ComboSplineSeriesTest = function() {
        Y.ComboSplineSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.ComboSplineSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.ComboSplineSeries();
        },

        tearDown: function() {
            this.series = null;
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockComboSplineSeries = new MockComboSplineSeries();
            series.drawSeries.apply(mockComboSplineSeries);
            Y.Assert.isFalse(mockComboSplineSeries._splineDrawn, "The drawSpline method should not have been called.");     
            Y.Assert.isFalse(mockComboSplineSeries._areaSplineDrawn, "The drawAreaSpline method should not have been called.");     
            Y.Assert.isFalse(mockComboSplineSeries._markersDrawn, "The drawMarkers method should not have been called.");     
            mockComboSplineSeries._showLines = true;
            mockComboSplineSeries._showAreaFill = true;
            mockComboSplineSeries._showMarkers = true;
            series.drawSeries.apply(mockComboSplineSeries);
            Y.Assert.isTrue(mockComboSplineSeries._splineDrawn, "The drawSpline method should have been called.");     
            Y.Assert.isTrue(mockComboSplineSeries._areaSplineDrawn, "The drawAreaSpline method should have been called.");     
            Y.Assert.isTrue(mockComboSplineSeries._markersDrawn, "The drawMarkers method should have been called.");     
        }
    });
    
    suite.add(new Y.ComboSplineSeriesTest({
        name: "ComboSplineSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-combospline', 'chart-test-template']});
