YUI.add('datasource-polling-tests', function(Y) {

var Assert = Y.Assert,

    suite = new Y.Test.Suite("DataSource: Polling");


suite.add(new Y.Test.Case({
    name: "DataSource Polling Tests",

    testClass: function() {
        var ds = new Y.DataSource.Local();
        Assert.isNotUndefined(ds.setInterval, "Expected setInterval() method on DataSource.Local.");
        Assert.isNotUndefined(ds.clearInterval, "Expected clearInterval() method on DataSource.Local.");
    },

    testSetAndClear: function() {
        var test = this,
            ds = new Y.DataSource.Local(),
            count = 0,
            resumed, intervalId;
        
        intervalId = ds.setInterval(50, {
            callback: {
                success: function (e) {
                    count++;
                }
            }
        });
        
        Assert.isNumber(intervalId, "Expected interval id.");

        this.wait(function () {
            var currentCount = count;

            Assert.isTrue((count > 1));

            ds.clearInterval(intervalId);

            test.wait(function () {
                Assert.areSame(currentCount, count);
            }, 300);
        }, 300);
    },

    testClearAll: function() {
        var ds = new Y.DataSource.Local(),
            countA = 0,
            countB = 0,
            countC = 0;

        ds.setInterval(50, {
            callback: {
                success: function () {
                    countA++;
                }
            }
        });
        ds.setInterval(50, {
            callback: {
                success: function () {
                    countB++;
                }
            }
        });
        ds.setInterval(50, {
            callback: {
                success: function () {
                    countC++;
                }
            }
        });

        this.wait(function(){
            Y.assert((countA > 1));
            Y.assert((countB > 1));
            Y.assert((countC > 1));

            var currentA = countA,
                currentB = countB,
                currentC = countC;

            ds.clearAllIntervals();

            this.wait(function(){
                Assert.areSame(countA, currentA);
                Assert.areSame(countB, currentB);
                Assert.areSame(countC, currentC);
            }, 300);
        }, 300);
    },

    "setInterval should fire first sendRequest immediately, async": function () {
        var ds = new Y.DataSource.Local(),
            count = 0,
            interval;

        interval = ds.setInterval(100, {
            callback: {
                success: function () {
                    count++;
                }
            }
        });

        Assert.areSame(0, count, "first sendRequest should be async");

        this.wait(function(){
            Assert.areSame(1, count);

            this.wait(function(){
                Y.assert((count > 1));

                ds.clearInterval(interval);
            }, 300);
        }, 50);
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-polling', 'test']});
