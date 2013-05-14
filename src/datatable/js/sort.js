/**
Adds support for sorting the table data by API methods `table.sort(...)` or
`table.toggleSort(...)` or by clicking on column headers in the rendered UI.

@module datatable
@submodule datatable-sort
@since 3.5.0
**/
var YLang     = Y.Lang,
    isBoolean = YLang.isBoolean,
    isString  = YLang.isString,
    isArray   = YLang.isArray,
    isObject  = YLang.isObject,

    toArray = Y.Array,
    sub     = YLang.sub,

    dirMap = {
        asc : 1,
        desc: -1,
        "1" : 1,
        "-1": -1
    };


/**
_API docs for this extension are included in the DataTable class._

This DataTable class extension adds support for sorting the table data by API
methods `table.sort(...)` or `table.toggleSort(...)` or by clicking on column
headers in the rendered UI.

Sorting by the API is enabled automatically when this module is `use()`d.  To
enable UI triggered sorting, set the DataTable's `sortable` attribute to
`true`.

<pre><code>
var table = new Y.DataTable({
    columns: [ 'id', 'username', 'name', 'birthdate' ],
    data: [ ... ],
    sortable: true
});

table.render('#table');
</code></pre>

Setting `sortable` to `true` will enable UI sorting for all columns.  To enable
UI sorting for certain columns only, set `sortable` to an array of column keys,
or just add `sortable: true` to the respective column configuration objects.
This uses the default setting of `sortable: auto` for the DataTable instance.

<pre><code>
var table = new Y.DataTable({
    columns: [
        'id',
        { key: 'username',  sortable: true },
        { key: 'name',      sortable: true },
        { key: 'birthdate', sortable: true }
    ],
    data: [ ... ]
    // sortable: 'auto' is the default
});

// OR
var table = new Y.DataTable({
    columns: [ 'id', 'username', 'name', 'birthdate' ],
    data: [ ... ],
    sortable: [ 'username', 'name', 'birthdate' ]
});
</code></pre>

To disable UI sorting for all columns, set `sortable` to `false`.  This still
permits sorting via the API methods.

As new records are inserted into the table's `data` ModelList, they will be inserted at the correct index to preserve the sort order.

The current sort order is stored in the `sortBy` attribute.  Assigning this value at instantiation will automatically sort your data.

Sorting is done by a simple value comparison using &lt; and &gt; on the field
value.  If you need custom sorting, add a sort function in the column's
`sortFn` property.  Columns whose content is generated by formatters, but don't
relate to a single `key`, require a `sortFn` to be sortable.

<pre><code>
function nameSort(a, b, desc) {
    var aa = a.get('lastName') + a.get('firstName'),
        bb = a.get('lastName') + b.get('firstName'),
        order = (aa > bb) ? 1 : -(aa < bb);

    return desc ? -order : order;
}

var table = new Y.DataTable({
    columns: [ 'id', 'username', { key: name, sortFn: nameSort }, 'birthdate' ],
    data: [ ... ],
    sortable: [ 'username', 'name', 'birthdate' ]
});
</code></pre>

See the user guide for more details.

@class DataTable.Sortable
@for DataTable
@since 3.5.0
**/
function Sortable() {}

Sortable.ATTRS = {
    // Which columns in the UI should suggest and respond to sorting interaction
    // pass an empty array if no UI columns should show sortable, but you want the
    // table.sort(...) API
    /**
    Controls which column headers can trigger sorting by user clicks.

    Acceptable values are:

     * "auto" - (default) looks for `sortable: true` in the column configurations
     * `true` - all columns are enabled
     * `false - no UI sortable is enabled
     * {String[]} - array of key names to give sortable headers

    @attribute sortable
    @type {String|String[]|Boolean}
    @default "auto"
    @since 3.5.0
    **/
    sortable: {
        value: 'auto',
        validator: '_validateSortable'
    },

    /**
    The current sort configuration to maintain in the data.

    Accepts column `key` strings or objects with a single property, the column
    `key`, with a value of 1, -1, "asc", or "desc".  E.g. `{ username: 'asc'
    }`.  String values are assumed to be ascending.

    Example values would be:

     * `"username"` - sort by the data's `username` field or the `key`
       associated to a column with that `name`.
     * `{ username: "desc" }` - sort by `username` in descending order.
       Alternately, use values "asc", 1 (same as "asc"), or -1 (same as "desc").
     * `["lastName", "firstName"]` - ascending sort by `lastName`, but for
       records with the same `lastName`, ascending subsort by `firstName`.
       Array can have as many items as you want.
     * `[{ lastName: -1 }, "firstName"]` - descending sort by `lastName`,
       ascending subsort by `firstName`. Mixed types are ok.

    @attribute sortBy
    @type {String|String[]|Object|Object[]}
    @since 3.5.0
    **/
    sortBy: {
        validator: '_validateSortBy',
        getter: '_getSortBy'
    },

    /**
    Strings containing language for sorting tooltips.

    @attribute strings
    @type {Object}
    @default (strings for current lang configured in the YUI instance config)
    @since 3.5.0
    **/
    strings: {}
};

Y.mix(Sortable.prototype, {

    /**
    Sort the data in the `data` ModelList and refresh the table with the new
    order.

    Acceptable values for `fields` are `key` strings or objects with a single
    property, the column `key`, with a value of 1, -1, "asc", or "desc".  E.g.
    `{ username: 'asc' }`.  String values are assumed to be ascending.

    Example values would be:

     * `"username"` - sort by the data's `username` field or the `key`
       associated to a column with that `name`.
     * `{ username: "desc" }` - sort by `username` in descending order.
       Alternately, use values "asc", 1 (same as "asc"), or -1 (same as "desc").
     * `["lastName", "firstName"]` - ascending sort by `lastName`, but for
       records with the same `lastName`, ascending subsort by `firstName`.
       Array can have as many items as you want.
     * `[{ lastName: -1 }, "firstName"]` - descending sort by `lastName`,
       ascending subsort by `firstName`. Mixed types are ok.

    @method sort
    @param {String|String[]|Object|Object[]} fields The field(s) to sort by
    @param {Object} [payload] Extra `sort` event payload you want to send along
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    sort: function (fields, payload) {
        /**
        Notifies of an impending sort, either from clicking on a column
        header, or from a call to the `sort` or `toggleSort` method.

        The requested sort is available in the `sortBy` property of the event.

        The default behavior of this event sets the table's `sortBy` attribute.

        @event sort
        @param {String|String[]|Object|Object[]} sortBy The requested sort
        @preventable _defSortFn
        **/
        return this.fire('sort', Y.merge((payload || {}), {
            sortBy: fields || this.get('sortBy')
        }));
    },

    /**
    Template for the node that will wrap the header content for sortable
    columns.

    @property SORTABLE_HEADER_TEMPLATE
    @type {HTML}
    @value '<div class="{className}" tabindex="0"><span class="{indicatorClass}"></span></div>'
    @since 3.5.0
    **/
    SORTABLE_HEADER_TEMPLATE: '<div class="{className}" tabindex="0" unselectable="on"><span class="{indicatorClass}"></span></div>',

    /**
    Reverse the current sort direction of one or more fields currently being
    sorted by.

    Pass the `key` of the column or columns you want the sort order reversed
    for.

    @method toggleSort
    @param {String|String[]} fields The field(s) to reverse sort order for
    @param {Object} [payload] Extra `sort` event payload you want to send along
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    toggleSort: function (columns, payload) {
        var current = this._sortBy,
            sortBy = [],
            i, len, j, col, index;

        // To avoid updating column configs or sortBy directly
        for (i = 0, len = current.length; i < len; ++i) {
            col = {};
            col[current[i]._id] = current[i].sortDir;
            sortBy.push(col);
        }

        if (columns) {
            columns = toArray(columns);

            for (i = 0, len = columns.length; i < len; ++i) {
                col = columns[i];
                index = -1;

                for (j = sortBy.length - 1; i >= 0; --i) {
                    if (sortBy[j][col]) {
                        sortBy[j][col] *= -1;
                        break;
                    }
                }
            }
        } else {
            for (i = 0, len = sortBy.length; i < len; ++i) {
                for (col in sortBy[i]) {
                    if (sortBy[i].hasOwnProperty(col)) {
                        sortBy[i][col] *= -1;
                        break;
                    }
                }
            }
        }

        return this.fire('sort', Y.merge((payload || {}), {
            sortBy: sortBy
        }));
    },

    //--------------------------------------------------------------------------
    // Protected properties and methods
    //--------------------------------------------------------------------------
    /**
    Sorts the `data` ModelList based on the new `sortBy` configuration.

    @method _afterSortByChange
    @param {EventFacade} e The `sortByChange` event
    @protected
    @since 3.5.0
    **/
    _afterSortByChange: function () {
        // Can't use a setter because it's a chicken and egg problem. The
        // columns need to be set up to translate, but columns are initialized
        // from Core's initializer.  So construction-time assignment would
        // fail.
        this._setSortBy();

        // Don't sort unless sortBy has been set
        if (this._sortBy.length) {
            if (!this.data.comparator) {
                 this.data.comparator = this._sortComparator;
            }

            this.data.sort();
        }
    },

    /**
    Applies the sorting logic to the new ModelList if the `newVal` is a new
    ModelList.

    @method _afterSortDataChange
    @param {EventFacade} e the `dataChange` event
    @protected
    @since 3.5.0
    **/
    _afterSortDataChange: function (e) {
        // object values always trigger a change event, but we only want to
        // call _initSortFn if the value passed to the `data` attribute was a
        // new ModelList, not a set of new data as an array, or even the same
        // ModelList.
        if (e.prevVal !== e.newVal || e.newVal.hasOwnProperty('_compare')) {
            this._initSortFn();
        }
    },

    /**
    Checks if any of the fields in the modified record are fields that are
    currently being sorted by, and if so, resorts the `data` ModelList.

    @method _afterSortRecordChange
    @param {EventFacade} e The Model's `change` event
    @protected
    @since 3.5.0
    **/
    _afterSortRecordChange: function (e) {
        var i, len;

        for (i = 0, len = this._sortBy.length; i < len; ++i) {
            if (e.changed[this._sortBy[i].key]) {
                this.data.sort();
                break;
            }
        }
    },

    /**
    Subscribes to state changes that warrant updating the UI, and adds the
    click handler for triggering the sort operation from the UI.

    @method _bindSortUI
    @protected
    @since 3.5.0
    **/
    _bindSortUI: function () {
        var handles = this._eventHandles;

        if (!handles.sortAttrs) {
            handles.sortAttrs = this.after(
                ['sortableChange', 'sortByChange', 'columnsChange'],
                Y.bind('_uiSetSortable', this));
        }

        if (!handles.sortUITrigger && this._theadNode) {
            handles.sortUITrigger = this.delegate(['click','keydown'],
                Y.rbind('_onUITriggerSort', this),
                '.' + this.getClassName('sortable', 'column'));
        }
    },

    /**
    Sets the `sortBy` attribute from the `sort` event's `e.sortBy` value.

    @method _defSortFn
    @param {EventFacade} e The `sort` event
    @protected
    @since 3.5.0
    **/
    _defSortFn: function (e) {
        this.set.apply(this, ['sortBy', e.sortBy].concat(e.details));
    },

    /**
    Getter for the `sortBy` attribute.

    Supports the special subattribute "sortBy.state" to get a normalized JSON
    version of the current sort state.  Otherwise, returns the last assigned
    value.

    For example:

    <pre><code>var table = new Y.DataTable({
        columns: [ ... ],
        data: [ ... ],
        sortBy: 'username'
    });

    table.get('sortBy'); // 'username'
    table.get('sortBy.state'); // { key: 'username', dir: 1 }

    table.sort(['lastName', { firstName: "desc" }]);
    table.get('sortBy'); // ['lastName', { firstName: "desc" }]
    table.get('sortBy.state'); // [{ key: "lastName", dir: 1 }, { key: "firstName", dir: -1 }]
    </code></pre>

    @method _getSortBy
    @param {String|String[]|Object|Object[]} val The current sortBy value
    @param {String} detail String passed to `get(HERE)`. to parse subattributes
    @protected
    @since 3.5.0
    **/
    _getSortBy: function (val, detail) {
        var state, i, len, col;

        // "sortBy." is 7 characters. Used to catch
        detail = detail.slice(7);

        // TODO: table.get('sortBy.asObject')? table.get('sortBy.json')?
        if (detail === 'state') {
            state = [];

            for (i = 0, len = this._sortBy.length; i < len; ++i) {
                col = this._sortBy[i];
                state.push({
                    column: col._id,
                    dir: col.sortDir
                });
            }

            // TODO: Always return an array?
            return { state: (state.length === 1) ? state[0] : state };
        } else {
            return val;
        }
    },

    /**
    Sets up the initial sort state and instance properties.  Publishes events
    and subscribes to attribute change events to maintain internal state.

    @method initializer
    @protected
    @since 3.5.0
    **/
    initializer: function () {
        var boundParseSortable = Y.bind('_parseSortable', this);

        this._parseSortable();

        this._setSortBy();

        this._initSortFn();

        this._initSortStrings();

        this.after({
            'table:renderHeader': Y.bind('_renderSortable', this),
            dataChange          : Y.bind('_afterSortDataChange', this),
            sortByChange        : Y.bind('_afterSortByChange', this),
            sortableChange      : boundParseSortable,
            columnsChange       : boundParseSortable
        });
        this.data.after(this.data.model.NAME + ":change",
            Y.bind('_afterSortRecordChange', this));

        // TODO: this event needs magic, allowing async remote sorting
        this.publish('sort', {
            defaultFn: Y.bind('_defSortFn', this)
        });
    },

    /**
    Creates a `_compare` function for the `data` ModelList to allow custom
    sorting by multiple fields.

    @method _initSortFn
    @protected
    @since 3.5.0
    **/
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
                i, len, col, dir, cs, aa, bb;

            for (i = 0, len = self._sortBy.length; !cmp && i < len; ++i) {
                col = self._sortBy[i];
                dir = col.sortDir,
                cs = col.caseSensitive;

                if (col.sortFn) {
                    cmp = col.sortFn(a, b, (dir === -1));
                } else {
                    // FIXME? Requires columns without sortFns to have key
                    aa = a.get(col.key) || '';
                    bb = b.get(col.key) || '';
                    if (!cs && typeof(aa) === "string" && typeof(bb) === "string"){// Not case sensitive
                        aa = aa.toLowerCase();
                        bb = bb.toLowerCase();
                    }
                    cmp = (aa > bb) ? dir : ((aa < bb) ? -dir : 0);
                }
            }

            return cmp;
        };

        if (this._sortBy.length) {
            this.data.comparator = this._sortComparator;

            // TODO: is this necessary? Should it be elsewhere?
            this.data.sort();
        } else {
            // Leave the _compare method in place to avoid having to set it
            // up again.  Mistake?
            delete this.data.comparator;
        }
    },

    /**
    Add the sort related strings to the `strings` map.

    @method _initSortStrings
    @protected
    @since 3.5.0
    **/
    _initSortStrings: function () {
        // Not a valueFn because other class extensions will want to add to it
        this.set('strings', Y.mix((this.get('strings') || {}),
            Y.Intl.get('datatable-sort')));
    },

    /**
    Fires the `sort` event in response to user clicks on sortable column
    headers.

    @method _onUITriggerSort
    @param {DOMEventFacade} e The `click` event
    @protected
    @since 3.5.0
    **/
    _onUITriggerSort: function (e) {
        var id = e.currentTarget.getAttribute('data-yui3-col-id'),
            column = id && this.getColumn(id),
            sortBy, i, len;

        if (e.type === 'keydown' && e.keyCode !== 32) {
            return;
        }

        // In case a headerTemplate injected a link
        // TODO: Is this overreaching?
        e.preventDefault();

        if (column) {
            if (e.shiftKey) {
                sortBy = this.get('sortBy') || [];

                for (i = 0, len = sortBy.length; i < len; ++i) {
                    if (id === sortBy[i]  || Math.abs(sortBy[i][id]) === 1) {
                        if (!isObject(sortBy[i])) {
                            sortBy[i] = {};
                        }

                        sortBy[i][id] = -(column.sortDir||0) || 1;
                        break;
                    }
                }

                if (i >= len) {
                    sortBy.push(column._id);
                }
            } else {
                sortBy = [{}];

                sortBy[0][id] = -(column.sortDir||0) || 1;
            }

            this.fire('sort', {
                originEvent: e,
                sortBy: sortBy
            });
        }
    },

    /**
    Normalizes the possible input values for the `sortable` attribute, storing
    the results in the `_sortable` property.

    @method _parseSortable
    @protected
    @since 3.5.0
    **/
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

        this._sortable = columns;
    },

    /**
    Initial application of the sortable UI.

    @method _renderSortable
    @protected
    @since 3.5.0
    **/
    _renderSortable: function () {
        this._uiSetSortable();

        this._bindSortUI();
    },

    /**
    Parses the current `sortBy` attribute into a normalized structure for the
    `data` ModelList's `_compare` method.  Also updates the column
    configurations' `sortDir` properties.

    @method _setSortBy
    @protected
    @since 3.5.0
    **/
    _setSortBy: function () {
        var columns     = this._displayColumns,
            sortBy      = this.get('sortBy') || [],
            sortedClass = ' ' + this.getClassName('sorted'),
            i, len, name, dir, field, column;

        this._sortBy = [];

        // Purge current sort state from column configs
        for (i = 0, len = columns.length; i < len; ++i) {
            column = columns[i];

            delete column.sortDir;

            if (column.className) {
                // TODO: be more thorough
                column.className = column.className.replace(sortedClass, '');
            }
        }

        sortBy = toArray(sortBy);

        for (i = 0, len = sortBy.length; i < len; ++i) {
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
                // FIXME: this isn't limited to model attributes, but there's no
                // convenient way to get a list of the attributes for a Model
                // subclass *including* the attributes of its superclasses.
                column = this.getColumn(name) || { _id: name, key: name };

                if (column) {
                    column.sortDir = dir;

                    if (!column.className) {
                        column.className = '';
                    }

                    column.className += sortedClass;

                    this._sortBy.push(column);
                }
            }
        }
    },

    /**
    Array of column configuration objects of those columns that need UI setup
    for user interaction.

    @property _sortable
    @type {Object[]}
    @protected
    @since 3.5.0
    **/
    //_sortable: null,

    /**
    Array of column configuration objects for those columns that are currently
    being used to sort the data.  Fake column objects are used for fields that
    are not rendered as columns.

    @property _sortBy
    @type {Object[]}
    @protected
    @since 3.5.0
    **/
    //_sortBy: null,

    /**
    Replacement `comparator` for the `data` ModelList that defers sorting logic
    to the `_compare` method.  The deferral is accomplished by returning `this`.

    @method _sortComparator
    @param {Model} item The record being evaluated for sort position
    @return {Model} The record
    @protected
    @since 3.5.0
    **/
    _sortComparator: function (item) {
        // Defer sorting to ModelList's _compare
        return item;
    },

    /**
    Applies the appropriate classes to the `boundingBox` and column headers to
    indicate sort state and sortability.

    Also currently wraps the header content of sortable columns in a `<div>`
    liner to give a CSS anchor for sort indicators.

    @method _uiSetSortable
    @protected
    @since 3.5.0
    **/
    _uiSetSortable: function () {
        var columns       = this._sortable || [],
            sortableClass = this.getClassName('sortable', 'column'),
            ascClass      = this.getClassName('sorted'),
            descClass     = this.getClassName('sorted', 'desc'),
            linerClass    = this.getClassName('sort', 'liner'),
            indicatorClass= this.getClassName('sort', 'indicator'),
            sortableCols  = {},
            i, len, col, node, liner, title, desc;

        this.get('boundingBox').toggleClass(
            this.getClassName('sortable'),
            columns.length);

        for (i = 0, len = columns.length; i < len; ++i) {
            sortableCols[columns[i].id] = columns[i];
        }

        // TODO: this.head.render() + decorate cells?
        this._theadNode.all('.' + sortableClass).each(function (node) {
            var col       = sortableCols[node.get('id')],
                liner     = node.one('.' + linerClass),
                indicator;

            if (col) {
                if (!col.sortDir) {
                    node.removeClass(ascClass)
                        .removeClass(descClass);
                }
            } else {
                node.removeClass(sortableClass)
                    .removeClass(ascClass)
                    .removeClass(descClass);

                if (liner) {
                    liner.replace(liner.get('childNodes').toFrag());
                }

                indicator = node.one('.' + indicatorClass);

                if (indicator) {
                    indicator.remove().destroy(true);
                }
            }
        });

        for (i = 0, len = columns.length; i < len; ++i) {
            col  = columns[i];
            node = this._theadNode.one('#' + col.id);
            desc = col.sortDir === -1;

            if (node) {
                liner = node.one('.' + linerClass);

                node.addClass(sortableClass);

                if (col.sortDir) {
                    node.addClass(ascClass);

                    node.toggleClass(descClass, desc);

                    node.setAttribute('aria-sort', desc ?
                        'descending' : 'ascending');
                }

                if (!liner) {
                    liner = Y.Node.create(Y.Lang.sub(
                        this.SORTABLE_HEADER_TEMPLATE, {
                            className: linerClass,
                            indicatorClass: indicatorClass
                        }));

                    liner.prepend(node.get('childNodes').toFrag());

                    node.append(liner);
                }

                title = sub(this.getString(
                    (col.sortDir === 1) ? 'reverseSortBy' : 'sortBy'), {
                        column: col.abbr || col.label ||
                                col.key  || ('column ' + i)
                });

                node.setAttribute('title', title);
                // To combat VoiceOver from reading the sort title as the
                // column header
                node.setAttribute('aria-labelledby', col.id);
            }
        }
    },

    /**
    Allows values `true`, `false`, "auto", or arrays of column names through.

    @method _validateSortable
    @param {Any} val The input value to `set("sortable", VAL)`
    @return {Boolean}
    @protected
    @since 3.5.0
    **/
    _validateSortable: function (val) {
        return val === 'auto' || isBoolean(val) || isArray(val);
    },

    /**
    Allows strings, arrays of strings, objects, or arrays of objects.

    @method _validateSortBy
    @param {String|String[]|Object|Object[]} val The new `sortBy` value
    @return {Boolean}
    @protected
    @since 3.5.0
    **/
    _validateSortBy: function (val) {
        return val === null ||
               isString(val) ||
               isObject(val, true) ||
               (isArray(val) && (isString(val[0]) || isObject(val, true)));
    }

}, true);

Y.DataTable.Sortable = Sortable;

Y.Base.mix(Y.DataTable, [Sortable]);
