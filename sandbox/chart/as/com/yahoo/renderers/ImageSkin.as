package com.yahoo.renderers
{
	import flash.display.Loader;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.display.BitmapData;
	import flash.events.Event;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.net.URLRequest;
	import flash.system.LoaderContext;
	import flash.events.SecurityErrorEvent;
	import com.yahoo.renderers.Renderer;
	import com.yahoo.renderers.events.RendererEvent;
	import com.yahoo.renderers.styles.ImageSkinStyles;
	
	/**
	 * Creates background using externally loaded image.
	 */
	public class ImageSkin extends Renderer
	{
		/**
		 * @inheritDoc
		 */
		private static var _styleClass:Class = ImageSkinStyles;
				
		/**
		 * Constructor
		 */
		public function ImageSkin()
		{
			super();
			this._container = new Sprite();
			this.addChild(this._container);
			this._mask = new Shape();
			this.addChild(this._mask);
			this.mask = this._mask;
		}
		
		/**
		 * @inheritDoc
		 */
		override public function getStyleClass():Class
		{
			return _styleClass;
		}		
		
		/**
		 * @private
		 */
		private var _container:Sprite;
		
		/**
		 * @private
		 */
		private var _mask:Shape;
		
		/**
		 * @private
		 * Reference to loader instance
		 */
		private var _loader:Loader;
		
		/**
		 * @private
		 * Storage for urlRequest
		 */
		private var _urlRequest:URLRequest;
		
		/**
		 * URL request object for loader.
		 */
		public function get urlRequest():URLRequest
		{
			return this._urlRequest;
		}	
		
		/**
		 * @private(setter)
		 */
		public function set urlRequest(value:URLRequest):void
		{
			if(this.urlRequest === value) return;
			this._urlRequest = value;
			this.url = this._urlRequest.url;
			this.setFlag("load");
		}
		
		/**
		 * @private
		 * Storage for image url
		 */
		private var _url:String;
		
		/**
		 * Url for the image
		 */
		public function get url():String
		{
			return this._url;
		}
		
		/**
		 * @private (setter)
		 */
		public function set url(value:String):void
		{
			if(this._url == value) return;
			this._url = value;
			this._urlRequest = new URLRequest(value);
			this.setFlag("load");
		}
		
		/**
		 * @private
		 * Storage for loaderContext
		 */
		private var _context:LoaderContext;
		
		/**
		 * The <code>loaderContext</code> for the loader. 
		 */
		public function get context():LoaderContext
		{
			return this._context;
		}
		
		/**
		 * @private (setter)
		 */
		public function set context(value:LoaderContext):void
		{
			if(this.context == value) return;
			this._context = value;
			this.setFlag("load");
		}
		
		/**
		 * @private
		 * The actual width of the loaded content.
		 */
		private var _contentWidth:Number;
		
		/**
		 * @private
		 * The actual height of the loaded content.
		 */
		private var _contentHeight:Number;
			
        /**
         * @private (override)
         */
        override public function setStyles(styles:Object):void
        {
            if(styles.hasOwnProperty("url"))
            {
                this.url = styles.url;
            }
            super.setStyles(styles);
        }

        /**
         * @private (override)
         */
        override public function setStyle(style:String, value:Object):Boolean
        {
            if(style === "url")
            {
                this.url = String(value);
                return true;
            }
            return super.setStyle(style, value);
        }   
		
        /**
		 * @inheritDoc
		 */
		override protected function render():void
		{
			if(this.checkFlag("resize") || this.checkFlag("sizeMode")) this.drawMask();
			if(this.checkFlag("load"))
			{
				this.loadImage();
				return;
			}
			
			if(this.checkFlag("resize") || this.checkFlag("imageMode") || this.checkFlag("imageLoaded") || this.checkFlag("sizeMode"))
			{
				var imageMode:String = this.getStyle("imageMode") as String;
				var wid:Number = this.width;
				var ht:Number = this.height;

				switch(imageMode)
				{
					case "stretch" :
						this._container.width = wid;
						this._container.height = ht;
						if(this._loader) this._loader.visible = true;
					break;
					case "stretchAndMaintainAspectRatio" :
						var containerRatio:Number = wid/ht;
						var imageRatio:Number = this._contentWidth/this._contentHeight;
						if(containerRatio > imageRatio)
						{
							this._container.height = wid/imageRatio;
							this._container.width = wid;
						}
						else
						{
							this._container.height = ht;
							this._container.width = ht * imageRatio;						
						}
						if(this._loader) this._loader.visible = true;
					break;
					default :
						var rectWidth:Number = this._contentWidth;
						var rectHeight:Number = this._contentHeight;
						if(imageMode == "repeat-x")
						{
							rectWidth = this.width;
						}
						else if(imageMode == "repeat-y")
						{
							rectHeight = this.height;
						}
						else if(imageMode == "repeat")
						{
							rectHeight = this.height;
							rectWidth = this.width;
						}
					 	if(this._loader) 
						{
							this._loader.visible = false;
							if(this._contentWidth > 0 && this._contentHeight > 0)
							{
								var bitmapData:BitmapData = new BitmapData(int(this._contentWidth), int(this._contentHeight), true, 0x000000);
								bitmapData.draw(this._loader);
								this.graphics.lineStyle(0, 0, 0);
								this.graphics.beginBitmapFill(bitmapData);
								this.graphics.drawRect(0, 0, rectWidth, rectHeight);
								this.graphics.endFill();
							}
						}
					break;
				}
				
			}
		}
		
		/**
		 * @private
		 */
		private function drawMask():void
		{
			if(!this._mask || isNaN(this.width) || isNaN(this.height)) return;
			this._mask.graphics.clear();
			this._mask.graphics.beginFill(0xffffff, 1);
			this._mask.graphics.drawRect(0, 0, this.width, this.height);
			this._mask.graphics.endFill();
		}	

		/**
		 * @private
		 * Sets up loader
		 */
		private function loadImage():void
		{
			this.unload();
			this._loader = new Loader();
			this._loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.loaderErrorHandler, false, 0, true);
			this._loader.contentLoaderInfo.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.loaderErrorHandler, false, 0, true);
			this._loader.contentLoaderInfo.addEventListener(Event.OPEN, this.loaderOpenHandler, false, 0, true);
			this._loader.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS, this.loaderProgressHandler, false, 0, true);
			this._loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.loaderCompleteHandler, false, 0, true);
			this._loader.contentLoaderInfo.addEventListener(Event.INIT, this.loaderInitHandler, false, 0, true);
			this._loader.contentLoaderInfo.addEventListener(HTTPStatusEvent.HTTP_STATUS, this.loaderHTTPStatusHandler, false, 0, true);
			this._loader.load(this.urlRequest, this.context);
			this._container.addChild(this._loader);
			this._loader.visible = false;
		}
		
		/**
		 * @private
		 */
		private function unload():void
		{
			if(this._loader != null)
			{
				this._loader.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, this.loaderErrorHandler);
				this._loader.contentLoaderInfo.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, this.loaderErrorHandler);
				this._loader.contentLoaderInfo.removeEventListener(Event.OPEN, this.loaderOpenHandler);
				this._loader.contentLoaderInfo.removeEventListener(ProgressEvent.PROGRESS, this.loaderProgressHandler);
				this._loader.contentLoaderInfo.removeEventListener(Event.COMPLETE, this.loaderCompleteHandler);
				this._loader.contentLoaderInfo.removeEventListener(Event.INIT, this.loaderInitHandler);
				this._loader.contentLoaderInfo.removeEventListener(HTTPStatusEvent.HTTP_STATUS, this.loaderHTTPStatusHandler);
				this._loader.unload();
				this._container.removeChild(this._loader);
				this._loader = null;
			}			
		}
		
		/**
		 * @private
		 */
		private function loaderErrorHandler(event:Event):void
		{
			//placeholder for error events.
		}
		
		/**
		 * @private
		 */
		private function loaderOpenHandler(event:Event):void
		{
			//placeholder for open event
		}
		
		/**
		 * @private
		 */
		private function loaderProgressHandler(event:ProgressEvent):void
		{
			//placeholder for progress event
		}
		
		/**
		 * @private
		 */
		private function loaderCompleteHandler(event:Event):void
		{
			try
			{
				this._contentWidth = this._loader.content.width;
				this._contentHeight = this._loader.content.height;
				this.dispatchEvent(event);
				this.setFlag("imageLoaded");
			}
			catch(e:SecurityError)
			{
				this.unload();
				//handle security error event. I'm thinking will dispatch error events and the application class will listen
				//and dispatch out logs
			}
		}
		
		/**
		 * @private
		 */
		private function loaderInitHandler(event:Event):void
		{
			//placeholder for init event
		}
		
		/**
		 * @private
		 */
		private function loaderHTTPStatusHandler(event:HTTPStatusEvent):void
		{
			//placeholder for HTTPStatus event
		}
	}
}
