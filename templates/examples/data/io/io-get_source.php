<div id="container">
	<ul>
    	<li>IO GET response data will appear here.</li>
    </ul>
</div>
<form>
	<input id="get1" type="button" value="GET with Global Listeners. " />
	<input id="get2" type="button" value="GET with Global and Transaction Listeners" />
</form>

<script>
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
					   d.set('innerHTML', " The arguments are: " + args;
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
</script>