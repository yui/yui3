DataTable Change History
========================

3.4.0
-----

  * Now creates a new `RecordSet` for each instance rather than reusing the same
    one. [Ticket #2529980]
  
  * Captions are only added if a value is set for the `caption` attribute
    [Ticket #2529968]


3.3.0
-----

  * Initial release.
  
  * Known Android issue (Ticket #2529761): Scrolling is currently not supported
    on the Android WebKit browser.
