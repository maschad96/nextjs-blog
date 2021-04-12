import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

function getHref(id) {
	return new URL(`https://matthewschad.com/posts/${id}`).toString();
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory);
	return fileNames.map(fileName => {
		return {
			params: {
				id: fileName.replace(/\.md$/, '')
			}
		}
	})
}

export async function getPostData(id) {
	const fullPath = path.join(postsDirectory, `${id}.md`)
	const fileContents = fs.readFileSync(fullPath, 'utf-8')
	const matterResult = matter(fileContents)
	const processedHTML = await remark()
		.use(html)
		.process(matterResult.content)
	const contentHtml = processedHTML.toString()
	const date = new Date(matterResult.data.date).toISOString()
	matterResult.data.date = date;

	return {
		id,
		contentHtml,
		...matterResult.data
	}
}

export function getSortedPostsData() {
	const fileNames = fs.readdirSync(postsDirectory)
	const allPostsData = fileNames.map(fileName => {
		const id = fileName.replace(/\.md$/, '');
		const fullPath = path.join(postsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf-8')
		const matterResult = matter(fileContents)
		const date = new Date(matterResult.data.date).toISOString()
		matterResult.data.date = date;
		matterResult.data.href = getHref(id);

		return {
			id,
			...matterResult.data
		}
	})
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1
		} else {
			return -1
		}
	})
}