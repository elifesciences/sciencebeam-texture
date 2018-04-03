#!/bin/bash

set -e # everything must succeed.

pdf_file="$1"
output_xml_file="$2"

if [ -z "$pdf_file" -o -z "$output_xml_file" ]; then
  echo "Usage: $0 <pdf file> <output xml file>"
  exit 1
fi

CONVERT_API_URL=http://localhost:8075/api/convert

echo "Converting $pdf_file to $output_xml_file"

curl --fail --show-error --form "file=@${pdf_file};filename=${pdf_file}" \
  -o "${output_xml_file}" --silent $CONVERT_API_URL

