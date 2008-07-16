<h3>Source file and dependencies</h3>
<p>Load the YAHOO Global Object and Connection Manager source files:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
  &lt;script src="yahoo.js"&gt;
  &lt;script src="connection.js"&gt;
</textarea>

<h3>Callback Object and the Weather RSS</h3>
<p>Yahoo! Weather RSS will return an XML document if the transaction is successful. The following callback object with <code>success</code> and <code>failure</code> handlers is used to process the response.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// This is the response display container
var div = document.getElementById('weatherModule');
// This is a reference to the HTML form.
var oForm = document.getElementById('wForm');

/*
 * This method will traverse the response XML document and build a
 * simple HTML module comprised of data from the following tags:
 *
 * Data in the first <title> tag in the document.
 * Data in the first <lastBuildDate> tag in the document.
 * HTML from the second <description> tag in the document.
 *
 */
function successHandler(o){
	var root = o.responseXML.documentElement;
	var oTitle = root.getElementsByTagName('description')[0].firstChild.nodeValue;
	var oDateTime = root.getElementsByTagName('lastBuildDate')[0].firstChild.nodeValue;
	var descriptionNode = root.getElementsByTagName('description')[1].firstChild.nodeValue;

	// Format and display results in the response container.
	div.innerHTML = "<p>" + oTitle + "</p>" + "<p>" + oDateTime + "</p>" + descriptionNode;
}

/*
 *
 * This is a simple failure handler that will display
 * the HTTP status code and status message if the resource
 * returns a non-2xx code.
 *
 */
function failureHandler(o){
	div.innerHTML = o.status + " " + o.statusText;
}
</textarea>

<h3>Assemble the Querystring and Initiate the Transaction</h3>
<p>The Yahoo! Weather RSS feed requires a simple HTTP GET request with a base URL and a querystring containing the required information as name-value pairs.  In this example, we will use the following parameters:</p>
<ul>
	<li><code>p</code> &mdash; location as U.S. Zip Code or Location ID</li>
	<li><code>u</code> &mdash; temperature units</li>
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
<p>Function <code>getModule</code> retrieves the input values for location and temperature and creates a querystring:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
function getModule(){

	// retrieve the field values for the zip code
	// input and the unit input.
	var sLocation = oForm.elements['zip'].value;
	var sUnit = oForm.elements['unit'].value;

	// entryPoint is the base URL
	var entryPoint = 'php/weather.php';

	// queryString is the key-value pairs of zip and unit.
	var queryString = encodeURI('?p=' + sLocation + '&' + 'u=' + sUnit);
	var sUrl = entryPoint + queryString;

	// Initiate the HTTP GET request.
	var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, { success:successHandler, failure:failureHandler });
}
</textarea>

<h3>Proxy and Response</h3>
<p>
Once <code>weather.php</code> receives the querystring, it will construct and send an HTTP GET using CURL to retrieve the results from the Yahoo! Weather RSS feed.  This allows the transaction to succeed while working around XMLHttpRequest's strict security policy.
</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<?php

// Since the result is an XML document, the Content-type
// header must be set to "text/xml" for the data to be
// treated as XML and to populate responseXML.
header("Content-Type:text/xml");

// $url is the resource path of the Y! Weather RSS
// with the appended querystring of zip code/location id and
// temperature unit.
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
?>
</textarea>
