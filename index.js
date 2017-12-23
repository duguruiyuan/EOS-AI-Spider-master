const puppeteer = require('puppeteer')
const moment = require('moment')

const EOSbithumb = `https://www.bithumb.com/trade/order/EOS`
const EOSbinance = `https://www.binance.com/trade.html?symbol=EOS_ETH`

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const fetchEosPrice = async () => {

    const bithumb = await puppeteer.launch({ timeout: 500000 })
    const binance = await puppeteer.launch({ timeout: 500000, headless: false })

    const bithumbPage = await bithumb.newPage()
    const binancePage = await binance.newPage()

    await bithumbPage.goto(EOSbithumb)
    await binancePage.goto(EOSbinance)

    await sleep(5000)

    let bithumbResult = await bithumbPage.evaluate(() =>  {
        let resultText = document.querySelectorAll('.group_end')[1].innerText
        let result     = parseFloat(resultText.replace(',', '.'))

        return result
    })

    let BinanceResult = await binancePage.evaluate(() =>  {
        let result = document.querySelector('.kline-para ul li strong').innerText
        result     = parseFloat(result)

        return result
    })

    let EOSINBITHUMB = bithumbResult * 1.054 * 10;
    let EOSBINANCE   = BinanceResult * 10000;

    console.log(`当前韩国的EOS/ETH价格是${EOSINBITHUMB}； 时间是 ${moment().format('HH:mm:ss')}`)
    console.log(`当前币安的EOS/ETH价格是${EOSBINANCE}； 时间是 ${moment().format('HH:mm:ss')}`)

    await bithumbPage.close()
    await binancePage.close()
}

const main = async () => {
    while (true) {
        try {
            await fetchEosPrice()
            await sleep(10000)
        }

        catch (e){
            console.log(e)
        }
    }
}

main()
