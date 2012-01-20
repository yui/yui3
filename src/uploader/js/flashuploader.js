var  substitute  = Y.substitute;

function FlashUploader(config) {
  FlashUploader.superclass.constructor.apply ( this, arguments );
}



Y.FlashUploader = Y.extend(FlashUploader, Y.Widget, {

	_swfReference: null,

	_uploadQueue: null,

	_swfContainerId: null,


	initializer : function () {
		this._swfContainerId = Y.guid("uploader");
		this.publish("fileselect");
	},

	_uploadEventHandler : function (event) {
	
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
                case "uploadqueue:uploaderror":
                   this.fire("uploaderror", event);
                break;
    }	

	},

    _setMultipleFiles : function () {
    	    if (this._swfReference) {
				this._swfReference.callSWF("setAllowMultipleFiles", [this.get("multipleFiles")]);
			}
    },

    _setFileFilters : function () {
            if (this._swfReference && this.get("fileFilters") != null) {
            	this._swfReference.callSWF("setFileFilters", [this.get("fileFilters")]);
            }	

    },


    _updateFileList : function (ev) {
       
       var newfiles = ev.fileList,
           fileConfObjects = [],
           parsedFiles = [],
           swfRef = this._swfReference;
 
       Y.each(newfiles, function (value) {
       	 var newFileConf = {};
       	 newFileConf.id = value.fileId;
       	 newFileConf.name = value.fileReference.name;
       	 newFileConf.size = value.fileReference.size;
       	 newFileConf.type = value.fileReference.type;
       	 newFileConf.dateCreated = value.fileReference.creationDate;
       	 newFileConf.dateModified = value.fileReference.modificationDate;
       	 newFileConf.uploader = swfRef;

         fileConfObjects.push(newFileConf);
       });

       Y.each(fileConfObjects, function (value) {
         parsedFiles.push(new Y.File(value));
       });

       this.fire("fileselect", {fileList: parsedFiles});

       var oldfiles = this.get("fileList");

	   this.set("fileList", 
	             this.get("appendNewFiles") ? oldfiles.concat(parsedFiles) : parsedFiles );

    },


	renderUI : function () {
	   var contentBox = this.get('contentBox');
	   contentBox.append(this.get("selectFilesButton"));
	   contentBox.append(Y.Node.create(substitute(FlashUploader.FLASH_CONTAINER, 
		                                          {swfContainerId: this._swfContainerId})));
	   var flashContainer = Y.one("#" + this._swfContainerId);
	   var params = {version: "10.0.45",
                     fixedAttributes: {wmode: "transparent", allowScriptAccess:"always", allowNetworking:"all", scale: "noscale"},
                    };
	   this._swfReference = new Y.SWF(flashContainer, this.get("swfURL"), params);
       contentBox.append(this._fileInputField);
	},

	bindUI : function () {
		console.log("Binding UI...");
		this._swfReference.on("swfReady", function () {
			this._setMultipleFiles();
			this._setFileFilters();
			this.after("multipleFilesChange", this._setMultipleFiles, this);
			this.after("fileFiltersChange", this._setFileFilters, this);
		}, this);
        
        console.log("Listening to fileselect...");
		this._swfReference.on("fileselect", this._updateFileList, this);
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

        // Starting upload of all selected files.
        console.log("Starting upload of all selected files");
        var uploadURL = url || this.get("uploadURL"),
            postVars = postvars || this.get("postVarsPerFile");


           // Creating a new upload queue with the current file list
        console.log("Creating a new instance of upload queue");
		   this._uploadQueue = new Y.Uploader.UploadQueue({simUploads: this.get("simLimit"), 
	                                                       errorAction: "restart",
	                                                       fileList: this.get("fileList"),
	                                                       uploadURL: uploadURL,
	                                                       perFileParameters: postVars
	                                                      });

           // Subscribing to events
        console.log("Subscribing to uploadqueue's events");
	       this._uploadQueue.on("uploadprogress", this._uploadEventHandler, this);
	       this._uploadQueue.on("totaluploadprogress", this._uploadEventHandler, this);
	       this._uploadQueue.on("uploadcomplete", this._uploadEventHandler, this);
	       this._uploadQueue.on("alluploadscomplete", this._uploadEventHandler, this);

           // Starting the upload.
        console.log("Starting upload in the queue");
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
	       this._uploadQueue.on("uploaderror", this._uploadEventHandler, this);

	       this._uploadQueue.startUpload();
	}
},

{
	FLASH_CONTAINER: "<div id='{swfContainerId}' style='position:absolute; top:0px; left: 0px; width:100%; height:100%'></div>",

	NAME: "flashuploader",

	ATTRS: {
		selectFilesButton : {
			value: Y.Node.create("<button type='button' style='height:100%;width:100%'>Select Files</button>")
		},

		multipleFiles: {
			value: false
		},

		fileFilters: {
			value: null
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
        },

        swfURL: {
        	value: "assets/flashuploader.swf"
        }
	}
});


