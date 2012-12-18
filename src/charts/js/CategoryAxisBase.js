/**
 * CategoryAxisBase is an abstract class that manages numeric data for an axis.
 *
 * @submodule axis-base 
 * @class CategoryAxisBase
 * @constructor
 * @extends AxisBase
 * @uses CategoryImpl 
 */
Y.CategoryAxisBase = Y.Base.create("categoryAxisBase", Y.AxisBase, [Y.CategoryImpl]);
