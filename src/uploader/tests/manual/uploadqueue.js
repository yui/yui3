YUI({
    base: '../../../../build/',
    lang: "en",
    filter: "raw",
    debug: true,
    useBrowserConsole: true
}).use('node', 'file', 'uploader-queue',  function(Y) {

var fs = Y.one("#selectFiles");
var uf = Y.one("#uploadFiles");
var allfiles = [];
var out = Y.one("#output");
var myqueue;

fs.on("change", function (ev) {
     var myfiles = ev.target.getDOMNode().files;
     allfiles = [];
     Y.each(myfiles, function (value) {
     	var newfile = new Y.File(value);
     	allfiles.push(newfile);
     	out.append("<div id='" + newfile.get("id") + "'>" + newfile.get("name") + " | " + 0 + "%</div>");
     });
     
     myqueue = new Y.Uploader.Queue({simUploads: 2, 
	                                       errorAction: "restart",
	                                       fileList: allfiles,
	                                       uploadURL: "upload.php",
	                                       perFileParameters: {foo: "bar"}
	                                       });
 	
 	 myqueue.on("uploadprogress", function (ev) {
        out.one("#" + ev.file.get("id")).setContent(ev.file.get("name") + " | " + ev.percentLoaded + "%");
	 });

	 myqueue.on("uploadcomplete", function (ev) {
	 	out.one("#" + ev.file.get("id")).append("<br><p>DATA:<br> " + ev.data + "</p><br>");
	 });
	 
	 
	 myqueue.on("totaluploadprogress", function (ev) {
	 	out.one("#totalpercent").setContent("Total upload progress: " + ev.percentLoaded);
	 });

    
	 myqueue.on("alluploadscomplete", function (ev) {
	 	out.one("#totalpercent").append("<p>Upload complete!</p>");
	 });	                                    	                                       
 });

	 uf.on("click", function () {
	 	//Y.log("Starting upload...");
	 	myqueue.startUpload();
	 });


});

