YUI.add('axis-category-base-tests', function(Y) {
    Y.CategoryAxisBaseTest = function() {
        Y.CategoryAxisBaseTest.superclass.constructor.apply(this, arguments);
        this.prepValues();
    };
    Y.extend(Y.CategoryAxisBaseTest, Y.ChartTestTemplate, {
        prepValues : function() {
            this.dataMaximum = this.dataProvider.length - 1;
            this.dataMinimum = 0;
            this.keys = ["date"];
        },

        setUp: function() {
            this.axis = new Y.CategoryAxisBase();
            this.axis.set("dataProvider", this.dataProvider);
        },

        tearDown: function() {
            this.axis = null;
            Y.Event.purgeElement(DOC, false);
        },


        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.CategoryAxisBase, this.axis, "The axis should be and instanceof CategoryAxisBase.");
            Y.Assert.areEqual("category", this.axis.get("type"), "The axis type attribute should be category.");
            Y.Assert.isNull(this.axis.getDataByKey("funkey"), "The returned value should be null.");
        },

        "test: _getDefaultStyles()" : function() {
           var defaultMajorUnit = {
                    determinant: "count",
                    count: 11,
                    distance: 75
               },
               axisStyles = this.axis._getDefaultStyles(),
               key,
               axisMajorUnit;
           Y.Assert.isTrue(axisStyles.hasOwnProperty("majorUnit"), "The axis styles should include a majorUnit property.");
           axisMajorUnit = axisStyles.majorUnit;
           for(key in defaultMajorUnit) {
                if(defaultMajorUnit.hasOwnProperty(key)) {
                    Y.Assert.isTrue(axisMajorUnit.hasOwnProperty(key), "The default axis styles.majorUnit should contain a " + key + " property.");
                    Y.Assert.areEqual(
                        defaultMajorUnit[key], 
                        axisMajorUnit[key], 
                        "The default axis styles.majorUnit." + key + " property should be equal to the defaultMajorUnit." + key + " property."
                    ); 
                }
           }
        },

        "test: set('dataProvider')" : function() {
            Y.Assert.areEqual(this.dataProvider, this.axis.get("dataProvider"), "The dataProvider attribute should equal the values it received.");  
        },

        "test: set('keys')" : function() {
            var i,
                len,
                axisKeys,
                dateDataByKey,
                dateKeyValue;
            this.axis.set("keys", this.keys);
            axisKeys = this.axis.get("keys");
            dateDataByKey = this.axis.getDataByKey("date");
            len = this.dataProvider.length;
            
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(this.dateValues[i], axisKeys.date[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(i, dateDataByKey[i], "The getDataByKey method should return the correct values.");
                dateKeyValue = this.axis.getKeyValueAt("date", i);
                Y.Assert.areEqual(
                    this.dateValues[i], 
                    dateKeyValue, 
                    'The axis.getKeyValueAt("date", ' + i + ') method should return a value of ' + this.dateValues[i] + '.'
                );
            }

            Y.Assert.isNaN(this.axis.getKeyValueAt("nonexistantkey", 4), "The axis.getKeyValueAt method should return NaN for a non-existant key.");
        },
        
        "test: addKey()" : function() {
            var i,
                len = this.dataProvider.length,
                axisKeys,
                dateDataByKey,
                dateKeyValue;
            this.axis.addKey("date");
            axisKeys = this.axis.get("keys");
            dateDataByKey = this.axis.getDataByKey("date");
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(this.dateValues[i], axisKeys.date[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(i, dateDataByKey[i], "The getDataByKey method should return the correct values.");
                dateKeyValue = this.axis.getKeyValueAt("date", i);
                Y.Assert.areEqual(
                    this.dateValues[i], 
                    dateKeyValue, 
                    'The axis.getKeyValueAt("date", ' + i + ') method should return a value of ' + this.dateValues[i] + '.'
                );
            }
        },

        "test: get('data')" : function() {
            var length,
                data;
            this.axis.set("keys", this.keys);
            data = this.axis.get("data");
            length = this.dateValues.length;
            Y.Assert.areEqual(length, data.length, "The length of the data attribute should be " + length + ".");
        },

        "test: get('maximum')" : function() {
            var maximum;
            this.axis.set("keys", this.keys);
            maximum = this.axis.get("maximum");
            Y.Assert.isFalse(this.axis._getSetMax(), "The _getSetMax method should return false.");
            Y.Assert.isTrue(maximum >= this.dataMaximum, "The value for the attribute dataMaximum (" + maximum + ") should be greater than or equal to " + this.dataMaximum + ".");
        },

        "test: get('minimum')" : function() {
            var minimum;
            this.axis.set("keys", this.keys);
            minimum = this.axis.get("minimum");
            Y.Assert.isFalse(this.axis._getSetMin(), "The _getSetMin method should return false.");
            Y.Assert.isTrue(minimum <= this.dataMinimum, "The value for the attribute dataMinimum (" + minimum + ") should be less than or equal to " + this.dataMinimum + ".");
        },

        "test: get('dataMaximum')" : function() {
            var dataMaximum;
            this.axis.set("keys", this.keys);
            dataMaximum = this.axis.get("dataMaximum");
            Y.Assert.isTrue(dataMaximum >= this.dataMaximum, "The value for the attribute dataMaximum (" + dataMaximum + ") should be greater than or equal to " + this.dataMaximum + ".");
        },

        "test: get('dataMinimum')" : function() {
            var dataMinimum;
            this.axis.set("keys", this.keys);
            dataMinimum = this.axis.get("dataMinimum");
            Y.Assert.isTrue(dataMinimum <= this.dataMinimum, "The value for the attribute dataMinimum (" + dataMinimum + ") should be less than or equal to " + this.dataMinimum + ".");
        },

        "test: getTotalMajorUnits()" : function() {
            var len = this.dataProvider.length; 
            this.axis.set("keys", this.keys);
            Y.Assert.areEqual(len, this.axis.getTotalMajorUnits(), "The getTotalMajorUnits method should return " + len + ".");
        },

        "test: set('maximum')" : function() {
            var setMaximum = this.setMaximum; 
            this.axis.set("keys", this.keys);
            this.axis.set("maximum", this.setMaximum);
            Y.Assert.areEqual(setMaximum, this.axis.get("maximum"), "The get max method should return " + this.setMaximum + ".");
            Y.Assert.isTrue(this.axis._getSetMax(), "The _getSetMax method should return true.");
        },

        "test: set('minimum')" : function() {
            var setMinimum = this.setMinimum;
            this.axis.set("keys", this.keys);
            this.axis.set("minimum", this.setMinimum);
            Y.Assert.areEqual(setMinimum, this.axis.get("minimum"), "The get min method should return " + this.setMinimum + ".");
            Y.Assert.isTrue(this.axis._getSetMin(), "The _getSetMin method should return true.");
        },

        "test: set('maximum') and set('minimum')" : function() {
            var setMaximum = this.setMaximum,
                setMinimum = this.setMinimum;
            this.axis.set("keys", this.keys);
            Y.Assert.isFalse(this.axis._getSetMax(), "The _getSetMax method should return false.");
            Y.Assert.isFalse(this.axis._getSetMin(), "The _getSetMin method should return false.");
            this.axis.set("maximum", this.setMaximum);
            this.axis.set("minimum", this.setMinimum);
            Y.Assert.areEqual(setMaximum, this.axis.get("maximum"), "The get max method should return " + this.setMaximum + ".");
            Y.Assert.areEqual(setMinimum, this.axis.get("minimum"), "The get min method should return " + this.setMinimum + ".");
            Y.Assert.isTrue(this.axis._getSetMax(), "The _getSetMax method should return true.");
            Y.Assert.isTrue(this.axis._getSetMin(), "The _getSetMin method should return true.");
        },
        
        "test: labelFunction()" : function() {
            var val = "10/15/2012";
             Y.Assert.areEqual(val, this.axis.get("labelFunction")(val), "The label should equal " + val + ".");
        },

        "test: getEdgeOffset()" : function() {
            var len = 100,
                count = this.dataProvider.length,
                offset = (len/count)/2;
            Y.Assert.areEqual(offset, this.axis.getEdgeOffset(count, len), "The edgeOffset should be " + offset + ".");
        },

        "test: addKey().removeKey().addKey()" : function() {
            var i,
                len = this.dataProvider.length,
                axisKeys,
                dateDataByKey,
                dateKeyValue;
            //add and remove key and add new key to hit all branches of _getKeyArray method
            this.axis.addKey("open");
            this.axis.removeKey("open");
            this.axis.addKey("date");
            axisKeys = this.axis.get("keys");
            dateDataByKey = this.axis.getDataByKey("date");
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(this.dateValues[i], axisKeys.date[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(i, dateDataByKey[i], "The getDataByKey method should return the correct values.");
                dateKeyValue = this.axis.getKeyValueAt("date", i);
                Y.Assert.areEqual(
                    this.dateValues[i], 
                    dateKeyValue, 
                    'The axis.getKeyValueAt("date", ' + i + ') method should return a value of ' + this.dateValues[i] + '.'
                );
            }
        },

        "test: _getCoordFromValue()" : function() {
            var axis = this.axis,
                min = 0,
                max = 10,
                dataValue = 4,
                length = 400,
                offset = 5,
                testResult = ((dataValue - min) * (length/(max.valueOf() - min.valueOf()))) + offset,
                result;
            result = axis._getCoordFromValue.apply(
                axis, 
                [min, max, length, dataValue, offset]
            );
            Y.Assert.isNumber(result, "The value should be a number.");
            Y.Assert.areEqual(testResult, result, "The result should be " + testResult + ".");
            result = axis._getCoordFromValue.apply(
                axis, 
                [min, max, length, null, offset]
            );
            Y.Assert.isNaN(result, "The value should not be a number.");
        }
    });
    
    var suite = new Y.Test.Suite("Charts: CategoryAxisBase"),
        DOC = Y.config.doc,
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
        ],
        dateValues = [
            "01/01/2009",
            "01/02/2009",
            "01/03/2009", 
            "01/04/2009",
            "01/05/2009",
            "01/06/2009",
            "01/07/2009",
            "01/08/2009",
            "01/09/2009",
            "01/10/2009",
            "01/11/2009",
            "01/12/2009",
            "01/13/2009",
            "01/14/2009",
            "01/15/2009",
            "01/16/2009",
            "01/17/2009",
            "01/18/2009",
            "01/19/2009",
            "01/20/2009",
            "01/21/2009",
            "01/22/2009"
        ];

    suite.add(new Y.CategoryAxisBaseTest({
        dataProvider: plainOldDataProvider,
        setMaximum: 4,
        setMinimum: 7,
        dateValues: dateValues,
        name: "CategoryAxisBase Tests"
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-category-base', 'chart-test-template']});
