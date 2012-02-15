var PieChartLegend = Y.Base.create("pieChartLegend", Y.PieChart, [], {
    /**
     * Redraws the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        var graph = this.get("graph"),
            w = this.get("width"),
            h = this.get("height"),
            legend = this.get("legend"),
            x = 0,
            y = 0,
            legendX = 0,
            legendY = 0,
            legendWidth,
            legendHeight,
            dimension,
            gap;
        if(graph)
        {
            if(legend)
            {
                legendWidth = legend.get("width");
                legendHeight = legend.get("height");
                gap = legend.get("styles").gap;
                switch(legend.get("position"))
                {
                    case LEFT :
                        legendWidth += gap;
                        dimension = Math.min(w - legendWidth, h);
                        legendHeight = dimension;
                        x = legendWidth;
                    break;
                    case TOP :
                        legendHeight += gap;
                        dimension = Math.min(h - legendHeight, w); 
                        legendWidth = dimension;
                        y = legendHeight;
                    break;
                    case RIGHT :
                        legendWidth += gap;
                        dimension = Math.min(w - legendWidth, h);
                        legendHeight = dimension;
                        legendX = dimension + gap;
                    break;
                    case BOTTOM :
                        legendHeight += gap;
                        dimension = Math.min(h - legendHeight, w); 
                        legendWidth = dimension;
                        legendY = dimension + gap; 
                    break;
                }
            }
            else
            {
                graph.set(_X, 0);
                graph.set(_Y, 0);
                graph.set(WIDTH, w);
                graph.set(HEIGHT, h);
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._redraw();
            return;
        }
        if(graph)
        {
            graph.set(_X, x);
            graph.set(_Y, y);
            graph.set(WIDTH, dimension);
            graph.set(HEIGHT, dimension);
            legend.set(_X, legendX);
            legend.set(_Y, legendY);
            legend.set(WIDTH, legendWidth);
            legend.set(HEIGHT, legendHeight);
        }
    }
}, {
    ATTRS: {
        /**
         * The legend for the chart.
         *
         * @attribute
         * @type Legend
         */
        legend: LEGEND
    }
});
Y.PieChart = PieChartLegend;
