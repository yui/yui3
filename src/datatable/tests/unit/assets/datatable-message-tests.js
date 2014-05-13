YUI.add('datatable-message-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Message");

suite.add(new Y.Test.Case({
    name: "lifecycle and instantiation",

    "Y.DataTable should be augmented": function () {
        Y.Assert.isTrue(
            new Y.DataTable().hasImpl(Y.DataTable.Message));
    },

    "Y.DataTable.Base should not be augmented": function () {
        Y.Assert.isFalse(
            new Y.DataTable.Base().hasImpl(Y.DataTable.Message));
    },

    "Y.DataTable constructor should not error": function () {
        var table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}]
        });

        Y.Assert.isInstanceOf(Y.DataTable, table);
        Y.Assert.isTrue(table.hasImpl(Y.DataTable.Message));
    },

    "test showMessaegs values": function () {
        var config = {
                columns: ['a'],
                data: [{a:1}]
            }, table;

        table = new Y.DataTable(config);

        Y.Assert.isTrue(table.get('showMessages'));

        config.showMessages = false;
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('showMessages'));

        config.showMessages = true;
        table = new Y.DataTable(config);

        Y.Assert.isTrue(table.get('showMessages'));

        config.showMessages = 'bogus';
        table = new Y.DataTable(config);

        Y.Assert.isTrue(table.get('showMessages'));

        config.showMessages = { create: true, update: true, 'delete': false };
        table = new Y.DataTable(config);

        Y.Assert.isTrue(table.get('showMessages'));
    },

    "test set('showMessages')": function () {
        var table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}]
            });

        Y.Assert.isTrue(table.get('showMessages'));

        table.set('showMessages', false);
        Y.Assert.isFalse(table.get('showMessages'));

        table.set('showMessages', true);
        Y.Assert.isTrue(table.get('showMessages'));

        table.set('showMessages', 'empty');
        Y.Assert.isTrue(table.get('showMessages'));

        table.set('showMessages', { empty: true, loading: false });
        Y.Assert.isTrue(table.get('showMessages'));
    }
}));
suite.add(new Y.Test.Case({
    name: "datatable-message",

    "test showMessage(false)": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
                data: [{a:1,b:2}]
            }),
            msg = 'showMessage';

        table.render();

        table.showMessage(msg);

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        // showing a `false` message should hide the message node, but not
        // modify any existing nodes
        table.showMessage(false);

        Y.Assert.isFalse(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        table.destroy();
    },

    "test showMessage(string)": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
                data: [{a:1,b:2}]
            }),
            msg = 'showMessage';

        table.render();

        table.showMessage(msg);

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        table.destroy();
    },

    "test showMessage(intlString)": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
                data: [{a:1,b:2}]
            }),
            msg = table.getString('emptyMessage');

        table.render();

        table.showMessage('emptyMessage');

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        table.destroy();
    },

    "test hideMessage()": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
                data: [{a:1,b:2}]
            }),
            msg = table.getString('emptyMessage');

        table.render();

        table.showMessage('emptyMessage');

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        // hide message should only remove the class, not the node, or node contents
        table.hideMessage();

        Y.Assert.isFalse(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        table.destroy();
    },

    "adding rows should hide the message": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
                data: []
            }),
            msg = table.getString('emptyMessage');

        table.render();

        table.showMessage('emptyMessage');

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        // setting data should call hideMessage() and not destroy the node or node content
        table.set('data', [{a:1,b:2}]);

        Y.Assert.isFalse(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        table.destroy();
    },

    "removing all rows should show the emptyMessage": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
                data: []
            }),
            loadMsg = table.getString('loadingMessage'),
            emptyMsg = table.getString('emptyMessage');

        table.render();

        table.showMessage('loadingMessage');

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(loadMsg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        // setting data should call hideMessage() and not destroy the node or node content
        table.set('data', [{a:1,b:2}, {a:11,b:12}, {a:21,b:22}]);

        Y.Assert.isFalse(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(loadMsg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        // setting data should call hideMessage() and not destroy the node or node content
        table.set('data', []);

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(emptyMsg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        table.destroy();
    },

    "calling showMessage when messages are disabled": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
                data: [],
                showMessages: false
            }),
            loadMsg = table.getString('loadingMessage');

        table.render();

        table.showMessage('loadingMessage');

        Y.Assert.isFalse(table.get('boundingBox').hasClass(table._messageVisibleClass));

        // node should exist because it was initialized, but it should be empty
        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame('', table._messageNode.one('.' + table._messageContentClass).get('text'));

        table.destroy();
    },

    "test changing column length to update width of message": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
            }),
            msg = table.getString('emptyMessage');

        table.render();

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        Y.Assert.areSame(2, table._messageNode.one('.' + table._messageContentClass).get('colSpan'));

        Y.Assert.areSame(table.get('columns').length, table._messageNode.one('.' + table._messageContentClass).get('colSpan'));

        table.set('columns', ['a', 'b', 'c', 'd']);

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(msg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        Y.Assert.areSame(4, table._messageNode.one('.' + table._messageContentClass).get('colSpan'));

        Y.Assert.areSame(table.get('columns').length, table._messageNode.one('.' + table._messageContentClass).get('colSpan'));

        table.destroy();
    },

    "test changing the showMessages": function () {
        var table = new Y.DataTable({
                columns: ['a','b'],
                data: []
            }),
            loadMsg = table.getString('loadingMessage'),
            emptyMsg = table.getString('emptyMessage');

        table.render();

        table.showMessage('loadingMessage');

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(loadMsg, table._messageNode.one('.' + table._messageContentClass).get('text'));

        table.set('showMessages', false);

        Y.Assert.isFalse(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNull(table._messageNode);

        table.set('showMessages', true);

        Y.Assert.isTrue(table.get('boundingBox').hasClass(table._messageVisibleClass));

        Y.Assert.isNotNull(table._messageNode);

        Y.Assert.areSame(emptyMsg, table._messageNode.one('.' + table._messageContentClass).get('text'));

    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-message', 'test']});
