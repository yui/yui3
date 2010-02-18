package com.yahoo.renderers.layout
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import com.yahoo.renderers.events.LayoutEvent;
	/**
	 * Contains algorithms for laying out display objects in a 
	 * border pattern with a header, footer, 2 sidebars and a center
	 * area.
	 */
	public class BorderLayout extends LayoutStrategy
	{
		/**
		 * Constructor
		 */
		public function BorderLayout()
		{
			super();
		}

		/**
		 * @private
		 */
		override public function set container(value:DisplayObjectContainer):void
		{
			super.container = value;
			this._borderContainer = BorderContainer(container);
			this.setStyle("sizeMode", ContainerType.BOX);
		}

		/**
		 * @private
		 */
		private var _borderContainer:BorderContainer;

		/**
		 * @private
		 */
		private var _availableWidth:Number;

		/**
		 * Width of the center stack.
		 */
		public function get availableWidth():Number
		{
			return this._availableWidth;
		}

		/**
		 * @private
		 */
		private var _availableHeight:Number;

		/**
		 * Height of the center stack.
		 */
		public function get availableHeight():Number
		{
			return this._availableHeight;
		}

		/**
		 * @private
		 */
		private var _verticalPadding:Number;
		
		/**
		 * @private
		 */
		private var _horizontalPadding:Number;
		
		/**
		 * @private
		 */
		private var _verticalBorderHeight:Number;
		
		/**
		 * @private
		 */
		private var _horizontalBorderWidth:Number;
		
		/**
		 * @private
		 */
		private var _totalLeftBorder:Number;
		
		/**
		 * @private
		 */
		private var _totalTopBorder:Number;
		
		/**
		 * @private
		 */
		private var _totalRightBorder:Number;
		
		/**
		 * @private
		 */
		private var _totalBottomBorder:Number;
		
		/**
		 * @private
		 */
		override public function measureContent():void
		{
			this._verticalPadding = (this._topPadding + this._bottomPadding);
			this._verticalBorderHeight =  (this._borderContainer.topContainer.height + this._borderContainer.bottomContainer.height);
			this._horizontalPadding = (this._leftPadding + this._rightPadding);
			this._horizontalBorderWidth = (this._borderContainer.leftContainer.width + this._borderContainer.rightContainer.width);
			this._availableHeight = this._borderContainer.height - (this._verticalPadding + this._verticalBorderHeight);
			this._availableWidth = (this._borderContainer.width -  (this._horizontalPadding + this._horizontalBorderWidth)); 
			this._totalLeftBorder = this._borderContainer.leftContainer.width + this._leftPadding;
			this._totalTopBorder = this._borderContainer.topContainer.height + this._topPadding;
			this._totalBottomBorder = (this._borderContainer.bottomContainer.height + this._bottomPadding);
			this._totalRightBorder = (this._rightPadding + this._borderContainer.rightContainer.width);
			
		}
	
		/**
		 * @inheritDoc
		 */
		override public function layoutChildren():void
		{
			super.layoutChildren();
			this.measureContent();
		
			this._borderContainer.rightContainer.height = this._availableHeight;
			this._borderContainer.leftContainer.height = this._availableHeight;
			this._borderContainer.topContainer.width = this._availableWidth;
			this._borderContainer.bottomContainer.width = this._availableWidth;

			this._borderContainer.topContainer.x = this._totalLeftBorder;
			this._borderContainer.topContainer.y = this._topPadding;
			this._borderContainer.bottomContainer.x = this._totalLeftBorder;
			this._borderContainer.bottomContainer.y = this._borderContainer.height - this._totalBottomBorder; 
			this._borderContainer.leftContainer.x = this._leftPadding;
			this._borderContainer.leftContainer.y = this._totalTopBorder;
			this._borderContainer.rightContainer.x = this._borderContainer.width - this._totalRightBorder;
			this._borderContainer.rightContainer.y = this._totalTopBorder;
		}

		/**
		 * Positions and sized centerStack
		 */
		public function resizeCenterStack():void
		{
			this._borderContainer.centerStack.x = this._totalLeftBorder;
			this._borderContainer.centerStack.y = this._totalTopBorder;
			this._borderContainer.centerStack.width = this._availableWidth;
			this._borderContainer.centerStack.height = this._availableHeight;
		}
	}
}
