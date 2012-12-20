/**
 * Provides functionality for drawing a time axis for use with a chart.
 *
 * @module charts
 * @submodule axis-time
 */
/**
 * TimeAxis draws a time-based axis for a chart.
 *
 * @class TimeAxis
 * @constructor
 * @extends Axis
 * @uses TimeImpl
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-time
 */
Y.TimeAxis = Y.Base.create("timeAxis", Y.Axis, [Y.TimeImpl]);

