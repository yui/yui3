YUI({
    base: '../../../../build/',
    lang: "en",
    filter: "raw",
    debug: true,
    useBrowserConsole: true
}).use('cssbutton', 'uploader', 'node', function(Y) {

var myuploader;

if (Y.Uploader.TYPE != "none") {
            myuploader = new Y.Uploader({contentBox: "#fileselection", 
                                             multipleFiles: true, 
                                             uploadURL: "http://www.someabsoluteurl.com/yui3/src/uploader/tests/manual/upload.php",
                                             dragAndDropArea: "#droparea",
                                             tabIndex: "0",
                                             swfURL: "assets/flashuploader.swf",
                                             tabElements: {from: "#pageTitle", to: "#uploadButton"}
                                            });

            if (Y.Uploader.TYPE === "html5") {
            Y.one("#pageTitle").setContent("Using uploader: HTML5");
            var dropArea = Y.Node.create('<div id="droparea" style="width:500px;height:150px;background:#cccccc;">Drop some files here!</div>');
            Y.one("body").prepend(dropArea);
            myuploader.set("dragAndDropArea", dropArea);
            } 
            else if (Y.Uploader.TYPE === "flash") {
              Y.one("#pageTitle").setContent("Using uploader: Flash");
              myuploader.set("swfURL", "assets/flashuploader.swf");
            }

            myuploader.render();

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
}
else {
    Y.one("body").prepend("Neither HTML5 nor Flash uploaders can be used on this system");
}

});

