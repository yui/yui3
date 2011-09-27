Widget Modality Change History
==============================

3.4.1
-----

  * Fixed focus-contention issues which caused infinite recursion when multiple
    modal Panels were visible on the page at the same time. [Ticket #2530953]

  * It is now possible to instantiate a Widget that uses the WidgetModality
    extension without needing to pass in a configuration Object.
    [Contributed by Jakub Kuźma] [Ticket #2531086]

  * Replaced references to `document` with `Y.config.doc`. [Ticket #2531220]

3.4.0
-----

  * Initial release.
