package

{

	import com.yahoo.util.YUIBridge;
	
	import flash.display.Loader;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.DataEvent;
	import flash.events.Event;
	import flash.events.FocusEvent;
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



	[SWF(backgroundColor=0xFFFFFF)]

	/**
	 * The base FlashUploader class for YUI 3.5 FlashUploader.
	 * 
	 * @author Allen Rabinovich
	 */

	public class FlashUploader extends Sprite {

	//--------------------------------------
	//  Constructor
	//--------------------------------------

		public function FlashUploader()
		{
            fileList = {};
            filesInProgress = {};
			singleFile = new FileReference();
			multipleFiles = new FileReferenceList();

			yuiBridge = new YUIBridge(this.stage);
			yuiBridge.addCallbacks ({clearFileList:clearFileList, upload:upload,cancel:cancel,setAllowMultipleFiles:setAllowMultipleFiles,setSimUploadLimit:setSimUploadLimit,setFileFilters:setFileFilters,enable:enable, disable:disable});


			this.renderAsTransparent();
		}


		private function renderAsTransparent () : void {
		
		 	function transparentStageResize (evt:Event) : void {
		 		buttonSprite.width = buttonSprite.stage.stageWidth;
		 		buttonSprite.height = buttonSprite.stage.stageHeight;
		 	}
		 	
			buttonSprite.graphics.beginFill(0xffffff, 0);
			buttonSprite.graphics.drawRect(0,0,5,5);
			buttonSprite.width = this.stage.stageWidth;
			buttonSprite.height = this.stage.stageHeight;
			buttonSprite.graphics.endFill();
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this.stage.align = StageAlign.TOP_LEFT;
			this.stage.tabChildren = false;
			
			this.stage.addEventListener(Event.RESIZE, transparentStageResize);
			
			this.buttonMode = true;
			this.useHandCursor = true;
			this.enable();
			
			this.addChild(buttonSprite);
		}


	    //--------------------------------------------------------------------------
	    //
	    //  Variables and setters
	    //
	    //--------------------------------------------------------------------------

	    private var buttonSprite:Sprite = new Sprite();

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
			yuiBridge.log("setAllowMultipleFiles has been called, and the allowMultiple value is now " + this.allowMultiple);
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

				this.addEventListener(MouseEvent.CLICK, handleMouseClick);
			
				this.addEventListener(MouseEvent.MOUSE_DOWN, handleMouseDown);
				this.addEventListener(MouseEvent.MOUSE_UP, handleMouseUp);
				this.addEventListener(MouseEvent.ROLL_OVER, handleRollOver);
				this.addEventListener(MouseEvent.ROLL_OUT, handleRollOut);
		}
		
		public function disable () : void {
				this.removeEventListener(MouseEvent.CLICK, handleMouseClick);
			
				this.removeEventListener(MouseEvent.MOUSE_DOWN, handleMouseDown);
				this.removeEventListener(MouseEvent.MOUSE_UP, handleMouseUp);
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
			
			trace("upload has been called");
			if(isEmptyString(fieldName)) {
				fieldName = "Filedata";
			}

			trace("The url is " + url);
			var request:URLRequest = formURLRequest(url, "POST", vars);


			var file:File = this.fileList[fileID];

			trace("Got the file with id " + file.fileId);

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

		private function handleMouseClick (evt:MouseEvent) : void {
			this.browse(this.allowMultiple, this.filterArray);
			var newEvent:Object = new Object();
			newEvent.type = "click";
			yuiBridge.sendEvent(newEvent);
		}	


		private function handleMouseDown (event:MouseEvent) : void {
			var newEvent:Object = new Object();
			newEvent.type = "mousedown";
			yuiBridge.sendEvent(newEvent);
		}

		private function handleMouseUp (event:MouseEvent) : void {
			var newEvent:Object = new Object();
			newEvent.type = "mouseup";
			yuiBridge.sendEvent(newEvent);
		}

		private function handleRollOver (event:MouseEvent) : void {
			var newEvent:Object = new Object();
			newEvent.type = "mouseenter";
			yuiBridge.sendEvent(newEvent);
		}
		
		private function handleRollOut (event:MouseEvent) : void {
			var newEvent:Object = new Object();
			newEvent.type = "mouseleave";
			yuiBridge.sendEvent(newEvent);
		}
		
		
		private function uploadStart (event:Event) : void {
			var newEvent:Object = new Object();
			trace("uploadStart fired for: " + event.target.fileId);
			newEvent.id = event.target.fileId;
			newEvent.type = "uploadstart";
            yuiBridge.sendEvent(newEvent);
		}


		private function uploadProgress (event:ProgressEvent) : void {
			var newEvent:Object = new Object();
			trace("uploadStart fired for: " + event.target.fileId + ":::" + event.bytesLoaded + ":::" + event.bytesTotal);
			newEvent.id = event.target.fileId;
			newEvent.bytesLoaded = event.bytesLoaded;
			newEvent.bytesTotal = event.bytesTotal;
			newEvent.type = "uploadprogress";
			yuiBridge.sendEvent(newEvent);
		}


		private function uploadComplete (event:Event) : void {
			var newEvent:Object = new Object();
			trace("uploadComplete fired for: " + event.target.fileId);			
			newEvent.id = event.target.fileId;
			newEvent.type = "uploadcomplete";
			yuiBridge.sendEvent(newEvent);
		}


		private function uploadCompleteData (event:DataEvent) : void {
			var newEvent:Object = new Object();
			trace("uploadCompleteData fired for: " + event.target.fileId);
			newEvent.id = event.target.fileId;
			newEvent.data = event.data;
			newEvent.type = "uploadcompletedata";
			yuiBridge.sendEvent(newEvent);
		}
		
		private function uploadCancel (event:Event) : void {			
			var newEvent:Object = new Object();
			trace("uploadCancel fired for: " + event.target.fileId);
			newEvent.id = event.target.fileId;
			newEvent.type = "uploadcancel";
			yuiBridge.sendEvent(newEvent);
		}


		private function uploadError (event:Event) : void {
			var newEvent:Object = new Object();
		    trace("uploadError has fired for: " + event.target.fileId);
		    trace("The event type is " + event.type);
		    if (event is IOErrorEvent) {
		    trace("The event text is " + (event as IOErrorEvent).text);
		    }
		    else if (event is HTTPStatusEvent) {
		    trace("The event status is " + (event as HTTPStatusEvent).status);		    	
		    }
			for (var itemName:String in event) {
				newEvent[itemName] = event[itemName];
				trace("Error details / " + itemName + ": " + event[itemName]);
			}
            
	        newEvent.id = event.target.fileId;
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

