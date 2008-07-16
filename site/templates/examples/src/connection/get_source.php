<style>
#container li {margin-left:2em;}
</style>

<div id="container"></div>

<script>
var div = document.getElementById('container');

var handleSuccess = function(o){

	YAHOO.log("The success handler was called.  tId: " + o.tId + ".", "info", "example");
	
	if(o.responseText !== undefined){
		div.innerHTML = "<li>Transaction id: " + o.tId + "</li>";
		div.innerHTML += "<li>HTTP status: " + o.status + "</li>";
		div.innerHTML += "<li>Status code message: " + o.statusText + "</li>";
		div.innerHTML += "<li>HTTP headers: <ul>" + o.getAllResponseHeaders + "</ul></li>";
		div.innerHTML += "<li>Server response: " + o.responseText + "</li>";
		div.innerHTML += "<li>Argument object: Object ( [foo] => " + o.argument.foo +
						 " [bar] => " + o.argument.bar +" )</li>";
	}
}

var handleFailure = function(o){

		YAHOO.log("The failure handler was called.  tId: " + o.tId + ".", "info", "example");

	if(o.responseText !== undefined){
		div.innerHTML = "<ul><li>Transaction id: " + o.tId + "</li>";
		div.innerHTML += "<li>HTTP status: " + o.status + "</li>";
		div.innerHTML += "<li>Status code message: " + o.statusText + "</li></ul>";
	}
}

var callback =
{
  success:handleSuccess,
  failure:handleFailure,
  argument: { foo:"foo", bar:"bar" }
};

var sUrl = "php/get.php?username=anonymous&userid=0";

function makeRequest(){
	var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
	
	YAHOO.log("Initiating request; tId: " + request.tId + ".", "info", "example");

}

YAHOO.log("As you interact with this example, relevant steps in the process will be logged here.", "info", "example");

</script>
<form><input type="button" value="Send a GET Request" onClick="makeRequest();"></form>
