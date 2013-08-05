var suite = new PerfSuite({
    name: 'Y.Base performance tests',
    yui: {
        use: ['base']
    },
    global: {
        setup: function () {
            var MyBase20 = function() {
                MyBase20.superclass.constructor.apply(this, arguments);
            };

            Y.extend(MyBase20, Y.Base);

            MyBase20.NAME = 'myBase20';

            MyBase20.ATTRS = {

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
                    value: 10
                },

                attr8: {
                    value: {}
                },

                attr9: {
                    value: []
                },

                attr10: {
                    value: "Foobar"
                },

                attr11: {
                    value: 25
                },

                attr12: {
                    value: null
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

            var MyBase10 = function() {
                MyBase10.superclass.constructor.apply(this, arguments);
            };

            Y.extend(MyBase10, Y.Base);

            MyBase10.NAME = 'myBase10';

            MyBase10.ATTRS = {

                attr1: {
                    value: "Foo"
                },

                attr2: {
                    value: "Bar"
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
                    value: false
                },

                attr7: {
                    value: 10
                },

                attr8: {
                    value: true
                },

                attr9: {
                    value: false
                },

                attr10: {
                    value: null
                }
            };

            var MyBase = function() {
               MyBase.superclass.constructor.apply(this, arguments);
            };

            MyBase.NAME = "myBase";

            Y.extend(MyBase, Y.Base);

            // MyBaseCore

            var MyBaseCore20 = function() {
                MyBaseCore20.superclass.constructor.apply(this, arguments);
            };

            Y.extend(MyBaseCore20, Y.BaseCore);

            MyBaseCore20.NAME = 'myBase20';

            MyBaseCore20.ATTRS = {

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
                    value: 10
                },

                attr8: {
                    value: {}
                },

                attr9: {
                    value: []
                },

                attr10: {
                    value: "Foobar"
                },

                attr11: {
                    value: 25
                },

                attr12: {
                    value: null
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

            var MyBaseCore20Ideal = function() {
                MyBaseCore20Ideal.superclass.constructor.apply(this, arguments);
            };

            Y.extend(MyBaseCore20Ideal, Y.BaseCore);

            MyBaseCore20Ideal.NAME = 'myBaseCore20Ideal';

            MyBaseCore20Ideal.ATTRS = {

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
                    value: 10
                },

                attr8: {
                    valueFn: function() {
                        return {};
                    }
                },

                attr9: {
                    valueFn : function() {
                        return [];
                    }
                },

                attr10: {
                    value: "Foobar"
                },

                attr11: {
                    value: 25
                },

                attr12: {
                    value: null
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
                    valueFn: function() {
                        return ['default'];
                    },

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

            var MyBaseCore10 = function() {
                MyBaseCore10.superclass.constructor.apply(this, arguments);
            };

            Y.extend(MyBaseCore10, Y.BaseCore);

            MyBaseCore10.NAME = 'myBaseCore10';

            MyBaseCore10.ATTRS = {

                attr1: {
                    value: "Foo"
                },

                attr2: {
                    value: "Bar"
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
                    value: false
                },

                attr7: {
                    value: 10
                },

                attr8: {
                    value: true
                },

                attr9: {
                    value: false
                },

                attr10: {
                    value: null
                }
            };

            var MyBaseCore = function() {
               MyBaseCore.superclass.constructor.apply(this, arguments);
            };

            MyBaseCore.NAME = "myBaseCore";

            Y.extend(MyBaseCore, Y.BaseCore);

            var MyModelCore = function() {
                MyModelCore.superclass.constructor.apply(this, arguments);
            };

            MyModelCore.NAME = "myModel";

            Y.extend(MyModelCore, Y.BaseCore, {
                _allowAdHocAttrs : true
            });

            var MyModel = function() {
                MyModel.superclass.constructor.apply(this, arguments);
            };

            MyModel.NAME = "myModel";

            Y.extend(MyModel, Y.Base, {
                _allowAdHocAttrs : true
            });

            var GLOBAL_MY_BASE_10 = new MyBase10();
            var UNIQUE_VALUE = 10;
            var OPTS = {src:'internal'};
        }
    },
    tests: [
        {
            name: 'Base',
            fn: function () {
                var b = new Y.Base();
            }
        },
        {
            name: 'MyBase',
            fn: function () {
                var b = new MyBase();
            }
        },
        {
            name: 'MyBase with 10 simple value attributes',
            fn: function () {
                var b = new MyBase10();
            }
        },
        {
            name: 'MyBase with 20 varied attributes',
            fn: function () {
               var b = new MyBase20();
            }
        },
        {
            name: 'MyBase with 10 simple value attributes - set',
            fn: function () {
                GLOBAL_MY_BASE_10.set("attr4", UNIQUE_VALUE++);
            }
        },
        {
            name: 'MyBase with 10 simple value attributes - set with opts',
            fn: function () {
                GLOBAL_MY_BASE_10.set("attr4", UNIQUE_VALUE++, OPTS);
            }
        },
        {
            name: 'MyBase with 10 simple value attributes - get',
            fn: function () {
                var val = GLOBAL_MY_BASE_10.get("attr2");
            }
        },
        {
            name: 'BaseCore',
            fn: function () {
                var b = new Y.BaseCore();
            }
        },
        {
            name: 'MyBaseCore',
            fn: function () {
               var b = new MyBaseCore();
            }
        },
        {
            name: 'MyBaseCore with 10 simple value attributes',
            fn: function () {
               var b = new MyBaseCore10();
            }
        },
        {
            name: 'MyBaseCore with 20 varied attributes',
            fn: function () {
               var b = new MyBaseCore20();
            }
        },
        {
            name: 'MyBaseCore with 20 varied attributes (using perf. best practices)',
            fn: function () {
               var b = new MyBaseCore20Ideal();
            }
        },
        {
            name: 'MyModelCore with 2 ad-hoc attrs',
            fn: function () {
                var b = new MyModelCore({
                    label : 1,
                    description : "01234567890"
                });
            }
        },
        {
            name: 'MyModel with 2 ad-hoc attrs',
            fn: function () {
                var b = new MyModel({
                    label : 1,
                    description : "01234567890"
                });
            }
        }
    ]
});
