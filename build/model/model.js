YUI.add('model', function (Y, NAME) {

/**
Attribute-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

@module app
@submodule model
@since 3.4.0
**/

/**
Attribute-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

In most cases, you'll want to create your own subclass of `Y.Model` and
customize it to meet your needs. In particular, the `sync()` and `validate()`
methods are meant to be overridden by custom implementations. You may also want
to override the `parse()` method to parse non-generic server responses.

@class Model
@constructor
@extends Base
@since 3.4.0
**/
var Model = Y.Base.create('model', Y.Model.Base, [Y.Model.Observable]);

// -- Namespace ----------------------------------------------------------------
Y.Model = Y.mix(Model, Y.Model, true);


}, '@VERSION@', {"requires": ["base-build", "model-base", "model-observable"]});
