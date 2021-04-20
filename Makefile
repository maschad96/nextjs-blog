install:
	cd netlify/functions/generate-og-image && npm i && npm run build && cd ../../../ && npm run build && npm run export