/**
 * NumericAxis draws a numeric axis.
 *
 * @submodule axis-display 
 * @class NumericAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Axis.
 * @extends Axis
 * @uses NumericImpl
 */
Y.NumericAxis = Y.Base.create("numericAxis", Y.Axis, [Y.NumericImpl]);

