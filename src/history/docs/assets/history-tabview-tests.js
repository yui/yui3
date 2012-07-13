YUI.add('history-tabview-tests', function(Y) {

    var suite = new Y.Test.Suite('history-tabview example tests');

    suite.add(new Y.Test.Case({

        name: 'Tab View Test',

        'should pass': function() {
            Y.Assert.isTrue(true);
        },

        'should have three tabs and three containers': function() {
            this.wait(function() {
                var demo = Y.one('#demo'),
                    tabs = demo.all('.yui3-tabview-list .yui3-tab'),
                    panels = demo.all('.yui3-tabview-panel .yui3-tab-panel');

                Y.Assert.areSame(3, tabs.size(), 'There are not 3 tabs.');
                Y.Assert.areSame(3, panels.size(), 'There are not 3 panels.');

                tabs.each(function(tab, index){
                    var anchor = tab.one('a').getAttribute('href').replace('#', '');
                    Y.Assert.areSame(anchor, panels.item(index).get('id'), 
                        'Panel at index ' + index + ' does not match the anchor \'' + anchor + '\' for tab');
                });
            }, 0);

        },

        'should have first tab selected': function() {
            var demo = Y.one('#demo'),
                tabs = demo.all('.yui3-tabview-list .yui3-tab'),
                selectedTab = demo.one('.yui3-tab-selected'),
                panels = demo.all('.yui3-tabview-panel .yui3-tab-panel'),
                selectedPanel = demo.one('.yui3-tab-panel-selected');

            Y.Assert.areSame(selectedTab, tabs.item(0), 'First tab is not selected.');
            Y.Assert.areSame(selectedPanel, panels.item(0), 'First tab panel is not selected.');
        },

        'should select first panel when first tab is clicked': function() {
            var tabs = Y.all('#demo .yui3-tabview-list .yui3-tab'),
                panels = Y.all('#demo .yui3-tabview-panel .yui3-tab-panel'),
                selectedTab = Y.one('#demo .yui3-tabview-list .yui3-tab-selected'),
                tabToSelect = 0,
                hash,
                hashTabValue;

            tabs.item(tabToSelect).simulate('click');

            Y.Assert.isTrue(tabs.item(tabToSelect).hasClass('yui3-tab-selected'), 
                'Tab #' + tabToSelect + ' was not selected.');
            Y.Assert.isTrue(panels.item(tabToSelect).hasClass('yui3-tab-panel-selected'), 
                'Panel #' + tabToSelect + ' was not selected.');

            // if we just selected the tab that was previously selected, abort happily
            if (tabs.indexOf(selectedTab) === tabToSelect) {
                return true;
            }

            // url hash should be updated now too
            hash = Y.QueryString.parse(window.location.hash.replace('#', ''));
            hashTabValue = hash.tab;

            Y.Assert.areSame(tabToSelect, hashTabValue, 'Selected tab is not represented in the location hash.');
            Y.Assert.areSame(tabToSelect, hashTabValue, 'Selected tab is not represented in the location hash.');

            // lets go back in history and check if previous tab was selected
            this.wait(function() {
                history.back();
            }, 100);
            this.wait(function() {
                Y.Assert.areSame(selectedTab, Y.one('#demo .yui3-tabview-list .yui3-tab-selected'), 
                    'Initial tab was not selected.');
            }, 200);
        },

        'should select second panel when second tab is clicked': function() {
            var tabs = Y.all('#demo .yui3-tabview-list .yui3-tab'),
                panels = Y.all('#demo .yui3-tabview-panel .yui3-tab-panel'),
                selectedTab = Y.one('#demo .yui3-tabview-list .yui3-tab-selected'),
                tabToSelect = 1,
                hash,
                hashTabValue;

            tabs.item(tabToSelect).simulate('click');

            Y.Assert.isTrue(tabs.item(tabToSelect).hasClass('yui3-tab-selected'), 
                'Tab #' + tabToSelect + ' was not selected.');
            Y.Assert.isTrue(panels.item(tabToSelect).hasClass('yui3-tab-panel-selected'), 
                'Panel #' + tabToSelect + ' was not selected.');

            // if we just selected the tab that was previously selected, abort happily
            if (tabs.indexOf(selectedTab) === tabToSelect) {
                return true;
            }

            // url hash should be updated now too
            hash = Y.QueryString.parse(window.location.hash.replace('#', ''));
            hashTabValue = hash.tab;

            Y.Assert.areSame(tabToSelect, hashTabValue, 'Selected tab is not represented in the location hash.');
            Y.Assert.areSame(tabToSelect, hashTabValue, 'Selected tab is not represented in the location hash.');

            // lets go back in history and check if previous tab was selected
            this.wait(function() {
                history.back();
            }, 100);
            this.wait(function() {
                Y.Assert.areSame(selectedTab, Y.one('#demo .yui3-tabview-list .yui3-tab-selected'), 
                    'Initial tab was not selected.');
            }, 200);
        },

        'should select third panel when third tab is clicked': function() {
            var tabs = Y.all('#demo .yui3-tabview-list .yui3-tab'),
                panels = Y.all('#demo .yui3-tabview-panel .yui3-tab-panel'),
                selectedTab = Y.one('#demo .yui3-tabview-list .yui3-tab-selected'),
                tabToSelect = 2,
                hash,
                hashTabValue;

            tabs.item(tabToSelect).simulate('click');

            Y.Assert.isTrue(tabs.item(tabToSelect).hasClass('yui3-tab-selected'), 
                'Tab #' + tabToSelect + ' was not selected.');
            Y.Assert.isTrue(panels.item(tabToSelect).hasClass('yui3-tab-panel-selected'), 
                'Panel #' + tabToSelect + ' was not selected.');

            // if we just selected the tab that was previously selected, abort happily
            if (tabs.indexOf(selectedTab) === tabToSelect) {
                return true;
            }

            // url hash should be updated now too
            hash = Y.QueryString.parse(window.location.hash.replace('#', ''));
            hashTabValue = hash.tab;

            Y.Assert.areSame(tabToSelect, hashTabValue, 'Selected tab is not represented in the location hash.');
            Y.Assert.areSame(tabToSelect, hashTabValue, 'Selected tab is not represented in the location hash.');

            // lets go back in history and check if previous tab was selected
            this.wait(function() {
                history.back();
            }, 100);
            this.wait(function() {
                Y.Assert.areSame(selectedTab, Y.one('#demo .yui3-tabview-list .yui3-tab-selected'), 
                    'Initial tab was not selected.');
            }, 200);
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires: ['history', 'test', 'node-event-simulate', 'querystring']});