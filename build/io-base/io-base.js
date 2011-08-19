YUI.add('io-base', function(Y) {

   /**
    * Base IO functionality. Provides basic XHR transport support.
    * @module io-base
    * @main io-base
	* @for IO
    */

	// Window reference
	var L = Y.Lang,
		// List of events that comprise the IO event lifecycle.
		E = ['start', 'complete', 'end', 'success', 'failure'],
		// Whitelist of used XHR response object properties.
		P = ['status', 'statusText', 'responseText', 'responseXML'],
		aH = 'getAllResponseHeaders',
		oH = 'getResponseHeader',
		w = Y.config.win,
		xhr = w.XMLHttpRequest,
		xdr = w.XDomainRequest,
		_i = 0;

   /**
    * The IO class is a utility that brokers HTTP requests through a simplified
    * interface.  Specifically, it allows JavaScript to make HTTP requests to
    * a resource without a page reload.  The underlying transport for making
    * same-domain requests is the XMLHttpRequest object.  IO can also use
    * Flash, if specified as a transport, for cross-domain requests.
    *
	* @class IO
	* @constructor
    * @param {Object} c - Object of EventTarget's publish method configurations
    *                     used to configure IO's events.
	*/
	function IO (c) {
		var io = this;

		io._uid = 'io:' + _i++;
		io._init(c);
		Y.io._map[io._uid] = io;
	}

	IO.prototype = {
		//--------------------------------------
		//  Properties
		//--------------------------------------

	   /**
		* A counter that increments for each transaction.
		*
		* @property _id
		* @private
		* @type {Number}
		*/
		_id: 0,

	   /**
		* Object of IO HTTP headers sent with each transaction.
		*
		* @property _headers
		* @private
		* @type {Object}
		*/
		_headers: {
			'X-Requested-With' : 'XMLHttpRequest'
		},

	   /**
        * Object that stores timeout values for any transaction with a defined
        * "timeout" configuration property.
		*
		* @property _timeout
		* @private
		* @type {Object}
		*/
		_timeout: {},

		//--------------------------------------
		//  Methods
		//--------------------------------------

		_init: function(c) {
			var io = this, i;
			
			io.cfg = c || {};
	
			Y.augment(io, Y.EventTarget);
			for (i = 0; i < 5; i++) {
				// Publish IO global events with configurations, if any.
				// IO global events are set to broadcast by default.
				// These events use the "io:" namespace.
				io.publish('io:' + E[i], Y.merge({ broadcast: 1 }, c));
				// Publish IO transaction events with configurations, if
				// any.  These events use the "io-trn:" namespace.
				io.publish('io-trn:' + E[i], c);
			}
		},

	   /**
		* Method that creates a unique transaction object for each request.
		*
		* @method _create
		* @private
		* @param {Number} c - configuration object subset to determine if
		*                     the transaction is an XDR or file upload,
		*                     requiring an alternate transport.
		* @param {Number} i - transaction id
		* @return object
		*/
		_create: function(c, i) {
			var io = this,
				o = { id: L.isNumber(i) ? i : io._id++, uid: io._uid },
				x = c.xdr,
				u = x ? x.use : c.form && c.form.upload ? 'iframe' : 'xhr',
				ie = (x && x.use === 'native' && xdr),
				t = io._transport;

			switch (u) {
				case 'native':
				case 'xhr':
					o.c = ie ? new xdr() : xhr ? new xhr() : new ActiveXObject('Microsoft.XMLHTTP');
					o.t =  ie ? true : false;
					break;
				default:
					o.c = t ? t[u] : {};
					o.t = true;
			}

			return o;
		},

		_destroy: function(o) {
			if (w) {
				if (xhr && o.t === true) {
					o.c.onreadystatechange = null;
				}
				else if (Y.UA.ie) {
					// IE, when using XMLHttpRequest as an ActiveX Object, will throw
					// a "Type Mismatch" error if the event handler is set to "null".
					o.c.abort();
				}
			}

			o.c = null;
			o = null;
		},

	   /**
		* Method for creating and firing events.
		*
		* @method _evt
		* @private
		* @param {String} e - event to be published.
		* @param {Object} o - transaction object.
		* @param {Object} c - configuration data subset for event subscription.
		*/
		_evt: function(e, o, c) {
			var io = this, p, s,
				a = c['arguments'],
				eF = io.cfg.emitFacade,
				// IO Global events namespace.
				gE = "io:" + e,
				// IO Transaction events namespace.
				tE = "io-trn:" + e;

				if (o.e) { 
					o.c = { status: 0, statusText: o.e };
				}
				// Fire event with parameters or an Event Facade.
				p = eF ? [{ id: o.id, data: o.c, cfg: c, 'arguments': a }] : [o.id];

				if (!eF) {
					if (e === E[0] || e === E[2]) {
						if (a) {
							p.push(a);
						}
					}
					else {
						s = a ? p.push(o.c, a) : p.push(o.c);
					}
				}
				
				p.unshift(gE);
				// Fire global events.
				io.fire.apply(io, p);
				// Fire transaction events, if receivers are defined.
				if (c.on) {
					p[0] = tE;
					io.once(tE, c.on[e], c.context || Y);
					io.fire.apply(io, p);
				}
		},

	   /**
        * Fires event "io:start" and creates, fires a transaction-specific
        * start event, if `config.on.start` is defined.
		*
		* @method start
		* @param {Object} o - transaction object.
		* @param {Object} c - configuration object for the transaction.
		*/
		start: function(o, c) {
		   /**
			* Signals the start of an IO request.
			* @event io:start
			*/
			this._evt(E[0], o, c);
		},

	   /**
		* Fires event "io:complete" and creates, fires a
		* transaction-specific "complete" event, if config.on.complete is
		* defined.
		*
		* @method complete
		* @param {Object} o - transaction object.
		* @param {Object} c - configuration object for the transaction.
		*/
		complete: function(o, c) {
		   /**
            * Signals the completion of the request-response phase of a
            * transaction. Response status and data are accessible, if
            * available, in this event.
			* @event io:complete
			*/
			this._evt(E[1], o, c);
		},

	   /**
        * Fires event "io:end" and creates, fires a transaction-specific "end"
        * event, if config.on.end is defined.
		*
		* @method end
		* @param {Object} o - transaction object.
		* @param {Object} c - configuration object for the transaction.
		*/
		end: function(o, c) {
		   /**
			* Signals the end of the transaction lifecycle.
            * @event io:end
			*/
			this._evt(E[2], o, c);
			this._destroy(o);
		},

	   /**
        * Fires event "io:success" and creates, fires a transaction-specific
        * "success" event, if config.on.success is defined.
		*
		* @method success
		* @param {Object} o - transaction object.
		* @param {Object} c - configuration object for the transaction.
		*/
		success: function(o, c) {
		   /**
            * Signals an HTTP response with status in the 2xx range.
            * Fires after io:complete.
			* @event io:success
			*/
			this._evt(E[3], o, c);
			this.end(o, c);
		},

	   /**
        * Fires event "io:failure" and creates, fires a transaction-specific
        * "failure" event, if config.on.failure is defined.
		*
		* @method failure
		* @param {Object} o - transaction object.
		* @param {Object} c - configuration object for the transaction.
		*/
		failure: function(o, c) {
		   /**
			* Signals an HTTP response with status outside of the 2xx range.
            * Fires after io:complete.
			* @event io:failure
			*/
			this._evt(E[4], o, c);
			this.end(o, c);
		},

	   /**
        * Retry an XDR transaction, using the Flash tranport, if the native
        * transport fails.
		*
		* @method _retry
		* @private
		* @param {Object} o - Transaction object generated by _create().
		* @param {String} uri - qualified path to transaction resource.
		* @param {Object} c - configuration object for the transaction.
		*/
		_retry: function(o, uri, c) {
			this._destroy(o);
			c.xdr.use = 'flash';
			return this.send(uri, c, o.id);
		},

	   /**
		* Method that concatenates string data for HTTP GET transactions.
		*
		* @method _concat
		* @private
		* @param {String} s - URI or root data.
		* @param {String} d - data to be concatenated onto URI.
		* @return {Number}
		*/
		_concat: function(s, d) {
			s += (s.indexOf('?') === -1 ? '?' : '&') + d;
			return s;
		},

	   /**
        * Stores default client headers for all transactions. If a label is
        * passed with no value argument, the header will be deleted.
		*
		* @method setHeader
		* @param {String} l - HTTP header
		* @param {String} v - HTTP header value
		*/
		setHeader: function(l, v) {
			if (v) {
				this._headers[l] = v;
			}
			else {
				delete this._headers[l];
			}
		},

	   /**
		* Method that sets all HTTP headers to be sent in a transaction.
		*
		* @method _setHeaders
		* @private
		* @param {Object} o - XHR instance for the specific transaction.
		* @param {Object} h - HTTP headers for the specific transaction, as defined
		*                     in the configuration object passed to YUI.io().
		*/
		_setHeaders: function(o, h) {
			h = Y.merge(this._headers, h);
			Y.Object.each(h, function(v, p) {
				if (v !== 'disable') {
					o.setRequestHeader(p, h[p]);
				}
			});
		},

	   /**
        * Starts timeout count if the configuration object has a defined
        * timeout property.
		*
		* @method _startTimeout
		* @private
		* @param {Object} o - Transaction object generated by _create().
		* @param {Object} t - Timeout in milliseconds.
		*/
		_startTimeout: function(o, t) {
			var io = this;
			io._timeout[o.id] = w.setTimeout(function() { io._abort(o, 'timeout'); }, t);
		},

	   /**
		* Clears the timeout interval started by _startTimeout().
		*
		* @method _clearTimeout
		* @private
		* @param {Number} id - Transaction id.
		*/
		_clearTimeout: function(id) {
			w.clearTimeout(this._timeout[id]);
			delete this._timeout[id];
		},

	   /**
        * Method that determines if a transaction response qualifies as success
        * or failure, based on the response HTTP status code, and fires the
        * appropriate success or failure events.
		*
		* @method _result
		* @private
		* @static
		* @param {Object} o - Transaction object generated by _create().
		* @param {Object} c - Configuration object passed to io().
		*/
		_result: function(o, c) {
			var s;
			// Firefox will throw an exception if attempting to access
			// an XHR object's status property, after a request is aborted.
			try { s = o.c.status; } catch(e) { s = 0; }

			// IE reports HTTP 204 as HTTP 1223.
			if (s >= 200 && s < 300 || s === 1223) {
				this.success(o, c);
			}
			else {
				this.failure(o, c);
			}
		},

	   /**
		* Event handler bound to onreadystatechange.
		*
		* @method _rS
		* @private
		* @param {Object} o - Transaction object generated by _create().
		* @param {Object} c - Configuration object passed to YUI.io().
		*/
		_rS: function(o, c) {
			var io = this;

			if (o.c.readyState === 4) {
				if (c.timeout) {
					io._clearTimeout(o.id);
				}

				// Yield in the event of request timeout or  abort.
				w.setTimeout(function() { io.complete(o, c); io._result(o, c); }, 0);
			}
		},

	   /**
		* Terminates a transaction due to an explicit abort or timeout.
		*
		* @method _abort
		* @private
		* @param {Object} o - Transaction object generated by _create().
		* @param {String} s - Identifies timed out or aborted transaction.
		*/
		_abort: function(o, s) {
			if (o && o.c) {
				o.e = s;
				o.c.abort();
			}
		},

	   /**
        * Requests a transaction. `send()` is implemented as `Y.io()`.  Each
        * transaction may include a configuration object.  Its properties are:
		*
        * <dl>
		*   <dt>method</dt>
        *     <dd>HTTP method verb (e.g., GET or POST). If this property is not
		*         not defined, the default value will be GET.</dd
		*
		*   <dt>data</dt>
        *     <dd>This is the name-value string that will be sent as the
        *     transaction data. If the request is HTTP GET, the data become
        *     part of querystring. If HTTP POST, the data are sent in the
        *     message body.</dd>
		*
		*   <dt>xdr</dt>
        *     <dd>Defines the transport to be used for cross-domain requests.
        *     By setting this property, the transaction will use the specified
        *     transport instead of XMLHttpRequest. The properties of the
        *     transport object are:
        *     <dl>
        *       <dt>use</dt>
		*         <dd>The transport to be used: 'flash' or 'native'</dd>
		*       <dt>dataType</dt>
        *         <dd>Set the value to 'XML' if that is the expected response
        *         content type.</dd>
        *     </dl></dd>
		*
		*   <dt>form</dt>
        *     <dd>Form serialization configuration object.  Its properties are:
		*     <dl>
		*       <dt>id</dt>
        *         <dd>Node object or id of HTML form</dd>
		*       <dt>useDisabled</dt>
        *         <dd>`true` to also serialize disabled form field values
        *         (defaults to `false`)</dd>
		*     </dl></dd>
		*
		*   <dt>on</dt>
        *     <dd>Assigns transaction event subscriptions. Available events are:
		*     <dl>
		*       <dt>start</dt>
        *         <dd>Fires when a request is sent to a resource.</dd>
		*       <dt>complete</dt>
        *         <dd>Fires when the transaction is complete.</dd>
		*       <dt>success</dt>
        *         <dd>Fires when the HTTP response status is within the 2xx
        *         range.</dd>
		*       <dt>failure</dt>
        *         <dd>Fires when the HTTP response status is outside the 2xx
        *         range, if an exception occurs, if the transation is aborted,
        *         or if the transaction exceeds a configured `timeout`.</dd>
		*       <dt>end</dt>
        *         <dd>Fires at the conclusion of the transaction
		*            lifecycle, after `success` or `failure`.</dd>
		*     </dl>
        *
        *     <p>Callback functions for `start` and `end` receive the id of the
        *     transaction as a first argument. For `complete`, `success`, and
        *     `failure`, callbacks receive the id and the response object
        *     (usually the XMLHttpRequest instance).  If the `arguments`
        *     property was included in the configuration object passed to
        *     `Y.io()`, the configured data will be passed to all callbacks as
        *     the last argument.</p>
        *     </dd>
		*
		*   <dt>sync</dt>
        *     <dd>Pass `true` to make a same-domain transaction synchronous.
        *     <strong>CAVEAT</strong>: This will negatively impact the user
        *     experience. Have a <em>very</em> good reason if you intend to use
        *     this.</dd>
		*
		*   <dt>context</dt>
        *     <dd>The "`this'" object for all configured event handlers. If a
        *     specific context is needed for individual callbacks, bind the
        *     callback to a context using `Y.bind()`.</dd>
		*
		*   <dt>headers</dt>
        *     <dd>Object map of transaction headers to send to the server. The
        *     object keys are the header names and the values are the header
        *     values.</dd>
		*
		*   <dt>timeout</dt>
        *     <dd>Millisecond threshold for the transaction before being
        *     automatically aborted.</dd>
		*
		*   <dt>arguments</dt>
        *     <dd>User-defined data passed to all registered event handlers.
        *     This value is available as the second argument in the "start" and
        *     "end" event handlers. It is the third argument in the "complete",
        *     "success", and "failure" event handlers. <strong>Be sure to quote
        *     this property name in the transaction configuration as
        *     "arguments" is a reserved word in JavaScript (e.g. `Y.io({ ...,
        *     "arguments": stuff })`).</dd>
        * </dl>
		*
		* @method send
		* @private
		* @param {String} uri - qualified path to transaction resource.
		* @param {Object} c - configuration object for the transaction.
		* @param {Number} i - transaction id, if already set.
		* @return {Object}
		*/
		send: function(uri, c, i) {
			var o, m, r, s, d, io = this,
				u = uri;
				c = c ? Y.Object(c) : {};
				o = io._create(c, i);
				m = c.method ? c.method.toUpperCase() : 'GET';
				s = c.sync;
				d = c.data;

			// Serialize an object into a key-value string using
			// querystring-stringify-simple.
			if (L.isObject(d)) {
				d = Y.QueryString.stringify(d);
			}

			if (c.form) {
				if (c.form.upload) {
					// This is a file upload transaction, calling
					// upload() in io-upload-iframe.
					return io.upload(o, uri, c);
				}
				else {
					// Serialize HTML form data into a key-value string.
					d = io._serialize(c.form, d);
				}
			}

			if (d) {
				switch (m) {
					case 'GET':
					case 'HEAD':
					case 'DELETE':
						u = io._concat(u, d);
						d = '';
						break;
					case 'POST':
					case 'PUT':
						// If Content-Type is defined in the configuration object, or
						// or as a default header, it will be used instead of
						// 'application/x-www-form-urlencoded; charset=UTF-8'
						c.headers = Y.merge({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, c.headers);
						break;
				}
			}

			if (o.t) {
				// Cross-domain request or custom transport configured.
				return io.xdr(u, o, c);
			}

			if (!s) {
				o.c.onreadystatechange = function() { io._rS(o, c); };
			}

			try {
				// Determine if request is to be set as
				// synchronous or asynchronous.
				o.c.open(m, u, s ? false : true, c.username || null, c.password || null);
				io._setHeaders(o.c, c.headers || {});
				io.start(o, c);

				// Will work only in browsers that implement the
				// Cross-Origin Resource Sharing draft.
				if (c.xdr && c.xdr.credentials) {
					if (!Y.UA.ie) {
						o.c.withCredentials = true;
					}
				}

				// Using "null" with HTTP POST will result in a request
				// with no Content-Length header defined.
				o.c.send(d);

				if (s) {
					// Create a response object for synchronous transactions,
					// mixing id and arguments properties with the xhr
					// properties whitelist.
					r = Y.mix({ id: o.id, 'arguments': c['arguments'] }, o.c, false, P);
					r[aH] = function() { return o.c[aH](); };
					r[oH] = function(h) { return o.c[oH](h); };
					io.complete(o, c);
					io._result(o, c);

					return r;
				}
			}
			catch(e) {
				if (o.t) {
					// This exception is usually thrown by browsers
					// that do not support XMLHttpRequest Level 2.
					// Retry the request with the XDR transport set
					// to 'flash'.  If the Flash transport is not
					// initialized or available, the transaction
					// will resolve to a transport error.
					return io._retry(o, uri, c);
				}
				else {
					io.complete(o, c);
					io._result(o, c);
				}
			}

			// If config.timeout is defined, and the request is standard XHR,
			// initialize timeout polling.
			if (c.timeout) {
				io._startTimeout(o, c.timeout);
			}

			return {
				id: o.id,
				abort: function() {
					return o.c ? io._abort(o, 'abort') : false;
				},
				isInProgress: function() {
					return o.c ? o.c.readyState !== 4 && o.c.readyState !== 0 : false;
				},
				io: io
			};
		}
	};

   /**
    * Method for initiating an ajax call.  The first argument is the url end
    * point for the call.  The second argument is an object to configure the
    * transaction and attach event subscriptions.  The configuration object
    * supports the following properties:
    * 
    * <dl>
    *   <dt>method</dt>
    *     <dd>HTTP method verb (e.g., GET or POST). If this property is not
    *         not defined, the default value will be GET.</dd
    *
    *   <dt>data</dt>
    *     <dd>This is the name-value string that will be sent as the
    *     transaction data. If the request is HTTP GET, the data become
    *     part of querystring. If HTTP POST, the data are sent in the
    *     message body.</dd>
    *
    *   <dt>xdr</dt>
    *     <dd>Defines the transport to be used for cross-domain requests.
    *     By setting this property, the transaction will use the specified
    *     transport instead of XMLHttpRequest. The properties of the
    *     transport object are:
    *     <dl>
    *       <dt>use</dt>
    *         <dd>The transport to be used: 'flash' or 'native'</dd>
    *       <dt>dataType</dt>
    *         <dd>Set the value to 'XML' if that is the expected response
    *         content type.</dd>
    *     </dl></dd>
    *
    *   <dt>form</dt>
    *     <dd>Form serialization configuration object.  Its properties are:
    *     <dl>
    *       <dt>id</dt>
    *         <dd>Node object or id of HTML form</dd>
    *       <dt>useDisabled</dt>
    *         <dd>`true` to also serialize disabled form field values
    *         (defaults to `false`)</dd>
    *     </dl></dd>
    *
    *   <dt>on</dt>
    *     <dd>Assigns transaction event subscriptions. Available events are:
    *     <dl>
    *       <dt>start</dt>
    *         <dd>Fires when a request is sent to a resource.</dd>
    *       <dt>complete</dt>
    *         <dd>Fires when the transaction is complete.</dd>
    *       <dt>success</dt>
    *         <dd>Fires when the HTTP response status is within the 2xx
    *         range.</dd>
    *       <dt>failure</dt>
    *         <dd>Fires when the HTTP response status is outside the 2xx
    *         range, if an exception occurs, if the transation is aborted,
    *         or if the transaction exceeds a configured `timeout`.</dd>
    *       <dt>end</dt>
    *         <dd>Fires at the conclusion of the transaction
    *            lifecycle, after `success` or `failure`.</dd>
    *     </dl>
    *
    *     <p>Callback functions for `start` and `end` receive the id of the
    *     transaction as a first argument. For `complete`, `success`, and
    *     `failure`, callbacks receive the id and the response object
    *     (usually the XMLHttpRequest instance).  If the `arguments`
    *     property was included in the configuration object passed to
    *     `Y.io()`, the configured data will be passed to all callbacks as
    *     the last argument.</p>
    *     </dd>
    *
    *   <dt>sync</dt>
    *     <dd>Pass `true` to make a same-domain transaction synchronous.
    *     <strong>CAVEAT</strong>: This will negatively impact the user
    *     experience. Have a <em>very</em> good reason if you intend to use
    *     this.</dd>
    *
    *   <dt>context</dt>
    *     <dd>The "`this'" object for all configured event handlers. If a
    *     specific context is needed for individual callbacks, bind the
    *     callback to a context using `Y.bind()`.</dd>
    *
    *   <dt>headers</dt>
    *     <dd>Object map of transaction headers to send to the server. The
    *     object keys are the header names and the values are the header
    *     values.</dd>
    *
    *   <dt>timeout</dt>
    *     <dd>Millisecond threshold for the transaction before being
    *     automatically aborted.</dd>
    *
    *   <dt>arguments</dt>
    *     <dd>User-defined data passed to all registered event handlers.
    *     This value is available as the second argument in the "start" and
    *     "end" event handlers. It is the third argument in the "complete",
    *     "success", and "failure" event handlers. <strong>Be sure to quote
    *     this property name in the transaction configuration as
    *     "arguments" is a reserved word in JavaScript (e.g. `Y.io({ ...,
    *     "arguments": stuff })`).</dd>
    * </dl>
    *
    * @method io
    * @static
    * @param {String} url - qualified path to transaction resource.
    * @param {Object} config - configuration object for the transaction.
    * @return object
    * @for YUI
    */
    Y.io = function(u, c) {
		// Calling IO through the static interface will use and reuse
		// an instance of IO.
		var o = Y.io._map['io:0'] || new IO();
		return o.send.apply(o, [u, c]);
	};

    /**
    Method for setting and deleting IO HTTP headers to be sent with every
    request.

    Hosted as a property on the `io` function (e.g. `Y.io.header`).
    
    @method header
    @param {String} l - HTTP header
    @param {String} v - HTTP header value
    @static
    **/
	Y.io.header = function(l, v) {
		// Calling IO through the static interface will use and reuse
		// an instance of IO.
		var o = Y.io._map['io:0'] || new IO();
		o.setHeader(l, v);
	};

	Y.IO = IO;
	// Map of all IO instances created.
	Y.io._map = {};


}, '@VERSION@' ,{requires:['event-custom-base', 'querystring-stringify-simple']});
