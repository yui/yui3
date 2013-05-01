YUI.add('node-scroll-info-test', function (Y) {

var Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    scrollFacadeKeys = [
        'atBottom',
        'atLeft',
        'atRight',
        'atTop',
        'isScrollDown',
        'isScrollLeft',
        'isScrollRight',
        'isScrollUp',
        'scrollBottom',
        'scrollHeight',
        'scrollLeft',
        'scrollRight',
        'scrollTop',
        'scrollWidth'
    ];

Y.Test.Runner.add(new Y.Test.Case({
    name: 'ScrollInfo',
    _should: {
        ignore: {
            //TODO This test is unstable and fails in CI too often
            'scroll event should be throttled within the scrollDelay': true,
            //TODO These tests below should be un-ignored after GH Issue #640 is resolved
            'body: getScrollInfo() should return current scroll information': (Y.UA.android === 2.34),
            'body: scrollLeft event should fire after scrolling down': (Y.UA.android === 2.34),
            'body: scrollRight event should fire after scrolling right': (Y.UA.android === 2.34),
            'body: scrollToBottom event should fire after scrolling to the bottom': (Y.UA.android === 2.34),
            'body: scrollToRight event should fire after scrolling to the extreme right': (Y.UA.android === 2.34)
        }
    },

    setUp: function () {
        this.bodyNode = Y.one('body');
        this.bodyEl   = Y.Node.getDOMNode(this.bodyNode);

        this.divNode = Y.one('#scroll-test');
        this.divEl   = Y.Node.getDOMNode(this.divNode);

        Y.config.win.scrollTo(0, 0);

        this.divEl.scrollLeft = 0;
        this.divEl.scrollTop  = 0;

        this.divNode.removeClass('positioned');

        this.bodyNode.plug(Y.Plugin.ScrollInfo);
        this.divNode.plug(Y.Plugin.ScrollInfo);
    },

    tearDown: function () {
        if (this.bodyNode.scrollInfo) {
            this.bodyNode.unplug('scrollInfo');
        }

        if (this.divNode.scrollInfo) {
            this.divNode.unplug('scrollInfo');
        }

        this.bodyNode.destroy();
        this.divNode.destroy();

        delete this.bodyNode;
        delete this.bodyEl;
        delete this.divNode;
        delete this.divEl;
    },

    // -- Lifecycle ------------------------------------------------------------
    'should detach events when destroyed': function () {
        var scrollInfo = this.divNode.scrollInfo;

        Assert.isTrue(scrollInfo._events.length > 0, 'should store event handles');
        this.divNode.unplug('scrollInfo');
        Assert.isUndefined(scrollInfo._events, 'event handles should be cleaned up after unplug');

    },

    // -- Methods --------------------------------------------------------------
    'getOffscreenNodes() should return offscreen nodes matching the given selector': function () {
        var bodyScrollInfo = this.bodyNode.scrollInfo,
            divScrollInfo  = this.divNode.scrollInfo,
            nodes;

        nodes = bodyScrollInfo.getOffscreenNodes('.marker.body');
        Assert.areSame(2, nodes.size(), 'should find 2 offscreen body nodes');
        Assert.areSame('body-test-right', nodes.item(0).get('id'), 'first offscreen body node should be #body-test-right');
        Assert.areSame('body-test-bottom', nodes.item(1).get('id'), 'second offscreen body node should be #body-test-bottom');

        nodes = divScrollInfo.getOffscreenNodes('.marker.test');
        Assert.areSame(2, nodes.size(), 'should find 2 offscreen nodes inside the scrollable div');
        Assert.areSame('scroll-test-right', nodes.item(0).get('id'), 'first offscreen scrollable div node should be #scroll-test-right');
        Assert.areSame('scroll-test-bottom', nodes.item(1).get('id'), 'second offscreen scrollable div node should be #scroll-test-bottom');
    },

    'body: getOffscreenNodes() should respect the margin parameter': function () {
        var scrollInfo = this.bodyNode.scrollInfo,
            test       = this;

        scrollInfo.once('scroll', function () {
            test.resume(function () {
                var nodes;

                nodes = scrollInfo.getOffscreenNodes('.marker.body', 0);
                Assert.areSame(4, nodes.size(), 'should find 4 offscreen body nodes when called without a margin');

                nodes = scrollInfo.getOffscreenNodes('.marker.body', 200);
                Assert.areSame(2, nodes.size(), 'should find 2 offscreen body nodes when called with a margin');
                Assert.areSame('body-test-right', nodes.item(0).get('id'), 'first offscreen body node should be #body-test-right');
                Assert.areSame('body-test-bottom', nodes.item(1).get('id'), 'second offscreen body node should be #body-test-bottom');
            });
        });

        Y.config.win.scrollTo(100, 0);
        this.wait(500);
    },

    'div: getOffscreenNodes() should respect the margin parameter': function () {
        var scrollInfo = this.divNode.scrollInfo,
            test       = this;

        scrollInfo.once('scroll', function () {
            test.resume(function () {
                var nodes;

                nodes = scrollInfo.getOffscreenNodes('.marker.test', 0);
                Assert.areSame(4, nodes.size(), 'should find 4 offscreen nodes inside the scrollable div when called without a margin');

                nodes = scrollInfo.getOffscreenNodes('.marker.test', 200);
                Assert.areSame(2, nodes.size(), 'should find 2 offscreen nodes inside the scrollable div when called with a margin');
                Assert.areSame('scroll-test-right', nodes.item(0).get('id'), 'first offscreen scrollable div node should be #scroll-test-right');
                Assert.areSame('scroll-test-bottom', nodes.item(1).get('id'), 'second offscreen scrollable div node should be #scroll-test-bottom');
            });
        });

        this.divEl.scrollLeft = 100;
        this.wait(500);
    },

    'getOnscreenNodes() should return onscreen nodes matching the given selector': function () {
        var bodyScrollInfo = this.bodyNode.scrollInfo,
            divScrollInfo  = this.divNode.scrollInfo,
            nodes;

        nodes = bodyScrollInfo.getOnscreenNodes('.marker.body');
        Assert.areSame(2, nodes.size(), 'should find 2 onscreen body nodes');
        Assert.areSame('body-test-top', nodes.item(0).get('id'), 'first onscreen body node should be #body-test-top');
        Assert.areSame('body-test-left', nodes.item(1).get('id'), 'second onscreen body node should be #body-test-left');

        nodes = divScrollInfo.getOnscreenNodes('.marker.test');
        Assert.areSame(2, nodes.size(), 'should find 2 onscreen nodes inside the scrollable div');
        Assert.areSame('scroll-test-top', nodes.item(0).get('id'), 'first onscreen scrollable div node should be #scroll-test-top');
        Assert.areSame('scroll-test-left', nodes.item(1).get('id'), 'second onscreen scrollable div node should be #scroll-test-left');
    },

    'body: getOnscreenNodes() should respect the margin parameter': function () {
        var scrollInfo = this.bodyNode.scrollInfo,
            test       = this;

        scrollInfo.once('scroll', function () {
            test.resume(function () {
                var nodes;

                nodes = scrollInfo.getOnscreenNodes('.marker.body', 0);
                Assert.areSame(0, nodes.size(), 'should find 0 onscreen body nodes when called without a margin');

                nodes = scrollInfo.getOnscreenNodes('.marker.body', 200);
                Assert.areSame(2, nodes.size(), 'should find 2 onscreen body nodes when called with a margin');
                Assert.areSame('body-test-top', nodes.item(0).get('id'), 'first onscreen body node should be #body-test-top');
                Assert.areSame('body-test-left', nodes.item(1).get('id'), 'second onscreen body node should be #body-test-left');
            });
        });

        Y.config.win.scrollTo(100, 0);
        this.wait(500);
    },

    'div: getOnscreenNodes() should respect the margin parameter': function () {
        var scrollInfo = this.divNode.scrollInfo,
            test       = this;

        scrollInfo.once('scroll', function () {
            test.resume(function () {
                var nodes;

                nodes = scrollInfo.getOnscreenNodes('.marker.test', 0);
                Assert.areSame(0, nodes.size(), 'should find 0 onscreen nodes inside the scrollable div when called without a margin');

                nodes = scrollInfo.getOnscreenNodes('.marker.test', 200);
                Assert.areSame(2, nodes.size(), 'should find 2 onscreen nodes inside the scrollable div when called with a margin');
                Assert.areSame('scroll-test-top', nodes.item(0).get('id'), 'first onscreen scrollable div node should be #scroll-test-top');
                Assert.areSame('scroll-test-left', nodes.item(1).get('id'), 'second onscreen scrollable div node should be #scroll-test-left');
            });
        });

        this.divEl.scrollLeft = 100;
        this.wait(500);
    },

    'body: getScrollInfo() should return current scroll information': function () {
        var info = this.bodyNode.scrollInfo.getScrollInfo(),
            test = this;

        Assert.isObject(info, 'return value should be an object');

        Assert.isFalse(info.atBottom, 'atBottom should be false');
        Assert.isTrue(info.atLeft, 'atLeft should be true');
        Assert.isFalse(info.atRight, 'atRight should be false');
        Assert.isTrue(info.atTop, 'atTop should be true');

        Assert.isFalse(info.isScrollDown, 'isScrollDown should be false');
        Assert.isFalse(info.isScrollLeft, 'isScrollLeft should be false');
        Assert.isFalse(info.isScrollRight, 'isScrollRight should be false');
        Assert.isFalse(info.isScrollUp, 'isScrollUp should be false');

        Assert.isNumber(info.scrollBottom, 'scrollBottom should be a number');
        Assert.isNumber(info.scrollHeight, 'scrollHeight should be a number');
        Assert.isNumber(info.scrollLeft, 'scrollLeft should be a number');
        Assert.isNumber(info.scrollRight, 'scrollRight should be a number');
        Assert.isNumber(info.scrollTop, 'scrollTop should be a number');
        Assert.isNumber(info.scrollWidth, 'scrollWidth should be a number');

        Assert.isTrue(info.scrollBottom > 0, 'scrollBottom should be >0');
        Assert.areSame(10000, info.scrollHeight, 'scrollHeight should be 10000');
        Assert.areSame(0, info.scrollLeft, 'scrollLeft should be 0');
        Assert.isTrue(info.scrollRight > 0, 'scrollRight should be >0');
        Assert.areSame(0, info.scrollTop, 'scrollTop should be 0');
        Assert.areSame(10000, info.scrollWidth, 'scrollWidth should be 10000');

        this.bodyNode.scrollInfo.once('scroll', function (e) {
            test.resume(function () {
                var info = test.bodyNode.scrollInfo.getScrollInfo();

                Assert.isTrue(info.atBottom, 'atBottom should be true after scrolling to bottom');
                Assert.isFalse(info.atLeft, 'atLeft should be false after scrolling to right');
                Assert.isTrue(info.atRight, 'atRight should be true after scrolling to right');
                Assert.isFalse(info.atTop, 'atTop should be false after scrolling to bottom');

                Assert.areSame(info.scrollHeight, info.scrollBottom, 'scrollBottom and scrollHeight should be the same after scrolling to bottom');
                Assert.areSame(info.scrollWidth, info.scrollRight, 'scrollRight and scrollWidth should be the same after scrolling to right');
            });
        });

        Y.config.win.scrollTo(10000, 10000);

        this.wait(500);
    },

    'div: getScrollInfo() should return current scroll information': function () {
        var info = this.divNode.scrollInfo.getScrollInfo(),
            test = this;

        Assert.isObject(info, 'return value should be an object');

        Assert.isFalse(info.atBottom, 'atBottom should be false');
        Assert.isTrue(info.atLeft, 'atLeft should be true');
        Assert.isFalse(info.atRight, 'atRight should be false');
        Assert.isTrue(info.atTop, 'atTop should be true');

        Assert.isFalse(info.isScrollDown, 'isScrollDown should be false');
        Assert.isFalse(info.isScrollLeft, 'isScrollLeft should be false');
        Assert.isFalse(info.isScrollRight, 'isScrollRight should be false');
        Assert.isFalse(info.isScrollUp, 'isScrollUp should be false');

        Assert.isNumber(info.scrollBottom, 'scrollBottom should be a number');
        Assert.isNumber(info.scrollHeight, 'scrollHeight should be a number');
        Assert.isNumber(info.scrollLeft, 'scrollLeft should be a number');
        Assert.isNumber(info.scrollRight, 'scrollRight should be a number');
        Assert.isNumber(info.scrollTop, 'scrollTop should be a number');
        Assert.isNumber(info.scrollWidth, 'scrollWidth should be a number');

        Assert.isTrue(info.scrollBottom > 0, 'scrollBottom should be >0');
        Assert.areSame(10000, info.scrollHeight, 'scrollHeight should be 10000');
        Assert.areSame(0, info.scrollLeft, 'scrollLeft should be 0');
        Assert.isTrue(info.scrollRight > 0, 'scrollRight should be >0');
        Assert.areSame(0, info.scrollTop, 'scrollTop should be 0');
        Assert.areSame(10000, info.scrollWidth, 'scrollWidth should be 10000');

        this.divNode.scrollInfo.once('scroll', function () {
            test.resume(function () {
                var info = test.divNode.scrollInfo.getScrollInfo();

                Assert.isTrue(info.atBottom, 'atBottom should be true after scrolling to bottom');
                Assert.isFalse(info.atLeft, 'atLeft should be false after scrolling to right');
                Assert.isTrue(info.atRight, 'atRight should be true after scrolling to right');
                Assert.isFalse(info.atTop, 'atTop should be false after scrolling to bottom');

                Assert.areSame(info.scrollHeight, info.scrollBottom, 'scrollBottom and scrollHeight should be the same after scrolling to bottom');
                Assert.areSame(info.scrollWidth, info.scrollRight, 'scrollRight and scrollWidth should be the same after scrolling to right');
            });
        });

        this.divEl.scrollTop  = 10000;
        this.divEl.scrollLeft = 10000;

        this.wait(500);
    },

    "refreshDimensions() should refresh cached info on a node's dimensions": function () {
        var si = this.divNode.scrollInfo,
            dimensions;

        dimensions = {
            height: si._height,
            left  : si._left,
            top   : si._top,
            width : si._width
        };

        this.divNode.addClass('positioned');

        Assert.areSame(dimensions.height, si._height, 'height should be cached');
        Assert.areSame(dimensions.left, si._left, 'left pos should be cached');
        Assert.areSame(dimensions.top, si._top, 'top pos should be cached');
        Assert.areSame(dimensions.width, si._width, 'width should be cached');

        dimensions = {
            height: this.divEl.clientHeight,
            left  : this.divEl.offsetLeft,
            top   : this.divEl.offsetTop,
            width : this.divEl.clientWidth
        };

        si.refreshDimensions();

        Assert.areSame(dimensions.height, si._height, 'height should be updated');
        Assert.areSame(dimensions.left, si._left, 'left pos should be updated');
        Assert.areSame(dimensions.top, si._top, 'top pos should be updated');
        Assert.areSame(dimensions.width, si._width, 'width should be updated');
    },

    // -- Events ---------------------------------------------------------------
    'body: scroll event should fire on scroll': function () {
        var test = this;

        this.bodyNode.scrollInfo.once('scroll', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');

                Assert.isFalse(e.atTop, 'atTop should be false');
                Assert.isTrue(e.isScrollDown, 'isScrollDown should be true');
                Assert.isFalse(e.isScrollUp, 'isScrollUp should be false');
                Assert.areSame(1000, e.scrollTop, 'scrollTop should === 1000');
            });
        });

        Y.config.win.scrollTo(0, 1000);

        this.wait(500);
    },

    'div: scroll event should fire on scroll': function () {
        var test = this;

        this.divNode.scrollInfo.once('scroll', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');

                Assert.isFalse(e.atTop, 'atTop should be false');
                Assert.isTrue(e.isScrollDown, 'isScrollDown should be true');
                Assert.isFalse(e.isScrollUp, 'isScrollUp should be false');
                Assert.areSame(1000, e.scrollTop, 'scrollTop should === 1000');
            });
        });

        this.divEl.scrollTop = 1000;

        this.wait(500);
    },

    'scroll event should be throttled within the scrollDelay': function () {
        var count     = 0,
            scrollTop = 0,
            test      = this;

        this.divNode.scrollInfo.on('scroll', function () {
            count += 1;
        });

        function scroll() {
            if (!test.divEl) {
                return;
            }

            test.divEl.scrollTop = scrollTop += 100;

            if (scrollTop < 1000) {
                setTimeout(scroll, 20);
            }
        }

        scroll();

        this.wait(function () {
            Assert.areSame(1, count, 'scroll event should only fire once');
        }, 300);
    },

    'body: scrollLeft event should fire after scrolling down': function () {
        var test = this;

        this.bodyNode.scrollInfo.once('scrollDown', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        Y.config.win.scrollTo(0, 100);

        this.wait(500);
    },

    'div: scrollDown event should fire after scrolling down': function () {
        var test = this;

        this.divNode.scrollInfo.once('scrollDown', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        this.divEl.scrollTop = 100;

        this.wait(500);
    },

    'body: scrollLeft event should fire after scrolling left': function () {
        var test = this;

        this.bodyNode.scrollInfo.set('scrollDelay', 0);

        Y.config.win.scrollTo(100, 0);

        this.bodyNode.scrollInfo.once('scrollLeft', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        setTimeout(function () {
            Y.config.win.scrollTo(0, 0);
        }, 50);

        this.wait(500);
    },

    'div: scrollLeft event should fire after scrolling left': function () {
        var test = this;

        this.divNode.scrollInfo.set('scrollDelay', 0);

        this.divEl.scrollLeft = 100;

        this.divNode.scrollInfo.once('scrollLeft', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        setTimeout(function () {
            test.divEl.scrollLeft = 0;
        }, 50);

        this.wait(500);
    },

    'body: scrollRight event should fire after scrolling right': function () {
        var test = this;

        this.bodyNode.scrollInfo.once('scrollRight', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        Y.config.win.scrollTo(100, 0);

        this.wait(500);
    },

    'div: scrollRight event should fire after scrolling right': function () {
        var test = this;

        this.divNode.scrollInfo.once('scrollRight', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        this.divEl.scrollLeft = 100;

        this.wait(500);
    },

    'body: scrollUp event should fire after scrolling up': function () {
        var test = this;

        this.bodyNode.scrollInfo.set('scrollDelay', 0);

        Y.config.win.scrollTo(0, 100);

        this.bodyNode.scrollInfo.once('scrollUp', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        setTimeout(function () {
            Y.config.win.scrollTo(0, 0);
        }, 50);

        this.wait(500);
    },

    'div: scrollUp event should fire after scrolling up': function () {
        var test = this;

        this.divNode.scrollInfo.set('scrollDelay', 0);

        this.divEl.scrollTop = 100;

        this.divNode.scrollInfo.once('scrollUp', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        setTimeout(function () {
            test.divEl.scrollTop = 0;
        }, 50);

        this.wait(500);
    },

    'body: scrollToBottom event should fire after scrolling to the bottom': function () {
        var test = this;

        this.bodyNode.scrollInfo.once('scrollToBottom', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        Y.config.win.scrollTo(0, 10000);

        this.wait(500);
    },

    'div: scrollToBottom event should fire after scrolling to the bottom': function () {
        var test = this;

        this.divNode.scrollInfo.once('scrollToBottom', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        this.divEl.scrollTop = 10000;

        this.wait(500);
    },

    'body: scrollToLeft event should fire after scrolling to the extreme left': function () {
        var test = this;

        this.bodyNode.scrollInfo.set('scrollDelay', 0);

        Y.config.win.scrollTo(100, 0);

        this.bodyNode.scrollInfo.once('scrollToLeft', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        setTimeout(function () {
            Y.config.win.scrollTo(0, 0);
        }, 50);

        this.wait(500);
    },

    'div: scrollToLeft event should fire after scrolling to the extreme left': function () {
        var test = this;

        this.divNode.scrollInfo.set('scrollDelay', 0);

        this.divEl.scrollLeft = 100;

        this.divNode.scrollInfo.once('scrollToLeft', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        setTimeout(function () {
            test.divEl.scrollLeft = 0;
        }, 50);

        this.wait(500);
    },

    'body: scrollToRight event should fire after scrolling to the extreme right': function () {
        var test = this;

        this.bodyNode.scrollInfo.once('scrollToRight', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        Y.config.win.scrollTo(10000, 0);

        this.wait(500);
    },

    'div: scrollToRight event should fire after scrolling to the extreme right': function () {
        var test = this;

        this.divNode.scrollInfo.once('scrollToRight', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        this.divEl.scrollLeft = 10000;

        this.wait(500);
    },

    'body: scrollToTop event should fire after scrolling to the top': function () {
        var test = this;

        this.bodyNode.scrollInfo.set('scrollDelay', 0);

        Y.config.win.scrollTo(0, 100);

        this.bodyNode.scrollInfo.once('scrollToTop', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        setTimeout(function () {
            Y.config.win.scrollTo(0, 0);
        }, 50);

        this.wait(500);
    },

    'div: scrollToTop event should fire after scrolling to the top': function () {
        var test = this;

        this.divNode.scrollInfo.set('scrollDelay', 0);

        this.divEl.scrollTop = 100;

        this.divNode.scrollInfo.once('scrollToTop', function (e) {
            test.resume(function () {
                ObjectAssert.ownsKeys(scrollFacadeKeys, e, 'event facade should contain scroll info properties');
            });
        });

        setTimeout(function () {
            test.divEl.scrollTop = 0;
        }, 50);

        this.wait(500);
    }
}));

}, '@VERSION@', {requires:['node-scroll-info', 'test']});
