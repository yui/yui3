The JSON Utility
    Provides static methods to serialize objects to JSON strings and
    deserialize objects from JSON strings.

    Three modules are available:
        json           - Both parse and stringify functionality
        json-parse     - Parse valid JSON strings into JavaScript objects
        json-stringify - Serialize JavaScipt objects into valid JSON strings

3.3.0
    * No changes

3.2.0
    * Convert parse input to a string before processing
    * eval now referenced indirectly to allow for better compression
    * dateToString deprecated.  Use a replacer.  A Date function extension is
      in the works.

3.1.1
    No changes

3.1.0
    * useNative___ disabled for browsers with *very* broken native APIs (FF3.1
      beta1-3)
    * Assumption of window removed to support browserless environment

3.0.0
    * Leverages native JSON.stringify if available
    * Added Y.JSON.useNativeParse and useNativeStringify properties that can be
      set to false to use the JavaScript implementations.  Use these if your
      use case triggers an edge case bug in one of the native implementations.
      Hopefully these will be unnecessary in a few minor versions of the A
      grade browsers.
    * Added support for toJSON methods on obects being stringified
    * Moved Date stringification before replacer to be in accordance with ES5

3.0.0 beta 1
    * Leverages native JSON.parse if available
    * Stringify API change. Third argument changed from depth control to indent
      (Per the ECMA 5 spec)
    * Stringify now throws an Error if the object has cyclical references
      (Per the ECMA 5 spec)
    * restructured stringify to leverage Y.Lang.type

3.0.0 PR2
    No changes

3.0.0 PR1
    Initial release
