/**
 * NumericAxisBase is an abstract class that manages numeric data for an axis.
 *
 * @submodule axis-base 
 * @class NumericAxisBase
 * @constructor
 * @extends AxisBase
 * @uses NumericImpl 
 */
Y.NumericAxisBase = Y.Base.create("numericAxisBase", Y.AxisBase, [Y.NumericImpl]);
