package com.yahoo.renderers.styles
{
	import flash.events.IEventDispatcher;
	
	/**
	 * Defines properties and methods for style classes.
	 */
	public interface IStyle extends IEventDispatcher 
	{
		/**
		 * Gets a style value based on a property name.
		 */
		function getStyle(style:String):Object;
		
		/**
		 * Sets a property on the style object
		 */
		function setStyle(style:String, value:Object):void;
			
		/**
		 * Returns an object containing all properties of the style class.
		 */
		function getStyles():Object;
		
		/**
		 * Sets properties of style class based on key value pairs.
		 */
		function setStyles(styles:Object):void;
	}
}
