(function(){

    var M = function(Y){
    
        var Assert = Y.Assert;

        /**
         * The ObjectAssert object provides functions to test JavaScript objects
         * for a variety of cases.
         *
         * @namespace YAHOO.util
         * @class ObjectAssert
         * @static
         */
        Y.ObjectAssert = {
                
            /**
             * Asserts that all properties in the object exist in another object.
             * @param {Object} expected An object with the expected properties.
             * @param {Object} actual An object with the actual properties.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method propertiesAreEqual
             * @static
             */
            propertiesAreEqual : function (expected /*:Object*/, actual /*:Object*/, 
                                   message /*:String*/) /*:Void*/ {
                
                //get all properties in the object
                var properties /*:Array*/ = [];        
                for (var property in expected){
                    properties.push(property);
                }
                
                //see if the properties are in the expected object
                for (var i=0; i < properties.length; i++){
                    Assert.isNotUndefined(actual[properties[i]], 
                        Assert._formatMessage(message, "Property '" + properties[i] + "' expected."));
                }
        
            },
            
            /**
             * Asserts that an object has a property with the given name.
             * @param {String} propertyName The name of the property to test.
             * @param {Object} object The object to search.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method hasProperty
             * @static
             */    
            hasProperty : function (propertyName /*:String*/, object /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!(propertyName in object)){
                    Assert.fail(Assert._formatMessage(message, "Property '" + propertyName + "' not found on object."));
                }    
            },
            
            /**
             * Asserts that a property with the given name exists on an object instance (not on its prototype).
             * @param {String} propertyName The name of the property to test.
             * @param {Object} object The object to search.
             * @param {String} message (Optional) The message to display if the assertion fails.
             * @method hasProperty
             * @static
             */    
            hasOwnProperty : function (propertyName /*:String*/, object /*:Object*/, message /*:String*/) /*:Void*/ {
                if (!Y.object.owns(object, propertyName)){
                    Assert.fail(Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
                }     
            }
        };

    };
    
    YUI.add("objectassert", M, "3.0.0");
    
})();