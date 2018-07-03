var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new SWPrecacheWebpackPlugin({
        cacheId: 'squarelet',
        filename: 'service-worker.js',
        staticFileGlobs: ['dist/**/*.{js,html,css,woff,woff2,ttf,eot}'],
        minify: true,
        stripPrefix: 'dist/'
      })
    ]
  }
}
