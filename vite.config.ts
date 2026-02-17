import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig(({ command }) => {
	const isLibBuild = command === "build";

	return {
		plugins: [
			react(),
			// Only use dts plugin for library build
			...(isLibBuild
				? [
						dts({
							insertTypesEntry: true,
							rollupTypes: true,
						}),
				  ]
				: []),
		],
		// Library build configuration
		...(isLibBuild && {
			build: {
				lib: {
					entry: resolve(__dirname, "src/index.ts"),
					name: "JRPCanvas",
					formats: ["es", "cjs"],
					fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
				},
				rollupOptions: {
					external: ["react", "react-dom", "react/jsx-runtime"],
					output: {
						globals: {
							react: "React",
							"react-dom": "ReactDOM",
							"react/jsx-runtime": "jsxRuntime",
						},
						preserveModules: false,
					},
				},
				sourcemap: true,
				minify: "esbuild",
			},
		}),
		resolve: {
			alias: {
				"@": resolve(__dirname, "src"),
			},
		},
	};
});
