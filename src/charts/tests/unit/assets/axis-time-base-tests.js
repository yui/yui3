YUI.add('axis-time-base-tests', function(Y) {
    Y.TimeAxisBaseTest = function() {
        Y.TimeAxisBaseTest.superclass.constructor.apply(this, arguments);
        this.prepValues();
    }
    Y.extend(Y.TimeAxisBaseTest, Y.ChartTestTemplate, {
        prepValues : function() {
            var i,
                dataProvider = this.dataProvider,
                len = dataProvider.length,
                dateValues = [],
                record;
            this.dataMaximum = this.dataMaximum.valueOf();
            this.dataMinimum = this.dataMinimum.valueOf();
            this.keys = ["date"];
        },

        setUp: function() {
            this.axis = new Y.TimeAxisBase();
            this.axis.set("dataProvider", this.dataProvider);
        },

        tearDown: function() {
            this.axis = null;
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.TimeAxisBase, this.axis, "The axis should be and instanceof TimeAxisBase.");
            Y.Assert.areEqual("time", this.axis.get("type"), "The axis type attribute should be time.");
        },

        "test: getDefaultStyles()" : function() {
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

        "test: get('dataProvider')" : function() {
            Y.Assert.areEqual(this.dataProvider, this.axis.get("dataProvider"), "The dataProvider attribute should equal the values it received.");  
        },

        "test: setKeys()" : function() {
            var i,
                len,
                axisKeys,
                dateDataByKey,
                dateKeyValue,
                formatMethod = Y.Date.format,
                format = this.axis.get("labelFormat"),
                testFormattedDate;
            this.axis.set("keys", this.keys);
            axisKeys = this.axis.get("keys");
            dateDataByKey = this.axis.getDataByKey("date");
            len = this.dataProvider.length;
            
            for(i = 0; i < len; i = i + 1) {
                testFormattedDate = formatMethod(new Date(this.dateValues[i]), format); 
                Y.Assert.areEqual(testFormattedDate, formatMethod(new Date(axisKeys.date[i]), format), "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(testFormattedDate, formatMethod(new Date(dateDataByKey[i]), format), "The getDataByKey method should return the correct values.");
                dateKeyValue = formatMethod(new Date(this.axis.getKeyValueAt("date", i)), format);
                Y.Assert.areEqual(
                    testFormattedDate, 
                    dateKeyValue, 
                    'The axis.getKeyValueAt("date", ' + i + ') method should return a value of ' + testFormattedDate + '.'
                );
            }
        },
        
        "test: addKey()" : function() {
            var i,
                len = this.dataProvider.length,
                axisKeys,
                dateDataByKey,
                dateKeyValue,
                formatMethod = Y.Date.format,
                format = this.axis.get("labelFormat"),
                testFormattedDate;
            this.axis.set("dataProvider", this.dataProvider);
            this.axis.addKey("date");
            axisKeys = this.axis.get("keys");
            dateDataByKey = this.axis.getDataByKey("date");
            for(i = 0; i < len; i = i + 1) {
                testFormattedDate = formatMethod(new Date(this.dateValues[i]), format); 
                Y.Assert.areEqual(testFormattedDate, formatMethod(new Date(axisKeys.date[i]), format), "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(testFormattedDate, formatMethod(new Date(dateDataByKey[i]), format), "The getDataByKey method should return the correct values.");
                dateKeyValue = formatMethod(new Date(this.axis.getKeyValueAt("date", i)), format);
                Y.Assert.areEqual(
                    testFormattedDate, 
                    dateKeyValue, 
                    'The axis.getKeyValueAt("date", ' + i + ') method should return a value of ' + testFormattedDate + '.'
                );
            }
        },

        "test: get('data')" : function() {
            var length,
                data;
            this.axis.set("keys", this.keys);
            length = this.dateValues.length;
            data = this.axis.get("data");
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
            dataMaximum = this.axis.get("dataMaximum")
            Y.Assert.isTrue(dataMaximum >= this.dataMaximum, "The value for the attribute dataMaximum (" + dataMaximum + ") should be greater than or equal to " + this.dataMaximum + ".");
        },

        "test: get('dataMinimum')" : function() {
            var dataMinimum;
            this.axis.set("keys", this.keys);
            dataMinimum = this.axis.get("dataMinimum");
            Y.Assert.isTrue(dataMinimum <= this.dataMinimum, "The value for the attribute dataMinimum (" + dataMinimum + ") should be less than or equal to " + this.dataMinimum + ".");
        },

        "test: getTotalMajorUnits()" : function() {
            Y.Assert.areEqual(11, this.axis.getTotalMajorUnits(), "The getTotalMajorUnits method should return 11.");
            this.axis.set("styles", {
                majorUnit: {
                    count: 8
                }
            });
            Y.Assert.areEqual(8, this.axis.getTotalMajorUnits(), "The getTotalMajorUnits method should return 8.");
        },

        "test: set('maximum')" : function() {
            var setMaximum = this.setMaximumNumber; 
            this.axis.set("keys", this.keys);
            this.axis.set("maximum", this.setMaximum);
            Y.Assert.areEqual(setMaximum, this.axis.get("maximum"), "The get max method should return " + this.setMaximum + ".");
            Y.Assert.isTrue(this.axis._getSetMax(), "The _getSetMax method should return true.");
        },

        "test: set('minimum')" : function() {
            var setMinimum = this.setMinimumNumber;
            this.axis.set("keys", this.keys);
            this.axis.set("minimum", this.setMinimum);
            Y.Assert.areEqual(setMinimum, this.axis.get("minimum"), "The get min method should return " + this.setMinimum + ".");
            Y.Assert.isTrue(this.axis._getSetMin(), "The _getSetMin method should return true.");
        },

        "test: set('maximum') and set('minimum')" : function() {
            var setMaximum = this.setMaximumNumber,
                setMinimum = this.setMinimumNumber;
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
            var val = new Date("10/15/2012"),
                format = "%B, %d, %Y",
                unformatted = new Date("10/15/2012"),
                formatted = "October, 15, 2012",
                returnedUnformattedValue = this.axis.get("labelFunction")(val).toString(),
                returnedFormattedValue = this.axis.get("labelFunction")(val, format).toString();
             Y.Assert.areEqual(unformatted, returnedUnformattedValue, "The label should equal " + unformatted + ".");
             Y.Assert.areEqual(formatted, returnedFormattedValue, "The label should equal " + formatted + ".");
        },

        "test: edgeCases" : function() {
            this.axis.set("keys", this.keys);
            this.axis.set("dataProvider", []);
            Y.Assert.areEqual(0, this.axis.get("dataMaximum"), "Should be zero.");
            this.axis.set("dataProvider", [{date: "01/01/2009", open: 90.27, close: 170.27}]);
            Y.Assert.isTrue(this.axis.get("dataMaximum") >= 90.27, "Should be greater than 90.27."); 
            this.axis.set("dataProvider", [{date: NaN, open: 90.27, close: 170.27}]);
            this.axis.set("dataProvider", [{date: "whattimeisit", open: 90.27, close: 170.27}]);
            this.axis._data = [33, NaN, 45];
            this.axis._updateTotalDataFlag = false;
            this.axis._updateMinAndMax();
        }
    });
    
    var suite = new Y.Test.Suite("Charts: TimeAxisBase"),
        plainOldDataProvider = [
            {date: "01/01/2009", open: 90.27, close: 170.27},
            {date: "01/02/2009", open: 91.55, close: 8.55},
            {date: "01/03/2009", open: 337.55, close: 400.55},
            {date: "01/04/2009", open: 220.27, close: 205.27},
            {date: "01/05/2009", open: 276.72, close: 239.72},
            {date: "01/06/2009", open: 85.27, close: 167.27},
            {date: new Date("01/07/2009"), open: 180.29, close: 179.29},
            {date: "01/08/2009", open: 216.21, close: 133.21},
            {date: new Date("01/09/2009").valueOf(), open: 292.35, close: 304.35},
            {date: "01/10/2009", open: 80.23, close: 30.23},
            {date: "01/11/2009", open: 60.42, close: 97.42},
            {date: new Date("01/12/2009").valueOf().toString(), open: 303.55, close: 265.55},
            {date: "01/13/2009", open: 47.48, close: 71.48},
            {date: new String(new Date("01/14/2009").valueOf()), open: 327.64, close: 256.64},
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
            1230796800000,
            1230883200000,
            1230969600000,
            1231056000000,
            1231142400000,
            1231228800000,
            1231315200000,
            1231401600000,
            1231488000000,
            1231574400000,
            1231660800000,
            1231747200000,
            1231833600000,
            1231920000000,
            1232006400000,
            1232092800000,
            1232179200000,
            1232265600000,
            1232352000000,
            1232438400000,
            1232524800000,
            1232611200000 
        ];

    suite.add(new Y.TimeAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: new Date("01/01/2009"),
        dataMinimum: new Date("01/22/2009"),
        setMinimum: "01/05/2009",
        setMaximum: "01/17/2009",
        setMinimumNumber: (new Date("01/05/2009")).valueOf(),
        setMaximumNumber: (new Date("01/17/2009")).valueOf(),
        dateValues: dateValues,
        name: "TimeAxisBase Tests"
    }));

    suite.add(new Y.TimeAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: new Date("01/01/2009"),
        dataMinimum: new Date("01/22/2009"),
        setMinimum: "01/05/2009",
        setMaximum: "01/17/2009",
        setMinimumNumber: (new Date("01/05/2009")).valueOf(),
        setMaximumNumber: (new Date("01/17/2009")).valueOf(),
        dateValues: dateValues,
        name: "TimeAxisBase with strings for min/max Tests"
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-time-base', 'chart-test-template']});
