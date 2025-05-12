
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    server: {
      host: '::',
      port: 8080,
      // Use string array for allowedHosts to fix TypeScript error
      allowedHosts: [
        'ab60377c-2866-49f6-ad4a-fe3921f30cc4.lovableproject.com',
        'localhost',
        // '.lovableproject.com',
      ],
    },

    plugins: [
      react(),
      ...(isDev ? [componentTagger()] : []), // spread keeps the array tidy
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
