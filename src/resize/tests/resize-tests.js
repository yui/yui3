YUI.add('resize-tests', function(Y) {

    var Assert = Y.Assert,
        resize,
        _fakeStart = function(node) {
            var noop = function() {};

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
            node.actXY = [];
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
        };
    

    var template = {
        name: 'Resize Test',

        setUp : function() {
        },

        tearDown : function() {
        },

        'test: loading': function() {
            Assert.isFunction(Y.Resize);
        },
        'test: instantiation': function() {
            var parent = Y.one('#resize').get('parentNode');
            Assert.areSame(Y.one('body'), parent, 'Body is not parent');
            resize = new Y.Resize({
                node: '#resize',
                preserveRatio: true,
                wrap: true,
                minHeight: 20,
                maxHeight: 170,
                maxWidth: 400,
                handles: 't, tr, r, br, b, bl, l, tl'
            });
            resize.plug(Y.Plugin.ResizeProxy);
            Assert.isInstanceOf(Y.Base, resize);
            Assert.isInstanceOf(Y.Resize, resize);

            var parent = Y.one('#resize').get('parentNode');
            Assert.areSame(Y.one('.yui3-resize-wrapper'), parent, 'Not wrapped');

        },
        'test: handles': function() {
            var len = Y.one('.yui3-resize-handles-wrapper').all('.yui3-resize-handle').size();
            Assert.areEqual(8, len);
        },
        'test: moving top': function() {
            var node = resize.delegate.dd;
            node.set('node', Y.one('.yui3-resize-handles-wrapper .yui3-resize-handle-t'));
            _fakeMove(node, 10);

        },
        'test: moving right': function() {
            var node = resize.delegate.dd;
            node.set('node', Y.one('.yui3-resize-handles-wrapper .yui3-resize-handle-r'));
            _fakeMove(node, 10);

        },
        'test: moving bottom': function() {
            var node = resize.delegate.dd;
            node.set('node', Y.one('.yui3-resize-handles-wrapper .yui3-resize-handle-b'));
            _fakeMove(node, 10);

        },
        'test: moving left': function() {
            var node = resize.delegate.dd;
            node.set('node', Y.one('.yui3-resize-handles-wrapper .yui3-resize-handle-l'));
            _fakeMove(node, 10);

        },
        'test: moving tr': function() {
            var node = resize.delegate.dd;
            node.set('node', Y.one('.yui3-resize-handles-wrapper .yui3-resize-handle-tr'));
            _fakeMove(node, 10);

        },
        'test: moving tl': function() {
            var node = resize.delegate.dd;
            node.set('node', Y.one('.yui3-resize-handles-wrapper .yui3-resize-handle-tl'));
            _fakeMove(node, 10);

        },
        'test: moving br': function() {
            var node = resize.delegate.dd;
            node.set('node', Y.one('.yui3-resize-handles-wrapper .yui3-resize-handle-br'));
            _fakeMove(node, 10);

        },
        'test: moving bl': function() {
            var node = resize.delegate.dd;
            node.set('node', Y.one('.yui3-resize-handles-wrapper .yui3-resize-handle-bl'));
            _fakeMove(node, 10);

        },
        'test: destroy': function() {
            resize.destroy();
            //Assert.isTrue(resize.get('destroyed'));
        }
    };


    var suite = new Y.Test.Suite("Resize");
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);

});

