YUI.add('perf-component', function (Y) {

Y.Performance.addTestGroup({
    name   : 'Default',
    suite  : 'Component Tests',
    version: '2010-05-28',

    tests: {
        "Extend Y.Base with 1 attr + Instantiation": {
            bootstrapYUI: true,
            asyncSetup: true,
            duration: 2000,
            iterations: 10,

            setup : function() {
                window.Y = YUI().use('base', function() {
                    done();
                });
            },

            test: function () {
            
                function MyClass() {
                    MyClass.superclass.constructor.apply(this, arguments);
                }

                MyClass.NAME = "myClass";
            
                MyClass.ATTRS = {
                    a: {value:1}
                };

                Y.extend(MyClass, Y.Base);
                var foo = new MyClass();
                done();
            }
        },

        "Extend Y.Widget with 1 attr + Instantiation": {
            bootstrapYUI: true,
            asyncSetup: true,
            duration: 2000,
            iterations: 10,

            setup : function() {
                window.Y = YUI().use('widget', function() {
                    done();
                });
            },

            test: function () {
                function MyWidget() {
                    MyWidget.superclass.constructor.apply(this, arguments);
                }

                MyWidget.NAME  = 'myWidget';

                MyWidget.ATTRS = {
                    a: {value:1}
                };

                Y.extend(MyWidget, Y.Widget, {
                    renderUI: function () {},
                    bindUI  : function () {},
                    syncUI  : function () {}
                });

                var foo = new MyWidget();

                done();
            }
        },

        "Extend Y.Widget with 1 attr + Instantiation + Render": {
            bootstrapYUI: true,
            asyncSetup: true,
            duration: 2000,
            iterations: 10,

            setup : function() {
                window.Y = YUI().use('widget', function() {
                    done();
                });
            },

            test: function () {
                function MyWidget() {
                    MyWidget.superclass.constructor.apply(this, arguments);
                }

                MyWidget.NAME  = 'myWidget';

                MyWidget.ATTRS = {
                    a: {value:1}
                };

                Y.extend(MyWidget, Y.Widget, {
                    renderUI: function () {},
                    bindUI  : function () {},
                    syncUI  : function () {}
                });

                var foo = new MyWidget();
                foo.render();

                done();
            }
        },

        "YUI().use('base') +  Extend Y.Base with 1 attr + Instantiation": {
            bootstrapYUI: true,
            duration: 2000,
            iterations: 10,
            warmup: true,

            test: function () {
                YUI().use('base', function(Y) {

                    function MyClass() {
                        MyClass.superclass.constructor.apply(this, arguments);
                    }

                    MyClass.NAME = "myClass";
                
                    MyClass.ATTRS = {
                        a: {value:1}
                    };
    
                    Y.extend(MyClass, Y.Base);
                    var foo = new MyClass();
                    done();
                });
            }
        },

        "YUI().use('widget') + Extend Y.Widget with 1 attr + Instantiation": {
            bootstrapYUI: true,
            duration: 2000,
            iterations: 10,
            warmup: true,

            test: function () {
                YUI().use("widget", function(Y) {
                    function MyWidget() {
                        MyWidget.superclass.constructor.apply(this, arguments);
                    }

                    MyWidget.NAME  = 'myWidget';

                    MyWidget.ATTRS = {
                        a: {value:1}
                    };

                    Y.extend(MyWidget, Y.Widget, {
                        renderUI: function () {},
                        bindUI  : function () {},
                        syncUI  : function () {}
                    });

                    var foo = new MyWidget();
                    done();
                });
            }
        },
    
        "YUI().use('widget') + Extend Y.Widget with 1 attr + Instantiation + Render": {
            bootstrapYUI: true,
            duration: 2000,
            iterations: 10,
            warmup: true,

            test: function () {
                YUI().use("widget", function(Y) {
                    function MyWidget() {
                        MyWidget.superclass.constructor.apply(this, arguments);
                    }

                    MyWidget.NAME  = 'myWidget';

                    MyWidget.ATTRS = {
                        a: {value:1}
                    };

                    Y.extend(MyWidget, Y.Widget, {
                        renderUI: function () {},
                        bindUI  : function () {},
                        syncUI  : function () {}
                    });
    
                    var foo = new MyWidget();
                    foo.render();

                    done();
                });
            }
        },

        "YUI().use('overlay') + Overlay instantiation + render": {
            bootstrapYUI: true,
            duration: 2000,
            iterations: 10,
            warmup: true,

            test: function () {
                YUI().use('overlay', function(Y) {
                    var o = new Y.Overlay({
                        headerContent:"Header",
                        bodyContent:"Body",
                        footerContent:"Footer"
                    });
                    o.render();
                    done();
                });
            }
        },

        "YUI().use('tabview') + TabView with 3 tabs instantiation + render": {
            bootstrapYUI: true,
            duration: 2000,
            iterations: 10,
            warmup: true,

            setup: function () {
                window.tabViewContainer = document.body.appendChild(
                        document.createElement('div'));
            },

            teardown: function () {
                document.body.removeChild(window.tabViewContainer);
            },

            test: function () {
                YUI().use('tabview', function(Y) {
                    var tabview = new Y.TabView({
                        children: [{
                            label: 'foo',
                            content: '<p>foo content</p>'
                        }, {
                            label: 'bar',
                            content: '<p>bar content</p>'
                        }, {
                            label: 'baz',
                            content: '<p>baz content</p>'
                        }]
                    });

                    tabview.render(window.tabViewContainer);
                    done();
                });
            }
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
