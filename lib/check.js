const request = require('request')
const async = require('async')
const _ = require('lodash')
const moment = require('moment')
moment.locale('fr')

const defaultConfig = {
    verbose: false,

    passenger: {
        profile: "YOUNG",
        age: 12,
        birthDate: "",
        fidelityCardType: "NONE",
        fidelityCardNumber: null,
        commercialCardNumber: "",
        commercialCardType: ""
    },
    date: '2018-02-25',
    originCode: "FRMPL",
    destinationCode: "FRPAR"
}
module.exports = (config, next) => {
    config = Object.assign(defaultConfig, config)
    const date = config.date
    let data = {
        //origin: "Montpellier Saint-Roch",
        originCode: config.originCode,
        originLocation:
            {
                id: null,
                label: null,
                longitude: null,
                latitude: null,
                type: null,
                country: null,
                stationCode: config.originCode,
                stationLabel: null
            },
        //destination: "Paris (Toutes gares intramuros)",
        destinationCode: config.destinationCode,
        destinationLocation:
            {
                id: null,
                label: null,
                longitude: null,
                latitude: null,
                type: null,
                country: null,
                stationCode: config.destinationCode,
                stationLabel: null
            },
        via: null,
        viaCode: null,
        viaLocation: null,
        asymmetrical: false,
        professional: false,
        customerAccount: false,
        oneWayTravel: true,
        returnDate: null,
        travelClass: "SECOND",
        country: "FR",
        language: "fr",
        busBestPriceOperator: null,
        passengers: [{
            travelerId: null,
            profile: config.passenger.profile,
            age: config.passenger.age,
            birthDate: config.passenger.birthDate,
            fidelityCardType: config.passenger.fidelityCardType,
            fidelityCardNumber: config.passenger.fidelityCardNumber,
            commercialCardNumber: config.passenger.commercialCardNumber,
            commercialCardType: config.passenger.commercialCardType,
            promoCode: "",
            lastName: null,
            firstName: null,
            phoneNumer: null,
            hanInformation: null
        }],
        animals: [],
        bike: "NONE",
        withRecliningSeat: false,
        physicalSpace: null,
        fares: [],
        withBestPrices: false,
        highlightedTravel: null,
        nextOrPrevious: false,
        source: "FORM_SUBMIT",
        targetPrice: null,
        han: false,
        outwardScheduleType: "BY_DEPARTURE_DATE",
        inwardScheduleType: "BY_DEPARTURE_DATE",
        currency: null,
        companions: [],
        $initial: true,
        $queryId: "5NEHN",
        directTravel: true
    }

    let results = []
    async.each(['08:00:00', '16:00:00'], (time, cb) => {
        data.departureDate = date + "T" + time
        request({
            url: 'https://www.oui.sncf/proposition/rest/search-travels/outward',
            method: 'POST',
            json: data
        }, (err, response, body) => {
            if (err)
                return console.error(err)
            results = results.concat(body.results)
            return cb(undefined)
        })
    }, (err) => {
        if (err)
            return console.error(err)
        results = _.uniqBy(results, 'id')
        results = _.orderBy(results, ['departureDate'], ['asc'])

        results = results.map((result) => {
            if (result.pushProposalType)
                return
            result.tgvmax = result.priceProposals && result.priceProposals.SEMIFLEX && result.priceProposals.SEMIFLEX.flags.indexOf('TGVMAX') !== -1 && result.priceProposals.SEMIFLEX.amount === 0.0
            if (config.verbose) {
                console.log(
                    '\033[4m' +
                    result.origin + ' ' +
                    moment(result.departureDate).format('HH:mm') +
                    ' -> ' +
                    result.destination + ' ' +
                    moment(result.arrivalDate).format('HH:mm') +
                    '\033[0m  - ' +
                    result.segments.map((segment) => {
                        return segment.transporter + ' nº' + segment.trainNumber
                    }).join(' ')
                )
                console.log('> TGVMAX: ' + (result.tgvmax ? '\033[0;32mOUI' : '\033[0;31mNON') + '\033[m')
            }
            return result
        })
        if (next)
            next(_.filter(results, {tgvmax: true}))
    })
}