// Módulo de academia
class AcademiaModule {

    constructor(app) {
        this.app = app

        // Reservar academia
        app.intent('Academia', async (conv, {date, time, given_name}) => {
            console.log(`DATE=$date TIME=$time NAME=${given_name}`)

            conv.ask('Pronto !')
        })
    }

}

module.exports = AcademiaModule
