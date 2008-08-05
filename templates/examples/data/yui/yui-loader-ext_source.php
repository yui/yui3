
<input id="button1" type="button" value="Click to load YUI Calendar" class="button" />

<div id="cal1Cont"></div>

<script>

YUI(<?php echo getYUIConfig("insertBefore: 'styleoverrides', modules: { 'yui2-yde': { fullpath: 'http://yui.yahooapis.com/2.5.2/build/yahoo-dom-event/yahoo-dom-event.js' }, 'yui2-calendar': { fullpath: 'http://yui.yahooapis.com/2.5.2/build/calendar/calendar-min.js', requires: ['yui2-yde', 'yui2-calendarcss'] }, 'yui2-calendarcss': { fullpath: 'http://yui.yahooapis.com/2.5.2/build/calendar/assets/skins/sam/calendar.css', type: 'css' } }");?>).use('node', function(Y, result) {

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
