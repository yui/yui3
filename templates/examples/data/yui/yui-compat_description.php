<h3>Including YUI 2.x</h3>
<p>First we will include the code for the 2.x Calendar Control and its dependencies.</p>
<textarea name="code" class="HTML">
&lt;!-- css --&gt;
&lt;link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.5.2/build/calendar/assets/skins/sam/calendar.css"&gt;
&lt;!-- js --&gt;
&lt;script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/yahoo-dom-event/yahoo-dom-event.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/calendar/calendar-min.js"&gt;&lt;/script&gt;
</textarea>

<h3>Creating your YUI instance</h3>
<p>Now we need to create our YUI instance with the <code>dd-drag</code> module, so we can make the calendar draggable.</p>
<textarea name="code" class="JScript">
YUI().use('dd-drag', function(Y) {
});
</textarea>

<h3>Creating the Calendar</h3>
<p>Now that we have our tools in place, let's create the calendar.</p>
<textarea name="code" class="JScript">
YUI().use('dd-drag', function(Y) {
    var cal1 = new YAHOO.widget.Calendar('cal1', 'cal1Cont');
    cal1.render();
});
</textarea>

<h3>Making it draggable</h3>
<p>Now we make the calendar draggable with the 3.x <code>dd-drag</code> module.</p>
<textarea name="code" class="JScript">
YUI().use('dd-drag', function(Y) {
    var cal1 = new YAHOO.widget.Calendar('cal1', 'cal1Cont');
    cal1.renderEvent.subscribe(function() {
        var dd = new Y.DD.Drag({
            node: '#cal1Cont'
        }).addHandle('div.calheader');
    });
    cal1.render();
});
</textarea>

<h3>Handling the Calendars Select Event with Node</h3>
<p>Now we need to hook up the <code>selectEvent</code> and handle that with 3.x's <code>Node</code>.</p>
<textarea name="code" class="JScript">
YUI().use('dd-drag', function(Y) {
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
</textarea>

