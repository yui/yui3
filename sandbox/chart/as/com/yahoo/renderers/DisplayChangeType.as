package com.yahoo.renderers
{
	/**
	 * The DisplayChangeType class defines <code>DisplayChangeType</code> constants 
	 * that are used to specify what actions should be taken in a <code>render()</code>
	 *
	 * @langversion 3.0
	 * @playerversion Flash 9.0.28.0
	 */
	public class DisplayChangeType
	{
		/**
		 * Flag indicating a resize has occurred.
		 */
		public static const RESIZE:String = "resize";

		/**
		 * Flag indicating as layout change has occurred.
		 */
		public static const LAYOUT:String = "layout";

		/**
		 * Flag indicating a style change.
		 */
		public static const STYLES:String = "styles";

		/**
		 * Flag indicating an image load has been called.
		 */
		public static const LOAD:String = "load";

		/**
		 * Flag indicating an image has been successfully been uploaded.
		 */
		public static const IMAGE_LOADED:String = "imageLoaded";

		/**
		 * Indicates a <code>sizeMode</code> change.
		 */
		public static const SIZE_MODE:String = "sizeMode";
	}
}


