/**
Adds support for column sort.

@module datatable-sort
**/
var YLang     = Y.Lang,
    isBoolean = YLang.isBoolean,
    isArray   = YLang.isArray,
    isObject  = YLang.isObject,

    toArray     = Y.Array,
    arraySearch = Y.Array.some,

    dirMap = {
        asc : 1,
        desc: -1,
        "1" : 1,
        "-1": -1
    };


function Sortable() {}

Sortable.ATTRS = {
    // Which columns in the UI should suggest and respond to sorting interaction
    // pass an empty array if no UI columns should show sortable, but you want the
    // table.sort(...) API
    sortable: {
        value: 'auto',
        validator: '_validateSortable'
    },

    // Current sort state
    sortBy: {
        setter: '_setSortBy'
    }
};

Y.mix(Sortable.prototype, {

    sort: function (fields, payload) {
        var modelFields = this.get('recordType').ATTRS,
            sortBy      = fields ? [] : this._sort,
            i, len, name, dir, field, column;

        // Calling sort() without args will redo the current sort
        if (fields) {
            fields = toArray(fields);

            for (i = 0, len = fields.length; i < len; ++i) {
                name = sortBy[i];
                dir  = 1;

                if (isObject(name)) {
                    field = name;
                    // Have to use a for-in loop to process sort({ foo: -1 })
                    for (name in field) {
                        if (field.hasOwnProperty(name)) {
                            dir = dirMap[field[name]];
                            break;
                        }
                    }
                }

                if (name) {
                    // Allow sorting of any model field and any column
                    column = this.getColumn(name) ||
                             (modelFields[name] && { _id: name, key: name });

                    if (column) {
                        // FIXME: This updates the column configuration before the
                        // sortByChange or sort event, which could be prevented
                        column.sortDir = dir;
                        sortBy.push(column);
                    }
                }
            }
        }

        this.fire('sort', Y.merge((payload || {}), {
            sortBy: sortBy
        }));
    },

    toggleSort: function (columns, payload) {
        var sortBy = this._sort,
            i, len, j, col, index;

        if (columns) {
            columns = toArray(columns);

            for (i = 0, len = columns.length; i < len; ++i) {
                col = columns[i];
                index = -1;

                for (j = sortBy.length - 1; i >= 0; --i) {
                    if (sortBy[j]._id === col) {
                        sortBy[j].sortDir *= -1;
                        break;
                    }
                }
            }
        } else {
            for (i = 0, len = sortBy.length; i < len; ++i) {
                sortBy[i].sortDir *= -1;
            }
        }

        // FIXME: cache previous directions and publish with a preventedFn?
        this.fire('sort', Y.merge((payload || {}), {
            sortBy: sortBy
        }));
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

    _afterSortByChange: function (e) {
        this._sort = e.sortBy || [];

        this.data.sort();
    },

    _bindSortUI: function () {
        this.after(['sortableChange', 'sortByChange', 'columnsChange'],
            this._uiSetSortable);

        if (this._theadNode) {
            this._sortHandle = this._theadNode.delegate('click',
                this._onUITriggerSort,
                '.' + this.getClassName('sortable', 'column'));
        }
    },
            
    _defSortFn: function (e) {
        this.set.apply(this, ['sortBy', e.sortBy].concat(e.details));
    },

    destructor: function () {
        if (this._sortHandle) {
            this._sortHandle.detach();
        }
    },

    initializer: function () {
        var boundParseSortable = Y.bind('_parseSortable', this);

        this._parseSortable();

        this._sort = toArray(this.get('sortBy'));

        this._initSortFn();

        this.after({
            renderHead    : Y.bind('_renderSortable', this),
            dataChange    : Y.bind('_afterDataChange', this),
            sortableChange: boundParseSortable,
            columnsChange : boundParseSortable
        });

        this.publish('sort', {
            defaultFn: Y.bind('_defSortFn', this)
            // TODO: preventedFn to restore sortDir applied before fire()
        });
    },

    _initSortFn: function () {
        var self = this;

        // TODO: This should be a ModelList extension.
        // FIXME: Modifying a component of the host seems a little smelly
        // FIXME: Declaring inline override to leverage closure vs
        // compiling a new function for each column/sortable change or
        // binding the _compare implementation to this, resulting in an
        // extra function hop during sorting. Lesser of three evils?
        this.data._compare = function (a, b) {
            var cmp = 0,
                i, len, col, dir, aa, bb;

            for (i = 0, len = self._sort.length; !cmp && i < len; ++i) {
                col = self._sort[i];
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

        if (this.get('sortable')) {
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

        var id      = e.currentTarget.get('id'),
            columns = this._displayColumns,
            sortBy  = this.get('sortBy'),
            config;

        // TODO: if (e.ctrlKey) { /* subsort */ }
        if (id) {
            arraySearch(columns, function (col) {
                if (id === col._yuid) {
                    config = { column: col._id, dir: 1 };
                    return true;
                }
            });
        }

        if (config) {
            if (sortBy && sortBy.column === config.column) {
                config.dir = sortBy.dir * -1;
            }

            this.set('sortBy', config, {
                originEvent: e,
                src: Y.Widget.UI_SRC
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
                if (!isObject(col, true) || isArray(col)) {
                    col = this.getColumn(col);
                }

                if (col) {
                    columns.push(col._yuid);
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

            for (i = 0, len = columns.length; i < len; ++i) {
                columns[i] = columns[i]._yuid;
            }
        }

        this._sortable = columns;
    },

    _renderSortable: function () {
        this._uiSetSortable();

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
        var columns     = this._sortable || [],
            sortableClass = this.getClassName('sortable', 'column');

        this.get('boundingBox').toggleClass(
            this.getClassName('sortable'),
            columns.length);

        this._theadNode.all('.' + sortableClass).removeClass(sortableClass);

        this._theadNode.all('#' + columns.join(', #')).addClass(sortableClass);
    }
}, true);

Y.DataTable.Sortable = Sortable;

Y.Base.mix(Y.DataTable, [Sortable]);
