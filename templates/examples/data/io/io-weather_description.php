<h2 class="first">Exploring the Code for This Example</h2>

<p>Begin by creating a YUI instance that includes the IO module:</p>
<textarea name="code" class="JScript" cols="60" rows="1">//Create a YUI instance using the IO module:
var Y = YUI().use("io");</textarea>

<h3>Callback Object and the Weather RSS</h3>
<p><a href="http://developer.yahoo.com/weather/">Yahoo! Weather RSS</a> will return an XML document if the transaction is successful. The following <code>success</code> callback handlers is used to process the response.</p>
<textarea name="code" class="JScript" cols="60" rows="1">//Define a function to handle a successful response from
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
}</textarea>

<h3>Assemble the Querystring and Initiate the Transaction</h3>
<p>The Yahoo! Weather RSS feed requires a simple HTTP GET request with a base URL and a querystring containing the required information as a name-value pair.  In this example, we will use the following parameter:</p>
<ul>
	<li><code>p</code> &mdash; location as U.S. Zip Code or Location ID</li>
</ul>

<p>The following are some example location IDs (do not include the city name):</p>
<ul>
	<li><strong>Beijing</strong>: <em>CHXX0008</em></li>
	<li><strong>Helsinki</strong>: <em>FIXX0002</em></li>
	<li><strong>London</strong>: <em>UKXX0085</em></li>
	<li><strong>Moscow</strong>: <em>RSXX0063</em></li>
	<li><strong>Munich</strong>: <em>GMXX0087</em></li>
	<li><strong>Paris</strong>: <em>FRXX0076</em></li>
	<li><strong>Riyadh</strong>: <em>SAXX0017</em></li>
	<li><strong>Tokyo</strong>: <em>JAXX0085</em></li>
</ul>
<p>For more details on the Yahoo! Weather RSS feed and other location IDs, please visit <a href="http://developer.yahoo.com/weather/index.html">http://developer.yahoo.com/weather/index.html</a>.
<p>Function <code>getModule</code> retrieves the input values for location and creates a querystring:</p>
<textarea name="code" class="JScript" cols="60" rows="1">//When the Get RSS button is clicked, this function will fire
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
Y.on("click", getModule, "#getWeather");</textarea>

<h3>Full Script Source</h3>

<p>Here is the full JavaScript source for this example:</p>

<textarea name="code" class="JScript" cols="60" rows="1">(function() {
	//Create a YUI instance using the IO module:
	var Y = YUI().use("io");
	
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
	
})();</textarea>

<h3>Proxy and Response</h3>
<p>
Once <code>weather.php</code> receives the querystring, it will construct and send an HTTP GET using CURL to retrieve the results from the Yahoo! Weather RSS feed.  This allows the transaction to succeed while working around XMLHttpRequest's strict security policy.
</p>

<textarea name="code" class="PHP" cols="60" rows="1">
//Within a PHP block:

// Since the result is an XML document, the Content-type
// header must be set to "text/xml" for the data to be
// treated as XML and to populate responseXML.
header("Content-Type:text/xml");

// $url is the resource path of the Y! Weather RSS
// with the appended querystring of zip code/location id.
$url = 'http://xml.weather.yahoo.com/forecastrss?'.getenv('QUERY_STRING');

// This function initializes CURL, sets the necessary CURL
// options, executes the request and returns the results.
function getResource($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
}

// Call getResource to make the request.
$feed = getResource($url);

// Return the results.
echo $feed;
</textarea>