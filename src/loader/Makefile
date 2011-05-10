all:
	ant all

tests: test

deps:
	./scripts/deps.sh

test: deps
	./scripts/generate_use_tests.js
	./scripts/build_loader_tests.js
	yuitest ./tests/cli/loader.js
