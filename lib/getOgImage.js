const playwright = require('playwright-aws-lambda');
const { createHash } = require('crypto');
const fs = require('fs');

async function getOgImage(path, baseUrl = process.env.NETLIFY_DEPLOY_URL) {

	// if (process.env.NODE_ENV === 'development') {
	// 	return 'og image will be generated in production';
	// }

	const url = `${baseUrl}${path}`;
	const hash = createHash('md5').update(url).digest('hex');
	const browser = await playwright.launchChromium({ headless: true });
	const ogImageDir = `./public/images/og`;
	const imagePath = `${ogImageDir}/${hash}.png`;
	const publicPath = `${process.env.DEPLOY_URL}/images/og/${hash}.png`;

	try {
		fs.statSync(imagePath);
		return publicPath;
	} catch (error) {
		// file does not exists, so we create it
	}

	const context = await browser.newContext({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: process.env.NETLIFY === 'true' ? 1 : 2,
	});

	const page = await context.newPage();
	await page.goto(url, { waitUntil: 'domcontentloaded' });
	const buffer = await page.screenshot({ type: 'png' });
	await browser.close();

	fs.mkdirSync(ogImageDir, { recursive: true });
	fs.writeFileSync(imagePath, buffer);

	return publicPath;
}

export default getOgImage;
