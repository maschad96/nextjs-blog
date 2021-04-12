import { getSortedPostsData } from './posts';
import { siteTitle, author } from './siteInfo'
import fs from 'fs';

const blogPostsRssXml = (blogPosts) => {
	let latestPostDate = "";
	let rssItemsXml = "";
	blogPosts.forEach(post => {
		const postDate = Date.parse(post.date);
		if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
			latestPostDate = post.date;
		}
		rssItemsXml += `
		<item>
		  <title>${post.title}</title>
		  <link>${post.href}</link> 
		  <pubDate>${post.date}</pubDate>
		  <description>
		  <![CDATA[${post.description}]]>
		  </description>
		  <author>${author}</author>
	  </item>`;
	});
	return {
		rssItemsXml,
		latestPostDate
	};
};

const getRssFeed = (blogPosts) => {
	const { rssItemsXml, latestPostDate } = blogPostsRssXml(blogPosts);
	return `<?xml version="1.0" ?>
	<rss version="2.0">
	  <channel>
		  <title>${siteTitle}</title>
		  <link>https://www.bergqvist.it</link>
		  <language>en</language>
		  <lastBuildDate>${latestPostDate}</lastBuildDate>
		  ${rssItemsXml}
	  </channel>
	</rss>`;
};

export async function writeRssFeed() {
	const blogPosts = getSortedPostsData();
	const xml = getRssFeed(blogPosts);
	fs.writeFileSync('public/index.xml', xml);

	return {
		props: {
			xml: xml
		}
	}
}