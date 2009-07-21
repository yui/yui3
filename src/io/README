*** 3.0.0 beta 1 ***

* The io-queue sub-module now implements YUI Queue.  The io queue interface allows transaction callback handlers to be processed in the order the transactions were sent, regardless of actual server response order.  For example:

- io queue is used to make three requests.
- The actual server response order happens to be: transaction 2, 1, 3.
- However, using the queue interface, the transaction callbacks are processed in the order of: transaction 1, 2, 3.

* All transaction event flows now resolves to "success" or "failure"; the abort
event was removed.  Transaction abort and timeout conditions resolve to "failure",
and is distinguishable in the response data.  Specifically, the response
object's status and statusText properties will be populated as:

- response.status will be 0.
- response.statusText will be set to "timeout" or "abort" to differentiate the two possible conditions.

* A new "end" event is introduced in the transaction event flow; this is the
terminal event for all transactions.  Its event handler signature is the same as
the "start" event, receiving the transaction id and user-defined arguments.

- The global event name is "io:end".
- To subscribe to the transaction event, define the "end" property in the
transaction's configuration object. { on: { end: function() { } } }

*** 3.0.0 PR2 ***

* YUI io is now comprised of several modules, allowing users to specify and
implement only the needed modules.  These modules are:

- io-base.js: This is the IO base class, using XMLHttpRequest as the transport.
- io-xdr.js: This sub-module extends IO to enable cross-domain transactions
using Flash as the transport.
- io-form.js: This sub-module extends IO to enable the serialization of an HTML
form as transaction data.
- io-upload-iframe.js: This sub-module extends IO, to allow file uploads with an
HTML form, using an iframe transport.
- io-queue.js: This sub-module extends IO to add transaction queuing
capabilities.

* [FIXED] SF2262707.  If defined in the configuration object, user-specified,
HTTP "Content-Type" headers will correctly override POST default headers, for
HTTP POST transactions.

* XML is not supported as a response datatype when using sub-modules io-xdr.js
and io-upload-iframe.js.

*** 3.0.0 PR1 ***

* Initial Release