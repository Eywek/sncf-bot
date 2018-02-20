module.exports = {

    passenger: {
        profile: "YOUNG",
        age: 12,
        birthDate: "",
        fidelityCardType: "NONE",
        fidelityCardNumber: null,
        commercialCardNumber: "",
        commercialCardType: "HAPPY_CARD"
    },

    date: process.env.TRAVEL_DATE || '2018-02-25',

    originCode: process.env.TRAVEL_ORIGIN || "FRMPL",
    destinationCode: process.env.TRAVEL_DESTINATION || "FRPAR"
}