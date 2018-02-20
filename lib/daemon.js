const cron = require('node-cron')
const request = require('request')
const check = require('./check')
const moment = require('moment')
moment.locale('fr')

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
                available.forEach((journey) => {
                    let message = 'Un nouveau trajet ' + journey.origin +
                        ' (' + moment(journey.departureDate).format('HH:mm') + ') -> ' +
                        journey.destination + ' ' +
                        '(' + moment(journey.arrivalDate).format('HH:mm') + ')' +
                        'est disponible ! ' +
                        journey.segments.map((segment) => {
                            return segment.transporter + ' nº' + segment.trainNumber
                        }).join(' ')
                    let endpoint = 'https://smsapi.free-mobile.fr/sendmsg'
                    endpoint += '?user=' + process.env.FREE_API_USER
                    endpoint += '&pass=' + process.env.FREE_API_PASSWORD
                    endpoint += '&msg=' + message
                    if (process.env.FREE_API_USER && process.env.FREE_API_PASSWORD)
                        request.get(endpoint)
                })
            })
        })
    })

}