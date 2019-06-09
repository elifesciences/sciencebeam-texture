DOCKER_COMPOSE_DEV = docker-compose
DOCKER_COMPOSE_CI = docker-compose -f docker-compose.yml
DOCKER_COMPOSE = $(DOCKER_COMPOSE_DEV)


build:
	$(DOCKER_COMPOSE) build


build-texture:
	$(DOCKER_COMPOSE) build texture


start-texture: build-texture
	$(DOCKER_COMPOSE) up -d --no-deps texture


start: build
	$(DOCKER_COMPOSE) up -d


stop:
	$(DOCKER_COMPOSE) down


clean:
	$(DOCKER_COMPOSE) down -v


logs:
	$(DOCKER_COMPOSE) logs -f
