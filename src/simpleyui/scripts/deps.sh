#!/bin/bash

type -P node &>/dev/null || { echo "I require node but it's not installed.  Aborting." >&2; exit 1; }
