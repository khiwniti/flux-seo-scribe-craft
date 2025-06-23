// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => {
  const isWordPressBuild = process.env.BUILD_TARGET === "wordpress";
  return {
    server: {
      host: "::",
      port: 8080
    },
    plugins: [
      react(),
      mode === "development" && !isWordPressBuild && // Disable for WordPress build for now
      componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: isWordPressBuild ? {
      outDir: "dist/flux-seo-plugin",
      lib: {
        entry: path.resolve(__vite_injected_original_dirname, "src/wordpress-entry.tsx"),
        name: "FluxSEOApp",
        // Global variable name for UMD build
        formats: ["umd"],
        // Universal Module Definition for WordPress compatibility
        fileName: () => "flux-seo-app.js"
      },
      rollupOptions: {
        // Externalize React and ReactDOM
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM"
          }
        }
      },
      // Minify and produce sourcemaps for production WordPress build
      minify: mode === "production",
      sourcemap: mode === "production"
    } : {
      // Standard build configuration (non-WordPress)
      outDir: "dist",
      sourcemap: mode === "development"
      // Sourcemaps for dev, not for prod
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgaXNXb3JkUHJlc3NCdWlsZCA9IHByb2Nlc3MuZW52LkJVSUxEX1RBUkdFVCA9PT0gJ3dvcmRwcmVzcyc7XG5cbiAgcmV0dXJuIHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6IFwiOjpcIixcbiAgICAgIHBvcnQ6IDgwODAsXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiAhaXNXb3JkUHJlc3NCdWlsZCAmJiAvLyBEaXNhYmxlIGZvciBXb3JkUHJlc3MgYnVpbGQgZm9yIG5vd1xuICAgICAgY29tcG9uZW50VGFnZ2VyKCksXG4gICAgXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IGlzV29yZFByZXNzQnVpbGRcbiAgICAgID8ge1xuICAgICAgICAgIG91dERpcjogXCJkaXN0L2ZsdXgtc2VvLXBsdWdpblwiLFxuICAgICAgICAgIGxpYjoge1xuICAgICAgICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3dvcmRwcmVzcy1lbnRyeS50c3hcIiksXG4gICAgICAgICAgICBuYW1lOiBcIkZsdXhTRU9BcHBcIiwgLy8gR2xvYmFsIHZhcmlhYmxlIG5hbWUgZm9yIFVNRCBidWlsZFxuICAgICAgICAgICAgZm9ybWF0czogW1widW1kXCJdLCAvLyBVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24gZm9yIFdvcmRQcmVzcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICBmaWxlTmFtZTogKCkgPT4gXCJmbHV4LXNlby1hcHAuanNcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIC8vIEV4dGVybmFsaXplIFJlYWN0IGFuZCBSZWFjdERPTVxuICAgICAgICAgICAgZXh0ZXJuYWw6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICAgICAgICByZWFjdDogXCJSZWFjdFwiLFxuICAgICAgICAgICAgICAgIFwicmVhY3QtZG9tXCI6IFwiUmVhY3RET01cIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAvLyBNaW5pZnkgYW5kIHByb2R1Y2Ugc291cmNlbWFwcyBmb3IgcHJvZHVjdGlvbiBXb3JkUHJlc3MgYnVpbGRcbiAgICAgICAgICBtaW5pZnk6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcbiAgICAgICAgICBzb3VyY2VtYXA6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcbiAgICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgICAgLy8gU3RhbmRhcmQgYnVpbGQgY29uZmlndXJhdGlvbiAobm9uLVdvcmRQcmVzcylcbiAgICAgICAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgICAgICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JywgLy8gU291cmNlbWFwcyBmb3IgZGV2LCBub3QgZm9yIHByb2RcbiAgICAgICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sbUJBQW1CLFFBQVEsSUFBSSxpQkFBaUI7QUFFdEQsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFNBQVMsaUJBQWlCLENBQUM7QUFBQSxNQUMzQixnQkFBZ0I7QUFBQSxJQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLElBQ2hCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU8sbUJBQ0g7QUFBQSxNQUNFLFFBQVE7QUFBQSxNQUNSLEtBQUs7QUFBQSxRQUNILE9BQU8sS0FBSyxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLFFBQ3hELE1BQU07QUFBQTtBQUFBLFFBQ04sU0FBUyxDQUFDLEtBQUs7QUFBQTtBQUFBLFFBQ2YsVUFBVSxNQUFNO0FBQUEsTUFDbEI7QUFBQSxNQUNBLGVBQWU7QUFBQTtBQUFBLFFBRWIsVUFBVSxDQUFDLFNBQVMsV0FBVztBQUFBLFFBQy9CLFFBQVE7QUFBQSxVQUNOLFNBQVM7QUFBQSxZQUNQLE9BQU87QUFBQSxZQUNQLGFBQWE7QUFBQSxVQUNmO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsUUFBUSxTQUFTO0FBQUEsTUFDakIsV0FBVyxTQUFTO0FBQUEsSUFDdEIsSUFDQTtBQUFBO0FBQUEsTUFFRSxRQUFRO0FBQUEsTUFDUixXQUFXLFNBQVM7QUFBQTtBQUFBLElBQ3RCO0FBQUEsRUFDTjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
