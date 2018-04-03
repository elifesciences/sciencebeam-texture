#!/bin/bash

set -e # everything must succeed.

url="$1"
output_file="$2"

if [ -z "$url" -o -z "$output_file" ]; then
  echo "Usage: $0 <url> <output file>"
  exit 1
fi

if [ -f "$output_file" ]; then
  echo "Already downloaded: $output_file"
else
  echo "Downloading $url to $output_file"

  USER_AGENT="Dummy/user-agent"

  curl --fail --show-error --connect-timeout 60 --user-agent "$USER_AGENT" --location \
    "$url" --silent -o "$output_file"

  output_size=$(wc -c < "$output_file")
  if [ $output_size -eq 0 ]; then
    echo "File not downloaded correctly, is empty"
    rm "$output_file"
    exit 2
  fi
fi
