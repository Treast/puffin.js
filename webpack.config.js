const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

let optimization = {
  minimizer: [],
};

let outputFileName = 'puffin.js';
let mode = 'development';

if (process.env.NODE_ENV === 'production') {
  optimization.minimizer.push(new UglifyJsPlugin());
  outputFileName = 'puffin.min.js';
  mode = 'production';
}

const config = {
  entry: path.resolve(__dirname, 'src', 'Puffin.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFileName,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
  optimization,
  mode,
};

module.exports = config;
