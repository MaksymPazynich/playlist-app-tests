require('dotenv').config();

module.exports = {
  use: {
    baseURL: process.env.APP_URL || 'https://vite-react-alpha-lemon.vercel.app/',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
};
