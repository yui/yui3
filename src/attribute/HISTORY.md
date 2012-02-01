Attribute Change History
========================

3.5.0
-----

  * Broke Y.Attribute up into:

    - Y.AttributeCore
    - Y.AttributeEvents
    - Y.AttributeExtras

    To support core Attribute usage, without Events, but still allow upgrade 
    path to add Events, if required.

    Y.AttributeCore is likely to form the basis for BaseCore and WidgetCore 
    (ala Node Plugins, where low-level state change events are not required). 

    Y.Attribute's public and protected API reimain unchanged, and loader will
    pull in the new dependencies.

    However if you're manually pulling in attribute-base, you'll need to 
    manually pull in attribute-core, attribute-events and attribute-extras 
    before it.

    **IMPORTANT** AttributeCore, AttributeEvents and AttributeExtras are 
    considered beta, and may be subject to change over the course 
    of the 3.5.0PRS. 

    Y.Attribute will remain unchanged however.

    Summary:

    Y.Attribute     - Common Attribute Functionality (100% backwards compat)
    Y.AttributeCore - Lightest Attribute support, without CustomEvents

    --

    Y.AttributeEvents - Augmentable Attribute Events support
    Y.AttributeExtras - Augmentable 20% usage for Attribute (modifyAttr, removeAttr, reset ...)
    Y.AttributeComplex - Augmentable support for constructor complex attribute parsing ({"x.y":foo})

    --

    Y.Attribute = Y.AttributeCore + Y.AttributeEvents + Y.AttributeExtras

    --

    Modules:

    "attribute-base" : Y.Attribute
    "attribute-core" : Y.AttributeCore

    "attribute-complex" : Y.AttributeComplex mixin (mixed into Y.Attribute)
    "attribute-events" : Y.AttributeEvents mixin
    "attribute-extras" : Y.AttributeExtras mixin

  * Changed State's internal data structure, to store pairs by 
    [name][property], instead of [property][name] to improve performance
    (most Attribute operations are name centric, not property centric).

    If you're working directly with Attribute's private _state.data, you
    may need to update your code to account for the change in structure. 

  * Attribute now passes the attribute name to valueFn, allowing users to
    write shared valueFn impls across attributes.

3.4.1
-----

  * No changes.

3.4.0
-----

  * Added params to constructor, to support call to addAttrs on construction
    with user values, when augmenting and invoking constructor manually.
  
    Also broke out addAttrs logic on construction (introduced for Node),
    into it's own _initAttrs method to facilitate customization.

3.3.0
-----

  * Changed instanceof to Y.instanceOf, to prevent leaks in IE7

3.2.0
-----

  * Added protected helper method (_getAttrCfg) to return the configuration
    for a given attribute. 

3.1.1
-----

  * Fixed ticket #2528753 : Sub attribute value crashed after setting another 
    sub attribute. 

3.1.0
-----

  * writeOnce can be set to "initOnly", which can be used 
    to prevent the user from setting the value outside of the initial
    configuration when using the addAttrs. 

    When used with Base, this means that the user can only define a 
    value for the Attribute during construction.

  * Attribute change events are now published with the defaultTargetOnly 
    property set to true.

  * newVal property of event object passed to change event listeners will 
    now be the value returned from the Attribute's getter (if defined)

  * setter, getter, validator and valueFn can now be specified as 
    strings, referring to the method names to be invoked on the Attribute
    instance.

3.0.0
-----

  * set/get can now be called for ad-hoc attributes (attributes which 
    have not been added/configured).

  * Fixed issue where custom getters were being called with undefined values,
    for the initial set.

  * Limited the case for which an attribute will not notify after listeners, 
    if the value is unchanged after a set, to primitive values (values for 
    which Lang.isObject(newVal) returns false).

    This allows after listeners to be invoked, when resetting the value to 
    the same object reference, which has properties updated, or arrays with
    elements modified. 

  * Attribute broken up into attribute-base and attribute-complex submodules.

    attribute-complex adds support for complex attributes ({x.y.z : 5}) to
    addAttrs. 

3.0.0 beta 1
------------

  * Removed Attribute.CLONE support in the interests of simplicity.
    Was not being used. Can re-evaluate support if real world demand 
    for it exists. 

  * Changed "set" and "get" configuration properties for setter and 
    getter methods to "setter" and "getter" respectively.

  * Added support for setter to return Attribute.INVALID_VALUE
    to prevent attribute state from being changed. 

    This allows developers to combine setter and validator 
    functionality into one method if performance optimization 
    is required.

  * "validator" is now invoked before "setter".

  * Renamed xxxAtt and xxxAtts methods to xxxAttr, xxxAttrs for
    consistency.

  * "after" listeners are only notified if attribute value really
    changes (preVal !== newVal).

  * Extending classes can now overwrite ATTRS configuration properties 
    from super classes, including writeOnce and readOnly attributes.

    The ATTRS configurations are merged across the class hierarchy,
    before they are used to initialize the attributes.

  * addAttr now prevents re-adding attributes which are already 
    configured in order to maintain consistent state.

  * Event prefix wrapper functions (on, after etc.) removed - 
    Event.Target now accepts an event prefix configuration value
  
  * Added additional log messages to assist with debugging.

  * Attribute change events are no longer fired for initial set.

  * Split up State add/get/remove into add/addAll, get/getAll, 
    remove/removeAll to avoid having to create object literals for 
    critical path [ add/get single key values ].

  * Attribute getter, setter, validator now also receive attribute name 
    as the 2nd arg (val, name).

  * If Attributes initialized through addAttrs have a user provided value 
    which is not valid, the initial attribute value will revert to the 
    default value in the attribute configuration, if it exists.

  * reset() no longer resets readOnly or writeOnce attributes. Only 
    publically settable values are reset.

  * Added modifyAttr method, to allow component developer to modify 
    configuration of an attribute which has already been added. The set of 
    attribute configuration properties which can be modified after it 
    has been added are limited to getter, readOnly, writeOnce and broadcast.

  * Added support for lazy attribute configuration. Base uses this feature 
    to lazily intialize all Attributes on the first call to get/set, for 
    performance optimization. 

    lazyAdd:true/false can be used to over-ride this behavior for a 
    particular attribute. 

3.0.0PR2
--------

  * Added valueFn support, to allowing static 
    attribute values configuration to set instance
    based values.
  
  * Added reset method.

  * Added private setter for use by class implementation
    code to set readOnly, writeOnce values.

3.0.0PR1 - Initial release
--------------------------
