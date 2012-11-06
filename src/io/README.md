IO Utility
==========

The IO family of modules provide a simple API for requesting resources over HTTP
and HTTPS. These modules are:

  * `io-base`: This is the base IO module that facilitates HTTP requests using
    the `XMLHttpRequest` transport.

  * `io-xdr`: This module adds the ability to make cross-domain support through
    a Flash transport, and an `XDomainRequest` transport for Internet Explorer.

  * `io-form`: This module adds the ability to serialize HTML form data into a
    key-value string.

  * `io-upload-iframe`: This module adds the ability to upload files, as part of
    a request payload, in an HTML form.

  * `io-queue`: This module implements a basic queue to allow IO requests to be
    received and handled in the order sent.
