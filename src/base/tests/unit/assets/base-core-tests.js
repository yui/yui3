YUI.add('base-core-tests', function(Y) {

    function areObjectsReallyEqual(o1, o2) {
        Y.ObjectAssert.areEqual(o1, o2);
        Y.ObjectAssert.areEqual(o2, o1);
    }

    function Test(cfg, lazy, silentInit) {
        this._lazyAddAttrs = lazy;
        this._silentInit = silentInit;
        Test.superclass.constructor.apply(this, arguments);
    }

    Test.NAME = 'test';

    Test.ATTRS = {

        attr1: {
            value: "Foo",
            setter: function(n) {
                return n;
            }
        },

        attr2: {
            value: "Bar",
            setter: function(n) {
                return n;
            }
        },

        attr3: {
            value: true
        },

        attr4: {
            value: 3
        },

        attr5: {
            value: 3
        },

        attr6: {
            value: false,
            setter: function(lock) {
                return lock;
            }
        },

        attr7: {
            value: false
        },

        attr8: {
            value: true
        },

        attr9: {
            value: true
        },

        attr10: {
            value: false
        },

        attr11: {
            value: true
        },

        attr12: {
            value: false
        },

        attr13: {
            value: false
        },

        attr14: {
            value: false,
            setter: function(val) {
                return val;
            }
        },

        attr15: {
            value: null,
            setter: function(val) {
                return false;
            }
        },

        attr16: {
            value: ['default'],

            getter: function() {
                return false;
            },

            setter: function(g) {
                return g;
            }
        },
        attr17: {
            value: null,
            setter: function(g) {
                return g;
            }
        },
        attr18: {
            writeOnce: true,
            value: null
        },
        attr19: {
            writeOnce: true,
            value: null
        },
        attr20: {
            writeOnce: true,
            value: null
        }
    };

    Y.extend(Test, Y.BaseCore, {
        foo: function() {}
    });

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
            valueFn: function() {
                return this.get("D") + this.get("E");
            }
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

    Y.extend(AttrHost, Y.BaseCore);

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
                return (Y.Lang.isString(val)) ? val : Y.AttributeCore.INVALID_VALUE;
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

    function CoreTestsHost(config) {
        CoreTestsHost.superclass.constructor.apply(this, arguments);
    }

    CoreTestsHost.NAME = "coreTestsHost";
    CoreTestsHost.ATTRS = {
        cloneDefaultObject : {
            value : {
                a:1,
                b:2,
                c:3
            }
        },

        cloneDefaultArray : {
            value : ["foo", "bar", "foobar"]
        },

        cloneDefaultString : {
            value : "foo"
        },

        cloneDefaultOverride : {
            value : {
                a:1, b:2, c:3
            },
            cloneDefaultValue : false
        },

        cloneDefaultShallow : {
            value : {
                a: {foo: "bar"}
            },
            cloneDefaultValue : "shallow"
        },

        cloneDefaultDeep : {
            value : {
                a: {foo: "bar"}
            },
            cloneDefaultValue : "deep"
        },

        cloneDefaultComplex : {
            value : new Y.BaseCore()
        }
    };
    Y.extend(CoreTestsHost, Y.BaseCore);

    var coreTemplate = {

        name: "Core Tests",

        testInit : function() {
            var h = new CoreTestsHost();
            Y.Assert.isTrue(h.get("initialized"));
        },

        testDestroy : function() {
            var h = new CoreTestsHost();

            Y.Assert.isFalse(h.get("destroyed"));

            h.destroy();

            Y.Assert.isTrue(h.get("destroyed"));
        },

        testToString : function() {
            var h = new CoreTestsHost(),
                re = /^coreTestsHost\[.*?\]$/,
                str = h.toString();

            Y.Assert.isTrue(re.test(str));
        },

        testCloneDefaultValueObject : function() {
            var h = new CoreTestsHost(),
                val = h.get("cloneDefaultObject");

            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultObject.value !== val);

            Y.ObjectAssert.areEqual({
                a:1,
                b:2,
                c:3
            }, val);
        },

        testCloneDefaultValueArray : function() {
            var h = new CoreTestsHost(),
                val = h.get("cloneDefaultArray");

            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultArray.value !== val);
            Y.ArrayAssert.itemsAreEqual(["foo", "bar", "foobar"], val);
        },

        testCloneDefaultValueString : function() {
            var h = new CoreTestsHost(),
                val = h.get("cloneDefaultString");

            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultString.value === val);
        },

        testCloneDefaultComplex : function() {
            var h = new CoreTestsHost(),
                val = h.get("cloneDefaultComplex");

            // Don't try to clone by default. We may hurt our backs
            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultComplex.value === val);
        },

        testCloneDefaultShallow : function() {
            var h = new CoreTestsHost(),
                val = h.get("cloneDefaultShallow");

            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultShallow.value !== val);
            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultShallow.value.a === val.a);

            Y.ObjectAssert.areEqual({
                foo:"bar"
            }, val.a);
        },

        testCloneDefaultDeep : function() {
            var h = new CoreTestsHost(),
                val = h.get("cloneDefaultDeep");

            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultDeep.value !== val);
            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultDeep.value.a !== val.a);

            Y.ObjectAssert.areEqual({
                foo:"bar"
            }, val.a);
        },

        testCloneDefaultOverride : function() {
            var h = new CoreTestsHost(),
                val = h.get("cloneDefaultOverride");

            Y.Assert.isTrue(CoreTestsHost.ATTRS.cloneDefaultOverride.value === val);

            Y.ObjectAssert.areEqual({
                a:1,
                b:2,
                c:3
            }, val);
        },

        testValueValueFnOverride : function() {

            var One = Y.extend(function() {
                One.superclass.constructor.apply(this, arguments);
            }, Y.Base, null, {
                ATTRS : {
                    testMe : {
                        value : "1a",
                        valueFn: function() {
                            return 1;
                        }
                    }
                }
            });

            var Two = Y.extend(function() {
                Two.superclass.constructor.apply(this, arguments);
            }, One,  null, {
                ATTRS : {
                    testMe : {
                        value : 2
                    }
                }
            });

            var Three = Y.extend(function() {
                Three.superclass.constructor.apply(this, arguments);
            }, Two,  null, {
                ATTRS : {
                    testMe : {
                        value : "3a",
                        valueFn: function() {
                            return 3;
                        }
                    }
                }
            });

            var ThreeNoVal = Y.extend(function() {
                ThreeNoVal.superclass.constructor.apply(this, arguments);
            }, Three);

            var Four = Y.extend(function() {
                Four.superclass.constructor.apply(this, arguments);
            }, Three,  null, {
                ATTRS : {
                    testMe : {
                        value : 4
                    }
                }
            });

            var FourNoVal = Y.extend(function() {
                FourNoVal.superclass.constructor.apply(this, arguments);
            }, Four);

            var one = new One();
            var two = new Two();
            var three = new Three();
            var threeNoVal = new ThreeNoVal();
            var four = new Four();
            var fourNoVal = new FourNoVal();

            Y.Assert.areEqual(1, one.get("testMe"));
            Y.Assert.areEqual(2, two.get("testMe"));
            Y.Assert.areEqual(3, three.get("testMe"));
            Y.Assert.areEqual(3, threeNoVal.get("testMe"));
            Y.Assert.areEqual(4, four.get("testMe"));
            Y.Assert.areEqual(4, fourNoVal.get("testMe"));

            one.destroy();
            two.destroy();
            three.destroy();
            threeNoVal.destroy();
            four.destroy();
            fourNoVal.destroy();
        },

        testInitializerDestructorInvocation : function() {

            var expected = ["beforeConstructorTwo", "beforeConstructorOne", "initializerOne", "initializerTwo", "afterConstructorOne", "afterConstructorTwo", "destructorTwo", "destructorOne"],
                actual = [],
                initCfg = {
                    foo: 1
                };

            function One(cfg) {
                actual.push("beforeConstructorOne");
                One.superclass.constructor.apply(this, arguments);
                actual.push("afterConstructorOne");
            }

            Y.extend(One, Y.BaseCore, {
                initializer : function(cfg) {
                    Y.Assert.areSame(initCfg, cfg);
                    actual.push("initializerOne");
                },
                destructor : function() {
                    actual.push("destructorOne");
                }
            }, {
                NAME : "one",
                ATTRS : {
                    "a" : {
                        value: 1
                    }
                }
            });

            function Two(cfg) {
                actual.push("beforeConstructorTwo");
                Two.superclass.constructor.apply(this, arguments);
                actual.push("afterConstructorTwo");
            }

            Y.extend(Two, One, {
                initializer : function(cfg) {
                    Y.Assert.areSame(initCfg, cfg);
                    actual.push("initializerTwo");
                },
                destructor : function() {
                    actual.push("destructorTwo");
                }
            }, {
                NAME : "two",
                ATTRS : {
                    "b" : {
                        value: 2
                    }
                }
            });

            var o = new Two(initCfg);
            o.destroy();

            Y.ArrayAssert.itemsAreEqual(expected, actual);

        }
    };

    var basicTemplate = {

        name: "Base Class Tests",

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
                plugins : ["not"]
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
        },

        testAdHocConstructorDisabled : function() {

            var h = this.createHost({
                A: "MyAVal",
                foo: "foo",
                bar: "bar",
                plugins : ["not"]
            });

            // Only add AdHoc Attrs
            Y.Assert.areEqual(undefined, h.get("foo"));
            Y.Assert.areEqual(undefined, h.get("bar"));

            // Configured attributes
            Y.Assert.areEqual("DVal", h.get("D"));
            Y.Assert.areEqual("MyAVal", h.get("A"));

            // Not _NON_ATTRS_CFG
            Y.Assert.isUndefined(h.get("plugins"));
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
                initialized: true,
                destroyed: false,
                initOnly: undefined
            };

            Y.Assert.areEqual(expectedVals.A, h.get("A"));
            Y.Assert.areEqual(expectedVals.B, h.get("B"));
            Y.Assert.areEqual(expectedVals.C, h.get("C")); // Write once, set on first set.
            Y.Assert.areEqual(expectedVals.D, h.get("D"));   // Read Only
            Y.Assert.areEqual(expectedVals.E, h.get("E"));   // Write Once
            Y.Assert.areEqual(expectedVals.DE, h.get("DE"));

            areObjectsReallyEqual(expectedVals, h.getAttrs());
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

            areObjectsReallyEqual(expectedVals, h.getAttrs(true));
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

            areObjectsReallyEqual({A:1}, h.get("complex.X"));
            areObjectsReallyEqual({A:2}, h.get("complex.Y"));
            areObjectsReallyEqual({A:3}, h.get("complex.Z"));

            var val = h.get("complex");

            Y.each(val, function(v, k) {
                areObjectsReallyEqual(v, o[k]);
            });
        },

        testComplexSet : function() {
            var h = this.createHost();

            h.set("complex.X.A", 111);
            Y.Assert.areEqual(111, h.get("complex.X.A"));

            h.set("complex.X.B", 112);
            Y.Assert.areEqual(112, h.get("complex.X.B"));
            areObjectsReallyEqual({A:111, B:112}, h.get("complex.X"));

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
        },

        testModifyAttrs: function () {
            Y.Assert.isFunction(Y.BaseCore.modifyAttrs, 'Static `modifyAttrs()` method does not exist.');

            function MyBaseCore() {
                MyBaseCore.superclass.constructor.apply(this, arguments);
            }

            MyBaseCore.NAME = 'myBaseCore';

            MyBaseCore.ATTRS = {
                foo: {value: 'foo'},
                bar: {value: 'bar'}
            };

            Y.extend(MyBaseCore, Y.BaseCore);

            var myBaseCore = new MyBaseCore();
            Y.Assert.areSame('foo', myBaseCore.get('foo'));
            Y.Assert.areSame('bar', myBaseCore.get('bar'));
            Y.Assert.isUndefined(myBaseCore.get('baz'));

            // Modify the ATTRS via the API.
            Y.BaseCore.modifyAttrs(MyBaseCore, {
                foo: {value: 'FOO'},
                baz: {value: 'baz'}
            });

            myBaseCore = new MyBaseCore();
            Y.Assert.areSame('FOO', myBaseCore.get('foo'));
            Y.Assert.areSame('bar', myBaseCore.get('bar'));
            Y.Assert.areSame('baz', myBaseCore.get('baz'));
        }
    };

    var extendedTemplate = {

        name: "Extended Class Tests",

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
                initOnly: undefined
            };

            Y.Assert.areEqual(expectedVals.A, h.get("A"));
            Y.Assert.areEqual(expectedVals.B, h.get("B"));
            Y.Assert.areEqual(expectedVals.C, h.get("C"));   // Write once, set on first set.
            Y.Assert.areEqual(expectedVals.D, h.get("D"));   // Read Only
            Y.Assert.areEqual(expectedVals.E, h.get("E"));   // Write Once
            Y.Assert.areEqual(expectedVals.F, h.get("F"));
            Y.Assert.areEqual(expectedVals.DE, h.get("DE"));

            areObjectsReallyEqual(expectedVals, h.getAttrs());
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

            areObjectsReallyEqual(expectedVals, h.getAttrs(true));
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

            h.set("D", "MyNewDVal");
            h.set("E", "MyNewEVal");

            Y.Assert.areEqual("EXTDVAL", h.get("D"));
            Y.Assert.areEqual("exteval", h.get("E"));

            h._set("D", "TryDAgain");
            h._set("E", "TryEAgain");

            Y.Assert.areEqual("TRYDAGAIN", h.get("D"));
            Y.Assert.areEqual("tryeagain", h.get("E"));
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

            areObjectsReallyEqual({A:1111}, h.get("complex.X"));
            areObjectsReallyEqual({A:2222}, h.get("complex.Y"));
            areObjectsReallyEqual({A:3}, h.get("complex.Z"));

            var val = h.get("complex");

            Y.each(val, function(v, k) {
                areObjectsReallyEqual(v, o[k]);
            });
        },

        testComplexSet : function() {
            var h = this.createHost();

            h.set("complex.X.A", 111);
            Y.Assert.areEqual(111, h.get("complex.X.A"));

            h.set("complex.X.B", 112);
            Y.Assert.areEqual(112, h.get("complex.X.B"));
            areObjectsReallyEqual({A:111, B:112}, h.get("complex.X"));

            h.set("complex.W.B", 113);
            Y.Assert.areEqual(undefined, h.get("complex.W"));
            Y.Assert.areEqual(undefined, h.get("complex.W.B"));

                    h.set("complex.Y", {B:222});
            Y.Assert.areEqual(222, h.get("complex.Y.B"));
            Y.Assert.areEqual(undefined, h.get("complex.Y.A"));
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
        }
    };

    var perfTemplate = {

        name: "Performance Tests",

        testTimeConstruction: function() {
            var start, end, n = 20, t, i;

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test(null, false);
                t.getAttrs();
                t = null;
            }
            end = new Date().getTime();
            Y.log("Construction Time Populated (upfront): " + ((end-start)/n), "perf");

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test();
                t.getAttrs();
                t = null;
            }
            end = new Date().getTime();
            Y.log("Construction Time Populated (lazy): " + ((end-start)/n), "perf");

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test(null, false);
                t = null;
            }
            end = new Date().getTime();
            Y.log("Construction Time (upfront): " + ((end-start)/n), "perf");

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test();
                t = null;
            }
            end = new Date().getTime();

            var time = (end-start)/n;
            var expectedTime = (Y.UA.ie && Y.UA.ie <= 6) ? 15 : 10;

            Y.log("Construction Time (lazy): " + time, "perf");

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test(null, true, true);
                t = null;
            }
            end = new Date().getTime();
            Y.log("Construction Time (lazy and silent init): " + ((end-start)/n), "perf");

            Y.Assert.isTrue((time < expectedTime));
        },

        testStateForPerfSwitches : function() {
            var t;

            // Lazy
            t = new Test();
            var x = t.getAttrs();

            // Non Lazy (Upfront)
            t = new Test(null, false);
            var y = t.getAttrs();

            // Lazy and Silent
            t = new Test(null, true, true);
            var z = t.getAttrs();

            Y.Assert.areEqual(Y.dump(x), Y.dump(y), "Lazy vs. Upfront: attr state is not equal");
            Y.Assert.areEqual(Y.dump(y), Y.dump(z), "Upfront vs. Lazy and Silent: attr state is not equal");
        }
    };

    var suite = new Y.Test.Suite("Base Core");

    suite.add(new Y.Test.Case(coreTemplate));

    suite.add(new Y.Test.Case(basicTemplate));
    suite.add(new Y.Test.Case(extendedTemplate));

    suite.add(new Y.Test.Case(basicTemplate));
    suite.add(new Y.Test.Case(extendedTemplate));

    Y.Test.Runner.add(suite);
    Y.Test.Runner.setName("Base Core Tests");

});
