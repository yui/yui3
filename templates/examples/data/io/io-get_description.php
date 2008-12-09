<h2 class="first">Using IO for HTTP GET Requests, and Handling the Response via Event Listeners.</h2>

<h3>Create a YUI Instance</h3>
<p>Create a YUI instance, using IO, for this example:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
//Create a YUI instance including support for IO:
YUI({base:"../../build/", timeout: 10000}).use("io-base", function(Y) {
	// Y is the YUI instance.
	// The rest of the following code is encapsulated in this
	// anonymous function.
} );
</textarea>

<h3>Create Handlers for Global and Transaction Events.</h3>

<p>
We will create one object to handle the Global Events, and one object to handle Transaction Events.  Each object defines methods to handle the events in a transction's lifecycles.
The results are logged to <code>&lt;div id="container"&gt;</code>.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
//Get a reference to the Node that we are using
//to report results.
var d = Y.Node.get('#container');

/* global listener object */
var gH = {
	write: function(str, args) {
			 d.innerHTML += "ID: " + str;
			 if (args) {
			 	d.innerHTML += " " + "The arguments are: " + args;
			 }
			 d.innerHTML += "<br>";
	},
	start: function(id, args) {
			 this.write(id + ": Global Event Start.", args);
	},
	complete: function(id, o, args) {
				this.write(id + ": Global Event Complete.  The status code is: " + o.status + ".", args);
    },
	success: function(id, o, args) {
			   this.write(id + ": Global Event Success.  The response is: " + o.responseText + ".", args);
    },
	failure: function(id, o, args) {
			   this.write(o + ": Global Event Failure.  The status text is: " + o.statusText + ".", args);
    }
}
/* end global listener object */

/* transaction event object */
var tH = {
	write: function(str, args) {
			 d.innerHTML += "ID: " + str;
			 if (args) {
			   d.innerHTML += " " + "The arguments are: " + args;
			 }
			 d.innerHTML += "<br>";
	},
	start: function(id, args) {
			 this.write(id + ": Transaction Event Start.", args.start);
	},
	complete: function(id, o, args) {
				this.write(id + ": Transaction Event Complete.  The status code is: " + o.status + ".", args.complete);
	},
	success: function(id, o, args) {
			   this.write(id + ": Transaction Event Success.  The response is: " + o.responseText + ".", args.success);
	},
	failure: function(id, o, args) {
			   this.write(id + ": Transaction Event Failure.  The status text is: " + o.statusText + ".", args.failure);
	}
}
/* end transaction event object */
</textarea>

<h3>Subscribe to the Global events</h3>
<p>With the handler object <code>gH</code defined, we can now subscribe to the Global events.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// Notice the object context of "gH" is provided as the
// third argument of <code>Y.on()</code>, to preserve the proper
// context of 'this' as used in <code>gH's</code> methods.

/* Subscribe to the global events */
Y.on('io:start', gH.start, gH, 'global foo');
Y.on('io:complete', gH.complete, gH, 'global bar');
Y.on('io:success', gH.success, gH, 'global baz');
Y.on('io:failure', gH.failure, gH);
/* End event subscription */
</textarea>

<h3>Assemble a Configuration Object to set Transaction Event Listeners</h3>
<p>Use a configuration object to define which Transaction Events you wish to handle, and any additional data, for the specific transaction.</p>

<textarea name="code" class="JScript" cols="60" rows="1">

/* Configuration object for setting Transaction Events */
var cfg = {
	on: {
		start: tH.start,
		complete: tH.complete,
		success: tH.success,
		failure: tH.failure
	},
	context: tH,
	data: "user=YDN&password=API",
	headers: { 'X-Transaction': 'GET Example'},
	arguments: {
			   start: 'foo',
			   complete: 'bar',
			   success: 'baz',
			   failure: 'boo'
			   }
};
</textarea>

<h3>Initiate the Transaction</h3>
<p>
Finally, we set up two buttons -- one for each type of transaction -- and add a "click" listener to each of them.  The handler -- function <code>call()</code> -- make an
IO request, based on which button was clicked.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
function call(e, b) {
	if (b) {
		Y.io('<?php echo $assetsDirectory; ?>get.php?alllisteners=1', cfg);
	}
	else {
		Y.io('<?php echo $assetsDirectory; ?>get.php?global=1');
	}
}

Y.on('click', call, "#get1", this, false);
Y.on('click', call, "#get2", this, true);
</textarea>

<h3>Full Code</h3>

<p>The full JavaScript code for this example follows:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,

	function(Y) {

		//Get a reference to the Node that we are using
		//to report results.
		var d = Y.Node.get('#container ul');

		/* global listener object */
		var gH = {
			write: function(str, args) {
					 d.set('innerHTML', "ID: " + str);
					 if (args) {
					   d.set('innerHTML', " The arguments are: " + args);
					 }
					 d.innerHTML += "<br>";
				   },
			start: function(id, args) {
					 this.write(id + ": Global Event Start.", args);
				   },
			complete: function(id, o, args) {
						this.write(id + ": Global Event Complete.  The status code is: " + o.status + ".", args);
				   },
			success: function(id, o, args) {
					   this.write(id + ": Global Event Success.  The response is: " + o.responseText + ".", args);
					 },
			failure: function(id, o, args) {
					   this.write(o + ": Global Event Failure.  The status text is: " + o.statusText + ".", args);
					 },
			abort: function(id, args) {
					 this.write(id + ": Global Event Aborted.", args);
			}
		}
		/* end global listener object */

		/* transaction event object */
		var tH = {
			write: function(str, args) {
					 d.set('innerHTML', "ID: " + str);
					 if (args) {
					   d.set('innerHTML', " The arguments are: " + args;
					 }
					 d.innerHTML += "<br>";
				   },
			start: function(id, args) {
					 this.write(id + ": Transaction Event Start.", args.start);
				   },
			complete: function(id, o, args) {
						this.write(id + ": Transaction Event Complete.  The status code is: " + o.status + ".", args.complete);
				   },
			success: function(id, o, args) {
					   this.write(id + ": Transaction Event Success.  The response is: " + o.responseText + ".", args.success);
					 },
			failure: function(id, o, args) {
					   this.write(id + ": Transaction Event Failure.  The status text is: " + o.statusText + ".", args.failure);
					 },
			abort: function(id, args) {
					 this.write(id + ": Transaction Event Aborted.", args);
			}
		}
		/* end transaction event object */

		/* attach global listeners */
		Y.on('io:start', gH.start, gH, 'global foo');
		Y.on('io:complete', gH.complete, gH, 'global bar');
		Y.on('io:success', gH.success, gH, 'global baz');
		Y.on('io:failure', gH.failure, gH);
		Y.on('io:abort', gH.abort, gH);
		/* end global listener binding */

		/* configuration object for transactions */
		var cfg = {
			data: "user=YDN&password=API",
			on: {
				start: tH.start,
				complete: tH.complete,
				success: tH.success,
				failure: tH.failure
			},
			context: tH,
			headers: { 'X-Transaction': 'GET Example'},
			arguments: {
					   start: 'foo',
					   complete: 'bar',
					   success: 'baz',
					   failure: 'boo'
					   }
		};
		/* end configuration object */

		function call(e, b) {
			if (b) {
				Y.io('<?php echo $assetsDirectory; ?>get.php?alllisteners=1', cfg);
			}
			else {
				Y.io('<?php echo $assetsDirectory; ?>get.php?global=1');
			}
		}

		Y.get('#get1').on("click", call);
		Y.get('#get2').on("click", call, true);
	});
);</textarea>