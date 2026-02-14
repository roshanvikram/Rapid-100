/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'rapid-bg': '#0B0F19',
                'rapid-card': '#151B2E',
                'rapid-border': '#2D3748',
                'rapid-blue': '#3B82F6',
                'rapid-purple': '#8B5CF6',
                'rapid-red': '#EF4444',
                'rapid-orange': '#F59E0B',
                'rapid-green': '#10B981',
            },
            fontFamily: {
                sans: ['"Exo 2"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            }
        },
    },
    plugins: [],
}
