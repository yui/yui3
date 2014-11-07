YQL Module
==========

(YQL) is an expressive SQL-like language that lets you query,
filter, and join data across Web services. With YQL, *apps run
faster with fewer lines of code and a smaller network footprint.*


    YUI().use('yql', function(Y) {

        Y.YQL('select * from weather.forecast where location=90210', function(r) {
            //r now contains the result of the YQL Query
            //use the YQL Developer console to learn
            //what data is coming back in this object
            //and how that data is structured.
        });

    });


Plugins
-------

   * `yql-winjs` - Wrapper to use native `XHR` with `CORS` in WinJS (Windows 8 app env)
   * `yql-nodejs`- Wrapper to use the `request` module under the hood.

Although both of these techniques allow for more than just `GET` requests, the
plugins do not allow that to be changed. In order to have code that is portable
between these environments, it was best to leave their signatures and their
capabilities the same as in the browser.

If you are in these environments and need to do other request types, you should
use the `io` module to make the requests.
