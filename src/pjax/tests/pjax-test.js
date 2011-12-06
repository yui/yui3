/*
These tests test Y.Plugin.Pjax, since it sits at the top of a stack that
includes Y.PjaxBase and Y.Pjax, giving us full coverage of all three.

Note: These tests should ideally be run from an HTTP URL. If run from the local
filesystem, the tests that require XHR will be skipped.
*/
YUI.add('pjax-test', function (Y) {

var Assert = Y.Assert,

    // Tests that require XHR are ignored when the protocol isn't http or https,
    // since the XHR requests will fail.
    disableXHR = Y.config.win &&
            Y.config.win.location.protocol.indexOf('http') === -1,

    html5       = Y.Router.html5,
    win         = Y.config.win,
    originalURL = (win && win.location.toString()) || '',

    suite;

function resetURL() {
    if (html5) {
        win && win.history.replaceState(null, null, originalURL);
    }
}

// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite({
    name: 'Pjax',

    setUp: function () {
        resetURL();
    },

    tearDown: function () {
        resetURL();
    }
});

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: function () {
        this.node = Y.one('#test-content');
    },

    tearDown: function () {
        this.node.unplug(Y.Plugin.Pjax);
        delete this.node;
    },

    'should plug into a Node instance': function () {
        this.node.plug(Y.Plugin.Pjax);
        Assert.isInstanceOf(Y.Plugin.Pjax, this.node.pjax);
    }
}));

// -- Attributes and Properties ------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Attributes and Properties',

    setUp: function () {
        this.node = Y.one('#test-content');
        this.pjax = this.node.plug(Y.Plugin.Pjax).pjax;
    },

    tearDown: function () {
        this.node.unplug(Y.Plugin.Pjax);
        delete this.node;
        delete this.pjax;
    },

    '`container` should be null by default': function () {
        var pjax = new Y.Pjax();

        Assert.isNull(pjax.get('container'));
        pjax.destroy();
    },

    'container` should always be `null` or a Node instance': function () {
        var pjax = new Y.Pjax();

        pjax.set('container', '#test-content');
        Assert.isInstanceOf(Y.Node, pjax.get('container'));

        pjax.set('container', Y.one('#test-content'));
        Assert.isInstanceOf(Y.Node, pjax.get('container'));

        pjax.set('container', Y.config.doc.getElementById('test-content'));
        Assert.isInstanceOf(Y.Node, pjax.get('container'));

        pjax.set('container', null);
        Assert.isNull(pjax.get('container'));

        pjax.destroy();
    },

    '`contentSelector` should be null by default': function () {
        Assert.isNull(this.pjax.get('contentSelector'));
    },

    '`linkSelector` should select links with class "yui3-pjax" by default': function () {
        Assert.areSame('a.yui3-pjax', this.pjax.get('linkSelector'));
    },

    '`scrollToTop` should be true by default': function () {
        Assert.isTrue(this.pjax.get('scrollToTop'));
    },

    '`timeout` should default to 30000ms': function () {
        Assert.areSame(30000, this.pjax.get('timeout'));
    },

    '`titleSelector` should select the title tag by default': function () {
        Assert.areSame('title', this.pjax.get('titleSelector'));
    }
}));

// -- Events -------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Events',

    _should: {
        ignore: {
            '`error` event should fire on Ajax failure': disableXHR || !html5,
            '`load` event should fire on Ajax success': disableXHR || !html5,
            '`navigate` event facade should contain the options passed to `navigate()`': disableXHR || !html5,
            '`navigate` event should fire when a pjax link is clicked': !html5,
            '`navigate` event should be preventable': !html5,
            '`navigate` event should not fire when a link is clicked with a button other than the left button': !html5,
            '`navigate` event should not fire when a modifier key is pressed': !html5
        }
    },

    setUp: function () {
        this.node = Y.one('#test-content');
        this.node.setContent('');

        this.pjax = this.node.plug(Y.Plugin.Pjax).pjax;
    },

    tearDown: function () {
        resetURL();

        this.node.unplug(Y.Plugin.Pjax);

        delete this.node;
        delete this.pjax;
        delete this.oldPath;
    },

    'should attach events on init in HTML5 browsers': function () {
        if (html5) {
            Assert.isInstanceOf(Y.EventHandle, this.pjax._pjaxEvents);
        } else {
            Assert.isUndefined(this.pjax._pjaxEvents);
        }
    },

    '`error` event should fire on Ajax failure': function () {
        var test = this;

        this.pjax.once('error', function (e) {
            test.resume(function () {
                Assert.isObject(e.content);
                Assert.isInstanceOf(Y.Node, e.content.node);
                Assert.isString(e.responseText);
                Assert.areSame(404, e.status);
            });
        });

        this.pjax.navigate('bogus.html');
        this.wait(1000);
    },

    '`error` event should be preventable': function () {
        this.pjax._defCompletefn = function () {
            Assert.fail();
        };

        this.pjax.on('error', function (e) {
            e.preventDefault();
        });

        this.pjax.fire('error');
    },

    '`load` event should fire on Ajax success': function () {
        var test = this;

        this.pjax.once('load', function (e) {
            e.preventDefault();

            test.resume(function () {
                Assert.isObject(e.content);
                Assert.isInstanceOf(Y.Node, e.content.node);
                Assert.isString(e.content.title);
                Assert.isString(e.responseText);
                Assert.areSame(200, e.status);
            });
        });

        this.pjax.navigate('assets/page-full.html');
        this.wait(1000);
    },

    '`load` event should be preventable': function () {
        this.pjax._defCompleteFn = function () {
            Assert.fail();
        };

        this.pjax.on('load', function (e) {
            e.preventDefault();
        });

        this.pjax.fire('load');
    },

    '`navigate` event facade should contain the options passed to `navigate()`': function () {
        var called  = 0,
            options = {
                title: 'Bogus Page'
            },
            title;

        this.pjax.on('navigate', function (e) {
            called++;
            title = e.title;
        });

        this.pjax.navigate('bogus.html', options);

        Assert.areSame(1, called);
        Assert.areSame(title, options.title);
    },

    '`navigate` event should fire when a pjax link is clicked': function () {
        var event = {
                button        : 1,
                currentTarget : Y.one('#link-full'),
                preventDefault: function () {}
            },
            called;

        this.pjax.once('navigate', function (e) {
            called = 1;

            e.preventDefault();

            Assert.areSame(event, e.originEvent);
            Assert.areSame(Y.one('#link-full').get('href'), e.url);
        });

        // Fake click event.
        this.pjax._onLinkClick(event);

        Assert.areSame(1, called);
    },

    '`navigate` event should be preventable': function () {
        var called;

        this.pjax.once('navigate', function (e) {
            e.preventDefault();
        });

        // Fake click event.
        this.pjax._onLinkClick({
            button        : 1,
            currentTarget : Y.one('#link-full'),
            preventDefault: function () {
                called = 1;
            }
        });

        Assert.areSame(1, called);
    },

    '`navigate` event should not fire when a link is clicked with a button other than the left button': function () {
        this.pjax.once('navigate', function (e) {
            Assert.fail();
        });

        // Fake click event.
        this.pjax._onLinkClick({
            button        : 2,
            currentTarget : Y.one('#link-full'),
            preventDefault: function () {}
        });
    },

    '`navigate` event should not fire when a modifier key is pressed': function () {
        this.pjax.on('navigate', function (e) {
            Assert.fail();
        });

        // Fake click event.
        this.pjax._onLinkClick({
            button        : 1,
            ctrlKey       : true,
            currentTarget : Y.one('#link-full'),
            preventDefault: function () {}
        });

        this.pjax._onLinkClick({
            button        : 1,
            metaKey       : true,
            currentTarget : Y.one('#link-full'),
            preventDefault: function () {}
        });
    }
}));

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    _should: {
        ignore: {
            '`navigate()` should load the specified URL and fire a `load` event': disableXHR || !html5
        }
    },

    setUp: function () {
        this.node = Y.one('#test-content');
        this.node.setContent('');

        this.pjax = this.node.plug(Y.Plugin.Pjax).pjax;
    },

    tearDown: function () {
        resetURL();

        this.node.unplug(Y.Plugin.Pjax);

        delete this.node;
        delete this.pjax;
        delete this.oldPath;
    },

    '`navigate()` should load the specified URL and fire a `load` event': function () {
        var test = this;

        this.pjax.once('load', function (e) {
            e.preventDefault();
            test.resume();
        });

        this.pjax.navigate('assets/page-full.html');
        this.wait(1000);
    }
}));

// -- General Behavior ---------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'General Behavior',

    _should: {
        ignore: {
            'Page title should be updated if the `titleSelector` matches an element': disableXHR || !Y.config.doc || !html5,
            'Host element content should be updated with page content when `contentSelector` is null': disableXHR || !html5,
            'Host element content should be updated with partial content when `contentSelector` selects a node': disableXHR || !html5
        }
    },

    setUp: function () {
        this.node = Y.one('#test-content');
        this.node.setContent('');

        this.pjax = this.node.plug(Y.Plugin.Pjax).pjax;
    },

    tearDown: function () {
        resetURL();

        this.node.unplug(Y.Plugin.Pjax);

        delete this.node;
        delete this.pjax;
        delete this.oldPath;
    },

    'Page title should be updated if the `titleSelector` matches an element': function () {
        var test = this;

        this.pjax.onceAfter('load', function (e) {
            test.resume(function () {
                Assert.areSame('Full Page', e.content.title);
                Assert.areSame('Full Page', Y.config.doc.title);
            });
        });

        this.pjax.navigate('assets/page-full.html');

        this.wait(1000);
    },

    'Host element content should be updated with page content when `contentSelector` is null': function () {
        var test = this;

        this.pjax.onceAfter('load', function (e) {
            test.resume(function () {
                Assert.isInstanceOf(Y.Node, test.node.one('title'));
                Y.assert(test.node.get('text').indexOf("I'm a full HTML page!") !== -1);
            });
        });

        this.pjax.navigate('assets/page-full.html');

        this.wait(1000);
    },

    'Host element content should be updated with partial content when `contentSelector` selects a node': function () {
        var test = this;

        this.pjax.set('contentSelector', 'p.foo');

        this.pjax.onceAfter('load', function (e) {
            test.resume(function () {
                Assert.areSame('Hello!', test.node.get('text'));
            });
        });

        this.pjax.navigate('assets/page-partial.html');

        this.wait(1000);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['pjax-plugin', 'test']
});
