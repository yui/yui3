/**
 * StackedAxis draws a stacked numeric axis for a chart.
 *
 * @class StackedAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters.
 * @extends NumericAxis
 * @uses StackedImpl
 * @submodule axis-display 
 */
Y.StackedAxis = Y.Base.create("stackedAxis", Y.NumericAxis, [Y.StackedImpl]);

