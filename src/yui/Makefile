all: build docmods

build:
	shifter --lint defaults

docmods:
	./scripts/build_doc_modules.js

npm:
	ant -f npm.xml
