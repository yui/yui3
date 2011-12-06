all: build test

build:
	ant all

meta:
	./scripts/meta_join.py

check:
	./scripts/meta_check.js

tests: test

gallery:
	./scripts/fetch_gallery_version.js

deps:
	./scripts/deps.sh

test: deps
	./scripts/build_loader_tests.js
	./scripts/launch_tests.sh

.PHONY: meta check tests deps test all
