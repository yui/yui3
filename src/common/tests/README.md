# CI Testing

These XML files define the tests that should be used by CI.

## smoke.xml

Smoke tests. They test basic functionality only, providing some assurance that the system under test will not catastrophically fail.

## unit.xml

Unit tests. Each test quickly validates a single unit of code, independently from other tests, and free from external dependencies.

## coverage.xml

The subset of unit tests that are coverage-ready. This means they:

1. Use build/yui/yui.js (not yui-debug.js or yui-min.js) for the seed.

2. Respect the ?filter=raw query string parameter by setting the filter config property in the test like this:

    var Y = YUI({
        filter: (window.location.search.match(/[?&]filter=([^&]+)/) || [])[1] || 'raw'
    });

3. Use modules that can be instrumented by YUI Test Coverage.
