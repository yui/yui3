all:
	ant all

npm:
	 make && cd ../yui && make npm && cd ../../build-npm && npm i yuitest request && cd ../src/io

deps:
	./scripts/deps.sh

test: deps
	./scripts/launch_tests.sh

tests: test
