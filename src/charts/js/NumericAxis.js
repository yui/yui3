/**
 * NumericAxis draws a numeric axis.
 *
 * @class NumericAxis
 * @constructor
 * @extends Axis
 * @uses NumericImpl
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-display 
 */
Y.NumericAxis = Y.Base.create("numericAxis", Y.Axis, [Y.NumericImpl]);

