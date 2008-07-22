<button id="fetch">Load JSON RSS news feed from Yahoo! Pipes.</button>

<div id="output">
	<ul>
		<li>Content from Yahoo! Pipes feed will display here.</li>
    </ul>
</div>
    
<script language="javascript">

(function() {

	//Create YUI instance using io and JSON modules:
	var Y = new YUI().use("io", "json-parse");
	
	//Data fetched will be displayed in a UL in the
	//element #output:
	var output = Y.Node.get("#output ul");

	//Configure the cross-domain protocol:
	var xdrConfig = {
		id:'flash', //We'll reference this id in the xdr configuration of our transaction.
		yid: Y.id,  //The yid provides a link from the Flash-based XDR engine
					//and the YUI instance.
		src:'../../../build/io/io.swf' //Relative path to the .swf file from the current page.
	};
	Y.io.transport(xdrConfig);

	//Event handler called when the transaction begins:
	var handleStart = function(id, a) {
		Y.log("io:start firing.", "info", "example");
		output.set("innerHTML", "<li>Loading news stories via Yahoo! Pipes feed...</li>");
	}

	//Event handler for the success event -- use this handler to write the fetched
	//RSS items to the page.
	var handleSuccess = function(id, o, a) {
	
		//We use JSON.parse to sanitize the JSON (as opposed to simply eval'ing
		//it into the page):
		var oRSS = Y.JSON.parse(o.responseText);
		
		//From here, we simply access the JSON data from where it's provided
		//in the Yahoo! Pipes output:
		if (oRSS && oRSS.count) {
		
			var s = "<!--begin news stories fetched via Yahoo! Pipes-->",
				//t in this case is our simple template; this is fed to 
				//Y.Lang.substitute as we loop through RSS items:
				t = "<li><a href='{link}'>{title}</a>, {pubDate}</li>";
				
			for (var i=0; i<oRSS.count; i++) {
				s += Y.Lang.substitute(t, oRSS.value.items[i]);
			}
			
			//Output the string to the page:
			output.set("innerHTML", s);
		
		} else {
			//No news stories were found in the feed.
			var s = "<li>The RSS feed did not return any items.</li>";
		}
	}

	//In the event that the HTTP status returned is > 399, a
	//failure is reported and this function is called:
	var handleFailure = function(id, o, a) {
		Y.log("ERROR " + id + " " + a, "info", "example");
	}

	//With all the aparatus in place, we can now configure our
	//io call.
	var cfg = {
		method: "GET",
		xdr: { 
			use:'flash', //This is the xdrConfig id we referenced above.
			responseXML:false //we're using JSON -- marginally faster, and
							  //supported by the Pipes API
		},
		on: { 
			//Our event handlers previously defined:
			start: handleStart, 
			success: handleSuccess,
			failure: handleFailure
		}
	};

	//Wire the buttton to a click handler to fire our request each
	//time the button is clicked:
	var handleClick = function(o) {
		Y.log("Click detected; beginning io request to Yahoo! Pipes.", "info", "example");
		var obj = Y.io(
			//this is a specific Pipes feed, populated with cycling news:
			"http://pipes.yahooapis.com/pipes/pipe.run?_id=giWz8Vc33BG6rQEQo_NLYQ&_render=json",
			cfg
		);
	}	
	Y.on("click", handleClick, "#fetch");
	
})();
</script>