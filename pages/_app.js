import '../styles/global.css'

const App = ({ Component, pageProps }) => {
	return (
		<>
			<Component {...pageProps} />
			<script src="/scripts/netlify-identity.js" />
		</>
	)
}
export default App;