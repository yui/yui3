IO Utility Change History
=========================

3.10.3
------

* [security] Hardened SWF file by filtering all data passed through ExternalInterface to fix XSS vulnerability.

3.10.2
------

* No changes.

3.10.1
------

* [security] Hardened SWF file by filtering all data passed through ExternalInterface to fix XSS vulnerability.

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* Normalized IO's handling of falsy request and response bodies. A majority of
  the environments want request/response bodies to always be a string, so they
  use an empty string instead of undefined, null, etc.

  This specifically fixes two issues:

  * IE 10 converts a response body of `undefined` to the literal string:
    `"undefined"`. No other environments do this, so a change has been made to
    default the request body to `""` unless it has a non-falsy value.

  * IO's node.js transport uses the Request npm module, which returns
    `undefined` when a response has no body. This normalize IO's `responseText`
    to an empty string when Request returns a false response body.


3.8.1
-----

* Exposed IO's form serialize via the new `Y.IO.stringify()` method.
  [Ticket #2529073] [Pull Request #351] [John Lindal]

* Stringified request data is now passed to custom transport layers.
  [Ticket #2532594] [Pull Request #383] [John Lindal]


3.8.0
-----

* No changes.


3.7.3
-----

* Fixed issue in Chrome where form submits with `upload: true` were not working
  properly. [Ticket #2531860]

* Add `empty()` method to io-queue which clears out all requests waiting to be
  sent. [Pull Request #282] [Julien Sanchez]


3.7.2
-----

* No changes.


3.7.1
-----

* No changes.


3.7.0
-----

* Prevent IO from maintaining cookies across requests in Node.js.
  [Ticket #2532676]

* Remove "X-Requested-With" header from cross-domain XHRs. Setting any
  non-standard HTTP headers when performing a cross-domain request using CORS
  results in a _required_ pre-flight OPTIONS request. Not adding this header by
  default allows the browser to communicate with a server which is not
  CORS-ready. [Ticket #2532673] [Clarence Leung]


3.6.0
-----

* Fixed issue when running in Node.js where `config.data` wasn't automatically
  stringified. [Ticket #2532390]


3.5.1
-----

* No changes.


3.5.0
-----

* Configuration data can now include an instance of FormData for HTTP POST
  requests. [Ticket #2531274]

* Implemented FormData file upload in io-base. [Ticket #2531274]

* Fixed transport error in io-base [Ticket #2531308, #2531941, #2531947]

* Fixed IO loader meta-data [Ticket #2531320]

* Fixed transport error in io-base [Ticket #2531308]

* Implemented Node.js compatibility [Ticket #2531495]

* Fixed transport error in io-base [Ticket #2531308]

* Fixed API docs discrepancy for IO [Ticket #2531756]

* Fixed error in sending an XML document as POST data. [Ticket #2531257]

* success/failure/complete/etc callbacks that throw errors no longer hijack all
  future transactions. [Ticket #2532107]


3.4.1
-----

* HTTP 304 now treated as a success condition. [Ticket #2530931]

* Fixed transport creation error when both io-xdr and io-upload-iframe modules
  are in use. [Ticket #2530999]

* Querystring stringify added to io-upload-iframe. [Ticket #2531037]

* Fixed request abort error in IE. [Ticket #2531038]

* Add try/catch to io-upload-iframe response to handle failure cases where the
  document may be inaccessible. [Ticket #2531041]

* Add IO support for XHR basic user authentication. [Ticket #2530023]

* Revert Y.mix usage for synchronous requests. [Ticket #2531056]

* Fixed io-upload-iframe transport destruction. [Ticket #2531058]


3.4.0
-----

* Added ability to get the configuration of a transaction. [Ticket #2528240]

* Instantiable IO. [Ticket #2529314]

* IO now uses `event-custom` and event facades. [Ticket #2529317]

* Exposed more of the internals of IO for extensibility. [Ticket #2529447]

* Fixed IO iframe upload to reset form attributes. [Ticket #2529553]

* Add IO support for XHR basic user authentication. [Ticket #2530023]

* IO will not send `data` for `GET`, `HEAD` and `DELETE` HTTP methods.
  [Ticket #2530091]

* Fixed issue with IO doubling the URL query-params on a HTTP `GET` request when
  sending `data` together with form serialization. [Ticket #2530494]


3.3.0
-----

* When using `io-xdr` to load `io.swf`, a date-time stamp will appended, as a
  query-string, to the transport source for IE. [Ticket #2528898]

* Implemented default HTTP headers can be suppressed in the transaction's
  configuration object by setting the header with a value of `disable`.
  [Ticket #2529324]

  For example:

      var config = { headers: { "X-Requested-With": "disable" } };

* Use Y.io without listening for the `io:xdrReady` event. [Ticket #2528710]

* Fixed native XDR detection for IE8 in `io-xdr`. [Ticket #2529290]


3.2.0
-----

* Fixed malformed HTML entities in JSON response, when using `io-upload-iframe`.
  [Ticket #2528646]

* Fixed configuration HTTP headers should override preset HTTP headers, when
  identical. [Ticket #2528893]


3.1.2
-----

* [!] Fixed security vulnerability in `io-xdr` when using the Flash transport.
  Removed: `Security.allowDomain("*")` setting from `io.as` (source) and
  `io.swf` (compiled). The implementation reverts back to the version in 3.0.0.

  This reversion prevents third-party sites from being able to load `io.swf`
  from a disparate domain, and make HTTP requests with the SWF's domain
  privileges, and passing the domain's credentials.  Only the domain serving
  `io.swf` will be permitted to load it, and call its fields.

  See the "Security Bulletin" for more details:
  http://yuilibrary.com/yui/docs/io/#security-bulletin


3.1.1
-----

* Fixed broken synchronous IO requests in IE. [Ticket #2528739]


3.1.0
-----

* YUI io now supports synchronous transactions for same-domain requests. To
  enable synchronous transactions, set the configuration property `sync` to
  `true`; the default behavior is `false`. During a synchronous request, all io
  events will fire, and response data are accessible through the events.
  Response data are also returned by io, as an alternative. [Ticket #2528181]

  For example:

      var request = Y.io(uri, { sync: true });

  `request` will contain the following fields, when the tx is complete:

    * `id`
    * `status`
    * `statusText`
    * `getResponseHeader()`
    * `getAllResponseHeaders()`
    * `responseText`
    * `responseXML`
    * `arguments`

  When making synchronous requests:

    * The transaction cannot be aborted,
    * The transaction's progress cannot be monitored.

* `arguments` defined in the configuration object are now passed to io global
  event handlers, as well. [Ticket #2528393]

* Only pass the value of the `arguments` property to listeners if defined.
  [Ticket #2528313]


3.0.0
-----

* Native cross-domain transactions are now supported in `io-xdr`. To specify an
  XDR transaction, set the config object with the following properties:

  * `use`: Specify either `native` or `flash` as the desired XDR transport.

  * `credentials`: Set to `true` if cookies are to be sent with the request.
    Does not work with XDomainRequest (e.g., IE8) or the Flash transport.

  * `datatType`: Set to `xml` if the response is an XML document.

  For example:

      var configuration.xdr = {
          use         : 'flash',  // Required -- 'flash` or 'native'.
          credentials : true,     // Optional.
          dataType    : 'xml'     // Optional.
      };

  The `use` property is required. The others are optional or
  functionality-specific.

  When using the native transport, io will fallback to the Flash transport if
  the browser is not capable of supporting the native mode. Make sure the
  resource responds with the correct `Access-Control-Allow-Origin` header before
  attempting a native XDR request.

* The sub-module `datatype-xml` is now a dependency for `io-xdr`, to support XML
  response data in XDR transactions.

* XDR transport initialization is simplified to one required value -- the path
  to Flash transport. For example:

      Y.io.transport({ src:'io.swf' });


3.0.0beta1
----------

* The `io-queue` sub-module now implements YUI `Queue`.  The io queue interface
  allows transaction callback handlers to be processed in the order the
  transactions were sent, regardless of actual server response order.
  For example:

  * io queue is used to make three requests.

  * The actual server response order happens to be: transaction 2, 1, 3.

  * However, using the queue interface, the transaction callbacks are processed
    in the order of: transaction 1, 2, 3.

* All transaction event flows now resolves to `success` or `failure`; the abort
  event is removed. Transaction abort and timeout conditions resolve to
  `failure`, and is distinguishable in the response data. Specifically, the
  response object's `status` and `statusText` properties will be populated as:

  * `response.status` will be 0.

  * `response.statusText` will be set to `timeout` or `abort` to differentiate
    the two possible conditions.

* A new `end` event is introduced in the transaction event flow; this is the
  terminal event for all transactions. Its event handler signature is the same
  as the `start` event, receiving the transaction id and user-defined arguments.

  * The global event name is `io:end`.

  * To subscribe to the transaction event, define the `end` property in the
    transaction's configuration object. `{on: {end: function(){…} } }`.


3.0.0 PR2
---------

* YUI `io` is now comprised of several modules, allowing users to specify and
  implement only the needed modules. These modules are:

  * `io-base`: This is the IO base class, using `XMLHttpRequest` as the
    transport.

  * `io-xdr`: This sub-module extends IO to enable cross-domain transactions
    using Flash as the transport.

  * `io-form`: This sub-module extends IO to enable the serialization of an HTML
    form as transaction data.

  * `io-upload-iframe`: This sub-module extends IO, to allow file uploads with
    an HTML form, using an `iframe` transport.

  * `io-queue`: This sub-module extends IO to add transaction queuing
    capabilities.

* If defined in the configuration object, user-specified, HTTP `Content-Type`
  headers will correctly override POST default headers, for HTTP POST
  transactions. [Ticket #SF2262707]

* XML is not supported as a response datatype when using sub-modules `io-xdr`
  and `io-upload-iframe`.


3.0.0 PR1
---------

* Initial Release.
