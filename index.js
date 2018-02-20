const cli = require('./lib/cli')
if (process.argv.length > 2)
    return cli()

console.info('Launching daemons...')
require('./lib/daemon')(require('./config/config.json').daemons)
