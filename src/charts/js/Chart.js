/**
 * The Chart class is the basic application used to create a chart.
 *
 * @class Chart
 * @constructor
 * @submodule charts-base
 */
function Chart(cfg)
{
    if(cfg.type !== "pie")
    {
        return new Y.CartesianChart(cfg);
    }
    else
    {
        return new Y.PieChart(cfg);
    }
}
Y.Chart = Chart;
