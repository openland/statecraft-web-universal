/* eslint-disable filenames/match-regex */

const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    app: [
      path.resolve(__dirname, './app')
    ]
  },
  module: {
    loaders: [
      {
        include: path.resolve(__dirname, './app'),
        loader: 'ts-loader',
        test: /\.js$/
      },
      {
        loaders: [
          {
            loader: 'style-loader',
            query: {
              sourceMap: 1
            }
          },
          {
            loader: 'css-loader',
            query: {
              importLoaders: 1,
              localIdentName: '[path]___[name]___[local]',
              modules: 1
            }
          },
          'resolve-url-loader'
        ],
        test: /\.css$/
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist')
  }
};