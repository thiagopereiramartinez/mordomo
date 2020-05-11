/*
  Mr. Mordomo Fulfillment
*/
const functions = require('firebase-functions')
const { dialogflow } = require('actions-on-google')
const RivotrilModule = require('./modules/rivotril')
const GatosModule = require('./modules/gatos')
const CasamentoModule = require('./modules/casamento')
const Intl = require('intl')

// Criar app
const app = dialogflow({debug: true})

// Rivotril
new RivotrilModule(app)

// Gatos
new GatosModule(app)

// Casamento
new CasamentoModule(app)

// Hoje
app.intent('Hoje', (conv) => {
  const now = new Date()
  now.setHours(now.getHours() - 4) // -04:00
  const resp = `Hoje é ${new Intl.DateTimeFormat('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now)}`
  conv.ask(resp)
  conv.ask('Mais alguma coisa, mestre ?')
})

exports.webhook = functions.https.onRequest(app)
