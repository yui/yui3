<!-- css --> 
<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.5.2/build/calendar/assets/skins/sam/calendar.css"> 
<!-- js --> 
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/yahoo-dom-event/yahoo-dom-event.js"></script> 
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/calendar/calendar-min.js"></script> 

<div id="cal1Cont"></div>

<div id="results">Click a date..</div>

<script>

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,

function(Y) {
    var cal1 = new YAHOO.widget.Calendar('cal1', 'cal1Cont');
    cal1.renderEvent.subscribe(function() {
        var dd = new Y.DD.Drag({
            node: '#cal1Cont'
        }).addHandle('div.calheader');
    });
    cal1.selectEvent.subscribe(function(e, dates) {
        var d = dates[0][0];
        var dateStr = d[1] + '/' + d[2] + '/' + d[0];
        Y.Node.get('#results').set('innerHTML', 'You clicked on: ' + dateStr);
    });
    cal1.render();
});
</script>
