const cfg = require('./src/config')
const ver = require('./src/version')
const GenerateJsonFile = require('generate-json-file-webpack-plugin')

const IsProduction = process.env.NODE_ENV === 'production'

module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? cfg.web.pro : cfg.web.dev,
  productionSourceMap: !IsProduction,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].templateParameters = {
        API_BASE_URL: IsProduction ? cfg.api.pro : cfg.api.dev,
        WEB_BASE_URL: IsProduction ? cfg.web.pro : cfg.web.dev,
        APP_TITLE: cfg.app.title,
        APP_VERSION: ver.version
      }
      return args
    })
  },
  configureWebpack: {
    plugins: [
      new GenerateJsonFile({
        filename: 'site.json',
        value: {
          guid: cfg.app.guid,
          version: ver.version
        }
      })
    ]
  }
}
