<form id="wForm">
<fieldset>
	<label>Zip Code or Location ID</label> <input type="text" name="zip" value="94089">
	<p>Please enter a U.S. Zip Code or a location ID to get the current temperature.  The default is Zip Code 94089 for Sunnyvale, California; its location ID is: USCA1116.</p>
</fieldset>
<fieldset>
<label>Unit</label> <input type="text" name="unit" length="1" maxlength="1">
<p>Enter *F* for Fahrenheit or *C* for Celsius temperature unit.
</fieldset>
<div id="weatherModule"></div>
<input type="button" value="Get Weather RSS" onClick="getModule()">
</form>
<script>
var div = document.getElementById('weatherModule');
var oForm = document.getElementById('wForm');

function successHandler(o){
	YAHOO.log("Success handler called; handler will parse the retrieved XML and insert into DOM.", "info", "example");

	var root = o.responseXML.documentElement;
	var oTitle = root.getElementsByTagName('description')[0].firstChild.nodeValue;
	var oDateTime = root.getElementsByTagName('lastBuildDate')[0].firstChild.nodeValue;
	var descriptionNode = root.getElementsByTagName('description')[1].firstChild.nodeValue;

	div.innerHTML = "<p>" + oTitle + "</p>" + "<p>" + oDateTime + "</p>" + descriptionNode;
	
	YAHOO.log("Success handler is complete.", "info", "example");
}

function failureHandler(o){
	YAHOO.log("Failure handler called; http status: " + o.status, "info", "example");

	div.innerHTML = o.status + " " + o.statusText;
}

function getModule(){
	var iZip = oForm.elements['zip'].value;
	var sUnit = oForm.elements['unit'].value;
	var entryPoint = 'php/weather.php';
	var queryString = encodeURI('?p=' + iZip + '&' + 'u=' + sUnit);
	var sUrl = entryPoint + queryString;
	
	YAHOO.log("Submitting request; zip code: " + iZip + "; units: " + sUnit, "info", "example");

	var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, { success:successHandler, failure:failureHandler });
}
YAHOO.log("When you retrieve weather RSS data, relevant steps in the process will be reported here in the logger.", "info", "example");

</script>
