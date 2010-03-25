package com.yahoo.renderers.layout
{
	import com.yahoo.renderers.Renderer;

	/**
	 * Interface for renderer layout managers.
	 */
	public interface IContainer
	{
		/**
		 * Strategy for positioning of children.
		 */
		function get layout():ILayoutStrategy;

		/**
		 * @private (setter)
		 */
		function set layout(value:ILayoutStrategy):void;
		
		/**
		 * Adds a renderer to the layout class.
		 */		
		function addItem(value:Renderer, props:Object = null):void;
		
		/**
		 * Removes a renderer from the layout class.
		 */		
		function removeItem(value:Renderer):void;
		
		/**
		 * Removes a renderer from the layout class.
		 */		
		function removeItemAt(index:int):void;
		
		/**
		 * Removes all renderers from the layout class.
		 */		
		function removeAll():void;
	}
}
