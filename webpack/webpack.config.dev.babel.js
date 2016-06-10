require("babel-polyfill");

import path                   from 'path';
import webpack                from 'webpack';
import {devLoaders}           from './loaders';
import cssnano                from 'cssnano';
import BrowserSyncPlugin      from 'browser-sync-webpack-plugin';

/**
 * webpack development configuration
 */
export default {
  devtool: 'inline-source-map',
  watch  : true,
  reload : true,
  entry: [
    path.resolve( 'app/scripts', 'main.js' )
  ],
  output: {
    path: path.join(__dirname, '..', 'static'),
    filename: 'bundle.js',
    publicPath: '/app/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        DEV: true
    }),
    new BrowserSyncPlugin({
        proxy: 'http://localhost:8080/'
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: true
      })
  ],
  module: {
    loaders: [...devLoaders]
  },

  resolve: {
      modules: ['node_modules', 'app', 'scripts', 'sass', 'assets', 'libs', 'coffeePhysics', 'utils']
  },

  postcss: [
    cssnano({
      sourcemap: true,
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions']
      },
      safe: true,
      discardComments: {
        removeAll: true
      }
    })
  ]

}
