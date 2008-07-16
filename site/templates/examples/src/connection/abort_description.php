<h2 class="first">Setting Transaction Timeouts with Connection Manager</h2>

<p>The following code example provides a step-by-step approach to presetting a transaction timeout.</p>

<h3>Source file and dependencies</h3>
<p>Load the YAHOO Global Object and Connection Manager source files:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script src="yahoo.js"></script>
<script src="connection.js"></script>
</textarea>

<h3>The Callback Object</h3>
<p>The callback object includes a <code>timeout</code> property that allows you to specify the amount of time you're willing to wait for a transaction to complete before aborting. To cause a transaction to automatically timeout, the <code>timeout</code> property must be defined wih a value in millseconds. This example defines timeout with a value of 5000(milliseconds). If the transaction is not complete within 5000ms, it will be aborted.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var handleSuccess = function(o){
	if(o.responseText !== undefined){
		div.innerHTML = "Transaction id: " + o.tId;
		div.innerHTML += "HTTP status: " + o.status;
		div.innerHTML += "Server response: " + o.responseText;
		div.innerHTML += "Argument object: property foo = " + o.argument.foo +
						 "and property bar = " + o.argument.bar;
	}
}

var handleFailure = function(o){
	div.innerHTML += "<li>Transaction id: " + o.tId + "</li>";
	div.innerHTML += "<li>HTTP status: " + o.status + "</li>";
	div.innerHTML += "<li>Status code message: " + o.statusText + "</li>";
}

var callback =
{
  success:handleSuccess,
  failure: handleFailure,
  argument: { foo:"foo", bar:"bar" },
  timeout: 5000
};
</textarea>


<h3>Initiate the Transaction</h3>
<p>
Call <code>YAHOO.util.Connect.asyncRequest</code> to send the request to <code>sync.php</code>. The PHP file will return a string message after a random delay of 0 to 10 seconds if the transaction was not aborted. If the transaction was successfully aborted, the response object's status property will report <code>-1</code> and the <code>statusText</code> property will report "transaction aborted".
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var sUrl = "php/sync.php";
var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
</textarea>