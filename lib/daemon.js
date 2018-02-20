const cron = require('node-cron')
const check = require('./check')

module.exports = (daemons) => {

    daemons.forEach((daemon) => {
        cron.schedule('*/5 * * * *', () => {
            check({
                passenger: {
                    commercialCardType: 'HAPPY_CARD',
                    commercialCardNumber: daemon.TGVMAX_NUMBER || process.env.TGVMAX_NUMBER,
                    birthDate: daemon.BIRTH_DATE || process.env.BIRTH_DATE
                },
                date: daemon.date,
                originCode: daemon.originCode,
                destinationCode: daemon.destinationCode,
                verbose: true
            }, (available) => {
                console.log(available)
            })
        })
    })

}