<h2 class="first">Using Connection Manager to Post Data and Receive the Server Response via HTTP POST</h2>

<h3>Source file and dependencies</h3>
<p>Load the YAHOO Global Object and Connection Manager source files:</p>

<textarea name="code" class="JScript" cols="60" rows="1"><script src="yahoo.js"></script>
<script src="connection.js"></script></textarea>

<h3>Assemble the POST message</h3>
<p>Construct an example of key-value string of <code>username = anonymous</code> and <code>userid = 0</code>:</p>
<textarea name="code" class="JScript" cols="60" rows="1">/*
* Remember to encode the key-value string if and when
* the string contains special characters.
*/
var postData = "username=anonymous&userid=0";
</textarea>
<h3>The Callback Object</h3>
<p>Create a callback object to handle the response and pass an array of values to success and failure as the argument.</p>

<textarea name="code" class="JScript" cols="60" rows="1">var handleSuccess = function(o){

	if(o.responseText !== undefined){
		div.innerHTML = "Transaction id: " + o.tId;
		div.innerHTML += "HTTP status: " + o.status;
		div.innerHTML += "Status code message: " + o.statusText;
		div.innerHTML += "&lt;li&gt;HTTP headers: &lt;ul&gt;" + o.getAllResponseHeaders + "&lt;/ul&gt;&lt;/li&gt;";
		div.innerHTML += "PHP response: " + o.responseText;
		div.innerHTML += "Argument object: " + o.argument;
	}
}

var callback =
{
  success:handleSuccess,
  failure: handleFailure,
  argument: ['foo','bar']
};
</textarea>

<h3>Initiate the POST Transaction</h3>
<p>
Call <code>YAHOO.util.Connect.asyncRequest</code> to send the request to post.php, and the PHP file will return the a readable output of <code>$_POST</code> via <code>print_r()</code>. The <code>handleSuccess<code></code></code> callback will print the response object's properties, including the server response data.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">var request = YAHOO.util.Connect.asyncRequest('POST', sUrl, callback, postData);
</textarea>