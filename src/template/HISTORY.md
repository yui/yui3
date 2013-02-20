Template Change History
=======================

3.8.1
-----

* The number 0 (as opposed to the string "0") is no longer treated as an empty
  value by Template.Micro. [Ticket #2533040]

* Fixed a bug in Template.Micro that caused control characters like `\n` in
  template strings to be improperly escaped in the compiled template.

* Added the concept of default options to `Y.Template` via the following
  constructor signature: `Y.Template(engine, defaults)`.


3.8.0
-----

* Initial release.
