/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from 'react-dom';

function getFontSize(length) {
	if (length >= 32) {
		return `text-6xl`;
	}

	return `text-8xl`;
}

// Example URL: http://localhost:3000/ogImage?title=Hello%20mein%20Name%20ist%20Florian!&url=https://mattjschad.com/hello-world
function App() {
	return (
		<div>
			<head>
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&family=Roboto:wght@700&display=swap" />
			</head>
			<div
				id="image"
				className="relative flex flex-col justify-between p-16 text-white bg-black shadow-md"
				css={{ width: 1200, height: 630 }}
			>
				<div className="max-w-screen-lg space-y-2">
					<h1
						className={`${getFontSize(window.title.length)} font-bold`}
						css={{ "font-family": "Roboto", "line-height": "1.4 !important" }}
					>
						{window.title}
					</h1>
				</div>
				<div className="flex justify-between">
					<div className="flex items-center space-x-6">
						<img
							src={window.base64Profile}
							alt="Matthew Schad"
							className="flex-none w-48 h-48 border-2 border-gray-200 rounded-full profile"
						/>
						<div className="flex flex-col gap">
							<p
								css={{
									"font-family": "Inter",
									"font-size": 36,
									"margin-bottom": 10
								}}
							>
								Matthew Schad
							</p>
							<p
								css={{
									"font-family": "Inter",
									"font-size": 32,
									"margin-bottom": 15
								}}
							>
								UX Engineer and Designer
							</p>
							<p
								css={{
									"font-family": "Inter",
									color: "#1D9BF0",
									"font-size": 32
								}}
							>
								@mattjschad
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

render(<App />, document.getElementById('corgi'));
