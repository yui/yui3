YUI.add('array-invoke-tests', function(Y) {

var suite = new Y.Test.Suite("Collection: ArrayInvoke");

suite.add(new Y.Test.Case({
    name: "array-invoke",

    setUp: function () {
        function Thing(name) {
            this.name = name;
        }
        Thing.prototype = {
            getName: function () {
                return this.name;
            },
            takesArgs: function (a, b) {
                return this.getName() + (a + b);
            }
        };

        this.data = [
            new Thing('A'),
            new Thing('B'),
            new Thing('C'),
            new Thing('D')
        ];
    },

    "invoke() should return an empty array": function () {
        var ret = Y.Array.invoke();

        Y.Assert.isArray(ret);
        Y.Assert.areSame(0, ret.length);
    },

    "invoke(array) should return an empty array": function () {
        var ret = Y.Array.invoke(this.data);

        Y.Assert.isArray(ret);
        Y.Assert.areSame(0, ret.length);
    },

    "test invoke(array, string)": function () {
        var ret = Y.Array.invoke(this.data, 'getName');

        Y.ArrayAssert.itemsAreSame(['A', 'B', 'C', 'D'], ret);
    },

    "test invoke(sparseArray, string)": function () {
        this.data[2] = null;

        var ret = Y.Array.invoke(this.data, 'getName');

        Y.ArrayAssert.itemsAreSame(['A', 'B', undefined, 'D'], ret);
    },

    "test invoke(array, string, args...)": function () {
        var ret = Y.Array.invoke(this.data, 'takesArgs', 1, 10);

        Y.ArrayAssert.itemsAreSame(['A11', 'B11', 'C11', 'D11'], ret);
    },

    "test invoke(sparseArray, string, args...)": function () {
        this.data[2] = null;

        var ret = Y.Array.invoke(this.data, 'takesArgs', 1, 10);

        Y.ArrayAssert.itemsAreSame(['A11', 'B11', undefined, 'D11'], ret);
    },

    "test invoke(array, nonExistentMethodName)": function () {
        var ret = Y.Array.invoke(this.data, "noSuchMethod");

        Y.Assert.isArray(ret);
        Y.Assert.areSame(0, ret.length);
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['array-invoke', 'test']});
