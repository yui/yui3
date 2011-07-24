YUI({
    base: '../../../../build/',
    filter: 'RAW',
    debug: true
}).use('calendar',  function(Y) {
               
         var calendar = new Y.Calendar({
	        contentBox: "#mycalendar",
			height:'200px',
			width:'400px',
			date: new Date(2011, 4)}).render();
			
	     var curDate = calendar.get("date");
			
		Y.one("#updateCalendar").on('click', function () {
	      curDate = new Date(1950 + Math.round(Math.random()*100), 
		                                Math.round(Math.random()*12.49), 1);
		  Y.one("#currentDate").setContent(curDate.toString());	
		  calendar.set('date', curDate);	
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

