/**
 * StackedAxisBase manages stacked numeric data for an axis.
 *
 * @class StackedAxisBase
 * @constructor
 * @extends AxisBase
 * @uses StackedImpl
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-stacked-base
 */
Y.StackedAxisBase = Y.Base.create("stackedAxisBase", Y.NumericAxisBase, [Y.StackedImpl]);
