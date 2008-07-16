1). Add a folder for your module to the 3.x/templates/examples/data directory

        3.x/templates/examples/data/<module>

2). In your module data folder, add your meta-data php file
    (same format as 2.x)

        3.x/templates/examples/data/<module>/<module>.php

3). In your module data folder, add your corresponding example files(same
    (same format as 2.x)

        3.x/templates/examples/data/<module>/

                <module>-fooEx_customheader._php
                <module>-fooEx_description.php
                <module>-fooEx_intro.php
                <module>-fooEx_source.php

                <module>-barEx_description.php
                <module>-barEx_intro.php
                <module>-barEx_source.php

4). Include your module meta-data to 3.x/templates/examples/data/examples.php

        include($dataroot."<module>/<module>.php");

See: 3.x/templates/examples/data/sample for reference.
