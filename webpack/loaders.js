
export const devLoaders = [

  // sass
  {test: /\.scss$/, loaders: ['style', 'css', 'sass']},

  // images
  { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },

  {
    // javascript
    test    : /\.js$/,
    loader  : 'babel',
    exclude : /node_modules/,
    query: {
      presets: ['es2015', 'stage-0'],
      plugins : ['transform-async-to-generator', 'transform-object-assign', 'transform-runtime'],
      env : {
        development: {
          presets : [],
        }
      }
    }
  } // end babel/js loader

];

export const prodLoaders = [...devLoaders];
