<h3 class="first">Use <code>Y.JSON.parse</code> in the success handler</h3>
<p>Pass the XHR <code>responseText</code> to <code>Y.JSON.parse</code> and capture the return value.  Note that the parse method can throw a <code>SyntaxError</code> exception, so be sure to wrap the call in a <code>try/catch</code> block.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
// Create business logic in a YUI sandbox using the 'io' and 'json' modules
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

    // capture the node that we'll display the messages in
    var target = Y.Node.get('#demo_msg');

    // Create the io callback/configuration
    var callback = {

        timeout : 3000,

        on : {
            success : function (x,o) {
                Y.log("RAW JSON DATA: " + o.responseText);

                var messages = [],
                    html = '', i, l;

                // Process the JSON data returned from the server
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
</textarea>

<p>The <code>parse</code> method returns the native JavaScript object representation of the string data returned from the <code>Y.io</code> call.  In this case, the data is an array of object literals in this form:</p>
<textarea name="code" class="JScript" rows="1" cols="60">
[
    { "animal" : "Cat",  "message" : "Meow"  },
    { "animal" : "Dog",  "message" : "Woof"  },
    { "animal" : "Cow",  "message" : "Moo"   },
    { "animal" : "Duck", "message" : "Quack" },
    { "animal" : "Lion", "message" : "Roar"  }
]
</textarea>
