/**

new Y.DataTable({

    columns: [ Y.DataTable.Expand.key, 'isbn', 'title', 'author'],

    data: [
        { isbn: '', title: '', author: '', qty: '', price: '' },
        { isbn: '', title: '', author: '', qty: '', price: '', __expanded: true },
        { isbn: '', title: '', author: '', qty: '', price: '' }
    ],

    expandable: true,

    expandColumns: ['price', 'qty', {
        key: 'total',
        formatter: function (o) {
            var data = o.data;

            return Y.Intl.NumberFormat(data.price * data.qty, { style: 'currency' });
        }
    }],

    expandTemplate: '<div>Price: {price}<br>Qty: {qty}<hr>Total: {total}</div>'

});

When collapsing a row, the child row does not get removed, it is only hidden.

Listen for data changes to update all expanded child rows and remove all hidden child rows.

Child rows will take the width of the table starting with the cell to the right of expand column.


<tr rowspan="[num_of_columns]">[template]</tr> is used.
[template] is determined on the existance of expandTemplate,
if it does not exist <table><tr>{{#cells}}<td>{{value}}</td>{{/cells}}</tr></table> is used.

expandColumns is used to create a new tabled row, (create headers for this table?)

expandTemplate is used to create a formated HTML node to customize the look of the expanded row.

if expandColumns and expandTemplate is used, the formatter for the cells is used inplace of the default cell value

*/

Expand = function () {};

Expand.key = '__dt-expand__';

Expand.ATTRS = {
    expandable: {
        value: false
    },

    expandColumns: {

    },

    expandTemplate: {
        value: '<table><tr>{{#cells}}<td>{{value}}</td>{{/cells}}</tr></table>',
        setter: function (val) {
            if (Object.prototype.toString.call(val) !== '[object Function]') {
                //try to make `val` a template function by identifying whether Micro or Handlebars is used.

                // otherwise return a function that uses Y.Lang.sub
                return function (obj) {
                    return Y.Lang.sub(val, obj);
                }
            }

            return val;
        }
    }
};

Y.mix(Expand.prototype, {

    // this should generally be the open/close indicator
    columnTemplate: '',

    // template used to wrap the expand template
    expandRowTemplate: '<tr colspan="{numColumns}">{expandTemplate}</tr>',

    initializer: function () {
        this.after('renderView', Y.bind('_syncExpandUI', this));
    },

    _syncExpandUI: function () {
        // loop each row > expandColumn cell .setHTML(columnTemplate)
    },

    _expandClick: function (e) {
        // toggle row expansion
        if (open) {
            this._expandHideRow(e);
        } else {
            this._expandShowRow(e);
        }
    },

    _expandShowRow: function (e) {
        // if no row exists, use this._expandAddRow()
    },

    _expandAddRow: function (e) {

    },

    _expandHideRow: function (e) {

    }


});

Y.namespace(DataTable).Expand = Expand;

if (Y.Lang.isFunction(Y.DataTable)) {
    Y.Base.mix(Y.DataTable, [ Expand ]);
}
