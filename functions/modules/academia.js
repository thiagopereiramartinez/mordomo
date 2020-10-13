const puppeteer = require('puppeteer')

// Módulo de academia
class AcademiaModule {

    constructor(app) {
        this.app = app
        this.properties = {
            "thiago": {
                "cpf": "04224177188",
                "password": "554860Ti"
            },
            "aline": {
                "cpf": "03595605128",
                "password": "554860Ti"
            }
        }

        // Reservar academia
        app.intent('Academia', async (conv, params) => {
            const { date, time } = params
            const given_name = params["given-name"]

            const date_parsed = new Date(date)
            const time_parsed = new Date(time)
            const props = this.properties[given_name.toLowerCase()]
            if (props == undefined) {
                conv.ask(`O nome ${given_name} não foi encontrado.`)
                return
            }

            console.log(`DATE=${date} TIME=${time} NAME=${given_name}`)

            try {
                await reservar(props, date_parsed, time_parsed)
                conv.ask('Pronto, foi reservado !')
            } catch (e) {
                console.error(e)
                conv.ask('Ocorreu um erro ao solicitar a reserva. Tenta novamente mais tarde !')
            }
        })
    }

    async reservar(props, date, time) {
        const browser = await puppeteer.launch({headless: true})
        const page = (await browser.pages()).shift()
        await page.setViewport({width: 1366, height: 768})
        await page.goto('https://www.smartfit.com.br/person_sessions/new', {waitUntil: 'networkidle2'})
        
        // Type CPF, Password and submit
        await page.type('#login', props.cpf, {delay: 50})
        await page.type('#person_session_password', props.password, {delay: 50})
        await page.click('#s_login')
    
        await page.waitForSelector('a.js-booking-button')
    
        await page.click('a.js-booking-button')
        await page.waitForTimeout(3000)
    
        const reservasPage = (await browser.pages()).pop()
        await reservasPage.goto(`http://reservas.smartfit.com.br/klasses?date=${date.toLocaleDateString()}&location_acronym=MTCGOI1&utf8=%E2%9C%93`, {waitUntil: 'networkidle2'})
        await reservasPage.waitForSelector('.Card__item')
    
        const [button] = await reservasPage.$x(`//div[contains(@class, "Card__item") and contains(., "${date.getDate()}/${date.getMonth() + 1} ${time.getHours()}:${time.getMinutes()}")]/div[3]/a`)
        await button.click()
    
        await browser.close()
    }

}

module.exports = AcademiaModule
