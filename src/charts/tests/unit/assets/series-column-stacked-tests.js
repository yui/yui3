YUI.add('series-column-stacked-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: StackedColumnSeries"),
        seriesTest = new Y.Test.Case({
        setUp: function() {
            this.series = new Y.StackedColumnSeries();
        },

        tearDown: function() {
            this.series = null;
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.StackedColumnSeries, this.series, "The series should be and instanceof StackedColumnSeries.");
            Y.Assert.areEqual("stackedColumn", this.series.get("type"), "The series type attribute should be stackedColumn.");
        }
    });
    suite.add(seriesTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-column-stacked']});
