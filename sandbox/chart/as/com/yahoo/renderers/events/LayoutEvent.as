package com.yahoo.renderers.events
{
	import flash.events.Event;	
	
	/**
	 * The <code>LayoutEvent</code> class defines events for Layout objects.
	 * 
	 * These events include the following:
	 * <ul>
	 * <li><code>LayoutEvent.CONTENT_WIDTH_UPDATE</code>: Fired after the <code>contentWidth</code> is updated.</li>
	 * <li><code>LayoutEvent.CONTENT_HEIGHT_UPDATE</code>: Fired after the <code>contentHeight</code> is updated.</li>
	 * </ul>
	 *
	 * @see com.yahoo.renderers.layout.ILayoutStrategy
	 *
	 * @langversion 3.0
	 * @playerversion Flash 9.0.28.0
	 */
	public class LayoutEvent extends Event
	{
	 //--------------------------------------	
	 //  Constants
	 //--------------------------------------	
		
		/**
		 * Defines the value of the <code>type</code> property of a <code>contentWidthUpdate</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType contentWidthUpdate
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */
		public static const CONTENT_WIDTH_UPDATE:String = "contentWidthUpdate";

		/**
		 * Defines the value of the <code>type</code> property of a <code>contentHeightUpdate</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType contentHeightUpdate
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */
		public static const CONTENT_HEIGHT_UPDATE:String = "contentHeightUpdate";

		/**
		 * Defines the value of the <code>type</code> property of a <code>redraw</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType redraw
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */
		public static const REDRAW:String = "redraw";

		/**
		 * Defines the value of the <code>type</code> property of a <code>layoutComplete</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType layoutComplete
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */
		public static const LAYOUT_COMPLETE:String = "layoutComplete";
	//--------------------------------------
	//  Constructor
	//--------------------------------------

		/**
		 * Constructor. Creates a new LayoutEvent object with the specified parameters.
		 * 
         * @param type The event type; this value identifies the action that caused the event.
         *
         * @param bubbles Indicates whether the event can bubble up the display list hierarchy.
         *
         * @param cancelable Indicates whether the behavior associated with the event can be
		 *        prevented.
         *
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		public function LayoutEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false)
		{
			super(type, bubbles, cancelable);
		}

	//--------------------------------------
	// Public Methods
	//--------------------------------------		
		
		/**
		 * Creates a copy of the LayoutEvent object and sets the value of each parameter to match
		 * the original.
		 *
		 * @return A new LayoutEvent object with parameter values that match those of the original.
		 *
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		override public function clone():Event
		{
			return new LayoutEvent(this.type, this.bubbles, this.cancelable);
		}
	}
}
