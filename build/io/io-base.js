YUI.add('io-base', function(Y) {

   /**
   	* HTTP communications module.
   	* @module io
   	*/

   /**
	* The io class is a utility that brokers HTTP requests through a simplified
	* interface.  Specifically, it allows JavaScript to make HTTP requests to
	* a resource without a page reload.  The underlying transport for making
	* same-domain requests is the XMLHttpRequest object.  YUI.io can also use
	* Flash, if specified as a transport, for cross-domain requests.
	*
   	* @class io
   	*/

   /**
   	* @event io:start
   	* @description This event is fired by YUI.io when a transaction is initiated.
   	* @type Event Custom
   	*/
   	var E_START = 'io:start',

   /**
   	* @event io:complete
   	* @description This event is fired by YUI.io when a transaction is complete.
   	* Response status and data are accessible, if available.
   	* @type Event Custom
   	*/
   	E_COMPLETE = 'io:complete',

   /**
   	* @event io:success
   	* @description This event is fired by YUI.io when a transaction is complete, and
   	* the HTTP status resolves to HTTP2xx.
   	* @type Event Custom
   	*/
   	E_SUCCESS = 'io:success',

   /**
   	* @event io:failure
   	* @description This event is fired by YUI.io when a transaction is complete, and
   	* the HTTP status resolves to HTTP4xx, 5xx and above.
   	* @type Event Custom
   	*/
   	E_FAILURE = 'io:failure',

   /**
   	* @event io:end
   	* @description This event signifies the end of the transaction lifecycle.  The
   	* transaction transport is destroyed.
   	* @type Event Custom
   	*/
   	E_END = 'io:end',

   	//--------------------------------------
   	//  Properties
   	//--------------------------------------
   /**
   	* @description A transaction counter that increments for each transaction.
   	*
   	* @property transactionId
   	* @private
   	* @static
   	* @type int
   	*/
   	transactionId = 0,

   /**
   	* @description Object of default HTTP headers to be initialized and sent
   	* for all transactions.
   	*
   	* @property _headers
   	* @private
   	* @static
   	* @type object
   	*/
   	_headers = {
   		'X-Requested-With' : 'XMLHttpRequest'
   	},

   /**
   	* @description Object that stores timeout values for any transaction with
   	* a defined "timeout" configuration property.
   	*
   	* @property _timeOut
   	* @private
   	* @static
   	* @type object
   	*/
   	_timeout = {},

   	// Window reference
   	w = Y.config.win;

   	//--------------------------------------
   	//  Methods
   	//--------------------------------------
   /**
   	* @description Method for requesting a transaction. _io() is implemented as
   	* yui.io().  Each transaction may include a configuration object.  Its
   	* properties are:
   	*
   	* method: HTTP method verb (e.g., GET or POST). If this property is not
   	*         not defined, the default value will be GET.
   	*
   	* data: This is the name-value string that will be sent as the transaction
    *		data.  If the request is HTTP GET, the data become part of
    *		querystring. If HTTP POST, the data are sent in the message body.
   	*
   	* xdr: Defines the transport to be used for cross-domain requests.  By
   	*      setting this property, the transaction will use the specified
   	*      transport instead of XMLHttpRequest.  Currently, the only alternate
   	*      transport supported is Flash (e.g., { xdr: 'flash' }).
   	*
   	* form: This is a defined object used to process HTML form as data.  The
   	*       properties are:
   	*       {
   	*	      id: object, //HTML form object or id of HTML form
   	*         useDisabled: boolean, //Allow disabled HTML form field values
   	*                      to be sent as part of the data.
	*       }
	*
	* on: This is a defined object used to create and handle specific
	*     events during a transaction lifecycle.  These events will fire in
	*     addition to the global io events. The events are:
	*	  start - This event is fired when a request is sent to a resource.
	*     complete - This event fires when the transaction is complete.
	*     success - This event fires when the response status resolves to
	*               HTTP 2xx.
	*     failure - This event fires when the response status resolves to
	*               HTTP 4xx, 5xx; and, for all transaction exceptions,
	*               including aborted transactions and transaction timeouts.
	*	  end -  This even is fired at the conclusion of the transaction
   	*			 lifecycle, after a success or failure resolution.
	*
	*     The properties are:
	*     {
   	*       start: function(id, args){},
   	*       complete: function(id, responseobject, args){},
   	*       success: function(id, responseobject, args){},
   	*       failure: function(id, responseobject, args){},
   	*       end: function(id, args){}
   	*     }
   	*	  Each property can reference a function or be written as an
   	*     inline function.
   	*
   	*     context: Object reference for an event handler when it is implemented
   	*              as a method of a base object. Defining "context" will preserve
   	*              the proper reference of "this" used in the event handler.
   	*     headers: This is a defined object of client headers, as many as.
   	*              desired for the transaction.  These headers are sentThe object
   	*              pattern is:
   	*              {
   	*		         header: value
   	*              }
   	*
   	* timeout: This value, defined as milliseconds, is a time threshold for the
   	*          transaction. When this threshold is reached, and the transaction's
   	*          Complete event has not yet fired, the transaction will be aborted.
   	* arguments: Object, array, string, or number passed to all registered
   	*            event handlers.  This value is available as the second
   	*            argument in the "start" and "abort" event handlers; and, it is
   	*            the third argument in the "complete", "success", and "failure"
   	*            event handlers.
   	*
   	* @method _io
   	* @private
   	* @static
	* @param {string} uri - qualified path to transaction resource.
	* @param {object} c - configuration object for the transaction.
	* @return object
   	*/
   	function _io(uri, c) {
   		var u, f,
   			// Set default value of argument c to Object if
   			// configuration object "c" does not exist.
   			c = c || {},
   			o = _create((arguments.length === 3) ? arguments[2] : null, c),
   			m = (c.method) ? c.method.toUpperCase() : 'GET',
   			d = (c.data) ? c.data : null;

   		o.abort = function () {
   			c.xdr ? o.c.abort(o.id, c) : _ioCancel(o, 'abort');
   		};
   		o.isInProgress = function() {
   			var s = (c.xdr) ? o.c.readyState(o.id) : (o.c.readyState !== 4 && o.c.readyState !== 0);
   			return s;
   		};

   		/* Determine configuration properties */
   		// If config.form is defined, perform data operations.
   		if (c.form) {

   			if (c.form.upload) {
   				u = Y.io._upload(o, uri, c);
   				return u;
   			}

   			// Serialize the HTML form into a string of name-value pairs.
   			f = Y.io._serialize(c.form);
   			// If config.data is defined, concatenate the data to the form string.
   			if (d) {
   				f += "&" + d;
   			}

   			if (m === 'POST') {
   				d = f;
   				_setHeader('Content-Type', 'application/x-www-form-urlencoded');
   			}
   			else if (m === 'GET') {
   				uri = _concat(uri, f);
   			}
   		}
   		else if (d && m === 'GET') {
   			uri = _concat(uri, c.data);
   		}
   		else if (d && m === 'POST') {
   			_setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
   		}

   		if (c.xdr) {
   			Y.io._xdr(uri, o, c);
   			return o;
   		}

   		// If config.timeout is defined, and the request is standard XHR,
   		// initialize timeout polling.
   		if (c.timeout) {
   			_startTimeout(o, c.timeout);
   		}
   		/* End Configuration Properties */

   		o.c.onreadystatechange = function() { _readyState(o, c); };
   		try { _open(o.c, m, uri); } catch (e) {}
   		_setHeaders(o.c, (c.headers || {}));

   		// Do not pass null, in the absence of data, as this
   		// will result in a POST request with no Content-Length
   		// defined.
   		_async(o, (d || ''), c);

   		return o;
   	};

   /**
   	* @description Method for creating and subscribing transaction events.
   	*
   	* @method _tPubSub
   	* @private
   	* @static
   	* @param {string} e - event to be published
   	* @param {object} c - configuration data subset for event subscription.
   	*
	* @return void
   	*/
   	function _tPubSub(e, c){
   			var event = new Y.EventTarget().publish('transaction:' + e);
   			event.subscribe(c.on[e], (c.context || this), c.arguments);

   			return event;
   	};

   /**
   	* @description Fires event "io:start" and creates, fires a
   	* transaction-specific start event, if config.on.start is
   	* defined.
   	*
   	* @method _ioStart
   	* @private
   	* @static
   	* @param {number} id - transaction id
   	* @param {object} c - configuration object for the transaction.
   	*
    * @return void
   	*/
   	function _ioStart(id, c) {
   		var m = Y.io._fn || {},
   			fn = (m && m[id]) ? m[id] : null,
   			event;
   			// Set default value of argument c, property "on" to Object if
   			// the property is null or undefined.
   			c.on = c.on || {};

   		if (fn) {
   			c.on.start = fn.start;
   		}

   		Y.fire(E_START, id);

   		if (c.on.start) {
   			event = _tPubSub('start', c);
   			event.fire(id);
   		}
   	};


   /**
   	* @description Fires event "io:complete" and creates, fires a
   	* transaction-specific "complete" event, if config.on.complete is
   	* defined.
   	*
   	* @method _ioComplete
   	* @private
   	* @static
   	* @param {object} o - transaction object.
   	* @param {object} c - configuration object for the transaction.
   	*
    * @return void
   	*/
   	function _ioComplete(o, c) {
   		var r, event;
   			// Set default value of argument c, property "on" to Object if
   			// the property is null or undefined.
   			c.on = c.on || {};

		r = (o.status) ? _response(o.status) : o.c;
   		Y.fire(E_COMPLETE, o.id, r);

   		if (c.on.complete) {
   			event = _tPubSub('complete', c);
   			event.fire(o.id, r);
   		}
   	};

   /**
   	* @description Fires event "io:success" and creates, fires a
   	* transaction-specific "success" event, if config.on.success is
   	* defined.
   	*
   	* @method _ioSuccess
   	* @private
   	* @static
   	* @param {object} o - transaction object.
   	* @param {object} c - configuration object for the transaction.
   	*
    * @return void
   	*/
   	function _ioSuccess(o, c) {
   		var m = Y.io._fn || {},
   			fn = (m && m[o.id]) ? m[o.id] : null,
   			event;
   			// Set default value of argument c, property "on" to Object if
   			// the property is null or undefined.
   			c.on = c.on || {};

   		if (fn) {
   			c.on.success = fn.success;
   			//Decode the response from IO.swf
   			o.c.responseText = decodeURI(o.c.responseText);
   		}

   		Y.fire(E_SUCCESS, o.id, o.c);

   		if (c.on.success) {
   			event = _tPubSub('success', c);
   			event.fire(o.id, o.c);
   		}

   		_ioEnd(o, c);
   	};

   /**
   	* @description Fires event "io:failure" and creates, fires a
   	* transaction-specific "failure" event, if config.on.failure is
   	* defined.
   	*
   	* @method _ioFailure
   	* @private
   	* @static
   	* @param {object} o - transaction object.
   	* @param {object} c - configuration object for the transaction.
   	*
    * @return void
   	*/
   	function _ioFailure(o, c) {
   		var m = Y.io._fn || {},
   			fn = (m && m[o.id]) ? m[o.id] : null,
   			r, event;
   			// Set default value of argument c, property "on" to Object if
   			// the property is null or undefined.
   			c.on = c.on || {};

   		if (fn) {
   			c.on.failure = fn.failure;
   			//Decode the response from IO.swf
   			o.c.responseText = decodeURI(o.c.responseText);
   		}

		r = (o.status) ? _response(o.status) : o.c;
   		Y.fire(E_FAILURE, o.id, r);

   		if (c.on.failure) {
   			event = _tPubSub('failure', c);
   			event.fire(o.id, r);
   		}

   		_ioEnd(o, c);
   	};

   /**
   	* @description Fires event "io:end" and creates, fires a
   	* transaction-specific "end" event, if config.on.end is
   	* defined.
   	*
   	* @method _ioEnd
   	* @private
   	* @static
   	* @param {object} o - transaction object.
   	* @param {object} c - configuration object for the transaction.
   	*
    * @return void
   	*/
   	function _ioEnd(o, c) {
   		var m = Y.io._fn || {},
   			fn = (m && m[o.id]) ? m[o.id] : null,
   			event;
   			// Set default value of argument c, property "on" to Object if
   			// the property is null or undefined.
   			c.on = c.on || {};

   		if (fn) {
   			c.on.end = fn.end;
   			delete m[o.id];
   		}

   		Y.fire(E_END, o.id);

   		if (c.on.end) {
   			event = _tPubSub('end', c);
   			event.fire(o.id);
   		}

   		_destroy(o, (c.xdr) ? true : false );
   	};

   /**
   	* @description Terminates a transaction due to an explicit abort or
   	* timeout.
   	*
   	* @method _ioCancel
   	* @private
   	* @static
	* @param {object} o - Transaction object generated by _create().
	* @param {object} c - Configuration object passed to YUI.io().
	* @param {string} s - Identifies timed out or aborted transaction.
   	*
    * @return void
   	*/
   	function _ioCancel(o, s) {
   		if (o && o.c) {
   			o.status = s;
   			o.c.abort();
   		}
   	};

	function _response(s) {
		return { status:0, statusText:s }
	};

   /**
   	* @description Method that increments _transactionId for each transaction.
   	*
   	* @method _id
   	* @private
   	* @static
    * @return int
   	*/
   	function _id() {
   		var id = transactionId;
   		transactionId++;

   		return id;
   	};

   /**
   	* @description Method that creates a unique transaction object for each
   	* request.
   	*
   	* @method _create
   	* @private
   	* @static
	* @param {number} s - URI or root data.
	* @param {number} c - configuration object
	* @return object
   	*/
   	function _create(i, c) {
   		var o = {};
   		o.id = Y.Lang.isNumber(i) ? i : _id();

   		if (c.xdr) {
   			o.c = Y.io._transport[c.xdr.use];
   		}
   		else if (c.form && c.form.upload) {
   			o.c = {};
   		}
   		else {
   			o.c = _xhr();
   		}

   		return o;
   	};

   /**
   	* @description Method that creates the XMLHttpRequest transport
   	*
   	* @method _xhr
   	* @private
   	* @static
	* @return object
   	*/
   	function _xhr() {
   		return (w.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
   	};

   /**
   	* @description Method that concatenates string data for HTTP GET transactions.
   	*
   	* @method _concat
   	* @private
   	* @static
	* @param {string} s - URI or root data.
	* @param {string} d - data to be concatenated onto URI.
	* @return int
   	*/
   	function _concat(s, d) {
   		s += ((s.indexOf('?') == -1) ? '?' : '&') + d;
   		return s;
   	};

   /**
   	* @description Method that stores default client headers for all transactions.
   	* If a label is passed with no value argument, the header will be deleted.
   	*
   	* @method _setHeader
   	* @private
   	* @static
	* @param {string} l - HTTP header
	* @param {string} v - HTTP header value
	* @return int
   	*/
   	function _setHeader(l, v) {
   		if (v) {
   			_headers[l] = v;
   		}
   		else {
   			delete _headers[l];
   		}
   	};

   /**
   	* @description Method that sets all HTTP headers to be sent in a transaction.
   	*
   	* @method _setHeaders
   	* @private
   	* @static
	* @param {object} o - XHR instance for the specific transaction.
	* @param {object} h - HTTP headers for the specific transaction, as defined
	*                     in the configuration object passed to YUI.io().
	* @return void
   	*/
   	function _setHeaders(o, h) {
   		var p;

   		for (p in _headers) {
   			if (_headers.hasOwnProperty(p)) {
   				if (h[p]) {
   					// Configuration headers will supersede IO preset headers,
   					// if headers match.
   					break;
   				}
   				else {
   					h[p] = _headers[p];
   				}
   			}
   		}

   		for (p in h) {
   			if (h.hasOwnProperty(p)) {
   				o.setRequestHeader(p, h[p]);
   			}
   		}
   	};

   	function _open(o, m, uri) {
   		o.open(m, uri, true);
   	};

   /**
   	* @description Method that sends the transaction request.
   	*
   	* @method _async
   	* @private
   	* @static
	* @param {object} o - Transaction object generated by _create().
	* @param {string} d - Transaction data.
	* @param {object} c - Configuration object passed to YUI.io().
	* @return void
   	*/
   	function _async(o, d, c) {
   		o.c.send(d);
   		_ioStart(o.id, c);
   	};

   /**
   	* @description Starts timeout count if the configuration object
   	* has a defined timeout property.
   	*
   	* @method _startTimeout
   	* @private
   	* @static
	* @param {object} o - Transaction object generated by _create().
	* @param {object} c - Configuration object passed to YUI.io().
	* @return void
   	*/
   	function _startTimeout(o, timeout) {
   		_timeout[o.id] = w.setTimeout(function() { _ioCancel(o, 'timeout'); }, timeout);
   	};

   /**
   	* @description Clears the timeout interval started by _startTimeout().
   	*
   	* @method _clearTimeout
   	* @private
   	* @static
	* @param {number} id - Transaction id.
	* @return void
   	*/
   	function _clearTimeout(id) {
   		w.clearTimeout(_timeout[id]);
   		delete _timeout[id];
   	};

   /**
   	* @description Event handler bound to onreadystatechange.
   	*
   	* @method _readyState
   	* @private
   	* @static
	* @param {object} o - Transaction object generated by _create().
	* @param {object} c - Configuration object passed to YUI.io().
	* @return void
   	*/
   	function _readyState(o, c) {
   		if (o.c.readyState === 4) {
   			if (c.timeout) {
   				_clearTimeout(o.id);
   			}

   			w.setTimeout(
   				function() {
   					_ioComplete(o, c);
   					_handleResponse(o, c);
   				}, 0);
   		}
   	};

   /**
   	* @description Method that determines if a transaction response qualifies
   	* as success or failure, based on the response HTTP status code, and
   	* fires the appropriate success or failure events.
   	*
   	* @method _handleResponse
   	* @private
   	* @static
	* @param {object} o - Transaction object generated by _create().
	* @param {object} c - Configuration object passed to io().
	* @return void
   	*/
   	function _handleResponse(o, c) {
   		var status;
   		try{
   			if (o.c.status && o.c.status !== 0) {
   				status = o.c.status;
   			}
   			else {
   				status = 0;
   			}
   		}
   		catch(e) {
   			status = 0;
   		}

   		// IE reports HTTP 204 as HTTP 1223.
   		// But, the response data are still available.
   		if (status >= 200 && status < 300 || status === 1223) {
   			_ioSuccess(o, c);
   		}
   		else {
   			_ioFailure(o, c);
   		}
   	};

   	function _destroy(o, isTransport) {
   		// IE, when using XMLHttpRequest as an ActiveX Object, will throw
   		// a "Type Mismatch" error if the event handler is set to "null".
   		if(w.XMLHttpRequest && !isTransport) {
   			if (o.c) {
   				o.c.onreadystatechange = null;
   			}
   		}

   		o.c = null;
   		o = null;
   	};

   	_io.start = _ioStart;
   	_io.success = _ioSuccess;
   	_io.failure = _ioFailure;
   	_io._id = _id;

	//--------------------------------------
	//  Begin public interface definition
	//--------------------------------------
   /**
   	* @description Method that stores default client headers for all transactions.
   	* If a label is passed with no value argument, the header will be deleted.
   	* This is the interface for _setHeader().
   	*
   	* @method header
   	* @public
   	* @static
	* @param {string} l - HTTP header
	* @param {string} v - HTTP header value
	* @return int
   	*/
   	_io.header = _setHeader;

   /**
   	* @description Method for requesting a transaction. This
   	* is the interface for _io().
   	*
   	* @method io
   	* @public
   	* @static
    * @param {string} uri - qualified path to transaction resource.
    * @param {object} c - configuration object for the transaction.
    * @return object
    */
   	Y.io = _io;
	Y.io.http = _io;



}, '@VERSION@' );
