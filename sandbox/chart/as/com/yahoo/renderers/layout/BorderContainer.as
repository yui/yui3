package com.yahoo.renderers.layout
{
	import com.yahoo.renderers.Renderer;
	import com.yahoo.renderers.events.RendererEvent;
	import com.yahoo.renderers.styles.LayoutStyles;
	import flash.display.DisplayObject;

	public class BorderContainer extends Container implements IContainer
	{
		/**
		 * Constructor
		 */
		public function BorderContainer(layout:ILayoutStrategy = null)
		{
			if(!layout) layout = new BorderLayout() as ILayoutStrategy;
			super(layout);
			this.addContainers();
		}

		/**
		 * @private
		 * Storage for topContainer
		 */
		private var _topContainer:Container;

		/**
		 * Reference to the top border container
		 */
		public function get topContainer():Container
		{
			return this._topContainer;
		}

		/**
		 * @private
		 * Storage for the rightContainer
		 */
		private var _rightContainer:Container;

		/**
		 * Reference to the right border container
		 */
		public function get rightContainer():Container
		{
			return this._rightContainer;
		}

		/**
		 * @private
		 * Storage for the bottomContainer
		 */
		private var _bottomContainer:Container;

		/**
		 * Reference to the bottom border container
		 */
		public function get bottomContainer():Container
		{
			return this._bottomContainer;
		}

		/**
		 * @private
		 * Storage for leftContainer
		 */
		private var _leftContainer:Container
		
		/**
		 * Reference to the left border container
		 */
		public function get leftContainer():Container
		{
			return this._leftContainer;
		}

		/**
	     * @private
		 * Storage for centerStack
		 */
		private var _centerStack:Container;

		/**
		 * Container that holds all content in the center of the container.
		 */
		public function get centerStack():Container
		{
			return this._centerStack;
		}

		/**
		 * @private
		 * Storage for topLayout
		 */
		private var _topLayout:VLayout = new VLayout();

		/**
		 * Layout class for the top container.
		 */
		public function get topLayout():VLayout
		{
			return this._topLayout;
		}

		/**
		 * @private
		 * Storage for rightLayout
		 */
		private var _rightLayout:HLayout = new HLayout();

		/**
		 * Layout class for the right container
		 */
		public function get rightLayout():HLayout
		{
			return this._rightLayout;
		}

		/**
		 * @private
		 * Storage for bottomLayout
		 */
		private var _bottomLayout:VLayout = new VLayout();

		/**
		 * Layout class for the bottom container
		 */
		public function get bottomLayout():VLayout
		{
			return this._bottomLayout;
		}

		/**
		 * @private
		 * Storage for leftLayout
		 */
		private var _leftLayout:HLayout = new HLayout();

		/**
		 * Layout class for leftLayout
		 */
		public function get leftLayout():HLayout
		{
			return this._leftLayout;
		}

		/**
		 * @private 
		 * Storage for the centerLayout
		 */
		private var _centerLayout:LayerStack = new LayerStack();

		/**
		 * Layout class for centerStack
		 */
		public function get centerLayout():LayerStack
		{
			return this._centerLayout;
		}
		
		/**
		 * Adds an item to the topContainer
		 */
		public function addTopItem(value:Renderer, props:Object = null):void
		{
			this._topContainer.addItem(value, props);
		}

		/**
		 * Adds an item to the rightContainer
		 */
		public function addRightItem(value:Renderer, props:Object = null):void
		{
			this._rightContainer.addItem(value, props);
		}

		/**
		 * Adds an item to the bottomContainer
		 */
		public function addBottomItem(value:Renderer, props:Object = null):void
		{
			this._bottomContainer.addItem(value, props);
		}
		
		/**
		 * Adds an item to the leftContainer
		 */
		public function addLeftItem(value:Renderer, props:Object = null):void
		{
			this._leftContainer.addItem(value, props);
		}

		/**
		 * Adds an item to the centerContainer
		 */
		public function addCenterItem(value:Renderer, props:Object = null):void
		{
			this._centerStack.addItem(value, props);
		}
		/**
		 * @private
		 */
		private function addContainers():void
		{
			this.topLayout.stretchChildrenToFit = true;
			this._topContainer = new Container(this._topLayout);
			this._topContainer.autoRender = false;
			this.addItem(this._topContainer);

			this.rightLayout.stretchChildrenToFit = true;
			this._rightContainer = new Container(this._rightLayout);
			this._rightContainer.autoRender = false;
			this.addItem(this._rightContainer);

			this.bottomLayout.stretchChildrenToFit = true;
			this._bottomContainer = new Container(this._bottomLayout);
			this._bottomContainer.autoRender = false;
			this.addItem(this._bottomContainer);

			this.leftLayout.stretchChildrenToFit = true;
			this._leftContainer = new Container(this._leftLayout);
			this._leftContainer.autoRender = false;
			this.addItem(this._leftContainer);
			
			this._centerStack = new Container();
			this._centerStack.layout = this.centerLayout;
			this._centerStack.autoRender = false;
			this.addItem(this._centerStack);
		}

		/**
		 * @inheritDoc
		 */
		override protected function render():void
		{
			if(this.layout == null) return;
			this.visible = this.noChildResizing();
			var redraw:Boolean = false;
			var flagsToCheck:Object = this.layout.layoutFlags;
			flagsToCheck.childResize = true;
			for(var flag:String in flagsToCheck)
			{
				if(this.checkFlag(flag))
				{
					redraw = true;
					break;
				}
			}
			if(redraw) 
			{
				this.layout.layoutChildren();
				return;
			}
		}

		/**
		 * @private
		 * BorderContainer fires its is <code>renderComplete</code> event after all elements have completely resized. The <code>noChildResizing</code> 
		 * method indicates whether or not there is at least one horizontal and one vertical container as this changes the trigger for the 
		 * <code>renderComplete</code> event.
		 */
		protected function noChildResizing():Boolean
		{
			if(this.leftContainer.length > 0 && (this.topContainer.length > 0 || this.bottomContainer.length > 0)) return false;
			if(this.rightContainer.length > 0 && (this.topContainer.length > 0 || this.bottomContainer.length > 0)) return false;
			if(this.topContainer.length > 0 && (this.leftContainer.length > 0 || this.rightContainer.length > 0)) return false;
			if(this.bottomContainer.length > 0 && (this.leftContainer.length > 0 || this.rightContainer.length > 0)) return false;
			return true;
		}

		/**
		 * @private (override)
		 */
		override protected function updateRenderStatus():void
		{
			if(this.childRenderingComplete() && this.width > 0 && this.width > 0)
			{
				this.rendering = false;
				var oldAvailableWidth:Number = BorderLayout(this.layout).availableWidth,
					oldAvailableHeight:Number = BorderLayout(this.layout).availableHeight;
				BorderLayout(this.layout).measureContent();
				if(oldAvailableWidth == BorderLayout(this.layout).availableWidth && oldAvailableHeight == BorderLayout(this.layout).availableHeight)
				{
					if(this._centerStack.width == BorderLayout(this.layout).availableWidth && this._centerStack.height == BorderLayout(this.layout).availableHeight) 
					{
						this.visible = true;
						this.dispatchRenderEvents();
						return;
					}
					BorderLayout(this.layout).resizeCenterStack();
					this.setFlag("childResize");
					if(this.noChildResizing()) 
					{
						this.visible = true;
						this.dispatchRenderEvents();
					}
				}
				else
				{
					this.setFlag("childResize")
				}
			}
		}
		
		/**
		 * @private 
		 */
		override protected function handleChildResize(event:RendererEvent):void
		{
			var container:Container = Container(event.currentTarget);
			var layout:ILayoutStrategy = container.layout;
			if((layout is HLayout && event.widthChange) || (layout is VLayout && event.heightChange))
			{
				this.updateRenderStatus();
			}
		}
	}
}
