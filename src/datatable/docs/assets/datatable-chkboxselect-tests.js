YUI.add('datatable-chkboxselect-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-chkboxselect example test suite'),
        Assert = Y.Assert;

        /** this sets the constrain checkbox to checked or not
         * The example code looks for chkbox.on('click')... attr checked == true
         * IE doesn't set attr checked with a click
         * In non-IE, if you set checked to true then also click it checked == false (it seems)
         * @param expectedState Boolean
         */
        var clickCheckbox = function(checkbox, expectedState) {

            if (Y.UA.ie && Y.UA.ie < 9) {
                checkbox.set("checked", expectedState);
            } else {
                // Just in case it's already at that state, and the test wants to flip it with the click
                if (checkbox.get("checked") === expectedState) {
                    checkbox.set("checked", !expectedState);
                }
            }
            checkbox.simulate("click");
        }


    var tableSelector = '#dtable ',
        th = Y.all(tableSelector + 'th'),
        td = Y.all(tableSelector + 'td'),
        tr = Y.all(tableSelector + 'tr');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test populating with HTML table': function() {

            Assert.areEqual(8, th.size(), ' - Wrong number of th');
            Assert.isTrue((td.size() > 20), ' - Wrong number of td');
            Assert.isTrue((tr.size() > 10), ' - Wrong number of tr');
            Assert.isTrue((tr.item(3).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.isTrue((td.item(0).getHTML().indexOf('checkbox') > -1), ' - Failed to insert input HTML');
        },
        'test selecting and processing': function() {
            clickCheckbox(td.item(0).one('input'), true);
            //clickCheckbox(td.item(4).one('input'), true);   // I don't know why this one doesn't work
            Y.one('#btnSelected').simulate('click');
            Assert.isTrue((Y.one('#processed').getHTML().indexOf('Record index = 0 Data = 20 : FTP_data') > -1), ' - Failed to process checkbox selection');
        },
        'test clearing selection': function() {
            Y.one('#btnClearSelected').simulate('click');
            Assert.isTrue((Y.one('#processed').getHTML().indexOf('(None)') > -1), ' - Failed to clear checkbox selection');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
