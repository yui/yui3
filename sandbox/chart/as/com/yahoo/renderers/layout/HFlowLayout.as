package com.yahoo.renderers.layout
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;

	public class HFlowLayout extends LayoutStrategy
	{
		/**
		 * Constructor
		 */
		public function HFlowLayout()
		{
			super();
		}

		/**
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#sizeMode
		 */
		override public function get sizeMode():String
		{
			return ContainerType.VBOX;
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
		private var _rows:Array;

		/**
		 * @inheritDoc
		 */
		override public function layoutChildren():void
		{
			super.layoutChildren();
			this.measureContent();
			var len:Number = this._rows.length;
			var childY:Number = this._topPadding;
			var childX:Number = 0;
			var child:DisplayObject;
			for(var i:int = 0; i < len; i++)
			{
				var row:Object = this._rows[i];
				var padding:Number = this._leftPadding;

				if(this._horizontalAlign == "center")
				{
					padding = (this.container.width - row.width)/2;
				}
				else if(this._horizontalAlign == "right")
				{
					padding += this.container.width - (this._rightPadding + row.width);	
				}

				if(!isNaN(padding)) childX = padding;
				var items:Array = row.items as Array;
				var rowLen:int = items.length;
				for(var j:int = 0; j < rowLen; j++)
				{
					child = items[j] as DisplayObject;
					child.y = childY;
					child.x = childX;
					childX = child.x + child.width + this._horizontalGap;
				}
				childY += this._verticalGap + row.height;
			}
		}

		/**
		 * @private
		 */
		override public function measureContent():void
		{
			var oldWidth:Number = this._contentWidth;
			var oldHeight:Number = this._contentHeight;
			var rows:Array = new Array();
			var children:Array = this.items;
			var len:int = children.length;
			var padding:Number = this._horizontalAlign == "center" ? 0 : (this._leftPadding + this._rightPadding);
			var row:Object = {items:[], height:0, width:(padding - this._horizontalGap)};
			rows.push(row);
			var child:DisplayObject;
			this._contentHeight = this._topPadding - this._verticalGap;
			for(var i:int = 0; i < len; i++)
			{
				child = children[i] as DisplayObject;	
				if((row.width + child.width) <= this.container.width)
				{
					row.items.push(child);
					row.width += child.width + this._horizontalGap;
					row.height = Math.max(row.height, child.height);
				}
				else
				{
					row = {items:[child], height:child.height, width:(padding + child.width)};
					rows.push(row);
				}
				this._contentHeight += child.height + this._verticalGap;
			}

			this._contentHeight += this._bottomPadding;
			this._rows = rows;
			this.container.update(this._contentWidth != oldWidth, this._contentHeight != oldHeight);
		}
	}
}
