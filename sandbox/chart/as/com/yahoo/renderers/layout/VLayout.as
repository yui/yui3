package com.yahoo.renderers.layout
{
	import flash.display.DisplayObject;
	
	public class VLayout extends LayoutStrategy implements ILayoutStrategy
	{
		public function VLayout()
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
		 * @copy com.yahoo.renderers.layout.ILayoutStrategy#layoutChildren()
		 */
		override public function layoutChildren():void
		{
			super.layoutChildren();
			this.measureContent();
			switch(this._verticalAlign)
			{
				case "bottom" :
					this.bottomAlignChildren();
				break;
				case "middle" :
					this.middleAlignChildren();
				break;
				default :
					this.topAlignChildren();
				break;
			}
		}

		/**
		 * @private
		 * Algorithm for positioning children with a top alignment.
		 */
		private function topAlignChildren():void
		{
			
			var len:int = this.items.length;
			var childY:Number = this._topPadding;
			for(var i:int = 0; i < len; i++)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				child.y = childY;
				child.x = this.getChildX(child);
				childY = child.y + child.height + this._verticalGap;
			}
		}

		/**
		 * @private
		 * Algorithm for positioning children with a bottom alignment.
		 */
		private function bottomAlignChildren():void
		{
			
			var len:int = this.items.length;
			var childY:Number = this.container.height - this._bottomPadding;
			for(var i:int = len - 1; i > -1; i--)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				child.y = childY -  child.height;
				child.x = this.getChildX(child);
				childY = child.y - this._verticalGap;
			}
		}

		/**
		 * @private 
		 * Algorithm for positioning children with a middle alignment.
		 */
		private function middleAlignChildren():void
		{			
			var len:int = this.items.length;
			var containerHeight:Number = this.container.height;
			var childY:Number = this._topPadding;
			if(containerHeight > this._contentHeight)
			{
				var bumpDistance:Number = (containerHeight - (this._contentHeight - (this._topPadding + this._bottomPadding)))/2;
				if(!isNaN(bumpDistance)) childY = bumpDistance;
			}
			for(var i:int = 0; i < len; i++)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				child.y = childY;
				child.x = this.getChildX(child);
				childY = child.y + child.height + this._verticalGap;
			}
		}

		/**
		 * @private
		 * Determines the x coordinate of the child.
		 */
		private function getChildX(child:DisplayObject):Number
		{
			if(this._horizontalAlign == "right") return (this.container.width - (this._rightPadding + child.width));
			if(this._horizontalAlign == "center") return (this.container.width/2 - child.width/2);
			return this._leftPadding;
		}

		/**
		 * @private
		 */
		override public function measureContent():void
		{
			var len:Number = this.items.length;
			var oldWidth:Number = this._contentWidth;
			var oldHeight:Number = this._contentHeight;
			this._contentHeight = this._topPadding;
			this._contentWidth = 0;
			for(var i:int = 0; i < len; i++)
			{
				var child:DisplayObject = this.items[i] as DisplayObject;
				if(this.stretchChildrenToFit) child.width = this.container.width - (this._leftPadding + this._rightPadding);
				this._contentHeight += child.height + this._verticalGap;
				this._contentWidth = Math.max(this._contentWidth, child.width);
			}
			this._contentWidth += this._leftPadding + this._rightPadding;
			this._contentHeight += this._bottomPadding - this._verticalGap;
			this.container.update(this._contentWidth != oldWidth, this._contentHeight != oldHeight);
		}
	}
}
