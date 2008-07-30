<div id="demo">
    <input type="button" id="demo_btn" value="Get Messages">

    <div id="demo_msg"></div>
</div>
<script type="text/javascript">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

    var target = Y.Node.get('#demo_msg');

    var callback = {

        timeout : 3000,

        on : {
            success : function (x,o) {
                Y.log("RAW JSON DATA: " + o.responseText);

                // Process the JSON data returned from the server
                var messages = [],
                    html = '', i, l;

                try {
                    messages = Y.JSON.parse(o.responseText);
                }
                catch (e) {
                    alert("JSON Parse failed!");
                    return;
                }

                Y.log("PARSED DATA: " + Y.Lang.dump(messages));

                // The returned data was parsed into an array of objects.
                // Add a P element for each received message
                for (i=0, l=messages.length; i < l; ++i) {
                    html += '<p>' + messages[i].animal + ' says &quot;' +
                                    messages[i].message + '&quot;</p>';
                }

                // Use the Node API to apply the new innerHTML to the target
                target.set('innerHTML',html);
            },

            failure : function (x,o) {
                alert("Async call failed!");
            }

        }
    }

    // Attach a click event listener to the button #demo_btn to send the request
    Y.on('click',function (e) {
        // Make the call to the server for JSON data
        transaction = Y.io("<?php echo($assetsDirectory);?>jsonConnect.php", callback);
    },'#demo_btn');

});
</script>
