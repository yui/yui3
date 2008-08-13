<h2 class="first">Using the Get Utility to Get a Script File with JSON-formatted Contents</h2>

<p>Here, we'll use <a href="http://developer.yahoo.com/yui/3/get/">the YUI Get Utility</a> to retrieve data via the <a href="http://developer.yahoo.com/search/siteexplorer/V1/inlinkData.html">Yahoo! Search Site-Explorer web service</a>, one of many Yahoo! APIs that support JSON.</p>

<p>This example has the following dependencies:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><script type="text/javascript" src="http://yui.yahooapis.com/<?php echo $yuiCurrentVersion;?>/build/yui/yui-min.js"></script>

<p>First, we create a plain HTML form that will work for users who do not have JavaScript enabled:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><div id="container">

	<!--Use a real form that works without JavaScript:-->
	<form method="GET" action="http://siteexplorer.search.yahoo.com/advsearch" id="siteExplorer">

        <label for="searchString">Site URL:</label> <input type="text" name="searchString" id="p" value="http://developer.yahoo.com/yui" size="40">
        
        <input type="hidden" name="bwm" value="i">
        <input type="hidden" name="bwms" value="p">
    
        <input type="submit" id="siteExplorerButton" value="Click here to get JSON data.">
    
    </form>

	<div id="results">
    	<!--JSON output will be written to the DOM here-->
        
    </div>
</div></textarea>

<p>With this in place, we can progressively enhance the form to create an in-page interaction for users with JavaScript turned on.</p>

<p>The most important JavaScript piece here is the method that we fire on form submission.  This method triggers our call to the Get Utility. This method, called <code>getSiteExplorerData</code>, accomplishes four things:</p>
<ol>
  <li>It loads a transitional state for the display, alerting the user to the fact that data is being retrieved as a result of her action;</li>
  <li>It prepares the URL that will be passed to the Get Utility;</li>
  <li>It calls the Get Utility, passing in the URL of the script resource to load (in this case, the URL of our web service with the relevant paramaters assembled in the querystring);</li>
  <li>It specifies the callback and the context in which the callback should
  run. Note that in this example the web service itself provides callback
  functionality, allowing us to pass a globally accessible callback function
  name as one of the parameters of the REST API; you can see this reference
  below. As a result, we're making direct use of the intrinsic web service
  callback in this example and just stubbing out the built-in Get Utility
  callback for the sake of illustration.</li> </ol> <p> 
  <textarea name="code" class="JScript" cols="60" rows="1">//function to retrieve data from Yahoo!
  Site Explorer web service --
// http://developer.yahoo.com/search/siteexplorer/V1/inlinkData.html

var getSiteExplorerData = function() {
    Y.log("Button clicked; getSiteExplorerData firing.", "info", "example");

    // block multiple requests
    if (loading) {
        return;
    }
    loading = true;
    
    //Load the transitional state of the results section:
    elResults.set("innerHTML", "<h3>Retrieving incoming links for " +
        Y.get("#searchString").get('value') + ":</h3>" +
        "<img src='http://l.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/busybar_1.gif' " +
        "alt='Please wait...'>");
    
    //prepare the URL for the Yahoo Site Explorer API:
    var sURL = "http://search.yahooapis.com/SiteExplorerService/V1/inlinkData?" +
        "appid=3wEDxLHV34HvAU2lMnI51S4Qra5m.baugqoSv4gcRllqqVZm3UrMDZWToMivf5BJ3Mom" +
        "&results=20&output=json&omit_inlinks=domain" +
        "&callback=MyNamespace.callback" +
        "&query=" + encodeURIComponent(Y.get("#searchString").get('value'));
    
    //This simple line is the call to the Get Utility; we pass
    //in the URL and the configuration object, which in this case
    //consists merely of our success and failure callbacks:
    var transactionObj = Y.Get.script(sURL, {
        onSuccess: onSiteExplorerSuccess,
        onFailure: onSiteExplorerFailure,
        onTimeout: onSiteExplorerTimeout,
        timeout: 20000,
        context: Y
    });
    
    //The script method returns a single-field object containing the
    //tranaction id:
    Y.log("Get Utility transaction started; transaction object: " + Y.dump(transactionObj), "info", "example");

    // keep track of the current transaction id.  The transaction will be
    // considered complete only if the web service callback is executed.
    current = transactionObj.tId; 
};
</textarea>
</p>
<p>The full JavaScript codeblock for this example reads as follows:</p>
<textarea name="code" class="JScript" cols="60" rows="1">// We are going to create a global variable to get the 
// data back from the web service
MyNamespace = YUI.namespace('example.SiteExplorer');

var elResults = Y.get("#results"),
    tIds = {},
    loading = false,
    current = null;
    
// We use the Get Utility's success handler in conjunction with
// the web service callback in order to detect bad responses 
// from the web service.
var onSiteExplorerSuccess = function(o) {

    // stop blocking requests
    loading = false;

    // A success response means the script node is inserted.  However, the
    // utility is unable to detect whether or not the content of the script
    // node is correct, or even if there was a bad response (like a 404
    // error).  To get around this, we use the web service callback to
    // verify that the script contents was correct.
    if (o.tId in tIds) {
Y.log("The Get Utility has fired the success handler indicating that the " +
      "requested script has loaded and is ready for use.", "info", "example");
    } else {
Y.log("The Get utility has fired onSuccess but the webservice callback did not " +
      "fire.  We could retry the transaction here, or notify the user of the " +
      "failure.", "info", "example");
    }

};

var onSiteExplorerFailure = function(o) {
Y.log("The Get Utility failed.", "info", "example");
};

var onSiteExplorerTimeout = function(o) {
Y.log("The Get Utility timed out.", "info", "example");
};

//function to retrieve data from Yahoo! Site Explorer web service --
// http://developer.yahoo.com/search/siteexplorer/V1/inlinkData.html
var getSiteExplorerData = function() {
    Y.log("Button clicked; getSiteExplorerData firing.", "info", "example");

    // block multiple requests
    if (loading) {
        return;
    }
    loading = true;
    
    //Load the transitional state of the results section:
    elResults.set("innerHTML", "<h3>Retrieving incoming links for " +
        Y.get("#searchString").get('value') + ":</h3>" +
        "<img src='http://l.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/busybar_1.gif' " +
        "alt='Please wait...'>");
    
    //prepare the URL for the Yahoo Site Explorer API:
    var sURL = "http://search.yahooapis.com/SiteExplorerService/V1/inlinkData?" +
        "appid=3wEDxLHV34HvAU2lMnI51S4Qra5m.baugqoSv4gcRllqqVZm3UrMDZWToMivf5BJ3Mom" +
        "&results=20&output=json&omit_inlinks=domain" +
        "&callback=MyNamespace.callback" +
        "&query=" + encodeURIComponent(Y.get("#searchString").get('value'));
    
    //This simple line is the call to the Get Utility; we pass
    //in the URL and the configuration object, which in this case
    //consists merely of our success and failure callbacks:
    var transactionObj = Y.Get.script(sURL, {
        onSuccess: onSiteExplorerSuccess,
        onFailure: onSiteExplorerFailure,
        onTimeout: onSiteExplorerTimeout,
        timeout: 20000,
        context: Y
    });
    
    //The script method returns a single-field object containing the
    //tranaction id:
    Y.log("Get Utility transaction started; transaction object: " + Y.dump(transactionObj), "info", "example");

    // keep track of the current transaction id.  The transaction will be
    // considered complete only if the web service callback is executed.
    current = transactionObj.tId; 
};

MyNamespace.callback = function(results) {
    Y.log("Web service returned data to Y.example.SiteExplorer.callback; beginning to process.", "info", "example");

    // Mark the transaction as complete.  This will be checked by the onSuccess
    // handler to determine if the transaction really succeeded.
    tIds[current] = true;
    
    //work with the returned data to extract meaningful fields:
    var aResults = results.ResultSet.Result;
    var totalLinks = results.ResultSet.totalResultsAvailable;
    var returnedLinkCount = results.ResultSet.totalResultsReturned;
    
    if(aResults) {//there are inbound links; process and display them:
    
        //write header and open list of inbound links:          
        var html = "<h3>There are " +
            totalLinks + 
            " inbound links for this page; here are the first " + 
            returnedLinkCount +
            ":</h3><ol>";
        
        //process list of inbound links:
        for (var i=0; i < aResults.length; i++) {
            html += "<li><strong>" +
                aResults[i].Title +
                ":</strong> <a href='" +
                aResults[i].Url +
                "'>" + aResults[i].Url +
                "</a></li>";
        }
        
        //close list of inbound links
        html += "</ol>";
        
    } else {//no inbound links exist for this page:
    
        var html = "<h3>There are no inbound links for the page specified.</h3>";
        
    }
    
    //insert string into DOM:
    elResults.set('innerHTML', html);
};

//suppress default form behavior
Y.on("submit", function(e) {
    e.preventDefault();
    getSiteExplorerData();
}, "#siteExplorer");
</textarea>
