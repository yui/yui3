package com.yahoo.infographics.data.events
{
	import flash.events.Event;	
	
	/**
	 * The <code>DataEvent</code> class defines events for chart data classes.
	 * 
	 * These events include the following:
	 * <ul>
	 * <li><code>DataEvent.NEW_DATA</code>: Fired after the <code>data</code> property is set.</li>
	 * <li><code>DataEvent.DATA_CHANGE</code>: Fired after a change is made to the <code>data</code> property.</li>
	 * </ul>
	 *
	 * @see com.yahoo.infographics.data.ChartDataProvider
	 * @see com.yahoo.infographics.data.AxisData
	 *
	 * @langversion 3.0
	 * @playerversion Flash 9.0.28.0
	 */
	public class DataEvent extends Event
	{
	 //--------------------------------------	
	 //  Constants
	 //--------------------------------------	
		
		/**
		 * Defines the value of the <code>type</code> property of a <code>newData</code>
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
         * @eventType newData
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */
		public static const NEW_DATA:String = "newData";

		/**
		 * Defines the value of the <code>type</code> property of a <code>dataChange</code>
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
         * @eventType dataChange
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */
		public static const DATA_CHANGE:String = "dataChange";
		
	//--------------------------------------
	//  Constructor
	//--------------------------------------

		/**
		 * Constructor. Creates a new DataEvent object with the specified parameters.
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
		public function DataEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false)
		{
			super(type, bubbles, cancelable);
		}

	//--------------------------------------
	// Public Properties
	//--------------------------------------		

		/**
		 * Hash of added keyed arrays.
		 */
		public var keysAdded:Object;
		
		/**
		 * Hash of removed keyed arrays.
		 */
		public var keysRemoved:Object;

		/**
		 * Hash of changed keyed arrays.
		 */
		public var keysChanged:Object;

	//--------------------------------------
	// Public Methods
	//--------------------------------------		
		
		/**
		 * Creates a copy of the DataEvent object and sets the value of each parameter to match
		 * the original.
		 *
		 * @return A new DataEvent object with parameter values that match those of the original.
		 *
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		override public function clone():Event
		{
			return new DataEvent(this.type, this.bubbles, this.cancelable);
		}
	}
}
