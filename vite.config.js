import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    plugins: [react()],
    
    css: {
      postcss: {
        plugins: [autoprefixer(), tailwindcss],
      },
    },

    define: {
      VITE_BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL),
      VITE_RAZORPAY_KEY: JSON.stringify(env.VITE_RAZORPAY_KEY),
    },

    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  };
});