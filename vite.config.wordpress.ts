import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// WordPress-specific Vite configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "wordpress-plugin/dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/wordpress-entry.tsx")
      },
      output: {
        entryFileNames: 'flux-seo-wordpress-app.js',
        chunkFileNames: 'flux-seo-chunk-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'flux-seo-scribe-craft.css';
          }
          return 'assets/[name].[ext]';
        },
        format: 'iife',
        name: 'FluxSEOApp',
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      },
      external: ['react', 'react-dom']
    },
    minify: false, // Keep unminified for debugging
    cssCodeSplit: false, // Bundle all CSS into one file
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    global: 'globalThis',
  }
});