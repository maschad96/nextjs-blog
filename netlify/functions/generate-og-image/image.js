'use strict';

var router = require('next/router');
var nextGoogleFonts = require('next-google-fonts');

function getFontSize(length) {
  if (length >= 50) {
    return "text-5xl";
  }

  if (length >= 32) {
    return "text-7xl";
  }

  return "text-9xl";
} // Example URL: http://localhost:3000/ogImage?title=Hello%20mein%20Name%20ist%20Florian!&url=https://mattjschad.com/hello-world


var ogImage = function ogImage() {
  var router$1 = router.useRouter();
  var searchParams = new URLSearchParams(router$1.asPath.split(/\?/)[1]);
  var link = searchParams.get("url");
  if (!link) return null;
  var linkURL = new URL(link);
  var title = searchParams.get("title");
  var date = searchParams.get("date");
  var readTime = searchParams.get("readTime");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(nextGoogleFonts.GoogleFonts, {
    href: "https://fonts.googleapis.com/css2?family=Inter&family=Roboto:wght@400;700&display=swap"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative flex flex-col justify-between p-16 text-gray-100 bg-gray-900 shadow-md",
    style: {
      width: 1200,
      height: 630
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-screen-lg space-y-2"
  }, date && readTime && /*#__PURE__*/React.createElement("p", {
    className: "text-3xl font-semibold text-gray-600 font-source-sans-pro"
  }, /*#__PURE__*/React.createElement("span", null, date), " \u2014 ", /*#__PURE__*/React.createElement("span", null, readTime)), /*#__PURE__*/React.createElement("h1", {
    className: "".concat(getFontSize(title.length), " font-bold text-gray-100 font-source-sans-pro")
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-6"
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/profile.jpeg",
    alt: "Matthew Schad",
    className: "flex-none w-32 h-32 border-4 border-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-1 text-3xl font-semibold text-gray-200 font-source-sans-pro"
  }, "Matthew Schad"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold tracking-wide text-indigo-400 font-open-sans"
  }, "mattjschad.com", /*#__PURE__*/React.createElement("span", {
    className: "path"
  }, linkURL.pathname)), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-semibold tracking-wide font-source-sans-pro",
    style: {
      color: "#1D9BF0"
    }
  }, "twitter.com/mattjschad"))))));
};

module.exports = ogImage;
