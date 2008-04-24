YUI.add("io", function (Y) {

	// Transaction event handlers map
	var _E = ['start', 'complete', 'success', 'failure', 'abort'];

	// Window reference
	var w = Y.config.win;

	// Transaction id counter
	var transactionId = 0;

	// HTTP headers map
	var _headers = {
		'X-Requested-With' : 'XMLHttpRequest'
	};

	// Timeout map
	var _timeout = {};

	// Transaction queue and queue properties
	var _q = [];
	var _qState = 1;
	var _qMaxSize = false;

	/* Define Queue Functions */
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

	function _shift() {
		var c = _q.shift();
		_io(c.uri, c.cfg, c.id);
	};

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

	function _stop() {
		_qState = 0;
		Y.log('Queue stopped.', 'info', 'io');
	};

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

	/* --- Define Constructor --- */
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
	/* --- End Constructor --- */

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

	function _concat(s, d) {
		s += ((s.indexOf('?') == -1) ? '?' : '&') + d;
		return s;
	};

	function _setHeader(l, v) {
		if (v) {
			_headers[l] = v;
		}
		else {
			delete _headers[l];
		}
	};

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
			o.c.onreadystatechange = null;
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

	/* yui.io HTTP header interface definition*/
	_io.header = _setHeader;
	/* end yui.io interface */

	/* queue interface definition*/
	_io.queue = _queue;
	_io.queue.size = _size;
	_io.queue.start = _start;
	_io.queue.stop = _stop;
	_io.queue.promote = _unshift;
	_io.queue.purge = _purge;
	/* end queue interface */

	Y.io = _io;

}, "3.0.0");
