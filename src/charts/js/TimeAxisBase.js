/**
 * TimeAxisBase manages time data for an axis.
 *
 * @submodule axis-base 
 * @class TimeAxisBase
 * @constructor
 * @extends AxisBase
 * @uses TimeImpl 
 */
Y.TimeAxisBase = Y.Base.create("timeAxisBase", Y.AxisBase, [Y.TimeImpl]);
