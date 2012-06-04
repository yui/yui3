/**
A Widget for displaying tabular data.  The base implementation of DataTable
provides the ability to dynamically generate an HTML table from a set of column
configurations and row data.

Two classes are included in the `datatable-base` module: `Y.DataTable` and
`Y.DataTable.Base`.

@module datatable
@submodule datatable-base
@main datatable
@since 3.5.0
**/

// DataTable API docs included before DataTable.Base to make yuidoc work
/**
A Widget for displaying tabular data.  Before feature modules are `use()`d,
this class is functionally equivalent to DataTable.Base.  However, feature
modules can modify this class in non-destructive ways, expanding the API and
functionality.

This is the primary DataTable class.  Out of the box, it provides the ability
to dynamically generate an HTML table from a set of column configurations and
row data.  But feature module inclusion can add table sorting, pagintaion,
highlighting, selection, and more.

<pre><code>
// The functionality of this table would require additional modules be use()d,
// but the feature APIs are aggregated onto Y.DataTable.
// (Snippet is for illustration. Not all features are available today.)
var table = new Y.DataTable({
    columns: [
        { type: 'checkbox', defaultChecked: true },
        { key: 'firstName', sortable: true, resizable: true },
        { key: 'lastName', sortable: true },
        { key: 'role', formatter: toRoleName }
    ],
    data: {
        source: 'http://myserver.com/service/json',
        type: 'json',
        schema: {
            resultListLocator: 'results.users',
            fields: [
                'username',
                'firstName',
                'lastName',
                { key: 'role', type: 'number' }
            ]
        }
    },
    recordType: UserModel,
    pagedData: {
        location: 'footer',
        pageSizes: [20, 50, 'all'],
        rowsPerPage: 20,
        pageLinks: 5
    },
    editable: true
});
</code></pre>

### Column Configuration

The column configurations are set in the form of an array of objects, where
each object corresponds to a column.  For columns populated directly from the
row data, a 'key' property is required to bind the column to that property or
attribute in the row data.

Not all columns need to relate to row data, nor do all properties or attributes
of the row data need to have a corresponding column.  However, only those
columns included in the `columns` configuration attribute will be rendered.

Other column configuration properties are supported by the configured
`headerView`, `bodyView`, `footerView` classes as well as any features added by
plugins or class extensions.  See the description of DataTable.HeaderView,
DataTable.BodyView, and other DataTable feature classes to see what column
properties they support.

Some examples of column configurations would be:

<pre><code>
// Basic
var columns = [{ key: 'firstName' }, { key: 'lastName' }, { key: 'age' }];

// For columns without any additional configuration, strings can be used
var columns = ['firstName', 'lastName', 'age'];

// Multi-row column headers (see DataTable.HeaderView for details)
var columns = [
    {
        label: 'Name',
        children: [
            { key: 'firstName' },
            { key: 'lastName' }
        ]
    },
    'age' // mixing and matching objects and strings is ok
];

// Including columns that are not related 1:1 to row data fields/attributes
// (See DataTable.BodyView for details)
var columns = [
    {
        label: 'Name', // Needed for the column header
        formatter: function (o) {
            // Fill the column cells with data from firstName and lastName
            if (o.data.age > 55) {
                o.className += ' senior';
            }
            return o.data.lastName + ', ' + o.data.firstName;
        }
    },
    'age'
];

// Columns that include feature configurations (for illustration; not all
// features are available today).
var columns = [
    { type: 'checkbox', defaultChecked: true },
    { key: 'firstName', sortable: true, resizable: true, min-width: '300px' },
    { key: 'lastName', sortable: true, resizable: true, min-width: '300px' },
    { key: 'age', emptyCellValue: '<em>unknown</em>' }
];
</code></pre>

### Row Data Configuration

The `data` configuration attribute is responsible for housing the data objects that will be rendered as rows.  You can provide this information in two ways by default:

1. An array of simple objects with key:value pairs
2. A ModelList of Base-based class instances (presumably Model subclass
   instances)

If an array of objects is passed, it will be translated into a ModelList filled
with instances of the class provided to the `recordType` attribute.  This
attribute can also create a custom Model subclass from an array of field names
or an object of attribute configurations.  If no `recordType` is provided, one
will be created for you from available information (see `_initRecordType`).
Providing either your own ModelList instance for `data`, or at least Model
class for `recordType`, is the best way to control client-server
synchronization when modifying data on the client side.

The ModelList instance that manages the table's data is available in the `data`
property on the DataTable instance.


### Rendering

Table rendering is a collaborative process between the DataTable and its
configured `headerView`, `bodyView`, and `footerView`.  The DataTable renders
the `<table>` and `<caption>`, but the contents of the table are delegated to
instances of the classes provided to the `headerView`, `bodyView`, and
`footerView` attributes. If any of these attributes is unset, that portion of
the table won't be rendered.

DataTable.Base assigns the default `headerView` to `Y.DataTable.HeaderView` and
the default `bodyView` to `Y.DataTable.BodyView`, though either can be
overridden for custom rendering.  No default `footerView` is assigned. See
those classes for more details about how they operate.


@class DataTable
@extends DataTable.Base
@since 3.5.0
**/

// DataTable API docs included before DataTable.Base to make yuidoc work
/**
The baseline implementation of a DataTable.  This class should be used
primarily as a superclass for a custom DataTable with a specific set of
features.  Because features can be composed onto `Y.DataTable`, custom
subclasses of DataTable.Base will remain unmodified when new feature modules
are loaded.

Example usage might look like this:

<pre><code>
// Custom subclass with only sorting and mutability added.  If other datatable
// feature modules are loaded, this class will not be affected.
var MyTableClass = Y.Base.create('table', Y.DataTable.Base,
                       [ Y.DataTable.Sort, Y.DataTable.Mutable ]);

var table = new MyTableClass({
    columns: ['firstName', 'lastName', 'age'],
    data: [
        { firstName: 'Frank', lastName: 'Zappa', age: 71 },
        { firstName: 'Frank', lastName: 'Lloyd Wright', age: 144 },
        { firstName: 'Albert', lastName: 'Einstein', age: 132 },
        ...
    ]
});

table.render('#over-there');

// DataTable.Base can be instantiated if a featureless table is needed.
var table = new Y.DataTable.Base({
    columns: ['firstName', 'lastName', 'age'],
    data: [
        { firstName: 'Frank', lastName: 'Zappa', age: 71 },
        { firstName: 'Frank', lastName: 'Lloyd Wright', age: 144 },
        { firstName: 'Albert', lastName: 'Einstein', age: 132 },
        ...
    ]
});

table.render('#in-here');
</code></pre>

DataTable.Base is built from DataTable.Core, and sets the default `headerView`
to `Y.DataTable.HeaderView` and default `bodyView` to `Y.DataTable.BodyView`.

@class Base
@extends Widget
@uses DataTable.Core
@namespace DataTable
@since 3.5.0
**/
Y.DataTable.Base = Y.Base.create('datatable', Y.Widget, [Y.DataTable.Core], {

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
    @since 3.5.0
    **/
    delegate: function () {
        var contentBox = this.get('contentBox');

        return contentBox.delegate.apply(contentBox, arguments);
    },

    /**
    Destroys the table `View` if it's been created.

    @method destructor
    @protected
    @since 3.6.0
    **/
    destructor: function () {
        if (this.view) {
            this.view.destroy();
        }
    },

    /**
    Returns the `<td>` Node from the given row and column index.  Alternately,
    the `seed` can be a Node.  If so, the nearest ancestor cell is returned.
    If the `seed` is a cell, it is returned.  If there is no cell at the given
    coordinates, `null` is returned.

    Optionally, include an offset array or string to return a cell near the
    cell identified by the `seed`.  The offset can be an array containing the
    number of rows to shift followed by the number of columns to shift, or one
    of "above", "below", "next", or "previous".

    <pre><code>// Previous cell in the previous row
    var cell = table.getCell(e.target, [-1, -1]);

    // Next cell
    var cell = table.getCell(e.target, 'next');
    var cell = table.getCell(e.taregt, [0, 1];</pre></code>

    This is actually just a pass through to the `view` instance's method
    by the same name.

    @method getCell
    @param {Number[]|Node} seed Array of row and column indexes, or a Node that
        is either the cell itself or a descendant of one.
    @param {Number[]|String} [shift] Offset by which to identify the returned
        cell Node
    @return {Node}
    @since 3.5.0
    **/
    getCell: function (seed, shift) {
        return this.view && this.view.getCell &&
            this.view.getCell.apply(this.view, arguments);
    },

    /**
    Returns the `<tr>` Node from the given row index, Model, or Model's
    `clientId`.  If the rows haven't been rendered yet, or if the row can't be
    found by the input, `null` is returned.

    This is actually just a pass through to the `view` instance's method
    by the same name.

    @method getRow
    @param {Number|String|Model} id Row index, Model instance, or clientId
    @return {Node}
    @since 3.5.0
    **/
    getRow: function (id) {
        return this.view && this.view.getRow &&
            this.view.getRow.apply(this.view, arguments);
    },

    /**
    Attaches subscriptions to relay core change events to the view.

    @method bindUI
    @protected
    @since 3.6.0
    **/
    bindUI: function () {
        var relay = Y.bind('_relayCoreAttrChange', this);

        this._eventHandles.relayCoreChanges = this.after(
            ['columnsChange', 'dataChange', 'summaryChange',
             'captionChange', 'widthChange'], relay);
    },

    _defRenderViewFn: function (e) {
        e.view.render();
    },

    initializer: function () {
        var preventViewRender = Y.bind('_preventViewRenderFn', this);

        this.publish({
            renderView  : { defaultFn: Y.bind('_defRenderViewFn', this) },
            renderTable : { preventedFn: preventViewRender },
            renderHeader: { preventedFn: preventViewRender },
            renderBody  : { preventedFn: preventViewRender },
            renderFooter: { preventedFn: preventViewRender }
        });
    },

    _onViewRender: function (e) {
        // Relay event from DataTable instance for backward compatibility
        this.fire(e.type.slice(e.type.lastIndexOf(':') + 1), {
            originEvent: e,
            view       : e.view
        });
    },

    /**
    Relays the `preventDefault` to the originating event.

    @method _preventViewRenderFn
    @param {EventFacade} e The render event
    @protected
    @since 3.6.0
    **/
    _preventViewRenderFn: function (e) {
        e.originEvent && e.originEvent.preventDefault();
    },

    /**
    Relays attribute changes to the instance's `view`.

    @method _relayCoreAttrChange
    @param {EventFacade} e The change event
    @protected
    @since 3.6.0
    **/
    _relayCoreAttrChange: function (e) {
        var attr = (e.attrName === 'data') ? 'modelList' : e.attrName;

        this.view.set(attr, e.newVal);
    },

    renderUI: function () {
        var View = this.get('view');

        if (View) {
            this.view = new View(
                Y.merge(
                    this.getAttrs(),
                    {
                        host     : this,
                        container: this.get('contentBox'),
                        modelList: this.data
                    },
                    this.get('viewConfig')));

            this.view.on(
                ['renderTable', 'renderHeader', 'renderBody', 'renderFooter'],
                this._onViewRender, this);

            //this.fire('renderView', { view: this.view });
        }
    },

    /**
    Updates the UI with the current attribute state.  Fires the `renderHeader`,
    `renderBody`, and `renderFooter` events;

    @method syncUI
    @since 3.5.0
    **/
    syncUI: function () {
        if (this.view) {
            this.fire('renderView', { view: this.view });
        }
    },

    /**
    Verifies the input value is a function with a `render` method on its
    prototype.  `null` is also accepted to remove the default View.

    @method _validateView
    @protected
    @since 3.5.0
    **/
    _validateView: function (val) {
        // TODO support View instances?
        return val === null || (Y.Lang.isFunction(val) && val.prototype.render);
    }
}, {
    ATTRS: {
        /**
        The View class used to render the `<table>` into the Widget's
        `contentBox`.  This View can handle the entire table rendering itself
        or delegate to other Views.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        When the DataTable is rendered, an instance of this View will be
        created and its `render()` method called.  The View instance will be
        assigned to the DataTable instance's `view` property.

        @attribute view
        @type {Function}
        @default Y.DataTable.TableView
        @since 3.6.0
        **/
        view: {
            value: Y.DataTable.TableView,
            validator: '_validateView'
        },

        /**
        Configuration object passed to the class constructor in `view`
        during render.

        @attribute viewConfig
        @type {Object}
        @default undefined (initially unset)
        @protected
        @since 3.6.0
        **/
        viewConfig: {}

        /**
        If the View class assigned to the DataTable's `view` attribute supports
        it, this class will be used for rendering the contents of the
        `<thead>`&mdash;the column headers for the table.
        
        Similar to `view`, the instance of this View will be assigned to the
        DataTable instance's `head` property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute headerView
        @type {Function|Object}
        @default Y.DataTable.HeaderView
        @since 3.5.0
        **/
        /*
        headerView: {
            value: Y.DataTable.HeaderView,
            validator: '_validateView'
        },
        */

        /**
        Configuration object passed to the class constructor in `headerView`
        during render.

        @attribute headerConfig
        @type {Object}
        @default undefined (initially unset)
        @protected
        @since 3.6.0
        **/
        //headConfig: {},

        /**
        If the View class assigned to the DataTable's `view` attribute supports
        it, this class will be used for rendering the contents of the `<tfoot>`.
        
        Similar to `view`, the instance of this View will be assigned to the
        DataTable instance's `foot` property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute footerView
        @type {Function|Object}
        @since 3.5.0
        **/
        /*
        footerView: {
            validator: '_validateView'
        },
        */

        /**
        Configuration object passed to the class constructor in `footerView`
        during render.

        @attribute footerConfig
        @type {Object}
        @default undefined (initially unset)
        @protected
        @since 3.6.0
        **/
        //footerConfig: {},

        /**
        If the View class assigned to the DataTable's `view` attribute supports
        it, this class will be used for rendering the contents of the `<tbody>`
        including all data rows.
        
        Similar to `view`, the instance of this View will be assigned to the
        DataTable instance's `body` property.

        It is not strictly necessary that the class function assigned here be
        a View subclass.  It must however have a `render()` method.

        @attribute bodyView
        @type {Function}
        @default Y.DataTable.BodyView
        @since 3.5.0
        **/
        /*
        bodyView: {
            value: Y.DataTable.BodyView,
            validator: '_validateView'
        },
        */

        /**
        Configuration object passed to the class constructor in `bodyView`
        during render.

        @attribute bodyConfig
        @type {Object}
        @default undefined (initially unset)
        @protected
        @since 3.6.0
        **/
        //bodyConfig: {}
    }
});

// The DataTable API docs are above DataTable.Base docs.
Y.DataTable = Y.mix(
    Y.Base.create('datatable', Y.DataTable.Base, []), // Create the class
    Y.DataTable); // Migrate static and namespaced classes
