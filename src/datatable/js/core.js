/**
The core implementation of the `DataTable` and `DataTable.Base` Widgets.

Use this class extension with Widget or another Base-based superclass to create
the basic DataTable API and composing class structure.

Notable about this architecture is that rendering and UI event management for
the header, body, and footer of the table are deferred to configurable classes
in the `headerView`, `bodyView`, and `footerView` attributes.  In this extension
they have no default values, requiring implementers to supply their own classes
to render the table content.

@module datatable-core
**/

var INVALID = Y.Attribute.INVALID_VALUE,

    Lang         = Y.Lang,
    isFunction   = Lang.isFunction,
    isObject     = Lang.isObject,
    isArray      = Lang.isArray,
    isString     = Lang.isString,
    isNumber     = Lang.isNumber,
    fromTemplate = Lang.sub,

    toArray = Y.Array,

    keys = Y.Object.keys,

    Table;
    
// TODO: add this to Y.Object
function flatten(o) {
    var flat = {},
        key;

    for (key in o) {
        // Not doing a hasOwnProperty check on purpose
        flat[key] = o[key];
    }

    return flat;
}

/**
Class extension providing the core API and structure for the DataTable Widget.

@class DataTable.Core
**/
Table = Y.namespace('DataTable').Core = function () {};

Table.ATTRS = {
    /**
    Columns to include in the rendered table.
    
    If omitted, the attributes on the configured `recordType` or the first item
    in the `data` collection will be used as a source.

    This attribute takes an array of strings or objects (mixing the two is
    fine).  Each string or object is considered a column to be rendered.
    Strings are converted to objects, so `columns: ['first', 'last']` becomes
    `columns: [{ key: 'first' }, { key: 'last' }]`.

    DataTable.Core only concerns itself with the `key` property of columns.
    All other properties are for use by the `headerView`, `bodyView`,
    `footerView`, and any class extensions or plugins on the final class or
    instance. See the descriptions of the view classes and feature class
    extensions and plugins for details on the specific properties they read or
    add to column definitions.

    @attribute columns
    @type {Object[]|String[]}
    @default (from `recordType` ATTRS or first item in the `data`)
    **/
    columns: {
        // TODO: change to setter to coerce Columnset?
        validator: isArray,
        getter: '_getColumns'
    },

    /**
    Model subclass to use as the `model` for the ModelList stored in the `data`
    attribute.

    If not provided, it will try really hard to figure out what to use.  The
    following attempts will be made to set a default value:
    
    1. If the `data` attribute is set with a ModelList instance and its `model`
       property is set, that will be used.
    2. If the `data` attribute is set with a ModelList instance, and its
       `model` property is unset, but it is populated, the `ATTRS` of the
       `constructor of the first item will be used.
    3. If the `data` attribute is set with a non-empty array, a Model subclass
       will be generated using the keys of the first item as its `ATTRS` (see
       the `_createRecordClass` method).
    4. If the `columns` attribute is set, a Model subclass will be generated
       using the columns defined with a `key`. This is least desirable because
       columns can be duplicated or nested in a way that's not parsable.
    5. If neither `data` nor `columns` is set or populated, a change event
       subscriber will listen for the first to be changed and try all over
       again.

    @attribute recordType
    @type {Function}
    @default (see description)
    **/
    recordType: {
        setter: '_setRecordType',
        writeOnce: true
    },

    /**
    The collection of data records to display.  This attribute is a pass
    through to a `data` property, which is a ModelList instance.

    If this attribute is passed a ModelList or subclass, it will be assigned to
    the property directly.  If an array of objects is passed, a new ModelList
    will be created using the configured `recordType` as its `model` property
    and seeded with the array.

    Retrieving this attribute will return the ModelList stored in the `data`
    property.

    @attribute data
    @type {ModelList|Object[]}
    @default `new ModelList()`
    **/
    data: {
        value : [],
        setter: '_setData',
        getter: '_getData'
    },

    /**
    The class or object to use for rendering the `<thead>` and column headers
    for the table.  This attribute is responsible for populating the the
    instance's `head` property.

    If a class constructor (function) is passed, an instance of that clas will
    be created at `render()` time and assigned to `this.head`.  If an object is
    passed, `head` will be set immediately.

    Valid objects or classes will have a `render()` method, though it is
    recommended that they be subclasses of `Y.Base` or `Y.View`.  If the object
    or class supports events, its `addTarget()` method will be called to bubble
    its events to this instance.

    The core implementaion does not define a default `headerView`.  Classes
    built from this extension should define a default.

    @attribute headerView
    @type {Function|Object}
    **/
    headerView: {
        validator: '_validateView',
        writeOnce: true
    },

    /**
    The class or object to use for rendering the `<tfoot>` and any relevant
    content for it.  This attribute is responsible for populating the the
    instance's `foot` property.

    If a class constructor (function) is passed, an instance of that clas will
    be created at `render()` time and assigned to `this.foot`.  If an object is
    passed, `foot` will be set immediately.

    Valid objects or classes will have a `render()` method, though it is
    recommended that they be subclasses of `Y.Base` or `Y.View`.  If the object
    or class supports events, its `addTarget()` method will be called to bubble
    its events to this instance.

    The core implementaion does not define a default `footerView`.  Classes
    built from this extension should define a default if appropriate.

    @attribute footerView
    @type {Function|Object}
    **/
    footerView: {
        validator: '_validateView',
        writeOnce: true
    },

    /**
    The class or object to use for rendering the `<tbody>` or `<tbody>`s and
    all data row content for the table.  This attribute is responsible for
    populating the the instance's `body` property.

    If a class constructor (function) is passed, an instance of that clas will
    be created at `render()` time and assigned to `this.body`.  If an object is
    passed, `body` will be set immediately.

    Valid objects or classes will have a `render()` method, though it is
    recommended that they be subclasses of `Y.Base` or `Y.View`.  If the object
    or class supports events, its `addTarget()` method will be called to bubble
    its events to this instance.

    The core implementaion does not define a default `bodyView`.  Classes
    built from this extension should define a default.

    @attribute bodyView
    @type {Function|Object}
    **/
    bodyView: {
        validator: '_validateView',
        writeOnce: true
    },

    /**
    Content for the `<table summary="ATTRIBUTE VALUE HERE">`.  Values assigned
    to this attribute will be HTML escaped for security.

    @attribute summary
    @type {String}
    @default '' (empty string)
    **/
    summary: {
        value: '',
        // For paranoid reasons, the value is escaped on its way in because
        // rendering can be based on string concatenation.
        setter: Y.Escape.html
    },

    /**
    HTML content of an optional `<caption>` element to appear above the table.
    Leave this config unset or set to a falsy value to remove the caption.

    @attribute caption
    @type HTML
    @default '' (empty string)
    **/
    caption: {
        value: ''
    },

    /**
    Deprecated as of 3.5.0. Passes through to the `data` attribute.

    WARNING: `get('recordset')` will NOT return a Recordset instance as of
    3.5.0.  This is a break in backward compatibility.

    @attribute recordset
    @type {Object[]|Recordset}
    @deprecated Use the `data` attribute
    **/
    recordset: {
        setter: '_setRecordset',
        getter: '_getRecordset'
    },

    /**
    Deprecated as of 3.5.0. Passes through to the `columns` attribute.

    If a Columnset object is passed, its raw object and array column data will
    be extracted for use.

    WARNING: `get('columnset')` will NOT return a Columnset instance as of
    3.5.0.  This is a break in backward compatibility.

    @attribute columnset
    @type {Object[]|Columnset}
    @deprecated Use the `columns` attribute
    **/
    columnset: {
        setter: '_setColumnset',
        getter: '_getColumnset'
    }
};

Y.mix(Table.prototype, {
    // -- Instance properties -------------------------------------------------

    /**
    The HTML template used to create the caption Node if the `caption`
    attribute is set.

    @property CAPTION_TEMPLATE
    @type {HTML}
    @default '<caption class="{className}"/>'
    **/
    CAPTION_TEMPLATE: '<caption class="{className}"/>',

    /**
    The HTML template used to create the table Node.

    @property TABLE_TEMPLATE
    @type {HTML}
    @default '<table class="{className}"/>'
    **/
    TABLE_TEMPLATE  : '<table role="presentation" class="{className}"/>',

    /**
    HTML template used to create table's `<tbody>` if configured with a
    `bodyView`.

    @property TBODY_TEMPLATE
    @type {HTML}
    @default '<tbody class="{className}"/>'
    **/
    TBODY_TEMPLATE: '<tbody class="{className}"/>',

    /**
    Template used to create the table's `<tfoot>` if configured with a
    `footerView`.

    @property TFOOT_TEMPLATE
    @type {HTML}
    @default '<tfoot class="{className}"/>'
    **/
    TFOOT_TEMPLATE:
        '<tfoot class="{className}"/>',

    /**
    Template used to create the table's `<thead>` if configured with a
    `headerView`.

    @property THEAD_TEMPLATE
    @type {HTML}
    @default '<thead class="{className}"/>'
    **/
    THEAD_TEMPLATE:
        '<thead class="{className}"/>',

    /**
    The object or instance of the class assigned to `bodyView` that is
    responsible for rendering and managing the table's `<tbody>`(s) and its
    content.

    @property body
    @type {Object}
    @default undefined (initially unset)
    **/
    //body: null,

    /**
    The object or instance of the class assigned to `footerView` that is
    responsible for rendering and managing the table's `<tfoot>` and its
    content.

    @property foot
    @type {Object}
    @default undefined (initially unset)
    **/
    //foot: null,

    /**
    The object or instance of the class assigned to `headerView` that is
    responsible for rendering and managing the table's `<thead>` and its
    content.

    @property head
    @type {Object}
    @default undefined (initially unset)
    **/
    //head: null,

    /**
    The ModelList that manages the table's data.

    @property data
    @type {ModelList}
    @default undefined (initially unset)
    **/
    //data: null,

    // -- Public methods ------------------------------------------------------
    /**
    Pass through to `delegate()` called from the `contentBox`.

    @method delegate
    @param type {String} the event type to delegate
    @param fn {Function} the callback function to execute.  This function
                 will be provided the event object for the delegated event.
    @param spec {String|Function} a selector that must match the target of the
                 event or a function to test target and its parents for a match
    @param context {Object} optional argument that specifies what 'this' refers to
    @param args* {any} 0..n additional arguments to pass on to the callback
                 function.  These arguments will be added after the event object.
    @return {EventHandle} the detach handle
    **/
    delegate: function () {
        var contentBox = this.get('contentBox');

        return contentBox.delegate.apply(contentBox, arguments);
    },

    /**
    Returns the Node for a cell at the given coordinates.

    Technically, this only relays to the `bodyView` instance's `getCell` method.
    If the `bodyView` doesn't have a `getCell` method, `undefined` is returned.

    @method getCell
    @param {Number} row Index of the cell's containing row
    @param {Number} col Index of the cell's containing column
    @return {Node}
    **/
    getCell: function (row, col) {
        return this.body && this.body.getCell && this.body.getCell(row, col);
    },

    /**
    Gets the column configuration object for the given key, name, or index.  For
    nested columns, `name` can be an array of indexes, each identifying the index
    of that column in the respective parent's "children" array.

    If you pass a column object, it will be returned.

    For columns with keys, you can also fetch the column with
    `instance.get('columns.foo')`.

    @method getColumn
    @param {String|Number|Number[]} name Key, "name", index, or index array to
                identify the column
    @return {Object} the column configuration object
    **/
    getColumn: function (name) {
        var col, columns, stack, entry, i, len, cols;

        if (isObject(name) && !isArray(name)) {
            // TODO: support getting a column from a DOM node - this will cross
            // the line into the View logic, so it should be relayed

            // Assume an object passed in is already a column def
            col = name;
        } else {
            col = this.get('columns.' + name);
        }

        if (col) {
            return col;
        }

        columns = this.get('columns');

        if (isNumber(name) || isArray(name)) {
            name = toArray(name);
            cols = columns;

            for (i = 0, len = name.length - 1; cols && i < len; ++i) {
                cols = cols[name[i]] && cols[name[i]].children;
            }

            return (cols && cols[i]) || null;
        } else if (isString(name)) {
            stack = [[columns, 0]];
            while (stack.length) {
                entry = stack[stack.length - 1];
                cols  = entry[0];
                for (i = entry[1], len = cols.length; i < len; ++i) {
                    col = cols[i];
                    // Only need to check against name because the initial
                    // col = get('columns.' + name) would get it from the key map
                    if (col.name === name) {
                        return col;
                    } else if (col.children) {
                        entry[1] = i + 1;
                        stack.push([col.children, 0]);
                        break;
                    }
                }

                if (i > len) {
                    stack.pop();
                }
            }
        }

        return null;
    },

    /**
    Returns the Node for a row at the given index.

    Technically, this only relays to the `bodyView` instance's `getRow` method.
    If the `bodyView` doesn't have a `getRow` method, `undefined` is returned.

    @method getRow
    @param {Number} index Index of the row in the data `<tbody>`
    @return {Node}
    **/
    getRow: function (index) {
        return this.body && this.body.getRow && this.body.getRow(index);
    },

    /**
    Updates the UI with the current attribute state.

    @method syncUI
    **/
    syncUI: function () {
        this._uiSetCaption(this.get('caption'));
        this._uiSetSummary(this.get('summary'));
    },

    // -- Protected and private properties and methods ------------------------

    /**
    Configuration object passed to the class constructor in `bodyView` during
    render.

    This property is set by the `_initViewConfig` method at instantiation.

    @property _bodyConfig
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_bodyConfig: null,

    /**
    A map of column key to column configuration objects parsed from the
    `columns` attribute.

    @property _columnMap
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_columnMap: null,

    /**
    Configuration object passed to the class constructor in `footerView` during
    render.

    This property is set by the `_initViewConfig` method at instantiation.

    @property _footerConfig
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_footerConfig: null,

    /**
    Configuration object passed to the class constructor in `headerView` during
    render.

    This property is set by the `_initViewConfig` method at instantiation.

    @property _headerConfig
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_headerConfig: null,

    /**
    The Node instance of the table containing the data rows.  This is set when
    the table is rendered.  It may also be set by progressive enhancement,
    though this extension does not provide the logic to parse from source.

    @property _tableNode
    @type {Node}
    @default undefined (initially unset)
    @protected
    **/
    //_tableNode: null,

    /**
    Configuration object used as the prototype of `_headerConfig`,
    `_bodyConfig`, and `_footerConfig`. Add properties to this object if you
    want them in all three of the other config objects.

    This property is set by the `_initViewConfig` method at instantiation.

    @property _viewConfig
    @type {Object}
    @default undefined (initially unset)
    @protected
    **/
    //_viewConfig: null,

    /**
    Updates the `_columnMap` property in response to changes in the `columns`
    attribute.

    @method _afterColumnsChange
    @param {EventFacade} e The `columnsChange` event object
    @protected
    **/
    _afterColumnsChange: function (e) {
        this._setColumnMap(e.newVal);
        this._setDisplayColumns(e.newVal);
    },

    /**
    Subscribes to attribute change events to update the UI.

    @method bindUI
    @protected
    **/
    bindUI: function () {
        // TODO: handle widget attribute changes
    },

    /**
    Creates a Model subclass from an array of attribute names or an object of
    attribute definitions.  This is used to generate a class suitable to
    represent the data passed to the `data` attribute if no `recordType` is
    set.

    @method _createRecordClass
    @param {String[]|Object} attrs Names assigned to the Model subclass's
                `ATTRS` or its entire `ATTRS` definition object
    @return {Model}
    @protected
    **/
    _createRecordClass: function (attrs) {
        var ATTRS, i, len;

        if (isArray(attrs)) {
            ATTRS = {};

            for (i = 0, len = attrs.length; i < len; ++i) {
                ATTRS[attrs[i]] = {};
            }
        } else if (isObject(attrs)) {
            ATTRS = attrs;
        }

        return Y.Base.create('record', Y.Model, [], null, { ATTRS: ATTRS });
    },

    /**
    Creates the `<table>`.

    @method _createTable
    @return {Node} The `<table>` node
    @protected
    **/
    _createTable: function () {
        return Y.Node.create(fromTemplate(this.TABLE_TEMPLATE, {
            className: this.getClassName('table')
        }));
    },

    /**
    Creates a `<tbody>` node from the `TBODY_TEMPLATE`.

    @method _createTBody
    @protected
    **/
    _createTBody: function () {
        return Y.Node.create(fromTemplate(this.TBODY_TEMPLATE, {
            className: this.getClassName('data')
        }));
    },

    /**
    Creates a `<tfoot>` node from the `TFOOT_TEMPLATE`.

    @method _createTFoot
    @protected
    **/
    _createTFoot: function () {
        return Y.Node.create(fromTemplate(this.TFOOT_TEMPLATE, {
            className: this.getClassName('footer')
        }));
    },

    /**
    Creates a `<thead>` node from the `THEAD_TEMPLATE`.

    @method _createTHead
    @protected
    **/
    _createTHead: function () {
        return Y.Node.create(fromTemplate(this.THEAD_TEMPLATE, {
            className: this.getClassName('columns')
        }));
    },

    /**
    Calls `render()` on the `bodyView` class instance and inserts the view's
    container into the `<table>`.

    Assigns the instance's `body` property from `e.view` and the `_tbodyNode`
    from the view's `container` attribute.

    @method _defRenderBodyFn
    @param {EventFacade} e The renderBody event
    @protected
    **/
    _defRenderBodyFn: function (e) {
        e.view.render();

        this.body = e.view;
        this._tbodyNode = e.view.get('container');

        this._tableNode.append(this._tbodyNode);
    },

    /**
    Calls `render()` on the `footerView` class instance and inserts the view's
    container into the `<table>`.

    Assigns the instance's `foot` property from `e.view` and the `_tfootNode`
    from the view's `container` attribute.

    @method _defRenderFooterFn
    @param {EventFacade} e The renderFooter event
    @protected
    **/
    _defRenderFooterFn: function (e) {
        e.view.render();

        this.foot = e.view;
        this._tfootNode = e.view.get('container');

        this._tableNode.insertBefore(this._tfootNode,
            this._tableNode.one('> tbody'));
    },

    /**
    Calls `render()` on the `headerView` class instance and inserts the view's
    container into the `<table>`.

    Assigns the instance's `head` property from `e.view` and the `_theadNode`
    from the view's `container` attribute.

    @method _defRenderHeaderFn
    @param {EventFacade} e The renderHeader event
    @protected
    **/
    _defRenderHeaderFn: function (e) {
        e.view.render();

        this.head = e.view;
        this._theadNode = e.view.get('container');

        this._tableNode.insertBefore(this._theadNode,
            this._tableNode.one('> tfoot, > tbody'));
    },

    /**
    Renders the `<table>`, `<caption>`, and `<colgroup>`.

    Assigns the generated table to the `_tableNode` property.

    @method _defRenderTableFn
    @param {EventFacade} e The renderTable event
    @protected
    **/
    _defRenderTableFn: function (e) {
        var view, config;

        this._tableNode = this._createTable();

        if (e.headerView) {
            config = flatten(e.headerConfig || {});
            config.container = this._createTHead();

            view = new e.headerView(config);
            view.addTarget(this);

            this.fire('renderHeader', { view: view });
        }

        if (e.footerView) {
            config = flatten(e.footerConfig || {});
            config.container = this._createTFoot();

            view = new e.footerView(config);
            view.addTarget(this);

            this.fire('renderFooter', { view: view });
        }

        if (e.bodyView) {
            config = flatten(e.bodyConfig || {});
            config.container = this._createTBody();

            view = new e.bodyView(config);
            view.addTarget(this);

            this.fire('renderBody', { view: view });
        }

    },

    /**
    Contains column configuration objects for those columns believed to be intended for display in the `<tbody>`. Populated by `_setDisplayColumns`.

    @property _displayColumns
    @type {Object[]}
    @value undefined (initially not set)
    @protected
    **/
    //_displayColumns: null,

    /**
    The getter for the `columns` attribute.  Returns the array of column
    configuration objects if `instance.get('columns')` is called, or the
    specific column object if `instance.get('columns.columnKey')` is called.

    @method _getColumns
    @param {Object[]} columns The full array of column objects
    @param {String} name The attribute name requested
                         (e.g. 'columns' or 'columns.foo');
    @protected
    **/
    _getColumns: function (columns, name) {
        // Workaround for an attribute oddity (ticket #2529254)
        // getter is expected to return an object if get('columns.foo') is called.
        // Note 'columns.' is 8 characters
        return name.length > 8 ? this._columnMap : columns;
    },

    /**
    Relays the `get()` request for the deprecated `columnset` attribute to the
    `columns` attribute.

    THIS BREAKS BACKWARD COMPATIBILITY.  3.4.1 and prior implementations will
    expect a Columnset instance returned from `get('columnset')`.

    @method _getColumnset
    @param {Object} ignored The current value stored in the `columnset` state
    @param {String} name The attribute name requested
                         (e.g. 'columnset' or 'columnset.foo');
    @deprecated This will be removed with the `columnset` attribute in a future
                version.
    @protected
    **/
    _getColumnset: function (_, name) {
        return this.get(name.replace(/^columnset/, 'columns'));
    },

    /**
    The getter for the `data` attribute.  Returns the ModelList stored in the
    `data` property.  If the ModelList is not yet set, it returns the current
    raw data (presumably an empty array or `undefined`).

    @method _getData
    @param {Object[]|ModelList} val The current data stored in the attribute
    @protected
    **/
    _getData: function (val) {
        return this.data || val;
    },

    /**
    Initializes the `_columnMap` property from the configured `columns`
    attribute.  If `columns` is not set, but `recordType` is, it uses the
    `ATTRS` of that class.  If neither are set, it temporarily falls back to an
    empty array. `_initRecordType` will call back into this method if it finds
    the `columnMap` empty.

    @method _initColumns
    @protected
    **/
    _initColumns: function () {
        var columns    = this.get('columns'),
            recordType = this.get('recordType');
        
        // Default column definition from the configured recordType
        if (!columns) {
            // TODO: merge superclass attributes up to Model?
            columns = (recordType && recordType.ATTRS) ?
                      keys(recordType.ATTRS) : [];

            this.set('columns', columns, { silent: true });
        }

        this._setColumnMap(columns);

        this._setDisplayColumns(columns);
    },

    /**
    Initializes the instance's `data` property from the value of the `data`
    attribute.  If the attribute value is a ModelList, it is assigned directly
    to `this.data`.  If it is an array, a ModelList is created, its `model`
    property is set to the configured `recordType` class, and it is seeded with
    the array data.  This ModelList is then assigned to `this.data`.

    @method _initData
    @protected
    **/
    _initData: function () {
        var data = this.get('data'),
            recordType, values;

        if (isArray(data)) {
            recordType = this.get('recordType');

            values = data;
            data = new Y.ModelList();

            // _initRecordType is run before this, so recordType will be set
            // if the data array had any records.  Otherwise, values is an
            // empty array, so no need to call reset();
            if (recordType) {
                data.model = recordType;
                data.reset(values, { silent: true });
            }

            // Make sure the attribute state object contains the ModelList.
            // TODO: maybe better would be to purge the attribute state value?
            this.set('data', data, { silent: true });
        }

        this.data = data;

        this.data.addTarget(this);
    },

    /**
    Publishes core events.

    @method _initEvents
    @protected
    **/
    _initEvents: function () {
        this.publish({
            // Y.bind used to allow late binding for method override support
            renderTable : {
                fireOnce: true,
                defaultFn: Y.bind('_defRenderTableFn', this)
            },
            renderHeader: {
                fireOnce: true,
                defaultFn: Y.bind('_defRenderHeaderFn', this)
            },
            renderBody  : {
                fireOnce: true,
                defaultFn: Y.bind('_defRenderBodyFn', this)
            },
            renderFooter: {
                fireOnce: true,
                defaultFn: Y.bind('_defRenderFooterFn', this)
            }
        });
    },

    /**
    Initializes the columns, `recordType` and data ModelList.

    @method initializer
    @protected
    **/
    initializer: function () {
        this._initColumns();

        this._initRecordType();

        this._initData();

        this._initViewConfig();

        this._initEvents();

        this.after('columnsChange', this._afterColumnsChange);

        // FIXME: this needs to be added to Widget._buildCfg.custom
        this._UI_ATTRS = {
            BIND: this._UI_ATTRS.BIND.concat(['caption', 'summary']),
            SYNC: this._UI_ATTRS.SYNC.concat(['caption', 'summary'])
        };
    },

    /**
    If the `recordType` attribute is not set, this method attempts to set a
    default value.

    It tries the following methods to determine a default:

    1. If the `data` attribute is set with a ModelList with a `model` property,
       that class is used.
    2. If the `data` attribute is set with a non-empty ModelList, the
       `constructor` of the first item is used.
    3. If the `data` attribute is set with a non-empty array and the first item
       is a Base subclass, its constructor is used.
    4. If the `data` attribute is set with a non-empty array a custom Model
       subclass is generated using the keys of the first item as its `ATTRS`.
    5. If the `_columnMap` property has keys, a custom Model subclass is
       generated using those keys as its `ATTRS`.

    Of none of those are successful, it subscribes to the change events for
    `columns`, `recordType`, and `data` to try again.

    If defaulting the `recordType` and the current `_columnMap` property is
    empty, it will call `_initColumns`.

    @method _initRecordType
    @protected
    **/
    _initRecordType: function () {
        var data, columns, recordType, handle;
            
        if (!this.get('recordType')) {
            data    = this.get('data');
            columns = this._columnMap;

            // Use the ModelList's specified Model class
            if (data.model) {
                recordType = data.model;

            // Or if not configured, use the construct of the first Model
            } else if (data.size && data.size()) {
                recordType = data.model = data.item(0).constructor;

            // Or if the data is an array, build a class from the first item
            } else if (isArray(data) && data.length) {
                recordType = (data[0].constructor.ATTRS) ?
                    data[0].constructor :
                    this._createRecordClass(keys(data[0]));

            // Or if the columns were defined, build a class from the keys
            } else if (keys(columns).length) {
                recordType = this._createRecordClass(keys(columns));
            }

            if (recordType) {
                this.set('recordType', recordType, { silent: true });

                if (!columns || !columns.length) {
                    this._initColumns();
                }
            } else {
                // FIXME: Edge case race condition with
                // new DT({ on/after: { <any of these changes> } }) OR
                // new DT().on( <any of these changes> )
                // where there's not enough info to assign this.data.model
                // at construction. The on/constructor subscriptions will be
                // executed before this subscription.
                handle = this.after(
                    ['columnsChange', 'recordTypeChange','dataChange'],
                    function (e) {
                        // manually batch detach rather than manage separate
                        // subs in case the change was inadequate to populate
                        // recordType. But subs must be detached because the
                        // subscriber recurses to _initRecordType, which would
                        // result in duplicate subs.
                        handle.detach();

                        if (!this.data.model) {
                            // FIXME: resubscribing if there's still not enough
                            // info to populate recordType will place the new
                            // subs later in the callback queue, opening the
                            // race condition even more.
                            this._initRecordType();

                            // If recordType isn't set yet, _initRecordType
                            // will have recreated this subscription.
                            this.data.model = this.get('recordType');
                        }
                    });
            }
        }
    },

    /**
    Initializes the `_viewConfig`, `_headerConfig`, `_bodyConfig`, and
    `_footerConfig` properties with the configuration objects that will be
    passed to the constructors of the `headerView`, `bodyView`, and
    `footerView`.
    
    Extensions can add to the config objects to deliver custom parameters at
    view instantiation.  `_viewConfig` is used as the prototype of the other
    three config objects, so properties added here will be inherited by all
    configs.

    @method _initViewConfig
    @protected
    **/
    _initViewConfig: function () {
        this._viewConfig = {
            source   : this,
            cssPrefix: this._cssPrefix
        };

        // Use prototypal inheritance to share common configs from _viewConfig
        this._headerConfig = Y.Object(this._viewConfig);
        this._bodyConfig   = Y.Object(this._viewConfig);
        this._footerConfig = Y.Object(this._viewConfig);
    },

    /**
    Iterates the array of column configurations to capture all columns with a
    `key` property.  Columns that are represented as strings will be replaced
    with objects with the string assigned as the `key` property.  If a column
    has a `children` property, it will be iterated, adding any nested column
    keys to the returned map. There is no limit to the levels of nesting.

    The result is an object map with column keys as the property name and the
    corresponding column object as the associated value.

    @method _parseColumns
    @param {Object[]|String[]} columns The array of column names or
                configuration objects to scan
    @protected
    **/
    _parseColumns: function (columns) {
        var map  = {},
            keys = {};
        
        function process(cols) {
            var i, len, col, key, yuid, id;

            for (i = 0, len = cols.length; i < len; ++i) {
                col = cols[i];

                if (isString(col)) {
                    // Update the array entry as well, so the attribute state array
                    // contains the same objects.
                    cols[i] = col = { key: col };
                }

                yuid = Y.stamp(col);

                if (isArray(col.children)) {
                    process(col.children);
                } else {
                    key = col.key;

                    if (key) {
                        map[col.key] = col;
                    }

                    // Unique id based on the column's configured name or key,
                    // falling back to the yuid.  Duplicates will have a counter
                    // added to the end.
                    id = col.name || col.key || col._yuid;

                    if (keys[id]) {
                        id += (keys[id]++);
                    } else {
                        keys[id] = 1;
                    }

                    col._id = id;

                    //TODO: named columns can conflict with keyed columns
                    map[id] = col;
                }
            }
        }

        process(columns);

        return map;
    },

    /**
    Builds the table and attaches it to the DOM.  This requires the host class
    to provide a `contentBox` attribute.  This is typically provided by Widget.

    @method renderUI
    @protected
    **/
    renderUI: function () {
        var contentBox = this.get('contentBox'),
            table;

        if (contentBox) {
            // _viewConfig is the prototype for _headerConfig et al.
            this._viewConfig.columns   = this.get('columns');
            this._viewConfig.modelList = this.data;

            contentBox.setAttribute('role', 'grid');

            this.fire('renderTable', {
                headerView  : this.get('headerView'),
                headerConfig: this._headerConfig,

                bodyView    : this.get('bodyView'),
                bodyConfig  : this._bodyConfig,

                footerView  : this.get('footerView'),
                footerConfig: this._footerConfig
            });

            table = this._tableNode;

            if (table) {
                // off DOM or in an existing node attached to a different parentNode
                if (!table.inDoc() || !table.ancestor().compareTo(contentBox)) {
                    contentBox.append(table);
                }
            } else { Y.log('Problem rendering DataTable: table not created', 'warn', 'datatable'); // On the same line to allow builder to strip the else clause
            }
        } else { Y.log('Problem rendering DataTable: contentBox not found', 'warn', 'datatable'); // On the same line to allow builder to strip the else clause
        }
    },

    /**
    Assigns the `_columnMap` property with the parsed results of the array of
    column definitions passed.

    @method _setColumnMap
    @param {Object[]|String[]} columns the raw column configuration objects or
                                       key names
    @protected
    **/
    _setColumnMap: function (columns) {
        this._columnMap = this._parseColumns(columns);
    },

    /**
    Relays attribute assignments of the deprecated `columnset` attribute to the
    `columns` attribute.  If a Columnset is object is passed, its basic object
    structure is mined.

    @method _setColumnset
    @param {Array|Columnset} val The columnset value to relay
    @deprecated This will be removed with the deprecated `columnset` attribute
                in a later version.
    @protected
    **/
    _setColumnset: function (val) {
        if (val && val instanceof Y.Columnset) {
            val = val.get('definitions');
        }

        return isArray(val) ? val : INVALID;
    },

    /**
    Accepts an object with `each` and `getAttrs` (preferably a ModelList or
    subclass) or an array of data objects.  If an array is passes, it will
    create a ModelList to wrap the data.  In doing so, it will set the created
    ModelList's `model` property to the class in the `recordType` attribute,
    which will be defaulted if not yet set.

    If the `data` property is already set with a ModelList, passing an array as
    the value will call the ModelList's `reset()` method with that array rather
    than replacing the stored ModelList wholesale.

    Any non-ModelList-ish and non-array value is invalid.

    @method _setData
    @protected
    **/
    _setData: function (val) {
        if (val === null) {
            val = [];
        }

        if (isArray(val)) {
            if (this.data) {
                if (!this.data.model && val.length) {
                    // FIXME: this should happen only once, but this is a side
                    // effect in the setter.  Bad form, but I need the model set
                    // before calling reset()
                    this.set('recordType', keys(val[0]));
                }

                this.data.reset(val);

                // Return true to avoid storing the data both in the state
                // object underlying the attribute and in the data property.
                // Decreases memory consumption.
                val = true;
            }
            // else pass through the array data, but don't assign this.data
            // Let the _initData process clean up.
        } else if (val && val.each && val.getAttrs) {
            this.data = val;
            // TODO: return true to decrease memory footprint?
        } else {
            val = INVALID;
        }

        return val;
    },

    /**
    Stores an array of columns intended for display in the `_displayColumns`
    property.  This method assumes that if a column configuration object does
    not have children, it is a display column.

    @method _setDisplayColumns
    @param {Object[]} columns Column config array to extract display columns from
    @protected
    **/
    _setDisplayColumns: function (columns) {
        function extract(cols) {
            var display = [],
                i, len, col;

            for (i = 0, len = cols.length; i < len; ++i) {
                col = cols[i];

                if (col.children) {
                    display.push.apply(display, extract(col.children));
                } else {
                    display.push(col);
                }
            }

            return display;
        }

        this._displayColumns = extract(columns);
    },

    /**
    Relays the value assigned to the deprecated `recordset` attribute to the
    `data` attribute.  If a Recordset instance is passed, the raw object data
    will be culled from it.

    @method _setRecordset
    @param {Object[]|Recordset} val The recordset value to relay
    @deprecated This will be removed with the deprecated `recordset` attribute
                in a later version.
    @protected
    **/
    _setRecordset: function (val) {
        var data;

        if (val && val instanceof Y.Recordset) {
            data = [];
            val.each(function (record) {
                data.push(record.get('data'));
            });
            val = data;
        }

        return val;
    },

    /**
    Accepts a Base subclass (preferably a Model subclass). Alternately, it will
    generate a custom Model subclass from an array of attribute names or an
    object defining attributes and their respective configurations (it is
    assigned as the `ATTRS` of the new class).

    Any other value is invalid.

    @method _setRecordType
    @param {Function|String[]|Object} val The Model subclass, array of
            attribute names, or the `ATTRS` definition for a custom model
            subclass
    @return {Function} A Base/Model subclass
    @protected
    **/
    _setRecordType: function (val) {
        var modelClass;

        // Duck type based on known/likely consumed APIs
        if (isFunction(val) && val.prototype.set && val.prototype.getAttrs) {
            modelClass = val;
        } else if (isObject(val)) {
            modelClass = this._createRecordClass(val);
        }

        return modelClass || INVALID;
    },

    /**
    Creates, removes, or updates the table's `<caption>` element per the input
    value.  Empty values result in the caption being removed.

    @method _uiSetCaption
    @param {HTML} htmlContent The content to populate the table caption
    @protected
    **/
    _uiSetCaption: function (htmlContent) {
        var caption = this._tableNode.one('> caption');

        if (htmlContent) {
            if (!this._captionNode) {
                this._captionNode = Y.Node.create(
                    fromTemplate(this.CAPTION_TEMPLATE, {
                        className: this.getClassName('caption')
                    }));
            }

            this._captionNode.setContent(htmlContent);

            if (caption) {
                if (!caption.compareTo(this._captionNode)) {
                    caption.replace(this._captionNode);
                }
            } else {
                this._tableNode.prepend(this._captionNode);
            }

            this._captionNode = caption;
        } else {
            if (this._captionNode) {
                if (caption && caption.compareTo(this._captionNode)) {
                    caption = null;
                }

                this._captionNode.remove(true);
                delete this._captionNode;
            }

            if (caption) {
                caption.remove(true);
            }
        }
    },

    /**
    Updates the table's `summary` attribute with the input value.

    @method _uiSetSummary
    @protected
    **/
    _uiSetSummary: function (summary) {
        this._tableNode.setAttribute('summary', summary || '');
    },

    /**
    Sets the `boundingBox` and table width per the input value.

    @method _uiSetWidth
    @param {Number|String} width The width to make the table
    @protected
    **/
    _uiSetWidth: function (width) {
        if (isNumber(width)) {
            // DEF_UNIT from Widget
            width += this.DEF_UNIT;
        }

        if (isString(width)) {
            this._uiSetDim('width', width);
            this._tableNode.setStyle('width', width);
        }
    },

    /**
    Verifies the input value is a function with a `render` method on its
    prototype.  `null` is also accepted to remove the default View.

    @method _validateView
    @protected
    **/
    _validateView: function (val) {
        // TODO support View instances?
        return val === null || (isFunction(val) && val.prototype.render);
    }
});
