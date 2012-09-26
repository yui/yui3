YUI.add('panel-form-tests', function (Y) {

var Assert = Y.Assert,

    addSelector         = '#addRow',
    productIdSelector   = '#productId',
    nameSelector        = '#name',
    priceSelector       = '#price',
    nestedPanelSelector = '#nestedPanel',

    panel = Y.one('.yui3-panel'),
    table = Y.one('#dt table'),
    suite = new Y.Test.Suite('Todo List Example App Suite');

suite.add(new Y.Test.Case({
    name: 'Example Tests',

    'Panel should be rendered in the DOM': function () {
        Assert.isNotNull(panel, 'Panel node was not found.');
        Assert.isTrue(Y.one('body').contains(panel), 'Panel is not a descendant of the <body>');
    },

    'Panel should be hidden': function () {
        Assert.isTrue(panel.hasClass('yui3-panel-hidden'), 'Panel does not have the hidden CSS class.');
        Assert.areSame('hidden', panel.getStyle('visibility'), 'Panel does have a `visibility` of `hidden`.');
    },

    'Clicking the "Add" button should show the panel': function () {
        var button = Y.one(addSelector);

        Assert.isNotNull(button, '"Add" button was not found.');

        button.simulate('click');

        Assert.isFalse(panel.hasClass('yui3-panel-hidden'), 'The hidden CSS class was not removed from the panel.');
        Assert.areSame('visible', panel.getStyle('visibility'), 'Panel does have a `visibility` of `visible`.');
    },

    'Pressing esc should hide the panel': function () {
        panel.one('.yui3-panel-content').simulate('keydown', {keyCode: 27});

        Assert.isTrue(panel.hasClass('yui3-panel-hidden'), 'Panel does not have the hidden CSS class.');
        Assert.areSame('hidden', panel.getStyle('visibility'), 'Panel does have a `visibility` of `hidden`.');
    },

    'Clicking "Add Item" should add it to the table': function () {
        var numRows = table.all('tbody tr').size(),
            lastRow;

        Y.one(addSelector).simulate('click');
        Y.one(productIdSelector).set('value', '1');
        Y.one(nameSelector).set('value', 'Foo');
        Y.one(priceSelector).set('value', '$1.00');

        panel.one('.yui3-widget-ft button').simulate('click');
        numRows += 1;

        lastRow = table.one('tbody').get('lastChild');

        Assert.areSame(numRows, table.all('tbody tr').size(), 'Number of rows did not change.');
        Assert.areSame('1', lastRow.one('td').get('text'), 'Row was not added to table.');
    },

    'Clicking "Remove All Items" should remove all rows from the table': function () {
        var nestedPanel;

        Y.one(addSelector).simulate('click');

        panel.one('.yui3-widget-ft button').next().simulate('click');

        nestedPanel = Y.one(nestedPanelSelector).one('.yui3-panel');

        Assert.isFalse(nestedPanel.hasClass('yui3-panel-hidden'), 'The hidden CSS class was not removed from the nested panel.');
        Assert.areSame('visible', nestedPanel.getStyle('visibility'), 'Nested panel does have a `visibility` of `visible`.');

        nestedPanel.one('.yui3-widget-ft button').simulate('click');

        Assert.areSame(0, table.all('tbody tr').size(), 'The table still has rows.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['node', 'node-event-simulate', 'widget']
});

