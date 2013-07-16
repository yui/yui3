YUI.add('plugin-tests', function(Y) {


            function PluginOne() {
                PluginOne.superclass.constructor.apply(this, arguments);
            }
            PluginOne.NS = "one";
            PluginOne.NAME = "pluginOne";
            PluginOne.ATTRS = {
                a: {
                    value:1
                }
            };

            Y.extend(PluginOne, Y.Plugin.Base, {
                initializer: function() {
                },
                method : function() {
                }
            });

            // ---

            function PluginTwo() {
                PluginTwo.superclass.constructor.apply(this, arguments);
            }
            PluginTwo.NS = "two";
            PluginTwo.NAME = "pluginTwo";
            PluginTwo.ATTRS = {
                b: {
                    value:2
                }
            };
            Y.extend(PluginTwo, Y.Plugin.Base, {
                initializer: function() {
                },
                method : function() {
                }
            });

            // ---

            var PluginThree = Y.Base.create("pluginThree", Y.Plugin.Base, [], {
                initializer: function() {
                },
                method : function() {
                }
            }, {
                NS : "three",
                ATTRS : {
                    c: {
                        value:3
                    }
                }
            });

            // ---

            function PluginFour() {
                PluginFour.superclass.constructor.apply(this, arguments);
            }
            PluginFour.NS = "four";
            PluginFour.NAME = "pluginFour";
            PluginFour.ATTRS = {
                d: {
                    value:4
                }
            };

            Y.extend(PluginFour, Y.Plugin.Base, {
                initializer: function(cfg) {
                    this.doBefore("methodA", this._methodA, this);
                    this.doAfter("methodB", this._methodB, this);
                    this.doBefore("mainAChange", this._onAChange);
                    this.doAfter("mainBChange", this._afterBChange);
                },

                _methodA : function(stack) {
                    stack.push("PluginFour.methodA");
                },

                _methodB : function(stack) {
                    stack.push("PluginFour.methodB");
                },

                _onAChange : function(e) {
                    if (e.stack) {
                        e.stack.push("PluginFour._onAChange");
                    }
                },

                _afterBChange : function(e) {
                    if (e.stack) {
                        e.stack.push("PluginFour._afterBChange");
                    }
                }
            });

            function Host(config) {
                Host.superclass.constructor.apply(this, arguments);
            }

            Host.NAME = "host";
            Host.ATTRS = {
                mainA : {
                    value: "mainA"
                },
                mainB : {
                    value: "mainB"
                }
            };

            Y.extend(Host, Y.Base, {
                methodA : function(stack) {
                    if (stack) {
                        stack.push("Host.methodA");
                    }
                },

                methodB : function(stack) {
                    if (stack) {
                        stack.push("Host.methodB");
                    }
                },

                initializer : function() {
                }
            });

            function ExtendedHost() {
                ExtendedHost.superclass.constructor.apply(this, arguments);
            }

            Y.extend(ExtendedHost, Host, {
                methodC : function() {},
                initializer : function() {}
            });

            var basicTemplate = {

                name: "Basic Tests",

                testPlugDuringConstruction : function() {
                    var h1 = new Host({
                        plugins:[PluginOne, {fn:PluginTwo, cfg:{two:4}}, {fn:PluginThree, cfg:{three:6}}]
                    });

                    Y.ObjectAssert.ownsKey("one", h1);
                    Y.Assert.isInstanceOf(PluginOne, h1.one);
                    Y.ObjectAssert.ownsKey("two", h1);
                    Y.Assert.isInstanceOf(PluginTwo, h1.two);
                    Y.ObjectAssert.ownsKey("three", h1);
                    Y.Assert.isInstanceOf(PluginThree, h1.three);

                    var h2 = new Host({
                        plugins:[PluginOne, PluginTwo]
                    });

                    Y.ObjectAssert.ownsKey("one", h2);
                    Y.Assert.isInstanceOf(PluginOne, h2.one);
                    Y.ObjectAssert.ownsKey("two", h2);
                    Y.Assert.isInstanceOf(PluginTwo, h2.two);
                    Y.Assert.isUndefined(h2.three);
                },

                testPlugUsingPlug : function() {
                    var h1 = new Host();

                    h1.plug(PluginOne);
                    h1.plug(PluginTwo, {two:4});
                    h1.plug({fn:PluginThree, cfg:{three:6}});

                    Y.ObjectAssert.ownsKey("one", h1);
                    Y.Assert.isInstanceOf(PluginOne, h1.one);

                    Y.ObjectAssert.ownsKey("two", h1);
                    Y.Assert.isInstanceOf(PluginTwo, h1.two);

                    Y.ObjectAssert.ownsKey("three", h1);
                    Y.Assert.isInstanceOf(PluginThree, h1.three);

                    var h2 = new Host();
                    h2.plug([PluginOne, {fn:PluginTwo, cfg:{two:8}}]);

                    Y.ObjectAssert.ownsKey("one", h2);
                    Y.Assert.isInstanceOf(PluginOne, h2.one);

                    Y.ObjectAssert.ownsKey("two", h2);
                    Y.Assert.isInstanceOf(PluginTwo, h2.two);

                    Y.Assert.isUndefined(h2.three);
                },

                testUnplug : function() {

                    var h1 = new Host({
                        plugins:[PluginOne, PluginTwo]
                    });

                    Y.ObjectAssert.ownsKey("one", h1);
                    Y.Assert.isInstanceOf(PluginOne, h1.one);

                    Y.ObjectAssert.ownsKey("two", h1);
                    Y.Assert.isInstanceOf(PluginTwo, h1.two);

                    h1.unplug("one");

                    Y.Assert.isUndefined(h1.one);

                    Y.ObjectAssert.ownsKey("two", h1);
                    Y.Assert.isInstanceOf(PluginTwo, h1.two);

                    h1.unplug(PluginTwo);

                    Y.Assert.isUndefined(h1.one);
                    Y.Assert.isUndefined(h1.two);
                },
                
                testUnplugNonExistant : function() {
                    var h1 = new Host();

                    var NonExistant = function() {}
                    NonExistant.NS = "foo";
                    
                    var SharedNS = function() {}
                    SharedNS.NS = "one";

                    try {
                        h1.unplug("foo");
                        h1.unplug(NonExistant);
                    } catch (e) {
                        Y.Assert.fail("Error unplugging a non-plugged in plugin");
                    }

                    h1.plug(PluginOne);
                    
                    try {
                        // Unplugging a diff plugin with the same NS
                        h1.unplug(SharedNS);                        
                    } catch (e) {
                        Y.Assert.fail("Error unplugging a plugin which shares a NS with a plugged in plugin");
                    }

                    Y.Assert.isTrue(h1.one instanceof PluginOne);
                },

                testUnplugPlug : function() {

                    var h1 = new Host({
                        plugins:[PluginOne, PluginTwo]
                    });

                    Y.ObjectAssert.ownsKey("one", h1);
                    Y.Assert.isInstanceOf(PluginOne, h1.one);

                    Y.ObjectAssert.ownsKey("two", h1);
                    Y.Assert.isInstanceOf(PluginTwo, h1.two);

                    h1.unplug(PluginOne);

                    Y.Assert.isUndefined(h1.one);

                    h1.plug(PluginOne);

                    Y.ObjectAssert.ownsKey("one", h1);
                    Y.Assert.isInstanceOf(PluginOne, h1.one);
                },

                testPluginHost : function() {
                    var h1 = new Host();
                    h1.plug(PluginOne);

                    Y.Assert.areSame(h1, h1.one.get("host"));
                },

                testPlugFormatsDefault : function() {
                    var h1 = new Host();
                    h1.plug(PluginOne);
                    Y.Assert.areEqual(1, h1.one.get("a"));
                },

                testPlugFormatsCustom : function() {
                    var h1 = new Host();
                    h1.plug(PluginOne, {a:10});
                    Y.Assert.areEqual(10, h1.one.get("a"));
                },

                testPlugFormatsCustomLiteral : function() {
                    var h1 = new Host();
                    h1.plug({fn:PluginOne, cfg:{a:10}});
                    Y.Assert.areEqual(10, h1.one.get("a"));
                },

                testPlugFormatsArrayDefault : function() {
                    var h1 = new Host();
                    h1.plug([PluginOne, PluginTwo]);
                    Y.Assert.areEqual(1, h1.one.get("a"));
                    Y.Assert.areEqual(2, h1.two.get("b"));
                },

                testPlugFormatsArrayCustom : function() {
                    var h1 = new Host();
                    h1.plug([{fn:PluginOne, cfg:{a:10}}, {fn:PluginTwo, cfg:{b:20}}]);
                    Y.Assert.areEqual(10, h1.one.get("a"));
                    Y.Assert.areEqual(20, h1.two.get("b"));
                },

                testPlugFormatsArrayMixed : function() {
                    var h1 = new Host();
                    h1.plug([{fn:PluginOne, cfg:{a:10}}, PluginTwo]);
                    Y.Assert.areEqual(10, h1.one.get("a"));
                    Y.Assert.areEqual(2, h1.two.get("b"));
                },

                testPlugSamePluginTwice : function() {
                    var h1 = new Host();

                    var expectedEvents = ["PluginOne destroy"];
                    var actualEvents = [];

                    h1.plug(PluginOne, {a:10});
                    Y.Assert.areEqual(10, h1.one.get("a"));

                    h1.one.on("destroy", function(e) {
                        actualEvents.push("PluginOne destroy");
                    });

                    h1.plug(PluginOne, {a:20});
                    Y.Assert.areEqual(20, h1.one.get("a"));

                    h1.unplug(PluginOne);
                },

                testPlugSameNonAttrPluginTwice : function() {
                    var h1 = new Host();

                    var NonAttrPlugin = function(cfg) {
                        this.a = cfg.a;
                    };
                    NonAttrPlugin.NS = "nonAttrPlugin";
                    NonAttrPlugin.prototype.getA = function() {
                        return this.a;
                    };

                    h1.plug(NonAttrPlugin, {a:10});
                    Y.Assert.areEqual(10, h1.nonAttrPlugin.getA());

                    var orig = h1.nonAttrPlugin;

                    h1.plug(NonAttrPlugin, {a:20});
                    Y.Assert.areEqual(10, h1.nonAttrPlugin.getA());

                    Y.Assert.isTrue(h1.nonAttrPlugin === orig, "Expected the same plugin instance");

                    h1.unplug(NonAttrPlugin);

                    Y.Assert.isFalse("nonAttrPlugin" in h1, "Didn't expect nonAttrPlugin namespace to still exist");
                },

                testPluginHostReference : function() {

                    var h1 = new Host();
                    h1.plug(PluginOne);

                    Y.Assert.areEqual(h1, h1.one.get("host"));

                    h1.one.set("host", this);

                    Y.Assert.areEqual(h1, h1.one.get("host"));    
                },

                testPluginEventListeners : function() {

                    var h1 = new Host(), stack;

                    stack = [];
                    h1.set("mainA", 10, {stack:stack});
                    h1.set("mainB", 20, {stack:stack});

                    Y.ArrayAssert.itemsAreEqual([], stack);

                    h1.plug(PluginFour);

                    h1.set("mainA", 11, {stack:stack});
                    h1.set("mainB", 21, {stack:stack});

                    Y.ArrayAssert.itemsAreEqual(["PluginFour._onAChange", "PluginFour._afterBChange"], stack);

                    h1.unplug(PluginFour);

                    stack = [];
                    h1.set("mainA", 12, {stack:stack});
                    h1.set("mainB", 22, {stack:stack});

                    Y.ArrayAssert.itemsAreEqual([], stack);
                },

                testPluginMethodInjection : function() {
                    var h1 = new Host(), stack;

                    stack = [];
                    h1.methodA(stack);
                    h1.methodB(stack);

                    Y.ArrayAssert.itemsAreEqual(["Host.methodA", "Host.methodB"], stack);

                    h1.plug(PluginFour);

                    stack = [];
                    h1.methodA(stack);
                    h1.methodB(stack);

                    Y.ArrayAssert.itemsAreEqual(["PluginFour.methodA", "Host.methodA", "Host.methodB", "PluginFour.methodB"], stack);

                    h1.unplug(PluginFour);

                    stack = [];
                    h1.methodA(stack);
                    h1.methodB(stack);

                    Y.ArrayAssert.itemsAreEqual(["Host.methodA", "Host.methodB"], stack);
                },

                // Execute Last - will affect Host, ExtendedHost classes on the page
                testStaticPlug : function() {

                    Y.Base.plug(Host, PluginOne);
                    Y.Base.plug(Host, [{fn:PluginTwo, cfg:{}}, PluginThree]);

                    var h1 = new Host();

                    Y.ObjectAssert.ownsKey("one", h1);
                    Y.Assert.isInstanceOf(PluginOne, h1.one);

                    Y.ObjectAssert.ownsKey("two", h1);
                    Y.Assert.isInstanceOf(PluginTwo, h1.two);

                    Y.ObjectAssert.ownsKey("three", h1);
                    Y.Assert.isInstanceOf(PluginThree, h1.three);

                    Y.Base.unplug(Host, PluginThree);

                    // ---

                    Y.Base.plug(ExtendedHost, PluginThree);
                    Y.Base.unplug(ExtendedHost, PluginOne);

                    var h2 = new Host();

                    Y.ObjectAssert.ownsKey("one", h2);
                    Y.Assert.isInstanceOf(PluginOne, h2.one);
                    Y.ObjectAssert.ownsKey("two", h2);
                    Y.Assert.isInstanceOf(PluginTwo, h2.two);
                    Y.Assert.isUndefined(h2.three);

                    var h3 = new ExtendedHost();

                    Y.Assert.isUndefined(h3.one);
                    Y.ObjectAssert.ownsKey("two", h3);
                    Y.Assert.isInstanceOf(PluginTwo, h3.two);

                    Y.ObjectAssert.ownsKey("three", h3);
                    Y.Assert.isInstanceOf(PluginThree, h3.three);
                },

                testHostDestroy : function() {

                    var h1 = new Host({
                        plugins:[PluginOne, PluginTwo]
                    });

                    var destroyed = [];
                    h1.one.after("destroy", function(e) {
                        destroyed.push("one");
                    });
                    h1.two.after("destroy", function(e) {
                        destroyed.push("two");
                    });

                    h1.destroy();

                    Y.Assert.isUndefined(h1.one);
                    Y.Assert.isUndefined(h1.two);

                    Y.ArrayAssert.itemsAreEqual(["one", "two"], destroyed);


                }

            };

            var suite = new Y.Test.Suite("Plugin Host");
            suite.add(new Y.Test.Case(basicTemplate));

            Y.Test.Runner.add(suite);

});
