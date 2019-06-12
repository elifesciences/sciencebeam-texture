USERNAME = $(shell whoami)
UID = $(shell id -u)
GID = $(shell id -g)

DOCKER_COMPOSE_DEV = docker-compose
DOCKER_COMPOSE_CI = docker-compose -f docker-compose.yml
DOCKER_COMPOSE = $(DOCKER_COMPOSE_DEV)

RUN_DEV = $(DOCKER_COMPOSE) run --rm texture-dev


ARGS =


show-user:
	@echo "USERNAME=$(USERNAME)"
	@echo "UID=$(UID)"
	@echo "GID=$(GID)"


build-dev:
	USERNAME="$(USERNAME)" UID=$(UID) GID=$(GID) $(DOCKER_COMPOSE) build texture-dev


shell-dev:
	$(RUN_DEV) bash


clean-dev:
	$(RUN_DEV) rm -rf node_modules


.require-ARGS:
	@if [ -z "$(ARGS)" ]; then \
		echo "ARGS required"; \
		exit 1; \
	fi


npm: .require-ARGS
	$(RUN_DEV) npm $(ARGS)


npm-audit:
	$(RUN_DEV) npm audit


npm-ci:
	$(RUN_DEV) npm ci


install-dependency: .require-ARGS
	$(RUN_DEV) npm install $(ARGS)


bundle:
	$(RUN_DEV) npm run build


start-dev:
	$(RUN_DEV) npm run start
