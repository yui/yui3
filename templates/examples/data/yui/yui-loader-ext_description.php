<h3>Creating your YUI instance</h3>
<p>Now we need to create our YUI instance with the <code>node</code> module, so we can attach a listener to a button.</p>
<textarea name="code" class="JScript">YUI().use('node', function(Y) {
});
</textarea>

<p>YUI accepts a configuration object when you create an instance.  Your dynamic loading options can be defined here.</p>
<textarea name="code" class="JScript">YUI({

    // We can specify a node that is the insertion point for all new nodes.  This
    // is useful for making sure css rules are applied in the correct order.
    insertBefore: 'styleoverrides',

    // This lets you define one or more external modules that will be added to
    // the YUI metadata.  You can define dependency relationships between your
    // modules and also between your modules and YUI modules.  Here we are
    // defining 2.x calendar components as external modules.  See
    // <a href="http://developer.yahoo.com/3.x/api/Loader.html#method_addModule">
    // the API docs</a> for a complete list of module configuration options.
    modules: {
        'yui2-yde': {
            fullpath: "http://yui.yahooapis.com/2.5.2/build/yahoo-dom-event/yahoo-dom-event.js"
        },
        'yui2-calendar': {
            fullpath: "http://yui.yahooapis.com/2.5.2/build/calendar/calendar-min.js",
            requires: ['yui2-yde', 'yui2-calendarcss']
        },
        'yui2-calendarcss': {
            fullpath: "http://yui.yahooapis.com/2.5.2/build/calendar/assets/skins/sam/calendar.css",
            type: 'css'
        }
    }

}).use('node', function(Y) {
});
</textarea>

<h3>Creating the Calendar</h3>
<p>Now that we have our core YUI instance in place, we add an event listener to
a button that will dynamically load YUI 3.x drag and drop, and YUI 2.x calendar.</p>
<textarea name="code" class="JScript">// The callback supplied to use() will be executed regardless of
// whether the operation was successful or not.  The second parameter
// is a result object that has the status of the operation.  We can
// use this to try to recover from failures or timeouts.
if (!result.success) {

    Y.log('Load failure: ' + result.msg, 'warn', 'Example');

} else {

    // Add a button click listener to load the calendar
    var handle = Y.on('click', function(e) {

        // dynamically load the 2.x calendar and 3.x drag and drop
        Y.use('dd-drag', 'yui2-calendar', function(Y) {
            var cal1 = new YAHOO.widget.Calendar('cal1', 'cal1Cont');

            // Once the 2.x calendar renders, we will add 3.x drag
            // functionality t0 it.
            cal1.renderEvent.subscribe(function() {
                var dd = new Y.DD.Drag({
                    node: '#cal1Cont'
                }).addHandle('div.calheader');
            });
            cal1.render();
        });

        // Remove the button click listener so that we only try to
        // load the calendar control once.
        handle.detach();

    }, '#button1');
}
</textarea>

<h3>Full source</h3>
<textarea name="code" class="JScript"><input id="button1" type="button" value="Click to load YUI Calendar" class="button" />

<div id="cal1Cont"></div>

<script>

// YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
YUI({

    // Specifies whether or not to use the YUI combo service for script modules
    // This is true by default if you have not changed the configuration for 'base'
    // combine: true,

    // We can specify a node that is the insertion point for all new nodes.  This
    // is useful for making sure css rules are applied in the correct order.
    insertBefore: 'styleoverrides',

    // This lets you define one or more external modules that will be added to
    // the YUI metadata.  You can define dependency relationships between your
    // modules and also between your modules and YUI modules.  Here we are
    // defining 2.x calendar components as external modules.  See
    // <a href="http://developer.yahoo.com/3.x/api/Loader.html#method_addModule">
    // the API docs</a> for a complete list of module configuration options.
    modules: {
        'yui2-yde': {
            fullpath: "http://yui.yahooapis.com/2.5.2/build/yahoo-dom-event/yahoo-dom-event.js"
        },
        'yui2-calendar': {
            fullpath: "http://yui.yahooapis.com/2.5.2/build/calendar/calendar-min.js",
            requires: ['yui2-yde', 'yui2-calendarcss']
        },
        'yui2-calendarcss': {
            fullpath: "http://yui.yahooapis.com/2.5.2/build/calendar/assets/skins/sam/calendar.css",
            type: 'css'
        }
    },

    // Specifies whether or not optional dependencies should be loaded
    // loadOptional: true,

    // By default, the minified versions of the files are loaded.  We can specify
    // 'debug' to load versions with log statements, or 'raw' to load a version
    // that isn't minified, but has log statements stripped.
    filter: 'debug',

    // Give up if any single node request takes more than 10 seconds.
    timeout: 10000

// 3.x node will be dynamically loaded so we can work with DOM elements
}).use('node', function(Y, result) {

    // The callback supplied to use() will be executed regardless of
    // whether the operation was successful or not.  The second parameter
    // is a result object that has the status of the operation.  We can
    // use this to try to recover from failures or timeouts.
    if (!result.success) {

        Y.log('Load failure: ' + result.msg, 'warn', 'Example');

    } else {

        // Add a button click listener to load the calendar
        var handle = Y.on('click', function(e) {

            // dynamically load the 2.x calendar and 3.x drag and drop
            Y.use('dd-drag', 'yui2-calendar', function(Y) {
                var cal1 = new YAHOO.widget.Calendar('cal1', 'cal1Cont');

                // Once the 2.x calendar renders, we will add 3.x drag
                // functionality to it.
                cal1.renderEvent.subscribe(function() {
                    var dd = new Y.DD.Drag({
                        node: '#cal1Cont'
                    }).addHandle('div.calheader');
                });
                cal1.render();
            });

            // Remove the button click listener so that we only try to
            // load the calendar control once.
            handle.detach();

        }, '#button1');
    }


});
</script>

</textarea>

