const chromium = require('chrome-aws-lambda');
const puppeteer = require("puppeteer-core")

const getSession = async (user, password, seccondpass) => {

    return new Promise(async (resolve, reject) => {


        const browser = await chromium.puppeteer.launch({
            executablePath: await chromium.executablePath,
            args: [...chromium.args, '--enable-features=NetworkService'],
            defaultViewport: chromium.defaultViewport,
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setRequestInterception(true);

        page.on('request', request => {
            request.continue();
            if (request.resourceType() === 'xhr') {
                if (request.url().endsWith('validateSession')) {
                    const data = JSON.parse(request.postData())
                    browser.close()
                    resolve(data.idSession)
                }
            }

        });

        await page.goto("https://usuario.midatacredito.com/login?product=midc", {
            waitUntil: ["networkidle0", "load", "domcontentloaded"]
        });

        await page.type('#documento', user);

        await page.type('#password', password)

        await page.click('button[type=submit]')

        await page.waitForTimeout(2000);

        try {
            await page.waitForSelector('#answer')

            await page.type('#answer', seccondpass)

            await page.click('button[type=submit]')

        } catch (error) {

        }

        await browser.close()
    });


}

module.exports = {
    getSession
}