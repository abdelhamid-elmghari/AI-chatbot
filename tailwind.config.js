// tailwind.config.js
module.exports = {
    content: [
        "./index.html",
        "./scripts/**/*.js",
        "./css/**/*.css"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3498db',
                secondary: '#2ecc71',
                accent: '#e67e22',
                background: '#f4f4f4',
            },
            fontFamily: {
                sans: ["Segoe UI", "Arial", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: '8px',
                lg: '16px',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};