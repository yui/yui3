<h2 class="first">Using IO to Post Data and Receive the Server Response via HTTP POST</h2>

<h3>Create a YUI Instance</h3>
<p>The script for this example is wrapped in an anonymous function.  At the top of the anonymous function, create a YUI instance to use:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Create a YUI instance including support for IO:
var Y = YUI().use("io");</textarea>

<h3>Assemble a Configuration Object for a POST Transaction</h3>
<p>The IO configuration object support allows you to designate the transaction method (<code>POST</code> in this case) and other information, including data that should be sent as the POST body:</p>

<textarea name="code" class="JScript" cols="60" rows="1">/* Configuration object for POST transaction */
var cfg = {
    method: "POST",
    data: "user=YDN&password=API",
    headers: { 'X-Transaction': 'POST Example'},
};</textarea>

<h3>Create Handlers to Process Successful and Unsuccessful Transactions</h3>

<p>Our handlers for the events that fire on successful and unsuccessful responses will write out information about the transaction to the <code>innerHTML</code> of an element on the page:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Get a reference to the Node that we are using
//to report results:
var div = Y.Node.get('#container');
    
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
};

//A function handler to use for failed requests:
var handleFailure = function(ioId, o){
    Y.log("The failure handler was called.  Id: " + ioId + ".", "info", "example");

    if(o.responseText !== undefined){
        var s = "<li>Transaction id: " + ioId + "</li>";
        s += "<li>HTTP status: " + o.status + "</li>";
        s += "<li>Status code message: " + o.statusText + "</li>";
        div.set("innerHTML", s);
    }
};

//Subscribe our handlers to IO's global custom events:
Y.on('io:success', handleSuccess);
Y.on('io:failure', handleFailure);</textarea>

<h3>Initiate the POST Transaction</h3>
<p>
The final step in this example is to start the IO POST transaction when a button on the page is clicked.  We have a button with an ID of <code>makeRequest</code>; we wire that button to the IO request with the following code:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Handler to make our XHR request when the button is clicked:
function makeRequest(){
    
    div.set("innerHTML", "Loading data from new request...");

    var request = Y.io(sUrl, cfg);
    Y.log("Initiating request; Id: " + request.id + ".", "info", "example");

}

// Make a request when the button is clicked:
Y.on("click", makeRequest, "#requestButton");</textarea>

<h3>Full Code</h3>

<p>The full JavaScript code for this example follows:</p>

<textarea name="code" class="JScript" cols="60" rows="1">(function() {

//Create a YUI instance including support for IO:
var Y = YUI().use("io");

//Get a reference to the Node that we are using
//to report results:
var div = Y.Node.get('#container');

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
};

//A function handler to use for failed requests:
var handleFailure = function(ioId, o){
    Y.log("The failure handler was called.  Id: " + ioId + ".", "info", "example");

    if(o.responseText !== undefined){
        var s = "<li>Transaction id: " + ioId + "</li>";
        s += "<li>HTTP status: " + o.status + "</li>";
        s += "<li>Status code message: " + o.statusText + "</li>";
        div.set("innerHTML", s);
    }
};

//Subscribe our handlers to IO's global custom events:
Y.on('io:success', handleSuccess);
Y.on('io:failure', handleFailure);


/* Configuration object for POST transaction */
var cfg = {
    method: "POST",
    data: "user=YDN&password=API",
    headers: { 'X-Transaction': 'POST Example'},
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
})();</textarea>