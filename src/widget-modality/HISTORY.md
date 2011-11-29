Widget Modality Change History
==============================

3.5.0
-----

  * Initialization logic will now always run, even when a widget is constructed
    with `{modal: false}`; previously the initialization logic did not run in
    this case. [Ticket #2531401]

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
