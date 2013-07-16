YUI Test Change History
=======================

@VERSION@
------

* No changes.

3.10.3
------

* No changes.

3.10.2
------

* No changes.

3.10.1
------

* No changes.

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* No changes.

3.8.1
-----

* No changes.

3.8.0
-----

* No changes.

3.7.3
-----

* No changes.

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

* No changes.

3.6.0
-----

  * No changes.

3.5.1
-----

  * No changes.

3.5.0
-----

  * No changes.

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * Added output for ignored tests to console. (trac# 2529195)
  * Updated resume() to throw an error if not waiting.

3.2.0
-----

  * Fixed issue where top-level test suite objects didn't go through proper lifecycle
  * Made Y.Test.Runner a singleton (only one instance exists per page regardless of Y objects).
  * Reverted ObjectAssert.hasKey() to also check for prototype property.
  * Fixed API documentation bugs.

3.1.1
-----
  * No changes.

3.1.0
-----

  * Added JUnit XML test results format.
  * Added TAP test results format.
  * Added getResults() method on TestRunner.
  * Added isRunning() method on TestRunner.
  * Added getName()/setName() method on TestRunner.
  * Added coverage support, including getCoverage() on TestRunner and CoverageFormat.
  * Changed master suite default name to be "yuitests" plus a timestamp.
  * Added test duration tracking.
  * Updated JUnit XML test format with time information.
  * Changed functionality of TestRunner when there's only one suite to run. Internally, the TestRunner uses
    a TestSuite to manage everything added via add(). Previously, this test suite was always represented
    in the results. Now, if you've only added one TestSuite to the TestRunner via add(), the specified
    TestSuite becomes the root. This may affect the reporting of test results if you're using TestReporter.
    To run tests in the old way, call TestRunner.run(true).
  * Added styles for console. (trac #2528275).

3.0.0
-----

  * Added missing space in assert failure message (trac #2528058).
  * Fixed ArrayAssert errors (trac #2528142).
  * Failed tests now output "failed" into the log (trac #2527916).
  * Added chainability for the add() method on Y.Test.Runner and Y.Test.Suite (trac #2527899).

3.0.0b1
-------

  * Changed component name to "test" from "yuitest".
  * Fixed bug in Y.Mock.Value() where omitting second argument caused an error.
  * Removed dependencies on Y.Object.owns().
  * Fixed bug in Y.Mock.Value() that resulting in multiple calls to the same verification to include old information.
  * Fixed bug in mock objects where a mock method called asynchronously (via timeout or XHR callback) could throw an error up to the browser and cause the test to incorrectly be marked as passing.
  * Renamed Y.ObjectAssert.has() to Y.ObjectAssert.hasKey() to better match Y.Object.hasKey().
  * Removed Y.ObjectAssert.hasAll() and replaced with Y.ObjectAssert.hasKeys() to better match Y.Object.hasKey().
  * Renamed Y.ObjectAssert.owns() to Y.ObjectAssert.ownsKey() to better match Y.Object.hasKey().
  * Removed Y.ObjectAssert.ownsAll() and replaced with Y.ObjectAssert.ownsKeys() to better match Y.Object.hasKey().
  * Added unit tests for mock and object asserts.
  * Added Y.assert() and Y.fail().
  * Added Y.ObjectAssert.ownsNoKeys() (trac# 2527849).
  * Added proper XML escaping to Y.Test.Format.XML.
  * Fixed this._form is undefined error in TestReporter (trac# 2527928).

3.0.0PR2
--------

  * Initial port from 2.x version
  * Introduction of mock objects (Y.Mock())
  * Event simulation moved to Y.Event.simulate() (no longer part of Test component)
