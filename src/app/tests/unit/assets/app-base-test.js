YUI.add('app-base-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    html5       = Y.Router.html5,
    win         = Y.config.win,
    originalURL = (win && win.location.toString()) || '',

    suite,
    appBaseSuite;

function resetURL() {
    if (html5) {
        win && win.history.replaceState(null, null, originalURL);
    } else {
        win && (win.location.hash = '');
    }
}

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App'));

// -- App Base Suite -----------------------------------------------------------
appBaseSuite = new Y.Test.Suite({
    name: 'App Base',

    setUp: function () {
        resetURL();
    },

    tearDown: function () {
        resetURL();
    }
});

// -- App Base: Lifecycle ------------------------------------------------------
appBaseSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.app && this.app.destroy();
        delete this.app;
    },

    '`container` should default to the `<body>`': function () {
        var app = this.app = new Y.App();
        Assert.areSame(Y.one('body'), app.get('container'));
    },

    'A specified `container` should be used during construction': function () {
        var container = Y.Node.create('<div/>'),
            app       = this.app = new Y.App({container: container});

        Assert.areSame(container, app.get('container'));
    },

    '`viewContainer` should be a new `<div/>` by default': function () {
        var app = this.app = new Y.App();
        Assert.isTrue(app.get('viewContainer').test('div'));
    },

    'A specified `viewContainer` should be used during construction': function () {
        var viewContainer = Y.Node.create('<div/>'),
            app           = this.app = new Y.App({viewContainer: viewContainer});

        Assert.areSame(viewContainer, app.get('viewContainer'));
    },

    '`activeView` should be undefined by default': function () {
        var app = this.app = new Y.App();
        Assert.areSame(null, app.get('activeView'));
    },

    '`activeView` should not be overrideable in the constructor config': function () {
        var app = this.app = new Y.App({
            activeView: new Y.View()
        });

        Assert.areSame(null, app.get('activeView'));
    },

    '`linkSelector` should be `"a"` by default': function () {
        var app = this.app = new Y.App();
        Assert.areSame('a', app.get('linkSelector'));
    },

    '`serverRouting` should default to undefined': function () {
        var app = this.app = new Y.App();
        Assert.areSame(undefined, app.get('serverRouting'));
    },

    '`serverRouting` should be overrideable via the constructor': function () {
        var app = this.app = new Y.App({
            serverRouting: true
        });

        Assert.areSame(true, app.get('serverRouting'));
    },

    '`views` property should be empty by default': function () {
        var app = this.app = new Y.App();

        Assert.isObject(app.views);
        Assert.isTrue(Y.Object.isEmpty(app.views));
    },

    '`views` should be a copy of the `views` object on the prototype': function () {
        var MyApp, app;

        MyApp = Y.Base.create('myApp', Y.App, [], {
            views: {
                home: {
                    preserve: true
                }
            }
        });

        app = this.app = new MyApp();

        Assert.isFalse(app.views === MyApp.prototype.views);
        Assert.isFalse(Y.Object.isEmpty(app.views));
        Assert.isTrue(app.views.home.preserve);
        Assert.areSame(app.views.home.preserve, MyApp.prototype.views.home.preserve);
    },

    'Destroying an app with `{remove: true}` should destroy its `container` and `viewContainer`': function () {
        var container     = Y.Node.create('<div/>'),
            viewContainer = Y.Node.create('<div/>'),
            app;

        app = this.app = new Y.App({
            container    : container,
            viewContainer: viewContainer
        });

        app.render().get('container').appendTo('body');

        Assert.areSame(container, app.get('container'));
        Assert.areSame(viewContainer, app.get('viewContainer'));
        Assert.isTrue(container.inDoc(Y.config.doc));
        Assert.isTrue(Y.one('body').contains(container));
        Assert.isTrue(viewContainer.inDoc(Y.config.doc));
        Assert.isTrue(Y.one('body').contains(viewContainer));
        Assert.isTrue(container.contains(viewContainer));

        app.destroy({remove: true});

        Assert.isFalse(Y.one('body').contains(container));
        Assert.isFalse(container.inDoc(Y.config.doc));
        Assert.isFalse(container.contains(viewContainer));
        Assert.isFalse(Y.one('body').contains(viewContainer));
        Assert.isFalse(viewContainer.inDoc(Y.config.doc));
    },

    'Destroying an app with `{remove: true}` with the `<body>` for a container should only remove its CSS classes, not the body from the DOM': function () {
        var app = this.app = new Y.App({
            container    : 'body',
            viewContainer: 'body'
        });

        app.render();
        app.destroy({remove: true});

        Assert.isTrue(Y.one('body').compareTo(app.get('container')));
        Assert.isTrue(Y.one('body').inDoc(Y.config.doc));
        Assert.isFalse(Y.one('body').hasClass(Y.App.CLASS_NAMES.app));
        Assert.isFalse(Y.one('body').hasClass(Y.App.CLASS_NAMES.views));
    }
}));

// -- App Base: Attributes -----------------------------------------------------
appBaseSuite.add(new Y.Test.Case({
    name: 'Attributes',

    setUp: function () {
        this.html5         = Y.Router.html5;
        this.serverRouting = Y.App.serverRouting;
    },

    tearDown: function () {
        Y.Router.html5 = this.html5;
        delete this.html5;

        Y.App.serverRouting = this.serverRouting;
        delete this.serverRouting;

        this.app && this.app.destroy({remove: true});
        delete this.app;
    },

    '`activeView` should be read-only': function () {
        var view = new Y.View(),
            app  = this.app = new Y.App();

        Assert.areSame(null, app.get('activeView'));
        app.set('activeView', view);
        Assert.areSame(null, app.get('activeView'));
    },

    '`activeView` should be modifiable via the `showView()` method': function () {
        var view = new Y.View(),
            app  = this.app = new Y.App();

        Assert.areSame(null, app.get('activeView'));
        app.showView(view);
        Assert.areSame(view, app.get('activeView'));
    },

    '`container` and `viewContainer` should be able to be the same node': function () {
        var app = this.app = new Y.App({
            container    : 'body',
            viewContainer: 'body'
        });

        app.render();

        Assert.areSame(Y.one('body'), app.get('container'));
        Assert.areSame(Y.one('body'), app.get('viewContainer'));
        Assert.areSame(app.get('container'), app.get('viewContainer'));
        Assert.isTrue(app.get('container').compareTo(app.get('viewContainer')));
    },

    '`container` should be stamped with the App CSS class': function () {
        var app = this.app = new Y.App();
        app.render();
        Assert.isTrue(app.get('container').hasClass(Y.App.CLASS_NAMES.app));
        Assert.areSame('yui3-app', Y.App.CLASS_NAMES.app);
    },

    '`viewContainer` should be stamped with the App Views CSS class when the app is rendered': function () {
        var app = this.app = new Y.App();
        app.render();
        Assert.isTrue(app.get('viewContainer').hasClass(Y.App.CLASS_NAMES.views));
        Assert.areSame('yui3-app-views', Y.App.CLASS_NAMES.views);
    },

    '`viewContainer` should only be settable during initialization': function () {
        var viewContainer = new Y.View(),
            app           = this.app = new Y.App();

        app.set('viewContainer', viewContainer);
        Assert.areNotSame(viewContainer, app.get('viewContainer'));
    },

    '`Y.App.serverRouting` should be `undefined` by default': function () {
        Assert.areSame(undefined, Y.App.serverRouting);
    },

    '`serverRouting` should default to the value of `Y.App.serverRouting`': function () {
        var app = this.app = new Y.App();

        Assert.areSame(undefined, Y.App.serverRouting);
        Assert.areSame(Y.App.serverRouting, app.get('serverRouting'));

        app.destroy();

        Y.App.serverRouting = true;
        app = this.app = new Y.App();

        Assert.isTrue(Y.App.serverRouting);
        Assert.areSame(Y.App.serverRouting, app.get('serverRouting'));
    },

    '`serverRouting` should only be settable during initialization': function () {
        var app = this.app = new Y.App();

        Assert.areSame(undefined, app.get('serverRouting'));
        app.set('serverRouting', true);
        Assert.areSame(undefined, app.get('serverRouting'));
    },

    '`serverRouting` should only be settable with a user-specified value during initialization': function () {
        var app = this.app = new Y.App({serverRouting: true});

        Assert.areSame(true, app.get('serverRouting'));
        app.set('serverRouting', false);
        Assert.areSame(true, app.get('serverRouting'));
    },

    'Setting `serverRouting` to `false` should force `html5` to default to `false` in HTML5 browsers': function () {
        Y.Router.html5 = true;

        var app = this.app = new Y.App({serverRouting: false});

        Assert.areSame(false, app.get('serverRouting'));
        Assert.areSame(false, app.get('html5'));
    },

    'Setting `serverRouting` to `false` should force `html5` to default to `false` in non-HTML5 browsers': function () {
        Y.Router.html5 = false;

        var app = this.app = new Y.App({serverRouting: false});

        Assert.areSame(false, app.get('serverRouting'));
        Assert.areSame(false, app.get('html5'));
    },

    'Setting `serverRouting` to `true` should allow `html5` to default to `true` in HTML5 browsers': function () {
        Y.Router.html5 = true;

        var app = this.app = new Y.App({serverRouting: true});

        Assert.areSame(true, app.get('serverRouting'));
        Assert.areSame(true, app.get('html5'));
    },

    'Setting `serverRouting` to `true` should allow `html5` to default to `false` in non-HTML5 browsers': function () {
        Y.Router.html5 = false;

        var app = this.app = new Y.App({serverRouting: true});

        Assert.areSame(true, app.get('serverRouting'));
        Assert.areSame(false, app.get('html5'));
    },

    'Setting `serverRouting` to `undefined` should allow `html5` to default to `true` in HTML5 browsers': function () {
        Y.Router.html5 = true;

        var app = this.app = new Y.App({serverRouting: undefined});

        Assert.areSame(undefined, app.get('serverRouting'));
        Assert.areSame(true, app.get('html5'));
    },

    'Setting `serverRouting` to `undefined` should allow `html5` to default to `false` in non-HTML5 browsers': function () {
        Y.Router.html5 = false;

        var app = this.app = new Y.App({serverRouting: undefined});

        Assert.areSame(undefined, app.get('serverRouting'));
        Assert.areSame(false, app.get('html5'));
    },

    '`html5` should be overridable on construction even when `serverRouting` is false': function () {
        var app = this.app = new Y.App({
            serverRouting: false,
            html5        : true
        });

        Assert.areSame(false, app.get('serverRouting'));
        Assert.areSame(true, app.get('html5'));
    }
}));

// -- App Base: Events ---------------------------------------------------------
appBaseSuite.add(new Y.Test.Case({
    name: 'Events',

    setUp: function () {
        this.html5 = Y.Router.html5;
    },

    tearDown: function () {
        resetURL();

        Y.Router.html5 = this.html5;
        delete this.html5;

        this.app && this.app.destroy();
        delete this.app;
    },

    '`navigate` should fire when `serverRouting` is falsy, even when `html5` is `false`': function () {
        Y.Router.html5 = false;

        var app        = this.app = new Y.App(),
            eventCalls = 0,
            routeCalls = 0,
            test       = this;

        app.route('/foo/', function () {
            routeCalls += 1;
        });

        app.on('navigate', function (e) {
            eventCalls += 1;
        });

        app.navigate('/foo/');

        test.wait(function () {
            Assert.areSame(1, eventCalls, 'Event should fire once.');
            Assert.areSame(1, routeCalls, 'Route should dispatch once.');
        }, 200);
    },

    '`navigate` event should fire when a link is clicked': function () {
        var app    = this.app = new Y.App(),
            called = 0,
            event;

        event = {
            button        : 1,
            currentTarget : Y.one('#link-foo'),
            preventDefault: function () {}
        };

        app.route('/foo/', function () {});

        app.once('navigate', function (e) {
            called += 1;

            e.preventDefault();

            Assert.areSame(event, e.originEvent);
            Assert.areSame(Y.one('#link-foo').get('href'), e.url);
        });

        // Fake click event.
        app._onLinkClick(event);

        Assert.areSame(1, called);
    }
}));

// -- App Base: Methods --------------------------------------------------------
appBaseSuite.add(new Y.Test.Case({
    name: 'Methods',

    tearDown: function () {
        this.app && this.app.destroy();
        delete this.app;
    },

    '`createView()` should always return a new `Y.View` instance': function () {
        var app = this.app = new Y.App();
        Assert.isInstanceOf(Y.View, app.createView());
    },

    '`createView()` should return a new instance of a named, registered view': function () {
        var MyView = Y.Base.create('myView', Y.View, []),
            app;

        app = this.app = new Y.App({
            views: {
                myview: {
                    type: MyView
                }
            }
        });

        Assert.isInstanceOf(MyView, app.createView('myview'));
    },

    '`createView()` should apply the specified `config` to the new `Y.View` instance': function () {
        var app       = this.app = new Y.App(),
            container = Y.Node.create('<div/>'),
            view      = app.createView(null, {container: container});

        Assert.isInstanceOf(Y.View, view);
        Assert.areSame(container, view.get('container'));
    },

    '`createView()` should apply the specified `config` to the new instance of a named, registered view': function () {
        var MyView    = Y.Base.create('myView', Y.View, []),
            container = Y.Node.create('<div/>'),
            app, view;

        app = this.app = new Y.App({
            views: {
                myview: {
                    type: MyView
                }
            }
        });

        view = app.createView('myview', {container: container});

        Assert.isInstanceOf(MyView, view);
        Assert.areSame(container, view.get('container'));
    },

    '`getViewInfo()` should return the metadata for a named, registered view': function () {
        var myviewInfo = {type: function () {}},
            app        = this.app = new Y.App({views: {myview: myviewInfo}});

        Assert.areSame(myviewInfo.type, app.getViewInfo('myview').type);
    },

    '`getViewInfo()` should return the metadata for a view constructed by `createView()`': function () {
        var TestView = Y.Base.create('testView', Y.View, []),
            app      = this.app = new Y.App({views: {myview: {type: TestView}}}),
            view     = app.createView('myview');

        Assert.isInstanceOf(Y.View, view);
        Assert.isInstanceOf(TestView, view);
        Assert.areSame(app.views.myview, app.getViewInfo(view));
    },

    '`render()` should append the `viewContainer` into the `container`': function () {
        var app           = this.app = new Y.App(),
            container     = app.get('container'),
            viewContainer = app.get('viewContainer');

        Assert.isFalse(container.contains(viewContainer));

        app.render();

        Assert.isTrue(container.contains(viewContainer));
    },

    '`render()` should properly handle the `container` already containing the `viewContainer': function () {
        var container     = Y.Node.create('<div/>'),
            viewContainer = Y.Node.create('<div/>'),
            app           = this.app = new Y.App({
                container    : container,
                viewContainer: viewContainer
            });

        container.appendChild(viewContainer);
        Assert.isTrue(container.contains(viewContainer));

        app.render();

        Assert.isTrue(container.contains(viewContainer));
    },

    '`render()` should properly handle the `container` and `viewContainer` being the same node': function () {
        var node = Y.Node.create('<div/>'),
            app  = this.app = new Y.App({
                container    : node,
                viewContainer: node
            });

        Assert.areSame(node, app.get('container'));
        Assert.areSame(node, app.get('viewContainer'));
        Assert.isTrue(app.get('container').compareTo(app.get('viewContainer')));

        app.render();

        Assert.isTrue(app.get('container').compareTo(app.get('viewContainer')));
    },

    '`render()` should append the `activeView` to the `viewContainer`': function () {
        var app  = this.app = new Y.App(),
            view = new Y.View();

        app.showView(view);
        // Makes sure the view isn't contained.
        view.get('container').remove();

        Assert.isFalse(app.get('viewContainer').contains(view.get('container')));
        Assert.areSame(view, app.get('activeView'));

        app.render();

        Assert.isTrue(app.get('viewContainer').contains(view.get('container')));
    }
}));

// -- App Base: Views ----------------------------------------------------------
appBaseSuite.add(new Y.Test.Case({
    name: 'Views',

    setUp: function () {
        this.TestView = Y.TestView = Y.Base.create('testView', Y.View, []);
    },

    tearDown: function () {
        this.app && this.app.destroy();
        delete this.app;

        delete this.TestView;
        delete Y.TestView;
    },

    'A registered view with falsy `type` should default to `Y.View`': function () {
        var app = this.app = new Y.App({
            views: {
                unspecifiedView: {},
                undefinedView  : {type: undefined},
                nullView       : {type: null},
                falseView      : {type: false},
                zeroView       : {type: 0},
                nanView        : {type: NaN}
            }
        });

        Assert.isInstanceOf(Y.View, app.createView('unspecifiedView'));
        Assert.isInstanceOf(Y.View, app.createView('undefinedView'));
        Assert.isInstanceOf(Y.View, app.createView('nullView'));
        Assert.isInstanceOf(Y.View, app.createView('falseView'));
        Assert.isInstanceOf(Y.View, app.createView('zeroView'));
        Assert.isInstanceOf(Y.View, app.createView('nanView'));
    },

    'A registered view with a function `type` should return an instance of that function': function () {
        var app = this.app = new Y.App({
            views: {
                test: {type: this.TestView}
            }
        });

        Assert.isInstanceOf(Y.View, app.createView('test'));
        Assert.isInstanceOf(this.TestView, app.createView('test'));
    },

    'A registered view with a string `type` should look on the `Y` object for the constructor': function () {
        var app = this.app = new Y.App({
            views: {
                test        : {type: 'TestView'},
                bigNamespace: {type: 'Foo.Bar.View'}
            }
        });

        Y.namespace('Foo.Bar').View = Y.Base.create('fooTestView', Y.View, []);

        Assert.isInstanceOf(Y.View, app.createView('test'));
        Assert.isInstanceOf(Y.TestView, app.createView('test'));

        Assert.isInstanceOf(Y.View, app.createView('bigNamespace'));
        Assert.isInstanceOf(Y.Foo.Bar.View, app.createView('bigNamespace'));
    },

    'A View instance should be preserved when registered with `preserve` as `true`': function () {
        var app = this.app = new Y.App({
                views: {
                    test: {preserve: true}
                }
            }),
            view;

        Assert.isNull(app.get('activeView'));

        // Sets `activeView` to a new instance of the `test` registered view.
        app.showView('test');
        view = app.get('activeView');

        Assert.isNotNull(view);
        Assert.isTrue(app.get('viewContainer').contains(view.get('container')));

        // Sets the `activeView` to something else.
        app.showView(new Y.View());

        Assert.areNotSame(app.get('activeView'), view);
        Assert.isFalse(app.get('viewContainer').contains(view.get('container')));

        // Sets the `activeView` back to the registered `test` view, which
        // should be the same instance as before.
        app.showView('test');

        Assert.areSame(app.get('activeView'), view);
        Assert.isTrue(app.get('viewContainer').contains(view.get('container')));
    },

    'A view registered with a specified `instance` should be preserved when `preserve` is `true`': function () {
        var view = new Y.View(),
            app  = this.app = new Y.App({
                views: {
                    test: {
                        preserve: true,
                        instance: view
                    }
                }
            });

        Assert.isNull(app.get('activeView'));

        app.showView('test');
        Assert.areSame(view, app.get('activeView'));

        app.showView(new Y.View());
        Assert.areNotSame(view, app.get('activeView'));

        app.showView('test');
        Assert.areSame(view, app.get('activeView'));
    },

    'A View instance should not be preserved when registered with `preserve` as `false`': function () {
        var app = this.app = new Y.App({
                views: {
                    test: {preserve: false}
                }
            }),
            view;

        Assert.isNull(app.get('activeView'));

        // Sets `activeView` to a new instance of the `test` registered view.
        app.showView('test');
        view = app.get('activeView');

        Assert.isNotNull(view);
        Assert.isTrue(app.get('viewContainer').contains(view.get('container')));
        Assert.areSame(view, app.getViewInfo(view).instance);
        Assert.areSame(view, app.getViewInfo('test').instance);

        // Sets the `activeView` to something else.
        app.showView(new Y.View());

        Assert.areNotSame(app.get('activeView'), view);
        Assert.isFalse(app.get('viewContainer').contains(view.get('container')));

        // Checks that the instance is not preserved.
        Assert.isUndefined(app.getViewInfo(view));
        Assert.isUndefined(app.getViewInfo('test').instance);

        // Sets the `activeView` back to the registered `test` view, which
        // should not be the same instance as before.
        app.showView('test');

        Assert.areNotSame(app.get('activeView'), view);
        Assert.isFalse(app.get('viewContainer').contains(view.get('container')));
    },

    'A registered view should not be preserved by default': function () {
        var app = this.app = new Y.App({
                views: {
                    test: {}
                }
            }),
            view;

        Assert.isNull(app.get('activeView'));

        // Sets `activeView` to a new instance of the `test` registered view.
        app.showView('test');
        view = app.get('activeView');

        Assert.isNotNull(view);
        Assert.isTrue(app.get('viewContainer').contains(view.get('container')));
        Assert.areSame(view, app.getViewInfo(view).instance);
        Assert.areSame(view, app.getViewInfo('test').instance);

        // Sets the `activeView` to something else.
        app.showView(new Y.View());

        Assert.areNotSame(app.get('activeView'), view);
        Assert.isFalse(app.get('viewContainer').contains(view.get('container')));

        // Checks that the instance is not preserved.
        Assert.isUndefined(app.getViewInfo(view));
        Assert.isUndefined(app.getViewInfo('test').instance);

        // Sets the `activeView` back to the registered `test` view, which
        // should not be the same instance as before.
        app.showView('test');

        Assert.areNotSame(app.get('activeView'), view);
        Assert.isFalse(app.get('viewContainer').contains(view.get('container')));
    },

    'Parent/child view relationships should be determinable from the `views` metadata': function () {
        var app = this.app = new Y.App({
            views: {
                parent: {},
                child : {parent: 'parent'}
            }
        });

        Assert.isTrue(app._isParentView('parent', 'child'));
        Assert.isFalse(app._isParentView('child', 'parent'));

        Assert.isTrue(app._isChildView('child', 'parent'));
        Assert.isFalse(app._isChildView('parent', 'child'));
    },

    'Parent/child view relationships should be determinable from view instances': function () {
        var app = this.app = new Y.App({
                views: {
                    parent: {},
                    child : {parent: 'parent'}
                }
            }),

            parent = app.createView('parent'),
            child  = app.createView('child');

        Assert.isTrue(app._isParentView(parent, child));
        Assert.isTrue(app._isParentView(parent, 'child'));
        Assert.isTrue(app._isParentView('parent', child));

        Assert.isTrue(app._isChildView(child, parent));
        Assert.isTrue(app._isChildView(child, 'parent'));
        Assert.isTrue(app._isChildView('child', parent));
    },

    '`Y.App` subclasses should be able to specify view metadata on the `prototype`': function () {
        var MyApp = Y.Base.create('myApp', Y.App, [], {
                views: {
                    test: {type: this.TestView}
                }
            }),

            app = this.app = new MyApp();

        Assert.isFalse(Y.Object.isEmpty(app.views));
        ObjectAssert.hasKey('test', app.views);
        Assert.isInstanceOf(this.TestView, app.createView('test'));
    },

    'The `views` metadata on the `prototype` should be merged with the specified `views` during construction': function () {
        var MyApp = Y.Base.create('myApp', Y.App, [], {
                views: {
                    test: {
                        type    : this.TestView,
                        preserve: false
                    },

                    parent: {
                        type: Y.View
                    }
                }
            }),

            app = this.app = new MyApp({
                views: {
                    test : {preserve: true},
                    child: {parent: 'parent'}
                }
            });

        ObjectAssert.hasKeys(['test', 'parent', 'child'], app.views);

        Assert.isTrue(app.views.test.preserve);
        Assert.areSame(this.TestView, app.views.test.type);

        Assert.areSame(Y.View, app.views.parent.type);

        Assert.areSame('parent', app.views.child.parent);
        Assert.isUndefined(app.views.child.type);

        Assert.isTrue(app._isParentView('parent', 'child'));
        Assert.isTrue(app._isChildView('child', 'parent'));
    },

    '`showView()` should set the specified view instance or name as the `activeView`': function () {
        var view = new Y.View(),
            app  = this.app = new Y.App({
                views: {
                    test: {type: this.TestView}
                }
            });

        app.showView(view);
        Assert.areSame(view, app.get('activeView'));

        app.showView('test');
        Assert.isInstanceOf(this.TestView, app.get('activeView'));
        Assert.areSame(app.views.test, app.getViewInfo(app.get('activeView')));
    },

    '`showView()` should construct a registered view instance with the specified `config`': function () {
        var node = Y.Node.create('<div/>'),
            app  = this.app = new Y.App({
                views: {
                    test: {type: this.TestView}
                }
            });

        app.showView('test', {container: node});

        Assert.isInstanceOf(this.TestView, app.get('activeView'));
        Assert.areSame(node, app.get('activeView').get('container'));
    },

    '`showView()` should accept a `null` `view`': function () {
        var app = this.app = new Y.App();

        app.showView(new Y.View());

        Assert.isNotNull(app.get('activeView'));
        Assert.areSame(1, app.get('viewContainer').get('children').size());

        app.showView(null);

        Assert.isNull(app.get('activeView'));
        Assert.areSame(0, app.get('viewContainer').get('children').size());
    },

    '`showView()` should prepend the new `activeView` when `options.prepend` is `true`': function () {
        var app  = this.app = new Y.App(),
            view = new Y.View();

        app.get('viewContainer').append('<div/>');
        app.showView(view, null, {prepend: true});

        Assert.isInstanceOf(Y.View, app.get('activeView'));
        Assert.areSame(view, app.get('activeView'));
        Assert.isTrue(app.get('viewContainer').contains(view.get('container')));
        Assert.areSame(2, app.get('viewContainer').get('children').size());
        Assert.areSame(app.get('viewContainer').get('firstChild'), view.get('container'));
    },

    '`showView()` should update the attributes of the `view` with the `config` when `options.update` is `true`' : function() {
        var app  = this.app = new Y.App(),
            view = new Y.View({attr: false});

        app.showView(view);
        app.showView(view, {attr: true}, {update: true});

        Assert.areSame(true, view.get('attr'));
    },

    '`showView()` should not update the attributes of the `view` with the `config` when `options.update` is `false`' : function() {
        var app  = this.app = new Y.App(),
            view = new Y.View({attr: false});

        app.showView(view);
        app.showView(view, {attr: true}, {update: false});

        Assert.areSame(false, view.get('attr'));
    },

    '`showView()` should not update the attributes of the `view` with the `config` by default' : function() {
        var app  = this.app = new Y.App(),
            view = new Y.View({attr: false});

        app.showView(view);
        app.showView(view, {attr: true});

        Assert.areSame(false, view.get('attr'));
    },

    '`showView()` should render a newly-created `view` when `options.render` is `true`': function () {
        var called = 0,
            TestView, app;

        TestView = Y.Base.create('testView', Y.View, [], {
            render: function () {
                called += 1;
            }
        });

        app = this.app = new Y.App({
            views: {
                'test': {type: TestView}
            }
        });

        app.showView('test', null, {render: true});

        Assert.areSame(1, called, '`render()` was not called once.');
    },

    '`showView()` should render an existing `view` when `options.render` is `true`': function () {
        var called = 0,
            TestView, app;

        TestView = Y.Base.create('testView', Y.View, [], {
            render: function () {
                called += 1;
            }
        });

        app = this.app = new Y.App({
            views: {
                test: {
                    type    : TestView,
                    preserve: true,
                    instance: new TestView()
                }
            }
        });

        app.showView(new TestView(), null, {render: true});
        app.showView('test', null, {render: true});

        Assert.areSame(2, called, '`render()` was called.');
    },

    '`showView()` should not render a newly-created `view` when `options.render` is `false`': function () {
        var called = 0,
            TestView, app;

        TestView = Y.Base.create('testView', Y.View, [], {
            render: function () {
                called += 1;
            }
        });

        app = this.app = new Y.App({
            views: {
                'test': {type: TestView}
            }
        });

        app.showView('test', null, {render: false});

        Assert.areSame(0, called, '`render()` was not called once.');
    },

    '`showView()` should not render an existing `view` when `options.render` is `false`': function () {
        var called = 0,
            TestView, app;

        TestView = Y.Base.create('testView', Y.View, [], {
            render: function () {
                called += 1;
            }
        });

        app = this.app = new Y.App({
            views: {
                test: {
                    type    : TestView,
                    preserve: true,
                    instance: new TestView()
                }
            }
        });

        app.showView(new TestView(), null, {render: false});
        app.showView('test', null, {render: false});

        Assert.areSame(0, called, '`render()` was called.');
    },

    '`showView()` should render a newly-created `view` by default': function () {
        var called = 0,
            TestView, app;

        TestView = Y.Base.create('testView', Y.View, [], {
            render: function () {
                called += 1;
            }
        });

        app = this.app = new Y.App({
            views: {
                'test': {type: TestView}
            }
        });

        app.showView('test');

        Assert.areSame(1, called, '`render()` was not called once.');
    },

    '`showView()` should not render an existing `view` by default': function () {
        var called = 0,
            TestView, app;

        TestView = Y.Base.create('testView', Y.View, [], {
            render: function () {
                called += 1;
            }
        });

        app = this.app = new Y.App({
            views: {
                test: {
                    type    : TestView,
                    preserve: true,
                    instance: new TestView()
                }
            }
        });

        app.showView(new TestView());
        app.showView('test');

        Assert.areSame(0, called, '`render()` was called.');
    },

    '`options` passed to `showView()` should be mixed into the `activeViewChange` event facade': function () {
        var app     = this.app = new Y.App(),
            calls   = 0,
            guid    = Y.guid(),
            options = {};

        app.after('activeViewChange', function (e) {
            calls += 1;

            Assert.isObject(e.options);
            ObjectAssert.hasKey(guid, e.options);
            Assert.areSame(true, e.options[guid]);
        });

        options[guid] = true;
        app.showView(new Y.View(), null, options);

        Assert.areSame(1, calls);
    },

    '`showView()` should accept a `callback` as either the third or fourth param': function () {
        var app   = this.app = new Y.App(),
            calls = 0,
            noop  = function () {};

        function callback() {
            calls += 1;
        }

        app.showView(new Y.View(), null, null, callback);
        app.showView(new Y.View(), null, noop, callback);
        app.showView(new Y.View(), null, callback);

        Assert.areSame(3, calls);
    },

    '`showView()` should call the specified `callback` with `this` context': function () {
        var app = this.app = new Y.App(),
            calls = 0;

        app.showView(new Y.View(), null, function () {
            calls += 1;

            Assert.areSame(this, app);
        });

        Assert.areSame(1, calls);
    },

    '`showView()` should pass the new `activeView` to the `callback`': function () {
        var app   = this.app = new Y.App(),
            view  = new Y.View(),
            calls = 0;

        app.showView(view, null, function (activeView) {
            calls += 1;

            Assert.areSame(activeView, view);
            Assert.areSame(activeView, app.get('activeView'));
        });

        Assert.areSame(1, calls);
    },

    '`showView()` should call the specified `callback` even when the `activeView` did not change': function () {
        var app   = this.app = new Y.App(),
            view  = new Y.View(),
            calls = 0;

        app.showView(view);
        Assert.areSame(view, app.get('activeView'), '`view` is not the `activeView`.');

        app.showView(view, null, function (activeView) {
            calls += 1;

            Assert.areSame(activeView, view, '`view` and `activeView` are not the same.');
            Assert.areSame(activeView, app.get('activeView'), '`activeView` and the app\'s `activeView` are not the same.');
        });

        Assert.areSame(1, calls, '`showView()` callback was not called.');
    },

    '`activeViewChange` event should be preventable': function () {
        var app   = this.app = new Y.App(),
            calls = 0;

        app.on('activeViewChange', function (e) {
            calls += 1;
            e.preventDefault();
        });

        app.after('activeViewChange', function (e) {
            calls += 1;
        });

        app.showView(new Y.View());

        Assert.areSame(1, calls);
    },

    'An `activeView` should bubble events to the app': function () {
        var app   = this.app = new Y.App(),
            calls = 0;

        app.on('view:foo', function () {
            calls += 1;
        });

        app.showView(new Y.View(), null, function (view) {
            view.fire('foo');
        });

        Assert.areSame(1, calls);
    },

    'The previous `activeView` should no longer bubble events to the app': function () {
        var app   = this.app = new Y.App(),
            view  = new Y.View(),
            calls = 0;

        app.on('view:foo', function (e) {
            calls += 1;
        });

        app.showView(view);
        view.fire('foo');

        Assert.isTrue(app.get('viewContainer').contains(view.get('container')));

        app.after('activeViewChange', function (e) {
            Assert.areSame(view, e.prevVal);
        });

        app.showView(new Y.View());
        view.fire('foo');

        Assert.areSame(1, calls);
        Assert.isFalse(app.get('viewContainer').contains(view.get('container')));
    },

    'A preserved view should not be destroyed when its no longer the `activeView`': function () {
        var calls    = 0,
            view     = new Y.View(),
            testView = new this.TestView(),
            app      = this.app = new Y.App({
                views: {
                    test: {
                        instance: testView,
                        preserve: true
                    }
                }
            });

        app.after('activeViewChange', function (e) {
            calls += 1;
        });

        app.showView(view);
        app.showView('test');
        app.showView(null);

        Assert.areSame(3, calls);
        Assert.isTrue(view.get('destroyed'));
        Assert.isFalse(testView.get('destroyed'));
    },

    'A non preserved view should be destroyed when its no longer the `activeView`': function () {
        var calls = 0,
            view  = new Y.View(),
            app   = this.app = new Y.App({
                views: {
                    test: {}
                }
            }),
            testView;

        app.after('activeViewChange', function (e) {
            calls += 1;
        });

        app.showView(view);

        app.showView('test');
        testView = app.get('activeView');

        app.showView(null);

        Assert.areSame(3, calls, '`activeView` did not change 3 times.');
        Assert.isTrue(view.get('destroyed'), '`view` was not destoryed.');
        Assert.isTrue(testView.get('destroyed'), '`testView` was not destroyed.');
    }
}));

// -- App Base: Navigation -----------------------------------------------------
appBaseSuite.add(new Y.Test.Case({
    name: 'Naivation',

    _should: {
        error: {
            '`_save()` should throw an error when the specified URL is not of the same origin': true
        }
    },

    setUp: function () {
        this.html5      = Y.Router.html5;
        this.hashPrefix = Y.HistoryHash.hashPrefix;
    },

    tearDown: function () {
        resetURL();

        Y.Router.html5 = this.html5;
        delete this.html5;

        Y.HistoryHash.hashPrefix = this.hashPrefix;
        delete this.hashPrefix;

        this.app && this.app.destroy();
        delete this.app;
    },

    '`_upgradeURL()` should upgrade a path-like hash-based URL to a full URL': function () {
        var app  = this.app = new Y.App(),
            hash = '#/foo/',
            path = '/foo/',
            url  = app._resolveURL(path);

        Assert.areNotSame(hash, app._upgradeURL(hash));
        Assert.areSame(url, app._upgradeURL(hash));
    },

    '`_upgradeURL()` should not upgrade a hash-based URL which is not path-like': function () {
        var app  = this.app = new Y.App(),
            hash = '#foo';

        Assert.areSame(hash, app._upgradeURL(hash));
    },

    '`_upgradeURL()` should strip any hash-prefix from the hash-based URL': function () {
        Y.HistoryHash.hashPrefix = '!';

        var app  = this.app = new Y.App(),
            hash = '/#!/foo/',
            path = '/foo/',
            url  = app._resolveURL(path);

        Assert.areNotSame(hash, app._upgradeURL(hash));
        Assert.areSame(url, app._upgradeURL(hash));
    },

    '`_upgradeURL()` should not upgrade URLs of a different origin': function () {
        var app         = this.app = new Y.App(),
            url         = 'http://random.host.example.com/#/foo/',
            path        = '/foo/',
            resolvedURL = app._resolveURL(path),
            upgradedURL = app._upgradeURL(url);

        Assert.areSame(url, upgradedURL);
        Assert.areNotSame(resolvedURL, upgradedURL);
    },

    '`navigate()` should upgrade hash-based URLs when `serverRouting` is falsy': function () {
        var calls = 0,
            noop  = function () {},
            app   = this.app = new Y.App({
                serverRouting: false,

                routes: [
                    {path: '/foo/', callback: noop}
                ]
            });

        app.on('navigate', function (e) {
            calls += 1;
            e.preventDefault();

            Assert.areSame(e.url, this._resolveURL('/foo/'));
        });

        app.navigate('#/foo/');
        app.navigate('/#/foo/');

        Assert.areSame(2, calls);
    },

    '`navigate()` should upgrade hash-based URLs when `serverRouting` is `true`': function () {
        // Force-fake HTML5
        Y.Router.html5 = true;

        var calls = 0,
            noop  = function () {},
            app   = this.app = new Y.App({
                serverRouting: true,

                routes: [
                    {path: '/foo/', callback: noop}
                ]
            });

        app.on('navigate', function (e) {
            calls += 1;
            e.preventDefault();

            Assert.areSame(e.url, this._resolveURL('/foo/'));
        });

        app.navigate('#/foo/');
        app.navigate('/#/foo/');

        Assert.areSame(2, calls);
    },

    '`navigate()` should force the firing of the `navigate` event when `serverRouting` is falsy': function () {
        var calls = 0,
            noop  = function () {},
            app   = this.app = new Y.App({
                routes: [
                    {path: '/foo/', callback: noop}
                ]
            });

        app.on('navigate', function (e) {
            calls += 1;
            e.preventDefault();

            Assert.isTrue(e.force);
        });

        app.navigate('/foo/');

        Assert.areSame(1, calls);
    },

    '`navigate()` should replace the history entry when the new and current URLs are the "same"': function () {
        var calls = 0,
            noop  = function () {},
            app   = this.app = new Y.App({
                serverRouting: false,

                routes: [
                    {path: '/foo/', callback: noop}
                ]
            });

        app.navigate('/foo/');

        app.on('navigate', function (e) {
            calls += 1;
            e.preventDefault();

            Assert.isTrue(e.replace);
            Assert.areSame(e.url, this._getURL());
        });

        app.navigate('/foo/');

        Assert.areSame(1, calls);
    },

    '`navigate()` should not override user-specified values for `force` and `replace`': function () {
        var calls = 0,
            noop  = function () {},
            app   = this.app = new Y.App({
                html5        : true,
                serverRouting: false,

                routes: [
                    {path: '/foo/', callback: noop}
                ]
            });

        app.on('navigate', function (e) {
            calls += 1;
            e.preventDefault();

            Assert.isFalse(e.force);
            Assert.isFalse(app.get('serverRouting'));

            Assert.isTrue(e.replace);
            Assert.areNotSame(e.url, this._getURL());
        });

        app.navigate('/foo/', {
            force  : false,
            replace: true
        });

        Assert.areSame(1, calls);
    },

    '`_save()` should throw an error when the specified URL is not of the same origin': function () {
        Y.Router.html5 = false;

        var app   = this.app = new Y.App({serverRouting: true}),
            calls = 0;

        app._save('http://some.random.host.example.com/foo/bar/');
    }
}));

suite.add(appBaseSuite);

}, '@VERSION@', {
    requires: ['app-base', 'test']
});
