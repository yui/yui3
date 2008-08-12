YUI.add("io", function (Y) {
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
	* @event io:xdrReady
	* @description This event is fired by IO when the XDR transport is initialized
	* and ready.
	* @type Event Custom
	*/
	var E_XDR_READY = 'io:xdrReady',

  /**
	* @event io:start
	* @description This event is fired by IO when a transaction is initiated.
	* @type Event Custom
	*/
	E_START = 'io:start',

  /**
	* @event io:complete
	* @description This event is fired by IO when a transaction is complete and
	* all response data are available.
	* @type Event Custom
	*/
	E_COMPLETE = 'io:complete',

  /**
	* @event io:success
	* @description This event is fired by IO when a transaction is complete and
	* the HTTP status resolves to HTTP 2xx.
	* @type Event Custom
	*/
	E_SUCCESS = 'io:success',

  /**
	* @event io:failure
	* @description This event is fired by YUI.io when a transaction is complete and
	* the HTTP status resolves to HTTP 4xx, 5xx and above.
	* @type Event Custom
	*/
	E_FAILURE = 'io:failure',

  /**
	* @event io:abort
	* @description This event is fired by YUI.io when a transaction is aborted
	* manually or by a defined configuration <code>timeout</code>.
	* @type Event Custom
	*/
	E_ABORT = 'io:abort',

	// Window reference
	w = Y.config.win,
	d = Y.config.doc,

	//--------------------------------------
	//  Properties
	//--------------------------------------
   /**
	* @description A transaction counter that increments for each transaction.
	*
	* @property transactionId
	* @private
	* @static
	* @type {number}
	*/
	transactionId = 0,

   /**
	* @description Object of default HTTP headers to be initialized and sent
	* for all transactions.
	*
	* @property _headers
	* @private
	* @static
	* @type {object}
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
	* @type {object}
	*/
	_timeout = {},

   /**
	* @description Object that stores callback handlers for cross-domain requests,
	*
	* @property _fn
	* @private
	* @static
	* @type {object}
	*/
	_fn = {},

   /**
	* @description Map of transports created for cross-domain requests.
	*
	* @property _xdr
	* @private
	* @static
	* @type {object}
	*/
	_xdr = {
		flash:null
	},

   /**
	* @description Array of transactions queued for processing
	*
	* @property _q
	* @private
	* @static
	* @type {array}
	*/
	_q = [],

   /**
	* @description Property to determine whether the queue is set to
	* 1 (active) or 0 (inactive).  When inactive, transactions
	* will be stored in the queue until the queue is set to active.
	*
	* @property _qState
	* @private
	* @static
	* @type {number}
	*/
	_qState = 1,

   /**
	* @description Queue property to set a maximum queue storage size.  When
	* this property is set, the queue will not store any more transactions
	* until the queue size os reduced below this threshold. There is no
	* maximum queue size until it is explicitly set.
	*
	* @property _qMaxSize
	* @private
	* @static
	* @type {number}
	*/
	_qMaxSize = false;

	//--------------------------------------
	//  Methods
	//--------------------------------------
   /**
	* @description Method for requesting a transaction, and queueing the
	* request before it is sent to the resource.
	*
	* @method _queue
	* @private
	* @static
    * @return {number}
	*/
	function _queue(uri, c) {

		if (_qMaxSize === false || _q.length < _qMaxSize) {
			var id = _id();
			_q.push({ uri: uri, id: id, cfg:c });
		}
		else {
			Y.log('Unable to queue transaction object.  Maximum queue size reached.', 'warn', 'io');
			return false;
		}

		if (_qState === 1) {
			_shift();
		}

		Y.log('Object queued.  Transaction id is' + id, 'info', 'io');
		return id;
	};

   /**
	* @description Method for promoting a transaction to the top of the queue.
	*
	* @method _unshift
	* @private
	* @static
    * @return {void}
	*/
	function _unshift(id) {
		var r;

		for (var i = 0; i < _q.length; i++) {
			if (_q[i].id === id) {
				r = _q.splice(i, 1);
				var p = _q.unshift(r[0]);
				Y.log('Object promoted to top of queue.  Transaction id is' + id, 'info', 'io');
				break;
			}
		}
	};

   /**
	* @description Method for removing a transaction from the top of the
	* queue, and sending the transaction to _io().
	*
	* @method _shift
	* @private
	* @static
    * @return {void}
	*/
	function _shift() {
		var c = _q.shift();
		_io(c.uri, c.cfg, c.id);
	};

   /**
	* @description Method to query the current size of the queue, or to
	* set a maximum queue size.
	*
	* @method _size
	* @private
	* @static
    * @return {number}
	*/
	function _size(i) {
		if (i) {
			_qMaxSize = i;
			Y.log('Queue size set to ' + i, 'info', 'io');
			return i;
		}
		else {
			return _q.length;
		}
	};

   /**
	* @description Method for setting the queue to active. If there are
	* transactions pending in the queue, they will be processed from the
	* queue in FIFO order.
	*
	* @method _start
	* @private
	* @static
    * @return {void}
	*/
	function _start() {
		var len = (_q.length > _qMaxSize > 0) ? _qMaxSize : _q.length;

		if (len > 1) {
			for (var i=0; i < len; i++) {
				_shift();
			}
		}
		else {
			_shift();
		}

		Y.log('Queue started.', 'info', 'io');
	};

   /**
	* @description Method for setting queue processing to inactive.
	* Transaction requests to YUI.io.queue() will be stored in the queue, but
	* not processed until the queue is reset to "active".
	*
	* @method _stop
	* @private
	* @static
    * @return {void}
	*/
	function _stop() {
		_qState = 0;
		Y.log('Queue stopped.', 'info', 'io');
	};

   /**
	* @description Method for removing a specific, pending transaction from
	* the queue.
	*
	* @method _purge
	* @private
	* @static
    * @return {void}
	*/
	function _purge(id) {
		if (Y.Lang.isNumber(id)) {
			for (var i = 0; i < _q.length; i++) {
				if (_q[i].id === id) {
					_q.splice(i, 1);
					Y.log('Object purged from queue.  Transaction id is' + id, 'info', 'io');
					break;
				}
			}
		}
	};
	/* End Queue Functions */

   /**
	* @description Implemented by <code>Y.io</code>.
	*
	* @method _io
	* @private
	* @static
    * @param {string} uri - qualified path to transaction resource.
    * @param {object} c - configuration object for the transaction.
    * @return {object}
	*/
	function _io(uri, c) {
		var c = c || {};
		var o = _create((arguments.length === 3) ? arguments[2] : null, c);
		var m = (c.method) ? c.method.toUpperCase() : 'GET';
		var d = (c.data) ? c.data : null;

		/* Determine configuration properties */
		// If config.form is defined, perform data operations.
		if (c.form) {
			// Serialize the HTML form into a string of name-value pairs.
			var f = _serialize(c.form);
			// If config.data is defined, concatenate the data to the form string.
			if (d) {
				f += "&" + d;
				Y.log('Configuration object.data added to serialized HTML form data. The string is: ' + f, 'info', 'io');
			}

			if (m === 'POST') {
				d = f;
				_setHeader('Content-Type', 'application/x-www-form-urlencoded');
			}
			else if (m === 'GET') {
				uri = _concat(uri, f);
				Y.log('Configuration object.data added to serialized HTML form data. The querystring is: ' + uri, 'info', 'io');
			}
		}
		else if (d && m === 'GET') {
			uri = _concat(uri, c.data);
			Y.log('Configuration object data added to URI. The querystring is: ' + uri, 'info', 'io');
		}
		else if (d && m === 'POST') {
			_setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		}

		if (c.xdr) {
			if (c.on) {
				_fn[o.id] = c.on;
			}
			if (d && m !== 'GET') {
				c.data = d;
			}
			o.c.send(uri, c, o.id);

			return o;
		}

		// If config.timeout is defined, initialize timeout poll.
		if (c.timeout) {
			_startTimeout(o, c);
		}
		/* End Configuration Properties */

		o.c.onreadystatechange = function() { _readyState(o, c); };
		_open(o.c, m, uri);
		_setHeaders(o.c, (c.headers || {}));
		// Do not pass null, in the absence of data, as this
		// results in a POST request with no Content-Length
		// defined.
		_async(o, (d || ''), c);

		o.abort = function () {
			_ioAbort(o, c);
		}
		o.isInProgress = function() {
			return o.c.readyState !== 4 && o.c.readyState !== 0;
		}

		return o;
	};

   /**
	* @description Method for creating and subscribing transaction events.
	*
	* @method _tPubSub
	* @private
	* @static
	* @param {string} e - event to be published
	* @param {object} c - configuration object for the transaction.
    * @return {void}
	*/
	function _tPubSub(e, c){
			var event = new Y.Event.Target().publish('transaction:' + e);
			event.subscribe(c.on[e], (c.context || this), c.arguments);

			return event;
	};

	function _ioXdrReady(id) {
		Y.fire(E_XDR_READY, id);
	}

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
    * @return {void}
	*/
	function _ioStart(id, c) {
		// Set default value of argument c, property "on" to Object if
		// the property is null or undefined.
		c.on = c.on || {};
		var event;

		if (_fn[id] && _fn[id].start) {
			c.on.start = _fn[id].start;
		}

		Y.fire(E_START, id);
		if (c.on.start) {
			event = _tPubSub('start', c);
			event.fire(id);
		}
		Y.log('Transaction ' + id + ' started.', 'info', 'io');
	};

   /**
	* @description Fires event "io:complete" and creates, fires a
	* transaction-specific "complete" event, if config.on.complete is
	* defined.
	*
	* @method _ioComplete
	* @private
	* @static
	* @param {object} id - transaction object.
	* @param {object} c - configuration object for the transaction.
    * @return {void}
	*/
	function _ioComplete(o, c) {
		// Set default value of argument c, property "on" to Object if
		// the property is null or undefined.
		c.on = c.on || {};
		var event;

		Y.fire(E_COMPLETE, o.id, o.c);
		if (c.on.complete) {
			event = _tPubSub('complete', c);
			event.fire(o.id, o.c);
		}
		Y.log('Transaction ' + o.id + ' completed.', 'info', 'io');
	}

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
    * @return {void}
	*/
	function _ioSuccess(o, c) {
		// Set default value of argument c, property "on" to Object if
		// the property is null or undefined.
		c.on = c.on || {};
		var event;

		if (_fn[o.id] && _fn[o.id].success) {
			c.on.success = _fn[o.id].success;
			delete _fn[o.id];
			//Decode the response from IO.swf
			o.c.responseText = decodeURI(o.c.responseText);
		}

		Y.fire(E_SUCCESS, o.id, o.c);
		if (c.on.success) {
			event = _tPubSub('success', c);
			event.fire(o.id, o.c);
		}

		_destroy(o, (c.xdr) ? true : false );
		Y.log('HTTP Status evaluates to Success. The transaction is: ' + o.id, 'info', 'io');
	}

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
    * @return {void}
	*/
	function _ioFailure(o, c) {
		// Set default value of argument c, property "on" to Object if
		// the property is null or undefined.
		c.on = c.on || {};
		var event;

		if (_fn[o.id] && _fn[o.id].failure) {
			c.on.failure = _fn[o.id].failure;
			delete _fn[o.id];
			//Decode the response from IO.swf
			o.c.responseText = decodeURI(o.c.responseText);
		}

		Y.fire(E_FAILURE, o.id, o.c);
		if (c.on.failure) {
			event = _tPubSub('failure', c);
			event.fire(o.id, o.c);
		}

		_destroy(o, (c.xdr) ? true : false );
		Y.log('HTTP Status evaluates to Failure. The transaction is: ' + o.id, 'info', 'io');
	}

   /**
	* @description Fires event "io:abort" and creates, fires a
	* transaction-specific "abort" event, if config.on.abort is
	* defined.
	*
	* @method _ioAbort
	* @private
	* @static
    * @param {object} o - Transaction object generated by _create().
    * @param {object} c - Configuration object passed to YUI.io().
    * @return {void}
	*/
	function _ioAbort(o, c) {
		// Set default value of argument c, property "on" to Object if
		// the property is null or undefined.
		c.on = c.on || {};
		var event;

		if(o && o.c  && !c.xdr) {
			// Terminate the transaction
			o.c.abort();
			if (c) {
				// Clear the timeout poll for this specific transaction.
				if (c.timeout) {
					_clearTimeout(o.id);
				}
			}
		}

		if (_fn[o.id] && _fn[o.id].abort) {
			c.on.abort = _fn[o.id].abort;
			delete _fn[o.id];
		}

		Y.fire(E_ABORT, o.id);
		if (c.on.abort) {
			event = _tPubSub('abort', c);
			event.fire(id);
		}

		_destroy(o, (c.xdr) ? true : false );
		Y.log('Transaction timeout or explicit abort. The transaction is: ' + o.id, 'info', 'io');
	}

   /**
	* @description Method that creates the XMLHttpRequest transport
	*
	* @method _xhr
	* @private
	* @static
    * @return {object}
	*/
	function _xhr() {
		return (w.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	};

   /**
	* @description Method that creates the Flash transport swf.
	*
	* @method _swf
	* @private
	* @static
    * @param {string} uri - location of IO.swf.
    * @param {string} yid - string representation of YUI instance.
    * @return {void}
	*/
	function _swf(uri, yid) {
		var b = Y.Node.get("body");
		var swf = '<object id="yuiSwfIo" type="application/x-shockwave-flash" data="' + uri + '" width="0" height="0">';
		swf += '<param name="movie" value="' + uri + '">';
		swf += '<param name="FlashVars" value="yid=' + yid + '">';
		swf += '<param name="allowScriptAccess" value="sameDomain">';
		swf += '</object>';
		b.appendChild(Y.Node.create(swf))
		_xdr.flash = d.getElementById('yuiSwfIo');
	};

   /**
	* @description Method that increments _transactionId for each transaction.
	*
	* @method _id
	* @private
	* @static
    * @return {number}
	*/
	function _id() {
		var id = transactionId;
		transactionId++;

		Y.log('Transaction id generated. The id is: ' + id, 'info', 'io');
		return id;
	};

   /**
	* @description Method that creates a unique transaction object for each
	* request..
	*
	* @method _create
	* @private
	* @static
    * @param {number} s - URI or root data.
    * @param {number} c - configuration object
    * @return {object}
	*/
	function _create(i, c) {
		var o = {};
		o.id = Y.Lang.isNumber(i) ? i : _id();
		if (c && c.xdr) {
			o.c = _xdr[c.xdr.use];
		}
		else {
			o.c = _xhr();
		}

		return o;
	};

   /**
	* @description Method that concatenates string data for HTTP GET transactions.
	*
	* @method _concat
	* @private
	* @static
    * @param {string} s - URI or root data.
    * @param {string} d - data to be concatenated onto URI.
    * @return {number}
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
    * @return {number}
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
	* @description Method to initialize the desired transport medium.
	*
	* @method _initTransport
	* @private
	* @static
    * @param {object} o - object of transport configurations.
    * @return {void}
	*/
	function _initTransport(o) {
		switch (o.id) {
			case 'flash':
				_swf(o.src, o.yid);
				break;
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
    * @return {void}
	*/
	function _setHeaders(o, h) {

		var p;

		for (p in _headers) {
			if (_headers.hasOwnProperty(p)) {
				h[p] = _headers[p];
				Y.log('Default HTTP header ' + p + ' found with value of ' + _headers[p], 'info', 'io');
			}
		}

		for (p in h) {
			if (h.hasOwnProperty(p)) {
				o.setRequestHeader(p, h[p]);
				Y.log('HTTP Header ' + p + ' set with value of ' + h[p], 'info', 'io');
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
    * @return {void}
	*/
	function _async(o, d, c) {
		o.c.send(d);
		_ioStart(o.id, c);
	};

   /**
	* @description Starts timeout count if config,timeout is defined.
	*
	* @method _startTimeout
	* @private
	* @static
    * @param {object} o - Transaction object generated by _create().
    * @param {object} c - Configuration object passed to YUI.io().
    * @return {void}
	*/
	function _startTimeout(o, c) {
		_timeout[o.id] = w.setTimeout(function() { _ioAbort(o, c); }, c.timeout);
	};

   /**
	* @description Clears the timeout interval started by _startTimeout().
	*
	* @method _clearTimeout
	* @private
	* @static
    * @param {number} id - Transaction id.
    * @return {void}
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
    * @return {void}
	*/
	function _readyState(o, c) {
		if (o.c.readyState === 4) {
			if (c.timeout) {
				_clearTimeout(o.id);
			}
			_ioComplete(o, c);
			_handleResponse(o, c);
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
    * @param {object} c - Configuration object passed to YUI.io().
    * @return {void}
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
			Y.log('HTTP status unreadable. The transaction is: ' + o.id, 'warn', 'io');
		}

		/*
		 * IE reports HTTP 204 as HTTP 1223.
		 * However, the response data are still available.
		 */
		if (status >= 200 && status < 300 || status === 1223) {
			_ioSuccess(o, c);
		}
		else {
			_ioFailure(o, c);
		}
	};

	function _destroy(o, isXdr) {
		// IE6 will throw a "Type Mismatch" error if the event handler is set to "null".
		if(w.XMLHttpRequest && !isXdr) {
			if (o.c) {
				o.c.onreadystatechange = null;
			}
		}

		o.c = null;
		o = null;
	};

   /**
	* @description Method to enumerate through an HTML form's elements collection
	* and return a string comprised of key-value pairs.
	*
	* @method _serialize
	* @private
	* @static
    * @param {object} c - Configuration object specific to form operations.
    * @return string
	*/
	function _serialize(o) {
		var str = '';
		var f = (typeof o.id === 'object') ? o.id : d.getElementById(o.id);
		var useDf = o.useDisabled || false;
		var eUC = encodeURIComponent;
		var e, n, v, dF;

		// Iterate over the form elements collection to construct the name-value pairs.
		for (var i=0; i < f.elements.length; i++) {
			e = f.elements[i];
			dF = e.disabled;
			n = e.name;
			v = e.value;
			//if config.form.useDisabled is defined as true, then disabled fields
			//will be included in the serialized data.
			if ((useDf) ? n : (n && dF));
			{
				switch (e.type)
				{
					case 'select-one':
					case 'select-multiple':
						for (var j = 0; j < e.options.length; j++) {
							if (e.options[j].selected) {
								if (Y.UA.ie) {
									str += eUC(n) + '=' + eUC(e.options[j].attributes['value'].specified ? e.options[j].value : e.options[j].text) + '&';
								}
								else {
									str += eUC(n) + '=' + eUC(e.options[j].hasAttribute('value') ? e.options[j].value : e.options[j].text) + '&';
								}
							}
						}
						break;
					case 'radio':
					case 'checkbox':
						if (e.checked) {
							str += eUC(n) + '=' + eUC(v) + '&';
						}
						break;
					case 'file':
					case undefined:
					case 'reset':
					case 'button':
						break;
					case 'submit':
					default:
						str += eUC(n) + '=' + eUC(v) + '&';
				}
			}
		}

		Y.log('HTML form serialized. The value is: ' + str.substr(0, str.length - 1), 'info', 'io');
		return str.substr(0, str.length - 1);
	};

	_io.xdrReady = _ioXdrReady;
	_io.start = _ioStart;
	_io.success = _ioSuccess;
	_io.failure = _ioFailure;
	_io.abort = _ioAbort;

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
    * @return {number}
	*/
	_io.header = _setHeader;

   /**
	* @description Method for specifying and initializing a transport
	* to facilitate cross-domain HTTP requests.  This is the
	* interface for _initTransport
	*
	* @method io.transport
	* @public
	* @static
    * @param {object} t - configuration object for the transport.
    * @return {void}
	*/
	_io.transport = _initTransport;

   /**
	* @description Method for requesting a transaction, and queueing the
	* request before it is sent to the resource. This is the
	* interface for _queue().
	*
	* @method io.queue
	* @public
	* @static
    * @param {string} uri - qualified path to transaction resource.
    * @param {object} c - configuration object for the transaction.
    * @return {number}
	*/
	_io.queue = _queue;

   /**
	* @description Method to query the current size of the queue, or to
	* set a maximum queue size.  This is the interface for _size().
	*
	* @method io.queue.size
	* @public
	* @static
	* @param {number} i - Specified maximum size of queue.
    * @return {number}
	*/
	_io.queue.size = _size;

   /**
	* @description Method for setting the queue to "active". If there are
	* transactions pending in the queue, they will be processed from the
	* queue in FIFO order. This is the interface for _start().
	*
	* @method io.queue.start
	* @public
	* @static
    * @return {void}
	*/
	_io.queue.start = _start;

   /**
	* @description Method for setting queue processing to inactive.
	* Transaction requests to YUI.io.queue() will be stored in the queue, but
	* not processed until the queue is set to "active". This is the
	* interface for _stop().
	*
	* @method io.queue.stop
	* @public
	* @static
    * @return {void}
	*/
	_io.queue.stop = _stop;

   /**
	* @description Method for promoting a transaction to the top of the queue.
	* This is the interface for _unshift().
	*
	* @method io.queue.promote
	* @public
	* @static
	* @param {number} i - ID of queued transaction.
    * @return {void}
	*/
	_io.queue.promote = _unshift;

   /**
	* @description Method for removing a specific, pending transaction from
	* the queue. This is the interface for _purge().
	*
	* @method io.queue.purge
	* @public
	* @static
	* @param {number} i - ID of queued transaction.
    * @return {void}
	*/
	_io.queue.purge = _purge;

   /**
	* @description Method for requesting a transaction. Each transaction may include
	* a configuration object.  Its properties are:
	*
	*
	* <p><strong>method</strong>: HTTP method verb (e.g., GET or POST). If this property is not
	*         not defined, the default value will be GET.</p>
	*
	* <p><strong>data</strong>: This is the name-value string that will be sent as the transaction
    *		data.  If the request is HTTP GET, the data become part of
    *		querystring. If HTTP POST, the data are sent in the message body.</p>
	*
	* <p><strong>xdr</strong>: Defines the transport to be used for cross-domain requests.  By
	*      setting this property, the transaction will use the specified
	*      transport instead of XMLHttpRequest.  Currently, the only alternate
	*      transport supported is Flash (e.g., { xdr: 'flash' }).</p>
	*
	* <p><strong>form</strong>: This is a defined object used to process HTML form as data.  The
	*       properties of <code>form</code> are:</p>
	*       <ul>
	*	      <li>id: object, //HTML form object or id of HTML form</li>
	*         <li>useDisabled: boolean, //Allow disabled HTML form field values
	*                      to be sent as part of the data.</li>
    *       </ul>
    *
    * <p><strong>on</strong>: This is a defined object used to create and handle specific
    *     events during a transaction lifecycle.  These events will fire in
    *     addition to the global io events. The events are:</p>
    *	  <ul><li>start - This event is fired when a request is sent to a resource.</li>
    *     <li>complete - This event fires when the transaction is complete.</li>
    *     <li>success - This event fires when the response status resolves to
    *               HTTP 2xx.</li>
    *     <li>failure - This event fires when the response status resolves to
    *               HTTP 4xx, 5xx, and beyond.</li>
    *	  <li>abort - This even is fired when a transaction abort is fire by
    *             timeout, or when it is manually aborted.</li></ul>
    *
    *     <p>The properties of <code>on</code> are:</p>
    *     <ul>
	*       <li>start: function(id, args){},</li>
	*       <li>complete: function(id, responseobject, args){},</li>
	*       <li>success: function(id, responseobject, args){},</li>
	*       <li>failure: function(id, responseobject, args){},</li>
	*       <li>abort: function(id, args){}</li>
	*       <li>Each property can reference a function or be written as an inline
	*           function.</li>
	*     </ul>
	*
	* <p><strong>context</strong>: Object reference for an event handler when it is implemented
	*          as a method of a base object. Defining "context" will preserve
	*          the proper reference of "this" used in the event handler.</p>
	* <p><strong>headers</strong>: This is a defined object of client headers, as many as.
	*         desired for the transaction.  The property for <code>header</code> is:</p>
	*		  <ul>
	*		    <li>header: value</li>
	*         </ul>
	*
	* <p><strong>timeout</strong>: This value, defined as milliseconds, is a time threshold for the
	*          transaction. When this threshold is reached, and the transaction's
	*          Complete event has not yet fired, the transaction will be aborted.</p>
	* <p><strong>arguments</strong>: Object, array, string, or number passed to all registered
	*            event handlers.  This value is available as the second
	*            argument in the "start" and "abort" event handlers; and, it is
	*            the third argument in the "complete", "success", and "failure"
	*            event handlers.</p>
	*
	* @method io
	* @public
    * @param {string} uri - qualified path to transaction resource.
    * @param {object} c - configuration object for the transaction.
    * @return {object}
	*/
	Y.io = _io;
}, "3.0.0");