YUI({
    base: '../../../../build/',
    filter: 'RAW',
    debug: true
}).use('calendar-base',  function(Y) {
   

Y.CalendarBase.CONTENT_TEMPLATE = '<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">' +	
			                        '{header_template}' +
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' +
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' + 			
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' + 		
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' +
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' + 			
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' +
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' +
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' + 			
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' + 		
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' +
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' + 			
			                      '<div class="yui3-u-1-3">' +
 			                        '{calendar_grid_template}' +
 			                      '</div>' +  		                      			                                   
			           '</div>';


         var calendar = new Y.CalendarBase({
	        contentBox: "#mycalendar",
			height:'200px',
			width:'600px',
			showPrevMonth: true,
			showNextMonth: true,
			date: new Date(2029, 11)}).render();


	     var curDate = calendar.get("date");

	     calendar.set("headerRenderer", function (curDate) {
	     	var ydate = Y.DataType.Date,
	     	    output = ydate.format(curDate, {format: "%B, %Y"}) +
	     	             " &mdash; " +
	     	             ydate.format(ydate.addMonths(curDate, calendar._paneNumber-1), {format: "%B, %Y"});
	     	console.log("Output: " + output);
	     	return output;
	     });
			
		Y.one("#updateCalendar").on('click', function () {
	      curDate = new Date(1950 + Math.round(Math.random()*100), 
		                                Math.round(Math.random()*12.49), 1);
		  calendar.set('date', curDate);	
		  Y.one("#currentDate").setContent(calendar.get("date").toString());	
		});

		Y.one("#togglePrevMonth").on('click', function () {
		  calendar.set('showPrevMonth', !(calendar.get("showPrevMonth")));			
		});
		Y.one("#toggleNextMonth").on('click', function () {
		  calendar.set('showNextMonth', !(calendar.get("showNextMonth")));			
		});

		Y.one("#toggleSelection").on('click', function () {
		  calendar.select(new Date (curDate.getFullYear(), curDate.getMonth(), 23));
		});

});

