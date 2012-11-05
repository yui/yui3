YUI.add('node-attrs-test', function(Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.Node get() method',

        setUp: function() {
            this._testNode = Y.one('#test-nodes');
        },

        tearDown: function() {
            delete this._testNode;
        },

        'should return null from empty string input': function() {
            Assert.areEqual(null, this._testNode.get(''));
        },
        'should return null from unfound property': function() {
            Assert.areEqual(null, this._testNode.get('fake'));
        },

        'should return null nodeValue': function() {
            Assert.areEqual(null, this._testNode.get('nodeValue'));
        },

        'should return DIV from nodeName': function() {
            Assert.areEqual('DIV', this._testNode.get('nodeName'));
        },

        'should return UL from nodeName': function() {
            Assert.areEqual('UL', Y.one('#test-nodes ul').get('nodeName'));
        },

        'should return LI from nodeName': function() {
            Assert.areEqual('LI', Y.one('#test-nodes ul li').get('nodeName'));
        },

        'should return the firstChild': function() {
            var element = document.getElementById('test-nodes');
            Assert.areEqual(element.firstChild, this._testNode.get('firstChild')._node);
        },

        'should return the nextSibling of the firstChild': function() {
            var element = document.getElementById('test-nodes'),
                node = this._testNode;
            Assert.areEqual(element.firstChild.nextSibling,
                    node.get('firstChild').get('nextSibling')._node);
        },

        'should return the nodeName of the nextSibling of the firstChild': function() {
            var element = document.getElementById('test-nodes'),
                node = this._testNode;
            Assert.areEqual(element.firstChild.nextSibling.nodeName,
                node.get('firstChild.nextSibling.nodeName'));

        },
        'should return the nodeName of the of the lastChild': function() {
            var element = document.getElementById('test-nodes'),
                node = this._testNode;

            Assert.areEqual(element.lastChild.nodeName, node.get('lastChild').get('nodeName'));
        },

        'should get the document node from the ownerDocument': function() {
            Assert.areEqual(9, this._testNode.get('ownerDocument').get('nodeType'));
        },

        'should return the OPTIONs from the SElECT': function() {
            ArrayAssert.itemsAreEqual(document.getElementById('test-select').
                    getElementsByTagName('option'), Y.one('#test-select').get('options')._nodes);
        },

        'should return the text of the new element': function() {
            Assert.areEqual('foo', Y.Node.create('<div>foo</div>').get('text'));
        },

        'should return the updated text': function() {
            var node = Y.Node.create('<div>foo</div>');
            node.set('text', 'bar');
            Assert.areEqual('bar', node.get('text'));
        },

        'should return the correct number of children': function() {
            Assert.areEqual(2, this._testNode.get('children')._nodes.length);
        },
            
        'should return zero children from empty node': function() {
            Assert.areEqual(0, Y.one('#test-empty-children').get('children')._nodes.length);
        },

        'should return matching childNode length': function() {
            Assert.areEqual(this._testNode._node.childNodes.length,
                    this._testNode.get('childNodes').get('length').length);
        },

        'should return the correct tabIndex': function() {
            Assert.areEqual(document.getElementById('test-prop').tabIndex,
                    Y.one('#test-prop').get('tabIndex'));
        },

        'should return the correct tabIndex when not set (DIV)': function() {
            Assert.areEqual(document.getElementById('doc').tabIndex,
                    Y.one('#doc').get('tabIndex'));
        },

        'should return the correct tabIndex when not set (A)': function() {
            Assert.areEqual(document.getElementById('link-1').tabIndex,
                Y.one('#link-1').get('tabIndex'));

            Assert.areEqual(0, Y.one('#link-1').get('tabIndex'));
        },

        'should return the correct tabIndex when set to -1 (A)': function() {
            Assert.areEqual(document.getElementById('link-2').tabIndex,
                Y.one('#link-2').get('tabIndex'));

            Assert.areEqual(-1, Y.one('#link-2').get('tabIndex'));
        },

        'should convert live list to static array': function() {
            Assert.isUndefined(Y.one('form').get('childNodes')._nodes.item);
            Assert.isTrue('slice' in Y.one('form').get('childNodes')._nodes);
        },

        test_getters: function() {
            var id = 'test-nodes',
                element = document.getElementById(id),
                node = Y.one('#' + id),
                nodes = Y.all('#' + id + ' *');
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.NodeList get() method',

        setUp: function() {
            this._testNodes = Y.all('#test-nodes *');
        },

        tearDown: function() {
            delete this._testNodes;
        },

        'should return an array of tagNames from the nodelist': function() {
            var node = Y.one('#test-nodes');
            Assert.areEqual(node._node.childNodes.length,
                    node.get('childNodes').get('tagName').length);
        },

        'should find the id of the first nodes\'s parentNode': function() {
            Assert.areEqual('test-nodes', this._testNodes.get('parentNode').get('id')[0]);
        },

        'should find the text of the first item in children collection': function() {
            Assert.areEqual('item 1', Y.Lang.trim(this._testNodes.get('children')[0].get('text')[0]));
        },

        'should convert DOM node return values to NodeList': function() {
            Assert.isTrue(Y.all('input').get('parentNode') instanceof Y.NodeList);
        }
    }));
}, '@VERSION@' ,{requires:['node-base']});
