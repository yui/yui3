Base Change History
===================

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

* No changes.

3.11.0
------

* BaseObservable now bypasses the event sub-system if there are no listeners for
  the `init` event, during construction, to optimize performance.

* [!] Base and BaseCore now add all ATTRS definitions, across the hierarchy,
  in a single shot. Prior to this change, they used to be added a class
  at a time.

  That is, for Foo extends Bar, the order of operations used to be:

  1) Add Bar ATTRS
  2) Call Bar initializer
  3) Add Foo ATTRS
  4) Call Foo initializer

  Now it is:

  1) Add Foo and Bar's ATTRS together
  2) Call Bar initializer
  3) Call Foo initializer

  This change fixes issues encountered in real-world code where setters,
  getters and valueFns in superclass ATTRS, overidden in a subclass,
  wouldn't be able to access the subclass' attributes.

  However as a result of this change, there are a couple of areas,
  mentioned below, which may require component developers (especially
  Extension developers) to update their implementations. These are
  mentioned below:

  A. There may potentially be setters/getters/valueFns in Foo, which
  expected Bar's initializer to have been executed already.

  This is expected to be rare, and if required, the `_preAddAttrs()`
  hook described in the API Documentation, can be used to jump in before
  attributes are added.

  B. Older Extensions may need to move code from their Constructors, to
  initializers.

  To align with the above change, Base and BaseCore will now call all
  Extension constructors before any attributes are added, to address issues
  where attribute configurations required Extension constructors to have run.

  Extensions created before `initializer` support for Extensions was added to
  Base, may have code in their constructors which accesses attributes from a
  superclass.

  Such code would need to be moved to an `initializer` method on the Extension,
  which is likely the proper place for it. YUI's WidgetPosition and other
  extensions based on it, needed to do this for example.

  Although this scenario is expected to be more common, the upgrade requirement
  was simple enough to warrant us pursuing this change so that the attribute
  setup flow was cleaner moving foward.

  See the Base and BaseCore API docs and the base-core unit tests for more
  details.

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

* Significant performance improvements in common Base/BaseCore operations.

  For example, on Chrome:

    `new BaseCore()` is 3 times faster
    `BaseCore set()` is 3 times faster
    `BaseCore get()` is 5 times faster

  In addition to the above basic `BaseCore` numbers, improvements in CustomEvent
  performance, result in the following improvements for `Base`

    `new Base()` is 4 times faster
    `Base set()` is 4 times faster
    `Base get()` is 5 times faster

  Major performance related changes are listed in the list of updates below.

  Commit messages have detailed descriptions of incremental changes, and the
  benefits introduced.

* [!] The result of static `ATTRS` aggregation is now cached during the creation of
  the first instance of a given "class", and the cached results are reused for
  subsequent instances.

  This provides significant performance benefits, but has the potential to introduce
  a backwards compatibility issue in the hopefully rare circumstance that you're
  modifying the static ATTRS collection directly, after the first instance is created.

  [!] If you are modifying static `ATTRS` collection directly after an instance is
  created (e.g. if an optional module comes in and updates the collection dynamically),
  you will need to change the implementation to use the static `Y.Base.modifyAttrs()`
  or `Y.BaseCore.modifyAttrs()` method, so we can mark the cached aggregation
  dirty, and recompute it.

      `Y.Base.modifyAttrs(MyClass, {..changes to merge..})`

  `Base.create` and `Base.mix` will take care of this internally, so you only need
  to use the above methods if your own code is touching the ATTRS object on a class.
  Additionaly, `Base.create` and `Base.mix` will add the `modifyAttrs` to your created
  class, so you can also call it directly on the class. e.g.

      `MyCreatedClass.modifyAttrs({..changes to merge..})`

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

* `Y.Base.create()` can now be used with `Y.BaseCore`, in addition to its
  existing usage with `Y.Base`. This allows non-observable, BaseCore hierarchies
  to use class extensions.

* Extracted the `Y.BaseObservable` class extension from `Y.Base`. This is a new
  class extension for `Y.BaseCore` which adds support for observability. This
  allows BaseCore subclasses to mix-in BaseObservable at runtime, bringing their
  functionality up to that of `Y.Base`.

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

  * "value" defined in a subclass ATTRS definition, will now override
    "valueFn" for the same attribute from the superclass chain.

    Previously, "value" would only override "value" and "valueFn"
    would only overide "valueFn", and in the aggregated set of
    attributes, "valueFn" would take precedence over "value".

    This meant that subclasses had to define a "valueFn" to overide
    superclasses, if the superclass used "valueFn".

3.5.1
-----

  * No changes.

3.5.0
-----

  * Only invoke Base constructor logic once to
    support multi-inheritance scenario in which
    an extension passed to Base.create inherits from Base
    itself.

    NOTE: To support multiple inhertiance more deeply, we'd
    need to remove the hasOwnProperty restriction around object
    key iteration.

  * Added Y.BaseCore which is core Base functionality without
    Custom Events (it uses Y.AttributeCore instead of Y.Attribute).

    Y.BaseCore still maintains the ATTRS handling, init/destroy
    lifecycle and plugin support, but doesn't fire any custom evnets
    of it's own (the idea is that it will the base for Node-Plugin
    type components, built off of a WidgetCore)

    Y.Base is now Y.BaseCore + Y.Attribute, and is 100% backwards
    compatible.

    Summary:

    Y.Attribute     - Common Attribute Functionality (100% backwards compat)
    Y.Base          - Common Base Functionality (100% backwards compat)

    Y.AttributeCore - Lightest Attribute support, without CustomEvents
    Y.BaseCore      - Lightest Base support, without CustomEvents

    --

    Y.AttributeEvents - Augmentable Attribute Events support
    Y.AttributeExtras - Augmentable 20% usage for Attribute (modifyAttr, removeAttr, reset ...)
    Y.AttributeComplex - Augmentable support for constructor complex attribute parsing ({"x.y":foo})

    --

    Y.Attribute = Y.AttributeCore + Y.AttributeEvents + Y.AttributeExtras
    Y.Base      = Y.BaseCore + Y.Attribute

    --

    Modules:

    "base-base" : Y.Base
    "base-core" : Y.BaseCore

    "base-build" : Y.Base.build/create/mix mixin

  * Extended Base.create/mix support for _buildCfg, to Extensions, mainly so that
    extensions can define a whitelist of statics which need to be copied to the
    main class.

    e.g.

    MyExtension._buildCfg = {
       aggregates:["newPropsToAggregate"...],
       custom: {
           newPropsToCustomMix
       },
       statics: ["newPropsToCopy"]
    };

3.4.1
-----

  * No changes.

3.4.0
-----

  * Base now destroys plugins before destroying itself

  * Base.create/mix extensions can now define initializer and
    destructor prototype functions, which will get invoked after
    the initializer for the host class into which they are mixed and
    before it's destructor.

  * Use a hash version of whitelist mix for improved performance.
    Also removed non-required hasOwnProperty check and delete.

3.3.0
-----

  * Fixed Base.mix when used on a class created using Base.create

  * toString no longer inadvertently stamps the object, however,
    we now stamp Base objects in the constructor, to support
    use cases where the "toString" stamping was implicitly being
    relied upon (e.g. in DD, as hashkeys).

3.2.0
-----

  * Fixed Base.create to properly isolate ATTRS on extensions

3.1.1
-----

  * No changes

3.1.0
-----

  * As the final step in the destroy phase, Base now does a detachAll() to avoid invoking listeners
    which may be waiting to be in an async. step which occurs after destruction.

  * "init" and "destroy" events are now published with the defaultTargetOnly property set to true

  * Added support for MyClass.EVENT_PREFIX to allow developers
    to define their own event prefix

  * Made "init" and "destroy" events fireOnce:true (along with
    "render" in Widget), so that subscriptions made after the
    events are fired, are notified immediately.

  * Dynamic and non-dynamically built classes now have their
    extensions instantiated the same way - during _initHierarchy.

  * Updated ATTRS handling for Base.build, so that ATTRS are
    also aggregated at the attribute configuration object level,
    allowing extensions to add to, or overwrite, attribute
    configuration properties on the host.

  * Added sugar Base.create and Base.mix methods on top of
    Base.build, to simplify the 2 main use cases:

    1) Creating a completely new class which uses extensions.
    2) Mixing in extensions to an existing class.

  * Documented non-attribute on, after, bubbleTargets and plugins
    property support in the Base constructor config argument

3.0.0
-----

  * Fixed hasImpl method on built classes, to look up the class
    hierarchy for applied extensions.

  * Plugin.Host removed from base-base module and delivered as it's
    own module - "pluginhost"

  * base broken up into..

     base-base: Provides class hierarchy support for ATTRS and
     initialization

     base-build: Provides Extension support in the form of
     Base.build

     base-pluginhost: Augments Plugin.Host to Base, adding plugin
     support

3.0.0 beta 1
------------

  * Config argument for init event now merged into the event facade,
    instead of being passed separately (available as e.cfg).

  * Removed Base.create. On review, considered to be overkill.
    Users can easily create new instances, using Base.build

  * Moved PluginHost down from Widget to Base, since utils and
    Node will also support Plugins.

  * PluginHost.plug and unplug now accept the plugin class as
    arguments [plug(pluginClass, cfg) and unplug(pluginClass)].

  * Split base module up into base-base and base-build.

  * Added lazy attribute initialization support, to improve performance.

    This also removes order dependency when processing ATTRS for a
    particular class.

    If a get/set call is made for an uninitialized attribute A, in the
    getter/setter/validator or valueFns of another attribute B, A will
    be intiailized on the fly.

  * Added ability to subscribe to on/after events through the
    constructor config object, e.g.:

      new MyBaseObject({
         on: {
            init: handlerFn,
            myAttrChange: handlerFn
	     },
	     after: {
	       init: handlerFn,
	       myAttrChange: handlerFn
	     },
	     ...
      });

  * Developers can now override the default clone behavior we use to
    isolate default ATTRS config values, using cloneDefaultValue, e.g.:

    ATTRS = {
      myAttr : {
      	value: AnObjectOrArrayReference
	    cloneDefaultValue: true|false|"deep"|"shallow"
      }
    }

    If the cloneDefaultValue property is not defined, Base will clone
    any Arrays or Object literals which are used as default values when
    configuring attributes for an instance, so that updates to instance
    values do not modify the default value.

    This behavior can be over-ridden using the cloneDefaultValue property:

    true, deep:

      Use Y.clone to protect the default value.

    shallow:

      Use Y.merge, to protect the default value.

    false:

      Don't clone Arrays or Object literals. The value is intended
      to be used by reference, for example, when it points to
      a utility object.

  * Base.plug and Base.unplug used to add static Plugins (default plugins
    for a class). Replaces static PLUGINS array, allowing subclasses to
    easily unplug static plugins added higher up in the hierarchy.

  * Base adds all attributes lazily. This means attributes don't get
    initialized until the first call to get/set, speeding up construction
    of Base based objects.

    Attributes which have setters which set some other state in the object,
    can configure the attribute to disable lazy initialization, by setting
    lazyAdd:false as part of their attribute configuration, so that the setter
    gets invoked during construction.

3.0.0PR1 - Initial release
--------------------------

