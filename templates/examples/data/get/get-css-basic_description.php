<h2 class="first">Using the Get Utility to Add/Remove CSS Stylesheets:</h2>

<p>In this example, clicking on the <a href="http://developer.yahoo.com/yui/button/">YUI Buttons</a> at the top of the News module adds or removes a CSS stylesheet.  The stylesheets are added and purged on-demand by the <a href="http://developer.yahoo.com/yui/get/">YUI Get Utility</a>.  This technique allows you defer the loading of some of your CSS style rules until after the initial page load &nbsp; ideally, you defer their loading until they're needed...and if they're never needed, they never need to load.  There are two performance wins here: Less CSS needs to load up front, which makes the page load more quickly, and there are fewer CSS rules in play which makes the page easier for the browser to render and manipulate.  In practice, you'd never want to implement this technique in a situation as simple as the one described in this example &nbsp; it would be much more efficient, with simple rules, to include everything on the page in the initial load.  But in a more complex application, the deferred loading of some CSS can be helpful. (<strong>Note:</strong> This example also illustrates the use of the Get Utility's <code>purge</code> method for removing CSS link nodes from the page.  While <code>purge</code> causes an immediate repaint in some <a href="http://developer.yahoo.com/yui/articles/gbs/">A-Grade browsers</a>, others need to be prodded to repaint.  While we've illustrated one way to do this here, the use of <code>purge</code> remove stylesheets on the fly is not a light technique.  Use it with discretion.)</p>

<p>This example has the following dependencies:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/button/assets/skins/sam/button.css" />
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yahoo-dom-event/yahoo-dom-event.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/element/element-beta.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/button/button.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/get/get.js"></script></textarea>

<p>We start with a simple form on the page that will post to the <a href="http://news.search.yahoo.com/news/advanced">Yahoo! News Search engine</a>; if JavaScript is not enabled, the user will still be able to use the functionality of the News module.  A placeholder is added for the YUI Buttons that we'll add via script.  Those buttons do not need to be part of the page markup, because they aren't required for the core functionality of the page...they just control the CSS addition and removal, which in this case is cosmetic.</p>

<textarea name="code" class="HTML" cols="60" rows="1"><div id="container">
    <div id="buttonContainer">
        <!--YUI Button instances, created from script, will go here.-->
    </div>

    <div class="module">
        <div class="hd"><h2>In the News:</h2></div>
        <div class="bd" id="results">
            <!--News stories will be displayed here.-->
        </div>
        <div class="ft">        
            <div id="searchControls">
                <!--Use a real form that works without JavaScript:-->
                <form method="GET" action="http://search.yahooapis.com/NewsSearchService/V1/newsSearch" id="newsSearch">            
                    <label for="searchString">Search Yahoo! News:</label> <input type="text" name="p" id="searchString" value="San Francisco" size="40">                
                    <input type="submit" id="getNewsData" value="Search Yahoo! News">                
                </form>            
            </div>
        </div>
    </div>
</div></textarea>

<p>With the markup in place, we can now create our YUI Buttons.  We'll use Buttons of type <code>checkbox</code>; these can be clicked on or off to add/remove their corresponding CSS stylesheets.  The <code>name</code> property of each Button will be used to identify the specific CSS stylesheet that the Button controls.</p>

<textarea name="code" class="JScript" cols="60" rows="1">// YUI Buttons are attractive and effective for "call to action"
// tasks like the one here.  We'll create buttons purely from
// JavaScript; there's no need for this style-change functionality
// to be "accessible"; in fact, it's purely cosmetic, so keeping
// these buttons out of the page's initial DOM is preferable.  We'll
// use the "name" property of the button to determine what CSS to
// load when each button is clicked:
var borderButton = new Button({
    id: "borderButton",
    type: "checkbox",
    name: "border",
    label: "Border CSS",
    container: "buttonContainer" 
});
var backgroundButton = new Button({
    id: "backgroundButton",
    type: "checkbox",
    name: "background",
    label: "Background CSS",
    container: "buttonContainer"
});
var textButton = new Button({
    id: "textButton",
    type: "checkbox",
    name: "text",
    label: "Text CSS",
    container: "buttonContainer"
});</textarea>

<p>The Get Utility is invoked when a Button's <code>checked</code> state changes; this could happen via a click or by tabbing to a Button and pressing <code>return</code> or <code>enter</code>.  When that happens, the Button's <code>onCheckedChange</code> event fires.  At that point, we determine whether the new button state is checked (in which case we bring in the related CSS file) or unchecked (in which case we purge the related CSS file).</p>

<textarea name="code" class="JScript" cols="60" rows="1">// Checkbox buttons are either checked or unchecked; when their state
// changes, their "onCheckedChange" event fires.  We'll use that
// event to trigger the loading and unloading of CSS using the Get
// Utility.
var onCheckedChange = function() {
    // Which button was actuated?
    var name = this.get("name");
    // The button's checked state has already been updated, so if
    // true we load the necessary CSS:
    if(this.get("checked")) {
        // We'll use the 'data' parameter to pass through the name
        // of the CSS file to our onSuccess handler.  This allows
        // us to have access to the purge method when we want
        // to remove the CSS.
        //
        // In addition, we use the 'insertBefore' property to specify
        // the id of a style block we want to insert the new nodes
        // before.  By doing this, we can assure that any style overrides
        // for the dynamically loaded CSS will be applied in the correct
        // order.
        Get.css("../get/assets/" + name + ".css", {
                data:         name,
                insertBefore: "styleoverrides",
                onSuccess:    onSuccess
        });
    } else {
        // In onSuccess, we save a reference to the callback object
        // in an associative array (tIds) indexed by the CSS name.  That 
        // allows us here, when the CSS needs to be removed, to simply
        // call the purge method corresponding to the item we want to 
        // remove.  Purge clears all the link nodes that were created
        // as part of the transaction (in this case, just a single 
        // link node).
        tIds[this.get("name")].purge();
        YAHOO.log("CSS was successfully purged; our object " +
                  "containing transaction ids now looks like " +
                  "this: " + YAHOO.lang.dump(tIds),  "info", "example");

        // Some A-Grade browsers won't repaint automatically when CSS link nodes
        // are removed.  You can nudge these browsers to repaint by adding
        // a blank CSS stylesheet to the page:
        Get.css("../get/assets/neutral.css");
    }
};

// Now we can subscribe our onCheckedChange function to each
// of our three YUI Buttons' "checkedChange" event:
borderButton.on("checkedChange", onCheckedChange);
backgroundButton.on("checkedChange", onCheckedChange);
textButton.on("checkedChange", onCheckedChange);</textarea>

<p>In the codeblock above, we call the <code>purge</code> method to remove CSS files when Buttons are unchecked.  The <code>purge</code> function is part of <a href="http://developer.yahoo.com/yui/3/get/#args">the callback object</a> passed to the <code>onSuccess</code> or <code>onFailure</code> handler registered with the Get Utilty when the <code>css</code> method is called.  In our <code>onSuccess</code> handler, we will save that callback object in an associative array so we can access <code>purge</code> as needed when a Button is unchecked: </p>

<textarea name="code" class="JScript" cols="60" rows="1">// As noted above, in onSuccess we want to save the callback
// object in an associative array indexed by CSS file name so that
// we can purge the link nodes later if the CSS file needs to be
// removed.
var onSuccess = function(o) {
    tIds[o.data] = o;
    YAHOO.log("CSS was successfully returned; our object " + 
              "containing transaction ids now looks like " + 
              "this: " + YAHOO.lang.dump(tIds), "info", "example");
}

})();</textarea>

<p>The full JavaScript code for the CSS portion of this example is as follows:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Encapsulating our code in a self-executing anonymous function
// is one way to create a namespace:
(function() {

// shortcuts and other variables:
var Button = YAHOO.widget.Button,
    Event = YAHOO.util.Event,
    Dom = YAHOO.util.Dom,
    Get = YAHOO.util.Get,
    elContainer = Dom.get("container"),
    tIds = {};

// YUI Buttons are attractive and effective for "call to action"
// tasks like the one here.  We'll create buttons purely from
// JavaScript; there's no need for this style-change functionality
// to be "accessible"; in fact, it's purely cosmetic, so keeping
// these buttons out of the page's initial DOM is preferable.  We'll
// use the "name" property of the button to determine what CSS to
// load when each button is clicked:
var borderButton = new Button({
    id: "borderButton",
    type: "checkbox",
    name: "border",
    label: "Border CSS",
    container: "buttonContainer" 
});
var backgroundButton = new Button({
    id: "backgroundButton",
    type: "checkbox",
    name: "background",
    label: "Background CSS",
    container: "buttonContainer"
});
var textButton = new Button({
    id: "textButton",
    type: "checkbox",
    name: "text",
    label: "Text CSS",
    container: "buttonContainer"
});
// Making available outside the anonymous function so these can be
// introspected in FireBug if desired:
YAHOO.example.buttons = [borderButton, backgroundButton, textButton];

// Checkbox buttons are either checked or unchecked; when their state
// changes, their "onCheckedChange" event fires.  We'll use that
// event to trigger the loading and unloading of CSS using the Get
// Utility.
var onCheckedChange = function() {
    // Which button was actuated?
    var name = this.get("name");
    // The button's checked state has already been updated, so if
    // true we load the necessary CSS:
    if(this.get("checked")) {
        // We'll use the 'data' parameter to pass through the name
        // of the CSS file to our onSuccess handler.  This allows
        // us to have access to the purge method when we want
        // to remove the CSS.
        //
        // In addition, we use the 'insertBefore' property to specify
        // the id of a style block we want to insert the new nodes
        // before.  By doing this, we can assure that any style overrides
        // for the dynamically loaded CSS will be applied in the correct
        // order.
        Get.css("../get/assets/" + name + ".css", {
                data:         name,
                insertBefore: "styleoverrides",
                onSuccess:    onSuccess
        });
    } else {
        // In onSuccess, we save a reference to the callback object
        // in an associative array (tIds) indexed by the CSS name.  That 
        // allows us here, when the CSS needs to be removed, to simply
        // call the purge method corresponding to the item we want to 
        // remove.  Purge clears all the link nodes that were created
        // as part of the transaction (in this case, just a single 
        // link node).
        tIds[this.get("name")].purge();
        YAHOO.log("CSS was successfully purged; our object " +
                  "containing transaction ids now looks like " +
                  "this: " + YAHOO.lang.dump(tIds),  "info", "example");
    }
};

// Now we can subscribe our onCheckedChange function to each
// of our three YUI Buttons' "checkedChange" event:
borderButton.on("checkedChange", onCheckedChange);
backgroundButton.on("checkedChange", onCheckedChange);
textButton.on("checkedChange", onCheckedChange);

// As noted above, in onSuccess we want to save the callback
// object in an associative array indexed by CSS file name so that
// we can purge the link nodes later if the CSS file needs to be
// removed.
var onSuccess = function(o) {
    tIds[o.data] = o;
    YAHOO.log("CSS was successfully returned; our object " +
              "containing transaction ids now looks like " +
              "this: " + YAHOO.lang.dump(tIds), "info", "example");
}

})();</textarea>
