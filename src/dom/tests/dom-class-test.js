YUI.add('dom-class-test', function(Y) {
    var Assert = Y.Assert;
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.hasClass',

        'should return true with className match': function() {
            var node = document.createElement('div');
                val = 'foo';

            node.className = val;
            Assert.isTrue(Y.DOM.hasClass(node, val));
        },

        'should return false with no className': function() {
            var node = document.createElement('div'),
                val = 'foo';

            Assert.isFalse(Y.DOM.hasClass(node, val));
        },

        'should return false with no className match': function() {
            var node = document.createElement('div');
                val = 'foo';

            node.className = val;
            Assert.isFalse(Y.DOM.hasClass(node, 'bar'));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.addClass',

        'should add the class to the node': function() {
            var node = document.createElement('div'),
                val = 'foo';

            Y.DOM.addClass(node, val);
            Assert.areEqual(val, node.className);
        },

        'should add the class to the node and preserve existing': function() {
            var node = document.createElement('div');
            node.className = 'foo';

            Y.DOM.addClass(node, 'bar');
            Assert.areEqual('foo bar', node.className);
        },

        'should not add if existing': function() {
            var node = document.createElement('div');
            node.className = 'foo';

            Y.DOM.addClass(node, 'foo');
            Assert.areEqual('foo', node.className);
        },

        'should ltrim the class and add to the node': function() {
            var node = document.createElement('div'),
                val = ' foo';

            Y.DOM.addClass(node, val);
            Assert.areEqual('foo', node.className);
        },

        'should rtrim the class and add to the node': function() {
            var node = document.createElement('div'),
                val = 'foo ';

            Y.DOM.addClass(node, val);
            Assert.areEqual('foo', node.className);
        },

        'should trim the class and add to the node': function() {
            var node = document.createElement('div'),
                val = ' foo ';

            Y.DOM.addClass(node, val);
            Assert.areEqual('foo', node.className);
        },

        'should handle bad input': function() {
            Y.DOM.addClass(document.body, null);
            Y.DOM.addClass(document.body, '');
            Y.DOM.addClass(document.body);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.removeClass',

        'should remove the class from the node': function() {
            var node = document.createElement('div'),
                val = 'foo';

            node.className = val;
            Y.DOM.removeClass(node, val);

            Assert.areEqual('', node.className);
        },

        'should leave the className as is': function() {
            var node = document.createElement('div'),
                val = 'foo';

            node.className = val;
            Y.DOM.removeClass(node);
            Y.DOM.removeClass(node, '');
            Assert.areEqual(val, node.className);
        },

        'should remove the class from the node and preserve existing': function() {
            var node = document.createElement('div'),
                val = 'foo bar';

            node.className = val;
            Y.DOM.removeClass(node, 'foo');

            Assert.areEqual('bar', node.className);
        }

    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.replaceClass',

        'should replace the class with the given string': function() {
            var node = document.createElement('div'),
                val = 'foo';

            node.className = val;
            Y.DOM.replaceClass(node, val, 'bar');

            Assert.areEqual('bar', node.className);
        },

        'should replace the class with and preserve existing': function() {
            var node = document.createElement('div'),
                val = 'foo';

            node.className = 'foo baz';
            Y.DOM.replaceClass(node, val, 'bar');

            // TODO: should this be strict?
            Assert.areEqual('baz bar', node.className);
        },

        'should leave the className as is': function() {
            var node = document.createElement('div'),
                val = 'foo';

            node.className = val;
            Y.DOM.replaceClass(node);
            Y.DOM.replaceClass(node, '');
            Assert.areEqual(val, node.className);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.toggleClass',

        'should remove the given class': function() {
            var node = document.createElement('div'),
                val = 'foo';

            node.className = val;
            Y.DOM.toggleClass(node, val);
            Assert.areEqual('', node.className);
        },

        'should remove the given class and preserve existing': function() {
            var node = document.createElement('div'),
                val = 'foo bar';
            
            node.className = val;
            Y.DOM.toggleClass(node, 'foo');
            Assert.areEqual('bar', node.className);
        },

        'should add the given class': function() {
            var node = document.createElement('div'),
                val = 'foo';

            Y.DOM.toggleClass(node, val);
            Assert.areEqual(val, node.className);
        },

        'should add the given class and preserve existing': function() {
            var node = document.createElement('div'),
                val = 'bar';
            
            node.className = val;
            Y.DOM.toggleClass(node, 'foo');
            Assert.areEqual('bar foo', node.className);
        }
    }));
}, '@VERSION@' ,{requires:['dom-base', 'test']});
