Highlight Change History
========================

3.4.1
-----

  * Now using ClassNameManager to get the CSS class name for the highlight
    element, so custom class prefixes other than "yui3" will be respected.
    [Ticket #2530811]


3.4.0
-----

  * Fixed a bug that resulted in invalid escaped HTML when running a highlighter
    with an empty needle. [Ticket #2529945]

  * Fixed an off-by-one bug in which an unhighlighted single char at the end of
    a highlighted string would be discarded when using `allFold()`. [Ticket
    #2530529]


3.3.0
-----

  * Initial release.
