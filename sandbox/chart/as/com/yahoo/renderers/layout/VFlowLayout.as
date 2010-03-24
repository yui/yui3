package com.yahoo.renderers.layout
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;

	public class VFlowLayout extends LayoutStrategy
	{
		/**
		 * Constructor
		 */
		public function VFlowLayout()
		{
			super();
		}

		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#sizeMode
		 */
		override public function get sizeMode():String
		{
			return ContainerType.HBOX;
		}
		
		/**
		 * @private
		 */
		override public function set container(value:Container):void
		{
			super.container = value;
		}

		/**
		 * @private
		 */
		private var _columns:Array;

		/**
		 * @inheritDoc
		 */
		override public function layoutChildren():void
		{
			super.layoutChildren();
			this.measureContent();
			var len:Number = this._columns.length;
			var childX:Number = this._leftPadding;
			var childY:Number = 0;
			var child:DisplayObject;
			for(var i:int = 0; i < len; i++)
			{
				var column:Object = this._columns[i];
				var padding:Number = this._topPadding;

				if(this._verticalAlign == "middle")
				{
					padding = (this.container.height - column.height)/2;
				}
				else if(this._verticalAlign == "bottom")
				{
					padding += this.container.height - (this._bottomPadding + column.height);	
				}

				if(!isNaN(padding)) childY = padding;
				var items:Array = column.items as Array;
				var columnLen:int = items.length;
				for(var j:int = 0; j < columnLen; j++)
				{
					child = items[j] as DisplayObject;
					child.x = childX;
					child.y = childY;
					childY = child.y + child.height + this._verticalGap;
				}
				childX += this._horizontalGap + column.width;
			}
		}

		/**
		 * @private
		 */
		override public function measureContent():void
		{
			var oldWidth:Number = this._contentWidth;
			var oldHeight:Number = this._contentHeight;
			var columns:Array = new Array();
			var children:Array = this.items;
			var len:int = children.length;
			var padding:Number = this._verticalAlign == "middle" ? 0 : (this._topPadding + this._bottomPadding);
			var column:Object = {items:[], width:0, height:(padding - this._verticalGap)};
			columns.push(column);
			var child:DisplayObject;
			for(var i:int = 0; i < len; i++)
			{
				child = children[i] as DisplayObject;	
				if((column.height + child.height) <= this.container.height)
				{
					column.items.push(child);
					column.height += child.height + this._verticalGap;
					column.width = Math.max(column.width, child.width);
				}
				else
				{
					column = {items:[child], width:child.width, height:(padding + child.height)};
					columns.push(column);
				}
				this._contentHeight += child.width + this._horizontalGap;
			}

			this._contentHeight += this._rightPadding;
			this._columns = columns;
			this.container.update(this._contentWidth != oldWidth, this._contentHeight != oldHeight);
		}
	}
}
