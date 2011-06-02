all:
	ant all

tests: test

deps:
	./scripts/deps.sh

test: deps
	./scripts/build_loader_tests.js
	yuitest ./tests/cli/loader.js
