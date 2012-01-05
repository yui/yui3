var toArray = Y.Array,
    YLang   = Y.Lang,
    isString = YLang.isString,
    isArray  = YLang.isArray,
    isObject = YLang.isObject,
    isNumber = YLang.isNumber,
    arrayIndex = Y.Array.indexOf,
    Mutable;

/**
Adds mutation convenience methods to `Y.DataTable` (or other built class).

@module datatable-mutation
@class DataTable.Mutation
@for DataTable
**/

Y.namespace('DataTable').Mutable = Mutable = function () {};

Y.mix(Mutable.prototype, {
    /**
    Adds the column configuration to the DataTable's `columns` configuration.
    If the `index` parameter is supplied, it is injected at that index.  If the
    table has nested headers, inject a subcolumn by passing an array of indexes
    to identify the new column's final location.

    The `index` parameter is required if adding a nested column.

    This method is a convienience method for fetching the DataTable's `columns`
    attribute, updating it, and calling 
    `table.set('columns', _updatedColumnsDefs_)`

    @example
    // Becomes last column
    table.addColumn('name');

    // Inserted after the current second column, moving the current third column
    // to index 4
    table.addColumn({ key: 'price', formatter: currencyFormatter }, 2 );

    // Insert a new column in a set of headers three rows deep.  The index array
    // translates to
    // [ 2, --  in the third column's children
    //   1, --  in the second child's children
    //   3 ] -- as the fourth child column
    table.addColumn({ key: 'age', sortable: true }, [ 2, 1, 3 ]);
    **/
    addColumn: function (config, index) {
        if (isString(config)) {
            config = { key: config };
        }

        if (config) {
            if (arguments.length < 2 || (!isNumber(index) && !isArray(index))) {
                index = this.get('columns').length;
            }

            this.fire('addColumn', {
                column: config,
                index: index
            });
        }
        return this;
    },

    modifyColumn: function (name, config) {
        if (isString(config)) {
            config = { key: config };
        }

        if (isObject(config)) {
            this.fire('modifyColumn', {
                column: name,
                newColumnDef: config
            });
        }

        return this;
    },

    moveColumn: function (name, index) {
        if (name && (isNumber(index) || isArray(index))) {
            this.fire('moveColumn', {
                column: name,
                index: index
            });
        }

        return this;
    },

    removeColumn: function (name) {
        if (name) {
            this.fire('removeColumn', {
                column: name
            });
        }

        return this;
    },

    addRow: function () {
        if (this.data) {
            this.data.add.apply(this.data, arguments);
        }

        return this;
    },

    removeRow: function (id) {
        var modelList = this.data,
            model;

        // TODO: support removing via DOM element. This should be relayed to View
        if (isObject(id) && id instanceof this.get('recordType')) {
            model = id;
        } else if (modelList && id !== undefined) {
            model = modelList.getById(id) ||
                    modelList.getByClientId(id) ||
                    modelList.item(id);
        }

        if (model) {
            modelList.remove.apply(modelList,
                [model].concat(toArray(arguments, 1, true)));
        }

        return this;
    },

    modifyRow: function (id, data) {
        var modelList = this.data,
            model;

        if (isObject(id) && id instanceof this.get('recordType')) {
            model = id;
        } else if (modelList && id !== undefined) {
            model = modelList.getById(id) ||
                    modelList.getByClientId(id) ||
                    modelList.item(id);
        }

        if (model && isObject(data)) {
            model.setAttrs.apply(model, toArray(arguments, 1, true));
        }

        return this;
    },

    reset: function (data) {
        if (this.data) {
            this.data.reset.apply(this.data, arguments);
        }

        return this;
    },

    // --------------------------------------------------------------------------
    // Protected properties and methods
    // --------------------------------------------------------------------------

    _defAddColumnFn: function (e) {
        var index   = toArray(e.index),
            columns = this.get('columns'),
            cols    = columns,
            i, len;

        for (i = 0, len = index.length - 1; cols && i < len; ++i) {
            cols = cols[index[i]] && cols[index[i]].children;
        }

        if (cols) {
            cols.splice(index[i], 0, e.column);

            this.set('columns', columns, { originEvent: e });
        } else { Y.log('addColumn index not findable', 'warn', 'datatable');
        }
    },

    _defModifyColumnFn: function (e) {
        var columns = this.get('columns'),
            column  = this.getColumn(e.column);

        if (column) {
            Y.mix(column, e.newColumnDef, true);
            
            this.set('columns', columns, { originEvent: e });
        } else { Y.log('Could not locate column index to modify column', 'warn', 'datatable');
        }
    },

    _defMoveColumnFn: function (e) {
        var columns = this.get('columns'),
            column  = this.getColumn(e.column),
            toIndex = toArray(e.index),
            fromCols, fromIndex, toCols, i, len;

        if (column) {
            fromCols  = column.parent ? column.parent.children : columns;
            fromIndex = arrayIndex(fromCols, column);

            if (fromIndex > -1) {
                toCols = columns;

                for (i = 0, len = toIndex.length - 1; toCols && i < len; ++i) {
                    toCols = toCols[i] && toCols[i].children;
                }

                if (toCols) {
                    fromCols.splice(fromIndex, 1);
                    toCols.splice(toIndex[i], 1, column);

                    this.set('columns', columns, { originEvent: e });
                } else { Y.log('Column [' + e.column + '] could not be moved. Destination index invalid for moveColumn', 'warn', 'datatable');
                }
            }
        } else { Y.log('Column [' + e.column + '] not found for moveColumn', 'warn', 'datatable');
        }
    },

    _defRemoveColumnFn: function (e) {
        var columns = this.get('columns'),
            column  = this.getColumn(e.column),
            cols, index;

        if (column) {
            cols = column.parent ? column.parent.children : columns;
            index = Y.Array.indexOf(cols, column);

            if (index > -1) {
                cols.splice(index, 1);

                this.set('columns', columns, { originEvent: e });
            }
        } else { Y.log('Could not locate column [' + e.column + '] for removeColumn', 'warn', 'datatable');
        }
    },

    initializer: function () {
        this.publish({
            addColumn:    { defaultFn: this._defAddColumnFn },
            removeColumn: { defaultFn: this._defRemoveColumnFn },
            moveColumn:   { defaultFn: this._defMoveColumnFn },
            modifyColumn: { defaultFn: this._defModifyColumnFn }
        });
    }
});

Mutable.prototype.addRows = Mutable.prototype.addRow;

// Add feature APIs to public Y.DataTable class
Y.Base.mix(Y.DataTable, [Mutable]);
