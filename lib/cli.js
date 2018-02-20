const commandLineArgs = require('command-line-args')
const optionDefinitions = [
    {name: 'from', alias: 'f', type: String},
    {name: 'to', alias: 't', type: String},
    {name: 'date', alias: 'd', type: String},
    {name: 'tgvmax-n', type: String, defaultOption: process.env.TGVMAX_NUMBER},
    {name: 'birth-date', type: String, defaultOption: process.env.BIRTH_DATE}
]

module.exports = () => {
    const options = commandLineArgs(optionDefinitions)

    if (!options.from)
        throw new Error('From option is needed!')
    if (!options.to)
        throw new Error('To option is needed!')
    if (!options.date)
        throw new Error('Date option is needed!')
    if (!options.date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/))
        throw new Error('Date option need to be at format YYYY-MM-DD!')
    if (!options['tgvmax-n'])
        throw new Error('TGVMax card number option is needed!')
    if (!options['birth-date'])
        throw new Error('Birth date option is needed!')

    require('./check')({
        passenger: {
            commercialCardType: 'HAPPY_CARD',
            commercialCardNumber: options['tgvmax-n'],
            birthDate: options['birth-date']
        },
        date: options.date,
        originCode: options.from,
        destinationCode: options.to,
        verbose: true
    })
}