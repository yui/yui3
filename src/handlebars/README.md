Handlebars
==========

Handlebars is a simple template language inspired by Mustache.

This is a YUI port of the original Handlebars project, which can be found at
<https://github.com/wycats/handlebars.js>.


Differences
-----------

YUI-specific changes are minimal. We just wrap the Handlebars code into two YUI
modules:

  - handlebars-base: The bare minimum code necessary to render pre-parsed
    Handlebars templates.

  - handlebars-compiler: The additional code necessary to parse and compile
    Handlebars templates.

The 'handlebars' module is an alias that can be used to load both modules.

Apart from the YUI wrapper code, the only other change is that we use YUI's own
`Y.Escape.html()` method to escape strings rather than using Handlebars's
built-in escaping. This is done because Handlebars's built-in HTML escaper
avoids double-escaping existing `&amp;` entities, which can lead to unexpected
output, especially when using Handlebars templates to render code snippets
in which double-escaping is necessary to properly display the literal text
"&amp;".


Code Organization
-----------------

The upstream Handlebars code YUI uses is maintained in a fork of the original
Handlebars.js project on GitHub, which we're trying to keep closely in sync
with the original Handlebars.js project.

The YUI fork can be found at <https://github.com/rgrove/handlebars.js/tree/yui>.
The "yui" branch on that fork will contain any changes we've made that haven't
yet been integrated upstream, but we do our best to get changes integrated
upstream as quickly as possible to avoid diverging.

Code from this Handlebars.js repo is imported into the YUI 3 repo by a Makefile
in the `src/handlebars` directory. Running `make import` will copy Handlebars
source files from the separate Handlebars repo into the `src/handlebars/js`
directory in the YUI 3 repo.

Handlebars files imported into `src/handlebars/js` are prefixed with
`handlebars-` and should not be edited, while YUI-specific files that live in
that directory are prefixed with `yui-handlebars` and may be edited.

After importing Handlebars files, run `ant all` to build the final YUI modules.
The Handlebars API will be available at `Y.Handlebars` when you use one of the
Handlebars modules.


License
=======

Copyright (C) 2011 by Yehuda Katz
<https://github.com/wycats/handlebars.js>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
