DataTable Change History
========================

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
