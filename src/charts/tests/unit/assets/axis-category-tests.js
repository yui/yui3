YUI.add('axis-category-tests', function(Y) {
    Y.CategoryAxisTest = function() {
        Y.CategoryAxisTest.superclass.constructor.apply(this, arguments);
    }
    Y.extend(Y.CategoryAxisTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.axis = new Y.CategoryAxis({
                dataProvider: this.dataProvider,
                keys: this.dataKeys,
                position: this.position   
            });
        },

        tearDown: function() {
            this.axis = null;
        },
        
        "test: getMajorUnitDistance()" : function() {
            var position = this.position,
                vertical = position === "left" || position === "right",
                size = vertical ? "height" : "width",
                length = 400,
                distance = length/8;
            this.axis.set("length", length);
            this.axis.set("styles", {
                majorUnit: {
                    count: 8
                }
            });
            Y.Assert.areEqual(
                distance, 
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit),
                "The getMajorUnitDistance method should return " + distance + "."
            ); 
            this.axis.set("styles", {
                majorUnit: {
                    determinant: "distance",
                    distance: distance
                }
            });
            Y.Assert.areEqual(
                distance, 
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit),
                "The getMajorUnitDistance method should return " + distance + "."
            );
            this.axis.set("styles", {
                majorUnit: {
                    determinant: "random"   
                }
            });
            Y.Assert.isUndefined(
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit), 
                "An invalid majorUnit.determinant should result in the getMajorUnitDistance method returning undefined."
            );
        },

        "test: getMinimumValue()" : function() {
            var axis = this.axis,
                data = axis.get("data"),
                testLabel = data[0];
            Y.Assert.areEqual(testLabel, axis.getMinimumValue(), "The getMinimumValue method should return " + testLabel + ".");
        },

        "test: getMaximumValue()" : function() {
            var axis = this.axis,
                data = axis.get("data"),
                len = data.length,
                testLabel = data[len - 1];
            Y.Assert.areEqual(testLabel, axis.getMaximumValue(), "The getMaximumValue method should return " + testLabel + ".");
        },

        "test: _getLabelByIndex()" : function() {
            var axis = this.axis,
                index = 5,
                data = axis.get("data"),
                len = data.length,
                testLabel,
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal";
           
            if(direction && direction == "vertical")
            {
                testLabel = data[len - (index + 1)];
            }
            else
            {
                testLabel = data[index];
            }
            
            Y.Assert.areEqual(testLabel, axis._getLabelByIndex(index, len, direction), "The label's value should be " + testLabel + ".");
        },

        "test: get(labels)" : function() {
            var axis = this.axis,
                labels,
                i,
                len,
                label,
                date,
                mydiv = Y.Node.create('<div style="width: 400px; height: 400px;">'),
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal";
                
            Y.one('body').append(mydiv);
            axis.render(mydiv);
            labels = axis.get("labels");
            //category labels on a vertical axis are reversed
            if(direction === "vertical") {
                labels.reverse();
            }
            len = plainOldDataProvider.length;
            for(i = 0; i < len; i = i + 1) {
                label = labels[i];
                date = plainOldDataProvider[i].date;
                Y.Assert.areEqual(date, label.innerHTML, "The label should be equal to " + date + ".");
            }
            axis.destroy(true);
            mydiv.destroy(true);
        }
    });
    
    var suite = new Y.Test.Suite("Charts: CategoryAxis"),
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
    suite.add(new Y.CategoryAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "left",
        name: "CategoryAxis Tests"
    }));

    suite.add(new Y.CategoryAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "top",
        name: "CategoryAxis Tests"
    }));

    suite.add(new Y.CategoryAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "right",
        name: "CategoryAxis Tests"
    }));

    suite.add(new Y.CategoryAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "bottom",
        name: "CategoryAxis Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-category', 'chart-test-template']});
