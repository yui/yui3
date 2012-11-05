YUI({
    base: '../../../../build/',
    lang: "en",
    filter: "raw",
    debug: true,
    useBrowserConsole: true
}).use('cssbutton', 'uploader', 'node', 'console', function(Y) {

// Force Flash uploader
// Y.Uploader = Y.UploaderFlash;

// Force HTML5 uploader
// Y.Uploader = Y.UploaderHTML5;
var myuploader;

if (Y.Uploader.TYPE != "none") {
            myuploader = new Y.Uploader({ multipleFiles: true, 
                                          uploadURL: "http://localhost/yui3/src/uploader/tests/manual/uploadwithrandomerrors.php",
                                          dragAndDropArea: "#droparea",
                                          tabIndex: "0",
                                          width: "100%",
                                          height: "100%",
                                          swfURL: "assets/flashuploader.swf?t=" + Math.random(),
                                          tabElements: {from: "#pageTitle", to: "#uploadButton"},
                                          selectFilesButton: Y.Node.create("<button class='yui3-button' tabindex='-1'>Choose Files</button>"),
                                          errorAction: Y.UploaderHTML5.Queue.RESTART_ASAP,
                                          withCredentials: false
                                        });

            myuploader.set("fileFilterFunction", function (file) { 
                if (file.get("size") < 50 || file.get("size") > 8000000) { 
                    return false;
                } 
                else { 
                    return true; 
                }
            });


            if (Y.Uploader.TYPE === "html5") {
              myuploader.set("fileFilters", ["image/*","video/avi"]);
              Y.one("#pageTitle").setContent("Using uploader: HTML5");
              var dropArea = Y.Node.create('<div id="droparea" style="width:500px;height:150px;background:#cccccc;">Drop some files here!</div>');
              Y.one("body").prepend(dropArea);
              myuploader.set("dragAndDropArea", dropArea);
            }

            else if (Y.Uploader.TYPE === "flash") {
              myuploader.set("fileFilters", [{description: "Images", extensions: "*.jpg;*.gif;*.png"}, {description: "Videos", extensions: "*.avi"}]);
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
                    console.log(ev.file.get("xhr").status);
            });
            	 
            	 
            myuploader.on("totaluploadprogress", function (ev) {
            	 	Y.one("#totalpercent").setContent("Total upload progress: " + ev.percentLoaded);
            });

            myuploader.on("alluploadscomplete", function (ev) {
            	 	Y.one("#totalpercent").setContent("<p>Upload complete!</p>");
            });

            myuploader.on("uploaderror", function (ev) {
                    out.one("#" + ev.file.get("id")).setContent(ev.file.get("name") + " | " + "ERROR!");
                    console.log("There's been an error uploading " + ev.file.get("name"));
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

});