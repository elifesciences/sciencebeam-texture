# Demo of ScienceBeam with Texture

## Development

### Using Docker

This method doesn't require a local version of `npm`. It has the advantage of using a consistent version. But the API proxy is currently not supported (i.e. no PDF conversion).

- `make build-dev` to build development image
- `make npm-ci` to install npm dependencies (as per the lock file)
- `make bundle` to bundle JavaScript & Co
- `make start-dev` to start development server

#### Install NPM Dependency

`make install-dependency ARGS="--save git+https://git@github.com/substance/texture.git#v1.0"`

### Using NPM (Without Docker)

- `npm install` to install dependencies
- `npm run build` or `gulp build` to build the demo

#### Start Website (Choose One)

##### Start Website without ScienceBeam API Proxy (No PDF conversion)

- Start site, run either:
  - `npm start` or `gulp serve` to serve the demo on `http://localhost:3000` (uses browserSync)
  - `npm run watch` or `gulp watch` watches for and rebuilds based on changes within `src`, it opens a Chrome tab and auto reloads on build.

##### Start Website with ScienceBeam API Proxy to Local ScienceBeam API

- Start application at the [root](../README.md) (via `make start` or docker-compose)
- build demo site (e.g. `npm install` and `npm run build`, see above)
- Start site, run either:
  - `npm run start-with-api-proxy` to start the server without watching
  - `npm run watch-with-api-proxy` to start the server while watching for changes

##### Start Website with ScienceBeam API Proxy to Live Demo Website ScienceBeam API

This will proxy to the ScienceBeam API on
[sciencebeam-texture.elifesciences.org](https://sciencebeam-texture.elifesciences.org/).

- Start site, run either:
  - `npm run start-with-live-api-proxy` to start the server without watching
  - `npm run watch-with-live-api-proxy` to start the server while watching for changes

#### Demo website ports

After starting the demo website using one of the above methods, it be available on two ports:

- [port 8080](http://localhost:8080) the website won't automcatically refresh but may be working more reliably
- [port 3000](http://localhost:3000) uses browserSync, some functions may not work but it will try to automatically refresh (assuming you also used the watch command)
