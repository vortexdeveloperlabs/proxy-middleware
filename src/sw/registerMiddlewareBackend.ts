// Registers the backend in the SW needed for registerMiddleware.ts. It should be the primary route in the main `sw.js` file, before the other SW proxies could be routed.

import DBStorage from "local-db-storage"; // Use this instead of localForage, because this library is actively maintained

import readMiddlewareArchive from "./lib/readMiddlewareArchive.js";

import Manifest from "../types/manifest";

const dbStorage = new DBStorage("sw-middleware-backend");

const middlewareBackendRoute = "middlewareBackend/";
const fullInitialRoute = `${proxyPrefix}/${middlewareBackendRoute}`;

/**
 * Handles the backend for the middleware. This should be the primary route in the main `sw.js` file, before the other SW proxies could be routed.
 */
export default async function handleBackend(
	event: FetchEvent
): Promise<Response> {
	if (event.request.method !== "POST") {
		const routeAfterFullInitialRoute = event.request.url.replace(
			new RegExp(`^${fullInitialRoute}`),
			""
		);
		if (routeAfterFullInitialRoute.startsWith("registerMiddleware")) {
			const middlewareArchiveRaw = await event.request.arrayBuffer();
			const middlewareFiles =
				await readMiddlewareArchive(middlewareArchiveRaw);

			if ("manifest.json" in middlewareFiles) {
				const fileReader = new FileReader();
				const manifestFile: File = middlewareFiles[
					"manifest.json"
				] as File;
				fileReader.readAsText(manifestFile);

				let manifest: Manifest;
				try {
					manifest = await new Promise((resolve, reject) => {
						fileReader.addEventListener("load", () => {
							const fileText: string =
								fileReader.result as string;
							try {
								const manifest: Manifest = JSON.parse(fileText);
								resolve(manifest);
							} catch (err) {
								reject(err);
							}
						});
					});
				} catch (err) {
					return new Response(
						JSON.stringify({
							type: "error",
							severity: "fatal",
							errorMsg: `error parsing manifest.json file: `
						}),
						{
							status: 500,
							headers: {
								"Content-Type": "application/json"
							}
						}
					);
				}

				dbStorage.setItem(manifest.name, manifest);

				return new Response(
					JSON.stringify({
						type: "success"
					}),
					{
						status: 200,
						headers: {
							"Content-Type": "application/json"
						}
					}
				);
			}
				return new Response(
					JSON.stringify({
						type: "error",
						severity: "fatal",
						errorMsg:
							"middleware archive does not contain a manifest.json file"
					}),
					{
						status: 500,
						headers: {
							"Content-Type": "application/json"
						}
					}
				);
		}
	} else {
		return new Response(
			JSON.stringify({
				type: "error",
				severity: "fatal",
				errorMsg: "expected a POST request"
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json"
				}
			}
		);
	}
}

function shouldRoute(reqURL: string, proxyPrefix: string) {
	return reqURL.startsWith(`${proxyPrefix}/${middlewareBackendRoute}`);
}
