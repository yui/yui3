function LineSeries(config)
{
	LineSeries.superclass.constructor.apply(this, arguments);
}

LineSeries.name = "lineSeries";

LineSeries.ATTRS = {
	type: {
		/**
		 * Indicates the type of graph.
		 */
		getter: function()
		{
			return this._type;
		}
	}
};

Y.extend(LineSeries, Y.CartesianSeries, {
	/**
	 * @private
	 * Default styles for the series.
	 */
	_styles: {
		color: "#000000",
		alpha: 1,
		weight: 1,
		marker: {
			fillColor: "#000000",
			alpha: 1,
			weight: 1
		},
		showMarkers: false,
		showLines: true,
		lineType:"solid", 
		dashLength:10, 
		gapSpace:10, 
		connectDiscontinuousPoint:true, 
		discontinuousType:"dashed", 
		discontinuousDashLength:10, 
		discontinuousGapSpace:10,
		padding:{
			top: 0,
			left: 0,
			right: 0,
			bottom: 0
		}
	},

	/**
	 * @private (protected)
	 */
	_type: "line",
	
	/**
	 * @private (override)
	 */
	checkStyleFlags: function()  
	{
		return this.checkFlags({
			color:true,
			weight:true,
			alpha:true,	
			type:true,
			marker:true,
			dashLength:true,
			gapLength:true,
			connectDiscontinuousPoints:true,
			discontinuousType:true,
			discontinuousDashLength:true,
			discontinuousGapLength:true
		});
	},

	/**
	 * @private
	 */
	drawGraph: function()
	{
		var styles = this.get("styles");
		if(styles.showLines) 
		{
			this.drawLines();
		}
		if(styles.showMarkers) 
		{
	//		this.drawMarkers();
		}
	},

	/**
	 * @protected
	 */
	drawLines: function()
	{
		if(this._xcoords.length < 1) 
		{
			return;
		}
		var	parentDiv = this.get("parent"),
            ht = parentDiv.offsetHeight,
            xcoords = this._xcoords,
			ycoords = this._ycoords,
			len = xcoords.length,
			lastX = xcoords[0],
			lastY = ycoords[0],
			lastValidX = lastX,
			lastValidY = lastY,
			nextX,
			nextY,
			i,
			styles = this.get("styles"),
			lineType = styles.lineType,
			dashLength = styles.dashLength,
			gapSpace = styles.gapSpace,
			connectDiscontinuousPoints = styles.connectDiscontinuousPoints,
			discontinuousType = styles.discontinuousType,
			discontinuousDashLength = styles.discontinuousDashLength,
			discontinuousGapSpace = styles.discontinuousGapSpace,
			graphic = this.get("graphic");
        graphic.clear();
        graphic.lineStyle(styles.weight, styles.color);
        graphic.beginFill(styles.color, 0.5);
        graphic.moveTo (lastX, lastY);
        for(i = 1; i < len; i = ++i)
		{
			nextX = xcoords[i];
			nextY = ycoords[i];
			if(isNaN(nextY))
			{
				lastValidX = nextX;
				lastValidY = nextY;
				continue;
			}
			if(lastValidX == lastX)
			{
                if(lineType != "dashed")
				{
                    graphic.lineTo(nextX, nextY);
				}
				else
				{
					this.drawDashedLine(lastValidX, lastValidY, nextX, nextY, 
												dashLength, 
												gapSpace);
				}
			}
			else if(!connectDiscontinuousPoints)
			{
				graphic.moveTo(nextX, nextY);
			}
			else
			{
				if(discontinuousType != "solid")
				{
					this.drawDashedLine(lastValidX, lastValidY, nextX, nextY, 
												discontinuousDashLength, 
												discontinuousGapSpace);
				}
				else
				{
                    graphic.lineTo(nextX, nextY);
				}
			}
		
			lastX = lastValidX = nextX;
			lastY = lastValidY = nextY;
		}
       // graphic.lineStyle(0);
        graphic.lineTo(lastX, ht);
        graphic.lineTo(0, ht);
        graphic.lineTo(0, ycoords[0]);
        graphic.endFill();
	},

	drawMarkers: function()
	{
 	},

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
	drawDashedLine: function(xStart, yStart, xEnd, yEnd, dashSize, gapSize)
	{
		dashSize = dashSize || 10;
		gapSize = gapSize || 10;
		var segmentLength = dashSize + gapSize,
			xDelta = xEnd - xStart,
			yDelta = yEnd - yStart,
			delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),
			segmentCount = Math.floor(Math.abs(delta / segmentLength)),
			radians = Math.atan2(yDelta, xDelta),
			xCurrent = xStart,
			yCurrent = yStart,
			i,
			graphic = this.get("graphic");
		xDelta = Math.cos(radians) * segmentLength;
		yDelta = Math.sin(radians) * segmentLength;
		
		for(i = 0; i < segmentCount; ++i)
		{
			graphic.moveTo(xCurrent, yCurrent);
			graphic.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
			xCurrent += xDelta;
			yCurrent += yDelta;
		}
		
		graphic.moveTo(xCurrent, yCurrent);
		delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
		
		if(delta > dashSize)
		{
			graphic.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
		}
		else if(delta > 0)
		{
			graphic.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
		}
		
		graphic.moveTo(xEnd, yEnd);
	}
});

Y.LineSeries = LineSeries;


		

		
