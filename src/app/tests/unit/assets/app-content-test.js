YUI.add('app-content-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    html5 = Y.Router.html5,
    win   = Y.config.win,
    doc   = Y.config.doc,

    originalURL   = (win && win.location.toString()) || '',
    originalTitle = (doc && doc.title) || '',

    suite,
    appContentSuite;

function resetURL() {
    if (!win) { return; }

    if (html5) {
        win.history.replaceState(null, null, originalURL);
    } else {
        win.location.hash = '';
    }
}

function resetTitle() {
    if (doc) {
        doc.title = originalTitle;
    }
}

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App'));

// -- App Content Suite --------------------------------------------------------
appContentSuite = new Y.Test.Suite({
    name: 'App Content',

    setUp: function () {
        resetURL();
        resetTitle();
    },

    tearDown: function () {
        resetURL();
        resetTitle();
    }
});

// -- App Content: Properties --------------------------------------------------
appContentSuite.add(new Y.Test.Case({
    name: 'Properties',

    'Y.App.Content.route should be a stack of middleware': function () {
        ArrayAssert.itemsAreSame(
            ['loadContent', '_contentRoute'],
            Y.App.Content.route,
            'Y.App.Content.route does not contain the correct middleware stack.'
        );
    }
}));

// -- App Content: Views -------------------------------------------------------
appContentSuite.add(new Y.Test.Case({
    name: 'Views',

    setUp: function () {
        this.TestView = Y.TestView = Y.Base.create('testView', Y.View, []);
    },

    tearDown: function () {
        if (this.app) {
            this.app.destroy();
        }

        delete this.app;
        delete this.TestView;
        delete Y.TestView;
    },

    '`showContent()` should set the `activeView` of an app based on the specified `content`': function () {
        var app     = this.app = new Y.App(),
            content = Y.Node.create('<div />');

        app.showContent(content);

        Assert.areSame(content, app.get('activeView').get('container'), '`content` is not the view `container`.');
    },

    '`showContent()` should accept an HTMLElement, String, or Node as the content': function () {
        var app     = this.app = new Y.App(),
            element = Y.Node.create('<div />').getDOMNode(),
            string  = '#some-random-div',
            node    = Y.Node.create('<div />');

        // Put a node on the page for the `string`.
        Y.Node.create('<div id="some-random-div" />').appendTo('body');

        app.showContent(element);
        Assert.areSame(element, app.get('activeView').get('container').getDOMNode(), '`element` is not the view `container`.');

        app.showContent(string);
        Assert.areSame('some-random-div', app.get('activeView').get('container').get('id'), '`strong` is not the view `container` `id`.');

        app.showContent(node);
        Assert.areSame(node, app.get('activeView').get('container'), '`node` is not the view `container`.');
    },

    '`showContent()` should use the only child of a document fragment as the view `container`': function () {
        var app  = this.app = new Y.App(),
            node = Y.Node.create('<div />'),
            frag = Y.one(Y.config.doc.createDocumentFragment());

        frag.append(node);

        Assert.isTrue(frag.contains(node), '`node` is not in the `frag`.');
        Assert.areSame(1, frag.get('childNodes').size(), '`frag` does not have one child.');

        app.showContent(frag);

        Assert.areSame(node, app.get('activeView').get('container'), '`node` is not the view `container`.');
    },

    '`showContent()` should not use the only text node child of a document fragment as the view `container`': function () {
        var app  = this.app = new Y.App(),
            node = Y.Node.create('foo'),
            frag = Y.one(Y.config.doc.createDocumentFragment()),
            container;

        frag.append(node);

        Assert.areSame(3, node.get('nodeType'), '`node` is not a text node.');
        Assert.isTrue(frag.contains(node), '`node` is not in the `frag`.');
        Assert.areSame(1, frag.get('childNodes').size(), '`frag` does not have one child.');

        app.showContent(frag);

        container = app.get('activeView').get('container');

        Assert.areNotSame(node, container, '`node` is the view `container`.');
        Assert.areSame('DIV', container.get('tagName'), '`node` is not a div.');
    },

    '`showContent()` should wrap the children nodes of a document fragment with the view `container`': function () {
        var app     = this.app = new Y.App(),
            nodeOne = Y.Node.create('<div />'),
            nodeTwo = Y.Node.create('<div />'),
            frag    = Y.one(Y.config.doc.createDocumentFragment()),
            container;

        frag.append(nodeOne);
        frag.append(nodeTwo);

        Assert.isTrue(frag.contains(nodeOne), '`nodeOne` is not in the `frag`.');
        Assert.isTrue(frag.contains(nodeTwo), '`nodeTwo` is not in the `frag`.');
        Assert.areSame(2, frag.get('childNodes').size(), '`frag` does not have two children.');

        app.showContent(frag);

        container = app.get('activeView').get('container');

        Assert.isTrue(container.contains(nodeOne), '`nodeOne` is not in the view `container`.');
        Assert.isTrue(container.contains(nodeTwo), '`nodeTwo` is not in the view `container`.');
    },

    '`showContent()` should accept a `callback` as either the second or third argument': function () {
        var app     = this.app = new Y.App(),
            content = Y.Node.create('<div />'),
            calls   = 0;

        app.showContent(content, function (view) {
            calls += 1;
            Assert.isTrue(view instanceof Y.View, '`view` is not a Y.View.');
        });

        app.showContent(content, null, function (view) {
            calls += 1;
            Assert.isTrue(view instanceof Y.View, '`view` is not a Y.View.');
        });

        Assert.areSame(2, calls, '`showContent()` callback was not called twice');
    },

    '`showContent()` should create an instance of the specified `view`': function () {
        var app = this.app = new Y.App({
            views: {
                test: {type: Y.TestView}
            }
        });

        app.showContent(Y.Node.create('<div />'), {view: 'test'});

        Assert.isTrue(app.get('activeView') instanceof Y.TestView, 'A `TestView` was not created.');
    },

    '`showContent() should not render the view by default': function () {
        var calls = 0,
            app;

        Y.TestView.prototype.render = function () {
            calls += 1;
            return this;
        };

        app = this.app = new Y.App({
            views: {
                test: {type: 'TestView'}
            }
        });

        app.showContent(Y.Node.create('<div />'), {view: 'test'});
        app.showContent(Y.Node.create('<div />'), {
            view  : 'test',
            render: true
        });

        Assert.areSame(1, calls, 'The view was rendered when not specified.');
    },

    '`showContent()` should use the `contentTemplate` of the view when a document fragment has multiple children': function () {
        var nodeOne = Y.Node.create('<div />'),
            nodeTwo = Y.Node.create('<div />'),
            frag    = Y.one(Y.config.doc.createDocumentFragment()),
            app, container;

        Y.TestView.prototype.containerTemplate = '<div class="custom-template" />';

        app = this.app = new Y.App({
            views: {
                test: {type: Y.TestView}
            }
        });

        frag.append(nodeOne);
        frag.append(nodeTwo);

        Assert.isTrue(frag.contains(nodeOne), '`nodeOne` is not in the `frag`.');
        Assert.isTrue(frag.contains(nodeTwo), '`nodeTwo` is not in the `frag`.');
        Assert.areSame(2, frag.get('childNodes').size(), '`frag` does not have two children.');

        app.showContent(frag, {view: 'test'});

        container = app.get('activeView').get('container');

        Assert.isTrue(container.contains(nodeOne), '`nodeOne` is not in the view `container`.');
        Assert.isTrue(container.contains(nodeTwo), '`nodeTwo` is not in the view `container`.');
        Assert.isTrue(container.hasClass('custom-template'), 'The `containerTemplate` was not used.');
    },

    '`showView()` should apply the `options.view.config` to the view': function () {
        var app = this.app = new Y.App({
            views: {
                test: {type: Y.TestView}
            }
        });

        app.showContent(Y.Node.create('<div />'), {
            view: {
                name  : 'test',
                config: {foo: 'foo'}
            }
        });

        Assert.areSame('foo', app.get('activeView').get('foo'), 'The `config` was not applied to the view.');
    },

    '`showContent()` should _always_ use `content` as the view `container`': function () {
        var nodeOne = Y.Node.create('<div />'),
            nodeTwo = Y.Node.create('<div />'),
            app;

        app = this.app = new Y.App({
            views: {
                test: {type: Y.TestView}
            }
        });

        app.showContent(nodeOne, {
            view: {
                name  : 'test',
                config: {container: nodeTwo}
            }
        });

        Assert.areSame(nodeOne, app.get('activeView').get('container'), '`nodeOne` is not the view `container`.');
    }
}));

// -- App Content: Routes ------------------------------------------------------
appContentSuite.add(new Y.Test.Case({
    name: 'Routes',

    _should: {
        ignore: {
            '`Y.App.Content.route` should set the document `title`': !doc,
            '`Y.App.Content.route` should default the document `title` to `<title>`': Y.UA.ie && Y.UA.ie < 9
        }
    },

    tearDown: function () {
        resetURL();
        resetTitle();

        if (this.app) {
            this.app.destroy();
        }

        delete this.app;
    },

    '`Y.App.Content.route` should load HTML content from the server and set the `activeView`': function () {
        var test = this,
            app  = this.app = new Y.App({contentSelector: '#content > *'});

        app.route('*', Y.App.Content.route, function () {
            test.resume(function () {
                var container = app.get('activeView').get('container'),
                    foo       = container.one('.foo');

                Assert.isNotNull(foo, '`foo` node was not found.');
            });
        });

        app.navigate('assets/page-full.html');
        test.wait(1500);
    },

    '`Y.App.Content.route` should load text content from the server and set the `activeView`': function () {
        var test = this,
            app  = this.app = new Y.App();

        app.route('*', Y.App.Content.route, function () {
            test.resume(function () {
                var container = app.get('activeView').get('container');

                Assert.areSame('DIV', container.get('tagName'), '`container` is not a div.');
                Assert.isTrue(container.get('text').length > 0, '`container` does not contain content.');
            });
        });

        app.navigate('assets/page-text.html');
        test.wait(1500);
    },

    '`Y.App.Content.route` should default the document `title` to `<title>`': function () {
        // There's a known issue that this won't work in IE < 9!
        // Older IEs parse the HTML document and strip away the `<head>` and
        // `<body>` elements.

        var test = this,
            app  = this.app = new Y.App({contentSelector: '#content > *'});

        app.route('*', Y.App.Content.route, function () {
            test.resume(function () {
                var title = Y.config.doc.title;

                Assert.areNotSame(originalTitle, title, 'Document `title` did not change.');
            });
        });

        app.navigate('assets/page-full.html');
        test.wait(1500);
    },

    '`loadContent()` middleware should put `ioURL` on the `req` object': function () {
        var test = this,
            app  = this.app = new Y.App();

        // Setting to `false` so the URLs are easier to compare.
        app.set('addPjaxParam', false);

        app.route('*', 'loadContent', function (req, res, next) {
            test.resume(function () {
                Assert.areSame(req.ioURL, req.url, '`ioURL` and `url` are not the same.');
            });
        });

        app.navigate('assets/page-full.html');
        test.wait(1500);
    },

    '`loadContent()` middleware should put `content` and `ioResponse` on the `res` object': function () {
        var test = this,
            app  = this.app = new Y.App({titleSelector: 'h1'});

        app.route('*', 'loadContent', function (req, res, next) {
            test.resume(function () {
                var content    = res.content,
                    ioResponse = res.ioResponse;

                Assert.isTrue(content.node instanceof Y.Node, '`content.node` is not a Y.Node.');
                Assert.isString(content.title, '`content.title` is not a String.');

                Assert.areSame(200, ioResponse.status, 'status is not 200.');
                Assert.isString(ioResponse.responseText, '`ioResponse.responseText` is not a String.');
            });
        });

        // The snippet is used to the `titleSelector` will work in IE < 9.
        app.navigate('assets/page-snippet.html');
        test.wait(1500);
    }
}));

suite.add(appContentSuite);

}, '@VERSION@', {
    requires: ['app-content', 'test']
});
