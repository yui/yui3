package com.yahoo.display
{
	import flash.display.DisplayObject;

	/**
	 * Interface implemented by classes that set up a template for 
	 * easily returning a pre-defined <code>DisplayObject</code> instance that
	 * can be used a background or overlay.
	 */
	public interface ISkinFactory
	{
		/**
		 * Properties used to define a template for skin instances.
		 */
		function get props():Object;

		/**
		 * @private (setter)
		 */
		function set props(value:Object):void;

		/**
		 * Styles used to define a template for skin instances.
		 */
		function get styles():Object;

		/**
		 * @private (setter)
		 */
		function set styles(value:Object):void;

		/**
		 * Creates a template by setting all properties, styles and methods 
		 * necessary for returning a pre-defined <code>DisplayObject</code> instance.
		 */
		function createTemplate(props:Object, value:Object):void;
		
		/**
		 * Returns a custom <code>DisplayObject</code> instance based on a 
		 * pre-defined template.
		 */
		function getSkinInstance():DisplayObject;
	}
}
