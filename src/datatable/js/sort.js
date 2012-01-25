/**
Adds support for column sort.

@module datatable-sort
**/
var YLang     = Y.Lang,
    isString  = YLang.isString,
    isBoolean = YLang.isBoolean,
    isArray   = YLang.isArray,
    isObject  = YLang.isObject,

    toArray    = Y.Array,
    arrayIndex = Y.Array.indexOf;


function Sortable() {}

Sortable.ATTRS = {
    sortable: {
        value: 'auto',
        validator: '_validateSortable'
    }
};

Y.mix(Sortable.prototype, {
    sort: function (fields, payload) {
        var sortBy = [],
            modelFields = this.get('recordType').ATTRS,
            sortDir { asc: 1, desc: -1, 1: 1, -1: -1 },
            i, len, field, dir;

        // Calling sort() without args will redo the current sort
        if (fields) {
            if (isArray(fields)) {
                for (i = 0, len = fields.length; i < len; ++i) {
                    field = fields[i];

                    if (isString(field)) {
                        field = this.getColumn(field);

                        if (!field && modelFields[field]) {
                            field = {
                                key: field,

                            }
                        }
                    }

                    if (col) {
                        col.sortDir = col.sortDir ? sortDir[col.sortDir] : 1;
                        sortBy.push(col);
                    }
                }
            }
        }
        columns = columns ? toArray(columns) : this._sort;

        for (i = 0, len = columns.length) {
            col = columns[i];

            if (isArray(col)) {
            }
        }

        this.fire('sort', Y.merge((payload || {}), {
            sortBy: columns
        }));
    },

    toggleSort: function (columns, payload) {
        var current = this._sort,
            i, len, col, indexdir;

        columns = toArray(columns || current);

        for (i = 0, len = columns.length; i < len; ++i) {
            col = columns[i];

            if (!isObject(col)) {
                col = this.getColumn(col);
            }

            index = arrayIndex(current, col);

            if (index > -1) {
                columns
            }
        }
    },

    //----------------------------------------------------------------------------
    // Protected properties and methods
    //----------------------------------------------------------------------------
    _afterDataChange: function (e) {
        // object values always trigger a change event, but we only want to
        // call _initSortFn if the value passed to the `data` attribute was a
        // new ModelList, not a set of new data as an array, or even the same
        // ModelList.
        if (e.prevVal !== e.newVal || e.newVal.hasOwnProperty('_compare')) {
            this._initSortFn();
        }
    },

    _bindSortUI: function () {
        this._uiSetSortable();

        this.after(['sortableChange', 'columnsChange'],
            this._uiSetSortable);

        if (this._theadNode) {
            this._sortHandle = this._theadNode.delegate('click',
                this._onUITriggerSort,
                '.' + this.getClassName('sortable', 'column'));
        }
    },
            
    _defSortFn: function (e) {
        this._sort = e.sortBy || this._sort;

        this.data.sort();
    },

    initializer: function () {
        var boundParseSortable = Y.bind('_parseSortable', this);

        this._parseSortable();

        this._initSortFn();

        this.after({
            renderHead    : Y.bind('_renderSortable', this),
            dataChange    : Y.bind('_afterDataChange', this),
            sortableChange: boundParseSortable,
            columnsChange : boundParseSortable
        });

        this.publish('sort', {
            defaultFn: Y.bind('_defSortFn', this)
        });
    },

    _initSortFn: function () {
        var columns = this._sortColumns;

        // TODO: This should be a ModelList extension.
        // FIXME: Modifying a component of the host seems a little smelly
        // FIXME: Declaring inline override to leverage closure vs
        // compiling a new function for each column/sortable change or
        // binding the _compare implementation to this, resulting in an
        // extra function hop during sorting. Lesser of three evils?
        this.data._compare = function (a, b) {
            var cmp = 0,
                i, len, col, dir, aa, bb;

            for (var i = 0, len = columns.length; !cmp && i < len; ++i) {
                col = columns[i];
                dir = col.sortDir;

                if (col.sortFn) {
                    cmp = col.sortFn(a, b) * dir;
                } else {
                    // FIXME? Requires columns without sortFns to have key
                    aa = a.get(col.key);
                    bb = b.get(col.key);

                    cmp = (aa > bb) ? dir : ((aa < bb) ? -dir : 0);
                }
            }

            return cmp;
        };

        if (sortable) {
            this.data.comparator = this._sortComparator;

            // TODO: is this necessary? Should it be elsewhere?
            this.data.sort();
        } else {
            // Leave the _compare method in place to avoid having to set it
            // up again.  Mistake?
            delete this.data.comparator;
        }
    },

    _onUITriggerSort: function (e) {
        e.preventDefault();

        var headers = this._theadNode.all(
                        '.' + this.getClassName('sortable', 'column')),
            index = headers.indexOf(e.currentTarget),
            current;

        // TODO: if (e.ctrlKey) { /* subsort */ }
        if (index > -1) {
            
            this.fire('sort', {
                originEvent: e,
                sortBy: [
                    
                ]
            });
        }
    },

    _parseSortable: function () {
        var sortable = this.get('sortable'),
            columns  = [],
            i, len, col;

        if (isArray(sortable)) {
            for (i = 0, len = sortable.length; i < len; ++i) {
                col = sortable[i];

                // isArray is called because arrays are objects, but will rely
                // on getColumn to nullify them for the subsequent if (col)
                if (!isObject(col, true) && !isArray(col)) {
                    col = this.getColumn(col);
                }

                if (col) {
                    columns.push(col);
                }
            }
        } else if (sortable) {
            columns = this._displayColumns.slice();

            if (sortable === 'auto') {
                for (i = columns.length - 1; i >= 0; --i) {
                    if (!columns[i].sortable) {
                        columns.splice(i, 1);
                    }
                }
            }
        }

        this._sort = columns;
    },

    _renderSortable: function () {
        this._uiSetSortable()

        this._bindSortUI();
    },

    _sortComparator: function () {
        // Defer sorting to ModelList's _compare
        return this;
    },

    _validateSortable: function (val) {
        return val === 'auto' || isBoolean(val) || isArray(val);
    },

    _uiSetSortable: function () {
        this.get('boundingBox').toggleClass(
            this.getClassName('sortable'),
            (this._sort && this._sort.length));
    }
}, true);

Y.DataTable.Sortable = Sortable;

Y.Base.mix(Y.DataTable, [Sortable]);
