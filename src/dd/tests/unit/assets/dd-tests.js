YUI.add('dd-tests', function(Y) {

    var dd_events = [
        'drag:drag',
        'drag:drophit',
        'drag:end',
        'drag:start',
        'drag:enter',
        'drag:over',
        'drop:over',
        'drop:enter',
        'drop:hit'
    ],
    moveCount = 729,
    dropCount = 30;

            
            if (Y.UA.ie) {
                if (Y.UA.ie >= 9) {
                    dropCount = 30;
                } else if (Y.UA.ie > 7) {
                    dropCount = 32;
                } else if (Y.UA.ie < 7) {
                    dropCount = 26;
                } else if (Y.UA.ie < 8) {
                    dropCount = 28;
                }
            }

            
        var _count = {},
        _resetCount = function() {
            Y.each(_count, function(v, k) {
                _count[k] = 0;
            });
        },
        _fakeStart = function(node) {
            var noop = function() {};

            _resetCount();
            Y.DD.DDM._noShim = true;
            node._dragThreshMet = true;
            node._handleMouseDownEvent({
                button: 0,
                target: node.get('node'),
                currentTarget: node.get('node'),
                preventDefault: noop,
                halt: noop
            });
            node.set('activeHandle', node.get('node'));                    
            node._setStartPosition(node.get('node').getXY());
            Y.DD.DDM.activeDrag = node;
            Y.DD.DDM._start();
            node.start();
        },
        _fakeEnd = function(node) {
            Y.DD.DDM._end();
            node.end();
            node._handleMouseUp();
            Y.DD.DDM._noShim = false;
            Y.DD.DDM.stopDrag();
        },
        _moveNode = function(node, num, flip) {
            if (flip) {
                Y.DD.DDM._move({ pageX: 110, pageY: num });
            } else {
                Y.DD.DDM._move({ pageX: num, pageY: 110 });
            }
        },
        _moveNodeAll = function(node, max, flip) {
            for (var i = 0; i < max; i++) {
                _moveNode(node, i, flip);
            }
        },
        _fakeMove = function(node, max, flip) {
            _fakeStart(node);
            _moveNodeAll(node, max, flip);
            _fakeEnd(node);
        },
        _data = {
            one: 1,
            two: 2,
            three: 3
        },
        _handleCount = function(e) {
            if (!_count[e.type]) {
                _count[e.type] = 0;
            }
            _count[e.type]++;
        },
        dd, drop, proxy, del,

    template = {
        name: 'DD Test',

        _should: {
            ignore: {
                'test: proxy cloneNode with radio inputs': Y.UA.phantomjs || (Y.UA.android && Y.UA.android < 4.4)
            }
        },

        setUp : function() {
        },
        
        tearDown : function() {
        },
        test_shim: function() {
            var s = Y.DD.DDM._pg;
            Y.Assert.isNull(s, 'Shim: Node Instance');
        },
        test_drop_setup: function() {
            drop = new Y.DD.Drop({ node: '#drop', data: { one: 1, two: 2, three: 3 }, bubbles: Y.DD.DDM });
            Y.Assert.isInstanceOf(Y.DD.Drop, drop, 'drop: Drop Instance');
            Y.Assert.isTrue(drop.get('node').hasClass('yui3-dd-drop'), 'drop: Drop Instance ClassName');
            drop.destroy();

            var d = Y.one('#drop').plug(Y.Plugin.Drop, {
                data: { one: 1, two: 2, three: 3 }
            });

            drop = Y.DD.DDM.getDrop('#drop');

            var len = Y.DD.DDM.validDrops.length;
            Y.DD.DDM._addValid(drop);
            var len2 = Y.DD.DDM.validDrops.length;
            Y.DD.DDM._removeValid(drop);
            var len3 = Y.DD.DDM.validDrops.length;

            Y.Assert.areSame(len, 0, 'There are active drops');
            Y.Assert.areSame(len2, 1, 'Failed to register drops');
            Y.Assert.areSame(len3, 0, 'There are active drops');

        },
        test_drop_setup_events: function() {
            Y.each(dd_events, function(v) {
                var handle = drop.on(v, _handleCount);
                Y.Assert.isInstanceOf(Y.EventHandle, handle, 'drop:handle [' + v + ']: Handle Instance');
            });
        },
        test_drag_setup: function() {
            dd = new Y.DD.Drag({ node: '#drag', bubbles: Y.DD.DDM });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isTrue(dd.get('node').hasClass('yui3-dd-draggable'), 'dd: Drag Instance ClassName');
        },
        test_shim_after: function() {
            var s = Y.DD.DDM._pg;
            Y.Assert.isInstanceOf(Y.Node, s, 'Shim: Node Instance');
        },
        test_drag_drop_setup: function() {
            dd.destroy();
            dd = new Y.DD.Drag({ node: '#drag', target: true });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isTrue(dd.get('node').hasClass('yui3-dd-draggable'), 'dd: Drag Instance ClassName');
            Y.Assert.isInstanceOf(Y.DD.Drop, dd.target, 'drag.target: Drop Instance');
            Y.each(dd._yuievt.targets, function(v, k) {
                Y.Assert.areSame(v, dd.target._yuievt.targets[k], 'bubbleTargets are not the same');
            });
            
        },
        test_drag_invalids: function() {
            var len = Y.Object.keys(dd._invalids).length;
            dd.addInvalid('foo');
            Y.Assert.areSame((len + 1), Y.Object.keys(dd._invalids).length, 'Failed to add to invalid list');
            dd.removeInvalid('foo');
            Y.Assert.areSame(len, Y.Object.keys(dd._invalids).length, 'Failed to remove from invalid list');
            
        },
        test_drag_groups: function() {
            Y.Assert.areSame(1, dd.get('groups').length, 'DD already in a group');
            dd.addToGroup('foo');
            Y.Assert.areSame(2, dd.get('groups').length, 'Failed to add DD to a group');
            dd.removeFromGroup('foo');
            Y.Assert.areSame(1, dd.get('groups').length, 'Failed to remove DD from a group');
        },
        test_drop_groups: function() {
            Y.Assert.areSame(1, dd.target.get('groups').length, 'DD already in a group');
            dd.target.addToGroup('foo');
            Y.Assert.areSame(2, dd.target.get('groups').length, 'Failed to add DD to a group');
            dd.target.removeFromGroup('foo');
            Y.Assert.areSame(1, dd.target.get('groups').length, 'Failed to remove DD from a group');
        },
        'test: _shimming test for mousemove events': function() {
            var e = new Y.DOMEventFacade({type:'mousemove', preventDefault: function () {}, fromDom: false }),
                curShimming = Y.DD.DDM._shimming,
                _docMove = Y.DD.DDM._docMove,
                _move = Y.DD.DDM._move;



            Y.DD.DDM._docMove = function(ev) {
                ev.fromDom = true;
                if (!this._shimming) {
                    this._move(ev);
                }
                _docMove.apply(Y.DD.DDM, [ev]);
                ev.fromDom = false;
            };

            Y.DD.DDM._move = function(ev) {
                Y.Assert.areSame('mousemove', ev.type, 'Event type is not `mousemove`.');

                if (this._shimming) {
                    // shouldn't have come from _domMove
                    Y.Assert.isFalse(ev.fromDom, 'MouseMove Event is from DOM but but should not be');
                } else {
                    // should be from _domMove
                    Y.Assert.isTrue(ev.fromDom, 'MouseMove Event is not from DOM but should be.')
                }

                _move.apply(Y.DD.DDM, [ev])

            };

            Y.DD.DDM._shimming = false;
            Y.DD.DDM._docMove(e);
            Y.DD.DDM._shimming = true;
            Y.DD.DDM._docMove(e);


            // tear down
            Y.DD.DDM._shimming = curShimming;
            Y.DD.DDM._docMove = _docMove;
            Y.DD.DDM._move = _move;
        },
        test_drop_overs: function() {
            dd.target._createShim();
            dd.target._handleOverEvent();
            var zIndex = parseInt(dd.target.shim.getStyle('zIndex'), 0);
            Y.Assert.areSame(999, zIndex, 'Failed to change zIndex of shim');

            dd.target._handleOutEvent();
            var zIndex = parseInt(dd.target.shim.getStyle('zIndex'), 0);
            Y.Assert.areSame(1, zIndex, 'Failed to change zIndex of shim');
            
            dd.target.overTarget = true;
            Y.DD.DDM.activeDrag = dd.target;
            dd.target._handleOut(true);


        },
        test_drag_handles: function() {
            Y.Assert.isNull(dd._handles, 'Drag has handles already');
            dd.addHandle('foo');
            Y.Assert.areSame(1, Y.Object.keys(dd._handles).length, 'Failed to add handle to dd');
            dd.removeHandle('foo');
            Y.Assert.areSame(0, Y.Object.keys(dd._handles).length, 'Failed to remove handle from dd');
            Y.Assert.isObject(dd._handles, 'Handles is not an Object');
        },
        'test: _prevEndFn': function() {
            dd._prevEndFn({});

            Y.Assert.isNull(dd._ev_md);
            Y.Assert.isNull(dd.region);
            dd.stopDrag();
        },
        'test: selectionFix with valid click': function() {
            var ret = dd._ieSelectFix(),
                fired = false;
            Y.Assert.isFalse(ret);
            dd.validClick = function() { return true; };
            dd._fixDragStart({
                preventDefault: function() {
                    fired = true;
                }
            });

            Y.Assert.isTrue(fired);

        },
        'test: selectionFix without valid click': function() {
            var ret = dd._ieSelectFix(),
                fired = false;

            Y.Assert.isFalse(ret);

            dd.validClick = function() { return false; };
            dd._fixDragStart({
                preventDefault: function() {
                    fired = true;
                }
            });

            Y.Assert.isFalse(fired);

        },
        test_drag_drop_group_setup: function() {
            dd.destroy();
            dd = new Y.DD.Drag({ node: '#drag', groups: ['one', 'two'], target: true });
            Y.Assert.areSame(dd.get('groups').length, dd.target.get('groups').length, 'Groups failed to pass from Drag to Drop');
        },
        test_drag_drop_group_pass_setup: function() {
            dd.destroy();
            dd = new Y.DD.Drag({ node: '#drag', target: { groups: ['one', 'two'] } });
            Y.Assert.areSame(1, dd.get('groups').length, 'Groups failed to pass from Drag to Drop');
            Y.Assert.areSame(2, dd.target.get('groups').length, 'Groups failed to pass from Drag to Drop');
        },
        test_drag_add_handle: function() {
            Y.Assert.isNull(dd._handles, 'dd: Handles NOT Null');
            dd.set('handles', ['h2']);
            Y.Assert.isObject(dd._handles, 'dd: Handles not an object');
            Y.Assert.isNotUndefined(dd._handles.h2, 'dd: Handles H2 not there');
            dd.set('handles', false);
            Y.Assert.isNull(dd._handles, 'dd: Handles NOT Null');
            dd.addHandle('h2');
            Y.Assert.isObject(dd._handles, 'dd: Handles not an object');
            Y.Assert.isNotUndefined(dd._handles.h2, 'dd: Handles H2 not there');
            dd.set('handles', false);
            Y.Assert.isNull(dd._handles, 'dd: Handles NOT Null');
            var wrap = Y.one('#wrap');
            dd.addHandle(wrap);
            Y.Assert.isObject(dd._handles, 'dd: Handles not an object');
            Y.Assert.isNotUndefined(dd._handles[wrap._yuid], 'dd: Handles ' + wrap._yuid + ' not there (Node Based Handle)');
            dd.set('handles', false);
            Y.Assert.isNull(dd._handles, 'dd: Handles NOT Null');
        },
        test_drag_setup_events: function() {
            Y.each(dd_events, function(v) {
                _count[v] = 0;
                var handle = dd.on(v, _handleCount);
                Y.Assert.isInstanceOf(Y.EventHandle, handle, 'drag:handle [' + v + ']: Handle Instance');
            });
        },
        test_drag_move: function() {
            Y.DD.DDM.useHash = true;
            Y.DD.DDM.syncActiveShims();

            //This test is mainly for code coverage, so that more DD code is touched.
            _fakeMove(dd, moveCount);
        },
        /* This test is iffey on Chrome/IE9 and sometimes on FF. Removing until I find a better solution.
        test_drag_move: function() {
            dd.on('drag:end', function() {
                Y.Assert.areSame(moveCount, _count['drag:drag'], 'drag:drag should fire ' + moveCount + ' times');
                //Y.Assert.areSame(1, _count['drag:drophit'], 'drag:drophit should fire 1 time');
                Y.Assert.areSame(1, _count['drag:end'], 'drag:end should fire 1 time');
                Y.Assert.areSame(1, _count['drag:start'], 'drag:start should fire 1 time');
                //Y.Assert.areSame(1, _count['drag:enter'], 'drag:enter should fire 1 time');
                Y.Assert.areSame(dropCount, _count['drag:over'], 'drag:over should fire ' + dropCount + ' times');

                Y.Assert.areSame(dropCount, _count['drop:over'], 'drop:over should fire ' + dropCount + ' times');
                Y.Assert.areSame(1, _count['drop:enter'], 'drop:enter should fire 1 time');
                Y.Assert.areSame(1, _count['drop:hit'], 'drop:hit should fire 1 time');
            });
            _fakeMove(dd, moveCount);
        },
        */
        test_drag_destroy: function() {
            dd.destroy();
            Y.Assert.isFalse(dd.get('node').hasClass('yui3-dd-draggable'), 'drag: Drag Instance NO ClassName');
            Y.Assert.isTrue(dd.get('destroyed'), 'drag: Destroyed Attribute');
        },
        test_proxy: function() {
            _resetCount();
            Y.one('#drag').setStyles({ top: '', left: '' });
            proxy = new Y.DD.Drag({
                node: '#drag'
            }).plug(Y.Plugin.DDProxy, {
                moveOnEnd: false
            });
            var p = Y.DD.DDM._proxy;
            Y.Assert.isInstanceOf(Y.Node, p, 'Proxy: Node Instance');
            Y.Assert.isInstanceOf(Y.Plugin.DDProxy, proxy.proxy, 'Proxy: Proxy Instance');
            Y.Assert.isTrue(p.hasClass('yui3-dd-proxy'), 'proxy: Proxy Node Instance ClassName');
        },
        test_proxy_setup_events: function() {
            Y.each(dd_events, function(v) {
                var handle = proxy.on(v, _handleCount);
                Y.Assert.isInstanceOf(Y.EventHandle, handle, 'proxy:handle [' + v + ']: Handle Instance');
            });
        },
        test_proxy_move: function() {
            //This test is mainly for code coverage, so that all proxy code is touched.
            _fakeMove(proxy, moveCount);
            _resetCount();
            Y.one('#drag').setStyles({ top: '', left: '' });
            proxy.proxy.set('moveOnEnd', true);
            proxy.proxy.set('cloneNode', true);
            proxy.set('dragMode', 'intersect');
            _fakeMove(proxy, moveCount);
            _resetCount();
            Y.one('#drag').setStyles({ top: '', left: '' });
        },
        /* This test is iffey on Chrome/IE9 and sometimes on FF. Removing until I find a better solution.
        test_proxy_move: function() {
            _fakeMove(proxy, moveCount);
            
            Y.Assert.areSame(moveCount, _count['drag:drag'], 'drag:drag should fire ' + moveCount + ' times');
            Y.Assert.areSame(1, _count['drag:drophit'], 'drag:drophit should fire 1 time');
            Y.Assert.areSame(1, _count['drag:end'], 'drag:end should fire 1 time');
            Y.Assert.areSame(1, _count['drag:start'], 'drag:start should fire 1 time');
            Y.Assert.areSame(1, _count['drag:enter'], 'drag:enter should fire 1 time');
            Y.Assert.areSame(dropCount, _count['drag:over'], 'drag:over should fire ' + dropCount + ' times');

            Y.Assert.areSame(dropCount, _count['drop:over'], 'drop:over should fire ' + dropCount + ' times');
            Y.Assert.areSame(1, _count['drop:enter'], 'drop:enter should fire 1 time');
            Y.Assert.areSame(1, _count['drop:hit'], 'drop:hit should fire 1 time');
        },
        */
        test_proxy_destroy: function() {
            proxy.destroy();
            Y.Assert.isFalse(proxy.get('node').hasClass('yui3-dd-draggable'), 'proxy: Drag Instance NO ClassName');
            Y.Assert.isTrue(proxy.get('destroyed'), 'Proxy: Destroyed Attribute');
        },
        test_drop_destroy: function() {
            drop.destroy();
            Y.Assert.isFalse(drop.get('node').hasClass('yui3-dd-drop'), 'Drop: Drop Instance NO ClassName');
            Y.Assert.isTrue(drop.get('destroyed'), 'Drop: Destroyed Attribute');
        },
        test_constrain_region_setup: function() {
            Y.one('#drag').setStyles({ top: '10px', left: '350px' });
            dd = new Y.DD.Drag({
                node: '#drag'
            }).plug(Y.Plugin.DDConstrained, {
                constrain2region: {
                    top: 0,
                    left: 0,
                    bottom: 400,
                    right: 400
                }
            });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isInstanceOf(Y.Plugin.DDConstrained, dd.con, 'Constrained: DDConstrained Instance');
            Y.Assert.isTrue(dd.get('node').hasClass('yui3-dd-draggable'), 'dd: Drag Instance ClassName');
            dd.destroy();
        },
        test_constrain_node_setup: function() {
            Y.one('#drag').setStyles({ top: '10px', left: '950px' });
            dd = new Y.DD.Drag({
                node: '#drag'
            }).plug(Y.Plugin.DDConstrained, {
                constrain2node: '#wrap'
            });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isInstanceOf(Y.Plugin.DDConstrained, dd.con, 'Constrained: DDConstrained Instance');
            Y.Assert.isTrue(dd.get('node').hasClass('yui3-dd-draggable'), 'dd: Drag Instance ClassName');
        },
        test_constrain_node_move: function() {
            var inRegion_before = dd.get('node').inRegion(Y.one('#wrap'));

            _fakeMove(dd, 25);

            var inRegion_after = dd.get('node').inRegion(Y.one('#wrap'));
            Y.Assert.isFalse(inRegion_before, 'Drag Node is in the region of #wrap');
            Y.Assert.isTrue(inRegion_after, 'Drag Node is NOT in the region of #wrap');
            dd.destroy();
        },
        test_constrain_node_unplug: function() {
            Y.one('#drag').setStyles({ top: '100px', left: '100px' });

            dd = new Y.DD.Drag({
                node: '#drag'
            }).plug(Y.Plugin.DDConstrained, {
                constrain2node: '#wrap'
            });

            var inRegion_before = dd.get('node').inRegion(Y.one('#wrap'));

            Y.Assert.isTrue(inRegion_before, 'Drag Node is NOT in the region of #wrap');

            dd.unplug(Y.Plugin.DDConstrained);

            _fakeMove(dd, 1024);

            var inRegion_after = dd.get('node').inRegion(Y.one('#wrap'));

            Y.Assert.isFalse(inRegion_after, 'Drag Node is IN in the region of #wrap, should be outside');

            dd.destroy();
        },
        test_constrain_view_setup: function() {
            Y.one('#drag').setStyles({ top: '-150px', left: '200px' });
            dd = new Y.DD.Drag({
                node: '#drag'
            }).plug(Y.Plugin.DDConstrained, {
                constrain2view: true
            });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isInstanceOf(Y.Plugin.DDConstrained, dd.con, 'Constrained: DDConstrained Instance');
            Y.Assert.isTrue(dd.get('node').hasClass('yui3-dd-draggable'), 'dd: Drag Instance ClassName');
        },
        test_constrain_inregion: function() {
            var inRegion = dd.con.inRegion();
            Y.Assert.isFalse(inRegion, 'DD object is already in region, should not be');
            //Move to region
            var region = dd.con.getRegion()
            dd.get('dragNode').setXY(region);
            var inRegion = dd.con.inRegion();
            Y.Assert.isTrue(inRegion, 'DD object is not in region');

            //Move back out of region
            Y.one('#drag').setStyles({ top: '-150px', left: '200px' });
        },
        test_tick_calc: function() {
            var tick = Y.DD.DDM._calcTicks(15, 0, 10, 1, 100);
            Y.Assert.areSame(10, tick, 'Failed to calculate tick');

            var tick = Y.DD.DDM._calcTicks(95, 0, 10, 1, 100);
            Y.Assert.areSame(90, tick, 'Failed to calculate tick');

            var tick = Y.DD.DDM._calcTicks(-5, 0, 10, 1, 100);
            Y.Assert.areSame(0, tick, 'Failed to calculate tick');

            var tick = Y.DD.DDM._calcTicks(150, 0, 10, 1, 100);
            Y.Assert.areSame(140, tick, 'Failed to calculate tick');
        },
        test_tick_array: function() {
            var ticks = [1, 25, 75, 100 ];
            var tick = Y.DD.DDM._calcTickArray(15, ticks, 1, 150);
            Y.Assert.areSame(25, tick, 'Failed to calculate tick');
            
            var tick = Y.DD.DDM._calcTickArray(2, ticks, 1, 150);
            Y.Assert.areSame(1, tick, 'Failed to calculate tick');

            var tick = Y.DD.DDM._calcTickArray(2, [], 1, 150);
            Y.Assert.areSame(2, tick, 'Failed to calculate tick');

            var tick = Y.DD.DDM._calcTickArray(2, [5], 1, 150);
            Y.Assert.areSame(5, tick, 'Failed to calculate tick');

            var tick = Y.DD.DDM._calcTickArray(2, [5, 10], 1, 150);
            Y.Assert.areSame(5, tick, 'Failed to calculate tick');

            var tick = Y.DD.DDM._calcTickArray(25, [5, 10], 15, 5);
            Y.Assert.areSame(10, tick, 'Failed to calculate tick');

        },
        test_constrain_view_move: function() {
            var inRegion_before = dd.get('node').inViewportRegion();

            _fakeMove(dd, 250);

            var inRegion_after = dd.get('node').inViewportRegion();
            Y.Assert.isFalse(inRegion_before, 'Drag Node is in the viewport');
            Y.Assert.isTrue(inRegion_after, 'Drag Node is NOT in the viewport');
            dd.destroy();
        },
        'test: node scroll plugin': function() {
            dd = new Y.DD.Drag({
                node: '#drag'
            }).plug(Y.Plugin.DDNodeScroll, {
                node: Y.one('body')
            });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isInstanceOf(Y.Plugin.DDNodeScroll, dd.nodescroll, 'NodeScroll: NodeScroll Instance');

            dd.destroy();
            
        },
        test_window_scroll: function() {
            //Skip this test on mobile devices, they don't like the scrollTop settings to test against.
            if (Y.UA.mobile || Y.UA.android || Y.UA.webos || (Y.one('win').get('winHeight') < 200)) {
                return true;
            }
            Y.one('body').setStyle('height', '3000px');
            Y.one('#drag').setStyles({ top: '', left: '' });
            dd = new Y.DD.Drag({
                node: '#drag'
            }).plug(Y.Plugin.DDWinScroll);
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isInstanceOf(Y.Plugin.DDWinScroll, dd.winscroll, 'WinScroll: WinScroll Instance');


            window.scrollTo(0, 0);
            _fakeStart(dd);
            var self = this,
                win = Y.one(window),
                winHeight = win.get('winHeight'),
                i = (winHeight - dd.get('node').get('offsetHeight') - 30),
                hasScrolled = false,
                wait = function() {
                    if (win.get('scrollTop')) {
                        hasScrolled = true;
                    }
                    if (i < (Y.one(window).get('winHeight') - 30)) {
                        _moveNode(dd, i, true);
                        i++;
                        self.wait.call(self, wait, 0);
                    } else {
                        if (win.get('scrollTop')) {
                            hasScrolled = true;
                        }
                        self.wait.call(self, function() {
                            _fakeEnd(dd);
                            if (win.get('scrollTop')) {
                                hasScrolled = true;
                            }
                            Y.Assert.isTrue(hasScrolled, 'window.scrollTop was never greater than 0');
                            dd.destroy();
                            Y.one('#drag').setStyles({ top: '', left: '' });
                            window.scrollTo(0, 0);
                            Y.one('body').setStyle('height', '');
                        }, 1500);
                    }
                };

            win.on('scroll', function() {
                hasScrolled = true;
            });
            this.wait(wait, 0);
        },
        test_delegate: function() {
            Y.one('#wrap').setStyle('display', 'none');
            Y.one('#del').setStyle('display', 'block');
            del = new Y.DD.Delegate({
                container: '#del',
                nodes: 'li',
                invalid: '.disabled',
                target: true
            });
            Y.Assert.isInstanceOf(Y.DD.Delegate, del, 'del: Delegate Instance');
            Y.Assert.isInstanceOf(Y.DD.Drag, del.dd, 'del.dd: Drag Instance');
        },
        test_delegate_setup_events: function() {
            Y.each(dd_events, function(v) {
                _count[v] = 0;
                var handle = del.on(v, _handleCount);
                Y.Assert.isInstanceOf(Y.EventHandle, handle, 'drag:handle [' + v + ']: Handle Instance');
            });
        },
        test_delegate_move: function() {
            del._onMouseEnter();
            _resetCount();
            del.on('drag:end', function() {
                //Y.Assert.areSame(moveCount, _count['drag:drag'], 'drag:drag should fire ' + moveCount + ' times');
                Y.Assert.areSame(1, _count['drag:end'], 'drag:end should fire 1 time');
                Y.Assert.areSame(1, _count['drag:start'], 'drag:start should fire 1 time');
                del.get('currentNode').setStyles({
                    top: 0, left: 0
                });
            });
            del._delMouseDown({
                currentTarget: Y.one('#del ul li')
            });
            _fakeMove(del.dd, moveCount);
            del._onMouseLeave();
        },
        test_delegate_move2: function() {
            _resetCount();
            del.dd.plug(Y.Plugin.DDProxy);
            del._delMouseDown({
                currentTarget: Y.one('#del ul li:nth-child(4)')
            });
            _fakeMove(del.dd, moveCount);
        },
        test_delegate_disabled: function() {
            del.detachAll();
            _resetCount();
            var mDown = false;
            del.on('drag:mouseDown', function() {
                mDown = true;
            });
            del._delMouseDown({
                currentTarget: Y.one('#del ul li:nth-child(6)')
            });
            Y.Assert.isFalse(mDown, 'Delegate mouseDown fired on a disabled item');
        },
        test_delegate_destroy: function() {
            var del = Y.DD.DDM.getDelegate('#del');
            del.destroy();
            Y.Assert.isTrue(del.dd.get('destroyed'), 'DD was not destroyed');
        },
        test_css_gutter: function() {
            var gutter1 = '2px';
            var obj = Y.DD.DDM.cssSizestoObject(gutter1);
            Y.Assert.areSame(2, obj.top, gutter1 + ' failed to parse top');
            Y.Assert.areSame(2, obj.bottom, gutter1 + ' failed to parse bottom');
            Y.Assert.areSame(2, obj.left, gutter1 + ' failed to parse left');
            Y.Assert.areSame(2, obj.right, gutter1 + ' failed to parse right');

            var gutter1 = '1px 2px';
            var obj = Y.DD.DDM.cssSizestoObject(gutter1);
            Y.Assert.areSame(1, obj.top, gutter1 + ' failed to parse top');
            Y.Assert.areSame(1, obj.bottom, gutter1 + ' failed to parse bottom');
            Y.Assert.areSame(2, obj.left, gutter1 + ' failed to parse left');
            Y.Assert.areSame(2, obj.right, gutter1 + ' failed to parse right');

            var gutter1 = '1px 2px 3px';
            var obj = Y.DD.DDM.cssSizestoObject(gutter1);
            Y.Assert.areSame(1, obj.top, gutter1 + ' failed to parse top');
            Y.Assert.areSame(2, obj.right, gutter1 + ' failed to parse right');
            Y.Assert.areSame(3, obj.bottom, gutter1 + ' failed to parse bottom');
            Y.Assert.areSame(2, obj.left, gutter1 + ' failed to parse left');

            var gutter1 = '1px 2px 3px 4px';
            var obj = Y.DD.DDM.cssSizestoObject(gutter1);
            Y.Assert.areSame(1, obj.top, gutter1 + ' failed to parse top');
            Y.Assert.areSame(2, obj.right, gutter1 + ' failed to parse right');
            Y.Assert.areSame(3, obj.bottom, gutter1 + ' failed to parse bottom');
            Y.Assert.areSame(4, obj.left, gutter1 + ' failed to parse left');


        },
        test_swap_node_position: function() {
            var xy1 = [ 100, 100],
                xy2 = [ 200, 200],
                n1 = Y.Node.create('<div>Foo1</div>'),
                n2 = Y.Node.create('<div>Foo2</div>');

            Y.one('body').append(n1);
            Y.one('body').append(n2);

            n1.setXY(xy1);
            n2.setXY(xy2);

            var xy11 = n1.getXY(),
                xy21 = n2.getXY();

            Y.Assert.areSame(xy1[0], xy11[0], 'Did not set position');
            Y.Assert.areSame(xy2[0], xy21[0], 'Did not set position');
    
            Y.DD.DDM.swapPosition(n1, n2);

            var xy12 = n1.getXY(),
                xy22 = n2.getXY();

            Y.Assert.areSame(xy1[0], xy22[0], 'Did not swap position');
            Y.Assert.areSame(xy2[0], xy12[0], 'Did not swap position');

            n1.remove();
            n2.remove();
        },
        test_swap_node: function() {
            var n1 = Y.Node.create('<div>Foo1</div>'),
                n2 = Y.Node.create('<div>Foo2</div>'),
                wrap = Y.Node.create('<div></div>');

            

            wrap.prepend(n1);
            wrap.append(n2);
            
            Y.Assert.isTrue((n1.get('nextSibling') ? true : false), '1, Node has a sibling');
            Y.Assert.isNull((n2.get('nextSibling')), '2, Node has a sibling');
            Y.DD.DDM.swapNode(n1, n2);

            Y.Assert.isTrue((n2.get('nextSibling') ? true : false), '3, Node has a sibling');
            Y.Assert.isNull((n1.get('nextSibling')), '4, Node has a sibling');
            
        },
        'test: proxy plugin on widget': function() {
            var test = this,
                Assert = Y.Assert,
                ArrayAssert = Y.ArrayAssert;

            YUI().use('panel', 'dd-plugin', 'dd-proxy', function(Y) {
                var panel = new Y.Panel({
                    headerContent: 'Some title',
                    width: 250,
                    bodyContent: "<h1>Some content goes here <br> Content</h1>",
                    render: true
                });
                
                panel.plug(Y.Plugin.Drag);

                Assert.isInstanceOf(Y.Plugin.Drag, panel.dd);

                panel.dd.plug(Y.Plugin.DDProxy);
                
                Assert.isInstanceOf(Y.Plugin.DDProxy, panel.dd.proxy);

                Assert.areSame(2, panel.dd._widgetHandles.length, 'Should have 2 event listeners');

                panel.dd._checkEvents();

                Assert.areSame(0, panel.dd._widgetHandles.length, 'Should have no event listeners');

                panel.dd.unplug(Y.Plugin.DDProxy);
                panel.dd._checkEvents();

                Assert.areSame(2, panel.dd._widgetHandles.length, 'Should have 2 event listeners');

                panel.dd._updateStopPosition({  
                    target: {
                        realXY: [100, 100]
                    }
                });
                ArrayAssert.itemsAreEqual([100, 100], panel.dd._stoppedPosition, 'Failed to set stoppedPosition');

                panel.dd._setWidgetCoords({
                    target: {
                        realXY: [300, 300],
                        nodeXY: [0, 0]
                    }
                });

                panel.dd._stoppedPosition = null;
                panel.dd._setWidgetCoords({
                    target: {
                        realXY: [300, 300],
                        nodeXY: [50, 300]
                    }
                });

                panel.dd._stoppedPosition = null;
                panel.dd._setWidgetCoords({
                    target: {
                        realXY: [400, 400],
                        nodeXY: [400, 50]
                    }
                });

                panel.destroy();

            });

        },
        'test: proxy cloneNode with radio inputs': function() {
            var radioInput = Y.one('#radio input');

            _resetCount();

            var dd = new Y.DD.Drag({
                node: '#radio'
            }).plug(Y.Plugin.DDProxy, {
                cloneNode: true
            });

            this.wait(function() {
                _fakeMove(dd, 1000);

                Y.Assert.isTrue(radioInput.get('checked'));
            }, 100);
        }
    };
    
    var suite = new Y.Test.Suite('DragDrop');
    
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);
});

