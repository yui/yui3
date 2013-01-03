YUI.add('attribute-core-tests', function(Y) {

    function TestAugment(attrs, values) {}
    Y.augment(TestAugment, Y.AttributeCore);

    function TestAugmentWithATTRS(attrs, values) {}
    TestAugmentWithATTRS.ATTRS = {
        foo: {
            value:"bar"
        }
    };
    Y.augment(TestAugmentWithATTRS, Y.AttributeCore);

    function AttrHost(cfg) {
        this._initAttrHost(null, cfg, true);
    }

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

        initOnly : {
            writeOnce:"initOnly"
        }
    };

    // Straightup augment, no wrapper functions
    Y.mix(AttrHost, Y.AttributeCore, false, null, 1);

    AttrHost.prototype.DEValueFn = function() {
        return this.get("D") + this.get("E");
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

        testSetterWithOpts : function() {
            var h = this.createHost();


            h.addAttr("tri", {
                setter: function(val, name, opts) {
                    opts = opts || {};
                    if (opts.src === 'internal') {
                        if (parseInt(val,10) == val && val >= 0 && val <=2) {
                            return val;
                        } else {
                            return Y.AttributeCore.INVALID_VALUE;
                        }
                    } else {
                        return (val?2:0)
                    }
                }
            });

            h.set("tri", "whatever");
            Y.Assert.areEqual(2, h.get("tri"),"1");
            h.set("tri", false);
            Y.Assert.areEqual(0, h.get("tri"),"2");
            h.set("tri", 1);
            Y.Assert.areEqual(2, h.get("tri"),"3");
            h.set("tri", 1, {src: 'internal'});
            Y.Assert.areEqual(1, h.get("tri"),"4");
            h.set("tri", "whatever", {src: 'internal'});
            Y.Assert.areEqual(1, h.get("tri"),"5");
            h.set("tri", false);
            Y.Assert.areEqual(0, h.get("tri"),"6");



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
                initOnly: undefined
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
                A: "MyNewAVal"
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

        testInitialValidation: function() {
            var h = this.createHost({A:5});
            Y.Assert.areEqual("AVal", h.get("A")); // Numerical value validation failure should revert to default value
        },

        testProtect : function() {
            var h = this.createHost();
            var q = Y.Attribute.protectAttrs(AttrHost.ATTRS);

            Y.Assert.areNotSame(AttrHost.ATTRS, q);
            Y.Assert.areEqual(Y.dump(AttrHost.ATTRS), Y.dump(q));

            q.A.newprop = "new prop value";
            q.A.value = "modified value";

            Y.Assert.areNotEqual(Y.dump(AttrHost.ATTRS), Y.dump(q));
        }
    };

    var suite = new Y.Test.Suite("Attribute Core");

    suite.add(new Y.Test.Case(basicTemplate));
    suite.add(new Y.Test.Case(augmentTemplate));

    suite.add(new Y.Test.Case(basicTemplate));
    suite.add(new Y.Test.Case(augmentTemplate));  // run twice, just to make sure static class state not modified

    Y.Test.Runner.add(suite);

}, "@VERSION@", {requires:["dump", "attribute-core", "test"]});
