all:
	ant all

meta:
	./scripts/meta_join.py

check:
	./scripts/meta_check.js

tests: test

deps:
	./scripts/deps.sh

test: deps
	./scripts/build_loader_tests.js
	yuitest ./tests/cli/loader.js

.PHONY: meta check tests deps test all
