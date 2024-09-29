import path from "node:path";
import rspack from "@rspack/core";

import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

import createFeatureFlags from "./createFeatureFlags";

const debugMode = "DEBUG" in process.env;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any = [];

if (debugMode)
	plugins.push(
		new RsdoctorRspackPlugin({
			port: 3300
		})
	);

const config: rspack.Configuration = {
	mode: debugMode ? "development" : "production",
	entry: {
		fetchInterceptor: path.resolve(
			__dirname,
			"./src/fetchInterceptorMiddleware.ts"
		),
		transport: path.resolve(__dirname, "./src/proxyMiddlewareTransport.ts"),
		preTransport: path.resolve(
			__diranme,
			"./src/proxyMiddlewarePreTransport.ts"
		),
		liveMiddleware: path.resolve(__dirname, "./src/liveMiddleware.ts")
	},
	plugins,
	resolve: {
		extensions: [".ts"],
		tsConfigPath: path.resolve(__dirname, "./tsconfig.json")
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/[\\/]node_modules[\\/]/],
				loader: "builtin:swc-loader"
			}
		]
	},
	output: {
		filename: "[name].aero.js",
		path: debugMode
			? path.resolve(__dirname, "dev-server/demo-site/aero")
			: path.resolve(__dirname, "dist"),
		iife: true,
		clean: true
	},
	target: "webworker"
};

if (debugMode) config.watch = true;

export default config;
