/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from 'react-dom';


function getFontSize(length) {
	if (length >= 50) {
		return `text-5xl`;
	}

	if (length >= 32) {
		return `text-7xl`;
	}

	return `text-9xl`;
}

// Example URL: http://localhost:3000/ogImage?title=Hello%20mein%20Name%20ist%20Florian!&url=https://mattjschad.com/hello-world
function App() {
	return (
		<div
			className="relative flex flex-col justify-between p-16 text-gray-100 bg-gray-900 shadow-md"
			css={{ width: 1200, height: 630 }}
		>
			<div className="max-w-screen-lg space-y-2">
				<h1
					className={`font-bold text-gray-100 font-source-sans-pro`}
				>
					title
				</h1>
			</div>
			<div className="flex justify-between">
				<div className="flex items-center space-x-6">
					<img
						src='profile.jpeg'
						alt="Matthew Schad"
						className="flex-none w-32 h-32 border-4 border-gray-200 rounded-full"
					/>
					<div className="flex flex-col gap">
						<p className="mb-1 text-3xl font-semibold text-gray-200 font-source-sans-pro">
							Matthew Schad
              				</p>
						<p className="text-2xl font-semibold tracking-wide text-indigo-400 font-open-sans">
							mattjschad.com<span className="path">/</span>
						</p>
						<p
							className="text-2xl font-semibold tracking-wide font-source-sans-pro"
							css={{ color: "#1D9BF0" }}
						>
							twitter.com/mattjschad
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

render(<App />, document.getElementById('corgi'));
