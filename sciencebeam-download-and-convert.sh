#!/bin/bash

set -e # everything must succeed.

url="$1"
output_xml_file="$2"

if [ -z "$url" -o -z "$output_xml_file" ]; then
  echo "Usage: $0 <url> <output xml file>"
  exit 1
fi

temp_dir=./.temp
xml_basename=${output_xml_file##*/}
name=${xml_basename%.*}
temp_pdf_file=${temp_dir}/${name}.pdf

./download.sh "$url" "$temp_pdf_file"

./sciencebeam-convert.sh "$temp_pdf_file" "$output_xml_file"
