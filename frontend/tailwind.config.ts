import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      // Tu peux étendre ici d'autres choses (couleurs, taille, etc.)
    },
  },
  plugins: [],
}

export default config
