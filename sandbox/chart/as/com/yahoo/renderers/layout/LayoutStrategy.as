package com.yahoo.renderers.layout
{
	import com.yahoo.renderers.styles.IStyle;
	import com.yahoo.renderers.styles.LayoutStyles;
	import flash.utils.Dictionary;	
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.events.EventDispatcher;

	public class LayoutStrategy extends EventDispatcher implements ILayoutStrategy
	{
		public function LayoutStrategy()
		{
		}

		protected var _sizeMode:String = ContainerType.BOX;

		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#sizeMode
		 */
		public function get sizeMode():String
		{
			return this._sizeMode;
		}

		/**
		 * @private 
		 * Storage for styles property
		 */
		protected var _styles:IStyle = new LayoutStyles();

		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#styles
		 */
		public function get styles():IStyle
		{
			return this._styles;
		}

		/**
		 * @private
		 * Storage for items
		 */
		private var _items:Array = [];
		
		/**
		 * Gets or sets the array of items 
		 */
		public function get items():Array
		{
			return this._items;
		}
		
		/**
		 * @private (setter)
		 */
		public function set items(value:Array):void
		{
			var len:int = value.length;
			if(this.items && this.items.length > 0)
			{
				this.removeAll();
			}
			for(var i:int = 0; i < value.length; i++)
			{
				this.addItem(value[i] as DisplayObjectContainer);
			}
		}

		/**
		 * @private 
		 * Storage for container.
		 */
		private var _container:Container;

		/**
		 * Gets or sets the <code>Container</code>
		 */
		public function get container():Container
		{
			return this._container;
		}

		/**
		 * @private (setter)
		 */
		public function set container(value:Container):void
		{
			this._container = value;
		}

		/**
		 * @private (protected)
		 */
		protected var _topPadding:Number = 0;

		/**
		 * @private
		 */
		protected var _rightPadding:Number = 0;

		/**
		 * @private
		 */
		protected var _bottomPadding:Number = 0;

		/**
		 * @private
		 */
		protected var _leftPadding:Number = 0;

		/**
		 * @private
		 */
		protected var _horizontalGap:Number = 0;

		/**
		 * @private
		 */
		protected var _verticalGap:Number = 0;

		/**
		 * @private
		 */
		protected var _horizontalAlign:String = "left";

		/**
		 * @private
		 */
		protected var _verticalAlign:String = "top";

		/**
		 * @private
		 * Storage for contentWidth.
		 */
		protected var _contentWidth:Number = 0;

		/**
		 * @private 
		 * Storage for contentHeight.
		 */
		protected var _contentHeight:Number = 0;

		/**
		 * Gets the width of all children, padding and gaps.
		 */
		public function get contentWidth():Number
		{
			return this._contentWidth;
		}

		/**
		 * Gets the height of all children, padding and gaps.
		 */
		public function get contentHeight():Number
		{
			return this._contentHeight;
		}

		/**
		 * @private
		 * Storage for layoutFlags
		 */
		private var _layoutFlags:Object = 
		{
			padding:true,
			horizontalGap:true,
			verticalGap:true,
			horizontalAlign:true,
			verticalAlign:true,
			resize:true,
			sizeMode:true,
			updateItems:true,
			childResize:true			
		};

		/**
		 * Gets the property flags that should trigger a layout change.
		 */
		public function get layoutFlags():Object
		{
			return this._layoutFlags;
		}

		/**
		 * @private 
		 * Storage for stretchChildrenToFit
		 */
		private var _stretchChildrenToFit:Boolean = false;

		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#stretchChildrenToFit
		 */
		public function get stretchChildrenToFit():Boolean
		{
			return this._stretchChildrenToFit;
		}

		/**
		 * @private (setter)
		 */
		public function set stretchChildrenToFit(value:Boolean):void
		{
			this._stretchChildrenToFit = value;
		}
	
		/**
		 * @private 
		 * Storage for childData
		 */
		private var _childData:Dictionary = new Dictionary();

		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#childData
		 */
		public function get childData():Dictionary
		{
			return this._childData;
		}
		
		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#getItemAt()
		 */
		public function getItemAt(index:int):DisplayObject
		{
			return this.container.getChildAt(index);
		}
		
		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#addItem()
		 */
		public function addItem(value:DisplayObject, props:Object = null):void
		{
			if(props && !isNaN(Number(props.layoutIndex)) && Number(props.layoutIndex) < this.items.length)
			{
				if(props.layoutIndex == 0)
				{
					this.items.unshift(value);
				}
				else
				{
					var arr1:Array = this.items.slice(0, props.layoutIndex);
					var arr2:Array = this.items.slice(props.layoutIndex);
					arr1.push(value);
					this._items = arr1.concat(arr2) as Array;
				}
			}
			else
			{
				this.items.push(value);
			}
			this.childData[value] = props?props:{};
			if(props && !isNaN(props.index))
			{
				this.container.addChildAt(value, props.index);
			}
			else
			{
				this.container.addChild(value);
				this.childData[value].index = this.container.getChildIndex(value);
				this.childData[value].layoutIndex = this.items.indexOf(value);
			}
		}
		
		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#removeItem()
		 */
		public function removeItem(value:DisplayObject):void
		{
			this.items.splice(this.items.indexOf(value), 1);
			if(this.childData[value]) delete this.childData[value];
			this.container.removeChild(value);
		}

		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#removeItemAt()
		 */
		public function removeItemAt(index:int):void
		{
			var child:DisplayObject = this.items[index] as DisplayObject;
			this.container.removeChild(child);
			if(this.childData[child]) delete this.childData[child];
			this.items.splice(index, 1);
		}

		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#removeAll()
		 */
		public function removeAll():void
		{
			var numChildren:uint = items.length;
			for(var i:uint = 0; i < numChildren; i++)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				this.container.removeChild(child);
				if(this.childData[child]) delete this.childData[child];
			}
			this.items = [];
		}
		
		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#layoutChildren()
		 */
		public function layoutChildren():void
		{
			this.setLayoutProps();
		}

		/**
		 * @private (protected)
		 * 
		 * Sets layout property values based on the corresponding style properties.
		 */
		protected function setLayoutProps():void
		{
			var padding:Object = this.getStyle("padding");
			this._topPadding = Number(padding.top);
			this._rightPadding = Number(padding.right);
			this._bottomPadding = Number(padding.bottom);
			this._leftPadding = Number(padding.left);
			this._horizontalGap = this.getStyle("horizontalGap") as Number;
			this._verticalGap = this.getStyle("verticalGap") as Number;
			this._horizontalAlign = this.getStyle("horizontalAlign") as String;
			this._verticalAlign = this.getStyle("verticalAlign") as String;
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
			return this._styles[value];
		}
	
		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#measureContent()
		 */
		public function measureContent():void {}
	}
}
