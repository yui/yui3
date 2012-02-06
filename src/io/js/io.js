/**
The IO class is a utility that brokers HTTP requests through a simplified
interface.  Specifically, it allows JavaScript to make HTTP requests to
a resource without a page reload.  The underlying transport for making
same-domain requests is the XMLHttpRequest object.  IO can also use
Flash, if specified as a transport, for cross-domain requests.

    Y.io('/some/url', {
        on: {
            success: function(id, e) {
                Y.log(e.responseText);
            }
        }
    });

@module io
@main io
*/
