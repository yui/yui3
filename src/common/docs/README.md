Selleck Configuration
---------------------

This directory contains the configuration for YUI's Selleck documentation.

Files
=====

   * `index.mustache`: The main splash page
   * `project.json`: The selleck config file
   * `dist.json`: Same as the selleck config, but with tokens replaced by our build system
   * `layouts/example.mustache`: Default wrapper for example pages
   * `partials/getting-started.mustache`: The default header in most landing pages
   * `partials/test-runner.mustache`: Automated test harness for our examples
   * `partials/selleck-foot.mustache`: Includes the `test-runner` partial in all pages dynamically
