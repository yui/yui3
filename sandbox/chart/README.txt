USING EXAMPLES

In order to use the test files, you will need to move the files listed below to your YUI3 build directory.
yui3/sandbox/chart/build/chart/chart.js
yui3/sandbox/chart/build/chart/chart-debug.js
yui3/sandbox/chart/build/chart/chart-min.js
yui3/sandbox/chart/build/chart/assets/cartesiancanvas.swf

You may need to change the base argument of the YUI constructor in the test pages to match the directory of your build files.


	YUI({
			base: '[PUT YOUR BASE PATH HERE]',
			filter: "raw",
			modules:  { 
				swfdetect: { 
					path: "swfdetect/swfdetect.js" 
				},
				swf: {
					path: "swf/swf.js"
				},
				chart: {
					path: "chart/chart.js"
				}
			}
		}).use('node', 'event-custom', 'swfdetect', 'swf', 'chart', 'simplechart', function (Y)

By default, the application swf is located yui3/build/chart/assets/cartesiancanvas.swf. If you wish to serve it from another location,
you can specify the location with the swfurl property of the constructor's optional config argument.


	var mychart = new Y.SimpleChart("#testdiv", "line", {swfurl:"[URL TO SWF FILE]");					
	var mychart = new Y.Chart("#testdiv", {swfurl:"[URL TO SWF FILE]"});


