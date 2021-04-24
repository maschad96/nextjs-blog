import '../styles/global.scss'
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import markdown from 'highlight.js/lib/languages/markdown';
import { useEffect } from 'react';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('markdown', markdown);

const App = ({ Component, pageProps }) => {
	useEffect(() => {
		hljs.highlightAll();
	})
	return (
		<>
			<Component {...pageProps} />
		</>
	)
}
export default App;