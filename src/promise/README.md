<a href="http://promises-aplus.github.com/promises-spec">
  <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
    alt="Promises/A+ logo" title="Promises/A+ 1.0 compliant" align="right" />
</a>

Promise
=======

A promises utility to be used by any utility that performs asynchronous
operations. This implementation is compliant with the
[Promises A+ spec](http://promises-aplus.github.com/promises-spec), a standard
written by members of the JavaScript community.

Create promises by calling the Y.Promise constructor. Inherit from the Y.Promise
constructor to return customized promises that have extra methods. The `then`
method returns a promise based on its constructor, so extended promises will
return the right promise type from `then`.
