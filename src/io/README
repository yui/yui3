*** 3.3.0 ***

* Fixed ticket 2528898.  When using io-xdr to load io.swf, a date-time stamp
will appended, as a querystring, to the transport source for IE.

* Implemented enhancement 2529324.  Default HTTP headers can be suppressed
in the transaction's configuration object by setting the header with a value
of "disable."  For example:

var config = { headers: { "X-Requested-With": "disable" } };

* Implemented enhancement 2528710.  Use Y.io without listening for the
"io:xdrReady" event.

* Fixed ticket 2529290.

*** 3.2.0 ***

* Fixed ticket 2528646 : Fixed malformed HTML entities in JSON response, when
using io-upload-iframe.

* Fixed ticket 2528893 : Configuration HTTP headers should override preset
HTTP headers, when identical.

*** 3.1.2 ***

* Fix security vulnerability in io-xdr when using the Flash transport.
Removed Security.allowDomain("*") setting from "io.as" (source) and
"io.swf" (compiled).  The implementation reverts back to the version
in 3.0.0.

This reversion prevents third-party sites from being able to load "io.swf"
from a disparate domain, and make HTTP requests with the SWF's domain
privileges, and passing the domain's credentials.  Only the domain serving
"io.swf" will be permitted to load it, and call its fields.

See the "Security Bulletin" at developer.yahoo.com/yui/3/io/ for more details.

*** 3.1.1 ***

* Fixed ticket #2528739 : Synchronous IO requests broken in IE

*** 3.1.0 ***

* Implemented enhancement 2528181.  YUI io now supports synchronous transactions
for same-domain requests.  To enable synchronous transactions, set the
configuration property "sync" to true; the default behavior is false.  During a
synchronous request, all io events will fire, and response data are accessible
through the events.  Response data are also returned by io, as an alternative.
For example:

/*
 * var request = Y.io(uri, { sync: true });
 *
 * var request will contain the following fields, when the transaction is
 * complete:
 * - id
 * - status
 * - statusText
 * - getResponseHeader()
 * - getAllResponseHeaders()
 * - responseText
 * - responseXML
 * - arguments
 */

When making synchronous requests:
- The transaction cannot be aborted,
- The transaction's progress cannot be monitored.

* Implemented enhancement 2528393.  Arguments defined in the configuration
object are now passed to io global event handlers, as well.

* Implemented enhancement 2528313.

*** 3.0.0 ***

* Native cross-domain transactions are now supported in io-xdr.  To specify an
XDR transaction, set the configuration object with the following properties:

- use: Specify either 'native' or 'flash' as the desired XDR transport.
- credentials: Set to true if cookies are to be sent with the request.  Does not
work with XDomainRequest(e.g., IE8) or the Flash transport.
- datatType: Set to 'xml' if the response is an XML document.

For example:
var configuration.xdr = {
	use: 'flash', //Required -- 'flash' or 'native'.
	credentials: true, //Optional.
	dataType: 'xml' //Optional.
}

The 'use' property is required.  The others are optional or functionality-
specific.

When using the native transport, io will fallback to the Flash transport if the
browser is not capable of supporting the native mode.  Make sure the resource
responds with the correct "Access-Control-Allow-Origin" header before attempting
a native XDR request.

* The sub-module 'datatype-xml' is now a dependency for io-xdr, to support XML
response data in XDR transactions.

* XDR transport initialization is simplified to one required value -- the path
to Flash transport. For example: Y.io.transport({ src:'io.swf' });

*** 3.0.0 beta 1 ***

* The io-queue sub-module now implements YUI Queue.  The io queue interface
allows transaction callback handlers to be processed in the order the
transactions were sent, regardless of actual server response order.  For
example:

- io queue is used to make three requests.
- The actual server response order happens to be: transaction 2, 1, 3.
- However, using the queue interface, the transaction callbacks are processed in
the order of: transaction 1, 2, 3.

* All transaction event flows now resolves to "success" or "failure"; the abort
event is removed.  Transaction abort and timeout conditions resolve to
"failure", and is distinguishable in the response data.  Specifically, the
response object's status and statusText properties will be populated as:

- response.status will be 0.
- response.statusText will be set to "timeout" or "abort" to differentiate the
two possible conditions.

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