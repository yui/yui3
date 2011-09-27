Charts Change History
=====================

3.4.1
-----

  * #2531234 Fixed issue in which axis titles were not positioned properly in IE 6 and 7.
  * #2531233 Fixed issue in which axis line and tick styles were overriding each other.
  * #2531232 Fixed issue in which inner axis ticks did not display.
  * #2531231 Fixed issue in which the top axis line was not positioned properly. 
  * #2530109 Fixed issue in which the NumericAxis roundingMethod was not always being respected when a number was specified.
  * #2531100 Fixed issue in which the NumericAxis was not correctly calculating its data range when a minimum or maximum was explicitly set.
  * #2530127 Added originEvent, pageX and pageY properties to the event facade for marker and planar events.
  * #2530591 Added ability to accept custom series classes.
  * #2530592 Fixed errors resulting from empty series.
  * #2530810 Removed hard-coded class prefixes.
  * #2530908 Fixed issue in which the NumericAxis was not respecting explicitly set minimum and maximum values in some cases.
  * #2530969 Ensure underlying dom nodes of markers have unique ids.
  * #2530984 Fixed issue in which PieChart was not resizing properly.
  * #2531024 Fixed issue in which PieChart did not draw from center when width and height were not equal.
  * #2530985 Fixed issue in which PieChart failed to always render in MSIE 8.
  * #2531020 Fixed issue in which gridlines could be hidden by other elements.
  * #2531040 Fixed issue in which missing data broke stacked histograms.
  * #2531071 Fixed issue in which charts would not render if one of the series was empty.

3.4.0
-----

  * Charts only requires datatype-number and datatype-date instead of the datatype rollup. 
  * #2530413 Position axis labels with transform instead of css styles.   
  * #2530533 Fixed issue in which stacked bar/column displayed inaccurated data on mouseover when zero values appeared in the series.  
  * #2530404 Fix issue in which markers were incorrectly omitted from graphs.   
  * #2530395 SplineSeries extends LineSeries instead of CartesianSeries. 
  * #2529841 Add axis title.  
  * #2530143 Refactor to use Graphics API
  * #2530223 Fixed bug in which negative value markers were not displayed in column/bar series.
  * #2529849 Fixed styles documentation bug
  * #2530115 Fixed bug preventing tooltip's node from being overwritten.
  * #2529972 Fixed issue in which zero/null values were falsely creating markers in stacked bar and column series.
  * #2529926 Fixed issue in which null values were being treated as zero.
  * #2529925 Fixed bug in which dashed line was not drawn in combo and line series.
  * #2529926 Fixed issue in which null values in data provider are treated as 0.
  * #2529927 Addressed issue in which primitive value strings were not being parsed correctly in the TimeAxis.
  * #2529971 Force range on a NumericAxis when all values are zero.
  * #2529842 Ensure Numeric axis has at least on negative and positive tick when minimum is less than zero and maximum is greater than zero.
  * #2529840 Changed stacked bar and column series to handle cases in which the item value is at or rounded to zero.

3.3.0
-----

  * Initial release.
