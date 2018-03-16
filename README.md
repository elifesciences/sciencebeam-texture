# ScienceBeam Texture

An experimental demo app to convert PDF into [DAR JATS](https://github.com/substance/dar), that is understood by [Texture](https://github.com/substance/texture).

## Status

Watch the space

## Pre-requisites

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

## Setup

### Setup Local Data Directory

```bash
./setup.sh
```

Effect:

* That will create `.temp/data` and change permissions to allow _texture_ write access.

### Build images

```bash
docker-compose build
```

Effect:

* Creates local `elifesciences/*` Docker images.

### Run containers

```bash
docker-compose up
```

Effect:

* Starts all the Docker containers.
* Texture will be available on [port 4000](http://localhost:4000/).
* [GROBID](grobid.readthedocs.io) will be available on [port 8070](http://localhost:8070/).

### Convert Sample PDF using ScienceBeam Container

```bash
./sciencebeam-convert.sh
```

Effect:

* Downloads sample PDF
* Converts PDF by running the _elifesciences/sciencebeam_ container (output is still TEI).

### Show results in Texture

TODO
