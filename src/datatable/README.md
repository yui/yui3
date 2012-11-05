DataTable
=========

Provides a Widget that is responsible for rendering columnar data into a highly
customizable and fully accessible HTML table. The core functionality of
DataTable is to visualize structured data as a table. A variety of Plugins can
then be used to add features to the table such as sorting and scrolling.

As of 3.5.0, the architecture and APIs have changed to the following architecture:

Class composition
---------------------------

* `Y.DataTable.Core`
    * Class extension
    * APIs and ATTRS for extending Widget
    * Responsible for rendering the `<table>`, `<caption>`, and empty `<thead>`, `<tfoot>`, and `<tbody>` as appropriate
* `Y.DataTable.Base`
    * Widget generated from `Y.Base.create('datatable', Y.Widget, [Core])`
    * Featureless DataTable constructor
    * Defaults `headerView` to `Y.DataTable.HeaderView` and `bodyView` to `Y.DataTable.BodyView`
* `Y.DataTable`
    * `Y.DataTable.Base` Subclass
    * Constructor with all `use()`d features
    * Namespace for DT-specific extensions and component classes
* `Y.DataTable.HeaderView`
    * `Y.View` subclass
    * Renders the content of the `<thead>`
* `Y.DataTable.BodyView`
    * `Y.View` subclass
    * Renders the content of the `<tbody>`
* `Y.DataTable.ColumnWidths`
    * Class extension
    * Renders `<colgroup>` and `<col>`s
    * Supports `width` configuration in column defs
    * Adds `setColumnWidth()` method
    * Automatically mixed onto `Y.DataTable`
* `Y.DataTable.Mutable`
    * Class extension
    * Adds `addRow()`, `addRows()`, `addColumn()`, `modifyColumn()`, etc
    * Automatically mixed onto `Y.DataTable`

Events
----------

Is a bubble target for it's ModelList and all configured View instances, so inherits all their events.  Events fired directly from DataTable:

* `renderTable` - fired from `renderUI`, default function creates the `<table>` and `<caption>` and fires the other render events
* `renderHead` - fired from `renderTable`'s default function IFF `headerView` is set. Default action calls `render` on the View
* `renderFoot` - (same)
* `renderBody` - (same)
* `addColumn` - From `Y.DataTable.Mutable` extension, fired from the so-named method
* `removeColumn` - (same)
* `modifyColumn` - (same)
* `moveColumn` - (same)

Properties
---------------

* `data` - the ModelList instance
* `head` - the `headerView` instance, populated by `renderHead`'s default function
* `body` - (same)
* `foot` - (same)
* `_tableNode` - Node instance of the `<table>` element
* `_captionNode` - likewise for `<caption>`
* `_colgroupNode` - and for `<colgroup>`, from `Y.DataTable.ColumnWidths`
* `_theadNode` - you guessed it
* `_tbodyNode` - yep, but only one.  This might come back to haunt me
* `_tfootNode` - predictably
* `_viewConfig` - base config object (aka prototype) for...
* `_headerConfig` - specific configuration values to pass to the `headerView` constructor
* `_bodyConfig` - specific configuration values to pass to the `bodyView` constructor
* `_footerConfig` - specific configuration values to pass to the `footerView` constructor


Render lifecycle
-----------------------

This is the base rendering; augmented rendering for column widths left out.

1. `renderUI` fires `renderTable`
2. `renderTable`'s `defaultFn` creates the `<table>`
3. if `headerView` is set
    1. creates a `<thead>`
    2. creates an instance of the `headerClass`, passing the `_headerConfig` object plus the `<thead>` as a "container", and `data` as the "modelList"
    3. fires the `renderHead` event, passing the View instance as payload
    4. `renderHead`'s `defaultFn` calls the View's `render()` method
4. repeat for `footerView`, then `bodyView`
5. `bindUI` does the usual thing
6. `syncUI` creates the `<caption>` if the attribute is set, and so for the `<table>`'s `summary` attribute

See the user guide (http://yuilibrary.com/datatable/) for more information.
