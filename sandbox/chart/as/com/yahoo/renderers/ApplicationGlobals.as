package com.yahoo.renderers
{
	import flash.display.Stage;
	import flash.events.EventDispatcher;
	import com.yahoo.renderers.events.RendererEvent;
	/**
	 * Application level class that defines properties for all renderer classes.
	 */
	public final class ApplicationGlobals extends EventDispatcher
	{
		/**
		 * @private
		 */
		private static var instance:ApplicationGlobals = new ApplicationGlobals();

		/**
		 * @private
		 */
		public function ApplicationGlobals()
		{
			if(instance) throw new Error("This is a singleton class and should be instantiated using the getInstance method.");
		}

		/**
		 * @private
		 * Storage for autoRender
		 */
		private var _autoRender:Boolean = true;

		/**
		 * Indicates whether or not to render on a style or property change.
		 */
		public function get autoRender():Boolean
		{
			return this._autoRender;
		}

		/**
		 * @private (setter)
		 */
		public function set autoRender(value:Boolean):void
		{
			if(value == this._autoRender) return;
			this._autoRender = value;
			this.dispatchEvent(new RendererEvent(RendererEvent.TOGGLE_AUTO_RENDER));
		}

		/**
		 * Constructor
		 */
		public static function getInstance():ApplicationGlobals
		{
			return instance;
		}

		/**
		 * @private
		 * Storage for stage
		 */
		private var _stage:Stage;

		/**
		 * Get or sets the stage
		 */
		public function get stage():Stage
		{
			return this._stage;
		}

		/**
		 * @private (setter)
		 */
		public function set stage(value:Stage):void
		{
			this._stage = value;
		}

		/**
		 * @private
		 * Storage for flashvars
		 */
		private var _flashvars:Object;

		/**
		 * Gets the flashvars for the application
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
	}
}
