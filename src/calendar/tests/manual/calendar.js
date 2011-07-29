YUI({
    base: '../../../../build/',
    lang: "en"
}).use('calendar',  function(Y) {

         Y.CalendarBase.CONTENT_TEMPLATE = Y.CalendarBase.TWO_PANE_TEMPLATE;
         var calendar = new Y.Calendar({
	        contentBox: "#mycalendar",
			width:'300px',
			showPrevMonth: false,
			showNextMonth: false,
			selectionMode: 'multiple',
			date: new Date(2011, 6)}).render();

         console.log(Y.Calendar.prototype.UI_EVENTS);
		 var rules = {
		 	"all": {
		 		"all": {
		 			"all": {
		 				"2, 5": "work_from_home",
		 				"0, 6": "all_weekends"
		 			}
		 		}
		 	}
		 };

		 calendar.set("customRenderer", {rules: rules, 
			                             filterFunction: function (date, node, rules) {
			                             	               if (rules.indexOf('all_weekends') >= 0) {
			                             	               	node.addClass("redtext");
			                             	               }
			                                             }
			                            });
    
	     var curDate = calendar.get("date");

 
	     calendar.set("headerRenderer", function (curDate) {
	     	var ydate = Y.DataType.Date,
	     	    output = ydate.format(curDate, {format: "%B %Y"}) +
	     	             " &mdash; " +
	     	             ydate.format(ydate.addMonths(curDate, calendar._paneNumber-1), {format: "%B %Y"});
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

		Y.one("#getSelectedDates").on('click', function () {
		  console.log(calendar.get('selectedDates'));
		});

		calendar.on("selectionChange", function (ev) {console.log(ev);});

});

