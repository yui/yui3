package

{

    import flash.events.EventDispatcher;
	import flash.events.DataEvent;
	import flash.events.Event;
	import flash.events.FocusEvent;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.FileReference;


	/**
	 * The base FlashUploader class for YUI 3.5 FlashUploader.
	 * 
	 * @author Allen Rabinovich
	 */

	public class File extends EventDispatcher {

	//--------------------------------------
	//  Constructor
	//--------------------------------------

		public function File(newFile:FileReference)
		{
			var now : Date = new Date();
			this.fileId = "fileyui_" + now.getTime() + "_" + idCounter;
			this.fileReference = newFile;
			File.idCounter+=1;

			this.fileReference.addEventListener(Event.OPEN, this.fileEventHandler);
            this.fileReference.addEventListener(ProgressEvent.PROGRESS, this.fileEventHandler);
			this.fileReference.addEventListener(Event.COMPLETE, this.fileEventHandler);
			this.fileReference.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, this.fileEventHandler);
			this.fileReference.addEventListener(HTTPStatusEvent.HTTP_STATUS, this.fileEventHandler);
	        this.fileReference.addEventListener(IOErrorEvent.IO_ERROR, this.fileEventHandler);
            this.fileReference.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.fileEventHandler);
			this.fileReference.addEventListener(Event.CANCEL, this.fileEventHandler);
		}

		private function fileEventHandler (event:Event) : void {
			this.dispatchEvent(event);
		}

	public var fileId:String = "";
	public var fileReference:FileReference;
    private static var idCounter:uint = 0;

    // cancel, complete, httpStatus, ioError, open, progress, securityError, select, uploadCompleteData
	}

}