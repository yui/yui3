YUI Loader Change History
=========================

### 3.4.1

  * No changes.

### 3.4.0
    
   * Added Alias support and flattened the module structure.
   * Alias support: When asking for: "dd"
        Loader actually asks for: "dd-ddm-base,dd-ddm,dd-ddm-drop,dd-drag,dd-proxy,dd-constrain,dd-drop,dd-scroll,dd-drop-plugin"
   * Better RLS support

### 3.3.0

   * 'when' config for conditional modules (before, after, or instead).

### 3.2.0
   * Conditional module support based on user agent detection or test function.
   * Added gallery css support
   * performance optimizations, cached yui metadata, shared instances, etc

### 3.1.1
  * Fixed ticket #2528771 : Loader has incorrect default for "base" - uses Y.Env, instead of Y.Env.base
  * Fixed ticket #2528784 : Regression requesting language packs using Y.use("lang/datatype-date_xx", fn) in build yui3-2029

### 3.1.0
  * Added a 'patterns' property.  Modules that are not predefined will be created with the
    default values if it matches one of the patterns defined for the instance.
  * Added module groups.  This allows for specifying the base path and the combo properties
    for a group of modules.  The combo support now allows for multiple combo domains.
  * Handles simultaneous bootstrapping and loading better.
  * Added support for dynamically loading language packs along with modules that have them.
  * Intrinsic support for loading yui3-gallery modules.
  * Intrinsic support for loading yui2 modules via the 2in3 project.
  * Submodule breakdown to allow use of loader without all of the YUI3 metadata.
  * Metadata is managed per component instead of centrally.
  * Extremely long combo urls are split into multiple requests.
  * Loader defends itself against metadata that creates circular dependencies.

### 3.0.0
  * Extracted from the YUI seed.  Now fetched dynamically if
    there are missing dependencies if not included.
  * Reads metadata from on-page modules registered via Y.add if the module is not already known.
  * Many new modules, many modules reorganized, dependency information has been tuned.
