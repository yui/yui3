YUI.add('axis-time-tests', function(Y) {
    Y.TimeAxisTest = function() {
        Y.TimeAxisTest.superclass.constructor.apply(this, arguments);
    }
    Y.extend(Y.TimeAxisTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.axis = new Y.TimeAxis({
                dataProvider: this.dataProvider,
                keys: this.dataKeys,
                position: this.position   
            });
        },

        tearDown: function() {
            this.axis = null;
        },

        "test: _getLabelByIndex()" : function() {
            var axis = this.axis,
                min = axis.get("minimum"),
                max = axis.get("maximum"),
                index = 5,
                len = 11,
                testLabel,
                increm = ((max - min)/(len - 1)) * index,
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal";
            if(direction === "vertical") {
                testLabel = max - increm;
            } else {
                testLabel = min + increm;
            }
            
            Y.Assert.areEqual(testLabel, axis._getLabelByIndex(index, len, direction), "The label's value should be " + testLabel + ".");
        }
    });
    
    var suite = new Y.Test.Suite("Charts: TimeAxis"),
        plainOldDataProvider = [
            {date: "01/01/2009", open: 90.27, close: 170.27},
            {date: "01/02/2009", open: 91.55, close: 8.55},
            {date: "01/03/2009", open: 337.55, close: 400.55},
            {date: "01/04/2009", open: 220.27, close: 205.27},
            {date: "01/05/2009", open: 276.72, close: 239.72},
            {date: "01/06/2009", open: 85.27, close: 167.27},
            {date: "01/07/2009", open: 180.29, close: 179.29},
            {date: "01/08/2009", open: 216.21, close: 133.21},
            {date: "01/09/2009", open: 292.35, close: 304.35},
            {date: "01/10/2009", open: 80.23, close: 30.23},
            {date: "01/11/2009", open: 60.42, close: 97.42},
            {date: "01/12/2009", open: 303.55, close: 265.55},
            {date: "01/13/2009", open: 47.48, close: 71.48},
            {date: "01/14/2009", open: 327.64, close: 256.64},
            {date: "01/15/2009", open: 124.13, close: 61.13},
            {date: "01/16/2009", open: 58.21, close: 106.21},
            {date: "01/17/2009", open: 85.55, close: 151.55},
            {date: "01/18/2009", open: 277.76, close: 268.76},
            {date: "01/19/2009", open: 263.3, close: 270.3},
            {date: "01/20/2009", open: 196.88, close: 147.88},
            {date: "01/21/2009", open: 198.91, close: 211.91},
            {date: "01/22/2009", open: 229.28, close: 176.28}
        ];
    suite.add(new Y.TimeAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "left",
        name: "TimeAxis Tests"
    }));

    suite.add(new Y.TimeAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "top",
        name: "TimeAxis Tests"
    }));

    suite.add(new Y.TimeAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "right",
        name: "TimeAxis Tests"
    }));

    suite.add(new Y.TimeAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "bottom",
        name: "TimeAxis Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-time', 'chart-test-template']});
