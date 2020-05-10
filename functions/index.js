/*
  Mr. Mordomo Fulfillment
*/
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const { dialogflow } = require('actions-on-google')
const Intl = require('intl')
const FieldValue = admin.firestore.FieldValue

// Configurar Firestore
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

// Criar app
const app = dialogflow({debug: true})

// Hoje
app.intent('Hoje', (conv) => {
  const now = new Date()
  now.setHours(now.getHours() - 4) // -04:00
  const resp = `Hoje é ${new Intl.DateTimeFormat('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now)}`
  conv.ask(resp)
  conv.ask('Mais alguma coisa, mestre ?')
})

// Rivotril
app.intent('Rivotril', async (conv, {gotas}) => {

  const g = parseInt(gotas)

  await db.collection('rivotril').doc().set({
    gotas: g,
    timestamp: FieldValue.serverTimestamp()
  })
  if (g >= 8 && g < 15) {
    conv.ask('Ok, registrado. Você tomou uma dose alta. Se cuide mais !')
  } else if (g >= 15) {
    conv.ask('Ok, registrado. Você tomou uma dose muito alta. Se cuide mais !')
  } else {
    conv.ask('Ok, registrado. Se cuide !')
  }
  conv.ask('Mais alguma coisa, mestre ?')
})

exports.webhook = functions.https.onRequest(app)
