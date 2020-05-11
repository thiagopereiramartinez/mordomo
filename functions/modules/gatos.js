const axios = require('axios').default
const { Image } = require('actions-on-google')

// Módulo de gatinhos
class GatosModule {

  constructor(app) {
    this.app = app
    this.apiKey = "7ef4f9b8-e040-4290-b4a7-3c029927b542"

    // Fotos de Gatos
    app.intent('Fotos de gatos', async conv => {

      const resp = await axios.get('https://api.thecatapi.com/v1/images/search', {
        headers: {
          'x-api-key': this.apiKey
        },
        responseType: 'json'
      })

      const { url, width, height } = resp.data.pop()

      conv.ask('Claro, aqui está a foto de um gatinho...')
      conv.ask(new Image({
        url: url,
        alt: "Um gato",
        width: width,
        height: height
      }))

      conv.ask('Mais alguma coisa, mestre ?')
    })
  }

}

module.exports = GatosModule
