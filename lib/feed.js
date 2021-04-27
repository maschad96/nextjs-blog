import { getSortedPostsData } from './posts';
import { siteTitle, author } from './siteInfo'
import { formatRFC7231, parseISO } from 'date-fns'
import fs from 'fs';

const blogPostsRssXml = (blogPosts) => {
	let latestPostDate = "";
	let rssItemsXml = "";
	blogPosts.forEach(post => {
		const postDate = Date.parse(post.date);
		if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
			latestPostDate = formatRFC7231(parseISO(post.date));
		}
		rssItemsXml += `
		<item>
		  <title>${post.title}</title>
		  <author>${author}</author>
		  <link>${post.href}</link> 
		  <pubDate>${formatRFC7231(parseISO(post.date))}</pubDate>
		  <description>
		  <![CDATA[${post.description}]]>
		  </description>
		  <content:encoded>
		  <![CDATA[${post.contentHtml}]]>
		  </content:encoded>
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
	<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	  <channel>
		  <title>${siteTitle}</title>
		  <link>https://www.matthewschad.com/</link>
		  <language>en</language>
		  <lastBuildDate>${latestPostDate}</lastBuildDate>
		  ${rssItemsXml}
	  </channel>
	</rss>`;
};

export async function writeRssFeed() {
	const blogPosts = await getSortedPostsData();
	const xml = getRssFeed(blogPosts);
	fs.writeFileSync('public/index.xml', xml);

	return {
		props: {
			xml: xml
		}
	}
}