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

        'should set the label': function() {
            var tab = new Y.Tab();
            tab.set('content', 'new content');
            Y.Assert.areEqual('new content', tab.get('content'));
            Y.Assert.areEqual('new content', tab.get('panelNode').get('text'));

        }
    })); 
}, '@VERSION@' ,{requires:['tabview', 'test']});
