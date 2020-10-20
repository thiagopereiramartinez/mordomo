const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Intl = require('intl')
const FieldValue = admin.firestore.FieldValue

// Configurar Firestore
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

// Módulo de Rivotril
class RivotrilModule {

  constructor(app) {
    this.app = app
    this.registarRivotril()
  }

  // Registrar novo lançamento de Rivotril
  registarRivotril() {

    // Rivotril
    this.app.intent('Rivotril', async (conv, {gotas}) => {

      gotas = parseInt(gotas)
      conv.ask(`Deseja registrar as ${gotas} gotas de Rivotril ?`)

    })

    // Rivotril - Sim
    this.app.intent('Rivotril - yes', async conv => {

      const gotas = parseInt(conv.contexts.input['rivotril-followup'].parameters.gotas[0])

      await db.collection('rivotril').doc().set({
        gotas: gotas,
        timestamp: FieldValue.serverTimestamp()
      })
      if (gotas >= 8 && gotas < 15) {
        conv.ask('Ok, registrado. Você tomou uma dose alta. Se cuide mais !')
      } else if (gotas >= 15) {
        conv.ask('Ok, registrado. Você tomou uma dose muito alta. Se cuide mais !')
      } else {
        conv.ask('Ok, registrado. Se cuide !')
      }
      conv.ask('Mais alguma coisa, mestre ?')

    })

    // Rivotril - Não
    this.app.intent('Rivotril - no', async conv => {

      conv.ask('Ok, não irei registrar.')
      conv.ask('Mais alguma coisa, mestre ?')

    })

    // Ultima vez - Rivotril
    this.app.intent('Ultima vez - Rivotril', async conv => {

      const snapshot = await db.collection('rivotril').orderBy('timestamp', 'desc').limit(1).get()
      if (snapshot.empty) {
        conv.ask('Não encontrei nenhum registro.')
        conv.ask('Mais alguma coisa, mestre ?')
        return
      }

      snapshot.forEach(doc => {
        const reg = doc.data()
        const date = reg.timestamp.toDate()
        date.setHours(date.getHours() - 4)

        conv.ask(`<speak>A última vez que você tomou Rivotril, foram ${reg.gotas} gotas, no dia <say-as interpret-as="date" format="dm">${
          new Intl.DateTimeFormat('pt-BR', {
            month: 'numeric',
            day: 'numeric'
          }).format(date)
        }</say-as> às <say-as interpret-as="time" format="hms24">${
          new Intl.DateTimeFormat('pt-BR', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          }).format(date)
        }</say-as>.</speak>`)
        conv.ask('Mais alguma coisa, mestre ?')
      })

    })

  }


}

module.exports = RivotrilModule
