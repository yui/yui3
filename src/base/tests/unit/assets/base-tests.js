YUI.add('base-tests', function(Y) {

    // NOTE: Attribute's unit tests cover a large section of Base's functionality when it comes to dealing with attributes.

    function EventTests(config) {
        EventTests.superclass.constructor.apply(this, arguments);
    }

    EventTests.NAME = "eventTestsHost";

    EventTests.ATTRS = {
        attr1 : {
            value: "foo"
        }
    };

    Y.extend(EventTests, Y.Base);

    var suite = new Y.Test.Suite("Base Tests");

    suite.add(new Y.Test.Case({
        name : "Base Event Tests",

        testEventPrefix : function() {
            var h = new EventTests();
            Y.Assert.areEqual("eventTestsHost", h._eventPrefix);            
        },

        testEventRegistrationThroughConstructor : function() {

            var expectedEvents = ["OnInit", "AfterInit", "OnAttr1Change", "AfterAttr1Change"];
            var actualEvents = [];

            var h = new EventTests({
                on: {
                    "attr1Change" : function() {
                        actualEvents.push("OnAttr1Change");
                    },

                    "init" : function() {
                        actualEvents.push("OnInit");
                    }
                },

                after: {
                    "attr1Change" : function() {
                        actualEvents.push("AfterAttr1Change");
                    },

                    "init" : function() {
                        actualEvents.push("AfterInit");
                    }
                }
            });

            h.set("attr1", "bar");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testBubbleTargetsThroughConstructor : function() {

            var expectedEvents = ["bubbleTargetOne", "bubbleTargetTwo", "bubbleTargetThree"];
            var actualEvents = [];

            var bubbleTargetOne = new Y.EventTarget();
            bubbleTargetOne.on("eventTestsHost:attr1Change", function() {
                actualEvents.push("bubbleTargetOne");
            });

            var bubbleTargetTwo = new Y.EventTarget();
            bubbleTargetTwo.on("eventTestsHost:attr1Change", function() {
                actualEvents.push("bubbleTargetTwo");
            });

            var bubbleTargetThree = new Y.EventTarget();
            bubbleTargetThree.on("eventTestsHost:attr1Change", function() {
                actualEvents.push("bubbleTargetThree");
            });

            var h1 = new EventTests({
               bubbleTargets : [bubbleTargetOne, bubbleTargetTwo]  
            });

            h1.set("attr1", "bar");

            var h2 = new EventTests({
                bubbleTargets : bubbleTargetThree
            });

            h2.set("attr1", "foobar");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testInitEvent : function() {
            var actual = [];
            var expected = ["onInit", "afterInit"];

            var h = new EventTests({
                on : {
                    init : function() {
                        actual.push("onInit");
                    }
                }, 
                after : {
                    init : function() {
                        actual.push("afterInit");                        
                    }
                }
            });

            Y.ArrayAssert.itemsAreEqual(expected, actual);  
        },

        testDestroyEvent : function() {
            var actual = [];
            var expected = ["onDestroy", "afterDestroy"];

            var h = new EventTests();

            h.on("destroy", function() {
                actual.push("onDestroy");
            });
            
            h.after("destroy", function() {
                actual.push("afterDestroy");
            });        
        }
    }));

    suite.add(new Y.Test.Case({

        name : "BaseBuild",

        "test:create-basic": function () {

            var expectedMethodCalls = [
                "ext1::constructor", 
                "myClass::initializer",
                "ext1::constructor", 
                "myClass::initializer", 
                "myClass::methodOne",
                "myClass::methodOne",
                "ext1::extOne",
                "ext1::extOne"],

                actualMethodCalls = [];

            function Ext1() {
                actualMethodCalls.push("ext1::constructor");
            }

            Ext1.prototype.extOne = function() {
                actualMethodCalls.push("ext1::extOne");
            };

            var MyClass = Y.Base.create("myClass", Y.Base, [Ext1], {
                
                initializer: function() {
                    actualMethodCalls.push("myClass::initializer");
                },

                methodOne: function() {
                    actualMethodCalls.push("myClass::methodOne");
                }

            }, {
                STATIC_ONE: "static_one"
            });

            // using 2 instances, just to make sure nothing static/prototype related gets broken by the 1st instance
            var o1 = new MyClass({foo:true});
            var o2 = new MyClass({foo:true});

            Y.Assert.isFunction(o1.extOne, "Extension method extOne not found on o1");
            Y.Assert.isFunction(o2.extOne, "Extension method extOne not found on o2");

            Y.Assert.isFunction(o1.methodOne, "Prototype method methodOne not found on o1");
            Y.Assert.isFunction(o2.methodOne, "Prototype method methodOne not found on o2");

            Y.Assert.areEqual(o1.constructor.STATIC_ONE, "static_one", "STATIC_ONE not found on o1's constructor");
            Y.Assert.areEqual(o2.constructor.STATIC_ONE, "static_one", "STATIC_ONE not found on o2's constructor");
            
            Y.Assert.areEqual(o1.constructor.NAME, "myClass", "NAME not found on o1's constructor");
            Y.Assert.areEqual(o2.constructor.NAME, "myClass", "NAME not found on o2's constructor"); 

            o1.methodOne();
            o2.methodOne();

            o1.extOne();
            o2.extOne();

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },

        "test:mix-basic": function() {

            var expectedMethodCalls = [
                "myClass::constructor",
                "ext1::constructor",
                "myClass::initializer",
                "myClass::constructor",
                "ext1::constructor",
                "myClass::initializer", 
                "myClass::methodOne",
                "myClass::methodOne",
                "ext1::extOne",
                "ext1::extOne"],

                actualMethodCalls = [];

            function Ext1() {
                actualMethodCalls.push("ext1::constructor");
            }

            Ext1.prototype.extOne = function() {
                actualMethodCalls.push("ext1::extOne");
            };

            function MyClass(config) {
                actualMethodCalls.push("myClass::constructor");
                MyClass.superclass.constructor.apply(this, arguments);
            }

            Y.extend(MyClass, Y.Base, {
                
                initializer: function() {
                    actualMethodCalls.push("myClass::initializer");
                },

                methodOne: function() {
                    actualMethodCalls.push("myClass::methodOne");
                }

            }, {
                STATIC_ONE: "static_one",
                NAME: "myClass"
            });

            Y.Base.mix(MyClass, [Ext1]);             

            // using 2 instances, just to make sure nothing static/prototype related gets broken by the 1st instance
            var o1 = new MyClass();
            var o2 = new MyClass();

            Y.Assert.isFunction(o1.extOne, "Extension method extOne not found on o1");
            Y.Assert.isFunction(o2.extOne, "Extension method extOne not found on o2");

            Y.Assert.isFunction(o1.methodOne, "Prototype method methodOne not found on o1");
            Y.Assert.isFunction(o2.methodOne, "Prototype method methodOne not found on o2");

            Y.Assert.areEqual(o1.constructor.STATIC_ONE, "static_one", "STATIC_ONE not found on o1's constructor");
            Y.Assert.areEqual(o2.constructor.STATIC_ONE, "static_one", "STATIC_ONE not found on o2's constructor"); 

            o1.methodOne();
            o2.methodOne();

            o1.extOne();
            o2.extOne();

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },

        "test:initializer": function() {
            var expectedMethodCalls = [
                "ext1::constructor", 
                "myClass::initializer",
                "ext1::initializer", 
                "ext1::constructor", 
                "myClass::initializer",
                "ext1::initializer"],

                actualMethodCalls = [];

            function Ext1(cfg) {
                actualMethodCalls.push("ext1::constructor");
                Y.Assert.isNotUndefined(cfg);
            }

            Ext1.prototype.initializer = function(cfg) {
                actualMethodCalls.push("ext1::initializer");
                Y.Assert.isNotUndefined(cfg);
            };

            var MyClass = Y.Base.create("myClass", Y.Base, [Ext1], {
                initializer: function(cfg) {
                    actualMethodCalls.push("myClass::initializer");
                    Y.Assert.isNotUndefined(cfg);
                }
            });

            // using 2 instances, just to make sure nothing static/prototype related gets broken by the 1st instance
            var o1 = new MyClass({foo:true});
            var o2 = new MyClass({foo:true});

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },
        
        "test:destructor": function() {
            var expectedMethodCalls = [
                "ext1::destructor",
                "myClass::destructor",
                "ext1::destructor",
                "myClass::destructor"],

                actualMethodCalls = [];

            function Ext1(cfg) {}

            Ext1.prototype.destructor = function(cfg) {
                actualMethodCalls.push("ext1::destructor");
            };

            var MyClass = Y.Base.create("myClass", Y.Base, [Ext1], {
                destructor: function(cfg) {
                    actualMethodCalls.push("myClass::destructor");
                }
            });

            // using 2 instances, just to make sure nothing static/prototype related gets broken by the 1st instance
            var o1 = new MyClass({foo:true});
            var o2 = new MyClass({foo:true});

            o1.destroy();
            o2.destroy();

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },

        "test:attrs" : function() {

            var actualMethodCalls = [],
                expectedMethodCalls = [
                    "ext1::attr2::setter", // once for lazy o1 - This was news to me: we should optimize it as part off Attr performance
                    "ext1::attr2::setter", // once for set o1
                    "ext1::attr2::setter", // once for lazy o2
                    "ext1::attr2::setter"  // once for set o2
                ];

            function Ext1() {}

            Ext1.ATTRS = {
                attr1 : {
                    value:"attr1-ext1"
                },
                attr2 : {
                    value:"attr2-ext1",
                    setter: function(val) {
                        actualMethodCalls.push("ext1::attr2::setter");
                        return val;
                    }
                },
                attr3: {
                    value:"attr3-ext1"
                }
            };

            var MyClass = Y.Base.create("myClass", Y.Base, [Ext1]);

            // using 2 instances, just to make sure nothing static/prototype related gets broken by the 1st instance
            var o1 = new MyClass();
            var o2 = new MyClass();
            
            o1.set("attr2", "foo");
            o2.set("attr2", "foo");

            Y.Assert.areEqual("attr1-ext1", o1.get("attr1"), "o1 attr1 incorrect");
            Y.Assert.areEqual("attr1-ext1", o2.get("attr1"), "o2 attr1 incorrect");
            
            Y.Assert.areEqual("foo", o1.get("attr2"), "o1 attr2 incorrect");
            Y.Assert.areEqual("foo", o2.get("attr2"), "o2 attr2 incorrect");
            
            Y.Assert.areEqual("attr3-ext1", o1.get("attr3"), "o1 attr3 incorrect");
            Y.Assert.areEqual("attr3-ext1", o2.get("attr3"), "o2 attr3 incorrect");

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },

        "test:nonAttrsCfg" : function() {
            
            function Ext1() {}
            Ext1._NON_ATTRS_CFG = ["nonAttrA", "nonAttrB"];

            function Ext2() {}
            Ext2._NON_ATTRS_CFG = ["nonAttrC", "nonAttrD"];

            var MyClass = Y.Base.create("myClass", Y.Base, [Ext1, Ext2], {
                _allowAdHocAttrs: true
            });

            var myClass = new MyClass({
                adHocAttr : "adHoc",
                nonAttrA : 1,
                nonAttrB : 2,
                nonAttrC : 3,
                nonAttrD : 4
            });

            Y.Assert.isUndefined(myClass.get("nonAttrA"), "nonAttrA should not have been configured");
            Y.Assert.isUndefined(myClass.get("nonAttrB"), "nonAttrB should not have been configured");
            Y.Assert.isUndefined(myClass.get("nonAttrC"), "nonAttrC should not have been configured");
            Y.Assert.isUndefined(myClass.get("nonAttrD"), "nonAttrD should not have been configured");

            Y.Assert.areEqual("adHoc", myClass.get("adHocAttr"), "Show have allows adHoc attrs");           
        },

        "test:aggregates" : function() {

            function Ext1() {}

            Ext1.HTML_PARSER = {
                a:"aa",
                b:"bb"
            };

            function MyWidget(config) {
                MyWidget.superclass.constructor.apply(this, arguments);
            }

            Y.extend(MyWidget, Y.Base, {}, {

                HTML_PARSER : {
                    a:"a"
                },

                _buildCfg : {
                    aggregates : ["HTML_PARSER"]
                }
            });

            var MyClass = Y.Base.create("myClass", MyWidget, [Ext1]);

            // using 2 instances, just to make sure nothing static/prototype related gets broken by the 1st instance
            var o1 = new MyClass();
            var o2 = new MyClass();

            Y.ObjectAssert.areEqual({a:"aa", b:"bb"}, o1.constructor.HTML_PARSER, "o1 HTML_PARSER not aggregated correctly");
            Y.ObjectAssert.areEqual({a:"aa", b:"bb"}, o2.constructor.HTML_PARSER, "o2 HTML_PARSER not aggregated correctly");

        },

        "test:overrides-ext-wins" : function() {

            var actualMethodCalls = [],
                expectedMethodCalls = [
                    "ext1::attr2::setter", // once for lazy o1
                    "ext1::attr2::setter", // once for set o1
                    "ext1::attr2::setter", // once for lazy o2
                    "ext1::methodOne",
                    "ext1::methodOne"
                ];

            function Ext1() {}

            Ext1.prototype.methodOne = function() {
                actualMethodCalls.push("ext1::methodOne");
            };

            Ext1.ATTRS = {
                attr1 : {
                    value:"attr1-ext1"
                },
                attr2 : {
                    value:"attr2-ext1",
                    setter: function(val) {
                        actualMethodCalls.push("ext1::attr2::setter");
                        return val;
                    }
                },
                attr3: {
                    value:"attr3-ext1"
                }
            };

            function MyClass() {
                MyClass.superclass.constructor.apply(this, arguments);
            }
            
            MyClass.NAME = "myClass";

            MyClass.ATTRS = {
                attr1 : {
                    value:"attr1-myClass"
                },
                attr2 : {
                    value:"attr2-myClass",
                    setter: function(val) {
                        actualMethodCalls.push("myClass::attr2::setter");
                        return val;
                    }
                },
                attr4 : {
                    value:"attr4-myClass"
                }
            };

            Y.extend(MyClass, Y.Base, {
                methodOne : function() {
                    actualMethodCalls.push("myClass::methodOne");
                }
            });
            Y.Base.mix(MyClass, [Ext1]);

            // using 2 instances, just to make sure nothing static/prototype related gets broken by the 1st instance
            var o1 = new MyClass();
            var o2 = new MyClass();

            // only set o1
            o1.set("attr2", "foo");

            Y.Assert.areEqual("attr1-ext1", o1.get("attr1"), "o1 attr1 incorrect");
            Y.Assert.areEqual("attr1-ext1", o2.get("attr1"), "o2 attr1 incorrect");

            Y.Assert.areEqual("foo", o1.get("attr2"), "o1 attr2 incorrect");
            Y.Assert.areEqual("attr2-ext1", o2.get("attr2"), "o2 attr2 incorrect");
            
            Y.Assert.areEqual("attr3-ext1", o1.get("attr3"), "o1 attr3 incorrect");
            Y.Assert.areEqual("attr3-ext1", o2.get("attr3"), "o2 attr3 incorrect");

            Y.Assert.areEqual("attr4-myClass", o1.get("attr4"), "o1 attr4 incorrect");
            Y.Assert.areEqual("attr4-myClass", o2.get("attr4"), "o2 attr4 incorrect");

            o1.methodOne();
            o2.methodOne();

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },

        "test:overrides-host-wins" : function() {

            var actualMethodCalls = [],
                expectedMethodCalls = [
                    "myClass::attr2::setter", // once for lazy o1
                    "myClass::attr2::setter", // once for set o1
                    "myClass::attr2::setter", // once for lazy o2
                    "myClass::methodOne",
                    "myClass::methodOne"
                ];

            function Ext1() {}
            
            Ext1.prototype.methodOne = function() {
                actualMethodCalls.push("ext1::methodOne");
            };

            Ext1.ATTRS = {
                attr1 : {
                    value:"attr1-ext1"
                },
                attr2 : {
                    value:"attr2-ext1",
                    setter: function(val) {
                        actualMethodCalls.push("ext1::attr2::setter");
                        return val;
                    }
                },
                attr3: {
                    value:"attr3-ext1"
                }
            };

            var MyClass = Y.Base.create("myClass", Y.Base, [Ext1], {
                methodOne : function() {
                    actualMethodCalls.push("myClass::methodOne");
                }
            }, { 
                ATTRS : {
                    attr1 : {
                        value:"attr1-myClass"
                    },
                    attr2 : {
                        value:"attr2-myClass",
                        setter: function(val) {
                            actualMethodCalls.push("myClass::attr2::setter");
                            return val;
                        }
                    },
                    attr4 : {
                        value:"attr4-myClass"
                    }
                }
            });

            // Using 2 instances, just to make sure nothing static/prototype related gets broken by the 1st instance
            var o1 = new MyClass();
            var o2 = new MyClass();

            // only set o1
            o1.set("attr2", "foo");

            Y.Assert.areEqual("attr1-myClass", o1.get("attr1"), "o1 attr1 incorrect");
            Y.Assert.areEqual("attr1-myClass", o2.get("attr1"), "o2 attr1 incorrect");

            Y.Assert.areEqual("foo", o1.get("attr2"), "o1 attr2 incorrect");
            Y.Assert.areEqual("attr2-myClass", o2.get("attr2"), "o2 attr2 incorrect");

            Y.Assert.areEqual("attr3-ext1", o1.get("attr3"), "o1 attr3 incorrect");
            Y.Assert.areEqual("attr3-ext1", o2.get("attr3"), "o2 attr3 incorrect");

            Y.Assert.areEqual("attr4-myClass", o1.get("attr4"), "o1 attr4 incorrect");
            Y.Assert.areEqual("attr4-myClass", o2.get("attr4"), "o2 attr4 incorrect");

            o1.methodOne();
            o2.methodOne();

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },

        "test:multiext-complex" : function() {

            var actualMethodCalls = [],
                expectedMethodCalls = [
                    "ext1::constructor",
                    "ext2::constructor", 
                    "myClass::initializer",
                    "ext1::initializer",
                    "ext2::initializer",
                    "ext1::constructor",
                    "ext2::constructor", 
                    "myClass::initializer",
                    "ext1::initializer",
                    "ext2::initializer",
                    "ext2::attr3::setter",
                    "ext2::attr3::setter",
                    "myClass::methodOne",
                    "myClass::methodOne",
                    "myClass::methodTwo",
                    "myClass::methodTwo",
                    "ext2::methodThree",
                    "ext2::methodThree",
                    "ext2::methodFour",
                    "ext2::methodFour",
                    "myClass::methodFive",
                    "myClass::methodFive"
                ];

            function Ext1() {
                actualMethodCalls.push("ext1::constructor");
            }

            Ext1.prototype.initializer = function() {
                actualMethodCalls.push("ext1::initializer");
            };

            Ext1.prototype.methodTwo = function() {
                actualMethodCalls.push("ext1::methodTwo");
            };

            Ext1.prototype.methodThree = function() {
                actualMethodCalls.push("ext1::methodThree");
            };

            Ext1.ATTRS = {
                attr2 : {
                    value:"ext1-attr2"
                },
                attr3 : {
                    value:"ext1-attr3",
                    setter: function(val) {
                        actualMethodCalls.push("ext1::attr3::setter");
                        return val;
                    }
                },
                attr4: {
                    value:"ext1-attr4"
                }
            };

            function Ext2() {
                actualMethodCalls.push("ext2::constructor");
            }

            Ext2.prototype.initializer = function() {
                actualMethodCalls.push("ext2::initializer");
            };

            Ext2.prototype.methodThree = function() {
                actualMethodCalls.push("ext2::methodThree");
            };

            Ext2.prototype.methodFour = function() {
                actualMethodCalls.push("ext2::methodFour");
            };

            Ext2.ATTRS = {
                attr3 : {
                    value:"ext2-attr3",
                    setter: function(val) {
                        actualMethodCalls.push("ext2::attr3::setter");
                        return val;
                    }
                },
                attr4 : {
                    value:"ext2-attr4"
                }
            };

            var MyClass = Y.Base.create("myClass", Y.Base, [Ext1, Ext2], {
                
                initializer: function() {
                    actualMethodCalls.push("myClass::initializer");
                },
                
                methodOne : function() {
                    actualMethodCalls.push("myClass::methodOne");
                },
                
                methodTwo : function() {
                    actualMethodCalls.push("myClass::methodTwo");
                },

                methodFive : function() {
                    actualMethodCalls.push("myClass::methodFive");
                }
            }, { 
                ATTRS : {
                    attr1 : {
                        value:"myClass-attr1"
                    },
                    attr5 : {
                        value:"myClass-attr5"
                    }
                }
            });
            
            var o1 = new MyClass();
            var o2 = new MyClass();
            
            Y.Assert.areEqual("myClass-attr1", o1.get("attr1"), "o1 attr1 incorrect");
            Y.Assert.areEqual("myClass-attr1", o2.get("attr1"), "o2 attr1 incorrect");

            Y.Assert.areEqual("ext1-attr2", o1.get("attr2"), "o1 attr2 incorrect");
            Y.Assert.areEqual("ext1-attr2", o2.get("attr2"), "o2 attr2 incorrect");

            Y.Assert.areEqual("ext2-attr3", o1.get("attr3"), "o1 attr3 incorrect");
            Y.Assert.areEqual("ext2-attr3", o2.get("attr3"), "o2 attr3 incorrect");

            Y.Assert.areEqual("ext2-attr4", o1.get("attr4"), "o1 attr4 incorrect");
            Y.Assert.areEqual("ext2-attr4", o2.get("attr4"), "o2 attr4 incorrect");

            Y.Assert.areEqual("myClass-attr5", o1.get("attr5"), "o1 attr5 incorrect");
            Y.Assert.areEqual("myClass-attr5", o2.get("attr5"), "o2 attr5 incorrect");

            o1.methodOne();
            o2.methodOne();
            o1.methodTwo();
            o2.methodTwo();
            o1.methodThree();
            o2.methodThree();
            o1.methodFour();
            o2.methodFour();
            o1.methodFive();
            o2.methodFive();
            
            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },
        
        "test:classstructure" : function() {
            function Ext1() {}
            Ext1.prototype.extOne = function() {};

            function Ext2() {}
            Ext2.prototype.extTwo = function() {};

            var MyClassTwo = Y.Base.create("myClassTwo", Y.Base, [Ext1, Ext2], {
                initializer: function() {},
                methodOne: function() {}
            });

            var MyClassOne = Y.Base.create("myClassOne", Y.Base, [Ext1], {
                initializer: function() {},
                methodOne: function() {}
            });
            
            var o1 = new MyClassOne();
            var o2 = new MyClassTwo();

            Y.Assert.isTrue(o1.hasImpl(Ext1), "o1 should pass hasImpl(Ext1)");
            Y.Assert.isFalse(o1.hasImpl(Ext2),  "o1 should fail hasImpl(Ext2)");

            Y.Assert.isTrue(o2.hasImpl(Ext1),  "o2 should pass hasImpl(Ext1)");
            Y.Assert.isTrue(o2.hasImpl(Ext2), "o2 should pass hasImpl(Ext1)");
            
            Y.Assert.isTrue(o1 instanceof MyClassOne, "o1 should be an instanceof MyClassOne");
            Y.Assert.isTrue(o1 instanceof Y.Base, "o1 should be an instanceof Base");
            
            Y.Assert.isTrue(o2 instanceof MyClassTwo, "o2 should be an instanceof MyClassTwo");
            Y.Assert.isTrue(o2 instanceof Y.Base, "o2 should be an instanceof Base");

            Y.Assert.isFalse(o1 instanceof MyClassTwo, "o1 should NOT be an instanceof MyClassTwo");
            Y.Assert.isFalse(o2 instanceof MyClassOne, "o2 should NOT be an instanceof MyClassOne");
            
            Y.Assert.isFunction(o1.methodOne, "o1 should have a methodOne method");
            Y.Assert.isFunction(o1.extOne, "o1 should have an extOne method");
            Y.Assert.isUndefined(o1.extTwo, "o1 should not have an extTwo method");

            Y.Assert.isFunction(o2.methodOne, "o2 should have a methodOne method");
            Y.Assert.isFunction(o2.extOne, "o2 should have an extOne method");
            Y.Assert.isFunction(o2.extTwo, "o2 should have an extTwo method");

            Y.Assert.isTrue(MyClassOne.superclass.constructor === Y.Base, "MyClassOne should have superclass set to Base");
            Y.Assert.isTrue(MyClassTwo.superclass.constructor === Y.Base, "MyClassTwo should have superclass set to Base");

            // Make sure Y.Base was untouched.
            var b = new Y.Base();

            Y.Assert.isUndefined(b.methodOne, "Base should not have extension methods");
            Y.Assert.isUndefined(b.extOne, "Base should not have extension methods");
            Y.Assert.isUndefined(b.extTwo, "Base should not have extension methods");
            Y.Assert.isFalse(MyClassOne === Y.Base);
            Y.Assert.isFalse(MyClassTwo === Y.Base);
        },

        "test:mutli-inheritance-from-base" : function() {

            var actualMethodCalls = [],
                expectedMethodCalls = [
                    "myClassOne::initializer",
                    10,
                    "myExt::initializer",
                    "myClassOne::afterInit"
                ];

            var Ext1 = Y.Base.create("myExt", Y.Base, [], {

                initializer: function() {
                    actualMethodCalls.push("myExt::initializer");
                }

            });

            var MyClassOne = Y.Base.create("myClassOne", Y.Base, [Ext1], {
                
                initializer: function() {
                    actualMethodCalls.push("myClassOne::initializer");
                    actualMethodCalls.push(this.get("myAttr"));                    
                }

            }, {
                ATTRS : {
                    myAttr: {
                        value: 10
                    }
                }                
            });

            var o = new MyClassOne( {
                after: {
                    init: function() {
                        actualMethodCalls.push("myClassOne::afterInit");
                    }
                }
            });

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");

        },

        "test:extend" : function() {
            
            var actualMethodCalls = [],
                expectedMethodCalls = [
                    "ext1::constructor",
                    "myClassOne::initializer",
                    "ext1::initializer",
                    "ext2::constructor",
                    "myClassTwo::initializer",
                    "ext2::initializer",
                    "myClassOne::methodOne",
                    "myClassTwo::methodTwo",
                    "ext1::extOne",
                    "ext2::extTwo"
                ];

            function Ext1() {
                actualMethodCalls.push("ext1::constructor");                
            }
            Ext1.prototype.extOne = function() {
                actualMethodCalls.push("ext1::extOne");
            };
            Ext1.prototype.initializer = function() {
                actualMethodCalls.push("ext1::initializer");
            };

            function Ext2() {
                actualMethodCalls.push("ext2::constructor");
            }
            Ext2.prototype.extTwo = function() {
                actualMethodCalls.push("ext2::extTwo");
            };
            Ext2.prototype.initializer = function() {
                actualMethodCalls.push("ext2::initializer");
            };

            var MyClassOne = Y.Base.create("myClassOne", Y.Base, [Ext1], {
                initializer: function() {
                    actualMethodCalls.push("myClassOne::initializer");    
                },
                methodOne: function() {
                    actualMethodCalls.push("myClassOne::methodOne");
                }
            });

            var MyClassTwo = Y.Base.create("myClassTwo", MyClassOne, [Ext2], {
                initializer: function() {
                    actualMethodCalls.push("myClassTwo::initializer");
                },
                methodTwo: function() {
                    actualMethodCalls.push("myClassTwo::methodTwo");
                }
            });

            var o = new MyClassTwo();

            o.methodOne();
            o.methodTwo();
            o.extOne();
            o.extTwo();

            Y.ArrayAssert.itemsAreEqual(expectedMethodCalls, actualMethodCalls, "Unexpected method calls");
        },

        "test:mainclass-statics" : function() {

            function Ext1() {}

            Ext1.prototype.extOne = function() {};
            Ext1.prototype.initializer = function() {};
            Ext1.prototype.methodOne = function() {
                return "methodOne";
            };

            Ext1.STATIC_ONE = "static_one";
            Ext1.STATIC_TWO = "static_two";
            Ext1.STATIC_THREE = "static_three";
            
            var MyClass = Y.extend(function() {
                MyClass.superclass.constructor.apply(this, arguments);                
            }, Y.Base, null, {
                NAME : "myClass",
                _buildCfg : {
                    statics : ["STATIC_ONE", "STATIC_TWO"]
                }
            });

            var MyBuiltClass = Y.Base.create("myBuiltClass", MyClass, [Ext1]);

            var o = new MyBuiltClass();

            Y.Assert.isTrue(o instanceof MyBuiltClass);

            Y.Assert.isFunction(o.methodOne); // prototype properties copied
            Y.Assert.isFunction(o.init); // but prototype not switched completely by mistake

            Y.Assert.areEqual("static_one", MyBuiltClass.STATIC_ONE);
            Y.Assert.areEqual("static_two", MyBuiltClass.STATIC_TWO);
            Y.Assert.isFalse("STATIC_THREE" in MyBuiltClass);

            Y.Assert.isFalse(MyBuiltClass.ATTRS === Ext1.ATTRS, "Ext1.ATTRS shouldn't have been copied over, it should be aggregated");            
        },

        "test:mainclass-statics" : function() {

            function Ext1() {}

            Ext1.prototype.extOne = function() {};
            Ext1.prototype.initializer = function() {};
            Ext1.prototype.methodOne = function() {
                return "methodOne";
            };

            Ext1.STATIC_ONE = "static_one";
            Ext1.STATIC_TWO = "static_two";
            Ext1.STATIC_THREE = "static_three";

            var MyClass = Y.extend(function() {
                MyClass.superclass.constructor.apply(this, arguments);                
            }, Y.Base, null, {
                NAME : "myClass",
                _buildCfg : {
                    statics : ["STATIC_ONE", "STATIC_TWO"]
                }
            });

            var MyBuiltClass = Y.Base.create("myBuiltClass", MyClass, [Ext1]);

            var o = new MyBuiltClass();

            Y.Assert.isTrue(o instanceof MyBuiltClass);

            Y.Assert.isFunction(o.methodOne); // prototype properties copied
            Y.Assert.isFunction(o.init); // but prototype not switched completely by mistake

            Y.Assert.areEqual("static_one", MyBuiltClass.STATIC_ONE);
            Y.Assert.areEqual("static_two", MyBuiltClass.STATIC_TWO);
            Y.Assert.isFalse("STATIC_THREE" in MyBuiltClass);

            Y.Assert.isFalse(MyBuiltClass.ATTRS === Ext1.ATTRS, "Ext1.ATTRS shouldn't have been copied over, it should be aggregated");            
        },

        "test:mainclass-aggregates" : function() {

            function Ext1() {}
            Ext1.AGG = {
                "foo": true
            };
            
            function Ext2() {}
            Ext2.AGG = {
                "bar": true
            };

            var MyClass = Y.extend(function() {
                MyClass.superclass.constructor.apply(this, arguments);          
            }, Y.Base, null, {
                NAME : "myClass",
                _buildCfg : {
                    aggregates : ["AGG"]
                }
            });

            var MyBuiltClass = Y.Base.create("myBuiltClass", MyClass, [Ext1, Ext2]);

            var o = new MyBuiltClass();

            Y.ObjectAssert.areEqual({
                foo:true,
                bar:true
            }, MyBuiltClass.AGG);
        },

        "test:mainclass-custom" : function() {

            function Ext1() {}

            Ext1.prototype.extOne = function() {};
            Ext1.prototype.methodOne = function() {
                return "methodOne";
            };

            Ext1.CUST = {
                foo: [1],
                bar: [1]
            };

            function Ext2() {}

            Ext2.prototype.extTwo = function() {};
            Ext2.prototype.methodTwo = function() {
                return "methodOne";
            };

            Ext2.CUST = {
                foo: [2, 3],
                bar: [2, 3, 4]
            };

            // ---

            var MyClass = Y.extend(function() {
                MyClass.superclass.constructor.apply(this, arguments);
            }, Y.Base, null, {
                NAME : "myClass",
                _buildCfg : {
                    custom : {
                        CUST : function(p, r, s) {

                            r[p] = r[p] || {
                                foo:[],
                                bar:[]
                            };
    
                            if (s[p]) {
                                if (s[p].foo) {
                                    r[p].foo = r[p].foo.concat(s[p].foo);    
                                }
                                if (s[p].bar) {
                                    r[p].bar = r[p].bar.concat(s[p].bar);    
                                }
                            }
    
                        }
                    }
                }
            });

            var MyClass1 = Y.Base.create("myClass1", MyClass, [Ext1]);
            var myclass1 = new MyClass1();

            Y.Assert.isTrue(myclass1 instanceof MyClass1);

            Y.Assert.isFunction(myclass1.methodOne);
            Y.Assert.isFunction(myclass1.init);

            // ObjectAssert.areEqual doesn't work: values don't == compare
            Y.ObjectAssert.hasKeys({
                bar:[1],
                foo:[1]
            }, MyClass1.CUST, "Class1 - object assert");
            
            Y.ArrayAssert.itemsAreEqual([1], MyClass1.CUST.foo, "Class1 foo assert");
            Y.ArrayAssert.itemsAreEqual([1], MyClass1.CUST.bar, "Class1 bar assert");

            Y.Assert.isFalse(MyClass1.CUST === Ext1.CUST, "Ext1.CUST shouldn't have been copied over");

            // ---

            var MyClass2 = Y.Base.create("myClass2", MyClass, [Ext1, Ext2]);
            var myclass2 = new MyClass2();

            Y.Assert.isTrue(myclass2 instanceof MyClass2);

            Y.Assert.isFunction(myclass2.methodTwo); // prototype properties copied
            Y.Assert.isFunction(myclass2.init); // but prototype not switched completely by mistake

            // ObjectAssert.areEqual doesn't work: values don't == compare
            Y.ObjectAssert.hasKeys({
                foo:[1,2,3],
                bar:[1,2,3,4]
            }, MyClass2.CUST);

            Y.ArrayAssert.itemsAreEqual([1,2,3], MyClass2.CUST.foo);
            Y.ArrayAssert.itemsAreEqual([1,2,3,4], MyClass2.CUST.bar);

            Y.Assert.isFalse(MyClass2.CUST === Ext1.CUST, "Ext1.CUST shouldn't have been copied over");
            Y.Assert.isFalse(MyClass2.CUST === Ext2.CUST, "Ext2.CUST shouldn't have been copied over");
        },

        "test:extCfg-custom" : function() {

            function Ext1() {}

            Ext1.prototype.extOne = function() {};
            Ext1.prototype.methodOne = function() {
                return "methodOne";
            };

            Ext1.CUST = {
                foo: [1],
                bar: [1]
            };

            Ext1._buildCfg = {
                custom : {
                    CUST : function(p, r, s) {
                        
                        r[p] = r[p] || {
                            foo:[],
                            bar:[]
                        };

                        if (s[p]) {
                            if (s[p].foo) {
                                r[p].foo = r[p].foo.concat(s[p].foo);    
                            }
                            if (s[p].bar) {
                                r[p].bar = r[p].bar.concat(s[p].bar);    
                            }
                        }

                    }
                }
            };

            function Ext2() {}

            Ext2.prototype.extTwo = function() {};
            Ext2.prototype.methodTwo = function() {
                return "methodOne";
            };

            Ext2.CUST = {
                foo: [2, 3],
                bar: [2, 3, 4]
            };

            // ---

            var MyClass1 = Y.Base.create("myClass1", Y.Base, [Ext1]);
            var myclass1 = new MyClass1();

            Y.Assert.isTrue(myclass1 instanceof MyClass1);

            Y.Assert.isFunction(myclass1.methodOne);
            Y.Assert.isFunction(myclass1.init);

            // ObjectAssert.areEqual doesn't work: values don't == compare
            Y.ObjectAssert.hasKeys({
                bar:[1],
                foo:[1]
            }, MyClass1.CUST, "Class1 - object assert");
            
            Y.ArrayAssert.itemsAreEqual([1], MyClass1.CUST.foo, "Class1 foo assert");
            Y.ArrayAssert.itemsAreEqual([1], MyClass1.CUST.bar, "Class1 bar assert");

            Y.Assert.isFalse(MyClass1.CUST === Ext1.CUST, "Ext1.CUST shouldn't have been copied over");

            // ---

            var MyClass2 = Y.Base.create("myClass2", Y.Base, [Ext1, Ext2]);
            var myclass2 = new MyClass2();

            Y.Assert.isTrue(myclass2 instanceof MyClass2);

            Y.Assert.isFunction(myclass2.methodTwo); // prototype properties copied
            Y.Assert.isFunction(myclass2.init); // but prototype not switched completely by mistake

            // ObjectAssert.areEqual doesn't work: values don't == compare
            Y.ObjectAssert.hasKeys({
                foo:[1,2,3],
                bar:[1,2,3,4]
            }, MyClass2.CUST);

            Y.ArrayAssert.itemsAreEqual([1,2,3], MyClass2.CUST.foo);
            Y.ArrayAssert.itemsAreEqual([1,2,3,4], MyClass2.CUST.bar);

            Y.Assert.isFalse(MyClass2.CUST === Ext1.CUST, "Ext1.CUST shouldn't have been copied over");
            Y.Assert.isFalse(MyClass2.CUST === Ext2.CUST, "Ext2.CUST shouldn't have been copied over");
        },

        "test:extCfg-statics" : function() {
            function Ext1() {}

            Ext1.prototype.extOne = function() {};
            Ext1.prototype.initializer = function() {};
            Ext1.prototype.methodOne = function() {
                return "methodOne";
            };

            Ext1.STATIC_ONE = "static_one";
            Ext1.STATIC_TWO = "static_two";
            Ext1.STATIC_THREE = "static_three";

            Ext1._buildCfg = {
                statics: ["STATIC_ONE", "STATIC_TWO"]
            };
                        
            var MyClass = Y.Base.create("myClass", Y.Base, [Ext1]);
            
            var myclass = new MyClass();

            Y.Assert.isTrue(myclass instanceof MyClass);

            Y.Assert.isFunction(myclass.methodOne); // prototype properties copied
            Y.Assert.isFunction(myclass.init); // but prototype not switched completely by mistake as part of statics:true

            Y.Assert.areEqual("static_one", MyClass.STATIC_ONE);
            Y.Assert.areEqual("static_two", MyClass.STATIC_TWO);
            Y.Assert.isFalse("STATIC_THREE" in MyClass);

            Y.Assert.isFalse(MyClass.ATTRS === Ext1.ATTRS, "Ext1.ATTRS shouldn't have been copied over");            
        },

        "test:extCfg-aggregates" : function() {

            function Ext1() {}
            Ext1.prototype.extOne = function() {};
            Ext1.prototype.methodOne = function() {
                return "methodOne";
            };

            Ext1.AGGREGATE_ONE = {
                a: 1,
                b: 2,
                c: 3  
            };

            Ext1._buildCfg = {
                aggregates: ["AGGREGATE_ONE"]
            };

            function Ext2() {}
            Ext2.prototype.extTwo = function() {};
            Ext2.prototype.methodTwo = function() {
                return "methodTwo";
            };
            
            Ext2.AGGREGATE_ONE = {
                c:33,
                d:4
            };

            var MyClass1 = Y.Base.create("myClass1", Y.Base, [Ext1]);
            var myclass1 = new MyClass1();

            Y.Assert.isTrue(myclass1 instanceof MyClass1);

            Y.Assert.isFunction(myclass1.methodOne); // prototype properties copied
            Y.Assert.isFunction(myclass1.init); // but prototype not switched completely by mistake as part of statics:true

            Y.ObjectAssert.areEqual({
                a:1,
                b:2,
                c:3
            }, MyClass1.AGGREGATE_ONE);

            Y.Assert.isFalse(MyClass1.AGGREGATE_ONE === Ext1.AGGREGATE_ONE, "Ext1.AGGREGATE_ONE shouldn't have been copied over");

            Y.Assert.isFalse(MyClass1.ATTRS === Ext1.ATTRS, "Ext1.ATTRS shouldn't have been copied over with statics:true");
            
            var MyClass2 = Y.Base.create("myClass2", Y.Base, [Ext1, Ext2]);
            var myclass2 = new MyClass2();

            Y.Assert.isTrue(myclass2 instanceof MyClass2);

            Y.Assert.isFunction(myclass2.methodTwo); // prototype properties copied
            Y.Assert.isFunction(myclass2.init); // but prototype not switched completely by mistake

            Y.ObjectAssert.areEqual({
                a:1,
                b:2,
                c:33,
                d:4
            }, MyClass2.AGGREGATE_ONE);

            Y.Assert.isFalse(MyClass2.AGGREGATE_ONE === Ext1.AGGREGATE_ONE, "Ext1.AGGREGATE_ONE shouldn't have been copied over");
            Y.Assert.isFalse(MyClass2.AGGREGATE_ONE === Ext2.AGGREGATE_ONE, "Ext2.AGGREGATE_ONE shouldn't have been copied over");
        },
        
        "test:extCfg-custom" : function() {

            function Ext1() {}

            Ext1.prototype.extOne = function() {};
            Ext1.prototype.methodOne = function() {
                return "methodOne";
            };

            Ext1.CUST = {
                foo: [1],
                bar: [1]
            };

            Ext1._buildCfg = {
                custom : {
                    CUST : function(p, r, s) {
                        
                        r[p] = r[p] || {
                            foo:[],
                            bar:[]
                        };

                        if (s[p]) {
                            if (s[p].foo) {
                                r[p].foo = r[p].foo.concat(s[p].foo);    
                            }
                            if (s[p].bar) {
                                r[p].bar = r[p].bar.concat(s[p].bar);    
                            }
                        }

                    }
                }
            };

            function Ext2() {}

            Ext2.prototype.extTwo = function() {};
            Ext2.prototype.methodTwo = function() {
                return "methodOne";
            };

            Ext2.CUST = {
                foo: [2, 3],
                bar: [2, 3, 4]
            };

            // ---

            var MyClass1 = Y.Base.create("myClass1", Y.Base, [Ext1]);
            var myclass1 = new MyClass1();

            Y.Assert.isTrue(myclass1 instanceof MyClass1);

            Y.Assert.isFunction(myclass1.methodOne);
            Y.Assert.isFunction(myclass1.init);

            // ObjectAssert.areEqual doesn't work: values don't == compare
            Y.ObjectAssert.hasKeys({
                bar:[1],
                foo:[1]
            }, MyClass1.CUST, "Class1 - object assert");
            
            Y.ArrayAssert.itemsAreEqual([1], MyClass1.CUST.foo, "Class1 foo assert");
            Y.ArrayAssert.itemsAreEqual([1], MyClass1.CUST.bar, "Class1 bar assert");

            Y.Assert.isFalse(MyClass1.CUST === Ext1.CUST, "Ext1.CUST shouldn't have been copied over");

            // ---

            var MyClass2 = Y.Base.create("myClass2", Y.Base, [Ext1, Ext2]);
            var myclass2 = new MyClass2();

            Y.Assert.isTrue(myclass2 instanceof MyClass2);

            Y.Assert.isFunction(myclass2.methodTwo); // prototype properties copied
            Y.Assert.isFunction(myclass2.init); // but prototype not switched completely by mistake

            // ObjectAssert.areEqual doesn't work: values don't == compare
            Y.ObjectAssert.hasKeys({
                foo:[1,2,3],
                bar:[1,2,3,4]
            }, MyClass2.CUST);

            Y.ArrayAssert.itemsAreEqual([1,2,3], MyClass2.CUST.foo);
            Y.ArrayAssert.itemsAreEqual([1,2,3,4], MyClass2.CUST.bar);

            Y.Assert.isFalse(MyClass2.CUST === Ext1.CUST, "Ext1.CUST shouldn't have been copied over");
            Y.Assert.isFalse(MyClass2.CUST === Ext2.CUST, "Ext2.CUST shouldn't have been copied over");
        },

        "test:deprecated" : function() {
            
            function Ext1() {}
            
            Ext1.MY_AGG = {a:1};
            Ext1.MY_STATICS = "a";
            Ext1.MY_CUSTOM = "a";

            function Ext2() {}
            
            Ext2.MY_AGG = {b:2};
            Ext2.MY_STATICS = "b";
            Ext2.MY_CUSTOM = "b";

            function Ext3() {}
            
            Ext3.MY_AGG = {c:3};
            Ext3.MY_STATICS = "c";
            Ext3.MY_CUSTOM = "c";

            function MyMainClass(cfg) {
                MyMainClass.superclass.constructor.apply(this, arguments);
            }

            var MyBuiltClass = Y.Base.build("foo", MyMainClass, [Ext1, Ext2, Ext3], {
                dynamic: true,
                aggregates : ["MY_AGG"],
                statics : ["MY_STATICS"],
                custom : {
                    MY_CUSTOM : function(prop, r, s) {
                        r[prop] = r[prop] || "";
                        r[prop] = r[prop] + s[prop];
                    }
                }
            });

            Y.ObjectAssert.areEqual({
                a:1,
                b:2,
                c:3
            }, MyBuiltClass.MY_AGG);
            
            Y.Assert.areEqual("c", MyBuiltClass.MY_STATICS);

            /* Currently broken. Will fix in 3.6.0pr1. Too late at this point, given the extreme edge caseness. */
            // Y.Assert.areEqual("abc", MyBuiltClass.MY_CUSTOM);
        },

        "test:base-core-subclass": function () {
            var calls = 0,
                Foo, foo;

            Foo = Y.Base.create('foo', Y.BaseCore, [], {
                initializer: function () {
                    calls += 1;
                }
            }, {
                ATTRS: {
                    bar: {
                        value: 'bar',
                        getter: function (val) {
                            return val.toUpperCase();
                        }
                    }
                }
            });

            foo = new Foo();

            Y.Assert.areSame('BAR', foo.get('bar'));
            Y.Assert.areSame(1, calls);
        },

        "test:base-core-with-base-observable-ext": function () {
            var calls = 0,
                Foo, foo;

            Foo = Y.Base.create('foo', Y.BaseCore, [Y.BaseObservable], {
                initializer: function () {
                    this.after('barChange', function () {
                        calls += 1;
                    });
                }
            }, {
                ATTRS: {
                    bar: {
                        value: 'bar',
                        getter: function (val) {
                            return val.toUpperCase();
                        }
                    }
                }
            });

            foo = new Foo();
            foo.set('bar', 'baz');

            Y.Assert.areSame('BAZ', foo.get('bar'));
            Y.Assert.areSame(1, calls);
        },

        "test:base-core-subclass-with-mix-of-base-events-ext": function () {
            var Foo, foo;

            Foo = Y.Base.create('foo', Y.BaseCore, []);

            // `null` or `undefined`.
            Y.Assert.isTrue(Foo._ATTR_CFG_HASH == undefined);

            foo = new Foo();

            Y.Assert.isNotNull(Foo._ATTR_CFG_HASH);
            Y.Assert.isUndefined(Foo._ATTR_CFG_HASH.broadcast);

            Y.Base.mix(Foo, [Y.BaseObservable]);

            // Check that cached hash was cleared.
            // `null` or `undefined`.
            Y.Assert.isTrue(Foo._ATTR_CFG_HASH == undefined);

            foo = new Foo();

            Y.Assert.isNotNull(Foo._ATTR_CFG_HASH);
            Y.Assert.isNotUndefined(Foo._ATTR_CFG_HASH.broadcast);
        }

    }));

    Y.Test.Runner.setName("Base Tests");
    Y.Test.Runner.add(suite);

});
