package com.yahoo.util
{
	import flash.display.Graphics;
	import flash.geom.Point;
	
	/**
	 * Utility functions for drawing to <code>Graphics</code> objects.
	 * 
	 * @author Josh Tynjala
	 * @see flash.display.Graphics
	 */
	public class GraphicsUtil
	{
		/**
		 * @private
		 * Draws a wedge.
		 * 
		 * @param x				x component of the wedge's center point
		 * @param y				y component of the wedge's center point
		 * @param startAngle	starting angle in degrees
		 * @param arc			sweep of the wedge. Negative values draw clockwise.
		 * @param radius		radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
		 * @param yRadius		[optional] y radius for wedge.
		 */
		public static function drawWedge(target:Graphics, x:Number, y:Number, startAngle:Number, arc:Number, radius:Number, yRadius:Number = NaN):void
		{
			// move to x,y position
			target.moveTo(x, y);
			
			// if yRadius is undefined, yRadius = radius
			if(isNaN(yRadius))
			{
				yRadius = radius;
			}
			
			// limit sweep to reasonable numbers
			if(Math.abs(arc) > 360)
			{
				arc = 360;
			}
			
			// Flash uses 8 segments per circle, to match that, we draw in a maximum
			// of 45 degree segments. First we calculate how many segments are needed
			// for our arc.
			var segs:int = Math.ceil(Math.abs(arc) / 45);
			
			// Now calculate the sweep of each segment.
			var segAngle:Number = arc / segs;
			
			// The math requires radians rather than degrees. To convert from degrees
			// use the formula (degrees/180)*Math.PI to get radians.
			var theta:Number = -(segAngle / 180) * Math.PI;
			
			// convert angle startAngle to radians
			var angle:Number = -(startAngle / 180) * Math.PI;
			
			// draw the curve in segments no larger than 45 degrees.
			if(segs > 0)
			{
				// draw a line from the center to the start of the curve
				var ax:Number = x + Math.cos(startAngle / 180 * Math.PI) * radius;
				var ay:Number = y + Math.sin(-startAngle / 180 * Math.PI) * yRadius;
				target.lineTo(ax, ay);
				
				// Loop for drawing curve segments
				for(var i:int = 0; i < segs; i++)
				{
					angle += theta;
					var angleMid:Number = angle - (theta / 2);
					var bx:Number = x + Math.cos(angle) * radius;
					var by:Number = y + Math.sin(angle) * yRadius;
					var cx:Number = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
					var cy:Number = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
					target.curveTo(cx, cy, bx, by);
				}
				// close the wedge by drawing a line to the center
				target.lineTo(x, y);
			}
		}
		
		/**
		 * Draws a dashed line between two points.
		 * 
		 * @param xStart	The x position of the start of the line
		 * @param yStart	The y position of the start of the line
		 * @param xEnd		The x position of the end of the line
		 * @param yEnd		The y position of the end of the line
		 * @param dashSize	the size of dashes, in pixels
		 * @param gapSize	the size of gaps between dashes, in pixels
		 */
		public static function drawDashedLine(target:Graphics, xStart:Number, yStart:Number, xEnd:Number, yEnd:Number, dashSize:Number = 10, gapSize:Number = 10):void
		{
			// calculate the length of a segment
			var segmentLength:Number = dashSize + gapSize;
			
			// calculate the length of the dashed line
			var xDelta:Number = xEnd - xStart;
			var yDelta:Number = yEnd - yStart;
			var delta:Number = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
			
			// calculate the number of segments needed
			var segmentCount:int = Math.floor(Math.abs(delta / segmentLength));
			
			// get the angle of the line in radians
			var radians:Number = Math.atan2(yDelta, xDelta);
			
			// start the line here
			var xCurrent:Number = xStart;
			var yCurrent:Number = yStart;
			
			// add these to cx, cy to get next seg start
			xDelta = Math.cos(radians) * segmentLength;
			yDelta = Math.sin(radians) * segmentLength;
			
			// loop through each segment
			for(var i:int = 0; i < segmentCount; i++)
			{
				target.moveTo(xCurrent, yCurrent);
				target.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
				xCurrent += xDelta;
				yCurrent += yDelta;
			}
			
			// handle last segment as it is likely to be partial
			target.moveTo(xCurrent, yCurrent);
			delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
			
			if(delta > dashSize)
			{
				// segment ends in the gap, so draw a full dash
				target.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
			}
			else if(delta > 0)
			{
				// segment is shorter than dash so only draw what is needed
				target.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
			}
			
			// move the pen to the end position
			target.moveTo(xEnd, yEnd);
		}

	}
}
