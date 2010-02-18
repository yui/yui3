package com.yahoo.renderers.events
{
	import flash.events.Event;	
	
	/**
	 * The <code>StyleEvent</code> class defines events for Style objects.
	 * 
	 * These events include the following:
	 * <ul>
	 * <li><code>StyleEvent.STYLE_CHANGE</code>: Fired after a property is changed on the class instance.</li>
	 * </ul>
	 *
	 * @see com.yahoo.styles.IStyle
	 *
	 * @langversion 3.0
	 * @playerversion Flash 9.0.28.0
	 */
	public class StyleEvent extends Event
	{
	 //--------------------------------------	
	 //  Constants
	 //--------------------------------------	
		
		
		/**
		 * Defines the value of the <code>type</code> property of a <code>styleChange</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>item</code></td><td>A reference to the data that belongs to the renderer.
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType styleChange
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */
		public static const STYLE_CHANGE:String = "styleChange";		

		
	//--------------------------------------
	//  Constructor
	//--------------------------------------

		/**
		 * Constructor. Creates a new StyleEvent object with the specified parameters.
		 * 
         * @param type The event type; this value identifies the action that caused the event.
         *
         * @param bubbles Indicates whether the event can bubble up the display list hierarchy.
         *
         * @param cancelable Indicates whether the behavior associated with the event can be
		 *        prevented.
         *
		 * @param style Indicates the property that has changed. Has old and new attributes
		 * 		  to reflect the old and new values.
		 *
		 * @param styles Indicates the styles that have been changed. Has an object for each 
		 * 		  property that has changed which includes an old and new attribute to reflect
		 *		  the old and new values.
		 *
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		public function StyleEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, style:Object = null, styles:Array = null)
		{
			super(type, bubbles, cancelable);
			this.style = style;
			this.styles = styles;
		}
		
	//--------------------------------------
	// Properties
	//--------------------------------------
	
		/**
		 * A hash containing the following data:
		 * <ul>
		 * 	<li><code>style</code>: The property that has changed.</li>
		 *  <li><code>oldValue</code>: The previous value of the property.</li>
		 *  <li><code>newValue</code>: The new value of the property.</li>
		 * </ul>
		 */
		public var style:Object = null;
		
		/**
		 * A list of hashes representing each property that has been changed.
		 * Each has contains the following data:
		 * <ul>
		 * 	<li><code>style</code>: The property that has changed.</li>
		 *  <li><code>oldValue</code>: The previous value of the property.</li>
		 *  <li><code>newValue</code>: The new value of the property.</li>
		 * </ul>
		 */
		public var styles:Array = null;
		
		
	//--------------------------------------
	// Public Methods
	//--------------------------------------		
		
		/**
		 * Creates a copy of the StyleEvent object and sets the value of each parameter to match
		 * the original.
		 *
		 * @return A new StyleEvent object with parameter values that match those of the original.
		 *
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		override public function clone():Event
		{
			return new StyleEvent(this.type, this.bubbles, this.cancelable, this.style, this.styles);
		}
	}
}
