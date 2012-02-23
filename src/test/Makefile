# Path to the "lib" directory of a Handlebars.js git checkout.
YUITest = $(PWD)/../../../yuitest/javascript/src

all: source build

clean:
	rm -f ./js/*

asserts:
	cp $(YUITest)/asserts/* ./js/

core:
	cp $(YUITest)/core/* ./js/
	cp $(YUITest)/util/EventTarget.js ./js/

errors:
	cp $(YUITest)/errors/* ./js/

mock:
	cp $(YUITest)/mock/* ./js/

reporting:
	cp $(YUITest)/reporting/* ./js/
	cp $(YUITest)/web/Reporter.js ./js/

wrap:
	cp ./scripts/*.js ./js/

api:
	./scripts/fix_docs.sh

source: asserts core errors mock reporting wrap api

build:
	ant all

