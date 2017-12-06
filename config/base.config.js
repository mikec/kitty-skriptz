const fs = require('fs')

module.exports = environment => (options) => ({
  entry: [
    './contracts'
  ],
  output: {
    path: './deploys',
    filename: 'environments.json',
    safe: true
  },
  module: {
    environment,
    preLoaders: [
      { test: /(environments)\.(json)$/, loader: 'ethdeploy-environment-loader', build: true }
    ],
    loaders: [
      {
        test: /\.(sol)$/,
        loader: 'lk-ethdeploy-solc-loader',
        optimize: 1,
        filterFilenames: true,
        filterWarnings: true,
        importResolves: ['node_modules']
      }
    ],
    deployment: (deploy, contracts, done) => {
      deploy(contracts.ShrimpCoin)
      .then(() => {
        done()
      })
    }
  },
  plugins: [
    new options.plugins.IncludeContracts(['ShrimpCoin']),
    new options.plugins.JSONFilter(),
    new options.plugins.JSONExpander()
  ]
})
