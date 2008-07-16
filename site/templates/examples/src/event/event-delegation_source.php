<style>
#list li {cursor:pointer;}
</style>

<div id="container">
	<ul id="list">
		<li id="li-1">List Item 1</li>
		<li id="li-2">List Item 2</li>
		<li id="li-3">List Item 3</li>
		<li id="li-4">List Item 4</li>
		<li id="li-5">List Item 5</li>
		<li id="li-6">List Item 6</li>
	</ul>
</div>

<script>

(function() {

function clickHandler(e) {
	//get the resolved (non-text node) target:
	var elTarget = YAHOO.util.Event.getTarget(e);	
	//walk up the DOM tree looking for an <li>
	//in the target's ancestry; desist when you
	//reach the container div
	while (elTarget.id != "container") {
		//are you an li?
		if(elTarget.nodeName.toUpperCase() == "LI") {
			//yes, an li: so write out a message to the log
			YAHOO.log("The clicked li had an id of " + elTarget.id, "info", "clickExample");
			//and then stop looking:
			break;
		} else {
			//wasn't the container, but wasn't an li; so
			//let's step up the DOM and keep looking:
			elTarget = elTarget.parentNode;
		}
	}
}
//attach clickHandler as a listener for any click on
//the container div:
YAHOO.util.Event.on("container", "click", clickHandler);

function mouseHandler(e) {
	var elTarget = YAHOO.util.Event.getTarget(e);
	while (elTarget.id != "container") {
		if(elTarget.nodeName.toUpperCase() == "LI") {
			YAHOO.log("The li that was mousedover had an id of " + elTarget.id, "info", "mouseExample");
			break;
		} else {
			elTarget = elTarget.parentNode;
		}
	}
}
YAHOO.util.Event.on("container", "mouseover", mouseHandler);
YAHOO.log("The example has loaded.  As you interact with the example, you will see log messages appear here in the logger console.", "info", "example");

})();

</script>