# Demo of ScienceBeam with Texture

## Development

### Using Docker

- `make build-dev` to build development image
- `make npm-ci` to install npm dependencies (as per the lock file)
- `make bundle` to bundle JavaScript & Co
- `make start-dev` to start development server

#### Install NPM Dependency

`make install-dependency ARGS="--save git+https://git@github.com/substance/texture.git#v1.0"`

### Without Docker

- `npm install` to install dependencies
- `npm run build` or `gulp build` to build the demo
- `npm start` or `gulp serve` to serve the demo on `http://localhost:3000` (uses browserSync)
- `npm run watch` or `gulp watch` watches for and rebuilds based on changes within `src`, it opens a Chrome tab and auto reloads on build.

To run with the demo website with ScienceBeam API proxy (currently only at `/api`):

- Start application at the root (via docker-compose)
- `npm run start-with-api-proxy` to start the server without watching
- `npm run watch-with-api-proxy` to start the server while watching for changes
