package com.yahoo.renderers
{
	import flash.display.Stage;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import com.yahoo.util.YUIBridge;
	import com.yahoo.renderers.layout.Container;

	/**
	 * Abstract class used for creating flash applications
	 */
	public class Application extends Container
	{
		/**
		 * Constructor
		 */
		public function Application()
		{
			this.initializeApplicationGlobals();
			super();
		}

		/**
		 * @private
		 * Reference to the yuibridge instance.
		 */
		protected var _yuiBridge:YUIBridge;
		
		/**
		 * @private
		 */
		private var _appname:String = "application";

		/**
		 * Name of application
		 */
		public function get appname():String
		{
			return this._appname;
		}

		/**
		 * @private (setter)
		 */
		public function set appname(value:String):void
		{
			this._appname = value;
			this._yuiBridge.setInstance(value, this);
		}
	
		/**
		 * @private
		 */
		private var _flashvars:Object;

		/**
		 * Reference to the global flashvars
		 */
		public function get flashvars():Object
		{
			return this._flashvars;
		}

		/**
		 * @private (setter)
		 */
		public function set flashvars(value:Object):void
		{
			this._flashvars = value;
		}

		/**
		 * @private (override)
		 */
		override protected function initializeRenderer():void
		{
			super.initializeRenderer();
			this.stage.addEventListener(Event.RESIZE, stageResizeHandler);
			this.width = this.stage.stageWidth;
			this.height = this.stage.stageHeight;
			this._yuiBridge = new YUIBridge(this.stage);
			this.parseFlashVars();
			this._yuiBridge.setInstance(this._appname, this);
			this._yuiBridge.addClasses(this.getCompiledClasses());
		}

		/**
		 * @private (protected)
		 */
		protected function getCompiledClasses():Object
		{
			return {};
		}

		/**
		 * @private (protected)
		 */
		protected function initializeApplicationGlobals():void
		{
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this.stage.align = StageAlign.TOP_LEFT;
			this._globalApp = ApplicationGlobals.getInstance();
			this._globalApp.stage = this.stage;			
		}

		/**
		 * @private (protected)
		 */
		protected function parseFlashVars():void
		{
			this._flashvars = this._globalApp.flashvars = this._yuiBridge.flashvars;
			if(this._flashvars.appname) this._appname = this._flashvars.appname;
		}

		/**
		 * @private
		 */
		private function stageResizeHandler(event:Event):void
		{
			if(this.width == this.stage.stageWidth && this.height == this.stage.stageHeight) return;
			this.width = this.stage.stageWidth;
			this.height = this.stage.stageHeight;
		}
	}
}
