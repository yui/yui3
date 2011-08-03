Queue Promote
=============

The Queue module in its simplest form is just that: a simple queuing mechanism.
Items added to the Queue are removed via `next()`. The `queue-promote` module
extends the `Queue.prototype` with `promote(item)`, `remove(item)`, and
`indexOf(item)` methods.
