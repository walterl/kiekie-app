module.exports = {
  entry: './www/js',
  output: {
    path: 'www/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel',
        include: __dirname + '/www/js'
      }
    ]
  }
};
