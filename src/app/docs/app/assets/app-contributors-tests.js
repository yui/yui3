YUI.add('app-contributors-tests', function (Y) {

var Assert      = Y.Assert,
    HistoryHash = Y.HistoryHash,

    usernameSelector = '#github-app-username',

    githubApp = Y.one('#github-app'),
    appViews  = githubApp && githubApp.one('.yui3-app-views'),
    suite     = new Y.Test.Suite('GitHub Contributors Example App Suite');

function Wait() {}

Wait.forNode = function (selector) {
    var wait = new Wait();

    wait.testFn = function () { return !!Y.one('.example ' + selector); };

    return wait;
};

Wait.prototype = {
    check: function () {
        if (this.ready()) {
            this.clear();
            this.test.resume(this.callback);
        }

        return this;
    },

    clear: function () {
        clearInterval(this.timer);
        return this;
    },

    thenResume: function (test, callback) {
        this.test     = test;
        this.callback = callback;

        return this;
    },

    toAppear: function () {
        var self   = this,
            testFn = self.testFn;

        self.ready = function () {
            return testFn.apply(self, arguments);
        };

        return this;
    },

    toDisappear: function () {
        var self   = this,
            testFn = self.testFn;

        self.ready = function () {
            return !testFn.apply(self, arguments);
        };

        return this;
    },

    until: function (ms) {
        var self = this;

        self.timer = setInterval(function () {
            self.check();
        }, 100);

        self.test.wait(ms || 0);
        self.check();

        return this;
    }
};

suite.add(new Y.Test.Case({
    name: 'Example Tests',

    'Setting the URL hash should navigate the app': function () {
        // Wait for initial page/view to load and render.
        Wait.forNode('.yui3-app-views div').toAppear().thenResume(this, function () {
            HistoryHash.setHash('/');

            // Wait for hash to change and view to transition.
            Wait.forNode('.home-page').toAppear().thenResume(this, function () {
                Wait.forNode('.yui3-app-transitioning').toDisappear().thenResume(this, function () {
                    var activeView = appViews.get('firstChild');

                    Assert.areSame('/', HistoryHash.getHash(), 'URL hash was not updated to "/".');
                    Assert.isTrue(activeView.hasClass('home-page'), 'HomePageView is not currently active.');
                }).until(1000);
            }).until(1000);
        }).until(10000);
    },

    'Setting the username should nativate the app to their repos list': function () {
        var input  = Y.one(usernameSelector),
            button = input.next('button');

        input.set('value', 'yui');
        button.simulate('click');

        // Wait for data to load and view to transition.
        Wait.forNode('.user-page').toAppear().thenResume(this, function () {
            Wait.forNode('.yui3-app-transitioning').toDisappear().thenResume(this, function () {
                var activeView = appViews.get('firstChild');

                Assert.areSame('/github/yui/', HistoryHash.getHash(), 'URL hash was not updated.');
                Assert.isTrue(activeView.hasClass('user-page'), 'UserPageView is not currently active.');
            }).until(1000);
        }).until(10000);
    },

    'Browser back/forward buttons should work normally': function () {
        var history = Y.config.win.history,
            activeView;

        history.back();

        // Wait for the view to transition.
        this.wait(function () {
            activeView = appViews.get('firstChild');

            Assert.areSame('/', HistoryHash.getHash(), 'URL hash was not updated.');
            Assert.isTrue(activeView.hasClass('home-page'), 'HomePageView is not currently active.');

            history.forward();

            // Wiat for the view to transition.
            this.wait(function () {
                activeView = appViews.get('firstChild');

                Assert.areSame('/github/yui/', HistoryHash.getHash(), 'URL hash was not updated.');
                Assert.isTrue(activeView.hasClass('user-page'), 'UserPageView is not currently active.');
            }, 500);
        }, 500);
    },

    'Clicking a listed repo should navigate to the repo page': function () {
        var activeView = appViews.get('firstChild'),
            repo       = activeView.one('.repo'),
            repoPageURL = repo && repo.one('a').get('href');

        Assert.isTrue(activeView.hasClass('user-page'), 'UserPageView is not currently active.');
        Assert.isNotNull(repo, 'List contains no repos.');

        repo.simulate('click');

        // Wait for data to load and view to transitions.
        Wait.forNode('.repo-page').toAppear().thenResume(this, function () {
            Wait.forNode('.yui3-app-transitioning').toDisappear().thenResume(this, function () {
                activeView = appViews.get('firstChild');

                Assert.areSame(Y.getLocation().toString(), repoPageURL, 'URL was not updated.');
                Assert.isTrue(activeView.hasClass('repo-page'), 'RepoPageView is not currently active.');
            }).until(1000);
        }).until(10000);
    },

    'Clicking a listed contributor should navigate to the app to their repos list': function () {
        var activeView  = appViews.get('firstChild'),
            contributor = activeView.one('.contributor'),
            userPageURL = contributor && contributor.one('a').get('href');

        Assert.isTrue(activeView.hasClass('repo-page'), 'RepoPageView is not currently active.');
        Assert.isNotNull(contributor, 'List contains no contributors.');

        contributor.one('a').simulate('click');

        // Wait for data to load and view to transitions.
        Wait.forNode('.user-page').toAppear().thenResume(this, function () {
            Wait.forNode('.yui3-app-transitioning').toDisappear().thenResume(this, function () {
                activeView = appViews.get('firstChild');

                Assert.areSame(Y.getLocation().toString(), userPageURL, 'URL was not updated.');
                Assert.isTrue(activeView.hasClass('user-page'), 'UserPageView is not currently active.');
            }).until(1000);
        }).until(10000);
    },

    'Clicking the "Choose Someone Different" link should take you back to input a username': function () {
        var activeView = appViews.get('firstChild'),
            backLink   = activeView.one('.back a');

        Assert.isTrue(activeView.hasClass('user-page'), 'UserPageView is not currently active.');
        Assert.isNotNull(backLink, 'View contains no back link.');

        backLink.simulate('click');

        // Wait for the view to transitions.
        this.wait(function () {
            activeView = appViews.get('firstChild');

            Assert.areSame('/', HistoryHash.getHash(), 'URL was not updated.');
            Assert.isTrue(activeView.hasClass('home-page'), 'HomePageView is not currently active.');
        }, 500);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['history-hash', 'node', 'node-event-simulate']
});
