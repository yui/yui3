package com.yahoo.infographics.series
{
	import com.yahoo.infographics.data.AxisData;
	import com.yahoo.infographics.cartesian.Graph;

	public interface ISeries
	{
		/**
		 * <code>AxisData</code> instance that contains data for the x axis.
		 */
		function get xAxisData():AxisData;

		/**
		 * @private (setter)
		 */
		function set xAxisData(value:AxisData):void;

		/**
		 * <code>AxisData</code> instance that contains data for the y axis.
		 */
		function get yAxisData():AxisData;

		/**
		 * @private (setter)
		 */
		function set yAxisData(value:AxisData):void;
		
		/**
		 * Type of series to display:
		 *	<ul>
		 *		<li><code>category</code>: the category data for the chart. Contains no styles as they
		 * are all determined by value series. On a bar chart, the category series reflects data on the y axis. 
		 * For a column chart, the x axis. A line chart could have a category axis for either but usually 
		 * reflects data for the x axis. The category series will define the direction for a graph.</li>
		 *		<li><code>line</code>: value data associated with a line graph.</li>
		 *		<li><code>plot</code>: value data associated with plot graph.</li>
		 *		<li><code>column</code>:value data associated with a column graph.</li>
		 *		<li><code>bar</code>: value data associated with bar graph.</li>
		 *	</ul>
		 */
		function get type():String;

		/**
		 * @private (setter)
		 */
		function set type(value:String):void;
		
		/**
		 * The key value from an <code>AxisData</code> to use for plotting x coordinates.
		 */
		function get xKey():String;

		/**
		 * @private (setter)
		 */
		function set xKey(value:String):void;

		/**
		 * The key value from an <code>AxisData</code> to use for plotting y coordinates.
		 */
		function get yKey():String;

		/**
		 * @private (setter)
		 */
		function set yKey(value:String):void;

		/**
		 * Zero-based index reflecting the number of items of the same series type in a given graph.
		 */
		function get length():int;

		/**
		 * Zero-based index reflecting the position of the given series in relation to its <code>length</code>.
		 */
		function get order():int;

		/**
		 * @private (setter)
		 */
		function set order(value:int):void;

		/**
		 * coordinates for the series.
		 */
		function get xcoords():Vector.<int>;

		/**
		 * @private (setter)
		 */
		function set xcoords(value:Vector.<int>):void;
		
		/**
		 * y coordinates for the series.
		 */
		function get ycoords():Vector.<int>;
		
		/**
		 * @private (setter)
		 */
		function set ycoords(value:Vector.<int>):void;
		
		/**
		 * Reference to graph that the series is bound to
		 */
		function get graph():Graph;

		/**
		 * @private (setter)
		 */
		function set graph(value:Graph):void;

		/**
		 */
		function get graphOrder():int;

		/**
		 * @private (setter)
		 */
		function set graphOrder(value:int):void;
	}
}
