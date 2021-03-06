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
	$(RUN_DEV) npm audit $(ARGS)


npm-ci:
	$(RUN_DEV) npm ci $(ARGS)


install-dependency: .require-ARGS
	$(RUN_DEV) npm install $(ARGS)


bundle:
	$(RUN_DEV) npm run build $(ARGS)


gulp: .require-ARGS
	$(RUN_DEV) ./node_modules/.bin/gulp $(ARGS)


start-dev:
	$(DOCKER_COMPOSE) up -d texture-dev
	@echo "open http://localhost:$${TEXTURE_PORT_DEV:-4000}"


stop-dev:
	$(DOCKER_COMPOSE) stop texture-dev


logs:
	$(DOCKER_COMPOSE) logs -f
