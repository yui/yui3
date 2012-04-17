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

        'should set the label': function() {
            var tab = new Y.Tab();
            tab.set('label', 'new label');
            Y.Assert.areEqual('new label', tab.get('label'));
            Y.Assert.areEqual('new label', tab.get('contentBox').get('text'));

        },

        'should set the content': function() {
            var tab = new Y.Tab();
            tab.set('content', 'new content');
            Y.Assert.areEqual('new content', tab.get('content'));
            Y.Assert.areEqual('new content', tab.get('panelNode').get('text'));

        }
    })); 

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.Tab Content Events',

        'should preserve existing event listeners': function() {
            var pass = false,
                node = Y.one('#foo3 p'),
                tabs = new Y.TabView({srcNode: '#demo-tab-content'});

            node.on('click', function() {
            console.log('click');
                pass = true;
            });

            //node.simulate('click');
            Y.Event.simulate(node._node, 'click');
            Y.Assert.isTrue(pass);
            pass = false;

            tabs.render();
            console.log(tabs.item(0).get('panelNode'));
            Y.Event.simulate(node._node, 'click');
            Y.Assert.isTrue(pass);
        }
    })); 
}, '@VERSION@' ,{requires:['tabview', 'test']});
