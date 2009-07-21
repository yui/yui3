    /**
     * Creates a new mock object.
     * @class Mock
     * @constructor
     * @param {Object} template (Optional) An object whose methods
     *      should be stubbed out on the mock object.
     */
    Y.Mock = function(template){
    
        //use blank object is nothing is passed in
        template = template || {};
        
        var mock = null;
        
        //try to create mock that keeps prototype chain intact
        try {
            mock = Y.Object(template);
        } catch (ex) {
            mock = {};
            Y.log("Couldn't create mock with prototype.", "warn", "Mock");
        }
        
        //create new versions of the methods so that they don't actually do anything
        Y.Object.each(template, function(name){
            if (Y.Lang.isFunction(template[name])){
                mock[name] = function(){
                    Y.Assert.fail("Method " + name + "() was called but was not expected to be.");
                };
            }
        });
        
        //return it
        return mock;    
    };
        
    /**
     * Assigns an expectation to a mock object. This is used to create
     * methods and properties on the mock object that are monitored for
     * calls and changes, respectively.
     * @param {Object} mock The object to add the expectation to.
     * @param {Object} expectation An object defining the expectation. For
     *      a method, the keys "method" and "args" are required with
     *      an optional "returns" key available. For properties, the keys
     *      "property" and "value" are required.
     * @return {void}
     * @method expect
     * @static
     */ 
    Y.Mock.expect = function(mock /*:Object*/, expectation /*:Object*/){

        //make sure there's a place to store the expectations
        if (!mock.__expectations) {
            mock.__expectations = {};
        }

        //method expectation
        if (expectation.method){
            var name = expectation.method,
                args = expectation.args || expectation.arguments || [],
                result = expectation.returns,
                callCount = Y.Lang.isNumber(expectation.callCount) ? expectation.callCount : 1,
                error = expectation.error,
                run = expectation.run || function(){};
                
            //save expectations
            mock.__expectations[name] = expectation;
            expectation.callCount = callCount;
            expectation.actualCallCount = 0;
                
            //process arguments
            Y.Array.each(args, function(arg, i, array){
                if (!(array[i] instanceof Y.Mock.Value)){
                    array[i] = Y.Mock.Value(Y.Assert.areSame, [arg], "Argument " + i + " of " + name + "() is incorrect.");
                }
            });
        
            //if the method is expected to be called
            if (callCount > 0){
                mock[name] = function(){   
                    try {
                        expectation.actualCallCount++;
                        Y.Assert.areEqual(args.length, arguments.length, "Method " + name + "() passed incorrect number of arguments.");
                        for (var i=0, len=args.length; i < len; i++){
                            //if (args[i]){
                                args[i].verify(arguments[i]);
                            //} else {
                            //    Y.Assert.fail("Argument " + i + " (" + arguments[i] + ") was not expected to be used.");
                            //}
                            
                        }                
    
                        run.apply(this, arguments);
                        
                        if (error){
                            throw error;
                        }
                    } catch (ex){
                        //route through TestRunner for proper handling
                        Y.Test.Runner._handleError(ex);
                    }
                    
                    return result;
                };
            } else {
            
                //method should fail if called when not expected
                mock[name] = function(){
                    try {
                        Y.Assert.fail("Method " + name + "() should not have been called.");
                    } catch (ex){
                        //route through TestRunner for proper handling
                        Y.Test.Runner._handleError(ex);
                    }                    
                };
            }
        } else if (expectation.property){
            //save expectations
            mock.__expectations[name] = expectation;
        }
    };

    /**
     * Verifies that all expectations of a mock object have been met and
     * throws an assertion error if not.
     * @param {Object} mock The object to verify..
     * @return {void}
     * @method verify
     * @static
     */ 
    Y.Mock.verify = function(mock /*:Object*/){    
        try {
            Y.Object.each(mock.__expectations, function(expectation){
                if (expectation.method) {
                    Y.Assert.areEqual(expectation.callCount, expectation.actualCallCount, "Method " + expectation.method + "() wasn't called the expected number of times.");
                } else if (expectation.property){
                    Y.Assert.areEqual(expectation.value, mock[expectation.property], "Property " + expectation.property + " wasn't set to the correct value."); 
                }
            });
        } catch (ex){
            //route through TestRunner for proper handling
            Y.Test.Runner._handleError(ex);
        }
    };

    Y.Mock.Value = function(method, originalArgs, message){
        if (this instanceof Y.Mock.Value){
            this.verify = function(value){
                var args = [].concat(originalArgs || []);
                args.push(value);
                args.push(message);
                method.apply(null, args);
            };
        } else {
            return new Y.Mock.Value(method, originalArgs, message);
        }
    };
    
    Y.Mock.Value.Any        = Y.Mock.Value(function(){});
    Y.Mock.Value.Boolean    = Y.Mock.Value(Y.Assert.isBoolean);
    Y.Mock.Value.Number     = Y.Mock.Value(Y.Assert.isNumber);
    Y.Mock.Value.String     = Y.Mock.Value(Y.Assert.isString);
    Y.Mock.Value.Object     = Y.Mock.Value(Y.Assert.isObject);
    Y.Mock.Value.Function   = Y.Mock.Value(Y.Assert.isFunction);