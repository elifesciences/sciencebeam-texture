FROM node:9.8.0-stretch AS texture

USER node
WORKDIR /home/node

ARG commit
RUN echo "cloning ${commit}" && \
  git clone https://github.com/substance/texture.git && \
  cd texture && \
  git checkout ${commit}
WORKDIR /home/node/texture
RUN npm install

HEALTHCHECK --interval=10s --timeout=10s --retries=3 CMD curl -v --fail http://localhost:4000
ARG dependencies_sciencebeam
LABEL org.elifesciences.dependencies.sciencebeam="${dependencies_sciencebeam}"
