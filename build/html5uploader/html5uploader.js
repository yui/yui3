YUI.add('html5uploader', function(Y) {

var  substitute  = Y.substitute;

function Html5Uploader(config) {
  Html5Uploader.superclass.constructor.apply ( this, arguments );
}



Y.Html5Uploader = Y.extend( Html5Uploader, Y.Widget, {

	_foo: null,

	_fileInputField: null,

	_uploadQueue: null,


	initializer : function () {
		
	},

	_uploadEventHandler : function (event) {
	
	console.log("EVENT " + event.type);

	switch (event.type) {
                case "file:uploadprogress":
                   this.fire("uploadprogress", event);
                break;
                case "uploadqueue:totaluploadprogress":
                   this.fire("totaluploadprogress", event);
                break;
                case "file:uploadcomplete":
                   this.fire("uploadcomplete", event);
                break;
                case "uploadqueue:alluploadscomplete":
                   this.fire("alluploadscomplete", event);
                break;
    }	

	},

    _setMultipleFiles : function () {
    	    if (this.get("multipleFiles") === true) {
				this._fileInputField.set("multiple", "multiple");
			}
			else {
				this._fileInputField.set("multiple", "");
			}
    },

    _bindSelectButton : function () {
       this.get("selectFilesButton").on("click", this.openFileSelectDialog, this);
    },

    _updateFileList : function (ev) {
 
       var newfiles = ev.target.getDOMNode().files,
           parsedfiles = [];
       Y.each(newfiles, function (value) {
         parsedfiles.push(new Y.File(value));
       });

       this.fire("fileselect", {fileList: parsedfiles});

       var oldfiles = this.get("fileList");

	   this.set("fileList", 
	            this.get("appendNewFiles") ? oldfiles.concat(parsedfiles) : parsedfiles );

    },

    openFileSelectDialog : function () {
      var fileDomNode = this._fileInputField.getDOMNode();
			if (fileDomNode.click) {
				fileDomNode.click();
			}	
    },

	renderUI : function () {
	   var contentBox = this.get('contentBox');
	   contentBox.append(this.get("selectFilesButton"));
	   this._fileInputField = Y.Node.create(Html5Uploader.HTML5FILE_FIELD);
       contentBox.append(this._fileInputField);
	},

	bindUI : function () {

		this._bindSelectButton();
		this._setMultipleFiles();

		this.after("multipleFilesChange", this._setMultipleFiles, this);
        this.after("selectFilesButtonChange", this._bindSelectButton, this);

        this._fileInputField.on("change", this._updateFileList, this);
	},

	syncUI : function () {
		

	},

	upload : function (file, url, postvars) {
        
        var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile");

		if (file instanceof Y.File) {
		   this._uploadQueue = new Y.Uploader.UploadQueue({simUploads: this.get("simLimit"), 
	                                                       errorAction: "restart",
	                                                       fileList: [file],
	                                                       uploadURL: uploadURL,
	                                                       perFileParameters: postVars
	                                                      });
	       this._uploadQueue.on("uploadprogress", this._uploadEventHandler, this);
	       this._uploadQueue.on("totaluploadprogress", this._uploadEventHandler, this);
	       this._uploadQueue.on("uploadcomplete", this._uploadEventHandler, this);
	       this._uploadQueue.on("alluploadscomplete", this._uploadEventHandler, this);

	       this._uploadQueue.startUpload();
		}
	},

	uploadAll : function (url, postvars) {

        var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile");


		   this._uploadQueue = new Y.Uploader.UploadQueue({simUploads: this.get("simLimit"), 
	                                                       errorAction: "restart",
	                                                       fileList: this.get("fileList"),
	                                                       uploadURL: uploadURL,
	                                                       perFileParameters: postVars
	                                                      });

	       this._uploadQueue.on("uploadprogress", this._uploadEventHandler, this);
	       this._uploadQueue.on("totaluploadprogress", this._uploadEventHandler, this);
	       this._uploadQueue.on("uploadcomplete", this._uploadEventHandler, this);
	       this._uploadQueue.on("alluploadscomplete", this._uploadEventHandler, this);

	       this._uploadQueue.startUpload();		
	},

	uploadThese : function (files, url, postvars) {
        var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile");

		    this._uploadQueue = new Y.Uploader.UploadQueue({simUploads: this.get("simLimit"), 
	                                                       errorAction: "restart",
	                                                       fileList: files,
	                                                       uploadURL: uploadURL,
	                                                       perFileParameters: postVars
	                                                      });

	       this._uploadQueue.on("uploadprogress", this._uploadEventHandler, this);
	       this._uploadQueue.on("totaluploadprogress", this._uploadEventHandler, this);
	       this._uploadQueue.on("uploadcomplete", this._uploadEventHandler, this);
	       this._uploadQueue.on("alluploadscomplete", this._uploadEventHandler, this);

	       this._uploadQueue.startUpload();
	}
},

{
	HTML5FILE_FIELD: "<input type='file' style='visibility:hidden; width:0px; height: 0px;'>",

	NAME: "html5uploader",

	ATTRS: {
		selectFilesButton : {
			value: Y.Node.create("<button type='button'>Select Files</button>")
		},

		dragAndDropArea: {
			value: null
		},

		multiFiles: {
			value: false
		},

		appendNewFiles : {
			value: true
		},

		simLimit: {
            value: 2,
            validator: function (val, name) {
                return (val >= 2 && val <= 5);
            }
        },

        fileList: {
        	value: []
        },

        postVarsPerFile: {
        	value: []
        },

        uploadURL: {
        	value: ""
        }
	}
});




}, '@VERSION@' ,{requires:['widget', 'substitute', 'node-event-simulate', 'file', 'uploadqueue']});
