install:
	cd netlify/functions/generate-og-image && npm i && cd ../../../ && npm run build && npm run export