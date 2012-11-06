YUI({
    lang: "en",
    filter: "raw",
    debug: true,
    useBrowserConsole: true
}).use('uploader', function(Y) {

    var uploader = new Y.Uploader({width: "300px", height:"40px"}).render("#selectFilesContainer");

/*

if (Y.Uploader.TYPE != "none") {
            myuploader = new Y.Uploader({ multipleFiles: true, 
                                          uploadURL: "http://localhost/yui3/src/uploader/tests/manual/upload.php",
                                          dragAndDropArea: "#droparea",
                                          tabIndex: "0",
                                          width: "100%",
                                          height: "100%",
                                          swfURL: "assets/flashuploader.swf?t=" + Math.random(),
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
             }

            myuploader.render("#fileselection");

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
                    out.one("#" + ev.file.get("id")).setContent(ev.file.get("name") + " | " + "Finished!");
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

            Y.one("#triggerButton").on("click", function () {
                if (myuploader.get("enabled")) {
                    myuploader.set("enabled", false);
                }
                else {
                    myuploader.set("enabled", true);
                }
            });

}
else {
    Y.one("body").prepend("Neither HTML5 nor Flash uploaders can be used on this system");
}
*/
});