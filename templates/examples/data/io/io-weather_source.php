<form id="wForm">
<fieldset>
	<label>Zip Code or Location ID</label> <input type="text" id="zip" value="94089">
	<p>Please enter a U.S. Zip Code or a location ID to get the current temperature.  The default is Zip Code 94089 for Sunnyvale, California; its location ID is: USCA1116.</p>
</fieldset>
<div id="weatherModule"></div>
<input type="button" value="Get Weather RSS" id="getWeather">
</form>


<script language="javascript">

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,

	function(Y) {

		//Get a Node reference to the div we'll use for displaying
		//results:
		var div = Y.Node.get('#weatherModule');

		//Define a function to handle a successful response from
		//Yahoo! Weather.  The success handler will find the response
		//object in its second argument:
		function successHandler(id, o){
			Y.log("Success handler called; handler will parse the retrieved XML and insert into DOM.", "info", "example");
			var root = o.responseXML.documentElement;
			var oTitle = root.getElementsByTagName('description')[0].firstChild.nodeValue;
			var oDateTime = root.getElementsByTagName('lastBuildDate')[0].firstChild.nodeValue;
			var descriptionNode = root.getElementsByTagName('description')[1].firstChild.nodeValue;

			div.set("innerHTML", "<p>" + oTitle + "</p>" + "<p>" + oDateTime + "</p>" + descriptionNode);

			Y.log("Success handler is complete.", "info", "example");
		}

		//Provide a function that can help debug failed
		//requests:
		function failureHandler(id, o){
			Y.log("Failure handler called; http status: " + o.status, "info", "example");
			div.set("innerHTML", o.status + " " + o.statusText);
		}

		//When the Get RSS button is clicked, this function will fire
		//and compose/dispatch the IO request:
		function getModule(){
			//Get the input value:
			var iZip = Y.Node.get('#zip').get("value");

			//Create a querystring from the input value:
			var queryString = encodeURI('?p=' + iZip);

			//The location of our server-side proxy:
			var entryPoint = '<?php echo $assetsDirectory; ?>weather.php';

			//Compile the full URI for the request:
			var sUrl = entryPoint + queryString;

			Y.log("Submitting request; zip code: " + iZip, "info", "example");

			//Make the reqeust:
			var request = Y.io(sUrl, {
				method:"GET",
				on:
					{
						success:successHandler,
						failure:failureHandler
					}
				}
			);
		}

		//Use the Event Utility to wire the Get RSS button
		//to the getModule function:
		Y.on("click", getModule, "#getWeather");

		Y.log("When you retrieve weather RSS data, relevant steps in the process will be reported here in the logger/console.", "info", "example");
	}
);
</script>
