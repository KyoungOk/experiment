/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				suit: ["SUIT", "sans-serif"],
				helvetica: ["'Helvetica Neue'", "sans-serif"],
			},
			maxWidth: {
				card: "460px",
			},
			colors: {
				brandPurple: "#7050E4",
			},
		},
	},
	plugins: [],
};
