const cfg = require('./src/config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateJsonFile = require('generate-json-file-webpack-plugin')

module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? cfg.web.pro : cfg.web.dev,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].templateParameters = {
        API_BASE_URL: process.env.NODE_ENV === 'production' ? cfg.api.pro : cfg.api.dev,
        WEB_BASE_URL: process.env.NODE_ENV === 'production' ? cfg.web.pro : cfg.web.dev,
        APP_TITLE: cfg.app.title
      }
      return args
    })
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: './src/version.js',
          to: './version.js',
          toType: 'file'
        }
      ], {}),
      new GenerateJsonFile({
        filename: 'id.json',
        value: {
          md5: cfg.app.id
        }
      })
    ]
  }
}
