const path = require('path');

module.exports = {

  entry: './src/js/App.js',
  output: {
    path: path.resolve(__dirname, './dist/js'),
    filename: "[name]-packed.js",
  },
  mode: 'development',
};

