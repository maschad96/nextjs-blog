import Layout from '../../components/layout';
import Head from 'next/head';
import { getAllPostIds, getPostData } from '../../lib/posts';
import getOgImage from '../../lib/getOgImage';
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css';

export default function Post({ ogImage, postData }) {
	return (
		<Layout>
			<Head>
				<title>{postData.title}</title>
				<meta name="description" content={postData.description} />
				<meta name="og:title" content={postData.title} />
				<meta property="og:image" content={ogImage} key="og-image" />
			</Head>
			<article>
				<h1 className={utilStyles.headingXl}>{postData.title}</h1>
				<div className={utilStyles.lightText}>
					<Date dateString={postData.date} />
				</div>
				<div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
			</article>
		</Layout>

	)
}

export async function getStaticPaths() {
	// Return a list of possible values for id
	const paths = getAllPostIds();
	return {
		paths,
		fallback: false
	}
}

export async function getStaticProps({ params }) {
	// Fetch necessary data for the blog post using params.id
	const postData = await getPostData(params.id);
	const ogImage = await getOgImage(
		`/ogImage?title=${encodeURIComponent(postData.title)}&url=${process.env.DEPLOY_URL}/${params.id}`
	);
	return {
		props: {
			postData,
			ogImage
		}
	}
}