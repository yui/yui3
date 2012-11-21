DataSchema Utility
==================

Use the DataSchema Utility to translate data in various input formats into a
standard record-based structure like this:

    {
        results: [
            { fieldA: valueA1, fieldB: valueB2, ... },
            { fieldA: valueA2, fieldB: valueB2, ... },
            ...
        ],
        meta: {
            whatever  : "you",
            configured: "to capture",
            ...
        }
    }

Available processors
====================

1. `Y.DataSchema.Array` - (`dataschema-array`) Input is an Array
2. `Y.DataSchema.JSON` - (`dataschema-json`) Input is an Object or JSON string
3. `Y.DataSchema.XML` - (`dataschema-xml`) Input is an XML node
4. `Y.DataSchema.Text` - (`dataschema-text`) Input is a delimited text string

The important method for each processor is the `apply(schema, data)` method, so
for example:

    var results = Y.DataSchema.JSON.apply({ schema config }, dataObject);

See the user guide for details about schema definitions for each processor.

Known Issues
============

   * XPath addressing for XML elements is currently not available in IE10 WebView mode.
     This is due to the restrictions placed by that environment on the ActiveX implementation
     of XMLDocument, as well as the native Windows XMlDocument API.
