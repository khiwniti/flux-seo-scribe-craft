import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isWordPressBuild = process.env.BUILD_TARGET === 'wordpress';

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && !isWordPressBuild && // Disable for WordPress build for now
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: isWordPressBuild
      ? {
          outDir: "dist/flux-seo-plugin",
          lib: {
            entry: path.resolve(__dirname, "src/wordpress-entry.tsx"),
            name: "FluxSEOApp", // Global variable name for UMD build
            formats: ["umd"], // Universal Module Definition for WordPress compatibility
            fileName: () => "flux-seo-app.js",
          },
          rollupOptions: {
            // Externalize React and ReactDOM
            external: ["react", "react-dom"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
              },
            },
          },
          // Minify and produce sourcemaps for production WordPress build
          minify: mode === 'production',
          sourcemap: mode === 'production',
        }
      : {
          // Standard build configuration (non-WordPress)
          outDir: "dist",
          sourcemap: mode === 'development', // Sourcemaps for dev, not for prod
        },
  };
});
