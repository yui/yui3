YUI({
    base: '../../../../build/',
    lang: "en",
    filter: "raw",
    debug: true,
    useBrowserConsole: true
}).use('uploader-html5',  function(Y) {

var myuploader = new Y.UploaderHTML5({contentBox: "#fileselection", 
                                      multipleFiles: true, 
                                      uploadURL: "http://www.yswfblog.com/upload/simpleupload.php"});
myuploader.render();

myuploader.set("multipleFiles", true);
myuploader.set("appendNewFiles", true);

var out = Y.one("#uploadinfo");

var postVars = [];

myuploader.after("fileListChange", function (ev) {
	out.setContent("");
	postVars = [];
	Y.each(myuploader.get("fileList"), function (value) {
	  out.append("<div id='" + value.get("id") + "'>" + value.get("name") + " | " + 0 + "%</div>");
      postVars.push({customvar: "file:" + value.get("name")});
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

