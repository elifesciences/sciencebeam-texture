#!/bin/bash

set -e # everything must succeed.

# TODO use API rather than file system (API does not exist yet)
host_dir=$(pwd)/.temp
mkdir -p ${host_dir}
chmod a+w ${host_dir} # that can't be right (but it's just temporary)

# TODO allow input arguments
sample_filename=elife-32671-v2.pdf
output_file=${host_dir}/elife-32671-v2.xml

# download sample
if [ ! -f "${host_dir}/${sample_filename}" ]; then
  download_url='https://elifesciences.org/download/aHR0cHM6Ly9jZG4uZWxpZmVzY2llbmNlcy5vcmcvYXJ0aWNsZXMvMzI2NzEvZWxpZmUtMzI2NzEtdjIucGRm/elife-32671-v2.pdf?_hash=nrG1HRdFl4DZPdYxrP0OOJfOcyNJrkWHhR5HiBe0O4M%3D'
  wget $download_url --output-document=${host_dir}/${sample_filename}
fi

CONVERT_API_URL=http://localhost:8075/api/convert

curl --form "file=@${host_dir}/${sample_filename};filename=${sample_filename}" \
  -o "${output_file}" $CONVERT_API_URL
