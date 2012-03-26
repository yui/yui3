YUI({
    base: '../../../../build/',
    lang: "en",
    filter: "raw",
    debug: true,
    useBrowserConsole: true
}).use('cssbutton', 'uploader-flash', 'node', 'console', function(Y) {

var myuploader;


if (Y.UploaderFlash.TYPE != "none") {
            myuploader = new Y.UploaderFlash({ multipleFiles: true, 
                                          uploadURL: "http://www.yswfblog.com/upload/simpleupload.php",
                                          dragAndDropArea: "#droparea",
                                          tabIndex: "0",
                                          swfURL: "assets/flashuploader.swf?t=" + Math.random(),
                                          tabElements: {from: "#prevElement", to: "#uploadButton"}
                                        });


            myuploader.set("swfURL", "assets/flashuploader.swf");

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
    Y.one("body").prepend("Flash Uploader cannot be used on this system");
}

});