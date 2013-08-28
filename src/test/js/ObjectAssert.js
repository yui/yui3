
/**
 * The ObjectAssert object provides functions to test JavaScript objects
 * for a variety of cases.
 * @namespace Test
 * @module test
 * @class ObjectAssert
 * @static
 */
YUITest.ObjectAssert = {

    /**
     * Asserts that an object has all of the same properties
     * and property values as the other.
     * @param {Object} expected The object with all expected properties and values.
     * @param {Object} actual The object to inspect.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     * @deprecated
     */
    areEqual: function(expected, actual, message) {
        YUITest.Assert._increment();

        var expectedKeys = YUITest.Object.keys(expected),
            actualKeys = YUITest.Object.keys(actual);

        //first check keys array length
        if (expectedKeys.length != actualKeys.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Object should have " + expectedKeys.length + " keys but has " + actualKeys.length));
        }

        //then check values
        for (var name in expected){
            if (expected.hasOwnProperty(name)){
                if (expected[name] != actual[name]){
                    throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be equal for property " + name), expected[name], actual[name]);
                }
            }
        }
    },

    /**
     * Asserts that an object has a property with the given name.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method hasKey
     * @static
     * @deprecated Use ownsOrInheritsKey() instead
     */
    hasKey: function (propertyName, object, message) {
        YUITest.ObjectAssert.ownsOrInheritsKey(propertyName, object, message);
    },

    /**
     * Asserts that an object has all properties of a reference object.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method hasKeys
     * @static
     * @deprecated Use ownsOrInheritsKeys() instead
     */
    hasKeys: function (properties, object, message) {
        YUITest.ObjectAssert.ownsOrInheritsKeys(properties, object, message);
    },

    /**
     * Asserts that a property with the given name exists on an object's prototype.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method inheritsKey
     * @static
     */
    inheritsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();
        if (!(propertyName in object && !object.hasOwnProperty(propertyName))){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
        }
    },

    /**
     * Asserts that all properties exist on an object prototype.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method inheritsKeys
     * @static
     */
    inheritsKeys: function (properties, object, message) {
        YUITest.Assert._increment();
        for (var i=0; i < properties.length; i++){
            if (!(propertyName in object && !object.hasOwnProperty(properties[i]))){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
            }
        }
    },

    /**
     * Asserts that a property with the given name exists on an object instance (not on its prototype).
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsKey
     * @static
     */
    ownsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();
        if (!object.hasOwnProperty(propertyName)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
        }
    },

    /**
     * Asserts that all properties exist on an object instance (not on its prototype).
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsKeys
     * @static
     */
    ownsKeys: function (properties, object, message) {
        YUITest.Assert._increment();
        for (var i=0; i < properties.length; i++){
            if (!object.hasOwnProperty(properties[i])){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
            }
        }
    },

    /**
     * Asserts that an object owns no properties.
     * @param {Object} object The object to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsNoKeys
     * @static
     */
    ownsNoKeys : function (object, message) {
        YUITest.Assert._increment();
        var count = YUITest.Object.keys(object).length;

        if (count !== 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Object owns " + count + " properties but should own none."));
        }

    },

    /**
     * Asserts that an object has a property with the given name.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsOrInheritsKey
     * @static
     */
    ownsOrInheritsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();
        if (!(propertyName in object)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object."));
        }
    },

    /**
     * Asserts that an object has all properties of a reference object.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsOrInheritsKeys
     * @static
     */
    ownsOrInheritsKeys: function (properties, object, message) {
        YUITest.Assert._increment();
        for (var i=0; i < properties.length; i++){
            if (!(properties[i] in object)){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object."));
            }
        }
    }
};
