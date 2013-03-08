DataBind
=========

DataBind provides the `Y.DataBind` class to bind attributes to form elements.

The class may be used standalone, or as a class extension, and provides the
methods `_bindAttr`, `_bindAttrs`, `_unbindAttr`, and `_unbindAttrs`. When used
as a standalone class, these methods are mirrored as public versions without
the leading underscore (e.g. `bindAttr`).

`_bindAttr` (or its public counterpart `bindAttr` in standalone mode) binds an
attribute to a DOM element or set of DOM elements. When the
attribute is changed, the DOM element(s) will be updated, and when the DOM
element is changed _by user action_, the attribute will be updated.

The basic form of this method is `binder._bindAttr('foo', '#fooField');`,
but a configuration object can be passed as a second argument for more
control.

Extracting and assigning values from and to an element is automatically
determined by the type of DOM element, but can be overridden by configuring
the binding with `getter` and `setter` functions. If the value itself
should be represented in the DOM differently than in the attribute,
configure the binding with `parser` and `formatter` functions.

Available bind configurations are:

```
{
    field: <selector string, Node, or NodeList>,
    getter: function (node) { <code to get a value from node> },
    setter: function (node, value) { <... to set a value in node> },
    formatter: function (value) { <massage value for display in DOM> },
    parser: function (value) { <extract raw value from DOM value> }
}
```
