#!/bin/bash

set -e # everything must succeed.

# TODO use API rather than file system (API does not exist yet)
host_dir=$(pwd)/.temp
mkdir -p ${host_dir}
chmod a+w ${host_dir} # that can't be right (but it's just temporary)

# TODO use provide input arguments
sample_filename=elife-32671-v2.pdf

# download sample
if [ ! -f "${host_dir}/${sample_filename}" ]; then
  download_url='https://elifesciences.org/download/aHR0cHM6Ly9jZG4uZWxpZmVzY2llbmNlcy5vcmcvYXJ0aWNsZXMvMzI2NzEvZWxpZmUtMzI2NzEtdjIucGRm/elife-32671-v2.pdf?_hash=nrG1HRdFl4DZPdYxrP0OOJfOcyNJrkWHhR5HiBe0O4M%3D'
  wget $download_url --output-document=${host_dir}/${sample_filename}
fi

container_dir=/home/sciencebeam/data

docker-compose run sciencebeam-texture \
  python -m sciencebeam.examples.grobid_service_pdf_to_xml \
  --grobid-url http://grobid:8070 \
  --grobid-action /api/processHeaderDocument \
  --input "${container_dir}/${sample_filename}" \
  --output-suffix .tei-header.xml
