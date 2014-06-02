Template Change History
=======================

3.17.2
------

* No changes.

3.17.1
------

* No changes.

3.17.0
------

* No changes.

3.16.0
------

* No changes.

3.15.0
------

* No changes.

3.14.1
------

* No changes.

3.14.0
------

* No changes.

3.13.0
------

* No changes.

3.12.0
------

* Added central template registry. The template registry decouples making
  templates available from invoking a template to render it. This central
  registry and abstraction of templates to names separates concerns, creates a
  level of indirection, and enables templates to be easily overridden.
  ([#1021][])

[#1021]: https://github.com/yui/yui3/issues/1021

3.11.0
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

* The number 0 (as opposed to the string "0") is no longer treated as an empty
  value by Template.Micro. [Ticket #2533040]

* Fixed a bug in Template.Micro that caused control characters like `\n` in
  template strings to be improperly escaped in the compiled template.

* Added the concept of default options to `Y.Template` via the following
  constructor signature: `Y.Template(engine, defaults)`.


3.8.0
-----

* Initial release.
