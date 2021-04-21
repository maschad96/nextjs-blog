const fs = require('fs');
const path = require('path');
const playwright = require('playwright-aws-lambda');
const script = fs.readFileSync(path.join(__dirname, '/image.js'), 'utf-8');


const handler = async (event, ctx) => {
  console.log('script: ', script);
  const browser = await playwright.launchChromium();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: process.env.NETLIFY === 'true' ? 1 : 2,
  });
  const page = await context.newPage();
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${exception}"`);
  });
  await page.setContent(`< !DOCTYPE html >
    <html>
      <head>
        <meta charset="utf-8" />
      </head>

      <body>
        <div id="corgi"><div>CORGIIIS</div></div>
      </body>
    </html>
  `);
  await page.addScriptTag({ content: script })
  const corgi = await page.evaluate(() => {
    return document.getElementById("corgi");
  });
  console.log(corgi);
  const boundingRect = await page.evaluate(() => {
    const corgi = document.getElementById("corgi");
    console.log(corgi);
    const { x, y, width, height } = corgi.children[0].getBoundingClientRect();
    return { x, y, width, height };
  });

  const screenshotBuffer = await page.screenshot({ clip: boundingRect });
  await browser.close();
  return {
    isBase64Encoded: true,
    statusCode: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": screenshotBuffer.length.toString()
    },
    body: screenshotBuffer.toString("base64")
  };
}

module.exports = { handler }
