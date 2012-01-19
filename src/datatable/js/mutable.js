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

Column mutation methods are paired with new custom events:

 * addColumn
 * removeColumn
 * modifyColumn
 * moveColumn

Row mutation events are bubbled from the DataTable's `data` ModelList through
the DataTable instance.

@module datatable-mutable
@class DataTable.Mutable
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

    @method addColumn
    @param {Object|String} config The new column configuration object
    @param {Number|Number[]} [index] the insertion index
    @return {DataTable}
    @chainable
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

    /**
    Updates an existing column definition. Fires the `modifyColumn` event.

    @example
    // Add a formatter to the existing 'price' column definition
    table.modifyColumn('price', { formatter: currencyFormatter });

    // Change the label on a header cell in a set of nested headers three rows
    // deep.  The index array translates to
    // [ 2,  -- in the third column's children
    //   1,  -- the second child
    //   3 ] -- the fourth child column
    table.modifyColumn([2, 1, 3], { label: 'Experience' });

    @method modifyColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @param {Object} config The new column configuration properties
    @return {DataTable}
    @chainable
    **/
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

    /**
    Moves an existing column to a new location. Fires the `moveColumn` event.

    The destination index can be a number or array of numbers to place a column
    header in a nested header row.

    @method moveColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @param {Number|Number[]} index The destination index of the column
    @return {DataTable}
    @chainable
    **/
    moveColumn: function (name, index) {
        if (name && (isNumber(index) || isArray(index))) {
            this.fire('moveColumn', {
                column: name,
                index: index
            });
        }

        return this;
    },

    /**
    Removes an existing column. Fires the `removeColumn` event.

    @method removeColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @return {DataTable}
    @chainable
    **/
    removeColumn: function (name) {
        if (name) {
            this.fire('removeColumn', {
                column: name
            });
        }

        return this;
    },

    /**
    Adds a new record to the DataTable's `data` ModelList.  Record data can be
    an object of field values or an instance of the DataTable's configured
    `recordType` class.

    This relays all parameters to the `data` ModelList's `add` method.

    @method addRow
    @param {Object} data The data or Model instance for the new record
    @return {DataTable}
    @chainable
    **/
    addRow: function () {
        if (this.data) {
            this.data.add.apply(this.data, arguments);
        }

        return this;
    },

    /**
    Removes a record from the DataTable's `data` ModelList.  The record can be
    provided explicitly or targeted by it's `id` (see ModelList's `getById`
    method), `clientId`, or index in the ModelList.

    After locating the target Model, this relays the Model and all other passed
    arguments to the `data` ModelList's `remove` method.

    @method removeRow
    @param {Object|String|Number} id The Model instance or identifier 
    @return {DataTable}
    @chainable
    **/
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

    /**
    Updates an existing record in the DataTable's `data` ModelList.  The record
    can be provided explicitly or targeted by it's `id` (see ModelList's
    `getById` method), `clientId`, or index in the ModelList.

    After locating the target Model, this relays the all other passed
    arguments to the Model's `setAttrs` method.

    @method modifyRow
    @param {Object|String|Number} id The Model instance or identifier 
    @return {DataTable}
    @chainable
    **/
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

    // --------------------------------------------------------------------------
    // Protected properties and methods
    // --------------------------------------------------------------------------

    /**
    Default function for the `addColumn` event.

    Inserts the specified column at the provided index.

    @method _defAddColumnFn
    @param {EventFacade} e The `addColumn` event
        @param {Object} e.column The new column definition object
        @param {Number|Number[]} e.index The array index to insert the new column
    @protected
    **/
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

    /**
    Default function for the `modifyColumn` event.

    Mixes the new column properties into the specified column definition.

    @method _defModifyColumnFn
    @param {EventFacade} e The `modifyColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
        @param {Object} e.newColumnDef The properties to assign to the column
    @protected
    **/
    _defModifyColumnFn: function (e) {
        var columns = this.get('columns'),
            column  = this.getColumn(e.column);

        if (column) {
            Y.mix(column, e.newColumnDef, true);
            
            this.set('columns', columns, { originEvent: e });
        } else { Y.log('Could not locate column index to modify column', 'warn', 'datatable');
        }
    },

    /**
    Default function for the `moveColumn` event.

    Removes the specified column from its current location and inserts it at the
    specified array index (may be an array of indexes for nested headers).

    @method _defMoveColumnFn
    @param {EventFacade} e The `moveColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
        @param {Object} e.index The destination index to move to
    @protected
    **/
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

    /**
    Default function for the `removeColumn` event.

    Splices the specified column from its containing columns array.

    @method _defRemoveColumnFn
    @param {EventFacade} e The `removeColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
    @protected
    **/
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

    /**
    Publishes the events used by the mutation methods:

     * addColumn
     * removeColumn
     * modifyColumn
     * moveColumn

    @method initializer
    @protected
    **/
    initializer: function () {
        this.publish({
            addColumn:    { defaultFn: Y.bind('_defAddColumnFn', this) },
            removeColumn: { defaultFn: Y.bind('_defRemoveColumnFn', this) },
            moveColumn:   { defaultFn: Y.bind('_defMoveColumnFn', this) },
            modifyColumn: { defaultFn: Y.bind('_defModifyColumnFn', this) }
        });
    }
});

/**
Adds an array of new records to the DataTable's `data` ModelList.  Record data
can be an array of objects containing field values or an array of instance of
the DataTable's configured `recordType` class.

This relays all parameters to the `data` ModelList's `add` method.

Technically, this is an alias to `addRow`, but please use the appropriately
named method for readability.

@method addRows
@param {Object[]} data The data or Model instances to add
@return {DataTable}
@chainable
**/
Mutable.prototype.addRows = Mutable.prototype.addRow;

// Add feature APIs to public Y.DataTable class
if (YLang.isFunction(Y.DataTable)) {
    Y.Base.mix(Y.DataTable, [Mutable]);
}

/**
Fired by the `addColumn` method.

@event addColumn
@preventable _defAddColumnFn
@param {Object} column The new column definition object
@param {Number|Number[]} index The array index to insert the new column
**/

/**
Fired by the `removeColumn` method.

@event removeColumn
@preventable _defRemoveColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
**/

/**
Fired by the `modifyColumn` method.

@event modifyColumn
@preventable _defModifyColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
@param {Object} newColumnDef The properties to assign to the column
**/

/**
Fired by the `moveColumn` method.

@event moveColumn
@preventable _defMoveColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
@param {Object} index The destination index to move to
**/

