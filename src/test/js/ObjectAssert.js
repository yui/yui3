    /**
     * @module test
     */

    /**
     * The ObjectAssert object provides functions to test JavaScript objects
     * for a variety of cases.
     *
     * @class ObjectAssert
     * @static
     */
    Y.ObjectAssert = {
    
        areEqual: function(expected, actual, message) {
            Y.Assert._increment();               
            Y.Object.each(expected, function(value, name){
                if (expected[name] != actual[name]){
                    throw new Y.Assert.ComparisonFailure(Y.Assert._formatMessage(message, "Values should be equal for property " + name), expected[name], actual[name]);
                }
            });            
        },
        
        /**
         * Asserts that the values in an object are equal to values in another object. 
         * This uses the double equals sign so type cohersion may occur. Note that the objects 
         * themselves need not be the same for this test to pass.
         * @param {Object} expected An object of the expected values.
         * @param {Object} actual Any object of the actual values.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method itemsAreEqual
         * @static
         */
        itemsAreEqual : function (expected, actual, message) {
            Y.Assert._increment();
            
            var expectedKeys = Y.Object.keys(expected),
                actualKeys = Y.Object.keys(actual);
            
            //first check keys array length
            if (expectedKeys.length != actualKeys.length){
                Y.Assert.fail(Y.Assert._formatMessage(message, "Object should have " + expectedKeys.length + " keys but has " + actualKeys.length));
            }
           
            //begin checking values
            for (var i=0; i < expectedKeys.length; i++){
                if (expected[expectedKeys[i]] != actual[expectedKeys[i]]){
                    throw new Y.Assert.ComparisonFailure(
                        Y.Assert._formatMessage(message, "Values at key " + expectedKeys[i] + " are not equal."), 
                        expected[expectedKeys[i]], 
                        actual[expectedKeys[i]]
                    );
                }
            }
        },
        
        /**
         * Asserts that an object has a property with the given name. The property may exist either
         * on the object instance or in its prototype chain. The same as testing 
         * "property" in object.
         * @param {String} propertyName The name of the property to test.
         * @param {Object} object The object to search.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method hasKey
         * @static
         */    
        hasKey: function (propertyName, object, message) {
            Y.Assert._increment();               
            if (!(propertyName in object)){
                Y.fail(Y.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object."));
            }    
        },
        
        /**
         * Asserts that an object has all properties of a reference object. The properties may exist either
         * on the object instance or in its prototype chain. The same as testing 
         * "property" in object.
         * @param {Array} properties An array of property names that should be on the object.
         * @param {Object} object The object to search.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method hasKeys
         * @static
         */    
        hasKeys: function (properties, object, message) {
            Y.Assert._increment();  
            for (var i=0; i < properties.length; i++){
                if (!(properties[i] in object)){
                    Y.fail(Y.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object."));
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
            Y.Assert._increment();               
            if (!object.hasOwnProperty(propertyName)){
                Y.fail(Y.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
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
            Y.Assert._increment();        
            for (var i=0; i < properties.length; i++){
                if (!object.hasOwnProperty(properties[i])){
                    Y.fail(Y.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
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
            Y.Assert._increment();  

            var keys = Y.Object.keys(object);
            
            if (keys.length > 0){
                Y.fail(Y.Assert._formatMessage(message, "Object owns " + keys.length + " properties but should own none."));
            }

        }     
    };
