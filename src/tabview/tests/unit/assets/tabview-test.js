YUI.add('tabview-test', function(Y) {

    var tabview = new Y.TabView({
        srcNode: '#demo'
    }),

    TEST_TIMEOUT = 1000;

    tabview.render();

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.TabView',

        'should return the selected tab': function() {
            Y.Assert.areEqual(0, tabview.get('selection').get('index'));
        },            

        'should update the selected tab': function() {
            tabview.selectChild(1);
            Y.Assert.areEqual(1, tabview.get('selection').get('index'));
            tabview.selectChild(0);
            Y.Assert.areEqual(0, tabview.get('selection').get('index'));
        },            

        'should fire selection change': function() {
            var test = this;
            tabview.once('selectionChange', function(e) {
                Y.Assert.areEqual(0, e.prevVal.get('index'));
                Y.Assert.areEqual(1, e.newVal.get('index'));
            });

            tabview.selectChild(1);

        },            

        'should add the new tab to the tabview': function() {
            var tab = new Y.Tab({ label: 'new tab', content: 'new tab content' }),
                children = tabview.add(tab);

            Y.Assert.areEqual(1, children.size());
        },            

        'should remove the selected tab': function() {
            tabview.selectChild(1);
            var tab = tabview.get('selection'),
                index = tab.get('index'),
                removedTab = tabview.remove(index);

            Y.Assert.areEqual(tab, removedTab);
            Y.Assert.areEqual(0, tabview.get('selection').get('index'));
            tabview.add(removedTab, 0);
            Y.Assert.areEqual(1, tabview.get('selection').get('index'));
            tabview.selectChild(0);
        },            

        'should fire selectionChange event': function() {
            var pass = false;
            tabview.on('selectionChange', function() { pass = true; });
            tabview.selectChild(1);
            Y.Assert.isTrue(pass);

            pass = false;
            tabview.selectChild(0);
            Y.Assert.isTrue(pass);

        },

        'should return the label from existing HTML': function() {
            var tabview = new Y.TabView({
                srcNode: '#demo-base'
            });

            tabview.render();
            Y.Assert.areEqual(Y.one('#demo-base li a').getHTML(), tabview.item(0).get('label'));
        },

        'should return the label from dynamic tabview': function() {
            var tabview = new Y.TabView({
                children: [{
                    label: 'foo',
                    content: 'foo content'
                }]
            });

            tabview.render();
            Y.Assert.areEqual('foo', tabview.item(0).get('label'));
            tabview.destroy();
        },

        'should set the label': function() {
            var tab = new Y.Tab();
            tab.set('label', 'new label');
            Y.Assert.areEqual('new label', tab.get('label'));
            Y.Assert.areEqual('new label', tab.get('contentBox').get('text'));
        },

        'should set the label via Y.Node instance': function() {
            var tab = new Y.Tab(),
                html = '<em>new label</em>',
                node = Y.Node.create(html);

            tab.set('label', node);
            Y.Assert.areEqual(html, tab.get('label').toLowerCase());
        },

        'should return the content from existing HTML': function() {
            var tabview = new Y.TabView({
                srcNode: '#demo-base'
            });

            tabview.render();
            Y.Assert.areEqual('foo content', tabview.item(0).get('content'));
        },

        'should return the content from dynamic tabview': function() {
            var tabview = new Y.TabView({
                children: [{
                    label: 'foo',
                    content: 'foo content'
                }]
            });

            tabview.render();
            Y.Assert.areEqual('foo content', tabview.item(0).get('content'));
            tabview.destroy();
        },

        'should set the content': function() {
            var tab = new Y.Tab();
            tab.set('content', 'new content');
            Y.Assert.areEqual('new content', tab.get('content'));
            Y.Assert.areEqual('new content', tab.get('panelNode').get('text'));
        },

        'should set the content via Y.Node instance': function() {
            var tab = new Y.Tab(),
                html = '<div>new content</div>',
                node = Y.Node.create(html);

            tab.set('content', node);
            Y.Assert.areEqual(html, tab.get('content').toLowerCase());
        },

        'should preserve existing content events post render()': function() {
            var html = '<div><a href="#">new content</a></div>',
                node = Y.Node.create(html),
                clicked = false,
                tabview = new Y.TabView({
                    children: [{
                        label: 'new label',
                        panelNode: node
                    }]
                });

            node.one('a').on('click', function(e) {
                e.preventDefault();
                clicked = true;
            });

            tabview.render();
            node.one('a').simulate('click');
            Y.Assert.isTrue(clicked);
            tabview.destroy();
        }
    })); 
}, '@VERSION@' ,{requires:['tabview', 'test']});
