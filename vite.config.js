import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// The production build is a single self-contained HTML file: all JS, CSS and
// imagery inlined, so the demo can be opened from the filesystem with no server.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    target: "es2019",
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 4000,
    reportCompressedSize: false,
  },
});
