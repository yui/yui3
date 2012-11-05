package

{

	import com.yahoo.util.YUIBridge;
	
	import flash.display.Loader;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.DataEvent;
	import flash.events.Event;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.external.ExternalInterface;
	import flash.net.FileFilter;
	import flash.net.FileReference;
	import flash.net.FileReferenceList;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.ui.Keyboard;
	import flash.utils.Dictionary; 
	import flash.utils.setTimeout;
	import flash.filters.GlowFilter;
	import flash.accessibility.*;

	[SWF(backgroundColor=0xFFFFFF)]

	/**
	 * The base FlashUploader class for YUI 3.5 FlashUploader.
	 * 
	 * @class FlashUploader
	 * @author Allen Rabinovich
	 * 
	 */

	public class FlashUploader extends Sprite {

  /**
   * Instantiates FlashUploader
   * @constructor
   */  
		public function FlashUploader()
		{

            fileList = {};
            filesInProgress = {};
			singleFile = new FileReference();
			multipleFiles = new FileReferenceList();

			yuiBridge = new YUIBridge(this.stage);
			yuiBridge.addCallbacks ({clearFileList:clearFileList, upload:upload,cancel:cancel,setAllowMultipleFiles:setAllowMultipleFiles,setSimUploadLimit:setSimUploadLimit,setFileFilters:setFileFilters,enable:enable, disable:disable});

			var _accProps:AccessibilityProperties = new AccessibilityProperties();
			_accProps.silent = false;
			_accProps.name = "Select Files button";
			_accProps.description = "Select Files button";

			this.accessibilityProperties = _accProps;

            // setTimeout(updateAccessibility, 2000); 

            // this.log("Accactive? " + Accessibility.active);
            if(Accessibility.active) {
                Accessibility.updateProperties();
            }

			this.renderAsTransparent();
		}

        private function updateAccessibility():void {

            }


		private function log (msg: String) : void {
			this.yuiBridge.sendEvent({type:"trace", message: msg});
		}
 

	 	private function transparentStageResize (evt:Event) : void {
		 		buttonSprite.width = buttonSprite.stage.stageWidth;
		 		buttonSprite.height = buttonSprite.stage.stageHeight;
		 	}

		private function keyboardEventHandler (evt : KeyboardEvent) : void {
		 	//	trace("key received: " + evt.keyCode);
		 		this.log("Key pressed " + evt.keyCode);
		 		this.log("Shift key " + evt.shiftKey);
		 		this.log("Target " + evt.target);
		 		this.log("In focus: " + this.stage.focus);
		 		switch (evt.keyCode) {
		 			case 9:
		 			   if (evt.shiftKey) {
		 	//		   	 trace("tabback");
		 			   	 this.yuiBridge.sendEvent({type:"tabback"});
		 			   }
		 			   else {
		 	//		   trace("tabforward");
		 			   this.yuiBridge.sendEvent({type:"tabforward"});
		 			   }
		 			   break;
		 			case 32: 
		 			case 13:
		 			   if (this.enabled) {
			 			   this.handleMouseClick(new MouseEvent("mousevent"));
			 		   }
			 		   break;
		 		}
		 	}


		private function renderAsTransparent () : void {
		
			buttonSprite.graphics.beginFill(0xffffff, 0);
			buttonSprite.graphics.drawRect(0,0,5,5);
			buttonSprite.width = this.stage.stageWidth;
			buttonSprite.height = this.stage.stageHeight;
			buttonSprite.graphics.endFill();
			buttonSprite.tabEnabled = false;

			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this.stage.align = StageAlign.TOP_LEFT;
			this.stage.tabChildren = false;
			
			this.stage.addEventListener(Event.RESIZE, this.transparentStageResize);
			this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.keyboardEventHandler);
		//	trace("3.0");

			this.buttonMode = true;
			this.useHandCursor = true;
			this.tabEnabled = false;
			this.enable();
			
			this.addChild(buttonSprite);
		}


	    //--------------------------------------------------------------------------
	    //
	    //  Variables and setters
	    //
	    //--------------------------------------------------------------------------

	    private var buttonSprite:Sprite = new Sprite();

	    private var enabled:Boolean = true;

		private var allowMultiple:Boolean = false;
		private var filterArray:Array;

		private var fileList:Object;
		private var filesInProgress:Object;

		private var singleFile:FileReference;
		private var multipleFiles:FileReferenceList;

		private var yuiBridge:YUIBridge;		
		
		private var simultaneousUploadLimit:Number = 2;
		
		public function setSimUploadLimit (simUploadLimit:int) : void {
		 		this.simultaneousUploadLimit = simUploadLimit;
		}


		 public function setFileFilters (filtersArray:Array) : void {
		 			
		    for (var i:int = 0; i < filtersArray.length; i++) {
				filtersArray[i] = new FileFilter(filtersArray[i].description,
					                             filtersArray[i].extensions, 
					                             filtersArray[i].macType);
			}

			this.filterArray = filtersArray;
		 }

		public function setAllowMultipleFiles (allowMultipleFiles:Boolean) : void {
			this.allowMultiple = allowMultipleFiles;
			//yuiBridge.log("setAllowMultipleFiles has been called, and the allowMultiple value is now " + this.allowMultiple);
		}

        
        // Browse for single or multiple files, with or without a filter array.

		private function browse (allowMultiple:Boolean = false, filterArray:Array = null):void {

			if(!allowMultiple) {
				singleFile = new FileReference();
				singleFile.addEventListener(Event.SELECT, singleFileSelected);

				if(filterArray) {
					singleFile.browse(filterArray);
				}
				else {
					singleFile.browse();
				}

			}

			else {

				multipleFiles = new FileReferenceList();
				multipleFiles.addEventListener(Event.SELECT, multipleFilesSelected);

				if(filterArray) {
					multipleFiles.browse(filterArray);
				} 

				else {
					multipleFiles.browse();
				}

			}

		}


		// Enable or disable the button

		public function enable () : void {
				this.enabled = true;
				this.addEventListener(MouseEvent.CLICK, handleMouseClick);
			
				this.addEventListener(MouseEvent.MOUSE_DOWN, handleMouseDown);
				this.addEventListener(MouseEvent.MOUSE_UP, handleMouseUp);
				this.stage.addEventListener(MouseEvent.MOUSE_UP, handleMouseUp);
				this.addEventListener(MouseEvent.ROLL_OVER, handleRollOver);
				this.addEventListener(MouseEvent.ROLL_OUT, handleRollOut);
		}
		
		public function disable () : void {
			    this.enabled = false;
				this.removeEventListener(MouseEvent.CLICK, handleMouseClick);

				this.removeEventListener(MouseEvent.MOUSE_DOWN, handleMouseDown);
				this.removeEventListener(MouseEvent.MOUSE_UP, handleMouseUp);
				this.stage.removeEventListener(MouseEvent.MOUSE_UP, handleMouseUp);				
				this.removeEventListener(MouseEvent.ROLL_OVER, handleRollOver);
				this.removeEventListener(MouseEvent.ROLL_OUT, handleRollOut);
		}

	    /**
	     *  Clears the set of files that had been selected for upload
	     */

		public function clearFileList():void {

			this.fileList = {};
	
		}



		public function upload(fileID:String, url:String, vars:Object = null, fieldName:String = "Filedata"):void {
			
		this.log("upload has been called");
			if(isEmptyString(fieldName)) {
				fieldName = "Filedata";
			}

		this.log("The url is " + url);
			var request:URLRequest = formURLRequest(url, "POST", vars);


			var file:File = this.fileList[fileID];

		this.log("Got the file with id " + file.fileId);

			var fr:FileReference = file.fileReference;

			fr.upload(request, fieldName);
			this.filesInProgress[fileID] = file;
		}


		public function cancel(fileID:String = null):void {
			
			if (fileID == null) { // cancel all files
				for each (var item:File in this.filesInProgress) {
					item.fileReference.cancel();
				}

				this.filesInProgress = {};
			} 

			else {
				var fr:File = filesInProgress[fileID];
				if (fr) {
					fr.fileReference.cancel();
				}

				delete filesInProgress[fileID];
			}

		}


        // Interactive mouse events

		private function handleMouseClick (evt:*) : void {
			this.browse(this.allowMultiple, this.filterArray);
			var newEvent:Object = new Object();
		this.log("mouseclick");
			newEvent.type = "click";
			yuiBridge.sendEvent(newEvent);
		}	


		private function handleMouseDown (event:MouseEvent) : void {
			var newEvent:Object = new Object();
		this.log("mousedown");
			newEvent.type = "mousedown";
			yuiBridge.sendEvent(newEvent);
		}

		private function handleMouseUp (event:*) : void {
			var newEvent:Object = new Object();
		this.log("mouseup");
			newEvent.type = "mouseup";
			yuiBridge.sendEvent(newEvent);
		}

		private function handleRollOver (event:MouseEvent) : void {
			var newEvent:Object = new Object();
		this.log("rollover");
			newEvent.type = "mouseenter";
			yuiBridge.sendEvent(newEvent);
		}
		
		private function handleRollOut (event:MouseEvent) : void {
			var newEvent:Object = new Object();
		this.log("rollout");
			newEvent.type = "mouseleave";
			yuiBridge.sendEvent(newEvent);
		}
		
		
		private function uploadStart (event:Event) : void {
			var newEvent:Object = new Object();
		this.log("START fired for: " + event.target.fileId);
			newEvent.id = event.target.fileId;
			newEvent.type = "uploadstart";
            yuiBridge.sendEvent(newEvent);
		}


		private function uploadProgress (event:ProgressEvent) : void {
			var newEvent:Object = new Object();
		    this.log("PROGRESS fired for: " + event.target.fileReference.name + ":::" + event.bytesLoaded + ":::" + event.bytesTotal);
			newEvent.id = event.target.fileId;
			newEvent.bytesLoaded = event.bytesLoaded;
			newEvent.bytesTotal = event.bytesTotal;
			newEvent.type = "uploadprogress";
			yuiBridge.sendEvent(newEvent);
		}


		private function uploadComplete (event:Event) : void {
			var newEvent:Object = new Object();
		    this.log("COMPLETE fired for: " + event.target.fileId);			
			newEvent.id = event.target.fileId;
			newEvent.type = "uploadcomplete";
			yuiBridge.sendEvent(newEvent);
		}


		private function uploadCompleteData (event:DataEvent) : void {
			var newEvent:Object = new Object();
		this.log("COMPLETEDATA fired for: " + event.target.fileId);
			newEvent.id = event.target.fileId;
			newEvent.data = event.data;
			newEvent.type = "uploadcompletedata";
			yuiBridge.sendEvent(newEvent);
		}
		
		private function uploadCancel (event:Event) : void {			
			var newEvent:Object = new Object();
		this.log("CANCEL fired for: " + event.target.fileId);
			newEvent.id = event.target.fileId;
			newEvent.type = "uploadcancel";
			yuiBridge.sendEvent(newEvent);
		}


		private function uploadError (event:Event) : void {
			var newEvent:Object = new Object();
		this.log("ERROR has fired for: " + event.target.fileId);
		this.log("The event type is " + event.type);
		    if (event is IOErrorEvent) {
				this.log("The event text is " + (event as IOErrorEvent).text);
		        newEvent.source="io";
		        newEvent.status = -1;
		        newEvent.message = (event as IOErrorEvent).text;
		    }
		    else if (event is HTTPStatusEvent) {
		        this.log("The event status is " + (event as HTTPStatusEvent).status);		    	
		        newEvent.source="http";
		        newEvent.status = (event as HTTPStatusEvent).status;
		        newEvent.message = "HTTP " + newEvent.status + " status code received.";
		    }
			for (var itemName:String in event) {
				newEvent[itemName] = event[itemName];
				this.log("Error details / " + itemName + ": " + event[itemName]);
			}
            
	        newEvent.id = event.target.fileId;
	        newEvent.type = "uploaderror";
            yuiBridge.sendEvent(newEvent);
		}


		// Fired when the user selects a single file
		private function singleFileSelected(event:Event):void {
			this.clearFileList();
			var newFile:File = addFile(event.target as FileReference);
			processSelection(new Array(newFile));
		}



		// Fired when the user selects multiple files
		private function multipleFilesSelected(event:Event):void {
			var currentFRL:FileReferenceList = event.target as FileReferenceList;
			var addedFiles:Array = [];
			for each (var currentFR:FileReference in currentFRL.fileList) {
				addedFiles.push(addFile(currentFR));
			}
			processSelection(addedFiles);
		}
		

		/**
		 *  @private
		 *  Outputs the files selected to an output panel and triggers a 'fileSelect' event.
		 */	

		private function processSelection(selectedFiles : Array):void {

			var newEvent:Object = new Object();
			newEvent.fileList = selectedFiles;
			newEvent.type = "fileselect";

			yuiBridge.sendEvent(newEvent);
		}

		

		/**
		 *  @private
		 *  Adds a file reference object to the internal queue and assigns listeners to its events
		 */	

		private function addFile(fr:FileReference) : File {

	        var newFile:File = new File(fr);

			newFile.addEventListener(Event.OPEN, uploadStart);
            newFile.addEventListener(ProgressEvent.PROGRESS, uploadProgress);
			newFile.addEventListener(Event.COMPLETE, uploadComplete);
			newFile.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, uploadCompleteData);
			newFile.addEventListener(HTTPStatusEvent.HTTP_STATUS, uploadError);
	        newFile.addEventListener(IOErrorEvent.IO_ERROR, uploadError);
            newFile.addEventListener(SecurityErrorEvent.SECURITY_ERROR, uploadError);
			newFile.addEventListener(Event.CANCEL,uploadCancel);

			fileList[newFile.fileId] = newFile;

			return newFile;
		}

		/**
		 *  @private
		 *  Creates a URLRequest object from a url, and optionally includes an HTTP request method and additional variables to be sent
		 */	

		private function formURLRequest(url:String, method:String = "GET", vars:Object = null):URLRequest {

			var request:URLRequest = new URLRequest();
			request.url = url;
			request.method = method;
			request.data = new URLVariables();
			

			for (var itemName:String in vars) {
				request.data[itemName] = vars[itemName];
			}


			return request;
		}

		/**
		 *  @private
		 *  Determines whether an object is equivalent to an empty string
		 */	

		private function isEmptyString(toCheck:*):Boolean {

			if(	toCheck == "null" ||
				toCheck == "" ||
				toCheck == null ) {

				return true;
			}

			else {
				return false;
			}
		}

	}

}

