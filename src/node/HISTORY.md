Node Change History
===================

3.5.0
-----

  * Bug fix: Children collection now accessible from documentFragments. [Ticket 2531356] 
  * Bug fix: The compareTo() method now works across sandboxes. [Ticket 2530381] 


3.4.1
-----

  * Bug fix: Calling insert(null) was throwing an error. [Ticket 2529991]

  * Bug fix: The removeAttribute method was not chainable in IE < 9.
    [Ticket 2529230]

  * Bug fix: Calling Y.all() without arguments was failing to return an empty
    NodeList. [Ticket 2530164]

  * Added optional stopAt function/selector argument for ancestor/ancestors().


3.4.0
-----

  * [!] The empty() method now always does a recursive purge. [Ticket 2529829] 

  * Added the getDOMNode() and getDOMNodes() methods to Node and NodeList
    prototypes. 

  * The one() method now accepts IDs that begin with a number. [Ticket 2529376]

  * Bug fix: NodeList show()/hide() methods were broken with Transition.
    [Ticket 2529908]

  * Bug fix: Some NodeList array methods were returning incorrectly.
    [Ticket 2529942]


3.3.0
-----

  * Added wrap()/unwrap(), show()/hide(), empty(), and load() methods.

  * Added Array 1.5 methods to NodeList.

  * Added the destroy() method to NodeList. [Ticket 2529256]

  * Added the once() method to NodeList. [Ticket 2529369]

  * The appendChild() and insertBefore() methods now accept HTML.
    [Ticket 2529301]

  * Added the appendTo() method. [Ticket 2529299]

  * Added the ancestors() method. [Ticket 2528610]

  * The setStyle() method now ignores undefined values.
  
  * Bug fix: Enable querying cloned nodes in IE 6/7. [Ticket 2529487]


3.2.0
-----

  * Added the transition() method.

  * Bug fix: checked pseudo-class for IE input elements. [Ticket 2528895]
  
  * Bug fix: Fixed IE8 input element rendering. [Ticket 2529035]


3.1.1
-----

  * Bug fix: The setContent() method incorrectly handled falsey values.
    [Ticket 2528740]


3.1.0
-----

  * Added support for invalid IDs. [Ticket 2528195]

  * Fix duplicate IDs across YUI instances. [Ticket 2528199]

  * Allow empty setContent() call to remove content. [Ticket 2528269]

  * Bug fix: Arguments passed to next() were being incorrectly handled.
    [Ticket 2528295]


3.0.0
-----

  * Initial release.
