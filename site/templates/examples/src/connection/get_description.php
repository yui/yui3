<h2 class="first">Using Connection Manager to Retrieve a File via HTTP GET</h2>

<h3>Source file and dependencies</h3>
<p>Load the YAHOO Global Object and the Connection Manager source file:</p>

<textarea name="code" class="JScript" cols="60" rows="1"><script src="yahoo.js"></script>
<script src="connection.js"></script></textarea>

<h3>Assemble the Querystring</h3>
<p>Construct a querystring with two key-value pairs of <code>username = anonymous</code> and <code>userid = 0</code>:</p>

<textarea name="code" class="JScript" cols="60" rows="1">  /*
   *
   * Create a querystring with example key-value pairs of
   * username and userid.  Remember to encode the querystring
   * if and when the string contains special characters.
   *
   */
  var sUrl = "php/get.php?username=anonymous&userid=0";</textarea>

<h3>The Callback Object</h3>
<p>Create a callback object to handle the response, and pass an object literal to both <code>success</code> and <code>failure</code> handlers as the argument.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var div = document.getElementById('container');

var handleSuccess = function(o){
	if(o.responseText !== undefined){
		div.innerHTML = "&lt;li&gt;Transaction id: " + o.tId + "&lt;/li&gt;";
		div.innerHTML += "&lt;li&gt;HTTP status: " + o.status + "&lt;/li&gt;";
		div.innerHTML += "&lt;li&gt;Status code message: " + o.statusText + "&lt;/li&gt;";
		div.innerHTML += "&lt;li&gt;HTTP headers: &lt;ul&gt;" + o.getAllResponseHeaders + "&lt;/ul&gt;&lt;/li&gt;";
		div.innerHTML += "&lt;li&gt;Server response: " + o.responseText + "&lt;/li&gt;";
		div.innerHTML += "&lt;li&gt;Argument object: Object ( [foo] =&gt; " + o.argument.foo +
						 " [bar] =&gt; " + o.argument.bar +" )&lt;/li&gt;";
	}
}

var handleFailure = function(o){
	if(o.responseText !== undefined){
		div.innerHTML = "&lt;li&gt;Transaction id: " + o.tId + "&lt;/li&gt;";
		div.innerHTML += "&lt;li&gt;HTTP status: " + o.status + "&lt;/li&gt;";
		div.innerHTML += "&lt;li&gt;Status code message: " + o.statusText + "&lt;/li&gt;";
	}
}

var callback =
{
  success:handleSuccess,
  failure: handleFailure
  argument: { foo:"foo", bar:"bar" }
};</textarea>

<h3>Initiate the GET Transaction</h3>
<p>Call <code>YAHOO.util.Connect.asyncRequest</code> to send the request to <code>get.php</code>,
and the PHP file will return the output of <code>$_POST</code> via <code>print_r()</code>.
The <code>handleSuccess</code> callback will print the response object's properties, including
the server response data.
</p>


<textarea name="code" class="JScript" cols="60" rows="1">var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);</textarea>
