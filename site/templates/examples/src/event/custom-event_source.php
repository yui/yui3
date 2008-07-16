<style type="text/css">
#intro {padding:10px; background-color:#EEEEEE; font-style:italic; font-size:92%;}
#container {width:400px; height:100px; padding:10px; border:1px dotted black;background-color:#CCCCCC; cursor:pointer;}
#resizer {width:200px; height:75px; background-color:#00CCFF;}
#subscriberWidth {width:200px; height:75px; margin-top:10px;background-color:#CC9966;}
#subscriberHeight {width:200px; height:75px;  margin-top:10px;background-color:#FF3333;}
</style>

<div id="container">
  <div id="resizer">
  	Click anywhere within the grey box 
	to resize me.
  </div>
</div>
<div id="subscriberWidth">
  <strong>Width will resize to match blue 
  box.</strong>
</div>
<div id="subscriberHeight">
  <strong>Height will resize to match blue
  box.</strong>
</div>

<script>
(function() {
	
	//create a new custom event, to be fired
	//when the resizer div's size is changed
	var onSizeChange = new YAHOO.util.CustomEvent("onSizeChange");
	
	//get local references to dom elements,
	//for convenience
	var container = YAHOO.util.Dom.get("container");
	var resizer = YAHOO.util.Dom.get("resizer");
	
	//when the container is clicked on, change the 
	//dimensions of the resizer -- as long as it appears
	//to be a valid new size (>0 width, >12 height).
	function fnClick(e){
		
		//0,0 point is the top left corner of the container,
		//minus its padding:
		var containerX = YAHOO.util.Dom.getX("container");
		var containerY = YAHOO.util.Dom.getY("container");
		var clickX = YAHOO.util.Event.getPageX(e);
		var clickY = YAHOO.util.Event.getPageY(e);
		//get container padding using Dom's getStyle():
		var containerPaddingX = parseInt(YAHOO.util.Dom.getStyle("container","padding-left"), 10);
		var containerPaddingY = parseInt(YAHOO.util.Dom.getStyle("container","padding-top"), 10);
		var newWidth = clickX - containerX - containerPaddingX;
		var newHeight = clickY - containerY - containerPaddingY;
		
		//if there is a valid new dimension, we'll change
		//resizer and fire our custom event
		if ((newWidth > 0)||(newHeight > 12)) {
			//correct new height/width to guarantee
			//minimum of 0x12	
			if (newWidth < 0) {newWidth = 1;}
			if (newHeight < 12) {newHeight = 12;}
			//show new dimensions in resizer:
			YAHOO.util.Dom.get("resizer").innerHTML = "New size: " + newWidth + "x" + newHeight;
			//change the dimensions of resizer, using
			//Dom's setStyle:
			YAHOO.util.Dom.setStyle("resizer", "width", newWidth + "px");
			YAHOO.util.Dom.setStyle("resizer", "height", newHeight + "px");

			 //fire the custom event, passing
			 //the new dimensions in as an argument;
			 //our subscribers will be able to use this
			 //information:
			onSizeChange.fire({width: newWidth, height: newHeight});
		};
		
	}
	
	//listen for clicks on the container
	YAHOO.util.Event.addListener("container", 'click', fnClick);

	//a handler to respond to the custom event that
	//we're firing when the resizer changes size; we'll
	//resize its width to match the resizer.
	fnSubscriberWidth = function(type, args) {
		var elWidth = YAHOO.util.Dom.get("subscriberWidth");
		var newWidth = args[0].width;
		YAHOO.util.Dom.setStyle(elWidth, "width", (newWidth + "px"));
		elWidth.innerHTML = ("My new width: " + newWidth + "px");
		YAHOO.log("The Custom Event fired; the the new width is " + newWidth + "px.", "info", "example");
	}
	
	//another handler to respond to the custom event that
	//we're firing when the resizer changes size; this
	//one cares about the height of the resizer.
	fnSubscriberHeight = function(type, args) {
		var elHeight = YAHOO.util.Dom.get("subscriberHeight");
		var newHeight = args[0].height;
		YAHOO.util.Dom.setStyle(elHeight, "height", (newHeight + "px"));
		elHeight.innerHTML = ("My new height: " + newHeight + "px");
		YAHOO.log("The Custom Event fired; the the new height is " + newHeight + "px.", "info", "example");
	}	
	
	//all that remains is to subscribe our
	//handlers to the <code>onSizeChange</code> custom event:
	onSizeChange.subscribe(fnSubscriberWidth);
	onSizeChange.subscribe(fnSubscriberHeight);
	
	
	YAHOO.log("The example has finished loading; as you interact with it, you'll see log messages appearing here.", "info", "example");

})();

</script>