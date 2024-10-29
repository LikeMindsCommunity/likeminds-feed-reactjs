// vite.config.js
import { resolve } from "path";
import { defineConfig } from "file:///Users/omen/likeminds-feed-reactjs/core/node_modules/vite/dist/node/index.js";
import react from "file:///Users/omen/likeminds-feed-reactjs/core/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///Users/omen/likeminds-feed-reactjs/core/node_modules/vite-plugin-dts/dist/index.mjs";
import { libInjectCss } from "file:///Users/omen/likeminds-feed-reactjs/core/node_modules/vite-plugin-lib-inject-css/dist/index.js";
var __vite_injected_original_dirname = "/Users/omen/likeminds-feed-reactjs/core";
var vite_config_default = defineConfig({
  plugins: [react(), libInjectCss({}), dts({ include: ["src"] })],
  build: {
    cssCodeSplit: true,
    copyPublicDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "react-feed-lib",
      // the proper extensions will be added
      fileName: "index"
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom", "vite"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React"
        }
      }
    }
  },
  optimizeDeps: {
    disabled: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvb21lbi9saWtlbWluZHMtZmVlZC1yZWFjdGpzL2NvcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9vbWVuL2xpa2VtaW5kcy1mZWVkLXJlYWN0anMvY29yZS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvb21lbi9saWtlbWluZHMtZmVlZC1yZWFjdGpzL2NvcmUvdml0ZS5jb25maWcuanNcIjsvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuLy8gdml0ZS5jb25maWcuanNcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbi8vIGltcG9ydCBzY3NzIGZyb20gJ3JvbGx1cC1wbHVnaW4tc2NzcydcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuaW1wb3J0IHsgbGliSW5qZWN0Q3NzIH0gZnJvbSAndml0ZS1wbHVnaW4tbGliLWluamVjdC1jc3MnXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBsaWJJbmplY3RDc3Moe1xuXG4gICAgfSksIGR0cyh7IGluY2x1ZGU6IFsnc3JjJ10gfSldLFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAgICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgICAgIGxpYjoge1xuICAgICAgICAgICAgLy8gQ291bGQgYWxzbyBiZSBhIGRpY3Rpb25hcnkgb3IgYXJyYXkgb2YgbXVsdGlwbGUgZW50cnkgcG9pbnRzXG4gICAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgICAgICAgIG5hbWU6ICdyZWFjdC1mZWVkLWxpYicsXG4gICAgICAgICAgICAvLyB0aGUgcHJvcGVyIGV4dGVuc2lvbnMgd2lsbCBiZSBhZGRlZFxuICAgICAgICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXG4gICAgICAgIH0sXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0byBleHRlcm5hbGl6ZSBkZXBzIHRoYXQgc2hvdWxkbid0IGJlIGJ1bmRsZWRcbiAgICAgICAgICAgIC8vIGludG8geW91ciBsaWJyYXJ5XG4gICAgICAgICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nLCAndml0ZSddLFxuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgLy8gUHJvdmlkZSBnbG9iYWwgdmFyaWFibGVzIHRvIHVzZSBpbiB0aGUgVU1EIGJ1aWxkXG4gICAgICAgICAgICAgICAgLy8gZm9yIGV4dGVybmFsaXplZCBkZXBzXG4gICAgICAgICAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgICAgICAgICAgICByZWFjdDogJ1JlYWN0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICB9LFxuXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFFN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixTQUFTLG9CQUFvQjtBQVA3QixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FFaEMsQ0FBQyxHQUFHLElBQUksRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQzdCLE9BQU87QUFBQSxJQUNILGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxJQUNmLEtBQUs7QUFBQTtBQUFBLE1BRUQsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUE7QUFBQSxNQUVOLFVBQVU7QUFBQSxJQUNkO0FBQUEsSUFDQSxlQUFlO0FBQUE7QUFBQTtBQUFBLE1BR1gsVUFBVSxDQUFDLFNBQVMsYUFBYSxNQUFNO0FBQUEsTUFDdkMsUUFBUTtBQUFBO0FBQUE7QUFBQSxRQUdKLFNBQVM7QUFBQSxVQUNMLE9BQU87QUFBQSxRQUNYO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUVKO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDVixVQUFVO0FBQUEsRUFDZDtBQUVKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
