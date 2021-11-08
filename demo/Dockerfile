FROM node:8.16.0-stretch AS texture

USER node
ENV HOME=/home/node

ENV PROJECT_FOLDER=${HOME}/sciencebeam-texture

RUN mkdir ${PROJECT_FOLDER}
WORKDIR ${PROJECT_FOLDER}

COPY --chown=node:node package.json package-lock.json ${PROJECT_FOLDER}/
RUN npm ci

COPY --chown=node:node . ${PROJECT_FOLDER}/
RUN npm run build

HEALTHCHECK --interval=10s --timeout=10s --retries=3 CMD curl -v --fail http://localhost:4000
ARG dependencies_sciencebeam_pipelines
LABEL org.elifesciences.dependencies.sciencebeam="${dependencies_sciencebeam_pipelines}"
