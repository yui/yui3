#!/bin/bash

type -P node &>/dev/null || { echo "I require node but it's not installed.  Aborting." >&2; exit 1; }

type -P yuitest &>/dev/null || { echo "I require yuitest but it's not installed. (npm -g i yuitest)  Aborting." >&2; exit 1; }

