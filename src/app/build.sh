#!/bin/bash
ant $@ | grep -i -E '(\[(post|yuicompressor)\]|warning|error)'
