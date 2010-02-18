package com.yahoo.renderers.styles
{	
	
	import flash.utils.getQualifiedClassName;
	import flash.utils.getQualifiedSuperclassName;
	import flash.utils.getDefinitionByName;
	import flash.events.EventDispatcher;
	import com.yahoo.renderers.layout.ContainerType;
	import com.yahoo.renderers.events.StyleEvent;
		
	/**
	 * Base Style class for renderers
	 */	
	public class RendererStyles extends EventDispatcher implements IStyle
	{

	//--------------------------------------
	//  Static Properties
	//--------------------------------------
		/**
		 * Mapping of available style properties for the class and its
		 * subclasses.
		 */
		public static var styleMap:Object = 
		{
			padding:"padding",
			margin:"margin",
			sizeMode:"sizeMode"
		};
	
	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
		 * Constructor
		 */
		public function RendererStyles()
		{
			this._availableStyles = this.getStyleMap();
		}

	//--------------------------------------
	//  Public Properties
	//--------------------------------------		
		/**
		 * @private
		 * Storage for availableStyles
		 */
		private var _availableStyles:Object;
		
		/**
		 * Available styles
		 */
		public function get availableStyles():Object
		{
			return this._availableStyles;
		}

		/**
		 * @private
		 * Storage for padding
		 */
		private var _padding:Object = {
			top:0,
			right:0,
			bottom:0,
			left:0
		};

		/**
		 * Hash of values indicating the padding for the axis.
		 * <ul>
		 * 	<li><code>top</code></li>
		 * 	<li><code>right</code></li>
		 * 	<li><code>bottom</code></li>
		 * 	<li><code>left</code></li>
		 * 	<li><code></code></li>
		 * </ul>
		 */
		public function get padding():Object
		{
			return this._padding;
		}

		/**
		 * @private (setter)
		 */
		public function set padding(value:Object):void
		{
			for(var i:String in value)
			{
				this._padding[i] = value[i];
			}
		}
		
		/**
		 * @private
		 * Storage for margin
		 */
		private var _margin:Object = 
		{
			top:0,
			right:0,
			bottom:0,
			left:0
		};

		/**
		 * Hash of margin values for label
		 * <ul>
		 * 	<li><code>top</code></li>
		 * 	<li><code>right</code></li>
		 * 	<li><code>bottom</code></li>
		 * 	<li><code>left</code></li>
		 * </ul>
		 */
		public function get margin():Object
		{
			return this._margin;
		}

		/**
		 * @private (setter)
		 */
		public function set margin(value:Object):void
		{
			for(var i:String in value)
			{
				if(this._margin.hasOwnProperty(i)) this._margin[i] = value[i];
			}
		}
		
		/**
		 * @private 
		 * Storage for sizing algorithm
		 */
		private var _sizeMode:String = ContainerType.BOX;

		/**
		 * Gets or sets the <code>sizeMode</code>.
		 * <p>The <code>sizeMode</code> determines how the dimensions of a renderer are determined.
		 * The available settings are below:
		 * <ul>
		 * 	<li><code>none</code>: The dimensions will be determined by the sum of its contents.</li>
		 * 	<li><code>box</code>: Width and height are explicitly set.</li>
		 * 	<li><code>hbox</code>: Height is explicitly set. Width is determined by the sum of its contents.</li>
		 * 	<li><code>vbox</code>: Width is explicitly set. Height is determined by the sum of its contents.</li>
		 * </ul>
		 */
		public function get sizeMode():String
		{
			return this._sizeMode;
		}

		/**
		 * @private (setter)
		 */
		public function set sizeMode(value:String):void
		{
			if(value == this.sizeMode) return;
			this._sizeMode = value;
		}

	//--------------------------------------
	//  Public Methods
	//--------------------------------------	
	
		/**
		 * @copy com.yahoo.styles.IStyle#getStyle()
		 */
		public function getStyle(style:String):Object
		{
			return this[style];
		}
		
		/**
		 * @copy com.yahoo.styles.IStyle#setStyle()
		 */
		public function setStyle(style:String, value:Object):void
		{	
			if(this.hasOwnProperty(style) && value !== this[style])
			{
				var item:Object = {style:style, oldValue:this[style], newValue:value};
				if(this[style] is Boolean)
				{
					this[style] = String(value) == "true" ? true : false;
				}
				else
				{
					this[style] = value;
				}
				this.dispatchEvent(new StyleEvent(StyleEvent.STYLE_CHANGE, false, false, item));
			}
		}
		
		/**
		 * @copy com.yahoo.styles.IStyle#getStyles()
		 */
		public function getStyles():Object
		{
			var map:Object = {};
			for(var i:String in this.availableStyles)
			{
				if(this.hasOwnProperty(i)) map[i] = this[i];
			}
			return map;
		}	
		
		/**
		 * @copy com.yahoo.styles.IStyle#setStyles()
		 */
		public function setStyles(value:Object):void
		{
			var items:Array = [];
			var styleChange:Boolean = false;
			for(var i:String in value)
			{
				if(this.hasOwnProperty(i) && this[i] !== value[i])
				{
					items.push({style:i, oldValue:this[i], newValue:value[i]});
					this[i] = value[i];
					styleChange = true;
				}
			}
			if(styleChange) this.dispatchEvent(new StyleEvent(StyleEvent.STYLE_CHANGE, false, false, null, items));
		}
		
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------		
		/**
		 * @private
		 * Returns a hash of all available styles
		 */
		protected function getStyleMap():Object
		{
			var styleClass:Object = getDefinitionByName(getQualifiedClassName(this));
			var styleClasses:Array = [];
			var map:Object = {};
			while(getQualifiedSuperclassName(styleClass))
			{
				styleClasses.push(styleClass);
				styleClass = getDefinitionByName(getQualifiedSuperclassName(styleClass));
			}
			for(var i:int = styleClasses.length - 1; i >=0; i--)
			{
				var styles:Class = styleClasses[i] as Class;
				for(var key:String in styles.styleMap)
				{
					map[key] = styles.styleMap[key];
				}
			}
			return map;
		}		
		
	}
}
