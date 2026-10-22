import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	build: {
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, "src/Puffin.js"),
			name: "Puffin",
			formats: ["es", "umd"],
			fileName: (format) =>
				format === "es" ? "puffin.esm.js" : "puffin.min.js",
		},
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name?.endsWith(".css")) {
						return "puffin.min.css";
					}
					return assetInfo.name;
				},
			},
		},
	},
});
