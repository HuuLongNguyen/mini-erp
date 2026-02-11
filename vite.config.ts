import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { powerApps } from '@microsoft/power-apps-vite/plugin';
import packageJson from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), powerApps()],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
  }
});
