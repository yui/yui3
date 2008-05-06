YUI.add("io", function (Y) {

    /*
	 * @description Array of defined Transaction Events
	 *
	 * @property _E
	 * @private
	 * @static
	 * @type array
	 */
	var _E = ['start', 'complete', 'success', 'failure', 'abort'];

	// Window reference
	var w = Y.config.win;

   /*
	* @description A transaction counter that increments for each transaction.
	*
	* @property transactionId
	* @private
	* @static
	* @type int
	*/
	var transactionId = 0;

   /*
	* @description Object of default HTTP headers to be initialized and sent
	* for all transactions.
	*
	* @property _headers
	* @private
	* @static
	* @type object
	*/
	var _headers = {
		'X-Requested-With' : 'XMLHttpRequest'
	};

   /*
	* @description Object that stores timeout values for any transaction with
	* a defined "timeout" configuration property.
	*
	* @property _timeOut
	* @private
	* @static
	* @type object
	*/
	var _timeout = {};

   /*
	* @description Array of transactions queued for processing
	*
	* @property _q
	* @private
	* @static
	* @type array
	*/
	var _q = [];

   /*
	* @description Property to determine whether the queue is set to
	* 1 (active) or 0 (inactive).  When inactive, transactions
	* will be stored in the queue until the queue is set to active.
	*
	* @property _q
	* @private
	* @static
	* @type int
	*/
	var _qState = 1;

   /*
	* @description Queue property to set a maximum queue storage size.  When
	* this property is set, the queue will not store any more transactions
	* until the queue size os reduced below this threshold. There is no
	* maximum queue size until it is explicitly set.
	*
	* @property _qMaxSize
	* @private
	* @static
	* @type int
	*/
	var _qMaxSize = false;

   /*
	* @description Method for requesting a transaction, and queueing the
	* request before it is sent to the resource.
	*
	* @method _queue
	* @private
	* @static
    * @return int
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

   /*
	* @description Method for promoting a transaction to the top of the queue.
	*
	* @method _unshift
	* @private
	* @static
    * @return void
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

   /*
	* @description Method for removing a transaction from the top of the
	* queue, and sending the transaction to _io().
	*
	* @method _shift
	* @private
	* @static
    * @return void
	*/
	function _shift() {
		var c = _q.shift();
		_io(c.uri, c.cfg, c.id);
	};

   /*
	* @description Method to query the current size of the queue, or to
	* set a maximum queue size.
	*
	* @method _size
	* @private
	* @static
    * @return int
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

   /*
	* @description Method for setting the queue to active. If there are
	* transactions pending in the queue, they will be processed from the
	* queue in FIFO order.
	*
	* @method _start
	* @private
	* @static
    * @return void
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

   /*
	* @description Method for setting queue processing to inactive.
	* Transaction requests to YUI.io.queue() will be stored in the queue, but
	* not processed until the queue is reset to "active".
	*
	* @method _stop
	* @private
	* @static
    * @return void
	*/
	function _stop() {
		_qState = 0;
		Y.log('Queue stopped.', 'info', 'io');
	};

   /*
	* @description Method for removing a specific, pending transaction from
	* the queue.
	*
	* @method _purge
	* @private
	* @static
    * @return void
	*/
	function _purge(id) {
		if (Y.lang.isNumber(id)) {
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

   /*
	* @description Method for requesting a transaction. _io() is implemented as
	* yui.io().  Each transaction may include a configuration object.  Its
	* properties are:
	*
	* method: HTTP method verb (e.g., GET or POST). If this property is not
	*         not defined, the default value will be GET.
	*
	* data: This is the name-value string that will be sent as the transaction
    *		data.  If the request is HTTP GET, the data become part of URI
    *		querystring. If HTTP POST, the data are sent in the message body.
	*
	* form: This is a defined object used to process HTML form as data.  The
	*       properties are:
	*       {
	*	      id: object, //HTML form object or id of HTML form
	*         useDisabled: boolean, //Allow disabled HTML form field values
	*                      to be sent as part of the data.
	*         useListener: boolean //Will use an Event listener to determine
	*					   which "Submit" button was selected, when multiple
	*					   "Submit" buttons are present.
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
    *               HTTP 4xx, 5xx, and beyond.
    *	  abort - This even is fired when a transaction abort is fire by
    *             timeout, or when it is manually aborted.
    *
    *     The properties are:
    *     {
	*       start: function(id, args){},
	*       complete: function(id, responseobject, args){},
	*       success: function(id, responseobject, args){},
	*       failure: function(id, responseobject, args){},
	*       abort: function(id, args){}
	*     }
	*	  Each property can reference a function or be written as an
	*     inline function.
	*
	* context: Object reference for any event handler when it is implemented
	*          as a method of a base object. Defining "context" will preserve
	*          the proper context of "this" as used in the event handler.
	* header: This is a defined object of client headers, as many as.
	*         desired for the transaction.  These headers are sentThe object
	*         pattern is:
	*		  {
	*		    header: value
	*         }
	*
	* timeout: This value, defined as milliseconds, is a time threshold for the
	*          transaction. When this threshold is reached, and the resource
	*          has not responded, the transaction will be aborted.
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
	function _io(uri, c, id) {
		// Create transaction object

		var o = _create(Y.lang.isNumber(id) ? id : null);
		var m = (c && c.method) ? c.method.toUpperCase() : 'GET';
		var d = (c && c.data) ? c.data : null;

		/* Determine configuration properties */
		if(c){
			// If config.timeout is defined, initialize timeout poll.
			if (c.timeout) {
				_startTimeout(o, c);
			}

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
					Y.log('Content-Type set to *application/x-www-form-urlencoded* for HTML form POST.', 'info', 'io');
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
				Y.log('Content-Type set to *application/x-www-form-urlencoded; charset=UTF-8* for POST transaction.', 'info', 'io');
			}

			if (c.on) {
				_tEvents(o, c);
				Y.log('Transaction Event handlers detected. Transaction id is' + o.id, 'info', 'io');
			}
		}

		/* End Configuration Properties */

		o.c.onreadystatechange = function() { _readyState(o, c); };
		_open(o.c, m, uri);
		_setHeaders(o.c, (c && c.headers) ? c.headers : {});
		_async(o, (d || ''), c);

		o.abort = function () {
			_abort(o, c);
		}

		o.status = function() {
			return o.c.readyState !== 4 && o.c.readyState !== 0;
		}

		return o;
	};

   /*
	* @description Method for creating and subscribing transaction events.
	*
	* @method _tEvents
	* @private
	* @static
    * @return void
	*/
	function _tEvents(o, c){
		for(var i = 0; i < _E.length; i++) {
			if(c.on[_E[i]]) {
				o['t:' + _E[i]] = new Y.Event.Target().publish(_E[i]);
				Y.log('Transaction Event t:' + _E[i] + ' published for transaction ' + o.id, 'info', 'io');
				o['t:' + _E[i]].subscribe(c.on[_E[i]], c.context, c.arguments );
				Y.log('Transaction Event t:' + _E[i] + ' subscribed for transaction ' + o.id, 'info', 'io');
			}
		}
	};

	function _transport(t){
		return (w.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	};

   /*
	* @description Method that increments _transactionId for each transaction.
	*
	* @method _id
	* @private
	* @static
    * @return int
	*/
	function _id(){
		var id = transactionId;
		transactionId++;

		Y.log('Transaction id generated. The id is: ' + id, 'info', 'io');
		return id;
	}

	function _create(i, t) {

		var o = {};
		o.id = Y.lang.isNumber(i) ? i : _id();
		o.c = _transport(t);

		return o;
	};

   /*
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

   /*
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

   /*
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

   /*
	* @description Method that sends the transaction request, and fires the
	*              event -- io:start and t:start.
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
		var a = (c && c.arguments) ? c.arguments : null;
		// Fire global "io:start" event
		Y.fire('io:start', o.id);

		// Fire transaction "start" event
		if (o['t:start']) {
			o['t:start'].fire(o.id, a);
		}
		Y.log('Transaction ' + o.id + ' started.', 'info', 'io');
	};

	function _startTimeout(o, c) {
		_timeout[o.id] = w.setTimeout(function() { _abort(o, c); }, c.timeout);
	};

	function _clearTimeout(id) {
		w.clearTimeout(_timeout[id]);
		delete _timeout[id];
	};

   /*
	* @description Method bound to onreadystatechange, and fires the events
	*              io:complete and t:complete, when the transaction is complete.
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

			if (c && c.timeout) {
				_clearTimeout(o.id);
			}

			// Fire global "io:complete" event
			Y.fire('io:complete', o.id, o.c);

			if (o['t:complete']) {
				o['t:complete'].fire(o.id, o.c, c.arguments);
			}

			Y.log('Transaction ' + o.id + ' completed.', 'info', 'io');
			_handleResponse(o, c);
		}
	};

   /*
	* @description Method that determines if a transaction response qualifies
	* as success or failure, based on the response HTTP status code, and
	* fires the appropriate success or failure events.
	*
	* @method _handleResponse
	* @private
	* @static
    * @param {object} o - Transaction object generated by _create().
    * @param {object} c - Configuration object passed to YUI.io().
    * @return void
	*/
	function _handleResponse(o, c) {

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
			// Fire global "io:success" event
			Y.fire('io:success', o.id, o.c);

			if (o['t:success']) {
				o['t:success'].fire(o.id, o.c, c.arguments);
			}
			Y.log('HTTP Status evaluates to Success. The transaction is: ' + o.id, 'info', 'io');
		}
		else {
			// Fire global "io:failure" event
			Y.fire('io:failure', o.id, o.c);

			if (o['t:failure']) {
				o['t:failure'].fire(o.id, o.c, c.arguments);
			}
			Y.log('HTTP Status evaluates to Failure. The transaction is: ' + o.id, 'info', 'io');
		}

		_destroy(o, c);
	};

   /*
	* @description Method that terminates a transaction, if it is still
	* in progress, and fires events io:abort and t:abort.
	*
	* @method _handleResponse
	* @private
	* @static
    * @param {object} o - Transaction object generated by _create().
    * @param {object} c - Configuration object passed to YUI.io().
    * @return void
	*/
	function _abort(o, c) {

		var a = (c && c.arguments) ? c.arguments : null;

		if(o && o.c) {
			o.c.abort();

			if (c) {
				if (c.timeout) {
					_clearTimeout(o.id);
				}
			}
			// Fire global "io:abort" event
			Y.fire('io:abort', o.id);

			if (o['t:abort']) {
				o['t:abort'].fire(o.id, a);
			}

			Y.log('Transaction timeout or explicit abort. The transaction is: ' + o.id, 'info', 'io');

			_destroy(o);
		}
	};

	function _destroy(o) {
		// IE6 will throw a "Type Mismatch" error if the event handler is set to "null".
		if(w.XMLHttpRequest) {
			if (o.c) {
				o.c.onreadystatechange = null;
			}
		}

		o.c = null;
		o = null;
	};

	/* start HTML form serialization */
	function _serialize(o) {
		var str = '';
		var f = (typeof o.id == 'object') ? o.id : Y.config.doc.getElementById(o.id);
		var useDf = o.useDisabled || false;
		var eUC = encodeURIComponent;
		var e, n, v, dF;

		// Iterate over the form elements collection to construct the name-value pairs.
		for (var i=0; i < f.elements.length; i++) {
			e = f.elements[i];
			dF = e.disabled;
			n = e.name;
			v = e.value;

			if ((useDf) ? n : (n && dF));
			{
				switch(e.type)
				{
					case 'select-one':
					case 'select-multiple':
						for (var j = 0; j < e.options.length; j++) {
							if (e.options[j].selected) {
								if (Y.ua.ie) {
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
	/* end form serialization */

   /*** Begin public interface definition ***/
   /*
	* @description Method that stores default client headers for all transactions.
	* If a label is passed with no value argument, the header will be deleted.
	* This method implemenents _setHeader().
	*
	* @method header
	* @public
	* @static
    * @param {string} l - HTTP header
    * @param {string} v - HTTP header value
    * @return int
	*/
	_io.header = _setHeader;

   /*
	* @description Method for requesting a transaction, and queueing the
	* request before it is sent to the resource.  This method implements
	* _queue().
	*
	* @method queue
	* @public
	* @static
    * @param {string} uri - qualified path to transaction resource.
    * @param {object} c - configuration object for the transaction.
    * @return int
	*/
	_io.queue = _queue;

   /*
	* @description Method to query the current size of the queue, or to
	* set a maximum queue size.  This method implements _size().
	*
	* @method size
	* @public
	* @static
	* @param {int} i - Specified maximum size of queue.
    * @return int
	*/
	_io.queue.size = _size;

   /*
	* @description Method for setting the queue to "active". If there are
	* transactions pending in the queue, they will be processed from the
	* queue in FIFO order.  This method implements _start().
	*
	* @method start
	* @public
	* @static
    * @return void
	*/
	_io.queue.start = _start;

   /*
	* @description Method for setting queue processing to inactive.
	* Transaction requests to YUI.io.queue() will be stored in the queue, but
	* not processed until the queue is set to "active". This method
	* implements _stop().
	*
	* @method stop
	* @public
	* @static
    * @return void
	*/
	_io.queue.stop = _stop;

   /*
	* @description Method for promoting a transaction to the top of the queue.
	* This method implements _unshift().
	*
	* @method promote
	* @public
	* @static
	* @param {int} i - ID of queued transaction.
    * @return void
	*/
	_io.queue.promote = _unshift;

   /*
	* @description Method for removing a specific, pending transaction from
	* the queue. This method implements _purge();
	*
	* @method purge
	* @public
	* @static
	* @param {int} i - ID of queued transaction.
    * @return void
	*/
	_io.queue.purge = _purge;

   /*
	* @description Method for requesting a transaction. This method
	* implements _io(). Each transaction may include a configuration
	* object. Its properties are:
	*
	* method: HTTP method verb (e.g., GET or POST). If this property is not
	*         not defined, the default value will be GET.
	*
	* data: This is the name-value string that will be sent as the transaction
    *		data.  If the request is HTTP GET, the data become part of URI
    *		querystring. If HTTP POST, the data are sent in the message body.
	*
	* form: This is a defined object used to process HTML form as data.  The
	*       properties are:
	*       {
	*	      id: object, //HTML form object or id of HTML form
	*         useDisabled: boolean, //Allow disabled HTML form field values
	*                      to be sent as part of the data.
	*         useListener: boolean //Will use an Event listener to determine
	*					   which "Submit" button was selected, when multiple
	*					   "Submit" buttons are present.
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
    *               HTTP 4xx, 5xx, and beyond.
    *	  abort - This even is fired when a transaction abort is fire by
    *             timeout, or when it is manually aborted.
    *
    *     The properties are:
    *     {
	*       start: function(id, args){},
	*       complete: function(id, responseobject, args){},
	*       success: function(id, responseobject, args){},
	*       failure: function(id, responseobject, args){},
	*       abort: function(id, args){}
	*     }
	*	  Each property can reference a function or be written as an
	*     inline function.
	*
	* context: Object reference for any event handler when it is implemented
	*          as a method of a base object. Defining "context" will preserve
	*          the proper context of "this" as used in the event handler.
	* header: This is a defined object of client headers, as many as.
	*         desired for the transaction.  These headers are sentThe object
	*         pattern is:
	*		  {
	*		    header: value
	*         }
	*
	* timeout: This value, defined as milliseconds, is a time threshold for the
	*          transaction. When this threshold is reached, and the resource
	*          has not responded, the transaction will be aborted.
	* arguments: Object, array, string, or number passed to all registered
	*            event handlers.  This value is available as the second
	*            argument in the "start" and "abort" event handlers; and, it is
	*            the third argument in the "complete", "success", and "failure"
	*            event handlers.
	*
	* @method io
	* @public
	* @static
    * @param {string} uri - qualified path to transaction resource.
    * @param {object} c - configuration object for the transaction.
    * @return object
    */
	Y.io = _io;
   /*** End public interface definition ***/

}, "3.0.0");