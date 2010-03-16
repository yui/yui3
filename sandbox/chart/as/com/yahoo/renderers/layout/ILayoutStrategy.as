package com.yahoo.renderers.layout
{
	import com.yahoo.renderers.styles.IStyle;
	import flash.utils.Dictionary;	
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.events.IEventDispatcher;

	public interface ILayoutStrategy extends IEventDispatcher 
	{
		/**
		 * Reference to the style class
		 */
		function get styles():IStyle
		
		/**
		 * Gets or sets the renderer that in which to apply
		 * a layout strategy for.
		 */
		function get container():Container;

		/**
	     * @private (setter)
		 */
		function set container(value:Container):void;

		/**
		 * Total width of all children, padding and gaps.
		 */
		function get contentWidth():Number;

		/**
		 * Total height of all children, padding and gaps.
		 */
		function get contentHeight():Number;

		/**
		 * Collection of renderers to be displayed.
		 */
		function get items():Array;
		
		/**
		 * @private (setter)
		 */		
		function set items(value:Array):void;
		
		/**
		 * A hash of properties that trigger a layout.
		 */
		function get layoutFlags():Object;

		/**
		 * Indicates whether to stretch children to fit the available area
		 */
		function get stretchChildrenToFit():Boolean;

		/**
		 * @private (protected)
		 */
		function set stretchChildrenToFit(value:Boolean):void;
		
		/**
		 * A <code>DisplayObject</code> indexed hash that returns data
		 * corresponding to the <code>DisplayObject that may be used by 
		 * layout algorithms.
		 */
		function get childData():Dictionary;
		
		/**
		 * Default <code>sizeMode</code> value for the layout
		 */
		function get sizeMode():String;

		/**
		 * Algorithm for positioning visual objects of the container.
		 */
		function layoutChildren():void;
		
		/**
		 * Returns the item at the specified location.
		 */
		function getItemAt(index:int):DisplayObject;

		/**
		 * Adds a renderer to the layout class.
		 */		
		function addItem(value:DisplayObject, props:Object = null):void;
		
		/**
		 * Removes a renderer from the layout class.
		 */		
		function removeItem(value:DisplayObject):void;
		
		/**
		 * Removes a renderer from the layout class.
		 */		
		function removeItemAt(index:int):void;
		
		/**
		 * Removes all renderers from the layout class.
		 */		
		function removeAll():void;
	
		/**
		 * Calculate measurements for child content.
		 */
		function measureContent():void;
	}
}
