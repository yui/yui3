<div id="container">
	<ul>
    	<li>IO POST response data will appear here.</li>
    </ul>
</div>
<form><input type="button" id="requestButton" value="Send a POST Request"></form>

<script>

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,

	function(Y) {

		//Get a reference to the Node that we are using
		//to report results:
		var div = Y.Node.get('#container ul');

		//A function handler to use for successful requests:
		var handleSuccess = function(ioId, o){
			Y.log(arguments);
			Y.log("The success handler was called.  Id: " + ioId + ".", "info", "example");

			if(o.responseText !== undefined){
				var s = "<li>Transaction id: " + ioId + "</li>";
				s += "<li>HTTP status: " + o.status + "</li>";
				s += "<li>Status code message: " + o.statusText + "</li>";
				s += "<li>HTTP headers received: <ul>" + o.getAllResponseHeaders() + "</ul></li>";
				s += "<li>PHP response: " + o.responseText + "</li>";
				div.set("innerHTML", s);
			}
		}

		//A function handler to use for failed requests:
		var handleFailure = function(ioId, o){
			Y.log("The failure handler was called.  Id: " + ioId + ".", "info", "example");

			if(o.responseText !== undefined){
				var s = "<li>Transaction id: " + ioId + "</li>";
				s += "<li>HTTP status: " + o.status + "</li>";
				s += "<li>Status code message: " + o.statusText + "</li>";
				div.set("innerHTML", s);
			}
		}

		//Subscribe our handlers to IO's global custom events:
		Y.on('io:success', handleSuccess);
		Y.on('io:failure', handleFailure);


		/* Configuration object for POST transaction */
		var cfg = {
			method: "POST",
			data: "user=YDN&password=API",
			headers: { 'X-Transaction': 'POST Example'}
		};

		//The URL of the resource to which we're POSTing data:
		var sUrl = "<?php echo $assetsDirectory; ?>post.php";

		//Handler to make our XHR request when the button is clicked:
		function makeRequest(){

			div.set("innerHTML", "Loading data from new request...");

			var request = Y.io(sUrl, cfg);
			Y.log("Initiating request; Id: " + request.id + ".", "info", "example");

		}

		// Make a request when the button is clicked:
		Y.on("click", makeRequest, "#requestButton");

		Y.log("As you interact with this example, relevant steps in the process will be logged here.", "info", "example");
	}
);
</script>

