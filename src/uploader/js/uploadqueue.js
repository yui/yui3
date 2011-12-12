
    /**
     * The class manages a queue of files that should be uploaded to the server.
     * It initializes the required number of uploads, tracks them as they progress,
     * and automatically advances to the next upload when a preceding one has completed.
     * @module uploadqueue
     */     
    /**
     * The class manages a queue of files to be uploaded to the server.
     * @class UploadQueue
     * @extends Base
     * @constructor
     */

    var Lang = Y.Lang,
        Bind = Y.bind,
        Win = Y.config.win,
        currentUploads,
        lastUploadPointer,
        fileListLength,
        uploadsLeftCounter,
        totalBytesUploaded,
        totalBytes;

    var UploadQueue = function(o) {
        currentUploads = {};
        lastUploadPointer = 0;
        fileListLength = 0;
        uploadsLeftCounter = 0;
        totalBytesUploaded = 0;
        totalBytes = 0;      
        UploadQueue.superclass.constructor.apply(this, arguments);
    };


    Y.extend(UploadQueue, Y.Base, {

        initializer : function (cfg) {

        },

        _uploadCompleteHandler : function (event) {
           
           uploadsLeftCounter -= 1;

           totalBytesUploaded += event.target.get("size");
           delete currentUploads[event.target.get("id")];

           if (lastUploadPointer < fileListLength) {
               var currentFile = this.get("fileList")[lastUploadPointer],
                   parameters = this.get("perFileParameters"),
                   fileParameters = Lang.isArray(parameters) ? parameters[lastUploadPointer] : parameters;
 
               currentFile.on("uploadprogress", this._uploadProgressHandler, this);
               currentFile.on("uploadcomplete", this._uploadCompleteHandler, this);

               currentFile.startUpload(this.get("uploadURL"), fileParameters);
               currentUploads[currentFile.get("id")] = 0;
               lastUploadPointer += 1;
           }
           
           var updatedEvent = event;
           updatedEvent.file = event.target;
           updatedEvent.originEvent = event;

           this.fire("uploadcomplete", updatedEvent);

           if (uploadsLeftCounter == 0) {
               this.fire("alluploadscomplete");
           }
        },

        _uploadProgressHandler : function (event) {
          
          currentUploads[event.target.get("id")] = event.bytesLoaded;
          
          var updatedEvent = event;
          updatedEvent.originEvent = event;
          updatedEvent.file = event.target;

          this.fire("uploadprogress", updatedEvent);
          
          var uploadedTotal = totalBytesUploaded;
          Y.each(currentUploads, function (value) {
             uploadedTotal += value; 
          });
          
          var percentLoaded = Math.min(100, Math.round(10000*uploadedTotal/totalBytes) / 100);

          this.fire("totaluploadprogress", {bytesLoaded: uploadedTotal, 
                                            bytesTotal: totalBytes,
                                            percentLoaded: percentLoaded});
        },

        startUpload: function() {

           while (lastUploadPointer < this.get("simUploads") && lastUploadPointer < fileListLength) {
               
               var currentFile = this.get("fileList")[lastUploadPointer],
                   fileId = currentFile.get("id"),
                   parameters = this.get("perFileParameters"),
                   fileParameters = Lang.isArray(parameters) ? parameters[lastUploadPointer] : parameters;
               
               currentUploads[fileId] = 0;

               currentFile.on("uploadprogress", this._uploadProgressHandler, this);
               currentFile.on("uploadcomplete", this._uploadCompleteHandler, this);

               currentFile.startUpload(this.get("uploadURL"), fileParameters);
               lastUploadPointer+=1;
           }
        },


        pauseUpload: function () {
            
        },

        restartUpload: function () {
            
        },

        cancelUpload: function () {
            
        }
    }, {

        NAME: 'uploadqueue',

        ATTRS: {
       
       /**
        * @property simUploads
        * @type Number
        * @description Maximum number of simultaneous uploads
        */
        simUploads: {
            value: 2,
            validator: function (val, name) {
                return (val >= 2 && val <= 5);
            }
        },

        errorAction: {
            value: UploadQueue.CONTINUE,
            validator: function (val, name) {
                return (val === UploadQueue.CONTINUE || val === UploadQueue.STOP || val === UploadQueue.RESTART);
            }
        },

        bytesUploaded: {
            readOnly: true,
            value: 0
        },

        bytesTotal: {
            readOnly: true,
            value: 0
        },

        fileList: {
            value: [],
            lazyAdd: false,
            setter: function (val) {
                var newValue = val;
                Y.each(newValue, function (value) {
                    totalBytes += value.get("size");
                });
                fileListLength = uploadsLeftCounter = newValue.length;

                return val;
            }   
        },

        uploadURL: {
          value: ""
        },

        perFileParameters: {
          value: []
        }
        },

        CONTINUE: "continue",
        STOP: "stop",
        RESTART: "restart"
    });


    Y.namespace('Uploader');
    Y.Uploader.UploadQueue = UploadQueue;

