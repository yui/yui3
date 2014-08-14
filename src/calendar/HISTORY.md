Calendar Change History
=======================

3.17.2
------

* No changes.

3.17.1
------

* No changes.

3.17.0
------

* [#1752][]: Y.Calendar.selectDates fails when passed the maximumDate with minutes/seconds (@mairatma)

[#1752]: https://github.com/yui/yui3/pull/1752

3.16.0
------

* [#1685][]: Can't change month in RTL mode / arrow wrongly displayed in RTL mode ([#1719][] [#1724][]: Andrew Nicols)
* [#1361][]: Change to use CSS instead of the image to showing of the arrow (Marc Lundgren)

[#1724]: https://github.com/yui/yui3/pull/1724
[#1719]: https://github.com/yui/yui3/pull/1719
[#1685]: https://github.com/yui/yui3/issues/1685
[#1361]: https://github.com/yui/yui3/pull/1361

3.15.0
------

* Fix calendar to use `visibility:inherit` instead of `visibility:visible`, for compatibility with overlays. ([#1627][]: @jafl)
* Fix an issue when Feb 1st is Saturday Mar 2nd appears to be selectable. ([#1559][]: @shunner)

[#1627]: https://github.com/yui/yui3/issues/1627
[#1559]: https://github.com/yui/yui3/issues/1559

3.14.1
------

* No changes.

3.14.0
------

* Fix an undeclared variable ([#1307][])

[#1307]: https://github.com/yui/yui3/issues/1307

3.13.0
------

* Fix a issue with cloudn't select a date when passing minimumDate. ([#1030][])
* Removed superfluous strings from Hungarian calendar translations. ([#1054][]: @drjayvee)

[#1030]: https://github.com/yui/yui3/issues/1030
[#1054]: https://github.com/yui/yui3/issues/1054

3.12.0
------

* Added language support for various Chinese regions. ([#1007][]: @shunner)


[#1007]: https://github.com/yui/yui3/issues/1007


3.11.0
------

* Cleaned up lang (see PR #878) [Jeroen Versteeg]:
  * removed unused lang/calendar (only lang/calendar-base is used)
  * removed unused short_weekdays strings from lang/calendar-base
  * replaced weekdays strings from lang/calendar-base with datatype/date-format

* Setting `minimumDate` or `maximumDate` now correctly disables nodes before or
  after those dates. [Arnaud Didry]

* Added Hungarian language support [Gábor Kovács]

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

* Removed unused `substitute` dependency.

3.8.1
-----

* Update calendar navigator controls when minimum or maximum date changes [jafl].

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
  * Bug fixes for 2532262, 2532277, 2531828.
  * Near 100% unit test coverage

3.5.1
-----

  * No changes.


3.5.0 - Updates
---------------
   * Calendar is now keyboard navigable [Ticket #2530348]
   * Calendar skins have been updated [Tickets #2530720, [#2531110, #2531744]
   * Calendar has received accessibility fixes
   * CalendarNavigator plugin has been updated and now supports disabled button states
   * Calendar got multiple new internationalization packages (de, fr, pt-BR, zh-HANT-TW)

3.4.1 - Bug Fix Release
-----------------------

   * Calendar now supports Japanese language internationalization
   * Multiple calendars can now be used on the same page [Ticket #2530925]
   * When individual dates are clicked in Firefox, they are not text-selected [Ticket #2530754]
   * Multiple date selection now works correctly when it spans the Daylight Savings Time change date [Ticket #2530979]
   * A few documentation issues have been fixed [Tickets #2530929 and #2530930]

3.4.0 - Initial release
-----------------------
