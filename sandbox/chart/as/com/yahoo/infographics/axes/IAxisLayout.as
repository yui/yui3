package com.yahoo.infographics.axes
{
	import flash.geom.Point;
	import flash.events.IEventDispatcher;
	import com.yahoo.renderers.events.RendererEvent;

	/**
	 * Interface for calculating coordinates for contents of an axis.
	 * @see com.yahoo.infographics.axes.TopAxisLayout
	 * @see com.yahoo.infographics.axes.BottomAxisLayout
	 * @see com.yahoo.infographics.axes.LeftAxisLayout
	 * @see com.yahoo.infographics.axes.RightAxisLayout
	 */
	public interface IAxisLayout extends IEventDispatcher
	{
		/**
		 * Determines how the width and height are calculated.
		 */
		function get sizeMode():String;

		/**
		 * Returns the greatest width of a label on the axis.
		 */
		function get maxLabelWidth():Number

		/**
		 * Returns the greatest height of a label on the axis.
		 */
		function get maxLabelHeight():Number

		/**
		 * Returns the position of all content in relation to the Axis.
		 */
		function get contentPosition():Point

		/**
		 * The total width of axis content
		 */
		function get contentWidth():Number

		/**
		 * The total height of axis content
		 */
		function get contentHeight():Number
		
		/**
		 * Indicates how to include tick lenght in the size calculation of an
		 * axis. If set to true, the length of the tick is used to calculate
		 * this size. If false, the offset of tick will be used.
		 */
		function get calculateSizeByTickLength():Boolean

		/**
		 * @private (setter)
		 */
		function set calculateSizeByTickLength(value:Boolean):void

		/**
		 * Indicates the start point of the axis line
		 */
		function get lineStart():Point

		/**
		 * Indicate the end point of the axis line
		 */
		function get lineEnd():Point

		/**
		 * Returns the distance between the first and last data points.
		 */
		function get length():Number

		/**
		 * Calculates the coordinates for the first point on an axis.
		 */
		function getFirstPoint():Point

		/**
		 * Returns the next majorUnit point.
		 */
		function getNextPoint(point:Point, majorUnitDistance:Number):Point
		
		/**
		 * Calculates the coordinates for the last point on an axis.
		 */
		function getLastPoint():Point
		
		/**
		 * Calculates the start and end point coordinates for a tick.
		 */
		function getTickCoords(point:Point):Object
		
		/**
		 * Calculates the point for a label.
		 */
		function getLabelPoint(point:Point):Point
		
		/**
		 * Calculates the position of a point on the axis.
		 */
		function getPosition(point:Point):Number

		/**
		 * Calculates <code>contentPosition</code> based on layout type.
		 */
		function updateContentPosition(width:Number, height:Number):void
		
		/**
		 * Resets <code>maxLabelWidth</code> and <code>maxLabelHeight</code> to zero.
		 */
		function reset(ticks:Object, dimensions:Object):void
	}
}
