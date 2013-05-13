YUI.add('attribute-tests', function(Y) {

    function TestAugment(attrs, values) {}
    Y.augment(TestAugment, Y.Attribute);

    function TestAugmentWithATTRS(attrs, values) {}

    TestAugmentWithATTRS.ATTRS = {
        foo: {
            value:"bar"
        }
    };
    Y.augment(TestAugmentWithATTRS, Y.Attribute);

    function AttrHost(config) {
        AttrHost.superclass.constructor.apply(this, arguments);
    }
    AttrHost.NAME = "attrHost";

    AttrHost.ATTRS = {
        A: {
            value:"AVal",
            validator: Y.Lang.isString,
            broadcast:1
        },

        B: {
            validator: function(value) {
                return (value === undefined || Y.Lang.isString(value) || Y.Lang.isNumber(value));
            },
            broadcast:2
        },

        C: {
            writeOnce: true
        },

        D: {
            value:"DVal",
            readOnly: true
        },

        E: {
            value:"EVal",
            writeOnce: true
        },

        DE: {
            valueFn: "DEValueFn"
        },

        complex: {
            value: {
                X : {
                    A: 1
                },
                Y : {
                    A: 2
                },
                Z : {
                    A: 3
                }
            }
        },

        testGetCfg : {
            value : "foo",
            readOnly : true,
            getter : function(val) { return val; },
            setter : function(val) { return val; }
        },

        initOnly : {
            writeOnce:"initOnly"
        }
    };

    Y.extend(AttrHost, Y.Base, {
        DEValueFn : function() {
            return this.get("D") + this.get("E");
        }
    });

    // -----

    function ExtendedAttrHost(config) {
        AttrHost.superclass.constructor.apply(this, arguments);
    }
    ExtendedAttrHost.NAME = "extendedAttrHost";

    ExtendedAttrHost.ATTRS = {
        A: {
            value:"ExtAVal"
        },

        B: {
            value:"ExtBVal",
            validator: function(value) {
                return ((value == undefined) || Y.Lang.isString(value));
            }
        },

        D: {
            value:"ExtDVal",
            setter: function(val) {
                return (Y.Lang.isString(val)) ? val.toUpperCase() : val;
            }
        },

        E: {
            value:"ExtEVal",
            getter: function(val) {
                return (Y.Lang.isString(val)) ? val.toLowerCase() : val;
            }
        },

        F: {
            value:"ExtFVal",
            setter: function(val) {
                return (Y.Lang.isString(val)) ? val : Y.Attribute.INVALID_VALUE;
            }
        },

        "complex.X.A" : {
            value: 1111
        },

        "complex.Y.A" : {
            value: 2222,
            setter: function(val) { // Should be ignored. Can't set setters for complex sub vals
                return val + 10000;
            }
        },

        G : {
            valueFn:function(val) {
                // Referring to H before it's set up
                return this.get("H") + 10;
            }
        },

        H: {
            value:5,
            getter: function(val) {
                return val*5;
            }
        },

        I : {
            value:{
                a: 5
            },
            getter: "_getI",
            setter: "_setI",
            validator: "_validateI"
        },

        PassThrough : {
            value: "passthrough",
            getter: function(val) {
                return this._passthrough;
            },
            setter: function(val) {
                this._passthrough = val;
            }
        },

        Z : {
            value: "z",
            getter: function(val) {
                return val.toUpperCase();
            }
        }
    };

    Y.extend(ExtendedAttrHost, AttrHost, {
        _validateI : function(val, name) {
                if (name.indexOf(".") == -1) {
                    Y.Assert.areEqual("I", name);
                } else {
                    Y.Assert.areEqual("I.a", name);
                }
                return true;
        },

        _getI : function(val, name) {
            if (name.indexOf(".") == -1) {
                Y.Assert.areEqual("I", name);
            } else {
                Y.Assert.areEqual("I.a", name);
            }
            return val;
       },

       _setI : function(val, name) {
            if (name.indexOf(".") == -1) {
                Y.Assert.areEqual("I", name);
            } else {
                Y.Assert.areEqual("I.a", name);
            }
       }
    });

    //---

    var sharedEventTests = {

        testEventPrevent : function() {
            var h = this.createHost();

            var expectedEvents = ["BeforeMyNewAVal", "AfterMyNewAVal", "BeforePREVENT"];
            var actualEvents = [];

            h.on("AChange", function(e) {
                actualEvents.push("Before" + e.newVal);

                if (e.newVal == "PREVENT") {
                    e.preventDefault();
                }
            });

            h.after("AChange", function(e) {
                actualEvents.push("After" + e.newVal);

                Y.Assert.areEqual("MyNewAVal", this.get("A"));
            });

            h.set("A", "MyNewAVal");
            h.set("A", "PREVENT");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testEventBasic : function() {
            var h = this.createHost({A:"MyAVal"});

            var expectedEvents = ["BeforeMyNewAVal", "AfterMyNewAVal"];
            var actualEvents = [];

            h.on("AChange", function(e) {
                actualEvents.push("Before" + e.newVal);

                Y.Assert.areEqual("A", e.attrName);
                Y.Assert.areEqual(null, e.subAttrName);
                Y.Assert.areEqual("MyAVal", e.prevVal);
                Y.Assert.areEqual("MyNewAVal", e.newVal);
            });

            h.after("AChange", function(e) {
                actualEvents.push("After" + e.newVal);

                Y.Assert.areEqual("A", e.attrName);
                Y.Assert.areEqual(null, e.subAttrName);
                Y.Assert.areEqual("MyAVal", e.prevVal);
                Y.Assert.areEqual("MyNewAVal", e.newVal);
            });

            h.set("A", "MyNewAVal");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testEventStopImmediatePropagation: function() {
            var h = this.createHost();

            var expectedEvents = ["Before1MyNewAVal", "Before2MyNewAVal", "After1MyNewAVal", "After2MyNewAVal", "Before1STOPAFTER", "Before2STOPAFTER", "After1STOPAFTER", "Before1STOPBEFORE"];
            var actualEvents = [];

            h.on("AChange", function(e) {
                actualEvents.push("Before1" + e.newVal);
                if (e.newVal == "STOPBEFORE") {
                    e.stopImmediatePropagation();
                }
            });

            h.after("AChange", function(e) {
                actualEvents.push("After1" + e.newVal);
                if (e.newVal == "STOPAFTER") {
                    e.stopImmediatePropagation();
                }
            });

            h.on("AChange", function(e) {
                actualEvents.push("Before2" + e.newVal);
            });

            h.after("AChange", function(e) {
                actualEvents.push("After2" + e.newVal);
            });

            h.set("A", "MyNewAVal");
            h.set("A", "STOPAFTER");
            h.set("A", "STOPBEFORE");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testEventValidationReadonlyWriteOnce : function() {
            var h = this.createHost({A:"MyAVal", C:"MyCVal", D:"MyDVal"});

            var expectedEvents = ["BeforeAChange"];
            var actualEvents = [];

            h.on("AChange", function() {
                actualEvents.push("BeforeAChange");
            });

            h.after("AChange", function() {
                actualEvents.push("AfterAChange");
            });

            h.on("CChange", function() {
                actualEvents.push("BeforeCChange");
            });

            h.on("CChange", function() {
                actualEvents.push("BeforeCChange");
            });

            h.on("DChange", function() {
                actualEvents.push("BeforeDChange");
            });

            h.on("DChange", function() {
                actualEvents.push("BeforeDChange");
            });

            h.set("A", 200); // Invalid - before fired, after not fired [ value can be changed to be made valid ]
            h.set("C", "MyNewCVal"); // Write Once - neither before nor after are fired
            h.set("D", "MyNewDVal"); // Read Only - neither before not after are fired

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testEventModify : function() {
            var h = this.createHost({A:"MyAVal"});

            h.on("AChange", function(e) {
               Y.Assert.areEqual("MyAVal", e.prevVal);
               e.newVal = e.newVal.toUpperCase();
            });

            h.after("AChange", function(e) {
                Y.Assert.areEqual("MYNEWAVAL", e.newVal);
            });

            h.set("A", "MyNewAVal");
            Y.Assert.areEqual("MYNEWAVAL", h.get("A"));
        },

        testEventSameValue : function() {
            var h = this.createHost({A:"MyAVal"});

            var expectedEvents = ["BeforeAChange",
                                  "BeforeAChange",
                                  "BeforeAChange", "AfterAChange",
                                  "BeforeComplexChange", "AfterComplexChange",
                                  "BeforeComplexChange", "AfterComplexChange",
                                  "BeforeComplexChange", "AfterComplexChange",
                                  "BeforeComplexChange", "AfterComplexChange",
                                  "BeforeComplexChange", "AfterComplexChange",
                                  "BeforeComplexChange", "AfterComplexChange",
                                  "BeforePassThroughChange", "AfterPassThroughChange",
                                  "BeforePassThroughChange",
                                  "BeforePassThroughChange", "AfterPassThroughChange"
                                  ];
            var actualEvents = [];

            h.on("AChange", function(e) {
                actualEvents.push("BeforeAChange");
            });

            h.after("AChange", function(e) {
                actualEvents.push("AfterAChange");
                Y.Assert.areNotSame(e.newVal, e.preVal);
            });

            h.on("complexChange", function(e) {
                actualEvents.push("BeforeComplexChange");
            });

            h.after("complexChange", function(e) {
                actualEvents.push("AfterComplexChange");
                if (!e.subAttrName) {
                    Y.Assert.areNotSame(e.newVal, e.preVal, "Should not fire after event if object values are same");
                }
            });

            h.on("PassThroughChange", function(e) {
                actualEvents.push("BeforePassThroughChange");
            });

            h.after("PassThroughChange", function(e) {
                actualEvents.push("AfterPassThroughChange");
            });

            h.set("A", h.get("A"));     // No Change
            h.set("A", "MyAVal");       // No Change

            h.set("A", "MyNewAVal");                     // Change

            h.set("complex", h.get("complex"));          // Change, we don't know if something changed inside the object
            h.set("complex.Z.A", 3);                     // Change, even though value of complex is unchanged, we don't deep compare objects.
            h.set("complex", Y.clone(h.get("complex"))); // Change, obj reference differs
            h.set("complex", {A:1, B:2, C:3});           // Change, obj reference differs

            var a = ["A"];
            h.set("complex", a);                         // Change, value changed

            a.push("B");
            h.set("complex", a);                         // Change, same object ref, but we don't know if contents changed, so fire event

            h.set("PassThrough", "MyPassThrough");
            h.set("PassThrough", "MyPassThrough");
            h.set("PassThrough", "MyNewPassThrough");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testEventRegistrationThroughConstructor : function() {
            // Initial Set does not fire events
            var expectedEvents = ["OnInit", "AfterInit", "OnAChange", "AfterAChange"];
            var actualEvents = [];
            var h = this.createHost({
                on: {
                    "AChange" : function() {
                        actualEvents.push("OnAChange");
                    },

                    "init" : function() {
                        actualEvents.push("OnInit");
                    }
                },

                after: {
                    "AChange" : function() {
                        actualEvents.push("AfterAChange");
                    },

                    "init" : function() {
                        actualEvents.push("AfterInit");
                    }
                }
            });

            h.set("A", "Foo");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testSetOptionalPayload : function() {
            var h = this.createHost(),
                actualEvents = [];

            h.on("AChange", function(e) {
                actualEvents.push("onAChange");
                Y.Assert.areEqual("bar", e.foo);
            });

            h.after("AChange", function(e) {
                actualEvents.push("afterAChange");
                Y.Assert.areEqual("bar", e.foo);
            });

            h.set("A", "MyNewAVal", {foo:"bar"});

            Y.Assert.areEqual("MyNewAVal", h.get("A"));

            Y.ArrayAssert.itemsAreEqual(["onAChange", "afterAChange"], actualEvents);
        },

        testSetAttrsEventOptionalPayload : function() {
            var h = this.createHost(),
                actualEvents = [];

            h.on("AChange", function(e) {
                actualEvents.push("onAChange");
                Y.Assert.areEqual("bar", e.foo);
            });

            h.on("BChange", function(e) {
                actualEvents.push("onBChange");
                Y.Assert.areEqual("bar", e.foo);
            });

            h.after("AChange", function(e) {
                actualEvents.push("afterAChange");
                Y.Assert.areEqual("bar", e.foo);
            });

            h.after("BChange", function(e) {
                actualEvents.push("afterBChange");
                Y.Assert.areEqual("bar", e.foo);
            });

            h.setAttrs({
                A: "MyNewAVal",
                B: "MyNewBVal"
            }, {foo:"bar"});

            Y.Assert.areEqual("MyNewAVal", h.get("A"));
            Y.Assert.areEqual("MyNewBVal", h.get("B"));

            Y.ArrayAssert.itemsAreEqual(["onAChange", "afterAChange", "onBChange", "afterBChange"], actualEvents);
        }
    };

    var augmentTemplate = {

        name: "Augment Tests",

        testSetGetNoAttrs : function() {
            var h = new TestAugment();
            h.set("foo", "bar");
            Y.Assert.areEqual("bar", h.get("foo"));
        },

        testSetGetWithAttrs : function() {
            var h = new TestAugmentWithATTRS();
            Y.Assert.areEqual("bar", h.get("foo"));

            h.set("foo", "foobar");
            Y.Assert.areEqual("foobar", h.get("foo"));
        },

        testCustomAugment : function() {

            function FooBar(userVals) {
                Y.Attribute.call(this, null, userVals);
            };

            FooBar.ATTRS = {
                foo:{
                    value:"bar"
                }
            };

            // Straightup augment, no wrapper functions
            Y.mix(FooBar, Y.Attribute, false, null, 1);

            var o1 = new FooBar();
            Y.Assert.areEqual("bar", o1.get("foo"));

            o1.set("foo", "foobar");
            Y.Assert.areEqual("foobar", o1.get("foo"));

            var o2 = new FooBar({foo:"barfoo"});
            Y.Assert.areEqual("barfoo", o2.get("foo"));
        },

        testObjectAugment: function() {
            var o = {
                methodOne: function() {}
            };

            Y.augment(o, Y.Attribute);

            o.set("foo", "bar");
            Y.Assert.areEqual("bar", o.get("foo"));
        },

        testNodeInstanceAugment : function() {

            var node = Y.Node.create('<input id="testAttr" title="Test Me">'),
                valueChangeCalled = false,
                titleChangeCalled = false,
                changeEvent,
                test = this;

            node.appendTo('body');

            Y.augment(node, Y.Attribute);

            node.after('valueChange', function(e) {

                Y.Assert.areEqual("valueChange", e.type, "Unexpected type for valueChange");
                Y.Assert.areEqual("", e.prevVal, "Unexpected prevVal for valueChange");
                Y.Assert.areEqual("foo", e.newVal, "Unexpected newVal for valueChange");

                valueChangeCalled = true;
            });

            node.after('titleChange', function(e) {

                Y.Assert.areEqual("titleChange", e.type, "Unexpected type for titleChange");
                Y.Assert.areEqual("Test Me", e.prevVal, "Unexpected prevVal for titleChange");
                Y.Assert.areEqual("bar", e.newVal, "Unexpected newVal for titleChange");

                titleChangeCalled = true;
            });

            node.set('value', 'foo');
            node.set('title', 'bar');

            Y.Assert.areEqual("testAttr", node.get('id'));

            Y.Assert.isTrue(titleChangeCalled, "after(titleChange) not called");
            Y.Assert.isTrue(valueChangeCalled, "after(valueChange) not called");

            node.remove(true);
        },

        testAugmentedCloneWithNodeValue : function() {
            function FooBar(userVals) {
                Y.Attribute.call(this, null, userVals);
            };

            FooBar.ATTRS = {
                node : {
                    value:null
                }
            };

            // Straightup augment, no wrapper functions
            Y.mix(FooBar, Y.Attribute, false, null, 1);

            var n = Y.Node.create('<div id="foobar"></div>');

            var o1 = new FooBar();
            o1.set("node", n);

            var o2 = Y.clone(o1);

            Y.Assert.areEqual("foobar", o2.get("node").get("id"), "Expected foobar as the id of the cloned node");
            Y.Assert.isObject(o2.get("node")._node.style, "Unable to access the cloned HTMLElement");

            n.destroy();
        },

        testAugmentedCloneWithNodeValueConstructor : function() {
            function FooBar(userVals) {
                Y.Attribute.call(this, null, userVals);
            };

            FooBar.ATTRS = {
                node : {
                    value:null
                }
            };

            // Straightup augment, no wrapper functions
            Y.mix(FooBar, Y.Attribute, false, null, 1);

            var n = Y.Node.create('<div id="foobar2"></div>');

            var o1 = new FooBar({
                node: n
            });

            var o2 = Y.clone(o1);

            Y.Assert.areEqual("foobar2", o2.get("node").get("id"), "Expected foobar2 as the id of the cloned node");
            Y.Assert.isObject(o2.get("node")._node.style, "Unable to access the cloned HTMLElement");

            n.destroy();
        }
    };

    var basicTemplate = {

        name: "Core Base Class Tests",

        createHost : function(cfg) {
            return new AttrHost(cfg);
        },

        setUp : function() {},

        tearDown : function() {},

        testDefault : function() {
            var h = this.createHost();

            Y.Assert.areEqual("AVal", h.get("A"));
            Y.Assert.areEqual(undefined, h.get("B"));
            Y.Assert.areEqual(undefined, h.get("C"));
            Y.Assert.areEqual("DVal", h.get("D"));    // Readonly
            Y.Assert.areEqual("EVal", h.get("E"));    // Write once, but not twice

            Y.Assert.areEqual("DValEVal", h.get("DE"));
        },

        testConstructor : function() {
            var h = this.createHost({A:"MyAVal", B:"MyBVal", C:"MyCVal", D:"MyDVal", E:"MyEVal", DE:"MyDEVal"});

            h.set("C", "MyNewCVal");
            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");

            Y.Assert.areEqual("MyAVal", h.get("A"));
            Y.Assert.areEqual("MyBVal", h.get("B"));
            Y.Assert.areEqual("MyCVal", h.get("C")); // Write Once, set in constructor
            Y.Assert.areEqual("DVal", h.get("D"));   // Read Only
            Y.Assert.areEqual("MyEVal", h.get("E")); // Write Once, set in constructor

            Y.Assert.areEqual("MyDEVal", h.get("DE"));
        },

        testSet : function() {

            var h = this.createHost();

            h.set("A", "MyNewAVal");
            h.set("B", "MyNewBVal");
            h.set("C", "MyNewCVal");
            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");
            h.set("DE", "MyNewDEVal");

            Y.Assert.areEqual("MyNewAVal", h.get("A"));
            Y.Assert.areEqual("MyNewBVal", h.get("B"));
            Y.Assert.areEqual("MyNewCVal", h.get("C")); // Write once, set on first set.
            Y.Assert.areEqual("DVal", h.get("D"));   // Read Only
            Y.Assert.areEqual("EVal", h.get("E"));   // Write Once

            Y.Assert.areEqual("MyNewDEVal", h.get("DE"));
        },

        testWriteOncePostInit : function() {

            var h = this.createHost();
            h.set("E", "MyNewEVal");
            h.set("C", "MyNewCVal");

            Y.Assert.areEqual("MyNewCVal", h.get("C"));   // Write Once, default value
            Y.Assert.areEqual("EVal", h.get("E"));   // Write Once, default value
        },

        testWriteOnce : function() {
            var h = this.createHost({E:"MyEVal"});
            h.set("E", "MyNewEVal");

            Y.Assert.areEqual("MyEVal", h.get("E"));   // Write Once, on init
        },

        testWriteOnceInitOnly : function() {
            var h = this.createHost({ initOnly: "initOnlyVal"});
            h.set("initOnly", "NewInitOnlyVal");

            Y.Assert.areEqual("initOnlyVal", h.get("initOnly"));
        },

        testWriteOnceInitOnlyNotProvided : function() {
            var h1 = this.createHost();
            h1.set("initOnly", "InitOnlyVal");
            Y.Assert.areEqual(undefined, h1.get("initOnly"));
        },

        testAdHocGetSet : function() {
            var h = this.createHost();

            Y.Assert.areEqual(undefined, h.get("AdHoc"));
            h.set("AdHoc", "TestAdHoc");
            Y.Assert.areEqual("TestAdHoc", h.get("AdHoc"));

            h.addAttr("AdHoc", {
                setter: function(val) {
                    return val.toUpperCase();
                }
            });

            h.set("AdHoc", "TestAdHocConfigured");
            Y.Assert.areEqual("TESTADHOCCONFIGURED", h.get("AdHoc"));
        },

        testAdHocConstructorEnabled : function() {
            AttrHost.prototype._allowAdHocAttrs = true;

            var h = this.createHost({
                A: "MyAVal",
                foo: "foo",
                bar: "bar",
                plugins : ["not"],
                on: {
                    fooChange: function() {}
                },
                after: {
                    fooChange: function() {}
                }
            });

            AttrHost.prototype._allowAdHocAttrs = false;

            // Only add AdHoc Attrs
            Y.Assert.areEqual("foo", h.get("foo"));
            Y.Assert.areEqual("bar", h.get("bar"));

            // Configured Attrs
            Y.Assert.areEqual("DVal", h.get("D"));
            Y.Assert.areEqual("MyAVal", h.get("A"));

            // Not _NON_ATTRS_CFG
            Y.Assert.isUndefined(h.get("plugins"));
            Y.Assert.isUndefined(h.get("on"));
            Y.Assert.isUndefined(h.get("after"));
        },

        testAdHocConstructorDisabled : function() {

            var h = this.createHost({
                A: "MyAVal",
                foo: "foo",
                bar: "bar",
                plugins : ["not"],
                on: {
                    fooChange: function() {}
                },
                after: {
                    fooChange: function() {}
                }
            });

            // Only add AdHoc Attrs
            Y.Assert.areEqual(undefined, h.get("foo"));
            Y.Assert.areEqual(undefined, h.get("bar"));

            // Configured attributes
            Y.Assert.areEqual("DVal", h.get("D"));
            Y.Assert.areEqual("MyAVal", h.get("A"));

            // Not _NON_ATTRS_CFG
            Y.Assert.isUndefined(h.get("plugins"));
            Y.Assert.isUndefined(h.get("on"));
            Y.Assert.isUndefined(h.get("after"));
        },

        testReset : function() {
            var h = this.createHost({A:"MyAVal", B:"MyBVal", C:"MyCVal", D:"MyDVal", E:"MyEVal", DE:"MyDEVal"});

            h.set("A", "MyNewAVal");
            h.set("B", "MyNewBVal");
            h.set("C", "MyNewCVal");
            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");
            h.set("DE", "MyNewDEVal");

            Y.Assert.areEqual("MyNewAVal", h.get("A"));
            Y.Assert.areEqual("MyNewBVal", h.get("B"));
            Y.Assert.areEqual("MyCVal", h.get("C")); // Write once, set on first set.
            Y.Assert.areEqual("DVal", h.get("D"));   // Read Only
            Y.Assert.areEqual("MyEVal", h.get("E")); // Write Once
            Y.Assert.areEqual("MyNewDEVal", h.get("DE"));

            h.reset("A");
            h.reset("D");

            Y.Assert.areEqual("MyAVal", h.get("A"));
            Y.Assert.areEqual("DVal", h.get("D"));

            h.reset();

            Y.Assert.areEqual("MyAVal", h.get("A"));
            Y.Assert.areEqual("MyBVal", h.get("B"));
            Y.Assert.areEqual("MyCVal", h.get("C"));
            Y.Assert.areEqual("DVal", h.get("D"));
            Y.Assert.areEqual("MyEVal", h.get("E"));
            Y.Assert.areEqual("MyDEVal", h.get("DE"));
        },

        testMassSetGet : function() {
            var h = this.createHost();

            h.setAttrs({
                "A" : "MyNewAVal",
                "B": "MyNewBVal",
                "C": "MyNewCVal",
                "D": "MyNewDVal",
                "E": "MyNewEVal",
                "DE": "MyNewDEVal",
                complex: "MyNewComplexVal"
            });

            var expectedVals = {
                A: "MyNewAVal",
                B: "MyNewBVal",
                C: "MyNewCVal",
                D: "DVal",
                E: "EVal",
                DE: "MyNewDEVal",
                complex: "MyNewComplexVal",
                initialized:true,
                destroyed:false,
                initOnly: undefined,
                testGetCfg : "foo"
            };

            Y.Assert.areEqual(expectedVals.A, h.get("A"));
            Y.Assert.areEqual(expectedVals.B, h.get("B"));
            Y.Assert.areEqual(expectedVals.C, h.get("C")); // Write once, set on first set.
            Y.Assert.areEqual(expectedVals.D, h.get("D"));   // Read Only
            Y.Assert.areEqual(expectedVals.E, h.get("E"));   // Write Once
            Y.Assert.areEqual(expectedVals.DE, h.get("DE"));

            Y.ObjectAssert.areEqual(expectedVals, h.getAttrs());
        },

        testModifiedAttrs : function() {
            var h = this.createHost();

            h.setAttrs({
                A: "MyNewAVal",
                C: "MyNewCVal",
                D: "MyNewDVal"
            });

            var expectedVals = {
                A: "MyNewAVal",
                initialized:true
            };

            Y.ObjectAssert.areEqual(expectedVals, h.getAttrs(true));
        },

        testValidation : function() {
            var h = this.createHost();

            h.set("A", "MyAVal");
            Y.Assert.areEqual("MyAVal", h.get("A"));

            h.set("A", 100);
            Y.Assert.areEqual("MyAVal", h.get("A")); // Validation should prevent the attribute from being set

            h.set("B", "two");
            Y.Assert.areEqual("two", h.get("B"));

            h.set("B", 2);
            Y.Assert.areEqual(2, h.get("B"));

            h.set("B", false);
            Y.Assert.areEqual(2, h.get("B")); // Validation should prevent the attribute from being set
        },

        testPrivateSet : function() {
            var h = this.createHost();

            var expectedEvents = ["BeforeTryDAgain", "AfterTryDAgain", "BeforeTryEAgain", "Aftertryeagain"];
            var actualEvents = [];

            h.on("DChange", function(e) {
                actualEvents.push("Before" + e.newVal);
            });

            h.on("EChange", function(e) {
                actualEvents.push("Before" + e.newVal);
            });

            h.after("DChange", function(e) {
                actualEvents.push("After" + e.newVal);
            });

            h.after("EChange", function(e) {
                actualEvents.push("After" + e.newVal);
            });

            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");

            Y.Assert.areEqual("DVal", h.get("D"));
            Y.Assert.areEqual("EVal", h.get("E"));

            h._set("D", "TryDAgain");
            h._set("E", "TryEAgain");

            Y.Assert.areEqual("TryDAgain", h.get("D"));
            Y.Assert.areEqual("TryEAgain", h.get("E"));
        },

        testComplexDefault : function() {
            var h = this.createHost();

            var o = {
                X : {
                    A: 1
                },
                Y : {
                    A: 2
                },
                Z : {
                    A: 3
                }
            };

            Y.Assert.areEqual(1, h.get("complex.X.A"));
            Y.Assert.areEqual(2, h.get("complex.Y.A"));
            Y.Assert.areEqual(3, h.get("complex.Z.A"));

            Y.ObjectAssert.areEqual({A:1}, h.get("complex.X"));
            Y.ObjectAssert.areEqual({A:2}, h.get("complex.Y"));
            Y.ObjectAssert.areEqual({A:3}, h.get("complex.Z"));

            var val = h.get("complex");

            Y.each(val, function(v, k) {
                Y.ObjectAssert.areEqual(v, o[k]);
            });
        },

        testComplexConstructor : function() {
            var h = this.createHost({
                "complex.X.A": 11,
                "complex.Y.A": 12,
                "complex.Z.A": 13,
                "complex.W.A": 14, // Does not exist, not allowed to set
                "B.bar": 10 // B doesn't have a value
            });

            Y.ObjectAssert.areEqual({A:11}, h.get("complex.X"));
            Y.ObjectAssert.areEqual({A:12}, h.get("complex.Y"));
            Y.ObjectAssert.areEqual({A:13}, h.get("complex.Z"));

            Y.Assert.areEqual(undefined, h.get("complex.W"));

            Y.Assert.areEqual(undefined, h.get("B"));
            Y.Assert.areEqual(undefined, h.get("B.bar"));
        },

        testComplexSet : function() {
            var h = this.createHost();

            h.set("complex.X.A", 111);
            Y.Assert.areEqual(111, h.get("complex.X.A"));

            h.set("complex.X.B", 112);
            Y.Assert.areEqual(112, h.get("complex.X.B"));
            Y.ObjectAssert.areEqual({A:111, B:112}, h.get("complex.X"));

            h.set("complex.W.B", 113);
            Y.Assert.areEqual(undefined, h.get("complex.W"));
            Y.Assert.areEqual(undefined, h.get("complex.W.B"));

            h.set("complex.Y", {B:222});
            Y.Assert.areEqual(222, h.get("complex.Y.B"));
            Y.Assert.areEqual(undefined, h.get("complex.Y.A"));
        },

        testComplexEvents : function() {
            var h = this.createHost();
            var expectedEvents = ["Beforecomplex.X.A", "Aftercomplex.X.A", "Beforecomplex.Y.A", "Aftercomplex.Y.A", "Beforecomplex.Y", "Aftercomplex.Y"];
            var actualEvents = [];

            h.on("complexChange", function(e) {
                actualEvents.push("Before" + e.subAttrName);

                if (e.subAttrName == "complex.X.A") {
                    Y.Assert.areEqual(1111, e.newVal.X.A);
                    Y.ObjectAssert.areEqual({A:1111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:2}, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }

                if (e.subAttrName == "complex.Y.A") {
                    Y.Assert.areEqual(2222, e.newVal.Y.A);
                    Y.ObjectAssert.areEqual({A:1111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:2222}, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }

                if (e.subAttrName == "complex.Y") {
                    Y.Assert.areEqual(2223, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:1111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }
            });

            h.after("complexChange", function(e) {
                actualEvents.push("After" + e.subAttrName);
                if (e.subAttrName == "complex.X.A") {
                    Y.Assert.areEqual(1111, e.newVal.X.A);
                    Y.ObjectAssert.areEqual({A:1111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:2}, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }

                if (e.subAttrName == "complex.Y.A") {
                    Y.Assert.areEqual(2222, e.newVal.Y.A);
                    Y.ObjectAssert.areEqual({A:1111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:2222}, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }

                if (e.subAttrName == "complex.Y") {
                    Y.Assert.areEqual(2223, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:1111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }
            });

            h.set("complex.X.A", 1111);
            h.set("complex.Y.A", 2222);
            h.set("complex.Y", 2223);
            h.set("complex.W.A", 3333);
        },

        testBroadcast : function() {

            var h = this.createHost();

            var expectedEvents = ["On AChange Y Broadcast", "After AChange Y Broadcast", "On BChange Y Broadcast", "After BChange Y Broadcast", "On BChange YUI Broadcast", "After BChange YUI Broadcast", "On CChange", "After CChange"];
            var actualEvents = [];

            Y.Global.on("attrHost:AChange", function() {
                actualEvents.push("On AChange YUI Broadcast");
            });

            Y.Global.after("attrHost:AChange", function() {
                actualEvents.push("After AChange YUI Broadcast");
            });

            Y.on("attrHost:AChange", function() {
                actualEvents.push("On AChange Y Broadcast");
            });

            Y.after("attrHost:AChange", function() {
                actualEvents.push("After AChange Y Broadcast");
            });

            Y.Global.on("attrHost:BChange", function() {
                actualEvents.push("On BChange YUI Broadcast");
            });

            Y.Global.after("attrHost:BChange", function() {
                actualEvents.push("After BChange YUI Broadcast");
            });

            Y.on("attrHost:BChange", function() {
                actualEvents.push("On BChange Y Broadcast");
            });

            h.on("CChange", function() {
                actualEvents.push("On CChange");
            });

            h.after("CChange", function() {
                actualEvents.push("After CChange");
            });

            Y.after("attrHost:BChange", function() {
                actualEvents.push("After BChange Y Broadcast");
            });

            Y.Global.on("attrHost:CChange", function() {
                actualEvents.push("On CChange YUI Broadcast");
            });

            Y.Global.after("attrHost:CChange", function() {
                actualEvents.push("After CChange YUI Broadcast");
            });

            Y.on("attrHost:CChange", function() {
                actualEvents.push("On CChange Y Broadcast");
            });

            Y.after("attrHost:CChange", function() {
                actualEvents.push("After CChange Y Broadcast");
            });

            h.set("A", "NewA");
            h.set("B", "NewB");
            h.set("C", "NewC");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testInitialValidation: function() {
            var h = this.createHost({A:5});
            Y.Assert.areEqual("AVal", h.get("A")); // Numerical value validation failure should revert to default value
        },

        testRemoveAttr : function() {
            var h = this.createHost();

            h.removeAttr("A"); // Regular

            Y.Assert.isUndefined(h.get("A"), "Attribute A doesn't seem to be removed");
            Y.Assert.isUndefined(h._state.getAll("A"), "Attribute A still has an entry in the internal state table");

            h.removeAttr("D"); // readOnly

            Y.Assert.isUndefined(h.get("D"), "Attribute D doesn't seem to be removed");
            Y.Assert.isUndefined(h._state.getAll("D"), "Attribute D still has an entry in the internal state table");

            h.removeAttr("E"); // writeOnce

            Y.Assert.isUndefined(h.get("E"), "Attribute E doesn't seem to be removed");
            Y.Assert.isUndefined(h._state.getAll("E"), "Attribute E still has an entry in the internal state table");
        },

        testGetAttrCfg : function() {

            var h = this.createHost(),
                expected,
                val,
                attrCfg = h._getAttrCfg("testGetCfg");

            Y.Assert.areEqual(2, Y.Object.keys(attrCfg).length, "getAttrCfg returned unexpected initial lazy state");

            Y.ObjectAssert.ownsKeys({
                lazy : {},
                added : true
            }, attrCfg);

            val = h.get("testGetCfg");

            attrCfg = h._getAttrCfg("testGetCfg");

            expected = {
                added: true,
                defaultValue: "foo",
                getter: function (val) { return val; },
                initValue: "foo",
                readOnly: true,
                setter: function (val) { return val; },
                value: "foo",

                // Internals. Left in for performance, to avoid delete
                initializing: false,
                isLazyAdd: true
            };

            Y.Assert.areEqual(Y.Object.size(expected), Y.Object.size(attrCfg), "getAttrCfg returned unexpected populated state");

            Y.ObjectAssert.ownsKeys(expected, attrCfg);
        },

        testGetAllAttrCfgs : function () {

            var h = this.createHost();

            var expectedVals = [
                "A",
                "B",
                "C",
                "D",
                "E",
                "DE",
                "complex",
                "initialized",
                "destroyed",
                "initOnly",
                "testGetCfg"
            ];

            Y.ObjectAssert.ownsKeys(expectedVals, h._getAttrCfg());
        },

        testModifyAttrLazy : function() {
            var h = this.createHost();

            h.modifyAttr("C", {
                writeOnce : false
            });

            Y.Assert.isFalse(h._state.get("C", "writeOnce"));

            h.set("C", "foo");
            h.set("C", "bar");

            Y.Assert.areEqual("bar", h.get("C")); // not writeOnce anymore
        },

        testModifyAttr : function() {
            var h = this.createHost();
            var expectedEvents = ["On AChange Y Broadcast", "After AChange Y Broadcast"]
            var actualEvents = [];

            Y.on("attrHost:AChange", function() {
                actualEvents.push("On AChange Y Broadcast");
            });

            Y.after("attrHost:AChange", function() {
                actualEvents.push("After AChange Y Broadcast");
            });

            h.set("A", "NewA");

            h.modifyAttr("A", {
                getter: function(val, name) {
                    return val.toUpperCase();
                },
                setter: function(val, name) {
                    Y.Assert.fail("Setter should not be called");
                },
                validator: function(val, name) {
                    Y.Assert.fail("Validator should not be called");
                },
                broadcast:0
            });

            h.set("A", "NewAAfterGetterBroadCast");
            h.set("A", 5);

            Y.Assert.areEqual("NEWAAFTERGETTERBROADCAST", h.get("A"));

            h.modifyAttr("A", {
                readOnly:true
            });

            h.set("A", "NewAAfterReadOnly");

            Y.Assert.areEqual("NEWAAFTERGETTERBROADCAST", h.get("A"));
            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);

        },

        testProtect : function() {
            var h = this.createHost();
            var q = Y.Attribute.protectAttrs(AttrHost.ATTRS);

            Y.Assert.areNotSame(AttrHost.ATTRS, q);
            Y.Assert.areEqual(Y.dump(AttrHost.ATTRS), Y.dump(q));

            q.A.newprop = "new prop value";
            q.A.value = "modified value";

            Y.Assert.areNotEqual(Y.dump(AttrHost.ATTRS), Y.dump(q));
        },

        testCloneWithNodeValue : function() {

            function FooBar(userVals) {
                FooBar.superclass.constructor.apply(this, arguments);
            };

            FooBar.NAME = "foobar";

            FooBar.ATTRS = {
                node : {
                    value:null
                }
            };

            Y.extend(FooBar, Y.Base);

            var n = Y.Node.create('<div id="foobar3"></div>');

            var o1 = new FooBar();
            o1.set("node", n);

            var o2 = Y.clone(o1);

            Y.Assert.areEqual("foobar3", o2.get("node").get("id"), "Expected foobar3 as the id of the cloned node");
            Y.Assert.isObject(o2.get("node")._node.style, "Unable to access properties of the cloned HTMLElement");

            n.destroy();
        },

        testCloneWithNodeValueConstructor : function() {

            function FooBar(userVals) {
                FooBar.superclass.constructor.apply(this, arguments);
            };

            FooBar.NAME = "foobar";

            FooBar.ATTRS = {
                node : {
                    value:null
                }
            };

            Y.extend(FooBar, Y.Base);

            var n = Y.Node.create('<div id="foobar4"></div>');

            var o1 = new FooBar({
                node: n
            });
            var o2 = Y.clone(o1);

            Y.Assert.areEqual("foobar4", o2.get("node").get("id"), "Expected foobar4 as the id of the cloned node");
            Y.Assert.isObject(o2.get("node")._node.style, "Unable to access properties of the cloned HTMLElement");

            n.destroy();
        },

        testValueFnNotCalledIfUserValueProvided : function() {

            function MyClass() {
                MyClass.superclass.constructor.apply(this, arguments);
            }

            Y.extend(MyClass, Y.Base, null, {
                ATTRS : {
                    testValueFn : {
                        valueFn : function() {
                            Y.Assert.fail();
                        }
                    }
                }
            });

            var o = new MyClass({
                testValueFn : "foo"
            });

            Y.Assert.areEqual("foo", o.get("testValueFn"));
        },

        testValueFnCalledIfUserValueNotProvided : function() {

            var called = false;

            function MyClass() {
                MyClass.superclass.constructor.apply(this, arguments);
            }

            Y.extend(MyClass, Y.Base, null, {
                ATTRS : {
                    testValueFn : {
                        valueFn : function() {
                            called = true;
                            return "bar";
                        }
                    }
                }
            });

            var o = new MyClass();

            Y.Assert.areEqual("bar", o.get("testValueFn"));
        },

        testSuperClassToSubClassSetterWithLazyAddFalse : function() {

            // CandleStickSeries use case, where graphic === a, upcandle = b

            function MySubClass() {
                MySubClass.superclass.constructor.apply(this, arguments);
            }

            function MySuperClass() {
                MySuperClass.superclass.constructor.apply(this, arguments);
            }

            Y.extend(MySuperClass, Y.Base, null, {
                NAME : "mySuperClass",
                ATTRS : {
                    a : {
                        lazyAdd : false,
                        setter : function(val) {
                            return val;
                        }
                    }
                }
            });

            Y.extend(MySubClass, MySuperClass, null, {
                NAME : "mySubClass",
                ATTRS : {
                    a : {
                        lazyAdd : false,
                        setter : function(val) {
                            this.set("b", 10);
                            return val;
                        }
                    },
                    b : {}
                }
            });

            var o = new MySubClass({
                a:20
            });

            Y.Assert.areEqual(20, o.get("a"));
            Y.Assert.areEqual(10, o.get("b"));
        }
    };

    basicTemplate = Y.merge(basicTemplate, sharedEventTests);


    var extendedTemplate = {

        name: "Core Extended Class Tests",

        createHost : function(cfg) {
            return new ExtendedAttrHost(cfg);
        },

        setUp : function() {},

        tearDown : function() {},

        testDefault : function() {
            var h = this.createHost();

            Y.Assert.areEqual("ExtAVal", h.get("A"));
            Y.Assert.areEqual("ExtBVal", h.get("B"));
            Y.Assert.areEqual(undefined, h.get("C"));
            Y.Assert.areEqual("EXTDVAL", h.get("D"));
            Y.Assert.areEqual("exteval", h.get("E"));
            Y.Assert.areEqual("ExtFVal", h.get("F"));

            Y.Assert.areEqual("EXTDVALexteval", h.get("DE"));
        },

        testConstructor : function() {
            var h = this.createHost({A:"MyAVal", B:"MyBVal", C:"MyCVal", D:"MyDVal", E:"MyEVal", F:"MyFVal"});

            h.set("C", "MyNewCVal");
            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");

            Y.Assert.areEqual("MyAVal", h.get("A"));
            Y.Assert.areEqual("MyBVal", h.get("B"));
            Y.Assert.areEqual("MyCVal", h.get("C"));
            Y.Assert.areEqual("EXTDVAL", h.get("D"));
            Y.Assert.areEqual("myeval", h.get("E"));
            Y.Assert.areEqual("MyFVal", h.get("F"));

            Y.Assert.areEqual("EXTDVALmyeval", h.get("DE"));
        },

        testSet : function() {
            var h = this.createHost();

            h.set("A", "MyNewAVal");
            h.set("B", "MyNewBVal");
            h.set("C", "MyNewCVal");
            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");
            h.set("F", "MyNewFVal");
            h.set("DE", "MyNewDEVal");

            Y.Assert.areEqual("MyNewAVal", h.get("A"));
            Y.Assert.areEqual("MyNewBVal", h.get("B"));
            Y.Assert.areEqual("MyNewCVal", h.get("C"));
            Y.Assert.areEqual("EXTDVAL", h.get("D"));
            Y.Assert.areEqual("exteval", h.get("E"));
            Y.Assert.areEqual("MyNewFVal", h.get("F"));
            Y.Assert.areEqual("MyNewDEVal", h.get("DE"));
        },

        testAdHocGetSet : function() {
            var h = this.createHost();

            Y.Assert.areEqual(undefined, h.get("AdHoc"));
            h.set("AdHoc", "TestAdHoc");
            Y.Assert.areEqual("TestAdHoc", h.get("AdHoc"));
        },

        testAdHocConstructorEnabled : function() {
            AttrHost.prototype._allowAdHocAttrs = true;

            var h = this.createHost({
                A: "MyAVal",
                foo: "foo",
                bar: "bar",
                plugins : ["not"],
                on: {
                    fooChange: function() {}
                },
                after: {
                    fooChange: function() {}
                }
            });

            AttrHost.prototype._allowAdHocAttrs = false;

            // Only add AdHoc Attrs
            Y.Assert.areEqual("foo", h.get("foo"));
            Y.Assert.areEqual("bar", h.get("bar"));

            // Configured Attrs
            Y.Assert.areEqual("EXTDVAL", h.get("D"));
            Y.Assert.areEqual("MyAVal", h.get("A"));

            // Not _NON_ATTRS_CFG
            Y.Assert.isUndefined(h.get("plugins"));
            Y.Assert.isUndefined(h.get("on"));
            Y.Assert.isUndefined(h.get("after"));
        },

        testAdHocConstructorDisabled : function() {

            var h = this.createHost({
                A: "MyAVal",
                foo: "foo",
                bar: "bar",
                plugins : ["not"],
                on: {
                    fooChange: function() {}
                },
                after: {
                    fooChange: function() {}
                }
            });

            // Only add AdHoc Attrs
            Y.Assert.areEqual(undefined, h.get("foo"));
            Y.Assert.areEqual(undefined, h.get("bar"));

            // Configured attributes
            Y.Assert.areEqual("EXTDVAL", h.get("D"));
            Y.Assert.areEqual("MyAVal", h.get("A"));

            // Not _NON_ATTRS_CFG
            Y.Assert.isUndefined(h.get("plugins"));
            Y.Assert.isUndefined(h.get("on"));
            Y.Assert.isUndefined(h.get("after"));
        },

        testReset : function() {
            var h = this.createHost({A:"MyAVal", B:"MyBVal", C:"MyCVal", D:"MyDVal", E:"MyEVal", F:"MyFVal", DE:"MyDEVal"});

            h.set("A", "MyNewAVal");
            h.set("B", "MyNewBVal");
            h.set("C", "MyNewCVal");
            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");
            h.set("F", "MyNewFVal");
            h.set("DE", "MyNewDEVal");

            Y.Assert.areEqual("MyNewAVal", h.get("A"));
            Y.Assert.areEqual("MyNewBVal", h.get("B"));
            Y.Assert.areEqual("MyCVal", h.get("C"));     // Write once, set on first set.
            Y.Assert.areEqual("EXTDVAL", h.get("D"));       // Read Only
            Y.Assert.areEqual("myeval", h.get("E"));     // Write Once
            Y.Assert.areEqual("MyNewFVal", h.get("F"));     // Write Once
            Y.Assert.areEqual("MyNewDEVal", h.get("DE"));

            h.reset("A");
            h.reset("D");

            Y.Assert.areEqual("MyAVal", h.get("A"));
            Y.Assert.areEqual("EXTDVAL", h.get("D"));

            h.reset();

            Y.Assert.areEqual("MyAVal", h.get("A"));
            Y.Assert.areEqual("MyBVal", h.get("B"));
            Y.Assert.areEqual("MyCVal", h.get("C"));
            Y.Assert.areEqual("EXTDVAL", h.get("D"));
            Y.Assert.areEqual("myeval", h.get("E"));
            Y.Assert.areEqual("MyFVal", h.get("F"));
            Y.Assert.areEqual("MyDEVal", h.get("DE"));
        },

        testMassSetGet : function() {
            var h = this.createHost();

            h.setAttrs({
                "A" : "MyNewAVal",
                "B": "MyNewBVal",
                "C": "MyNewCVal",
                "D": "MyNewDVal",
                "E": "MyNewEVal",
                "F": "MyNewFVal",
                "DE": "MyNewDEVal",
                complex: "MyNewComplexVal",
                "I" : "MyNewIVal",
                "PassThrough" : "MyPassThrough",
                "Z" : "MyZ"
            });

            var expectedVals = {
                A: "MyNewAVal",
                B: "MyNewBVal",
                C: "MyNewCVal",
                D: "EXTDVAL",
                E: "exteval",
                F: "MyNewFVal",
                DE: "MyNewDEVal",
                complex: "MyNewComplexVal",
                G: 35,
                H: 25,
                I: "MyNewIVal",
                PassThrough: "MyPassThrough",
                Z: "MYZ",
                initialized:true,
                destroyed:false,
                initOnly: undefined,
                testGetCfg : "foo"
            };

            Y.Assert.areEqual(expectedVals.A, h.get("A"));
            Y.Assert.areEqual(expectedVals.B, h.get("B"));
            Y.Assert.areEqual(expectedVals.C, h.get("C"));   // Write once, set on first set.
            Y.Assert.areEqual(expectedVals.D, h.get("D"));   // Read Only
            Y.Assert.areEqual(expectedVals.E, h.get("E"));   // Write Once
            Y.Assert.areEqual(expectedVals.F, h.get("F"));
            Y.Assert.areEqual(expectedVals.DE, h.get("DE"));

            Y.ObjectAssert.areEqual(expectedVals, h.getAttrs());
        },

        testGetAllAttrCfgs : function () {

            var h = this.createHost();

            var expectedVals = [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "DE",
                "complex",
                "G",
                "H",
                "I",
                "PassThrough",
                "Z",
                "initialized",
                "destroyed",
                "initOnly",
                "testGetCfg"
            ];

            Y.ObjectAssert.ownsKeys(expectedVals, h._getAttrCfg());
        },

        testModifiedAttrs : function() {
            var h = this.createHost();

            h.setAttrs({
                A: "MyNewAVal",
                C: "MyNewCVal",
                D: "MyNewDVal",
                F: "MyNewFVal"
            });

            var expectedVals = {
                A: "MyNewAVal",
                F: "MyNewFVal",
                initialized:true
            };

            Y.ObjectAssert.areEqual(expectedVals, h.getAttrs(true));
        },

        testValidation : function() {
            var h = this.createHost();

            h.set("A", "MyAVal");
            Y.Assert.areEqual("MyAVal", h.get("A"));

            h.set("A", 100);
            Y.Assert.areEqual("MyAVal", h.get("A"));  // Validation should prevent the attribute from being set

            h.set("B", "two");
            Y.Assert.areEqual("two", h.get("B"));

            h.set("B", 2);
            Y.Assert.areEqual("two", h.get("B")); // Validation should prevent the attribute from being set

            h.set("B", true);
            Y.Assert.areEqual("two", h.get("B")); // Validation should prevent the attribute from being set

            h.set("F", "MyNewFVal");
            Y.Assert.areEqual("MyNewFVal", h.get("F"));

            h.set("F", 3);
            Y.Assert.areEqual("MyNewFVal", h.get("F"));  // Validation should prevent the attribute from being set
        },

        testPrivateSet : function() {
            var h = this.createHost();

            var expectedEvents = ["BeforeTryDAgain", "AfterTRYDAGAIN", "BeforeTryEAgain", "Aftertryeagain"  ]; // Last entry: e.newVal is not "get" normalized
            var actualEvents = [];

            h.on("DChange", function(e) {
                actualEvents.push("Before" + e.newVal);
            });

            h.on("EChange", function(e) {
                actualEvents.push("Before" + e.newVal);
            });

            h.after("DChange", function(e) {
                actualEvents.push("After" + e.newVal);
            });

            h.after("EChange", function(e) {
                actualEvents.push("After" + e.newVal);
            });

            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");

            Y.Assert.areEqual("EXTDVAL", h.get("D"));
            Y.Assert.areEqual("exteval", h.get("E"));

            h._set("D", "TryDAgain");
            h._set("E", "TryEAgain");

            Y.Assert.areEqual("TRYDAGAIN", h.get("D"));
            Y.Assert.areEqual("tryeagain", h.get("E"));

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testComplexDefault : function() {
            var h = this.createHost();

            var o = {
                X : {
                    A: 1111
                },
                Y : {
                    A: 2222
                },
                Z : {
                    A: 3
                }
            };

            Y.Assert.areEqual(1111, h.get("complex.X.A"));
            Y.Assert.areEqual(2222, h.get("complex.Y.A"));
            Y.Assert.areEqual(3, h.get("complex.Z.A"));

            Y.ObjectAssert.areEqual({A:1111}, h.get("complex.X"));
            Y.ObjectAssert.areEqual({A:2222}, h.get("complex.Y"));
            Y.ObjectAssert.areEqual({A:3}, h.get("complex.Z"));

            var val = h.get("complex");

            Y.each(val, function(v, k) {
                Y.ObjectAssert.areEqual(v, o[k]);
            });
        },

        testComplexConstructor : function() {
            var h = this.createHost({
                "complex.X.A": 11,
                "complex.Y.A": 12,
                "complex.Z.A": 13,
                "complex.W.A": 14 // Does not exist, not allowed to set
            });

            Y.ObjectAssert.areEqual({A:11}, h.get("complex.X"));
            Y.ObjectAssert.areEqual({A:12}, h.get("complex.Y"));
            Y.ObjectAssert.areEqual({A:13}, h.get("complex.Z"));

            Y.Assert.areEqual(undefined, h.get("complex.W"));
        },

        testComplexSet : function() {
            var h = this.createHost();

            h.set("complex.X.A", 111);
            Y.Assert.areEqual(111, h.get("complex.X.A"));

            h.set("complex.X.B", 112);
            Y.Assert.areEqual(112, h.get("complex.X.B"));
            Y.ObjectAssert.areEqual({A:111, B:112}, h.get("complex.X"));

            h.set("complex.W.B", 113);
            Y.Assert.areEqual(undefined, h.get("complex.W"));
            Y.Assert.areEqual(undefined, h.get("complex.W.B"));

                    h.set("complex.Y", {B:222});
            Y.Assert.areEqual(222, h.get("complex.Y.B"));
            Y.Assert.areEqual(undefined, h.get("complex.Y.A"));
        },

        testComplexEvents : function() {
            var h = this.createHost();
            var expectedEvents = ["Beforecomplex.X.A", "Aftercomplex.X.A", "Beforecomplex.Y.A", "Aftercomplex.Y.A", "Beforecomplex.Y", "Aftercomplex.Y"];
            var actualEvents = [];

            h.on("complexChange", function(e) {
                actualEvents.push("Before" + e.subAttrName);
                if (e.subAttrName == "complex.X.A") {
                    Y.Assert.areEqual(11111, e.newVal.X.A);
                    Y.ObjectAssert.areEqual({A:11111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:2222}, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }

                if (e.subAttrName == "complex.Y.A") {
                    Y.Assert.areEqual(22222, e.newVal.Y.A);
                    Y.ObjectAssert.areEqual({A:11111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:22222}, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }

                if (e.subAttrName == "complex.Y") {
                    Y.Assert.areEqual(22233, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:11111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }
            });

            h.after("complexChange", function(e) {
                actualEvents.push("After" + e.subAttrName);
                if (e.subAttrName == "complex.X.A") {
                    Y.Assert.areEqual(11111, e.newVal.X.A);
                    Y.ObjectAssert.areEqual({A:11111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:2222}, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }

                if (e.subAttrName == "complex.Y.A") {
                    Y.Assert.areEqual(22222, e.newVal.Y.A);
                    Y.ObjectAssert.areEqual({A:11111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:22222}, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }

                if (e.subAttrName == "complex.Y") {
                    Y.Assert.areEqual(22233, e.newVal.Y);
                    Y.ObjectAssert.areEqual({A:11111}, e.newVal.X);
                    Y.ObjectAssert.areEqual({A:3}, e.newVal.Z);
                }
            });

            h.set("complex.X.A", 11111);
            h.set("complex.Y.A", 22222);
            h.set("complex.Y", 22233);
            h.set("complex.W.A", 33333);
        },

        testOnDemandInit : function() {
            var h = this.createHost();

            Y.Assert.areEqual(35, h.get("G"));
            Y.Assert.areEqual(25, h.get("H"));
        },

        testGetterSetterValidatorNameArg : function() {
            var h = this.createHost();
            h.set("I.a", 6);
            h.set("I", {a:7, b:8});
        },

        testBroadcast : function() {
            var h = this.createHost();

            var expectedEvents = ["On AChange Y Broadcast", "After AChange Y Broadcast", "On BChange Y Broadcast", "After BChange Y Broadcast", "On BChange YUI Broadcast", "After BChange YUI Broadcast", "On CChange", "After CChange"];
            var actualEvents = [];

            Y.Global.on("extendedAttrHost:AChange", function() {
                actualEvents.push("On AChange YUI Broadcast");
            });

            Y.Global.after("extendedAttrHost:AChange", function() {
                actualEvents.push("After AChange YUI Broadcast");
            });

            Y.on("extendedAttrHost:AChange", function() {
                actualEvents.push("On AChange Y Broadcast");
            });

            Y.after("extendedAttrHost:AChange", function() {
                actualEvents.push("After AChange Y Broadcast");
            });

            // ---

            Y.Global.on("extendedAttrHost:BChange", function() {
                actualEvents.push("On BChange YUI Broadcast");
            });

            Y.Global.after("extendedAttrHost:BChange", function() {
                actualEvents.push("After BChange YUI Broadcast");
            });

            Y.on("extendedAttrHost:BChange", function() {
                actualEvents.push("On BChange Y Broadcast");
            });

            Y.after("extendedAttrHost:BChange", function() {
                actualEvents.push("After BChange Y Broadcast");
            });

            // --

            h.on("CChange", function() {
                actualEvents.push("On CChange");
            });

            h.after("CChange", function() {
                actualEvents.push("After CChange");
            });

            Y.Global.on("extendedAttrHost:CChange", function() {
                actualEvents.push("On CChange YUI Broadcast");
            });

            Y.Global.after("extendedAttrHost:CChange", function() {
                actualEvents.push("After CChange YUI Broadcast");
            });

            Y.on("extendedAttrHost:CChange", function() {
                actualEvents.push("On CChange Y Broadcast");
            });

            Y.after("extendedAttrHost:CChange", function() {
                actualEvents.push("After CChange Y Broadcast");
            });

            h.set("A", "NewA");
            h.set("B", "NewB");
            h.set("C", "NewC");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testModifyAttr : function() {
            var h = this.createHost();
            var expectedEvents = ["On AChange Y Broadcast", "After AChange Y Broadcast"]
            var actualEvents = [];

            Y.on("extendedAttrHost:AChange", function() {
                actualEvents.push("On AChange Y Broadcast");
            });

            Y.after("extendedAttrHost:AChange", function() {
                actualEvents.push("After AChange Y Broadcast");
            });

            h.set("A", "NewA");

            h.modifyAttr("A", {
                getter: function(val, name) {
                    return val.toUpperCase();
                },
                setter: function(val, name) {
                    Y.Assert.fail("Setter should not be called");
                },
                validator: function(val, name) {
                    Y.Assert.fail("Validator should not be called");
                },
                broadcast:0
            });

            h.set("A", "NewAAfterGetterBroadCast");
            h.set("A", 5);

            Y.Assert.areEqual("NEWAAFTERGETTERBROADCAST", h.get("A"));

            h.modifyAttr("A", {
                readOnly:true
            });

            h.set("A", "NewAAfterReadOnly");

            Y.Assert.areEqual("NEWAAFTERGETTERBROADCAST", h.get("A"));
            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testEventSameValueExt : function() {
            var h = this.createHost();
            var expectedEvents = ["BeforeZChange", "AfterZChange", "BeforeZChange", "AfterZChange"];
            var actualEvents = [];

            h.on("ZChange", function() {
                actualEvents.push("BeforeZChange");
            });

            h.after("ZChange", function() {
                actualEvents.push("AfterZChange");
            });

            h.set("Z", "MyZ");
            h.set("Z", "MYZ");

            Y.ArrayAssert.itemsAreEqual(expectedEvents, actualEvents);
        },

        testSetterWithOpts : function() {
            var h = this.createHost(),
                actualOpts,
                actualFacades;

            h.addAttr("setterWithOpts", {
                setter: function(val, name, opts) {
                    if (actualOpts) {
                        actualOpts.push(opts);
                    }
                },
                value: "X"
            });

            h.after("setterWithOptsChange", function(e) {
                actualFacades.push(e);
            });

            actualOpts = [];
            actualFacades = [];

            h.set("setterWithOpts", "A");

            Y.Assert.isUndefined(actualOpts[0]);
            Y.Assert.isFalse("foo" in actualFacades[0]);

            h.set("setterWithOpts", "B", {foo: 10});

            Y.ObjectAssert.areEqual({foo:10}, actualOpts[1]);
            Y.Assert.areEqual(10, actualFacades[1].foo);

            h.set("setterWithOpts", "C", {foo: 20});

            Y.ObjectAssert.areEqual({foo:20}, actualOpts[2]);
            Y.Assert.areEqual(20, actualFacades[2].foo);

            h.set("setterWithOpts", "D", {bar: 30});

            Y.ObjectAssert.areEqual({bar:30}, actualOpts[3]);
            Y.Assert.areEqual(30, actualFacades[3].bar);
            Y.Assert.isFalse("foo" in actualFacades[3]);
        }
    };

    extendedTemplate = Y.merge(extendedTemplate, sharedEventTests);

    var suite = new Y.Test.Suite("Attribute");

    suite.add(new Y.Test.Case(basicTemplate));
    suite.add(new Y.Test.Case(extendedTemplate));
    suite.add(new Y.Test.Case(augmentTemplate));

    // Run twice, just to make sure static class state not modified
    suite.add(new Y.Test.Case(basicTemplate));
    suite.add(new Y.Test.Case(extendedTemplate));
    suite.add(new Y.Test.Case(augmentTemplate));

    Y.Test.Runner.setName("Attribute Tests");
    Y.Test.Runner.add(suite);

}, "@VERSION@", {requires:["dump", "base", "test"]});
