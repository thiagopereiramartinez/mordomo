// Módulo de academia
class AcademiaModule {

    constructor(app) {
        this.app = app

        // Reservar academia
        app.intent('Academia', async (conv, attrs) => {
            console.log(attrs)

            conv.ask('Pronto !')
        })
    }

}

module.exports = AcademiaModule
