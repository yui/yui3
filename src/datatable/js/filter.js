/**
Adds the ability to filter rows in the DataTable using the ModelList filter
method.

@module datatable
@submodule datatable-filter
@since @SINCE@
**/

var AS_LIST = { asList: true };


/**
Filters can be applied as a single value, a range, an array, or a
regular expression. Multiple filters can be applied and will be applied in
order. Custom filters can be added by supplying a custom filter function.

###Single Value###
```
dt.filter('qty', 10);
```

###Range###
```
dt.filter('qty', 10, 20);
```

###Array###
```
dt.filter('qty', [10, 12, 14, 16]);
```

###Regular Expression###
```
dt.filter('name', /able/);
```

###Custom Filter###
```
dt.filter(function(row){
    var name = row.get('name'),
        qty = row.get('qty');

    // name should contain "able" OR the quantity should be between 10 and 20
    return /able/.test(name) || (qty >= 10 && qty <= 20);
});

```
@class DataTable.Filter

**/
function Filter() {}

Filter.ATTRS = {
    /**
     A ModelList of filtered data. If no filters are applied, this attribute is `null`.
     @since @SINCE@
     @attribute filteredData
     @type {ModelList, null}
     @readonly
     */
    filteredData: {
        getter: '_getFilteredData',
        readOnly: true
    }
};

Y.mix(Filter.prototype, {
    /**
     An Array consiting of functions to apply as filters
     @since @SINCE@
     @protected
     @property _filters
     @type {Array}
     */
    //_filters: null,


    /**
     A ModelList of filtered data. If no filters are applied, this property is `null`.
     @since @SINCE@
     @protected
     @property _filteredData
     @type {ModelList, null}
     */
    //_filteredData: null,

    /**
     @method initializer
     */
    initializer: function () {
        this._state.data.data.getter = '_alternativeDataGetter';
    },

    /**
     Removes all the _filters and destroys the _filtereData ModelList. After
     these internal properties are destroyed, this will fire the `dataChange`
     event to notify applications there was a change in the data. You can
     supply `true` as the first parameter to prevent the `dataChange` from firing.
     @since @SINCE@
     @method clearFilters
     @param {Boolean} [mute]
     */
    clearFilters: function (mute) {
        this._filters = [];
        this._filteredData = null;

        if (mute !== true) {
            this._fireDataChange();
        }
    },

    /**
     If no parameters are provided, will pass through to `applyFilter` and
     run the first filter, if it exists.

     If any parameter is provided the following process will occur.
      - all the filters will be removed with `clearFilters`
      - a new filter will be created and added to the _filters Array with `addFilter`
      - the filter will be applied with `applyFilter`

     As such, all parameters, if provided, should match the requirement of
     `addFilter`. If a custom filter is being added, you need only provide that
     function as `colKey`.

     @since @SINCE@
     @method filter
     @param {String, Function} [colKey]
     @param {String, Number, Array, RegExp} [match]
     @param {String, Number} [matchMax]
     @param {Boolean} [useFormatter]
     @return {ModelList} ModelList containing filtered records
     */
    filter: function (/*colKey, match, matchMax, useFormatter*/) {
        if (arguments.length === 0) {
            return this.applyFilter();

        } else {
            this.clearFilters(true);

            this.addFilter.apply(this, arguments);

            return this.applyFilter();
        }
    },

    /**
     Adds a filter to the _filters Array. If `colKey` is a function, this
     function is added to the _filters array without any calculations. Otherwise
     the parameters are passed through to the `_addFilter` method and a filter
     function is created and added to the _filters Array.

     To create your own filter function to pass add, it needs to follow the
     `ModelList` filter criteria.

     @since @SINCE@
     @method addFilter
     @param {String, Function} colKey
     @param {String, Number, Array, RegExp} [match]
     @param {String, Number} [matchMax]
     @param {Boolean} [useFormatter]
     */
    addFilter: function (colKey/*, match, matchMax, useFormatter*/) {
        // if the colKey is actually a function, assume it is the filter function and add it
        if ({}.toString.call(colKey) === '[object Function]') {
            this._filters.push(colKey);
        } else {
            this._addFilter.apply(this, arguments);
        }
    },

    /**
     Removes the filter at the provided positoin or the first of the filters
     in the array. If any filters are removed, the remainging filters are reran
     @since @SINCE@
     @method removeFilter
     @param {Number} [pos] Position of the filter to remove
     @return {ModelList, null} ModelList of filtered items
     */
    removeFilter: function (pos) {
        // removes the filter at the provided position or the first filter
        var removed = this._filters.splice(parseInt(pos || 0, 10), 1);

        if (removed.length) {
            // filter using fresh data
            this._filteredData = null;

            // returns filtered ModelList
            return this.applyFilters();
        }

        return null;
    },

    /**
     Applies the first filter or, if provided, the filter at the specified
     location. This will fire the `dataChange` event as well as return a
     ModelList of filtered data.
     @since @SINCE@
     @method applyFilter
     @param {Number} [pos] Positoin of filter to apply
     @return {ModelList} ModelList containing filtered records
     */
    applyFilter: function (pos) {
        var filtered = this.get('data'),
            filter = (this._filters || [])[pos || 0];

        if (filter) {
            filtered = filtered.filter(AS_LIST, filter);
            this._filteredData = filtered;
        }

        this._fireDataChange();

        return filtered;
    },

    /**
     Applies all the filters in the order they were added. This will fire the
     `dataChange` event as well as return a ModelList of filtered data.
     @since @SINCE@
     @method applyFilters
     @return {ModelList} ModelList containing filtered records
     */
    applyFilters: function () {
        var filtered = this.get('data'),
            filters = this._filters,
            i, len;

        for (i=0, len = filters.length; i < len; i++) {
            filtered = filtered.filter(AS_LIST, filters[i]);
        }

        this._filteredData = filtered;

        this._fireDataChange();

        return filtered;
    },

    /**
     Adds a filter function to process the data or already filtered data to
     filter it again. Filters are applied to the specified column key.

     You can filter by a variety of different ways
      - single value - `match` is either a Number or a String
      - range of values - `match` is the range minimum value and `matchMax` is
     the range maximum
      - list of values - `match` is an array of values to filter on
      - matched value - `match` is a Regular Expression that is tested on the value

     Setting `useFormatter` to true, the value will be processed through the
     column formatter then this result will be filtered. This is good for
     columns whose value is calculated rather than provided but can also be
     effective if you want to match a formatted value. Based on the number of
     rows and the complexity of the formatter this could significantly increase
     the filter and rerender time so you may want to use this with caution.

     @since @SINCE@
     @protected
     @method _addFilter
     @param {String} colKey
     @param {String, Number, Array, RegExp} match
     @param {String, Number} [matchMax]
     @param {Boolean} [useFormatter]
     */
    _addFilter: function (colKey, match, matchMax, useFormatter) {
        var matchType = {}.toString.call(match),
            col,
            formatterFn,
            formatterData,
            index = 0;

        if (useFormatter) {
            col = this.getColumn(colKey);
            formatterFn = col && col._formatterFn;
        }

        this._filters.push(function (row) {
            var val = row.get(colKey);

            if (useFormatter) {
                formatterData = {
                    value     : val,
                    data      : row.toJSON(),
                    record    : row,
                    rowIndex  : index++,
                    column    : col,
                    className : '',
                    rowClass  : ''
                };

                if (formatterFn) {
                    val = formatterFn.call(this, formatterData);
                }
            }

            if (typeof matchMax !== 'undefined') {
                // if max is defined assume it should match a range
                return val >= match && val <= matchMax;
            } else if (matchType === '[object Array]') {
                // if match is an array, only values in the array should match
                return match.indexOf(val) > -1;
            } else if (matchType === '[object RegExp]') {
                // if match is a regular expresstion, value is tested against it
                return match.test(val);
            } else {
                return val === match;
            }
        });
    },

    /**
     Defines a getter for `ATTRS.data` where it will return the filtered or
     unfiltered data.
     @since @SINCE@
     @protected
     @method _alternativeDataGetter
     @return {ModelList} ModelList containing filtered records or unchanged data
     */
    _alternativeDataGetter: function () {
        return this.get('filteredData') ||
            /* original, unfiltered data */ this._getStateVal('data');
    },

    /**
     Getter for ATTRS.filteredData. This returns the internal ModelList of
     the filtered data.
     @since @SINCE@
     @protected
     @method _getFilteredData
     @return {ModelList} ModelList containing filtered records
     */
    _getFilteredData: function () {
        return this._filteredData;
    },

    /**
     Fires the `dataChange` event with a payload reflecting whether we are
     filtering or are not filtering based on the existence of filtered data.
     Then we fire the `dataChange` event to upated other components when the
     data has been filtered or all the filters have been removed.

     @since @SINCE@
     @protected
     @method _fireDataChange
     */
    _fireDataChange: function () {
        var data = this._filteredData,
            filtering = data,
            payload = {
                src: 'filter',
                attrName: 'data'
            };

        if (filtering) {
            payload.prevVal = this._getStateVal('data');
            payload.newVal = data;
        } else {
            payload.prevVal = data;
            payload.newVal = this._getStateVal('data');
        }

        this.fire('dataChange', payload);
    }

}, true);

Y.DataTable.Filter = Filter;


Y.Base.mix(Y.DataTable, [Filter]);
