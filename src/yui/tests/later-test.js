YUI.add('later-test', function(Y) {

        var testCore = new Y.Test.Case({

            name: "Later tests",

            test_later: function() {

                var data = {
                    foo: 'bar'
                }, count = 0;;

                Y.Lang.later(0, null, function(o) {
                    count++;
                    Y.Assert.areEqual('bar', o.foo);
                }, data)

                this.wait(function() {
                    Y.Assert.areEqual(1, count);
                }, 5);

            },

            test_native: function() {

                // fails in IE, YUI 3.3.0 and below

                var baz;

                var data = [function() {
                    baz = "boo";
                }, 0];

                Y.Lang.later(0, null, setTimeout, data)

                this.wait(function() {
                    this.wait(function() {
                        Y.Assert.areEqual('boo', baz);
                    }, 5);
                }, 5);

            }
        });

    Y.SeedTests.add(testCore);

});
