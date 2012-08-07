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

    "test showMessage()": function () {
        
    },

    "test showMessage(string)": function () {
        
    },

    "test showMessage(intlString)": function () {
        
    },

    "test hideMessage()": function () {
    },

    "adding rows should hide the message": function () {

    },

    "removing all rows should show the emptyMessage": function () {

    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-message', 'test']});
