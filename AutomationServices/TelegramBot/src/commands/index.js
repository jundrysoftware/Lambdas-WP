const whoami = require('./whoami')
const ping = require('./ping')
const help = require('./help')
const start = require('./start')
const associate = require('./associate')
const contact = require('./contact')
const total = require('./total')

module.exports = initCommands = (bot) => {
    start(bot);
    help(bot);
    associate(bot);
    contact(bot);
    whoami(bot);
    ping(bot);
    total(bot);
}