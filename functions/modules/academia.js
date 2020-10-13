// Módulo de academia
class AcademiaModule {

    constructor(app) {
        this.app = app

        // Reservar academia
        app.intent('Academia', async (conv, params) => {
            const { date, time } = params
            const given_name = params["given-name"]

            console.log(`DATE=${date} TIME=${time} NAME=${given_name}`)

            conv.ask('Pronto !')
        })
    }

}

module.exports = AcademiaModule
