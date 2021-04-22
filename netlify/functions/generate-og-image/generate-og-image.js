const fs = require('fs');
const path = require('path');
const playwright = require('playwright-aws-lambda');
const script = fs.readFileSync(path.join(__dirname, '/image.js'), 'utf-8');
const profileImage = fs.readFileSync(path.join(__dirname, 'profile.jpeg'), {
	encoding: 'base64',
});

const handler = async (event, ctx) => {
	const browser = await playwright.launchChromium();
	const context = await browser.newContext({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: process.env.NETLIFY === 'true' ? 1 : 2,
	});
	const page = await context.newPage();
	page.on('pageerror', (exception) => {
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
	const { queryStringParameters } = event;
	await page.addStyleTag({
		url: 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css',
	});
	await page.addScriptTag({
		content: `
    window.title = "${queryStringParameters.title || 'No Title'}";
    window.path = "${queryStringParameters.id || ''}";
    window.base64Profile = "data:image/png;base64, ${profileImage}";
  `,
	});
	const string = await page.evaluate(() => window.base64Profile);
	console.log(string);
	await page.addScriptTag({ content: script });

	const boundingRect = await page.evaluate(() => {
		const corgi = document.getElementById('corgi');
		console.log(corgi);
		const {
			x,
			y,
			width,
			height,
		} = corgi.children[0].getBoundingClientRect();
		return { x, y, width, height };
	});

	const screenshotBuffer = await page.screenshot({ clip: boundingRect });
	await browser.close();
	return {
		isBase64Encoded: true,
		statusCode: 200,
		headers: {
			'Content-Type': 'image/png',
			'Content-Length': screenshotBuffer.length.toString(),
		},
		body: screenshotBuffer.toString('base64'),
	};
};

module.exports = { handler };
