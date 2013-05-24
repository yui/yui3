YUI.add('nodelist-test', function(Y) {
    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.all',
        // TODO: move to nodelist-event
        'should fire the handler once': function() {
            var i = 0,
                test = this,
                nodelist = Y.all('body');

            nodelist.once('click', function() {
                i++;
                Assert.areEqual(1, i);
            });

            nodelist.item(0).simulate('click');
            nodelist.item(0).simulate('click');

            i = 0;
            nodelist.onceAfter('click', function () {
                i++;
                Assert.areEqual(1, i);
            });

            nodelist.item(0).simulate('click');
            nodelist.item(0).simulate('click');
        },

        'should return a NodeList of size zero from empty string': function() {
            Assert.areEqual(0, Y.all('').size());
            Assert.areEqual(0, Y.all('')._nodes.length);
        },

        'should return a NodeList of size zero from non-existant id': function() {
            Assert.areEqual(0, Y.all('#fake-id').size());
            Assert.areEqual(0, Y.all('#fake-id')._nodes.length);
        },

        'should return a NodeList of size zero from non-existant id descendant': function() {
            Assert.areEqual(0, Y.all('#fake-id *').size());
            Assert.areEqual(0, Y.all('#fake-id *')._nodes.length);
        },

        'should return a NodeList of size 1 from id query': function() {
            Assert.areEqual(1, Y.all('#test-nodes')._nodes.length);
        },

        'should return the same size as the DOM length': function() {
            var nodes = document.getElementById('test-nodes').getElementsByTagName('*');
            Assert.areEqual(nodes.length, Y.all('#test-nodes *').size());
            Assert.isTrue(Y.all('#test-nodes *').size() > 0);
        },

        'should return the first child element from query': function() {
            Assert.areEqual(document.getElementById('test-nodes').getElementsByTagName('li')[0],
                Y.Node.getDOMNode(Y.one('#test-nodes li:first-child')), 'Y.one("#test-nodes")');
        },

        'should return the second child element from query': function() {
            Assert.areEqual(document.getElementById('test-nodes').getElementsByTagName('li')[1],
                Y.Node.getDOMNode(Y.one('#test-nodes li:nth-child(2)')));
        },

        'should correctly handle special chars in id attribute query': function() {
            Assert.areEqual(document.getElementById('form.foo@bar:baz'),
                    Y.Node.getDOMNode(Y.one('[id="form.foo@bar:baz"]')));
        },

        'inserted node should become new first-child': function() {
            var firstChild = Y.one('body :first-child'),
                node = Y.Node.create('<div>foo</div>');
            Y.one('body').insertBefore(node, firstChild);
            Assert.isFalse(firstChild._node === Y.one('body :first-child')._node);
            Assert.areEqual(node, Y.one('body').removeChild(Y.one('body :first-child')));
        },

        'should match return value from Y.Selector.query for body :first-child' : function() {
            var element = Y.Selector.query('body :first-child', null, true);
            Assert.isNotNull(element);
            Assert.areEqual(element, Y.one('body :first-child')._node);
        },

        'should return the OPTIONs from the SELECT input': function() {
            var options = document.getElementById('test-select').getElementsByTagName('option');
            ArrayAssert.itemsAreEqual(options, Y.all('#test-select option')._nodes);
        },

        'should return 3 OPTIONs from the SELECT input': function() {
            Assert.areEqual(3, Y.all('#test-select option').size());
        },

        'should find all FORMs via form query': function() {
            Assert.areEqual(document.getElementsByTagName('form').length, Y.all('form').size());
        },

        'should find all elements with bar className': function() {
            Assert.areEqual(3, Y.all('.bar').size());
        },

        'should wrap all DIV elements with NodeList': function() {
            var nodes = document.getElementsByTagName('div');
            ArrayAssert.itemsAreEqual(nodes, Y.all(Y.Selector.query('div'))._nodes);
        },

        'should match the attribute query from Y.Selector': function() {
            ArrayAssert.itemsAreEqual(Y.Selector.query('input[name]'), Y.all(Y.Selector.query('input[name]'))._nodes);

        },
        'should match the className query from Y.Selector': function() {
            ArrayAssert.itemsAreEqual(Y.Selector.query('.foo'), Y.all(Y.Selector.query('.foo'))._nodes);
        },

        'should return a NodeList of the body element from a DOM ref': function() {
            ArrayAssert.itemsAreEqual([document.body], Y.all(document.body)._nodes);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'NodeList array methods',
        'should pass correct arguments to each node': function() {
            var count = 0,
                nodes = Y.all('#test-nodes *'),
                index;

            nodes.each(function(node, i, list) {
                count++;
                index = i;
                Assert.areEqual(nodes, list, 'nodes === instance');
                Assert.isTrue(node instanceof Y.Node, 'node instanceof Y.Node');
                Assert.areEqual(node, this, 'this === node');
            });

            Assert.areEqual(count, nodes.size(), 'node.each(count) === nodes.size()');
            Assert.areEqual(nodes.size() - 1, index, 'nodes.size() - 1 === index');
        },

        'should return true when some function returns true': function() {
            var nodes = Y.all('#test-nodes *');

            Assert.isTrue(nodes.some(function(node, i, list) {
                return true;
            }), 'nodes.some(function() { return true; })');

        },

        'should return false when no function returns true': function() {
            var nodes = Y.all('#test-nodes *');

            Assert.isFalse(nodes.some(function(node, i, list) {
            }), 'nodes.some(function() {})');
        },

        'should return 0 from indexOf BODY': function() {
            Assert.areEqual(0, Y.all('body').indexOf(Y.one('body')));
        },

        'should return 0 from indexOf the first DIV': function() {
            Assert.areEqual(0, Y.all('div').indexOf(
                    Y.one(document.getElementsByTagName('div')[0])));
        },

        'should return -1 from indexOf for non-existant node': function() {
            Assert.areEqual(-1, Y.all('div').indexOf(Y.one('#test-')));
        },

        'should return -1 from indexOf for node not in nodelist': function() {
            Assert.areEqual(-1, Y.all('div').indexOf(Y.one('#test-form')));
        },

        'should pop the nodelist': function() {
            var nodes = Y.all('div'),
                node = nodes.pop();
            
            Assert.areEqual(Y.all('div').item(Y.all('div').size() - 1), node);
            Assert.areEqual(Y.all('div').size() - 1, nodes.size());
        },

        'should shift the nodelist': function() {
            var nodes = Y.all('div'),
                node = nodes.shift();
            
            Assert.areEqual(Y.one('div'), node);
            Assert.areEqual(Y.all('div').size() - 1, nodes.size());
        },

        'should push the node on nodelist': function() {
            var nodes = Y.all('div'),
                node = Y.one(document.createElement('div'));
            
            Assert.areEqual(nodes.size() + 1, nodes.push(node));
            Assert.areEqual(nodes.item(nodes.size() - 1), node);
            Assert.areEqual(node._node, nodes._nodes[nodes.size() - 1]);
        },

        'should unshift the node on nodelist': function() {
            var nodes = Y.all('div'),
                size = nodes.size(),
                node = Y.one(document.createElement('div'));
            
            nodes.unshift(node);
            Assert.areEqual(size + 1, nodes.size());
            Assert.areEqual(nodes.item(0), node);
            Assert.areEqual(node._node, nodes._nodes[0]);
        },

        'should unshift the dom node on nodelist': function() {
            var nodes = Y.all('div'),
                size = nodes.size(),
                node = document.createElement('div');
            
            nodes.unshift(node);
            Assert.areEqual(size + 1, nodes.size());
            Assert.areEqual(nodes.item(0), Y.one(node));
            Assert.areEqual(node, nodes._nodes[0]);
        },

        'should concat the nodelists': function() {
            var nodelist1 = Y.all('div'),
                nodelist2 = Y.all('li'),
                nodelist3 = nodelist1.concat(nodelist2);
            
            ArrayAssert.itemsAreEqual(nodelist1._nodes.concat(nodelist2._nodes), nodelist3._nodes);
        },

        'should concat the nodes': function() {
            var nodelist1 = Y.all('div');
                nodelist2 = nodelist1.concat(Y.one('ul'), Y.one('li'));
            
            ArrayAssert.itemsAreEqual(nodelist1._nodes.concat(Y.one('ul')._node, Y.one('li')._node), nodelist2._nodes);
        },

        'should return nodelist from empty concat': function() {
            var nodelist = Y.Node.create('<div></div>').get('childNodes');
            ArrayAssert.itemsAreEqual([], nodelist.concat()._nodes);
        },

        'should return nodelist from empty slice': function() {
            var nodelist = Y.Node.create('<div></div>').get('childNodes');
            ArrayAssert.itemsAreEqual([], nodelist.slice()._nodes);
        },

        'should return nodelist from empty splice': function() {
            var nodelist = Y.Node.create('<div></div>').get('childNodes');
            ArrayAssert.itemsAreEqual([], nodelist.splice()._nodes);
        },

        'should slice the nodes': function() {
            var nodelist1 = Y.all('div');
                nodelist2 = nodelist1.slice(1, 4);
                nodelist3 = nodelist1.slice(0, 3);
            
            ArrayAssert.itemsAreEqual(nodelist1._nodes.slice(1, 4), nodelist2._nodes);
            ArrayAssert.itemsAreEqual(nodelist1._nodes.slice(0, 3), nodelist3._nodes);
        },

        'should splice the nodes': function() {
            var nodelist1 = Y.all('div'),
                nodes = Y.all('div')._nodes,
                spliced1 = nodes.splice(1, 2),
                spliced2 = nodelist1.splice(1, 2)._nodes;

            ArrayAssert.itemsAreEqual(nodes, nodelist1._nodes);
            ArrayAssert.itemsAreEqual(spliced1, spliced2);
        },

        'should refresh the nodelist': function() {
            var node = Y.one('#test-nodes'),
                nodelist = node.all('li'),
                size = nodelist.size();

            nodelist.item(1).remove();
            ArrayAssert.itemsAreEqual(size, nodelist.size(), 'remove item shouldnt affect size');
            
            nodelist.refresh();
            ArrayAssert.itemsAreEqual(node.all('li').size(), nodelist.size(), 'refresh should affect size');
            ArrayAssert.itemsAreEqual(node.all('li')._nodes, nodelist._nodes, 'refreshed nodelist should be in sync');
        }
    }));
}, '@VERSION@' ,{requires:['node-base']});
