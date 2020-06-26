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
make build
```

or:

```bash
docker-compose build
```

Effect:

* Creates local `elifesciences/*` Docker images.

### Run containers

```bash
make start logs
```

(use `make stop` to stop the server)

or:

```bash
docker-compose up
```

Effect:

* Starts all the Docker containers.
* The demo website will be available on [port 8000](http://localhost:8000/) (via nginx).
* nginx will forward requests based on the path (e.g. root to texture, `/api` to ScienceBeam)
* Other ports may also be exposed but are not required

Note: If the ScienceBeam API request fails the first time, this may be due to a timeout while it is loading the models. It may work on subsequent requests.

### Convert Sample PDFs using ScienceBeam Container

```bash
./sciencebeam-convert-examples.sh
```

Effect:

* Downloads sample PDFs
* Converts PDF by running the _elifesciences/sciencebeam_ container

## Front End

* Please read the [README file in the demo folder](demo/README.md) to setup the Front End for seeing styling changes, without needing to rebuild the Docker image.
