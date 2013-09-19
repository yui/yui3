YUI.add('router-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    html5       = Y.Router.html5,
    win         = Y.config.win,
    originalURL = (win && win.location.toString()) || '',

    suite,
    routerSuite;

function resetURL() {
    if (!win) { return; }

    if (html5) {
        win.history.replaceState(null, null, originalURL);
    } else {
        win.location.hash = '';
    }
}

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App'));

// -- Router Suite ---------------------------------------------------------
routerSuite = new Y.Test.Suite({
    name: 'Router',

    setUp: function () {
        resetURL();
    },

    tearDown: function () {
        resetURL();
    }
});

// -- Router: Lifecycle ----------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        if (this.router) {
            this.router.destroy();
        }

        delete this.router;
    },

    'initializer should set attributes based on config options': function () {
        var router = this.router = new Y.Router({
                html5: false,

                root: '/foo',

                routes: [
                    {path: '/', callback: function () {}},
                    {path: '/foo', callback: function () {}}
                ],

                params: {
                    id      : Number,
                    username: /^\w+$/
                }
            });

        Assert.isFalse(router.get('html5'));

        Assert.areSame('/foo', router.get('root'));

        Assert.areSame(2, router.get('routes').length);
        Assert.areSame(2, router._routes.length);
        Assert.areSame('/', router.get('routes')[0].path);
        Assert.areSame('/', router._routes[0].path);
        Assert.areSame('/foo', router.get('routes')[1].path);
        Assert.areSame('/foo', router._routes[1].path);

        ObjectAssert.ownsKeys(['id', 'username'], router.get('params'));
        ObjectAssert.ownsKeys(['id', 'username'], router._params);
        Assert.isFunction(router.get('params').id);
        Assert.isFunction(router._params.id);
        Assert.isInstanceOf(RegExp, router.get('params').username);
        Assert.isInstanceOf(RegExp, router._params.username);
    },

    'subclass with default routes should work': function () {
        var MyRouter = Y.Base.create('myRouter', Y.Router, [], {}, {
                ATTRS: {
                    routes: {
                        value: [
                            {path: '/',    callback: 'index'},
                            {path: '/pie', callback: 'pie'}
                        ]
                    }
                }
            }),

            router = this.router = new MyRouter();

        Assert.areSame(2, router.get('routes').length);
        Assert.areSame(2, router._routes.length);
        Assert.areSame('/', router.get('routes')[0].path);
        Assert.areSame('/', router._routes[0].path);
        Assert.areSame('/pie', router.get('routes')[1].path);
        Assert.areSame('/pie', router._routes[1].path);
    },

    'subclass with default params should work': function () {
        var MyRouter = Y.Base.create('myRouter', Y.Router, [], {}, {
                ATTRS: {
                    params: {
                        value: {
                            id      : Number,
                            username: /^\w+$/
                        }
                    }
                }
            }),

            router = this.router = new MyRouter();

        ObjectAssert.ownsKeys(['id', 'username'], router.get('params'));
        ObjectAssert.ownsKeys(['id', 'username'], router._params);
        Assert.isFunction(router.get('params').id);
        Assert.isFunction(router._params.id);
        Assert.isInstanceOf(RegExp, router.get('params').username);
        Assert.isInstanceOf(RegExp, router._params.username);
    }
}));

// -- Router: Attributes ---------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Attributes',

    tearDown: function () {
        if (this.router) {
            this.router.destroy();
        }

        delete this.router;
    },

    '`html5` attribute should have a default value': function () {
        var router = this.router = new Y.Router();
        Assert.areSame(Y.Router.html5, router.get('html5'));
    },

    '`root` attribute should have a default value': function () {
        var router = this.router = new Y.Router();
        Assert.areSame('', router.get('root'));
    },

    '`routes` attribute should have a default value': function () {
        var router = this.router = new Y.Router();

        Assert.isArray(router.get('routes'));
        ArrayAssert.isEmpty(router.get('routes'));
    },

    'setting the `routes` attribute should reset all routes': function () {
        var router = this.router = new Y.Router();

        router.set('routes', [
            {path: '/',    callback: function () {}},
            {path: '/foo', callback: function () {}}
        ]);

        ArrayAssert.itemsAreSame(router._routes, router.get('routes'));
        Assert.areSame(2, router._routes.length);
        Assert.areSame(router.get('routes')[0].callbacks, router._routes[0].callbacks);
        Assert.areSame(router.get('routes')[1].callbacks, router._routes[1].callbacks);
    },

    '`routes` should support both `callback` and `callbacks` properties': function () {
        var router = this.router = new Y.Router();

        router.set('routes', [
            {path: '/',    callback: function () {}},
            {path: '/foo', callbacks: function () {}}
        ]);

        Assert.areSame(2, router._routes.length);
        Assert.areSame(1, router.get('routes')[0].callbacks.length);
        Assert.areSame(1, router.get('routes')[1].callbacks.length);
    },

    '`callbacks` should supercede `callback` property for `routes`': function () {
        var router = this.router = new Y.Router();

        function callback1() {}
        function callback2() {}

        router.set('routes', [
            {
                path     : '/',
                callback : callback1,
                callbacks: callback2
            }
        ]);

        Assert.areSame(callback2, router.get('routes')[0].callbacks[0]);
    },

    '`params` attribute should have a default value': function () {
        var router = this.router = new Y.Router();

        Assert.isObject(router.get('params'));
        ObjectAssert.ownsNoKeys(router.get('params'));
    },

    'setting the `params` attribute should reset all params': function () {
        var router = this.router = new Y.Router();

        router.set('params', {
            id      : Number,
            username: /^\w+$/
        });

        ObjectAssert.areEqual(router._params, router.get('params'));
        ObjectAssert.ownsKeys(['id', 'username'], router._params);
        ObjectAssert.ownsKeys(['id', 'username'], router.get('params'));
        Assert.isFunction(router._params.id);
        Assert.isFunction(router.get('params').id);
        Assert.isInstanceOf(RegExp, router._params.username);
        Assert.isInstanceOf(RegExp, router.get('params').username);
    }
}));

// -- Router: Events -------------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Events',

    tearDown: function () {
        if (this.router) {
            this.router.destroy();
        }

        delete this.router;
    },

    '`ready` event should fire when the router is ready to dispatch': function () {
        var test = this;

        this.router = new Y.Router({
            on: {
                ready: function (e) {
                    test.resume(function () {
                        Assert.isFalse(e.dispatched);
                    });
                }
            }
        });

        this.wait(1000);
    },

    '`ready` event should set e.dispatched to true if called after dispatch': function () {
        var test = this;

        this.router = new Y.Router({
            on: {
                initializedChange: function () {
                    this._dispatch('/fake', {});
                },

                ready: function (e) {
                    test.resume(function () {
                        Assert.isTrue(e.dispatched);
                    });
                }
            }
        });

        this.wait(1000);
    }
}));

// -- Router: Methods ------------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.errorFn   = Y.config.errorFn;
        this.throwFail = Y.config.throwFail;
    },

    tearDown: function () {
        if (this.router) {
            this.router.destroy();
        }

        delete this.router;

        Y.config.errorFn = this.errorFn;
        delete this.errorFn;

        Y.config.throwFail = this.throwFail;
        delete this.throwFail;
    },

    'getPath() should return the current location `pathname` when no hash is set in all browsers': function () {
        Y.HistoryHash.setHash('');

        var router = this.router = new Y.Router();

        Assert.areSame(Y.getLocation().pathname, router.getPath());
    },

    'getPath() should return the `pathname` in HTML5 browsers and otherwise return the hash path': function () {
        var path     = Y.getLocation().pathname,
            hashPath = '/foo/bar',
            router;

        Y.HistoryHash.setHash(hashPath);

        router = this.router = new Y.Router();

        if (html5) {
            Assert.areSame(path, router.getPath());
        } else {
            Assert.areSame(hashPath, router.getPath());
        }
    },

    'getPath() should return the hash path in non HTML5 browsers': function () {
        var hashPath = '/foo/bar',
            router;

        Y.HistoryHash.setHash(hashPath);

        router = this.router = new Y.Router({html5: false});

        Assert.areSame(hashPath, router.getPath());
    },

    'route() should add a route': function () {
        var router = this.router = new Y.Router();

        router.one = function () {};
        function two() {}

        Assert.areSame(0, router._routes.length);

        Assert.areSame(router, router.route('/foo', 'one'));
        Assert.areSame(1, router._routes.length);

        router.route(/bar/, two);
        Assert.areSame(2, router._routes.length);

        Assert.areSame('one', router._routes[0].callbacks[0]);
        Assert.areSame(two, router._routes[1].callbacks[0]);
    },

    'param() should add a param': function () {
        var router = this.router = new Y.Router();

        ObjectAssert.ownsNoKeys(router._params);

        Assert.areSame(router, router.param('id', Number));
        ObjectAssert.ownsKey('id', router._params);

        router.param('username', /^\w+$/);
        ObjectAssert.ownsKeys(['id', 'username'], router._params);

        Assert.isFunction(router._params.id);
        Assert.isInstanceOf(RegExp, router._params.username);
    },

    'match() should return an array of routes that match the given path': function () {
        var router = this.router = new Y.Router(),
            routes;

        function one() {}
        function two() {}
        function three() {}

        router.route('/:foo', one);
        router.route(/foo/, two);
        router.route('/bar', three);

        routes = router.match('/foo');

        Assert.areSame(2, routes.length);
        Assert.areSame(one, routes[0].callbacks[0]);
        Assert.areSame(two, routes[1].callbacks[0]);
    },

    'match() should return an array of routes that match the given path under a `root`': function () {
        var router = this.router = new Y.Router(),
            routes;

        function one() {}
        function two() {}
        function three() {}

        router.set('root', '/app/');

        router.route('/:foo', one);
        router.route(/foo/, two);
        router.route('/bar', three);

        Assert.areSame(0, router.match('/').length);
        Assert.areSame(0, router.match('/foo').length);
        Assert.areSame(0, router.match('/foo/').length);
        Assert.areSame(0, router.match('/bar').length);

        routes = router.match('/app/foo');

        Assert.areSame(2, routes.length);
        Assert.areSame(one, routes[0].callbacks[0]);
        Assert.areSame(two, routes[1].callbacks[0]);
    },

    'hasRoute() should return `true` if one or more routes match the given path': function () {
        var router = this.router = new Y.Router(),
            router2 = new Y.Router();

        function noop () {}

        router.route('/:foo', noop);
        router.route(/foo/, noop);
        router.route('/bar', noop);

        Assert.isTrue(router.hasRoute('/foo'));
        Assert.isTrue(router.hasRoute('/bar'));
        Assert.isTrue(router.hasRoute('/bar?a=b'));
        Assert.isTrue(router.hasRoute('/baz?a=b')); // This matches /:foo
        Assert.isFalse(router.hasRoute('/baz/quux'));
        Assert.isFalse(router.hasRoute('/baz/quux?a=b'));

        // Need to test a router that doesn't have a /:foo catch-all
        router2.route('/foo', noop);
        router2.route('/bar', noop);

        Assert.isTrue( router2.hasRoute('/foo'));
        Assert.isTrue( router2.hasRoute('/bar'));
        Assert.isTrue( router2.hasRoute('/bar?a=b'));
        Assert.isFalse(router2.hasRoute('/baz?a=b'));

        // Cleanup router2.
        router2.destroy();
    },

    'hasRoute() should always return `false` for paths not under the `root`': function () {
        var location = Y.getLocation(),
            router1  = new Y.Router({root: '/app'}),
            router2  = new Y.Router({root: '/app/'});

        function noop () {}

        router1.route('/', noop);
        router1.route('/:foo', noop);
        router1.route(/foo/, noop);
        router1.route('/bar', noop);

        router2.route('/', noop);
        router2.route('/:foo', noop);
        router2.route(/foo/, noop);
        router2.route('/bar', noop);

        Assert.isFalse(router1.hasRoute('/'));
        Assert.isFalse(router1.hasRoute('/app'));
        Assert.isFalse(router1.hasRoute('/foo/'));
        Assert.isFalse(router1.hasRoute('/bar'));
        Assert.isFalse(router1.hasRoute('/baz'));
        Assert.isFalse(router1.hasRoute(router1._getOrigin() + '/bar'));

        Assert.isFalse(router2.hasRoute('/'));
        Assert.isFalse(router2.hasRoute('/app'));
        Assert.isFalse(router2.hasRoute('/foo/'));
        Assert.isFalse(router2.hasRoute('/bar'));
        Assert.isFalse(router2.hasRoute('/baz'));
        Assert.isFalse(router2.hasRoute(router2._getOrigin() + '/bar'));

        Assert.isTrue(router1.hasRoute('/app/'));
        Assert.isTrue(router1.hasRoute('/app/foo/'));
        Assert.isTrue(router1.hasRoute('/app/bar'));
        Assert.isTrue(router1.hasRoute('/app/baz'));
        Assert.isTrue(router1.hasRoute(router1._getOrigin() + '/app/bar'));

        Assert.isTrue(router2.hasRoute('/app/'));
        Assert.isTrue(router2.hasRoute('/app/foo/'));
        Assert.isTrue(router2.hasRoute('/app/bar'));
        Assert.isTrue(router2.hasRoute('/app/baz'));
        Assert.isTrue(router2.hasRoute(router2._getOrigin() + '/app/bar'));

        router1.destroy();
        router2.destroy();
    },

    'hasRoute() should support full URLs': function () {
        var router = this.router = new Y.Router(),
            loc    = win && win.location,
            origin = loc ? (loc.origin || (loc.protocol + '//' + loc.host)) : '';

        function noop () {}

        router.route('/:foo', noop);
        router.route(/foo/, noop);
        router.route('/bar', noop);

        Assert.isTrue(router.hasRoute(origin + '/foo'));
        Assert.isTrue(router.hasRoute(origin + '/bar'));
        Assert.isFalse(router.hasRoute(origin + '/baz/quux'));

        // Scheme-relative URL.
        Assert.isTrue(router.hasRoute('//' + loc.host + '/foo'));
    },

    'hasRoute() should always return `false` for URLs with different origins': function () {
        var router = this.router = new Y.Router(),
            origin = 'http://something.really.random.com';

        function noop () {}

        router.route('/:foo', noop);
        router.route(/foo/, noop);
        router.route('/bar', noop);

        Assert.isFalse(router.hasRoute(origin + '/foo'));
        Assert.isFalse(router.hasRoute(origin + '/bar'));
        Assert.isFalse(router.hasRoute(origin + '/baz/quux'));
    },

    'dispatch() should dispatch to the first route that matches the current URL': function () {
        var test       = this,
            router = this.router = new Y.Router();

        router.route(/./, function () {
            test.resume();
        });

        setTimeout(function () {
            router.dispatch();
        }, 1);

        this.wait(1000);
    },

    'dispatch() should upgrade hash URLs to HTML5 URLs in HTML5 browsers': function () {
        if (!html5) {
            Assert.isTrue(true);
            return;
        }

        Y.HistoryHash.setHash('/hashpath');

        var test   = this,
            router = this.router = new Y.Router(),
            root   = router._getPathRoot();

        router.set('root', root);

        router.route('/hashpath', function (req) {
            test.resume(function () {
                Assert.areSame('/foo/hashpath', req.path);
                Assert.areSame(Y.getLocation().pathname, root + 'hashpath');
            });
        });

        router.dispatch();
        this.wait(500);
    },

    'removeRoot() should remove the root URL from a given path': function () {
        var router = this.router = new Y.Router();

        router.set('root', '/');
        Assert.areSame('/bar', router.removeRoot('/bar'));
        Assert.areSame('/bar', router.removeRoot('bar'));
        Assert.areSame('/bar/', router.removeRoot('/bar/'));
        Assert.areSame('/bar/', router.removeRoot('bar/'));

        router.set('root', '/foo');
        Assert.areSame('/', router.removeRoot('/foo'));
        Assert.areSame('/', router.removeRoot('/foo/'));
        Assert.areSame('/bar', router.removeRoot('/foo/bar'));
        Assert.areSame('/bar/', router.removeRoot('/foo/bar/'));
        Assert.areSame('/foobar', router.removeRoot('/foobar'));
        Assert.areSame('/foobar/', router.removeRoot('/foobar/'));

        router.set('root', '/foo/');
        Assert.areSame('/foo', router.removeRoot('/foo'));
        Assert.areSame('/', router.removeRoot('/foo/'));
        Assert.areSame('/bar', router.removeRoot('/foo/bar'));
        Assert.areSame('/bar/', router.removeRoot('/foo/bar/'));
        Assert.areSame('/foobar', router.removeRoot('/foobar'));
        Assert.areSame('/foobar/', router.removeRoot('/foobar/'));

        router.set('root', '/moo');
        Assert.areSame('/foo/bar', router.removeRoot('/foo/bar'));
        Assert.areSame('/foo/moo', router.removeRoot('/foo/moo'));
    },

    'removeRoot() should strip the origin ("http://foo.com") portion of the URL, if any': function () {
        var router = this.router = new Y.Router();

        Assert.areSame('/foo/bar', router.removeRoot('http://example.com/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('https://example.com/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('http://user:pass@example.com/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('http://example.com:8080/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('http://user:pass@example.com:8080/foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('file:///foo/bar'));
        Assert.areSame('/foo/bar', router.removeRoot('/foo/bar'));

        router.set('root', '/foo');
        Assert.areSame('/bar', router.removeRoot('http://example.com/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('https://example.com/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('http://user:pass@example.com/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('http://example.com:8080/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('http://user:pass@example.com:8080/foo/bar'));
        Assert.areSame('/bar', router.removeRoot('file:///foo/bar'));
        Assert.areSame('/bar', router.removeRoot('/foo/bar'));
    },

    'replace() should replace the current history entry': function () {
        var test   = this,
            router = this.router = new Y.Router();

        router.route('/replace', function (req) {
            test.resume(function () {
                Assert.areSame('/replace', req.path);
                Assert.isObject(req.query);
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.replace('/replace');
        }, 1);

        this.wait(1000);
    },

    'replace() should be able to be called with no args using html5': function () {
        var test   = this,
            router = this.router = new Y.Router(),
            path   = '/replace';

        router.save(path);
        router.route(path, function (req) {
            test.resume(function () {
                Assert.areSame(path, req.path);
                Assert.isObject(req.query);
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.replace();
        }, 1);

        this.wait(1000);
    },

    'replace() should be able to be called with no args using not html5': function () {
        var test   = this,
            router = this.router = new Y.Router({html5: false}),
            path   = '/replace';

        router.save(path);
        router.route(path, function (req) {
            test.resume(function () {
                Assert.areSame(path, req.path);
                Assert.isObject(req.query);
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.replace();
        }, 1);

        this.wait(1000);
    },

    'save() should create a new history entry': function () {
        var test   = this,
            router = this.router = new Y.Router();

        router.route('/save', function (req) {
            test.resume(function () {
                Assert.areSame('/save', req.path);
                Assert.isObject(req.query);
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.save('/save');
        }, 1);

        this.wait(1000);
    },

    'consecutive save() calls should dispatch to the correct routes': function () {
        var paths  = [],
            test   = this,
            router = this.router = new Y.Router();

        router.route('/one', function (req) {
            paths.push(req.path);
        });

        router.route('/two', function (req) {
            paths.push(req.path);
        });

        router.route('/three', function (req) {
            paths.push(req.path);

            test.resume(function () {
                ArrayAssert.itemsAreSame(['/one', '/two', '/three'], paths);
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.save('/one');
            router.save('/two');
            router.save('/three');
        }, 1);

        this.wait(2000);
    },

    'save() should not include the `root` in the hash path if it is already in the `pathname`': function () {
        var test     = this,
            router   = this.router = new Y.Router({html5: false}),
            pathRoot = router._getPathRoot();

        router.set('root', pathRoot);
        router.route('/save', function (req) {
            test.resume(function () {
                Assert.areSame(router._joinURL('/save'), req.path);
                Assert.areSame('/save', Y.HistoryHash.getHash());
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.save('/save');
        }, 1);

        this.wait(1000);
    },

    'save() should include the `root` in the hash path if it is not already in the `pathname`': function () {
        var test   = this,
            router = this.router = new Y.Router({html5: false});

        router.set('root', '/app');
        router.route('/save', function (req) {
            test.resume(function () {
                Assert.areSame('/app/save', req.path);
                Assert.areSame('/app/save', Y.HistoryHash.getHash());
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.save('/save');
        }, 1);

        this.wait(1000);
    },

    'save() should dispatch in non HTML5 browsers even when the `hash` does not change': function () {
        var test = this,
            router;

        Y.HistoryHash.setHash('/save');

        router = this.router = new Y.Router({html5: false});

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.route('/save', function (req) {
                test.resume(function () {
                    Assert.areSame('/save', req.path);
                });
            });

            router.save('/save');
        }, 10);

        this.wait(1000);
    },

    'replace() should error when the URL is not from the same origin': function () {
        var router = this.router = new Y.Router(),
            origin = 'http://something.really.random.com',
            test   = this;

        // We don't want the uncaught error line noise because we expect an
        // error to be thrown, and it won't be caught because `save()` is async.
        Y.config.throwFail = false;
        Y.config.errorFn   = function (e) {
            test.resume(function () {
                Assert.areSame(e, 'Security error: The new URL must be of the same origin as the current URL.');
            });

            return true;
        };

        router.route('/foo', function () {
            test.resume(function () {
                Assert.fail('Should not route when URL has different origin.');
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.replace(origin + '/foo');
        }, 1);

        this.wait(500);
    },

    'save() should error when the URL is not from the same origin': function () {
        var router = this.router = new Y.Router(),
            origin = 'http://something.really.random.com',
            test   = this;

        // We don't want the uncaught error line noise because we expect an
        // error to be thrown, and it won't be caught because `save()` is async.
        Y.config.throwFail = false;
        Y.config.errorFn   = function (e) {
            test.resume(function () {
                Assert.areSame(e, 'Security error: The new URL must be of the same origin as the current URL.');
            });

            return true;
        };

        router.route('/foo', function () {
            test.resume(function () {
                Assert.fail('Should not route when URL has different origin.');
            });
        });

        // Wrapped in a setTimeout to make the async test work on iOS<5, which
        // performs this action synchronously.
        setTimeout(function () {
            router.save(origin + '/foo');
        }, 1);

        this.wait(500);
    },

    '_joinURL() should normalize "/" separators': function () {
        var router = this.router = new Y.Router();

        router.set('root', '/foo');
        Assert.areSame('/foo/bar', router._joinURL('bar'));
        Assert.areSame('/foo/bar', router._joinURL('/bar'));
        Assert.areSame('/foo/bar', router._joinURL('/foo/bar'));
        Assert.areSame('/foo/foo/bar', router._joinURL('foo/bar'));

        router.set('root', '/foo/');
        Assert.areSame('/foo/bar', router._joinURL('bar'));
        Assert.areSame('/foo/bar', router._joinURL('/bar'));
        Assert.areSame('/foo/bar', router._joinURL('/foo/bar'));
        Assert.areSame('/foo/foo/bar', router._joinURL('foo/bar'));
    },

    '_dispatch() should pass `src` through to request object passed to route handlers': function () {
        var router = this.router = new Y.Router(),
            src    = 'API';

        router.route('/foo', function (req, res, next) {
            Assert.areSame(src, req.src);
        });

        router._dispatch('/foo', {}, src);
    },

    '_getRegex() should return regexes that do not match too much' : function() {
        var router = this.router = new Y.Router(),
            check = function(path, url) {
                return router._getRegex(path, []).test(url);
            };

        Assert.isTrue( check("/*", "/"));
        Assert.isTrue( check("/*", "/foo"));
        Assert.isTrue( check("/*", "/foo?a=b"));
        Assert.isTrue( check("/*", "/foo#a"));
        Assert.isTrue( check("/*", "/foo/bar"));

        Assert.isTrue( check("/*foo", "/"));
        Assert.isTrue( check("/*foo", "/foo"));
        Assert.isTrue( check("/*foo", "/foo?a=b"));
        Assert.isTrue( check("/*foo", "/foo#a"));
        Assert.isTrue( check("/*foo", "/foo/bar"));

        Assert.isTrue( check("/", "/"));
        Assert.isFalse(check("/", "/foo"));
        Assert.isFalse(check("/", "/foo/bar"));
        Assert.isFalse(check("/", "/foo?bar"));
        Assert.isFalse(check("/", "/foo#bar"));

        Assert.isTrue( check("/foo", "/foo"));
        Assert.isFalse(check("/foo", "/"));
        Assert.isFalse(check("/foo", "/foo/bar"));
        Assert.isFalse(check("/foo", "/foo?bar"));
        Assert.isFalse(check("/foo", "/foo#bar"));

        Assert.isTrue( check("/foo/bar", "/foo/bar"));
        Assert.isFalse(check("/foo/bar", "/"));
        Assert.isFalse(check("/foo/bar", "/foo"));
        Assert.isFalse(check("/foo/bar", "/foo?bar"));
        Assert.isFalse(check("/foo/bar", "/foo#bar"));

        Assert.isTrue( check("/:foo", "/foo"));
        Assert.isTrue( check("/:foo", "/bar"));
        Assert.isFalse(check("/:foo", "/baz/quux"));
        Assert.isFalse(check("/:foo", "/bar?a=b"));
        Assert.isFalse(check("/:foo", "/bar#a"));

        Assert.isTrue( check("/foo/:foo", "/foo/bar"));
        Assert.isTrue( check("/foo/:foo", "/foo/bar"));
        Assert.isFalse(check("/foo/:foo", "/baz/quux"));
        Assert.isFalse(check("/foo/:foo", "/foo/bar?a=b"));
        Assert.isFalse(check("/foo/:foo", "/foo/bar#a"));

        Assert.isTrue( check("/:foo/bar", "/foo/bar"));
        Assert.isTrue( check("/:foo/bar", "/bar/bar"));
        Assert.isFalse(check("/:foo/bar", "/baz"));
        Assert.isFalse(check("/:foo/bar", "/bar"));
        Assert.isFalse(check("/:foo/bar", "/baz/quux"));
        Assert.isFalse(check("/:foo/bar", "/foo/bar?a=b"));
        Assert.isFalse(check("/:foo/bar", "/foo/bar#a"));
    }
}));

// -- Router: Routes -------------------------------------------------------
routerSuite.add(new Y.Test.Case({
    name: 'Routes',

    tearDown: function () {
        if (this.router) {
            this.router.destroy();
        }

        if (this.router2) {
            this.router2.destroy();
        }

        delete this.router;
        delete this.router2;
    },

    'routes should be called in the context of the router': function () {
        var calls  = 0,
            router = this.router = new Y.Router({
                routes: [{path: '/foo', callback: 'foo'}]
            });

        router.foo = function () {
            calls += 1;
            Assert.areSame(router, this);
        };

        router.route('/bar', router.foo);
        router._dispatch('/foo', {});
        router._dispatch('/bar', {});

        Assert.areSame(2, calls);
    },

    'routes should receive a request object, response object, and `next` function as params': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.route('/foo', function (req, res, next) {
            calls += 1;

            Assert.isObject(req);
            Assert.isObject(res);
            Assert.isFunction(next);
            Assert.areSame(next, req.next);
            Assert.isObject(req.params);
            Assert.isTrue(Y.Object.isEmpty(req.params));
            Assert.isNumber(req.pendingRoutes);
            Assert.areSame('/foo', req.path);
            ObjectAssert.areEqual({bar: 'baz quux', moo: ''}, req.query);
        });

        // Duckpunching _getQuery so we can test req.query.
        router._getQuery = function () {
            return 'bar=baz%20quux&moo';
        };

        router._dispatch('/foo', {foo: 'foo'});

        Assert.areSame(1, calls);
    },

    'routes should support multiple callback functions': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        function callback1(req, res, next) {
            calls += 1;
            next();
        }

        function callback2(req, res, next) {
            calls += 1;
            next();
        }

        router.route('/foo', callback1, callback2);
        router._dispatch('/foo', {});

        Assert.areSame(2, calls);
    },

    'routes should support an array of callback functions': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        function callback1(req, res, next) {
            calls += 1;
            next();
        }

        function callback2(req, res, next) {
            calls += 1;
            next();
        }

        router.route('/foo', [callback1, callback2]);
        router._dispatch('/foo', {});

        Assert.areSame(2, calls);
    },

    'routes should support an array of callback function string names': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.callback1 = function (req, res, next) {
            calls += 1;
            next();
        };

        router.callback2 = function (req, res, next) {
            calls += 1;
            next();
        };

        router.route('/foo', ['callback1', 'callback2']);
        router._dispatch('/foo', {});

        Assert.areSame(2, calls);
    },

    'routes should support nested arrays of mixed function and string callbacks': function () {
        var calls  = 0,
            router = this.router = new Y.Router(),
            middleware, fnMiddleware, stringMiddleware;

        function callback1(req, res, next) {
            calls += 1;
            next();
        }

        function callback2(req, res, next) {
            calls += 1;
            next();
        }

        router.callback1 = callback1;
        router.callback2 = callback2;

        fnMiddleware     = [callback1, callback2];
        stringMiddleware = ['callback1', 'callback2'];
        middleware       = [fnMiddleware, stringMiddleware];

        router.route('/foo', middleware, function (req, res, next) {
            calls += 1;
        });

        router._dispatch('/foo', {});

        Assert.areSame(5, calls);
    },

    'route middleware should be able to skip to the next route': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.checkEric = function (req, res, next) {
            if (req.params.user !== 'eric') {
                next('route');
            }
        };

        router.showEric = function (req, res, next) {
            Assert.fail('This should not be called.');
        };

        router.route('/:user', 'checkEric', 'showEric');
        router.route('*', function () {
            calls += 1;
        });

        router._dispatch('/ryan', {});

        Assert.areSame(1, calls);
    },

    'request object should contain captured route parameters': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.route('/foo/:bar/:baz', function (req) {
            calls += 1;

            ArrayAssert.itemsAreSame(['bar', 'baz'], Y.Object.keys(req.params));
            ArrayAssert.itemsAreSame(['one', 'two'], Y.Object.values(req.params));
        });

        router.route('/bar/*path', function (req) {
            calls += 1;

            Assert.isObject(req.params);
            ArrayAssert.itemsAreSame(['path'], Y.Object.keys(req.params));
            ArrayAssert.itemsAreSame(['one/two'], Y.Object.values(req.params));
        });

        router.route(/^\/(baz)\/(quux)$/, function (req) {
            calls += 1;

            Assert.isArray(req.params);
            ArrayAssert.itemsAreSame(['/baz/quux', 'baz', 'quux'], req.params);
        });

        router.route(/^\/((fnord)|(fnarf))\/(quux)$/, function (req) {
            calls += 1;

            Assert.isArray(req.params);
            ArrayAssert.itemsAreSame(['/fnord/quux', 'fnord', 'fnord', '', 'quux'], req.params);
        });

        router.route(/^\/((blorp)|(blerf))\/(quux)$/, function (req) {
            calls += 1;

            Assert.isArray(req.params);
            ArrayAssert.itemsAreSame(['/blerf/quux', 'blerf', '', 'blerf', 'quux'], req.params);
        });

        router._dispatch('/foo/one/two', {});
        router._dispatch('/bar/one/two', {});
        router._dispatch('/baz/quux', {});
        router._dispatch('/fnord/quux', {});
        router._dispatch('/blerf/quux', {});

        Assert.areSame(5, calls);
    },

    'route parameters should be decoded': function () {
        var calls       = 0,
            router      = this.router = new Y.Router(),
            pathSegment = 'path with spaces';

        router.route('/:foo', function (req) {
            calls += 1;

            ArrayAssert.itemsAreSame(['foo'], Y.Object.keys(req.params));
            ArrayAssert.itemsAreSame([pathSegment], Y.Object.values(req.params));
        });

        Assert.areSame('path%20with%20spaces', encodeURIComponent(pathSegment));

        router._dispatch('/' + pathSegment, {});
        router._dispatch('/' + encodeURIComponent(pathSegment), {});

        Assert.areSame(2, calls);
    },

    'route parameters should be processed via the param handlers': function () {
        var calls      = 0,
            paramCalls = 0,
            router     = this.router = new Y.Router();

        router.set('params', {
            id      : Number,
            username: /^\w+$/,
            file    : /^([^\.]+)\.(.+)$/,

            // Truthy:
            zero : Number,
            empty: function () { return ''; },

            // Falsy:
            falze: function () { paramCalls += 1; return false; },
            nul  : function () { paramCalls += 1; return null; },
            undef: function () { paramCalls += 1; return undefined; },
            nan  : function () { paramCalls += 1; return NaN; }
        });

        router.route('/posts/:id', function (req) {
            calls += 1;

            Assert.isObject(req.params);
            ArrayAssert.itemsAreSame(['id'], Y.Object.keys(req.params));
            Assert.isNumber(req.params.id);
            Assert.areSame(1, req.params.id);
        });

        // Called via "/users/", so no `username`.
        router.route('/users/*username', function (req) {
            calls += 1;

            Assert.isObject(req.params);
            ArrayAssert.itemsAreSame(['username'], Y.Object.keys(req.params));
            ArrayAssert.itemsAreSame([''], Y.Object.values(req.params));
        });

        router.route('/files/:file', function (req) {
            calls += 1;

            Assert.isObject(req.params);
            ArrayAssert.itemsAreSame(['file'], Y.Object.keys(req.params));
            Assert.isArray(req.params.file);
            ArrayAssert.itemsAreSame(['app.js', 'app', 'js'], req.params.file);
        });

        router.route('/zero/:zero', function (req) {
            calls += 1;

            Assert.isObject(req.params);
            ArrayAssert.itemsAreSame(['zero'], Y.Object.keys(req.params));
            Assert.isNumber(req.params.zero);
            Assert.areSame(0, req.params.zero);
        });

        router.route('/empty/:empty', function (req) {
            calls += 1;

            Assert.isObject(req.params);
            ArrayAssert.itemsAreSame(['empty'], Y.Object.keys(req.params));
            Assert.isString(req.params.empty);
            Assert.areSame('', req.params.empty);
        });

        router.route('/falze/:falze', function (req) {
            Assert.fail(req.path + ' should not match `falze` param');
        });

        router.route('/nul/:nul', function (req) {
            Assert.fail(req.path + ' should not match `nul` param');
        });

        router.route('/undef/:undef', function (req) {
            Assert.fail(req.path + ' should not match `undef` param');
        });

        router.route('/nan/:nan', function (req) {
            Assert.fail(req.path + ' should not match `nan` param');
        });

        router._dispatch('/posts/1', {});
        router._dispatch('/users/', {});
        router._dispatch('/files/app.js', {});

        // Truthy checks.
        router._dispatch('/zero/0', {});
        router._dispatch('/empty/bla', {});

        // Falsy checks.
        router._dispatch('/falze/false', {});
        router._dispatch('/nul/null', {});
        router._dispatch('/undef/undefined', {});
        router._dispatch('/nan/NaN', {});

        Assert.areSame(5, calls);
        Assert.areSame(4, paramCalls);
    },

    'Param handler functions should invoked with the router as the `this` context': function () {
        var calls      = 0,
            paramCalls = 0,
            router     = this.router = new Y.Router();

        router.set('params', {
            username: function (value, name) {
                paramCalls += 1;

                Assert.areSame(router, this);
                return value;
            }
        });

        router.route('/users/:username', function (req) {
            calls += 1;
        });

        router._dispatch('/users/ericf', {});

        Assert.areSame(1, calls);
        Assert.areSame(1, paramCalls);
    },

    'Param handler functions should receive `value` and `name` as arguments': function () {
        var calls      = 0,
            paramCalls = 0,
            router     = this.router = new Y.Router();

        router.set('params', {
            username: function (value, name) {
                paramCalls += 1;

                Assert.areSame('EricF', value);
                Assert.areSame('username', name);

                return value.toLowerCase();
            }
        });

        router.route('/users/:username', function (req) {
            calls += 1;

            Assert.isObject(req.params);
            ArrayAssert.itemsAreSame(['username'], Y.Object.keys(req.params));
            Assert.isString(req.params.username);
            Assert.areSame('ericf', req.params.username);
        });

        router._dispatch('/users/EricF', {});

        Assert.areSame(1, calls);
        Assert.areSame(1, paramCalls);
    },

    'Non-matching `params` should cause the route to be skipped': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.set('params', {
            id      : Number,
            username: /^\w+$/
        });

        router.route('/posts/:id', function (req) {
            Assert.fail(req.path + ' should not match `id` param');
        });

        router.route('/users/*username', function (req) {
            Assert.fail(req.path + ' should not match `username` param');
        });

        // Catch-all route which should be called becuase the above routes
        // should be skipped.
        router.route('*', function () {
            calls += 1;
        });

        router._dispatch('/posts/asdf', {});
        router._dispatch('/users/eric,ryan', {});

        Assert.areSame(2, calls);
    },

    'request object should contain a `pendingRoutes` property': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.route('/a*', function (req, res, next) {
            calls += 1;
            Assert.areSame(2, req.pendingRoutes, 'there should be 2 pending routes');
            next();
        });

        router.route('/ab*', function (req, res, next) {
            calls += 1;
            Assert.areSame(1, req.pendingRoutes, 'there should be 1 pending route');
            next();
        });

        router.route('/abc', function (req, res, next) {
            calls += 1;
            Assert.areSame(0, req.pendingRoutes, 'there should be 0 pending routes');
        });

        router._dispatch('/abc', {});

        Assert.areSame(3, calls, '3 routes should be called');
    },

    'calling `res()` should have the same result as calling `next()`': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.route('/foo', function (req, res, next) {
            calls += 1;
            Assert.isFunction(res);
            res();
        });

        router.route('/foo', function (req, res, next) {
            calls += 1;
            Assert.isFunction(next);
            next();
        });

        router.route('/foo', function () {
            calls += 1;
        });

        router._dispatch('/foo', {});

        Assert.areSame(3, calls);
    },

    'calling `next()` should pass control to the next matching route': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.route('/foo', function (req, res, next) {
            calls += 1;
            next();
        });

        router.route(/foo/, function (req, res, next) {
            calls += 1;
            next();
        });

        router.route('/foo', function (req, res, next) {
            calls += 1;
        });

        router.route('/foo', function (req, res, next) {
            calls += 1;
            Assert.fail('final route should not be called');
        });

        router._dispatch('/foo', {});

        Assert.areSame(3, calls);
    },

    '"*" should be a catch-all route': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.route('*', function (req) {
            calls += 1;
        });

        router._dispatch('/foo', {});
        router._dispatch('/bar', {});

        Assert.areSame(2, calls);
    },

    'routes containing a "*" should match the segments which follow it': function () {
        var calls  = 0,
            router = this.router = new Y.Router();

        router.route('/foo/*', function (req) {
            calls += 1;
        });

        router.route('/foo/*/bar', function (req) {
            calls += 1;
        });

        router.route('/bar*', function (req) {
            calls += 1;
        });

        router._dispatch('/foo/1', {});
        router._dispatch('/foo/1/2/bar', {});
        router._dispatch('/barbar', {});
        router._dispatch('/bar/1', {});

        Assert.areSame(4, calls);
    },

    'multiple routers should be able to coexist and have duplicate route handlers': function () {
        var calls     = 0,
            routerOne = this.router  = new Y.Router(),
            routerTwo = this.router2 = new Y.Router();

        routerOne.route('/baz', function () {
            calls += 1;
        });

        routerTwo.route('/baz', function () {
            calls += 1;
        });

        routerOne.save('/baz');

        this.wait(function () {
            Assert.areSame(2, calls);
        }, 200);
    },

    'multiple nested routers should be able to coexist and duplicate route handlers': function () {
        var test      = this,
            calls     = 0,
            routerOne = test.router = new Y.Router(),
            routerTwo;

        function handleFoo() {
            calls += 1;
        }

        routerOne.route('/foo/*', handleFoo);
        routerOne.save('/foo/');

        setTimeout(function () {
            routerTwo = test.router2 = new Y.Router();

            routerTwo.route('/foo/*', handleFoo);
            routerTwo.save('/foo/bar/');
        }, 100);

        test.wait(function () {
            Assert.areSame(3, calls);
        }, 250);
    },

    'multiple nested non-HTML5 routers should be able to coexist and duplicate route handlers': function () {
        var test      = this,
            calls     = 0,
            routerOne = test.router = new Y.Router({html5: false}),
            routerTwo;

        function handleFoo() {
            calls += 1;
        }

        routerOne.route('/foo', handleFoo);
        routerOne.save('/foo');

        setTimeout(function () {
            routerTwo = test.router2 = new Y.Router({html5: false});

            routerTwo.route('/foo', handleFoo);
            routerTwo.save('/foo');
        }, 100);

        test.wait(function () {
            Assert.areSame(3, calls);
        }, 250);
    },

    'multiple routers should respond to history events after one router is destroyed': function () {
        var calls     = 0,
            routerOne = this.router  = new Y.Router(),
            routerTwo = this.router2 = new Y.Router();

        routerOne.route('/baz', function () {
            calls += 1;
        });

        routerTwo.route('/baz', function () {
            calls += 1;
        });

        // Make sure calling `destroy()` doesn't detach `routerTwo`'s history
        // event listener.
        routerOne.destroy();
        routerTwo.save('/baz');

        this.wait(function () {
            Assert.areSame(1, calls);
        }, 200);
    }
}));

suite.add(routerSuite);

}, '@VERSION@', {
    requires: ['router', 'test']
});
