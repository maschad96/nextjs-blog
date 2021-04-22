install:
	cd netlify/functions/generate-og-image && npm i && npm run build 
	cd netlify/functions/process-url && npm i
	npm run build && npm run export