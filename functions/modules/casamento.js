// Módulo de casamento
class CasamentoModule {

  constructor(app) {
    this.app = app

    // Dias para o casamento
    app.intent('Casamento', async conv => {

      const now = new Date()
      now.setHours(now.getHours() - 4)

      const dia_casamento = new Date(2021, 3, 10)
      const diff = Math.abs(dia_casamento.getTime() - now.getTime())
      const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))

      conv.ask(`Faltam ${dias} dias para o seu casamento.`)
      conv.ask('Mais alguma coisa, mestre ?')
    })
  }

}

module.exports = CasamentoModule
