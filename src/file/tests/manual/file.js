YUI({
    base: '../../../../build/',
    lang: "en",
    filter: "debug",
    debug: true,
    useBrowserConsole: true
}).use('node', 'file',  function(Y) {

var myuploadfield = Y.one("#fileupload").on("change", function (ev) {
	var myfiles = ev.target.getDOMNode().files;
	var myfile = new Y.File({file: myfiles[0]});

	Y.log(myfile.get("size"));
	Y.log(myfile.get("name"));
	Y.log(myfile.get("dateModified"));
	Y.log(myfile.get("type"));
	Y.log(myfile.get("html5"));

	Y.one("#startupload").on("click", function () {
		myfile.startUpload("upload.php", {foo: "bar", bar: "bazz", etc: "mooha"});
	});

	Y.one("#cancelupload").on("click", function () {
		myfile.cancelUpload();
	})

	myfile.on("uploadprogress", Y.log);
	myfile.on("uploadcomplete", Y.log);
	myfile.on("uploadcancel", Y.log);
	myfile.on("uploaderror", Y.log);

});
});

