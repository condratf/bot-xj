import puppeteer, { ElementHandle } from 'puppeteer'
import { delay, getCreds } from './utils'

const url = getCreds().url

export async function sessionScenario() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ["--window-size=2400,1239"]
  })

  const page = await browser.newPage()

  await page.goto(url, { timeout: 0 })

  await delay(3500)

  let selectEl: ElementHandle<HTMLSelectElement>
  const elems = await page.$$('select')
  elems.forEach((e, i) => {if (i === 1) {selectEl = e}} )

  const optionElem = await selectEl.$('option[value="20"]')

  await page.evaluate((optionElem, selectEl) => {
    optionElem.selected = true
    const event = new Event('change', { bubbles: true })
    selectEl.dispatchEvent(event)
  }, optionElem, selectEl)

  await page.click('#btnAceptar')
  await page.waitForNavigation()

  await delay(1000)

  const el = (await page.$$('#btnEntrar'))[0]
  await el.click()
  await page.waitForNavigation()

  const radio = (await page.$$('#rdbTipoDocPas'))[0]
  await radio.click()

  const inputElement = await page.$(`#txtIdCitado`)
  await inputElement.type(getCreds().n)

  await delay(1000)

  const inputElement2 = await page.$(`#txtDesCitado`)
  await inputElement2.type(getCreds().name)

  const mouse = page.mouse;

  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * 800);
    const y = Math.floor(Math.random() * 600);

    await mouse.move(x, y);
    await mouse.down();
    await mouse.up();
  }

  await delay(3000)

  
  await page.click('#btnEnviar')
  await page.waitForNavigation()
  
  await delay(50000)

  await page.click('#btnEnviar')
  await page.waitForNavigation()

  await delay(3000)

  const isTextPresent = await page.evaluate(() => {
    const el  = document.getElementsByClassName('mf-msg__info')[0] as HTMLParagraphElement
    return el && el.innerText.includes('en este momento')
  })

  console.log(isTextPresent)

  await delay(32000)
  await browser.close()

  return Promise.resolve(isTextPresent)
}