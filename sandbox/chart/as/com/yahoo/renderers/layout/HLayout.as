package com.yahoo.renderers.layout
{
	import flash.display.DisplayObject;

	public class HLayout extends LayoutStrategy
	{
		public function HLayout()
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
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#layoutChildren()
		 */
		override public function layoutChildren():void
		{
			super.layoutChildren();
			this.measureContent();
			switch(this._horizontalAlign)
			{
				case "right" :
					this.rightAlignChildren();
				break;
				case "center" :
					this.centerAlignChildren();
				break;
				default :
					this.leftAlignChildren();
				break;
			}
		}
	
		/**
		 * @private
		 * Contains algorithm for positioning elements from left to right.
		 */
		private function leftAlignChildren():void
		{
			var len:Number = this.items.length;
			var childX:Number = this._leftPadding;
			for(var i:int = 0; i < len; i++)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				child.x = childX;
				child.y = this.getChildY(child);
				childX = child.x + child.width + this._horizontalGap;
			}
		}

		/**
		 * @private 
		 * Contains algorithm for positioning elements right to left.
		 */
		private function rightAlignChildren():void
		{	
			var len:Number = this.items.length;	
			var childX:Number = this.container.width - this._rightPadding;	
			if(childX < 0) return;
			for(var i:int = len -1; i > -1; i--)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				child.x = childX - child.width;
				child.y = this.getChildY(child);
				childX = child.x - this._horizontalGap
			}
		}

		/**
		 * @private
		 * Contains algorithm for positioning elements with a center alignment.
		 */
		private function centerAlignChildren():void
		{
			var len:Number = this.items.length;	
			var childX:Number = this._leftPadding;
			var containerWidth:Number = this.container.width;
			if(containerWidth > this._contentWidth)
			{
				var bumpDistance:Number = (containerWidth - (this._contentWidth - (this._leftPadding + this._rightPadding)))/2;
				if(!isNaN(bumpDistance)) childX = bumpDistance;
			}
			for(var i:int = 0; i < len; i++)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				child.x = childX;
				child.y = this.getChildY(child);
				childX = child.x + child.width + this._horizontalGap;
			}
		}

		/**
		 * @private 
	     * Returns the vertical position of a child based on the verticalAlign.
		 */
		private function getChildY(child:DisplayObject):Number
		{
			if(this._verticalAlign == "bottom") return (this.container.height - (child.height + this._bottomPadding));
			if(this._verticalAlign == "middle") return (this.container.height/2 - child.height/2);
			return this._topPadding;
		}

		/**
		 * @private
		 */
		override public function measureContent():void
		{
			var len:Number = this.items.length;
			var oldWidth:Number = this._contentWidth;
			var oldHeight:Number = this._contentHeight;
			this._contentHeight = 0;
			this._contentWidth = this._leftPadding;
			for(var i:int = 0; i < len; i++)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				if(this.stretchChildrenToFit) child.height = this.container.height - (this._topPadding + this._bottomPadding);
				this._contentWidth += child.width + this._horizontalGap;
				this._contentHeight = Math.max(this._contentHeight, child.height);
			}
			this._contentHeight += this._topPadding + this._bottomPadding;
			this._contentWidth += this._rightPadding - this._horizontalGap;
			this.container.update(this._contentWidth != oldWidth, this._contentHeight != oldHeight);
		}
	}
}
