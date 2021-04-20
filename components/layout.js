import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { name, siteTitle } from '../lib/siteInfo';

const Layout = ({ children, home }) => (
	<div className={styles.container}>
		<Head>
			<link rel="icon" href="/favicon.ico" />
			<meta
				name="description"
				content="Learn how to build a personal website using Next.js"
			/>
			<meta name="og:title" content={siteTitle} />
			<meta name="twitter:card" content="summary_large_image" />
		</Head>
		<header className={styles.header}>
			{home ? (
				<>
					<img
						src="/images/profile.jpeg"
						className={utilStyles.borderCircle}
						height={144}
						width={144}
						alt={name}
					/>
					<h1 className={utilStyles.heading2Xl}>{name}</h1>
				</>
			) : (
				<>
					<Link href="/">
						<a>
							<img
								src="/images/profile.jpeg"
								className={utilStyles.borderCircle}
								height={108}
								width={108}
								alt={name}
							/>
						</a>
					</Link>
					<h2 className={utilStyles.headingLg}>
						<Link href="/">
							<a className={utilStyles.colorInherit}>{name}</a>
						</Link>
					</h2>
				</>
			)}
		</header>
		{!home && (
			<div className={styles.backToHome}>
				<Link href="/">
					<a>← Back to home</a>
				</Link>
			</div>
		)}
		<main>{children}</main>
	</div>
)

export default Layout