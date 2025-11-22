import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,  
  reporter: [
    ['list'], 
    ['html', { open: 'never' }] 
  ],
  use: {
    headless: false,
    baseURL: 'https://frontendui-librarysystem.onrender.com',        
    screenshot: 'only-on-failure'
  },
projects: [
    {
      name: 'Firefox',
      use: { browserName: 'firefox' }
    }
  ]
});
