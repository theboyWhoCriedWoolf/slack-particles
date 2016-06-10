require("babel-polyfill");

import path              from 'path';
import webpack           from 'webpack';
import {prodLoaders}     from './loaders';
import devConfig         from './webpack.config.dev.babel';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';

const prodConfig = Object.assign( {}, devConfig, {

    watch : false,

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            DEV: false
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
            }
        })
    ],

    module: {
      loaders: [...prodLoaders]
    },

});



export default prodConfig;
