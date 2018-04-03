#!/bin/bash

set -e # everything must succeed.

temp_dir=./.temp
mkdir -p "$temp_dir"

./sciencebeam-download-and-convert.sh \
  "https://cdn.elifesciences.org/articles/32671/elife-32671-v2.pdf" \
  "$temp_dir/elife-32671-v2.xml"
