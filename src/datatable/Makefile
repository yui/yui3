all: base body core datasource head message mutable pe scroll sort table widths

tests: base-tests body-tests core-tests head-tests message-tests mutable-tests scroll-tests sort-tests table-tests widths-tests

base:
	ant -f build.base.xml all -q -Djshint.skip=true

base-tests:
	ant -f build.base.xml tests -q -Djshint.skip=true

body:
	ant -f build.body.xml all -q -Djshint.skip=true

body-tests:
	ant -f build.body.xml tests -q -Djshint.skip=true

core:
	ant -f build.core.xml all -q -Djshint.skip=true

core-tests:
	ant -f build.core.xml tests -q -Djshint.skip=true

datasource:
	ant -f build.datasource.xml all -q -Djshint.skip=true

datasource-tests:
	ant -f build.datasource.xml tests -q -Djshint.skip=true

head:
	ant -f build.head.xml all -q -Djshint.skip=true

head-tests:
	ant -f build.head.xml tests -q -Djshint.skip=true

message:
	ant -f build.message.xml all -q -Djshint.skip=true

message-tests:
	ant -f build.message.xml tests -q -Djshint.skip=true

mutable:
	ant -f build.mutable.xml all -q -Djshint.skip=true

mutable-tests:
	ant -f build.mutable.xml tests -q -Djshint.skip=true

pe: pe-data pe-table

pe-data:
	ant -f build.pe-data.xml all -q -Djshint.skip=true

pe-data-tests:
	ant -f build.pe-data.xml tests -q -Djshint.skip=true

pe-table:
	ant -f build.pe-table.xml all -q -Djshint.skip=true

pe-table-tests:
	ant -f build.pe-table.xml tests -q -Djshint.skip=true

scroll:
	ant -f build.scroll.xml all -q -Djshint.skip=true

scroll-tests:
	ant -f build.scroll.xml tests -q -Djshint.skip=true

sortable: sort

sort:
	ant -f build.sort.xml all -q -Djshint.skip=true

sort-tests:
	ant -f build.sort.xml tests -q -Djshint.skip=true

table:
	ant -f build.table.xml all -q -Djshint.skip=true

table-tests:
	ant -f build.table.xml tests -q -Djshint.skip=true

colwidths: widths

widths:
	ant -f build.widths.xml all -q -Djshint.skip=true

widths-tests:
	ant -f build.widths.xml tests -q -Djshint.skip=true
