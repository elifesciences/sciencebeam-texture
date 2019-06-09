UNAME = $(shell whoami)
UID = $(shell id -u)
GID = $(shell id -g)

DOCKER_COMPOSE_DEV = docker-compose
DOCKER_COMPOSE_CI = docker-compose -f docker-compose.yml
DOCKER_COMPOSE = $(DOCKER_COMPOSE_DEV)

RUN_DEV = $(DOCKER_COMPOSE) run --rm texture-dev


show-user:
	@echo "UNAME=$(UNAME)"
	@echo "UID=$(UID)"
	@echo "GID=$(GID)"


build-dev:
	UNAME="$(UNAME)" UID=$(UID) GID=$(GID) $(DOCKER_COMPOSE) build texture-dev


shell:
	$(RUN_DEV) bash


clean:
	$(RUN_DEV) rm -rf node_modules


install:
	$(RUN_DEV) npm ci


build:
	$(RUN_DEV) npm run build


start:
	$(RUN_DEV) npm run start
