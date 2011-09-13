DataTable Change History
========================

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
