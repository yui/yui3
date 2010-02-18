package com.yahoo.renderers
{
	import flash.display.Sprite;
	import com.yahoo.renderers.DisplayChangeType;
	import com.yahoo.renderers.layout.ContainerType;
	import com.yahoo.renderers.styles.RendererStyles;
	import com.yahoo.renderers.styles.IStyle;
	import com.yahoo.renderers.events.StyleEvent;
	import com.yahoo.renderers.events.RendererEvent;
	import com.yahoo.renderers.ApplicationGlobals;
	import flash.events.Event;
	
	/**
	 * Base class for rendering DisplayObjects with styles
	 */
	public class Renderer extends Sprite implements IStyle
	{
		
	//--------------------------------------
	//  Static Properties
	//--------------------------------------		
		/**
		 * Reference to the style class.
		 */
		private static var _styleClass:Class = RendererStyles;
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
		 * Constructor
		 */
		public function Renderer(styles:IStyle = null)
		{
			super();
			if(styles) this._styles = styles;
			this.initializeRenderer();
		}

	//--------------------------------------
	//  Properties
	//--------------------------------------

		/**
		 * @private (protected)
		 * Indicates that a flag has been set.
		 */
		protected var _hasFlag:Boolean = false;
	
		/**
	 	 * @private
	 	 * Storage for width
	 	 */
		private var _width:Number = 0;

		/**
		 * @private
		 */
		protected var _previousWidth:Number = 0;
		
		/**
	 	 * Gets or sets the width
	 	 */
		override public function get width():Number
		{
			if(this.getStyle("sizeMode") == ContainerType.BOX || this.getStyle("sizeMode") == ContainerType.VBOX) return this._width;
			return this.contentWidth;
		}
	
		/**
	 	 * @private (setter)
	 	 */
		override public function set width(value:Number):void
		{
			if(this.width == value) return;
			this._width = value;
			if(this.getStyle("sizeMode") == ContainerType.HBOX || this.getStyle("sizeMode") == ContainerType.NONE) return;
			if(isNaN(value)) return;
			var resizeEvent:RendererEvent = new RendererEvent(RendererEvent.RESIZE);
			resizeEvent.widthChange = true;
			this.dispatchEvent(resizeEvent);			
			this.setFlag("resize");
		}

		/**
		 * Gets or sets the <code>contentWidth</code>.
		 */
		public function get contentWidth():Number
		{
			return super.width;
		}
		
		/**
	 	 * @private
	  	 * Storage for height
	 	 */
		private var _height:Number = 0;
	
		/**
		 * @private
		 */
		protected var _previousHeight:Number = 0;

		/**
	 	 * Gets or sets the width
	 	 */		
		override public function get height():Number
		{
			if(this.getStyle("sizeMode") == ContainerType.BOX || this.getStyle("sizeMode") == ContainerType.HBOX) return this._height;
			return this.contentHeight;
		}

		/**
	 	 * @private (setter)
	 	 */		
		override public function set height(value:Number):void
		{
			if(this.height == value) return;
			this._height = value;
			if(this.getStyle("sizeMode") == ContainerType.VBOX || this.getStyle("sizeMode") == ContainerType.NONE) return;
			if(isNaN(value)) return;
			var resizeEvent:RendererEvent = new RendererEvent(RendererEvent.RESIZE);
			resizeEvent.heightChange = true;
			this.dispatchEvent(resizeEvent);			
			this.setFlag("resize");
		}

		/**
		 * Gets or sets the <code>contentHeight</code>.
		 */
		public function get contentHeight():Number
		{
			return super.height;
		}

		/**
		 * Indicates whether or not to render on a style or property change.
		 */
		public function get autoRender():Boolean
		{
			if(this._globalApp) return this._globalApp.autoRender;
			return false;
		}
		
		/**
		 * @private (setter)
		 */
		public function set autoRender(value:Boolean):void
		{
			if(value == this._globalApp.autoRender) return;
			this._globalApp.autoRender = value;
		}
		
		/**
		 * @private 
		 * Storage for styles property
		 */
		protected var _styles:IStyle;
		
		/**
		 * @private
		 * Hash of flags to indicate whether task needs to occur on the redraw.
		 */
		protected var _renderFlags:Object = {};
		
		/**
		 * @private
		 */
		protected var _laterFlags:Object = {};

		/**
		 * @private (protected)
		 */
		protected var _globalApp:ApplicationGlobals;
		
		/**
		 * Indicates whether the Renderer is in the process of rendering.
		 */
		public var rendering:Boolean = false;
	//--------------------------------------
	//  Public Methods
	//--------------------------------------			
		/**
		 * Returns reference to the style class used
		 */
		public function getStyleClass():Class
		{
			return _styleClass;
		}

		/**
		 * @copy com.yahoo.styles.IStyle#getStyles()
		 */
		public function getStyles():Object
		{
			return this._styles.getStyles();
		}
	
		/**
		 * Returns the value of a style.
		 */
		public function getStyle(value:String):Object
		{
			return this._styles.getStyle(value);
		}
	
		/**
		 * Sets the value of a style
		 */
		public function setStyle(style:String, value:Object):void
		{
			if(style == "width" || style == "height") 
			{
				this[style] = value as Number;
				return;
			}
			this._styles.setStyle(style, value);
		}
	
		/**
		 * @copy com.yahoo.styles.IStyle#setStyles()
		 */
		public function setStyles(styles:Object):void
		{
			if(styles.hasOwnProperty("width")) this.width = styles.width as Number;
			if(styles.hasOwnProperty("height")) this.height = styles.height as Number;
			this._styles.setStyles(styles);
		}
		
		/**
		 * Forces a redraw
		 */
		public function forceRender():void
		{
			this.render();
		}

	//--------------------------------------
	//  Protected Methods
	//--------------------------------------		
		/**
		 * Renders the contents of the object.
		 */
		protected function render():void
		{
		 	//Placeholder. Needs to be overridden to by class.
		}
	
		/**
		 * @private
		 */
		protected function initializeRenderer():void
		{
			this._globalApp = ApplicationGlobals.getInstance();
			if(this.stage) this.stage.addEventListener(Event.ENTER_FRAME, this.callRender, false, 0, true);
			this.addEventListener(Event.ADDED_TO_STAGE, handleAddedToStage); 	
			this.setStyleInstance();
		}

		/**
		 * @private (protected)
		 */
		protected function setStyleInstance():void
		{
			if(!this._styles)
			{
				var styleClass:Class = this.getStyleClass();			
				this._styles = new styleClass();
			}
			this._styles.addEventListener(StyleEvent.STYLE_CHANGE, this.styleChangeHandler);		
		}
	
	//--------------------------------------
	//  Private Methods
	//--------------------------------------		
		/**
	 	 * @private
	 	 * Event handler for rendering. 
	 	 */
		private function callRender(event:Event):void
		{
			if(this._hasFlag && this.autoRender && !this.rendering)
			{
				this.rendering = true;
				this.render();
				this.clearFlags();
				this.updateRenderStatus();
			}
		}
	
		/**
		 * @private 
		 */
		protected function updateRenderStatus():void
		{
			this.rendering = false;
			this.dispatchRenderEvents();
		}
		/**
		 * @private (protected)
		 * All the events that need to be dispatched after <code>render</code> has completed.
		 */
		protected function dispatchRenderEvents():void
		{
			var event:RendererEvent = new RendererEvent(RendererEvent.RENDER_COMPLETE);
			event.changeFlags = this._renderFlags;
			event.widthChange = this._previousWidth != this.width;
			event.heightChange = this._previousHeight != this.height;
			this._previousWidth = this.width;
			this._previousHeight = this.height;
			this.dispatchEvent(event);
		}
				
		/**
		 * @private
		 */
		private function handleAddedToStage(event:Event):void
		{
			this.stage.addEventListener(Event.ENTER_FRAME, this.callRender, false, 0, true);
		}
		
		/**
		 * @private
		 */
		protected function setFlag(value:String):void
		{
			this._hasFlag = true;
			this._renderFlags[value] = true;
		}
		
		/**
		 * @private 
		 * Sets a flag to mark for rendering on a later enterFrame.
		 */
		protected function setLaterFlag(value:String):void
		{
			this._laterFlags[value] = true;
		}

		/**
		 * @private
		 */
		private function setFlags(value:Array):void
		{
			this._hasFlag = true;
			for(var i:int = 0; i < value.length; i++)
			{
				var obj:Object = value[i];
				if(obj.style) this._renderFlags[obj.style] = true;
			}
		}	

		/**
		 * @private
		 */
		protected function clearFlags():void
		{
			this._renderFlags = {};
			this._hasFlag = false;
			for(var i:String in this._laterFlags)
			{
				this.setFlag(i);
			}
			this._laterFlags = {};
		}
		
		/**
		 * @private
		 */
		protected function checkFlag(value:String):Boolean
		{
			return this._renderFlags[value];
		}

		/**
		 * @private (protected)
		 */
		protected function checkFlags(flags:Object):Boolean
		{
			var hasFlag:Boolean = false;
			for(var i:String in flags)
			{
				if(this._renderFlags[i]) 
				{
					hasFlag = true;
					break;
				}
			}
			return hasFlag;
		}

	//--------------------------------------
	//  Event Handlers
	//--------------------------------------		
		/**
		 * @private
		 */
		protected function styleChangeHandler(event:StyleEvent):void
		{
			if(event.style && event.style.style) this.setFlag(event.style.style);
			if(event.styles && event.styles.length > 0) this.setFlags(event.styles as Array);
			this.setFlag(DisplayChangeType.STYLES);
		}
	}
}
