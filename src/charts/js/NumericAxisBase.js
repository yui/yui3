/**
 * NumericAxisBase is an abstract class that manages numeric data for an axis.
 *
 * @class NumericAxisBase
 * @constructor
 * @extends AxisBase
 * @uses NumericImpl 
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-base 
 */
Y.NumericAxisBase = Y.Base.create("numericAxisBase", Y.AxisBase, [Y.NumericImpl]);
