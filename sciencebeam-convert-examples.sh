#!/bin/bash

set -e # everything must succeed.

xml_dir=./demo/src/example-data

mkdir -p "${xml_dir}"

# https://elifesciences.org/articles/32671
./sciencebeam-download-and-convert.sh \
  "https://cdn.elifesciences.org/articles/32671/elife-32671-v2.pdf" \
  "$xml_dir/elife-32671-v2.xml"

# http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0193088
./sciencebeam-download-and-convert.sh \
  "http://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0193088&type=printable" \
  "$xml_dir/plos-10.1371-journal.pone.0193088.xml"

# https://www.hindawi.com/journals/ijp/2017/8479487/
./sciencebeam-download-and-convert.sh \
  "http://downloads.hindawi.com/journals/ijp/2017/8479487.pdf" \
  "$xml_dir/hindawi-10.1155-2017-8479487.xml"

# http://gh.bmj.com/content/3/2/e000634
./sciencebeam-download-and-convert.sh \
  "http://gh.bmj.com/content/3/2/e000634.full.pdf" \
  "$xml_dir/bmj-10.1136-bmjgh-2017-000634.xml"

# https://github.com/elifesciences/XML-mapping/blob/master/elife-00666.pdf
./sciencebeam-download-and-convert.sh \
  "https://github.com/elifesciences/XML-mapping/raw/master/elife-00666.pdf" \
  "$xml_dir/elife-00666.xml"
