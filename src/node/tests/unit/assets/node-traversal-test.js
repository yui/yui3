YUI.add('node-traversal-test', function(Y) {
    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.Node.ancestor',

        'should return the parent node': function() {
            Assert.areEqual(document.documentElement,
                    Y.one(document.body).ancestor()._node);
        },

        'should return the same node': function() {
            Assert.areEqual(document.body,
                    Y.one(document.body).ancestor('body', true)._node);
        },

        'should return the matching ancestor': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node._node.tagName === 'BODY';
                };

            Assert.areEqual(document.body, Y.one(node).ancestor(fn)._node);
        },

        'should return the matching ancestor via selector': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0];

            Assert.areEqual(document.body, Y.one(node).ancestor('body')._node);
        },

        'should return the matching ancestor (test self match)': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.get('tagName') === 'EM';
                };

            Assert.areEqual(node, Y.one(node).ancestor(fn, true)._node);
        },

        'should return the matching ancestor (test self match) via selector': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0];

            Assert.areEqual(node, Y.one(node).ancestor('em', true)._node);
        },

        'should return the matching ancestor (test self not matched)': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.get('tagName') === 'BODY';
                };

            Assert.areEqual(document.body, Y.one(node).ancestor(fn, true)._node);
        },

        'should return the matching ancestor (test self not matched) via selector': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0];

            Assert.areEqual(document.body, Y.one(node).ancestor('body', true)._node);
        },

        'should stop when the stop function returns true': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.tagName === 'BODY';
                },

                stopFn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
            };

            Assert.isNull(Y.one(node).ancestor(fn, null, stopFn));
        },

        'should stop when the stop function returns true via selector': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0];

            Assert.isNull(Y.one(node).ancestor('body', null, '#test-ancestor-stop'));
        },

        'should stop when the stop function returns true via selector as 2nd arg': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0];

            Assert.isNull(Y.one(node).ancestor('body', '#test-ancestor-stop'));
        },

        'should find ancestor before stop': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
                },

                stopFn = function(node) {
                    node = node._node;
                    return node.tagName === 'BODY';
            };

            Assert.areEqual('test-ancestor-stop',
                    Y.one(node).ancestor(fn, null, stopFn)._node.id);
        },

        'should find ancestor before stop fn as 2nd arg': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
                },

                stopFn = function(node) {
                    node = node._node;
                    return node.tagName === 'BODY';
            };

            Assert.areEqual('test-ancestor-stop',
                    Y.one(node).ancestor(fn, stopFn)._node.id);
        },

        'should find ancestor before stop via selector': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
                };

            Assert.areEqual('test-ancestor-stop',
                    Y.one(node).ancestor(fn, null, 'body')._node.id);
        },

        'should find ancestor before stop via selector as 2nd arg': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
                };

            Assert.areEqual('test-ancestor-stop',
                    Y.one(node).ancestor(fn, 'body')._node.id);
        },

        'should find ancestor via selector before stop via selector': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0];

            Assert.areEqual('test-ancestor-stop',
                    Y.one(node).ancestor('#test-ancestor-stop', null, 'body')._node.id);
        },

        'should find ancestor when both test and stop return true': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
                },

                stopFn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
            };

            Assert.areEqual('test-ancestor-stop',
                    Y.one(node).ancestor(fn, null, stopFn)._node.id);
        },

        'should find ancestor when testFn and stop via selector both pass': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
                };

            Assert.areEqual('test-ancestor-stop',
                    Y.one(node).ancestor(fn, null, '#test-ancestor-stop')._node.id);
        },

        'should find ancestor when test and stop via selector both pass': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0];

            Assert.areEqual('test-ancestor-stop',
                    Y.one(node).ancestor('#test-ancestor-stop', null, '#test-ancestor-stop')._node.id);
        },
        'should find TD ancestor': function() {   
            var node = Y.one('#test-table div div').ancestor('td');

            Y.Assert.areEqual(document.getElementById('test-td'), node._node);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.Node.ancestors',

        'should return an array of one (documentElement)': function() {
            ArrayAssert.itemsAreEqual([document.documentElement],
                    Y.one(document.body).ancestors()._nodes);
        },

        'should include the starting node': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);
            ArrayAssert.itemsAreEqual([document.documentElement, document.body, node],
                    Y.one(node).ancestors(null, true)._nodes);

            document.body.removeChild(node);
        },

        'should omit the starting node': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);
            ArrayAssert.itemsAreEqual([document.documentElement, document.body],
                    Y.one(node).ancestors()._nodes);

            document.body.removeChild(node);
        },

        'should return the matching ancestors': function() {
            var node = document.createElement('div'),
                fn = function(node) {
                    node = node._node;
                    return node.tagName !== 'HTML';
                };

            document.body.appendChild(node);
            ArrayAssert.itemsAreEqual([document.body], Y.one(node).ancestors(fn)._nodes);
            document.body.removeChild(node);
        },

        'should return the matching ancestors via selector': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            ArrayAssert.itemsAreEqual([document.body], Y.one(node).ancestors(':not(html)')._nodes);
            document.body.removeChild(node);
        },

        'should return the matching ancestors (test self match)': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.tagName === 'EM';
                };

            ArrayAssert.itemsAreEqual([node], Y.one(node).ancestors(fn, true)._nodes);
        },

        'should return the matching ancestors (test self not matched)': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.tagName === 'BODY';
                };

            ArrayAssert.itemsAreEqual([document.body], Y.one(node).ancestors(fn, true)._nodes);
        },

        'should stop when the stop function returns true': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.tagName === 'BODY';
                },

                stopFn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
            };

            ArrayAssert.itemsAreEqual([], Y.one(node).ancestors(fn, null, stopFn)._nodes);
        },

        'should find ancestor before stop': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.tagName === 'DIV';
                },

                stopFn = function(node) {
                    node = node._node;
                    return node.tagName === 'BODY';
            };

            ArrayAssert.itemsAreEqual([
                    node.parentNode.parentNode.parentNode,
                    node.parentNode.parentNode,
                    node.parentNode
                ],
                Y.one(node).ancestors(fn, null, stopFn)._nodes);
        },

        'should find ancestor when both test and stop return true': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.tagName === 'DIV';
                },

                stopFn = function(node) {
                    node = node._node;
                    return node.tagName === 'DIV';
            };

            Assert.areEqual(1,
                    Y.one(node).ancestors(fn, null, stopFn).size());
        },

        'should stop when the stop function returns true as 2nd arg': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    node = node._node;
                    return node.tagName === 'BODY';
                },

                stopFn = function(node) {
                    node = node._node;
                    return node.id === 'test-ancestor-stop';
            };

            Assert.areEqual(0, Y.one(node).ancestors(fn, stopFn).size());
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.Node.siblings',
        setUp: function() {
            this._testNodes = Y.one('#test-nodes > ol').get('children');
        },

        tearDown: function() {
            delete this._testNodes;
        },

        'should return all siblings': function() {
            var children = this._testNodes;

            ArrayAssert.itemsAreEqual(
                [children.item(0)._node, children.item(1)._node, children.item(3)._node],
                children.item(2).siblings()._nodes);
        },

        'should return all LI siblings': function() {
            var children = this._testNodes;
            ArrayAssert.itemsAreEqual(
                [children.item(0)._node, children.item(1)._node, children.item(3)._node],
                children.item(2).siblings('li')._nodes);
        },

        'should return all LI.bar siblings': function() {
            var children = this._testNodes;
            ArrayAssert.itemsAreEqual(
                [children.item(0)._node, children.item(3)._node],
                children.item(2).siblings('li.bar')._nodes);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.Node.previous',
        setUp: function() {
            this._testNode = Y.one('#test-prop');
        },

        'should return the correct previous element': function() {
            Assert.areEqual('test-class', Y.one('#test-prop').previous().get('id'));
        }
    }));
}, '@VERSION@' ,{requires:['node-base']});
