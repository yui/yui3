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
moveCount = 728,
dropCount = 30;



YUI({
    base: '../../../build/',
    //filter: 'DEBUG',
    filter: 'RAW',
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true,
        useConsole: true
    }
}).use('event-synthetic', 'event-gestures', 'dd', 'console', 'test', 'substitute', 'selector-css3', function(Y) {
            
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

        var myConsole = new Y.Console({
            height: Y.one(window).get('winHeight') + 'px',
            width: '375px'
        }).render();    
            
        var _count = {},
        _resetCount = function() {
            Y.each(_count, function(v, k) {
                _count[k] = 0;
            });
        },
        _fakeStart = function(node) {
            _resetCount();
            Y.DD.DDM._noShim = true;
            node._dragThreshMet = true;
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
        setUp : function() {
        },
        
        tearDown : function() {
        },
        test_shim: function() {
            var s = Y.DD.DDM._pg;
            Y.Assert.isNull(s, 'Shim: Node Instance');
        },
        test_drop_setup: function() {
            drop = new Y.DD.Drop({ node: '#drop', data: { one: 1, two: 2, three: 3 } });
            Y.Assert.isInstanceOf(Y.DD.Drop, drop, 'drop: Drop Instance');
            Y.Assert.isTrue(drop.get('node').hasClass('yui3-dd-drop'), 'drop: Drop Instance ClassName');
        },
        test_drop_setup_events: function() {
            Y.each(dd_events, function(v) {
                var handle = drop.on(v, _handleCount);
                Y.Assert.isInstanceOf(Y.EventHandle, handle, 'drop:handle [' + v + ']: Handle Instance');
            });
        },
        test_drag_setup: function() {
            dd = new Y.DD.Drag({ node: '#drag' });
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
        test_constrain_view_move: function() {
            var inRegion_before = dd.get('node').inViewportRegion();

            _fakeMove(dd, 250);

            var inRegion_after = dd.get('node').inViewportRegion();
            Y.Assert.isFalse(inRegion_before, 'Drag Node is in the viewport');
            Y.Assert.isTrue(inRegion_after, 'Drag Node is NOT in the viewport');
            dd.destroy();
        },
        test_window_scroll: function() {
            Y.one('body').setStyle('height', '3000px');
            Y.one('#drag').setStyles({ top: '', left: '' });
            dd = new Y.DD.Drag({
                node: '#drag'
            }).plug(Y.Plugin.DDWinScroll);
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isInstanceOf(Y.Plugin.DDWinScroll, dd.winscroll, 'WinScroll: WinScroll Instance');

            Y.one(window).set('scrollTop', 0);
            Y.one(window).set('scrollLeft', 0);
            _fakeStart(dd);
            var self = this,
            winHeight = Y.one(window).get('winHeight'),
            i = (winHeight - dd.get('node').get('offsetHeight') - 100),
            wait = function() {
                if (i < (Y.one(window).get('winHeight') - 30)) {
                    _moveNode(dd, i, true);
                    i++;
                    self.wait.call(self, wait, 0);
                } else {
                    self.wait.call(self, function() {
                        _fakeEnd(dd);
                        Y.Assert.isTrue((Y.one(window).get('scrollTop') > 0), 'window.scrollTop is not greater than 0');
                        dd.destroy();
                        Y.one('#drag').setStyles({ top: '', left: '' });
                        Y.one(window).set('scrollTop', 0);
                        Y.one(window).set('scrollLeft', 0);
                        Y.one('body').setStyle('height', '');
                    }, 1500);
                }
            };
            this.wait(wait, 0);
        },
        test_delegate: function() {
            Y.one('#wrap').setStyle('display', 'none');
            Y.one('#del').setStyle('display', 'block');
            del = new Y.DD.Delegate({
                cont: '#del',
                nodes: 'li',
                invalid: '.disabled'
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
            _resetCount();
            del.on('drag:end', function() {
                Y.Assert.areSame(moveCount, _count['drag:drag'], 'drag:drag should fire ' + moveCount + ' times');
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
        },
        test_delegate_move2: function() {
            _resetCount();
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
        }
    };
    
    var suite = new Y.Test.Suite("DD");
    
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);
    Y.Test.Runner.run();
});

