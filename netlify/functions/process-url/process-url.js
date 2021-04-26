const cloudinary = require('cloudinary').v2;
const qs = require('querystring');
cloudinary.config({
	cloud_name: 'dhntcnejj',
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

exports.handler = async function (event, ctx) {
	const { queryStringParameters } = event;
	try {
		// https://res.cloudinary.com/sector/image/upload/v1583637123/og-images/img-1.png
		const imageUrl = cloudinary.url(
			`${process.env.OG_IMAGE_VERSION}/og-images/img-2.png`,
			{
				// resouce_type: "raw"
				sign_url: true,
				// secure: true,
				custom_pre_function: {
					function_type: 'remote',
					source: `https://mystifying-allen-8ced63.netlify.app/.netlify/functions/generate-og-image?${qs.stringify(
						queryStringParameters
					)}`,
				},
			}
		);
		console.log(
			`https://mystifying-allen-8ced63.netlify.app/.netlify/functions/generate-og-image?${qs.stringify(
				queryStringParameters
			)}`
		);
		return {
			statusCode: 302,
			headers: {
				Location: imageUrl,
			},
			body: '',
		};
	} catch (e) {
		console.log(e);
	}
};
