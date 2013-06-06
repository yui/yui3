DataTable Change History
========================

3.10.3
------

* No changes.

3.10.2
------

* No changes.

3.10.1
------

* No changes.

3.10.0
------

* Fix renderBody in the docs and in table-message. [albertosantini]

* Add italian language files to the components. [albertosantini]  

3.9.1
-----

* No changes.

3.9.0
-----

* Making sortable datatableheaders unselectable [Pull Request #286]
  [Pull Request #378] [Ticket #2532825] [ItsAsbreuk] [apipkin]

* French translations for the DataTable [Pull Request #454] [ArnaudD] [davglass]

* Merged in #392: Named cell formatters [satyam] 

3.8.1
-----

* Avoid processing columns if there aren't any to allow empty tables.
  [Pull Request #176] [Mark Woon]

* Default sort for text columns is now case insensitive. Added `caseSensitive`
  attribute to table columns config. Setting `caseSensitive` to `true` will
  bypass the case insensitive sort speeding up sort in large data sets, where
  case insensitivity is not required. [Ticket #2532134] [Pull Request #281]
  [clanceyp]

3.8.0
-----

* No changes.

3.7.3
-----

* No changes.

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

* No changes.

3.6.0
-----

 * Extracted all rendering logic into new class Y.DataTable.TableView.  Added
   `view` and `viewConfig` attributes to configure which view to use to render
   the table.  `headerView`, `bodyView`, and `footerView` are all passed along
   to this View class to delegate rendering (if appropriate).  You can now have
   a single `view` config on DT to render the entire table and contents.
   NOTE: if you were subscribing to `renderHeader`, `renderBody`, or
   `renderFooter` events, they now have to be prefixed with 'table' (E.g.
   `table.after('table:renderBody', fn);`
 * Column configuration array is now copied when assigned.  This allows the same
   array and column config objects to be used for multiple tables.

3.5.1
-----

 * No changes.

3.5.0
-----

 * Major refactor.  See README for details about the new architecture.
 * Y.DataTable is now instantiable, in addition to Y.DataTable.Base
 * Recordset use has been replaced by ModelList. `recordset` attribute passes through to `data` attribute.  This is incomplete back compat because get('recordset') doesn't return a Recordset instance.
 * Columnset use has been removed. Column configuration is managed as an array of objects. `columnset` attribute passes through to `columns` attribute.  The same incomplete back compat applies.
 * DataTable doesn't render the table contents or header contents. That is left to `bodyView` and `headerView` classes.
 * Support for rendering a `<tfoot>` is baked in.
 * `datatable-datasource` modified to update a DataTable's `data` attribute rather than the (deprecated) `recordset`.
 * Scrollable tables now support captions
 * Added datatable-mutable module to provide addRow, removeRow, addColumn, etc
 * Added datatable-column-widths module to set column widths

 * Liner `<div>`s have been removed from the cell template in the default markup
 * `<colgroup>` is not rendered by default (added via `datatable-column-widths` extension)
 * message `<tbody>` is not added by default (compatibility module not added yet)
 * CSS uses `border-collapse: collapse` for all user agents instead of `separate` for most, but `collapse` for IE
 * CSS for base only includes styles appropriate to rendering the base markup
 * header gradient rendered as CSS gradient where possible, falling back to background image.
 * Added class "yui3-datatable-table" to the `<table>`
 * Added class "yui3-datatable-header" to all `<th>`s
 * Changed class "yui3-column-foo" to "yui3-datatable-col-foo" for `<th>`s and `<td>`s
 * Added class "yui3-datatable-cell" to all `<td>`s
 * CSS no longer references tags, only classes
 * ARIA grid, row, and gridcell roles added to the markup templates

 * `recordset` attribute deprecated in favor of `data` attribute
 * `columnset` attribute deprecated in favor of `columns` attribute
 * `tdValueTemplate`, `thValueTemplate`, and `trTemplate` attributes and `tdTemplate` and `thTemplate` properties dropped in favor of CELL_TEMPLATE and ROW_TEMPLATE properties on the `bodyView` and `headerView` instances.
 * Now fires `renderTable`, `renderHeader`, `renderBody`, and `renderFooter` events
 * Added `data`, `head`, `body`, and `foot` properties to contain instances of the ModelList and section Views.
 * Columns now MAY NOT have `key`s with dots in them.  It competes with Attribute's support for complex attributes. When parsing data with DataSchema.JSON, use the `locator` configuration to extract the value, but use a simple `key` to store/reference it from DT.


3.4.1
-----

  * Removed the `td` property from the object passed to cell formatters by
    default.  Implementers should return innerHTML or modify the `tdTemplate`
    and set properties on the `o` object passed to the formatter for
    template substitution.  For implementers that *must* have a Node for the
    cell, a new prototype method `createCell(o)` may be called from formatters.
    The method creates a Node using the standard template substitution of
    `tdTemplate` + values stored in `o`.  It then adds the cell Node to the
    `td` property on `o` and returns the created Node.  That said, using strings
    will make the table faster (maybe not in this release, but in 3.5.0).
    [Ticket #2529920]

  * Added a column attribute `emptyCellValue` to populate cells without content
    values. In your column definition, specify a value you want to show in the
    rendered cell in the case of missing data.  The default `emptyCellValue` is
    the empty string, so no more "{value}" showing up in tables.
    [Ticket #2529921]

3.4.0
-----

  * Render cycle revamped to avoid calls through the Attribute API for each
    cell.  This should improve render performance somewhat.  More performance
    improvements to come in 3.5.0.  The object passed through the render loops'
    supporting methods now has additional properties and many properties are
    added earlier.  o.td still refers to the cell added by the previous
    loop iteration--a proper fix is coming in 3.5.0. Look in the Gallery for
    a patch module.

  * Now creates a new `RecordSet` for each instance rather than reusing the same
    one. [Ticket #2529980]

  * Captions are only added if a value is set for the `caption` attribute
    [Ticket #2529968]


3.3.0
-----

  * Initial release.

  * Known Android issue (Ticket #2529761): Scrolling is currently not supported
    on the Android WebKit browser.
