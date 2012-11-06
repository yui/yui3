YUI.add('datatable-scroll-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-scroll example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test vertical scrolling': function() {
            var tableSelector = '#scrolling-y ',
                th = Y.all(tableSelector + 'th'),
                td = Y.all(tableSelector + 'td'),
                tr = Y.all(tableSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption'),
                scrollbar = Y.one('#scrolling-y .yui3-datatable-scrollbar');

            Assert.areEqual(4, th.size(), ' - Wrong number of th');
            Assert.isTrue((td.size() > 20), ' - Wrong number of th');
            Assert.isTrue((tr.size() > 10), ' - Wrong number of tr');
            Assert.areEqual('Y axis scrolling table', cap.getHTML(), ' - Wrong or no caption');
            Assert.isTrue((scrollbar.get('offsetHeight') > scrollbar.get('offsetWidth')), 'failed to have scrollbar-y taller than wide');
        },
        'test horizontal scrolling': function() {
            var tableSelector = '#scrolling-x ',
                th = Y.all(tableSelector + 'th'),
                td = Y.all(tableSelector + 'td'),
                tr = Y.all(tableSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption'),
                scrollbar = Y.one('#scrolling-x .yui3-datatable-x-scroller');

            Assert.areEqual(5, th.size(), ' - Wrong number of th');
            Assert.isTrue((td.size() > 20), ' - Wrong number of th');
            Assert.areEqual(8, tr.size(), ' - Wrong number of tr');
            Assert.areEqual('X axis scrolling table', cap.getHTML(), ' - Wrong or no caption');
            Assert.areEqual('scroll', scrollbar.getStyle('overflowX'), 'failed to have overflow-x: scroll');
        },
        'test horiz & vert scrolling': function() {
            var tableSelector = '#scrolling-xy ',
                th = Y.all(tableSelector + 'th'),
                td = Y.all(tableSelector + 'td'),
                tr = Y.all(tableSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption'),
                scrollbar = Y.one('#scrolling-xy .yui3-datatable-scrollbar');

            Assert.areEqual(10, th.size(), ' - Wrong number of th');
            Assert.isTrue((td.size() > 20), ' - Wrong number of th');
            Assert.isTrue((tr.size() > 20), ' - Wrong number of tr');
            Assert.areEqual('X and Y axis scrolling table', cap.getHTML(), ' - Wrong or no caption');
            Assert.areEqual('hidden', scrollbar.getStyle('overflowX'), 'failed to have overflow-x: hidden');
            Assert.areEqual('scroll', scrollbar.getStyle('overflowY'), 'failed to have overflow-Y: scroll');
            Assert.isTrue((scrollbar.get('offsetHeight') > scrollbar.get('offsetWidth')), 'failed to have scrollbar-y taller than wide');
        },
        'test percentage widths': function() {
            var tableSelector = '#scrolling-100pct ',
                th = Y.all(tableSelector + 'th'),
                td = Y.all(tableSelector + 'td'),
                tr = Y.all(tableSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption'),
                scrollbar = Y.one('#scrolling-y .yui3-datatable-scrollbar'),
                container = Y.one('#scrolling-100pct .yui3-datatable-scrollable-y');

            Assert.areEqual(4, th.size(), ' - Wrong number of th');
            Assert.isTrue((td.size() > 20), ' - Wrong number of th');
            Assert.isTrue((tr.size() > 10), ' - Wrong number of tr');
            Assert.areEqual('100% width scrolling table', cap.getHTML(), ' - Wrong or no caption');
            Assert.areEqual('100%', container.getStyle('width'), ' - Failed to find style width: 100%');
            Assert.isTrue((scrollbar.get('offsetHeight') > scrollbar.get('offsetWidth')), 'failed to have scrollbar-y taller than wide');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
