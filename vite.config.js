const { defineConfig } = require("vite");
const path = require("path");

module.exports = defineConfig({
  root: path.resolve(__dirname, "renderer"),
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
