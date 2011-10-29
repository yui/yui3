// This file contains code that will be inserted at the beginning of the
// handlebars-compiler module.

// This is necessary because the Y.Handlebars object is created in the
// handlebars-base module, but the native Handlebars code expects to use a local
// Handlebars reference.
var Handlebars = Y.Handlebars;
