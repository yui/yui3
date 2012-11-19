/**
 * StackedAxis draws a stacked numeric axis for a chart.
 *
 * @submodule charts-base
 * @class StackedAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Axis. 
 * @extends NumericAxis
 * @uses StackedData
 */
Y.StackedAxis = Y.Base.create("stackedAxis", Y.NumericAxis, [Y.StackedData]);

