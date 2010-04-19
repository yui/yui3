package com.yahoo.renderers
{
	import flash.display.Stage;
	import flash.events.EventDispatcher;
	import flash.events.Event;
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
			if(value)
			{
				this.addStageListeners();
			}
			else
			{
				this.removeStageListeners();
			}
		}

		/**
		 * @private (protected)
		 * Collection or Renderers to be queued for a rendering.
		 */
		protected var _queue:Vector.<Renderer> = new Vector.<Renderer>();

		/**
		 * @private Collection of renderers to be updated on the following cycle.
		 */
		protected var _laterQueue:Vector.<Renderer> = new Vector.<Renderer>();
		
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

		/**
		 * @private (protected)
		 */
		protected function dispatch(event:Event):void
		{
			var renderer:Renderer;
			if(this._queue.length < 1) return;
			while(this._queue.length > 0)
			{
				renderer = Renderer(this._queue.shift());
				renderer.callRender();
			}
			this._queue = this._laterQueue.concat();
			this._laterQueue = new Vector.<Renderer>();
			if(this._queue.length < 1) 
			{
				this.removeStageListeners();
			}
		}
		
		/**
		 * Adds a renderer to the queue
		 */
		public function addRenderer(renderer:Renderer):void
		{
			if (this._queue.length < 1) this.addStageListeners();
			if(this._queue.indexOf(renderer) == -1)
			{
				this._queue.push(renderer);
			}
		}

		/**
		 * Adds a renderer to the later queue
		 */
		public function addLaterRenderer(renderer:Renderer):void
		{
			if(this._laterQueue.indexOf(renderer) == -1)
			{
				this._laterQueue.push(renderer);
			}
		}
		
		/**
		 * @private (protected)
		 */
		protected function addStageListeners():void
		{
			this._stage.addEventListener(Event.RENDER, this.dispatch, false, 0, true);
			this._stage.addEventListener(Event.ENTER_FRAME, this.dispatch, false, 0, true);
			this._stage.invalidate();
		}
		
		/**
		 * @private (protected)
		 */
		protected function removeStageListeners():void
		{
			this._stage.removeEventListener(Event.RENDER, this.dispatch);
			this._stage.removeEventListener(Event.ENTER_FRAME, this.dispatch);
		}

	}
}
