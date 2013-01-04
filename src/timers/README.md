Timers
======

Similar to `Y.later`, but sooner.  `Y.soon` standardizes the way to make
something happen asynchronously but without a timed delay.  Under the covers,
`Y.soon` will call `setTimeout` if it must, but it will try to use the more
efficient `setImmediate` or `process.nextTick` depending on the environment.

`Y.later` will go through a deprecation process and join this module after
it has fully been deprecated.
