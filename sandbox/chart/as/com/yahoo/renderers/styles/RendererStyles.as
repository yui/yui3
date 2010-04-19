package com.yahoo.renderers.styles
{	
	
	import flash.utils.getQualifiedClassName;
	import flash.utils.getQualifiedSuperclassName;
	import flash.utils.getDefinitionByName;
	import com.yahoo.renderers.layout.ContainerType;
		
	/**
	 * Base Style class for renderers
	 */	
	public class RendererStyles implements IStyle
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
			margin:"margin"
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

	//--------------------------------------
	//  Public Methods
	//--------------------------------------	
	
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
		 * @copy com.yahoo.styles.IStyle#setStyle()
		 */
		public function setStyle(style:String, value:Object):Boolean
		{
			if(this.hasOwnProperty(style) && this[style] !== value)
			{
				if(this[style] is Boolean)
				{
					this[style] = String(value) == "true" ? true : false;
				}
				else
				{
					this[style] = value;
				}
				return true;
			}
			return false;
		}
		/**
		 * @copy com.yahoo.styles.IStyle#getStyle()
		 */
		public function getStyle(style:String):Object
		{
			return this[style];
		}
		
		/**
		 * @copy com.yahoo.styles.IStyle#setStyles()
		 */
		public function setStyles(value:Object):void
		{
			for(var i:String in value)
			{
				this.setStyle(i, value);
			}
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
