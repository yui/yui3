all: build test

build:
	shifter --lint defaults

buildloud:
	shifter

meta:
	./scripts/meta_join.js

tests: test

gallery:
	./scripts/fetch_gallery_version.js

test:
	yogi test

.PHONY: meta check tests deps test all
