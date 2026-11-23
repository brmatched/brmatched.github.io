import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : '';

// User/Organization Pages repos named "<owner>.github.io" are served from root "/"
const isRootPagesRepo = /\.github\.io$/i.test(repoName);
const base =
  process.env.VITE_BASE_PATH ||
  (repoName && !isRootPagesRepo ? `/${repoName}/` : '/');

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
