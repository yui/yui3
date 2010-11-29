YUI.add('dom-core-test', function(Y) {
    var Assert = Y.Assert;
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.byId',

        'should return element from string': function() {
            Y.Assert.areEqual(document.getElementById('test-id'),
                Y.DOM.byId('test-id'));
        },

        'should return first match when dupe id exists': function() {
            var node = document.getElementById('test-id'),
                dupe = document.createElement('div');

            dupe.id = 'test-id';
            document.body.insertBefore(dupe, node);
            Y.Assert.areEqual(dupe, Y.DOM.byId('test-id'));
            document.body.removeChild(dupe);
        },

        'should return null when no match': function() {
            Y.Assert.isNull(Y.DOM.byId('fake-id'));
        },

        'should return null when input is null': function() {
            Y.Assert.isNull(Y.DOM.byId(null));
        },

        'should return null when input is undefined': function() {
            Y.Assert.isNull(Y.DOM.byId());
        },

        'should avoid mistaking name for id': function() {
            var inputs = document.getElementsByTagName('form')[0]
                    .getElementsByTagName('input');

            Assert.areEqual(inputs[0], Y.DOM.byId('test-name-id1'));
            Assert.areEqual(inputs[1], Y.DOM.byId('test-name-id2'));
        },

        'should avoid mistaking form id for named input': function() {
            var form = document.getElementsByTagName('form')[0];
            Assert.areEqual(form, Y.DOM.byId('test-names'));
        },

        'should search the given node': function() {
            var node = document.createElement('div');
            node.innerHTML = '<span id="test-by-id-root">foo</span><span>bar</span>';
            document.body.appendChild(node);

            Y.Assert.areEqual(node.childNodes[0],
                    Y.DOM.byId('test-by-id-root', node));

            document.body.removeChild(node);
        },

        'should restrict search to the given node': function() {
            var node = document.createElement('div');
            node.id = 'test-by-id-root';
            document.body.appendChild(node);

            Y.Assert.isNull(Y.DOM.byId('test-by-id-root', node));

            document.body.removeChild(node);
        },

        'should search the given node (off document)': function() {
            var node = document.createElement('div');
            node.innerHTML = '<span id="test-by-id-root">foo</span><span>bar</span>';

            Y.Assert.areEqual(node.childNodes[0],
                    Y.DOM.byId('test-by-id-root', node));
        },

        'should search the given document (frame)': function() {
            Y.Assert.areEqual(document.getElementById('test-id'),
                    Y.DOM.byId('demo', document));
        },

        'should search the given document (frame)': function() {
            var frame = document.getElementById('test-frame'),
                doc = frame.contentWindow.document;

            Y.Assert.areEqual(doc.getElementById('demo'),
                    Y.DOM.byId('demo', doc));
        }
    })); 

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.allById',

        'should return all elements with the given id': function() {
            var nodes = document.getElementById('test-dupe-ids')
                .getElementsByTagName('span');

            ArrayAssert.itemsAreEqual(nodes, Y.DOM.allById('test-dupe-id'));
        },

        'should return all elements with the given id (root element)': function() {
            var node = document.getElementById('test-dupe-root'),
                nodes = node.getElementsByTagName('span');

            ArrayAssert.itemsAreEqual(nodes, Y.DOM.allById('test-dupe-id', node));
        },

        'should return empty array when no match': function() {
            ArrayAssert.itemsAreEqual([], Y.DOM.allById('fake-id'));
        },

        'should find cloned element': function() {
            var node = document.getElementById('test-id');
            var clone = node.cloneNode(true);
            clone.id = 'cloned-node';

            document.body.appendChild(clone);
            ArrayAssert.itemsAreEqual([clone], Y.DOM.allById('cloned-node'));
            document.body.removeChild(clone);
        },

        'should ignore matches on NAME instead of ID': function() {
            Assert.areEqual(1, Y.DOM.allById('test-names').length);
        },

        'should find all clones': function() {
            var node = document.getElementById('test-id'),
                clone = node.cloneNode(true),
                clone2 = node.cloneNode(true);

            clone.id = 'cloned-node';
            clone2.id = 'cloned-node';

            document.body.appendChild(clone);
            document.body.appendChild(clone2);
            ArrayAssert.itemsAreEqual([clone, clone2], Y.DOM.allById('cloned-node'));
            document.body.removeChild(clone);
            document.body.removeChild(clone2);
        },

        'should find all cloned forms': function() {
            var node = document.getElementById('test-clone-form'),
                clone = node.cloneNode(true),
                clone2 = node.cloneNode(true);

            clone.id = 'cloned-node';
            clone2.id = 'cloned-node';

            document.body.appendChild(clone);
            document.body.appendChild(clone2);
            ArrayAssert.itemsAreEqual([clone, clone2], Y.DOM.allById('cloned-node'));
            document.body.removeChild(clone);
            document.body.removeChild(clone2);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.children',

        'should return empty array when no element childNodes': function() {
            var node = document.createElement('div');
            ArrayAssert.itemsAreEqual([], Y.DOM.children(node));
        },

        'should return empty array when input is null': function() {
            ArrayAssert.itemsAreEqual([], Y.DOM.children(null));
        },

        'should return empty array when input is undefined': function() {
            ArrayAssert.itemsAreEqual([], Y.DOM.children());
        },

        'should return elements only': function() {
            var node = document.getElementById('test-children'),
                nodes = node.getElementsByTagName('span');

            ArrayAssert.itemsAreEqual(nodes, Y.DOM.children(node));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.firstByTag',

        'should return the first match': function() {
            Assert.areEqual(document.getElementsByTagName('div')[0],
                Y.DOM.firstByTag('div'));
        },

        'should return the first match (root element)': function() {
            var root = document.getElementById('test-names');

            Assert.areEqual(root.getElementsByTagName('input')[0],
                Y.DOM.firstByTag('input', root));

        },

        'should return null when no match': function() {
            Assert.isNull(Y.DOM.firstByTag('fake-tag'));
        },

        'should return null when tag is null': function() {
            Assert.isNull(Y.DOM.firstByTag(null));
        },

        'should search given document': function() {
            Assert.areEqual(document.getElementsByTagName('div')[0],
                Y.DOM.firstByTag('div', document));
        },

        'should search given document (frame)': function() {
            var frame = document.getElementById('test-frame'),
                doc = frame.contentWindow.document,
                node = doc .getElementById('demo');

            Assert.areEqual(node, Y.DOM.firstByTag('div', doc));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.getText',

        'should return the text content of the given node': function() {
            var node = document.getElementById('test-get-text'),
                nodes = node.childNodes,
                text = '',
                i = 0,
                child;

            while((child = nodes[i++])) {
                text += child.innerHTML || child.nodeValue;
            }

            Assert.areEqual(Y.Lang.trim(text), Y.Lang.trim(Y.DOM.getText(node)));
        },

        'should return the text content of the given text node': function() {
            var text = 'foo bar',
                node = document.createTextNode(text);

            Assert.areEqual(text, Y.DOM.getText(node));
        },

        'should return empty string when no text found' : function() {
            var node = document.createElement('div');
            Assert.areEqual('', Y.DOM.getText(node));
        },

        'should return empty string when input is null' : function() {
            Assert.areEqual('', Y.DOM.getText(null));
        },

        'should return empty string when input is undefined' : function() {
            Assert.areEqual('', Y.DOM.getText());
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.setText',

        'should set content with the given text': function() {
            var node = document.createElement('div'),
                content = 'testing text content';

            Y.DOM.setText(node, content);
            Assert.areEqual(content, Y.DOM.getText(node, content));
        },

        'should set html content as text': function() {
            var node = document.createElement('div'),
                content = '<div>testing text content</div>';

            Y.DOM.setText(node, content);
            Assert.areEqual(content, Y.DOM.getText(node, content));

        },

        'should preserve spaces': function() {
            var node = document.createElement('div'),
                content = '   testing     text      content    ';

            Y.DOM.setText(node, content);
            Assert.areEqual(content, Y.DOM.getText(node, content));
        },

        'should replace existing content': function() {
            var node = document.createElement('div'),
                content = 'testing text content';

            node.innerHTML = '<em>foo</em>';

            Y.DOM.setText(node, content);
            Assert.areEqual(content, Y.DOM.getText(node, content));
        },

        'should set text for text node': function() {
            var node = document.createTextNode(''),
                content = 'testing text content';

            Y.DOM.setText(node, content);
            Assert.areEqual(content, Y.DOM.getText(node, content));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.elementByAxis',

        'should return the next element': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('div')[0];

            Assert.areEqual(root.getElementsByTagName('span')[0],
                Y.DOM.elementByAxis(node, 'nextSibling'));
        },

        'should return the next node': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('div')[0];

            Assert.areEqual(node.nextSibling,
                Y.DOM.elementByAxis(node, 'nextSibling', null, true));
        },

        'should return the next element that passes the test fn': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('div')[0],
                fn = function(node) {
                    return node.tagName === 'EM';
                };

            Assert.areEqual(root.getElementsByTagName('em')[0],
                Y.DOM.elementByAxis(node, 'nextSibling', fn));
        },

        'should return the next node that passes the test fn': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('div')[0],
                fn = function(node) {
                    return node.nodeValue === 'baz';
                };

            Assert.areEqual(root.getElementsByTagName('span')[0].nextSibling,
                Y.DOM.elementByAxis(node, 'nextSibling', fn, true));
        },

        'should return the previous element': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('span')[0];

            Assert.areEqual(root.getElementsByTagName('div')[0],
                Y.DOM.elementByAxis(node, 'previousSibling'));
        },

        'should return the previous node': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('span')[0];

            Assert.areEqual(node.previousSibling,
                Y.DOM.elementByAxis(node, 'previousSibling', null, true));
        },

        'should return the previous element that passes the test fn': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.tagName === 'DIV';
                };

            Assert.areEqual(root.getElementsByTagName('div')[0],
                Y.DOM.elementByAxis(node, 'previousSibling', fn));
        },

        'should return the previous node that passes the test fn': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('em')[0],
                fn = function(node) {
                    return node.nodeValue === 'foo';
                };

            Assert.areEqual(root.getElementsByTagName('div')[0].previousSibling,
                Y.DOM.elementByAxis(node, 'previousSibling', fn, true));
        },

        'should return the parent element': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('span')[0];

            Assert.areEqual(root, Y.DOM.elementByAxis(node, 'parentNode'));
        },

        'should return the ancestor element that passes the test fn': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.tagName === 'BODY';
                };

            Assert.areEqual(document.body,
                Y.DOM.elementByAxis(node, 'parentNode', fn));
        },

        'should return null when not found': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.firstChild,
                fn = function(node) {
                    return node.nodeValue === 'foo';
                };

            Assert.isNull(Y.DOM.elementByAxis(node, 'previousSibling'));
            Assert.isNull(Y.DOM.elementByAxis(node, 'previousSibling', fn));
            Assert.isNull(Y.DOM.elementByAxis(node, 'previousSibling', null, true));
            Assert.isNull(Y.DOM.elementByAxis(node, 'previousSibling', fn, true));
        },

        'should return null when input is null': function() {
            Assert.isNull(Y.DOM.elementByAxis(null, 'previousSibling'));
            Assert.isNull(Y.DOM.elementByAxis(document.body));
        },

        'should return null when input is undefined': function() {
            Assert.isNull(Y.DOM.elementByAxis());
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.ancestor',

        'should return the parent node': function() {
            Assert.areEqual(document.documentElement,
                    Y.DOM.ancestor(document.body));
        },

        'should return the same node': function() {
            Assert.areEqual(document.body,
                    Y.DOM.ancestor(document.body, null, true));
        },

        'should return the matching ancestor': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.tagName === 'BODY';
                };

            Assert.areEqual(document.body, Y.DOM.ancestor(node, fn));
        },

        'should return the matching ancestor (test self match)': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.tagName === 'EM';
                };

            Assert.areEqual(node, Y.DOM.ancestor(node, fn, true));
        },

        'should return the matching ancestor (test self not matched)': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.tagName === 'BODY';
                };

            Assert.areEqual(document.body, Y.DOM.ancestor(node, fn, true));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.ancestors',

        'should return an array of one (documentElement)': function() {
            ArrayAssert.itemsAreEqual([document.documentElement],
                    Y.DOM.ancestors(document.body));
        },

        'should include the starting node': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);
            ArrayAssert.itemsAreEqual([document.documentElement, document.body, node],
                    Y.DOM.ancestors(node, null, true));

            document.body.removeChild(node);
        },

        'should omit the starting node': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);
            ArrayAssert.itemsAreEqual([document.documentElement, document.body],
                    Y.DOM.ancestors(node));

            document.body.removeChild(node);
        },

        'should return the matching ancestors': function() {
            var node = document.createElement('div'),
                fn = function(node) {
                    return node.tagName !== 'HTML';
                };

            document.body.appendChild(node);
            ArrayAssert.itemsAreEqual([document.body], Y.DOM.ancestors(node, fn));
            document.body.removeChild(node);
        },

        'should return the matching ancestors (test self match)': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.tagName === 'EM';
                };

            ArrayAssert.itemsAreEqual([node], Y.DOM.ancestors(node, fn, true));
        },

        'should return the matching ancestors (test self not matched)': function() {
            var root = document.getElementById('test-element-by-axis'),
                node = root.getElementsByTagName('EM')[0],
                fn = function(node) {
                    return node.tagName === 'BODY';
                };

            ArrayAssert.itemsAreEqual([document.body], Y.DOM.ancestors(node, fn, true));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.contains',

        'html element should contain body element': function() {
            Assert.isTrue(Y.DOM.contains(document.documentElement, document.body));
        },

        'body element should not contain html element': function() {
            Assert.isFalse(Y.DOM.contains(document.body, document.documentElement));
        },

        'should be true for contained element': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);
            Assert.isTrue(Y.DOM.contains(document.body, node));
            document.body.removeChild(node);
        },

        'should be false for uncontained element': function() {
            var node = document.createElement('div');
            Assert.isFalse(Y.DOM.contains(document.body, node));
        },

        'should be true when element is element': function() {
            Assert.isTrue(Y.DOM.contains(document.body, document.body));
        },

        'should be true for contained text node': function() {
            var node = document.createTextNode('foo');
            document.body.appendChild(node);
            Assert.isTrue(Y.DOM.contains(document.documentElement, node));
            document.body.removeChild(node);
        },

        'should be false for uncontained text node': function() {
            var node = document.createTextNode('foo');
            Assert.isFalse(Y.DOM.contains(document.body, node));
        },

        'should return false for null input': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);

            Assert.isFalse(Y.DOM.contains(document.body, null));
            Assert.isFalse(Y.DOM.contains(null, node));
            Assert.isFalse(Y.DOM.contains(null, null));

            document.body.removeChild(node);
        },

        'should return false for undefined input': function() {
            Assert.isFalse(Y.DOM.contains(document.body));
            Assert.isFalse(Y.DOM.contains());
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._bruteContains',

        'html element should contain body element': function() {
            Assert.isTrue(Y.DOM._bruteContains(document.documentElement, document.body));
        },

        'body element should not contain html element': function() {
            Assert.isFalse(Y.DOM._bruteContains(document.body, document.documentElement));
        },

        'should be true for contained element': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);
            Assert.isTrue(Y.DOM._bruteContains(document.body, node));
            document.body.removeChild(node);
        },

        'should be false for uncontained element': function() {
            var node = document.createElement('div');
            Assert.isFalse(Y.DOM._bruteContains(document.body, node));
        },

        'should be true when element is element': function() {
            Assert.isTrue(Y.DOM._bruteContains(document.body, document.body));
        },

        'should be true for contained text node': function() {
            var node = document.createTextNode('foo');
            document.body.appendChild(node);
            Assert.isTrue(Y.DOM._bruteContains(document.documentElement, node));
            document.body.removeChild(node);
        },

        'should be false for uncontained text node': function() {
            var node = document.createTextNode('foo');
            Assert.isFalse(Y.DOM._bruteContains(document.body, node));
        },

        'should return false for null input': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);

            Assert.isFalse(Y.DOM._bruteContains(document.body, null));
            Assert.isFalse(Y.DOM._bruteContains(null, node));
            Assert.isFalse(Y.DOM._bruteContains(null, null));

            document.body.removeChild(node);
        },

        'should return false for undefined input': function() {
            Assert.isFalse(Y.DOM._bruteContains(document.body));
            Assert.isFalse(Y.DOM._bruteContains());
        }
        
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.inDoc',

        'should return false for off document node': function() {
            var node = document.createElement('div');
            Assert.isFalse(Y.DOM.inDoc(node));
        },

        'should return true for in document node': function() {
            Assert.isTrue(Y.DOM.inDoc(document.body));
        },

        'should return false for removed node': function() {
            var node = document.createElement('div');
            document.body.appendChild(node);
            document.body.removeChild(node);
            Assert.isFalse(Y.DOM.inDoc(node), 'removed');
        },

        'should work with duplicate IDs in document': function() {
            var nodes = document.getElementById('test-dupe-ids')
                .getElementsByTagName('span');

            Assert.isTrue(Y.DOM.inDoc(nodes[2]));
        },

        'should work with duplicate IDs off document': function() {
            var node = document.createElement('div');
            node.id = 'test-dupe-id';
            Assert.isFalse(Y.DOM.inDoc(node));
        },

        'should work with form that has input name="id" and id="id"': function() {
            var node = document.getElementById('test-names');
            Assert.isTrue(Y.DOM.inDoc(node));
        },

        'should return false when input is null': function() {
            Assert.isFalse(Y.DOM.inDoc(null));
        },

        'should return false for cloned node off document': function() {
            var node = document.getElementById('test-id');
            node = node.cloneNode(true);
            Assert.isFalse(Y.DOM.inDoc(node));
        },

        'should return true for cloned node in document (same id)': function() {
            var node = document.getElementById('test-id');
            node = node.cloneNode(true);
            document.body.appendChild(node);
            Assert.isTrue(Y.DOM.inDoc(node));
            document.body.removeChild(node);
        },

        'should return true for cloned node in document (new id)': function() {
            var node = document.getElementById('test-id');
            node = node.cloneNode(true);
            node.id = 'test-id-new';
            document.body.appendChild(node);
            Assert.isTrue(Y.DOM.inDoc(node));
            document.body.removeChild(node);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.create',

        'should create empty div': function() {
            var el = Y.DOM.create(('<div/>'));
            Assert.areEqual('DIV', el.tagName);
            Assert.areEqual('', el.innerHTML);
        },

        'should trim leading space': function() {
            var el = Y.DOM.create((' <div/>'));
            Assert.areEqual('DIV', el.tagName);
            Assert.areEqual('', el.innerHTML);
        },

        'should create empty div (self-closed input)': function() {
            var el = Y.DOM.create(('<div/>'));
            Assert.areEqual('DIV', el.tagName);
            Assert.areEqual('', el.innerHTML);
        },

        'should create div with text': function() {
            var el = Y.DOM.create(('<div>foo</div>'));
            Assert.areEqual('DIV', el.tagName);
            Assert.areEqual('foo', el.innerHTML);
        },

        'should create div with innerHTML': function() {
            var el = Y.DOM.create(('<div><em>bar</em></div>'));
            Assert.areEqual('DIV', el.tagName);
            Assert.areEqual('<em>bar</em>', el.innerHTML.toLowerCase());
        },

        'should create input type submit': function() {
            var el = Y.DOM.create('<input name="foo" value="bar" type="submit">');
            Assert.areEqual('INPUT', el.tagName);
            Assert.areEqual('submit', el.type);
            Assert.areEqual('foo', el.name);
            Assert.areEqual('bar', el.value);
        },

        'should create input type radio': function() {
            var el = Y.DOM.create('<input name="test-input" type="radio">');
            Assert.areEqual('INPUT', el.tagName);
            Assert.areEqual('radio', el.type);

        },

        'should create form': function() {
            var el = Y.DOM.create('<form/>');
            Assert.areEqual('FORM', el.tagName);
        },

        'should create a form with content': function() {
            var el = Y.DOM.create('<form><fieldset><legend>foo</legend>' + 
                '<label>foo:</label><input name="foo"><input type="submit"></fieldset></form>'),
                fieldset = el.firstChild,
                legend = fieldset.firstChild;
                label = legend.nextSibling,
                input = label.nextSibling;
                submit = input.nextSibling;

            Assert.areEqual('FORM', el.tagName);
            Assert.areEqual('FIELDSET', fieldset.tagName);
            Assert.areEqual('LEGEND', legend.tagName);
            Assert.areEqual('LABEL', label.tagName);

            Assert.areEqual('INPUT', input.tagName);
            Assert.areEqual('foo', input.name);

            Assert.areEqual('INPUT', submit.tagName);
            Assert.areEqual('submit', submit.type);
        },

        'should create legend': function() {
            var el = Y.DOM.create('<legend/>');
            Assert.areEqual('LEGEND', el.tagName);
        },

        'should create fieldset': function() {
            var el = Y.DOM.create('<fieldset/>');
            Assert.areEqual('FIELDSET', el.tagName);
        },

        'should create label': function() {
            var el = Y.DOM.create('<label/>');
            Assert.areEqual('LABEL', el.tagName);
        },

        'should create a list item': function() {
            var el = Y.DOM.create('<li>fresh</li>');
            Assert.areEqual('LI', el.tagName);
            Assert.areEqual('fresh', el.innerHTML);

        },

        'should create a one item list': function() {
            el = Y.DOM.create('<ul><li>fresh</li></ul>');
            Assert.areEqual(1, el.childNodes.length);

        },

        'should create a table': function() {
            var el = Y.DOM.create('<table/>');
            Assert.areEqual('TABLE', el.tagName);
        },

        'should create a table with content': function() {
            var el = Y.DOM.create('<table><tr><td>foo</td><td>bar</td></tr></table>'),
                tbody = el.firstChild,
                tr = el.firstChild.firstChild,
                td = tr.firstChild;
            Assert.areEqual('TABLE', el.tagName);
            Assert.areEqual('TBODY', tbody.tagName);
            Assert.areEqual('TR', tr.tagName);
            Assert.areEqual('TD', td.tagName);
            Assert.areEqual('TD', td.nextSibling.tagName, 'td 2');
        },

        'should create a table head': function() {
            var el = Y.DOM.create('<thead></thead>');
            Assert.areEqual('THEAD', el.tagName);
        },

        'should create a table head from uppercase': function() {
            var el = Y.DOM.create('<THEAD></THEAD>');
            Assert.areEqual('THEAD', el.tagName);
        },

        'should create a table head with nested table': function() {
            var el = Y.DOM.create('<thead><tr><td><table><tbody><tr>' + 
                    '<td>fresh</td></tr></tbody></table></td></tr></thead>');

            Assert.areEqual('THEAD', el.tagName);
            Assert.areEqual(1, el.getElementsByTagName('table').length);
        },

        'should create a table heading cell': function() {
            var el = Y.DOM.create('<th>fresh</th>');
            Assert.areEqual('TH', el.tagName);
            Assert.areEqual('fresh', el.innerHTML);
        },

        'should create a caption': function() {
            var el = Y.DOM.create('<caption>fresh</caption>');
            Assert.areEqual('CAPTION', el.tagName);
            Assert.areEqual('fresh', el.innerHTML);
        },

        'should create a colgroup': function() {
            var el = Y.DOM.create('<colgroup/>');
            Assert.areEqual('COLGROUP', el.tagName);
        },

        'should create a col element': function() {
            var el = Y.DOM.create('<col>');
            Assert.areEqual('COL', el.tagName);
        },

        'should create a colgroup with col elements': function() {
            var el = Y.DOM.create('<colgroup><col><col></colgroup>'),
                nodes = el.childNodes,
                i = 0,
                cols = [],
                child;

            // IE inserts a linefeed between cols
            while((child = nodes[i++])) {
                if (child.nodeName === 'COL') {
                    cols.push(child);
                }
            }
            Assert.areEqual('COLGROUP', el.tagName);
            Assert.areEqual('COL', cols[0].tagName);
            Assert.areEqual('COL', cols[1].tagName);
        },

        'should create a table row': function() {
            var el = Y.DOM.create('<tr/>');
            Assert.areEqual('TR', el.tagName);
        },

        'should create a table row with content': function() {
            var el = Y.DOM.create('<tr><td>foo</td><td>bar</td></tr>');
            Assert.areEqual('TR', el.tagName);
            Assert.areEqual('TD', el.firstChild.tagName);
            Assert.areEqual('TD', el.firstChild.nextSibling.tagName, 'td 2');
        },

        'should create a table cell': function() {
            var el = Y.DOM.create('<td/>');
            Assert.areEqual('TD', el.tagName);
        },

        'should create a table cell with content': function() {
            var el = Y.DOM.create('<td>fresh</td>');
            Assert.areEqual('TD', el.tagName);
            Assert.areEqual('fresh', el.innerHTML);
        },

        'should create a button element': function() {
            var el = Y.DOM.create('<button>fresh</button>');
            Assert.areEqual('BUTTON', el.tagName);
        },

        'should create an optgroup element': function() {
            var el = Y.DOM.create('<optgroup></optgroup>');
            Assert.areEqual('OPTGROUP', el.tagName);
        },

        'should create an optgroup with an option': function() {
            var el = Y.DOM.create('<optgroup><option>foo</option></optgroup>');
            Assert.areEqual('OPTGROUP', el.tagName);
            Assert.areEqual('OPTION', el.firstChild.tagName, 'option');
        },

        'should create an optgroup with options': function() {
            var el = Y.DOM.create('<optgroup><option>foo</option><option>bar</option></optgroup>');
            Assert.areEqual('OPTGROUP', el.tagName);
            Assert.areEqual('OPTION', el.firstChild.tagName, 'option');
            Assert.areEqual('OPTION', el.firstChild.nextSibling.tagName, 'option 2');
        },

        'should create a select element': function() {
            var el = Y.DOM.create('<select/>');
            Assert.areEqual('SELECT', el.tagName);
        },

        'should create a select with an option': function() {
            var el = Y.DOM.create('<select><option>foo</option></select>');
            Assert.areEqual('SELECT', el.tagName);
            Assert.areEqual('OPTION', el.firstChild.tagName, 'option');
        },

        'should create a select with options': function() {
            var el = Y.DOM.create('<select><option>foo</option><option>bar</option></select>');
            Assert.areEqual('SELECT', el.tagName);
            Assert.areEqual('OPTION', el.firstChild.tagName, 'option');
            Assert.areEqual('OPTION', el.firstChild.nextSibling.tagName, 'option 2');
        },

        'should create a option element': function() {
            var el = Y.DOM.create('<option/>');
            Assert.areEqual('OPTION', el.tagName);
        },

        'should create a option with content': function() {
            var el = Y.DOM.create('<option><foo</option>');
            Assert.areEqual('OPTION', el.tagName);
        },

        'should create a selected option': function() {
            var el = Y.DOM.create('<option selected><foo</option>');
            Assert.areEqual('OPTION', el.tagName);
        },

        'should create an iframe (self-closed)': function() {
            var el = Y.DOM.create('<iframe/>');
            Assert.areEqual('IFRAME', el.tagName);
        },

        'should create an iframe': function() {
            var el = Y.DOM.create('<iframe src="http://search.yahoo.com/" id="yui-iframetest"></iframe>');
            Assert.areEqual('IFRAME', el.tagName);
        },

        'should create an iframe with attributes': function() {
            var html = '<iframe border="0" frameBorder="0" marginWidth="0"' +
                    ' marginHeight="0" leftMargin="0" topMargin="0"' + 
                    ' allowTransparency="true" width="100%" height="99%"></iframe>';
            el = Y.DOM.create(html);
            Assert.areEqual('IFRAME', el.tagName);
            Assert.areEqual(0, el.frameBorder);
            Assert.areEqual(document, el.ownerDocument);
        },

        'should create a script': function() {
            var el = Y.DOM.create('<scr' + 'ipt/>');
            Assert.areEqual('SCRIPT', el.tagName);
        },

        'should create a script with src': function() {
            var el = Y.DOM.create('<scr' + 'ipt src="http://search.yahoo.com/"></scr' + 'ipt>');
            Assert.areEqual('SCRIPT', el.tagName);
            Assert.areEqual('http://search.yahoo.com/', el.src);
        },

        'should create a link element': function() {
            var el = Y.DOM.create('<link/>');
            Assert.areEqual('LINK', el.tagName);
        },

        'should create a link element with attrs': function() {
            var el = Y.DOM.create('<link href="http://search.yahoo.com/" rel="stylesheet">');
            Assert.areEqual('LINK', el.tagName);
            Assert.areEqual('http://search.yahoo.com/', el.href);
            Assert.areEqual(el.rel, 'stylesheet');
        },

        'should create a textNode': function() {
            var el = Y.DOM.create('text');
            Assert.areEqual(3, el.nodeType);
        },

        'should return a fragment when creating a collection': function() {
            var html = '<div>foo</div><div id="tmp-bar">bar</div><div>baz</div>',
                el = Y.DOM.create(html);

            Assert.areEqual(11, el.nodeType);
            Assert.areEqual(3, el.childNodes.length);
            Assert.areEqual('tmp-bar', el.childNodes[1].id);
            Assert.areEqual('foo', el.childNodes[0].innerHTML);
        },

        'should return a fragment containing options': function() {
            var html = '<option>foo</option><option id="tmp-bar">bar</option><option>baz</option>',
                el = Y.DOM.create(html);

            Assert.areEqual(11, el.nodeType);
            Assert.areEqual(3, el.childNodes.length);
            Assert.areEqual('tmp-bar', el.childNodes[1].id);
        },

        'should return a fragment including text nodes': function() {
            var html = 'foo <span>bar</span> baz',
                el = Y.DOM.create(html);

            Assert.areEqual(11, el.nodeType);
            Assert.areEqual(3, el.childNodes[0].nodeType);
            Assert.areEqual(1, el.childNodes[1].nodeType);
            Assert.areEqual(3, el.childNodes[2].nodeType);
        },

        'should return a fragment with the correct selected option': function() {
            var html = '<option>foo</option><option selected>bar</option><option>baz</option>';
                el = Y.DOM.create(html);

            Assert.areEqual(11, el.nodeType);
            Assert.areEqual(3, el.childNodes.length);
            Assert.isTrue(el.childNodes[1].selected);
        },

        'should return a fragment containing table cells': function() {
            var html = '<td>foo</td><td id="tmp-bar">bar</td><td>baz</td>',
                el = Y.DOM.create(html);

            Assert.areEqual(11, el.nodeType);
            Assert.areEqual(3, el.childNodes.length);
            Assert.areEqual('tmp-bar', el.childNodes[1].id);
        },

        'should return a fragment containing col elements': function() {
            var html = '<col><col>',
                el = Y.DOM.create(html);

            Assert.areEqual(11, el.nodeType);
            Assert.areEqual(2, el.childNodes.length);
            Assert.areEqual('COL', el.childNodes[0].tagName);
            Assert.areEqual('COL', el.childNodes[1].tagName);
        },

        'should return a fragment containing table bodies': function() {
            var html = '<tbody><tr><td>foo</td></tr></tbody><tbody id="tmp-bar"><tr><td>bar</td></tr></tbody><tbody><tr><td>bar</td></tr></tbody>',
                el = Y.DOM.create(html);

            Assert.areEqual(11, el.nodeType);
            Assert.areEqual(3, el.childNodes.length);
            Assert.areEqual('TBODY', el.childNodes[0].tagName);
            Assert.areEqual('TBODY', el.childNodes[1].tagName);
            Assert.areEqual('tmp-bar', el.childNodes[1].id);
        },

        'should return a fragment containing thead with nested table and tbody': function() {

            var html = '<thead><tr><td><table><tbody><tr><td>fresh</td></tr>' +
                        '</tbody></table></td></tr></thead><tbody></tbody>',
                el = Y.DOM.create(html);

            Assert.areEqual(11, el.nodeType);
            Assert.areEqual(2, el.childNodes.length);

            Assert.areEqual('THEAD', el.firstChild.tagName);
            Assert.areEqual(1, el.firstChild.getElementsByTagName('table').length);

            Assert.areEqual('TBODY', el.childNodes[1].tagName);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.getAttribute',

        'should return "className" value': function() {
            var node = document.createElement('div');
            node.className = 'foo';

            Assert.areEqual('foo', Y.DOM.getAttribute(node, 'class'), 'class');
            Assert.areEqual('foo', Y.DOM.getAttribute(node, 'className'), 'className');
        },
        
        'should return "for" value': function() {
            var node = document.getElementById('for-id');
            Assert.areEqual('id', Y.DOM.getAttribute(node, 'for'));
            Assert.areEqual('id', Y.DOM.getAttribute(node, 'htmlFor'));
        },

        'should handle bad input': function() {
            var node = document.createElement('div');

            Y.DOM.getAttribute(null);
            Y.DOM.getAttribute();
            Assert.isTrue(true);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.setAttribute',

        'should set className': function() {
            var node = document.createElement('div');

            Y.DOM.setAttribute(node, 'class', 'foo');
            Assert.areEqual('foo', node.className);

            Y.DOM.setAttribute(node, 'className', 'bar');
            Assert.areEqual('bar', node.className);

        },

        'should set "for" attribute': function() {
            var node = document.createElement('label');

            Y.DOM.setAttribute(node, 'for', 'foo');
            Assert.areEqual('foo', node.htmlFor);

            Y.DOM.setAttribute(node, 'htmlFor', 'bar');
            Assert.areEqual('bar', node.htmlFor);
        },

        'should handle bad input': function() {
            var node = document.createElement('div');

            Y.DOM.setAttribute(null, 'bar');
            Y.DOM.setAttribute(node, null);
            Y.DOM.setAttribute();
            Assert.isTrue(true);
        }

    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.getValue',

        'input value should match html value': function() {
            var node = document.getElementById('test-text-value'),
                val = 'test value';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'input value should match no html value': function() {
            var node = document.getElementById('test-text-no-value'),
                val = '';
            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'input value should match empty html value': function() {
            var node = document.getElementById('test-text-empty-value'),
                val = '';
            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'textarea value should match html value': function() {
            var node = document.getElementById('test-textarea-text-value'),
                val = 'textarea test';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'textarea value should match no html value': function() {
            var node = document.getElementById('test-textarea-no-value'),
                val = '';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'should ignore textarea html value attribute': function() {
            var node = document.getElementById('test-textarea-value');
                
            Assert.areEqual('', Y.DOM.getValue(node));
        },

        'select value should match html value': function() {
            var node = document.getElementById('test-select-value');
                val = 'option value';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'select value should match no html value': function() {
            var node = document.getElementById('test-select-no-value'),
                val = '';
            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'select value should match empty html value with text': function() {
            var node = document.getElementById('test-select-empty-value-text'),
                val = '';
            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'select value should match empty html value': function() {
            var node = document.getElementById('test-select-empty-value'),
                val = '';
            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'option value should match html value': function() {
            var node = document.getElementById('test-option-value');
                val = 'option value';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'option value should match html content': function() {
            var node = document.getElementById('test-option-value-text');
                val = 'option text';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'option value should match no html value': function() {
            var node = document.getElementById('test-option-no-value'),
                val = '';
            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'option value should match empty html value with text': function() {
            var node = document.getElementById('test-select-empty-value-text'),
                val = '';
            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'option value should match empty html value': function() {
            var node = document.getElementById('test-select-empty-value'),
                val = '';
            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'button value should match html value': function() {
            var node = document.getElementById('test-button-value');
                val = 'button value';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'button value should match no html value': function() {
            var node = document.getElementById('test-button-no-value'),
                val = '';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'button value should ignore html content': function() {
            var node = document.getElementById('test-button-text-value');
                val = '';

            Assert.areEqual(val, Y.DOM.getValue(node));
        },

        'button value should match empty value': function() {
            var node = document.getElementById('test-button-empty-value');
                val = '';

            Assert.areEqual(val, Y.DOM.getValue(node));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.setValue',

        'input value should match updated value': function() {
            var node = document.getElementById('test-text-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, 'test value');
        },

        'value updated from empty string should be new value': function() {
            var node = document.getElementById('test-text-empty-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, '');
        },

        'value updated from no value should be new value': function() {
            var node = document.getElementById('test-text-no-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, '');
            node.removeAttribute('value')
        },

        'textarea from html value should match new value': function() {
            var node = document.getElementById('test-textarea-text-value'),
                val = 'new textarea test';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue('textarea test');
        },

        'textarea from no value should match new value': function() {
            var node = document.getElementById('test-textarea-no-value'),
                val = 'new textarea test';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue('');
        },

        'button value should match updated value': function() {
            var node = document.getElementById('test-button-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, 'test value');
        },

        'button value updated from empty string should be new value': function() {
            var node = document.getElementById('test-button-empty-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, '');
        },

        'button value updated from no value should be new value': function() {
            var node = document.getElementById('test-button-no-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, '');
            node.removeAttribute('value')
        },

        'option value should match updated value': function() {
            var node = document.getElementById('test-option-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, 'test value');
        },

        'option value updated from text should be new value': function() {
            var node = document.getElementById('test-option-value-text'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, '');
        },

        'option value updated from empty string should be new value': function() {
            var node = document.getElementById('test-option-empty-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, '');
        },

        'option value updated from no value should be new value': function() {
            var node = document.getElementById('test-option-no-value'),
                val = 'new value';

            Y.DOM.setValue(node, val);
            Assert.areEqual(val, Y.DOM.getValue(node));
            Y.DOM.setValue(node, '');
            node.removeAttribute('value')
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._nl2Frag',

        'should return fragment from HTMLCollection': function() {
            var node = document.createElement('div'),
                frag;
            
            node.innerHTML = '<div>foo</div><div>bar</div><div>baz</div>';
            frag = Y.DOM._nl2frag(node.childNodes);

            Y.Assert.areEqual(11, frag.nodeType);
            Y.Assert.areEqual(3, frag.childNodes.length);
        },

        'should return fragment from Array of HTML Elements': function() {
            var nodes = [
                document.createElement('div'),
                document.createElement('div'),
                document.createElement('div')
            ],

            frag = Y.DOM._nl2frag(nodes);

            Y.Assert.areEqual(11, frag.nodeType);
            Y.Assert.areEqual(3, frag.childNodes.length);
        },

        'should return null for bad input': function() {
            Assert.isNull(Y.DOM._nl2frag({}));
            Assert.isNull(Y.DOM._nl2frag());
            Assert.isNull(Y.DOM._nl2frag(''));
            Assert.isNull(Y.DOM._nl2frag(1));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.isWindow',

        'should return true for window object': function() {
            Assert.isTrue(Y.DOM.isWindow(window));
        },

        'should return true for frame window object': function() {
            var frame = document.getElementById('test-frame'),
                doc = frame.contentWindow.document,
                win = doc.defaultView || doc.parentWindow;

            Assert.isTrue(Y.DOM.isWindow(win));
        },

        'should return false for document object': function() {
            Assert.isFalse(Y.DOM.isWindow(document));
        },

        'should return false for non-window input': function() {
            Assert.isFalse(Y.DOM.isWindow());
            Assert.isFalse(Y.DOM.isWindow(null));
            Assert.isFalse(Y.DOM.isWindow(1));
            Assert.isFalse(Y.DOM.isWindow(document.body));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._removeChildNodes',

        'should remove all childNodes': function() {
            var node = document.createElement('div'),
                html = '<em>foo</em><strong>bar</strong><span>baz</span>';

            node.innerHTML = html;

            Y.DOM._removeChildNodes(node);
            Assert.areEqual(0, node.childNodes.length);
        }

    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.addHTML',

        'should append the given html to the node': function() {
            var node = document.createElement('div');

            Y.DOM.addHTML(node, '<em>new content</em>');
            Assert.areEqual('EM', node.lastChild.nodeName);
        },

        'should prepend the given html to the node': function() {
            var node = document.createElement('div');
            node.innerHTML = '<strong>bar</strong>';

            Y.DOM.addHTML(node, '<em>new content</em>', node.firstChild);
            Assert.areEqual('EM', node.firstChild.nodeName);
        },

        'should insert the given html after the first child': function() {
            var node = document.createElement('div');
            node.innerHTML = '<em>foo</em><strong>bar</strong>';

            Y.DOM.addHTML(node, '<span>new content</span>', node.childNodes[1]);
            Assert.areEqual('SPAN', node.childNodes[1].nodeName);
        },

        'should append the given node': function() {
            var node = document.createElement('div');
            Y.DOM.addHTML(node, document.createElement('div'));
            Assert.areEqual('DIV', node.firstChild.nodeName);
        },

        'should add html before the given node': function() {
            var node = document.createElement('div');
            node.innerHTML = '<em>foo</em><strong>bar</strong>';

            Y.DOM.addHTML(node.childNodes[1], '<span>new content</span>', 'before');
            Assert.areEqual('SPAN', node.childNodes[1].nodeName);
            
        },

        'should add html after the given node': function() {
            var node = document.createElement('div');
            node.innerHTML = '<em>foo</em><strong>bar</strong>';

            Y.DOM.addHTML(node.childNodes[1], '<span>new content</span>', 'after');
            Assert.areEqual('SPAN', node.childNodes[2].nodeName);
        },

        'should replace the existing content (empty string)': function() {
            var node = document.createElement('div');
            node.innerHTML = '<em>foo</em><strong>bar</strong>';

            Y.DOM.addHTML(node, '', 'replace');
            Assert.areEqual(0, node.childNodes.length);
        },

        'should replace the existing content (null)': function() {
            var node = document.createElement('div');
            node.innerHTML = '<em>foo</em><strong>bar</strong>';

            Y.DOM.addHTML(node, null, 'replace');
            Assert.areEqual(0, node.childNodes.length);
        },

        'should replace the existing content (undefined)': function() {
            var node = document.createElement('div');
            node.innerHTML = '<em>foo</em><strong>bar</strong>';

            Y.DOM.addHTML(node, undefined, 'replace');
            Assert.areEqual(0, node.childNodes.length);
        },

        'should replace the existing content (0)': function() {
            var node = document.createElement('div');
            node.innerHTML = '<em>foo</em><strong>bar</strong>';

            Y.DOM.addHTML(node, 0, 'replace');
            Assert.areEqual(1, node.childNodes.length);
            Assert.areEqual(3, node.firstChild.nodeType);
        },


        'should append the given nodelist': function() {
            var node = document.createElement('div'),
                node2 = document.createElement('div'),
                nodelist;

            node.innerHTML = '<em>foo</em><strong>bar</strong>';
            nodelist = node.getElementsByTagName('*');
            Y.DOM.addHTML(node2, nodelist);

            Assert.areEqual('EM', node2.childNodes[0].nodeName);
        },

        'should insert the given nodelist before the given node': function() {
            var node = document.createElement('div'),
                node2 = document.createElement('div'),
                nodelist;

            node.innerHTML = '<em>foo</em><strong>bar</strong>';
            node2.innerHTML = '<span>baz</span><b>foobar</b>';

            nodelist = node.getElementsByTagName('*');
            Y.DOM.addHTML(node2, nodelist, node2.firstChild.nextSibling);

            Assert.areEqual('EM', node2.childNodes[1].nodeName);
        },

        'should prepend the given nodelist': function() {
            var node = document.createElement('div'),
                node2 = document.createElement('div'),
                nodelist;

            node.innerHTML = '<em>foo</em><strong>bar</strong>';
            node2.innerHTML = '<span>baz</span><b>foobar</b>';

            nodelist = node.getElementsByTagName('*');
            Y.DOM.addHTML(node2, nodelist, node2.firstChild);

            Assert.areEqual('EM', node2.childNodes[0].nodeName);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._getRegExp',

        'should return RegExp obj': function() {
            var re = Y.DOM._getRegExp('^foo$');
            Assert.isTrue(typeof re.test === 'function');
        },

        'should return cached RegExp obj': function() {
            var re = Y.DOM._getRegExp('^foo$'),
                re2 = Y.DOM._getRegExp('^foo$');

            Assert.areSame(re, re2);
        },

        'should return new RegExp obj': function() {
            var re = Y.DOM._getRegExp('^foo$'),
                re2 = Y.DOM._getRegExp('^foos$'),
                re3 = Y.DOM._getRegExp('^foo$', 'g');

            Assert.areNotSame(re, re2);
            Assert.areNotSame(re, re3);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._getDoc',

        'should return document from body': function() {
            var doc = Y.DOM._getDoc(document.body);
            Assert.areSame(document, doc);
        },

        'should return document from new node': function() {
            var doc = Y.DOM._getDoc(document.createElement('div'));
            Assert.areSame(document, doc);
        },

        'should return document from window': function() {
            var doc = Y.DOM._getDoc(window);
            Assert.areSame(document, doc);
        },

        'should return document from document': function() {
            var doc = Y.DOM._getDoc(window);
            Assert.areSame(document, doc);
        },

        'should return iframe document from iframe window': function() {
            var win = document.getElementById('test-frame').contentWindow,
                doc = Y.DOM._getDoc(win);

            Assert.areSame(win.document, doc);
        },

        'should return iframe document from iframe node': function() {
            var win = document.getElementById('test-frame').contentWindow,
                doc = Y.DOM._getDoc(win.document.getElementById('demo'));

            Assert.areSame(win.document, doc);
        },

        'should return iframe document from iframe document': function() {
            var win = document.getElementById('test-frame').contentWindow,
                doc = Y.DOM._getDoc(win.document);

            Assert.areSame(win.document, doc);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._getWin',

        'should return window from body': function() {
            var win = Y.DOM._getWin(document.body);
            Assert.areSame(window.window, win.window);
        },

        'should return window from new node': function() {
            var win = Y.DOM._getWin(document.createElement('div'));
            Assert.areSame(window.window, win.window);
        },

        'should return window from window': function() {
            var win = Y.DOM._getWin(window);
            Assert.areSame(window.window, window.window);
        },

        'should return window from document': function() {
            var win = Y.DOM._getWin(window);
            Assert.areSame(window.window, win.window);
        },

        'should return iframe window from iframe window': function() {
            var node = document.getElementById('test-frame'),
                win = Y.DOM._getWin(node.contentWindow);

            Assert.areSame(node.contentWindow.window, win.window);
        },

        'should return iframe window from iframe node': function() {
            var contentWin = document.getElementById('test-frame').contentWindow,
                win = Y.DOM._getWin(contentWin.document.getElementById('demo'));

            Assert.areSame(contentWin.window, win.window);
        },

        'should return iframe window from iframe document': function() {
            var contentWin = document.getElementById('test-frame').contentWindow,
                win = Y.DOM._getWin(contentWin.document);

            Assert.areSame(contentWin.window, win.window);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._batch',

        'should append html on all nodes in HTMLCollection': function() {
            var node = document.createElement('div'),
                val = '<p>new text</p>';

            node.innerHTML = '<span></span><span></span><span></span>';

            Y.DOM._batch(node.childNodes, 'addHTML', val);

            Assert.areEqual('P', node.childNodes[0].firstChild.tagName);
            Assert.areEqual('P', node.childNodes[1].firstChild.tagName);
            Assert.areEqual('P', node.childNodes[2].firstChild.tagName);
        },

        'should setText on all nodes in HTMLCollection': function() {
            var node = document.createElement('div'),
                val = 'new text';

            node.innerHTML = '<span>foo</span><span>bar</span><span>baz</span>',

            Y.DOM._batch(node.childNodes, 'setText', val);

            Assert.areEqual(val, node.childNodes[0].innerHTML);
            Assert.areEqual(val, node.childNodes[1].innerHTML);
            Assert.areEqual(val, node.childNodes[2].innerHTML);
        }
    }));


    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._setSize',

        'should set the node offsetWidth to the given value': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM._setSize(node, 'width', 100);

            Assert.areEqual(100, node.offsetWidth);
            document.body.removeChild(node);
        },

        'should set the node offsetHeight to the given value': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM._setSize(node, 'height', 100);

            Assert.areEqual(100, node.offsetHeight);
            document.body.removeChild(node);
        },

        'should set the node offsetWidth to zero if given a negative number': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM._setSize(node, 'width', -100);

            Assert.areEqual(0, node.offsetWidth);
            document.body.removeChild(node);
        },

        'should set the node offsetHeight to zero if given a negative number': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM._setSize(node, 'height', -100);

            Assert.areEqual(0, node.offsetHeight);
            document.body.removeChild(node);
        },

        'should set the offsetWidth via setWidth': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM.setWidth(node, 100);

            Assert.areEqual(100, node.offsetWidth);
            document.body.removeChild(node);
        },

        'should set the offsetHeight via setHeight': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM.setHeight(node, 100);

            Assert.areEqual(100, node.offsetHeight);
            document.body.removeChild(node);
        },

        'should set offsetWidth accounting for padding': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            node.style.padding = '10px';
            Y.DOM.setWidth(node, 100);

            Assert.areEqual(100, node.offsetWidth);
            document.body.removeChild(node);

        },

        'should set offsetHeight accounting for padding': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            node.style.padding = '10px';
            Y.DOM.setHeight(node, 100);

            Assert.areEqual(100, node.offsetHeight);
            document.body.removeChild(node);
        },

        'should set offsetWidth to padding when setting to zero': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            node.style.padding = '10px';
            Y.DOM.setWidth(node, 0);

            Assert.areEqual(20, node.offsetWidth);
            document.body.removeChild(node);
        },

        'should set offsetHeight to padding when setting to zero': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            node.style.padding = '10px';
            Y.DOM.setHeight(node, 0);

            Assert.areEqual(20, node.offsetHeight);
            document.body.removeChild(node);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.wrap',

        'should wrap the node with the given html': function() {
            var node = document.createElement('span');
            Y.DOM.wrap(node, '<p></p>');
            Assert.areEqual('P', node.parentNode.tagName);
        },

        'should wrap the node with the given complex html': function() {
            var node = document.createElement('span');
            Y.DOM.wrap(node, '<p><em><strong><span></span></strong></em></p>');
            Assert.areEqual('SPAN', node.parentNode.tagName);
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.unwrap',

        'should remove the node\'s parent': function() {
            var node = document.createElement('span').appendChild(document.createElement('em'));
            Y.DOM.unwrap(node);
            Assert.isTrue(!node.parentNode || node.parentNode.nodeType !== 1);
        },

        'should remove the node\'s parent and replace in DOM': function() {
            var parent = document.createElement('span'),
                node = parent.appendChild(document.createElement('strong')).
                        appendChild(document.createElement('em'));

            document.body.insertBefore(parent, document.body.firstChild);
            Y.DOM.unwrap(node);
            Assert.areEqual('SPAN', node.parentNode.tagName);
            document.body.removeChild(node.parentNode);
        },

        'should remove the node\'s parent and replace in DOM with siblings': function() {
            var parent = document.createElement('div'),
                node;

            parent.innerHTML = '<p><span>foo</span><em>bar</em><strong>baz</strong></p>';
            node = parent.getElementsByTagName('em')[0];

            Y.DOM.unwrap(node);
            Assert.areEqual('DIV', node.parentNode.tagName);
            Assert.areEqual('SPAN', node.previousSibling.tagName);
            Assert.areEqual('DIV', node.previousSibling.parentNode.tagName);
            Assert.areEqual('STRONG', node.nextSibling.tagName);
            Assert.areEqual('DIV', node.nextSibling.parentNode.tagName);
        }
    }));


}, '@VERSION@' ,{requires:['dom-base', 'dom-deprecated', 'test']});
