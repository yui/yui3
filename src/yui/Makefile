all: aliases build docmods

build:
	ant all -q -Djshint.skip=true

alias: aliases

aliases:
	./scripts/build.js

docmods:
	./scripts/build_doc_modules.js

npm:
	ant -f npm.xml
