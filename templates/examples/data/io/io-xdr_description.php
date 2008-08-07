<h2 class="first">Implementing a Simple Cross-Domain Request for JSON Data</h2>

<p>In this example, we begin with a YUI instance that loads the IO and JSON modules:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
//Create a YUI instance including support for IO and JSON modules:
YUI({base:"../../build/", timeout: 10000}).use("io", "substitute", "json-parse", function(Y) {
	// Y is the YUI instance.
	// The rest of the following code is encapsulated in this
	// anonymous function.
} );
</textarea>
<p>We'll also get a Node reference to the container we'll be using to output the data we retrieve:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Data fetched will be displayed in a UL in the
//element #output:
var output = Y.Node.get("#output ul");</textarea>

<p>Next, we configure IO's cross-domain interface for this YUI instance.  Flash is the underlying mechansim used here.  Be sure to configure the <code>src</code> property to point to your <code>IO.swf</code> file.</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Configure the cross-domain protocol:
var xdrConfig = {
    id:'flash', //We'll reference this id in the xdr configuration of our transaction.
    yid: Y.id,  //The yid provides a link from the Flash-based XDR engine
                //and the YUI instance.
    src:'../../build/io/IO.swf' //Relative path to the .swf file from the current page.
};
Y.io.transport(xdrConfig);</textarea>

<p>The configuration for our specific IO transaction contains a reference to the <code>xdr</code> configuration we created above and specifies that there will not be a need to process the response as XML (we're getting JSON instead):</p>

<textarea name="code" class="JScript" cols="60" rows="1">var cfg = {
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
};</textarea>

<p>The final step is to make the request:</p>

<textarea name="code" class="JScript" cols="60" rows="1">var obj = Y.io(
    //this is a specific Pipes feed, populated with cycling news:
    "http://pipes.yahooapis.com/pipes/pipe.run?_id=giWz8Vc33BG6rQEQo_NLYQ&_render=json",
    cfg
);</textarea>

<h3>Full Script</h3>

<p>The full script source for this example is as follows:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YUI({base:"../../build/", timeout: 10000}).use("io", "substitute", "json-parse",

	function(Y) {

		//Data fetched will be displayed in a UL in the
		//element #output:
		var output = Y.Node.get("#output ul");

		//Configure the cross-domain protocol:
		var xdrConfig = {
			id:'flash', //We'll reference this id in the xdr configuration of our transaction.
			yid: Y.id,  //The yid provides a link from the Flash-based XDR engine
						//and the YUI instance.
			src:'../../build/io/IO.swf' //Relative path to the .swf file from the current page.
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

		//add the clickHandler as soon as the xdr Flash module has
		//loaded:
		Y.on('io:xdrReady', function() {
			var fetch = Y.Node.get("#fetch");
			fetch.set("disabled", false);
			Y.on("click", handleClick, fetch);
		});
	}
);
</textarea>