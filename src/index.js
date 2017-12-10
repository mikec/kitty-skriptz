require('babel-register')
require('babel-polyfill')

const Eth = require('ethjs')

const conf = require('./conf.default').default
const eth = new Eth(new Eth.HttpProvider(conf.providerUrl))

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('info', 'Gets some basic info')
  .command('stuff', 'stuuuuf')
  .argv

require(`./commands/${argv._[0]}`).default(argv, conf, eth).then(() => {
  console.log('')
}, (err) => {
  console.error(err)
})
