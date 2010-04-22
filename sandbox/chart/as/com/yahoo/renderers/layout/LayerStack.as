package com.yahoo.renderers.layout
{
	import flash.display.DisplayObject;

	/**
	 * Contains algorithms for layering and sizing display objects
	 * whose size is determined by their parent's size.
	 */
	public class LayerStack extends LayoutStrategy
	{
		public function LayerStack()
		{
			super();
		}

		/**
		 * @private
		 * Storage for layoutFlags
		 */
		private var _layoutFlags:Object = 
		{
			padding:true,
			resize:true,
			sizeMode:true,
			updateItems:true
		};

		/**
		 * @inheritDoc
		 */
		override public function get layoutFlags():Object
		{
			return this._layoutFlags;
		}

		/**
		 * @inheritDoc
		 */
		override public function layoutChildren():void
		{
			super.layoutChildren();
			if(!this.items || this.items.length < 0) return;
			var items:Array = this.items;
			var len:int = items.length;
			var wid:Number = this.container.width - (this._leftPadding + this._rightPadding);
			var ht:Number = this.container.height - (this._topPadding + this._bottomPadding);
			for(var i:int = 0; i < len; i++)
			{
				var item:DisplayObject = items[i] as DisplayObject;
				if(this.childData[item].excludeFromLayout)
				{
					continue;
				}
				item.x = this._leftPadding;
				item.y = this._topPadding;
				item.width = wid;
				item.height = ht;
			}
		}
	}
}
