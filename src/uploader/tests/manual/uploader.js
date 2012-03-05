YUI({
    base: '../../../../build/',
    lang: "en",
    filter: "raw",
    debug: true,
    useBrowserConsole: true
}).use('cssbutton', 'uploader',  function(Y) {

var myuploader = new Y.Uploader({contentBox: "#fileselection", 
                                 multipleFiles: true, 
                                 uploadURL: "http://home.allenrabinovich.com:9876/yui3/src/uploader/tests/manual/upload.php",
                                 dragAndDropArea: "#droparea",
                                 tabIndex: "0",
                                 swfURL: "assets/flashuploader.swf",
                                 tabElements: {from: "#pageTitle", to: "#uploadButton"}
                                });
myuploader.render();

console.log(Y.config.win.location.href);

myuploader.set("multipleFiles", true);
myuploader.set("appendNewFiles", true);
myuploader.set("simLimit", 3);

var out = Y.one("#uploadinfo");

var postVars = [];

myuploader.after("fileListChange", function (ev) {
	out.setContent("");
	postVars = [];
	Y.each(myuploader.get("fileList"), function (value) {
	  out.append("<div id='" + value.get("id") + "'>" + value.get("name") + " | " + 0 + "%</div>");
      postVars[value.get("id")] = {filename: value.get("name"), filesize: value.get("size")};
    });
    myuploader.set("postVarsPerFile", postVars);
});

myuploader.on("uploadprogress", function (ev) {
        out.one("#" + ev.file.get("id")).setContent(ev.file.get("name") + " | " + ev.percentLoaded + "%");
});

myuploader.on("uploadcomplete", function (ev) {
	 	out.one("#" + ev.file.get("id")).append("<p>DATA:<br> " + ev.data + "</p>");
});
	 
	 
myuploader.on("totaluploadprogress", function (ev) {
	 	Y.one("#totalpercent").setContent("Total upload progress: " + ev.percentLoaded);
});

myuploader.on("alluploadscomplete", function (ev) {
	 	Y.one("#totalpercent").setContent("<p>Upload complete!</p>");
});	                                    	                                       

Y.one("#uploadButton").on("click", function () {
	 myuploader.uploadAll();
});









});

