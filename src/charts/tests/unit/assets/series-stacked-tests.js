YUI.add('series-stacked-tests', function(Y) {
    var MockStackingUtil = Y.Base.create("mockStackingUtil", Y.StackingUtil, [], {
        }),
        suite = new Y.Test.Suite("Charts: StackingUtil");
    Y.StackingUtilTest = function() {
        Y.StackingUtilTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.StackingUtilTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.stackingUtil = new Y.StackingUtil();
        },

        tearDown: function() {
            this.stackingUtil = null;
        },
        
        "test: _stackCoordinates()" : function() {
            var MockStackCoordinatesStackingUtil = Y.Base.create("mockStackCoordinatesStackingUtil", Y.StackingUtil, [], {
                    _direction: "horizontal",

                    _stackXCoordsCalled: false,

                    _stackYCoordsCalled: false,

                    _stackXCoords: function() {
                        this._stackXCoordsCalled = true;    
                    },

                    _stackYCoords: function() {
                        this._stackYCoordsCalled = true;
                    },

                    get: function() {
                        return this._direction;
                    }
                }),
                mockStackingUtil = new MockStackCoordinatesStackingUtil(),
                stackingUtil = this.stackingUtil;
            this.stackingUtil._stackCoordinates.apply(mockStackingUtil);
            Y.Assert.isTrue(mockStackingUtil._stackYCoordsCalled, "The _stackYCoords method should have been called.");
            mockStackingUtil._direction = "vertical";
            this.stackingUtil._stackCoordinates.apply(mockStackingUtil);
            Y.Assert.isTrue(mockStackingUtil._stackXCoordsCalled, "The _stackXCoords method should have been called.");
        },

        "test: _cleanXNaN()" : function() {
            var xcoords = [null, 180, 400, null, 100, null],
                ycoords = [250, 200, 150, 100, 50, 0],
                testCoords = xcoords.concat(),
                stackingUtil = this.stackingUtil,
                nextValidY = 50,
                nextValidX = 100,
                previousValidY = 150,
                previousValidX = 400,
                y = 100,
                i,
                len = ycoords.length,
                m;

            //calculate slope and solve for x
            m = (nextValidY - previousValidY) / (nextValidX - previousValidX);
            testCoords[3] = (y + (m * previousValidX) - previousValidY)/m;
            stackingUtil._cleanXNaN(xcoords, ycoords);
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(testCoords[i], xcoords[i], "The " + i + " index of the xcoords array should equal " + testCoords[i] + ".");
            }
        },

        "test: _cleanYNaN()" : function() {
            var xcoords = [0, 100, 200, 300, 400, 500],
                ycoords = [null, 250, 180, null, 400, null],
                testCoords = ycoords.concat(),
                stackingUtil = this.stackingUtil,
                nextValidY = 400,
                nextValidX = 400, 
                previousValidY = 180,
                previousValidX = 200,
                x = 300,
                i,
                len = xcoords.length,
                m;
            
            //calculate slope and solve for y
            m = (nextValidY - previousValidY) / (nextValidX - previousValidX);
            testCoords[3] = previousValidY + ((m * x) - (m * previousValidX));
            stackingUtil._cleanYNaN(xcoords, ycoords);
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(testCoords[i], ycoords[i], "The " + i + " index of the ycoords array should equal " + testCoords[i] + ".");
            }
        },

        "test: _getPreviousValidCoordValue()" : function() {
            var stackingUtil = this.stackingUtil,
                testCoords = [0, 10, null, 30, 40];
            Y.Assert.areEqual(30, stackingUtil._getPreviousValidCoordValue(testCoords, 4), "The previous valid coord should be 30.");
            Y.Assert.areEqual(10, stackingUtil._getPreviousValidCoordValue(testCoords, 3), "The previous valid coord should be 10.");
            Y.Assert.areEqual(10, stackingUtil._getPreviousValidCoordValue(testCoords, 2), "The previous valid coord should be 10.");
            Y.Assert.areEqual(0, stackingUtil._getPreviousValidCoordValue(testCoords, 1), "The previous valid coord should be 0.");
        },

        "test: _getNextValidCoordValue()" : function() {
            var stackingUtil = this.stackingUtil,
                testCoords = [0, 10, null, 30, 40];
            Y.Assert.areEqual(10, stackingUtil._getNextValidCoordValue(testCoords, 0), "The next valid coord should be 10.");
            Y.Assert.areEqual(30, stackingUtil._getNextValidCoordValue(testCoords, 1), "The next valid coord should be 30.");
            Y.Assert.areEqual(30, stackingUtil._getNextValidCoordValue(testCoords, 2), "The next valid coord should be 30.");
            Y.Assert.areEqual(40, stackingUtil._getNextValidCoordValue(testCoords, 3), "The next valid coord should be 40.");
        }
    });
    
    suite.add(new Y.StackingUtilTest({
        name: "StackingUtil Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-stacked', 'chart-test-template']});
