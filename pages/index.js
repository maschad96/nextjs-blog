import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout from '../components/layout'
import { getSortedPostsData } from '../lib/posts'
import { writeRssFeed } from '../lib/feed'
import { siteTitle } from '../lib/siteInfo'
import utilStyles from '../styles/utils.module.css'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </Head>
      <section>
        <p>Hi, I'm Matt.</p>

        <p>I'm a USA-based full stack software engineer, currently working at Microsoft, more specifically on <a href="https://docs.microsoft.com/">Microsoft Docs and Microsoft Learn</a></p>

        <p>I write about interesting things I learn about related to technology, life, and decision making</p>

        <p>The fundamentals I stick to are JavaScript, HTML, and CSS - though it is constantly changing. Right now, my focus is revolving around web performance, React, and Electron.</p>

      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  await writeRssFeed();
  return {
    props: {
      allPostsData
    }
  }
}