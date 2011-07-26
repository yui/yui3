Charts Change History
=====================

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
