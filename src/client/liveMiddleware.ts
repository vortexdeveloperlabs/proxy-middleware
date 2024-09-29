// This method will be required to use any of the three middleware. This function in the backend will send a POST request to an API routed by the SW proxy, for which, a SW backend will need to be ran in the main SW, with the route handled before the SW executes and does its course. The code for this will be in `registerMiddlewareBackend.ts`. This function will either take in a [file system](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem) or it will take in the file data of the middleware to be extracted later.
// Middleware will still be able to be added without these functions in this file. These functions in this file are just a ways to do it on the fly, or to modify/remove the existing middleware.  Most of the time the middleware will and can be packaged through what I call "middlewareBundles". Middleware bundles simply means an array of middleware files set on `self.midddlewareBundles`, which all of the middleware handlers will be look for this array.

// this file will also have other functions: registerMiddleware(), getMiddlewareIds() => BigInt[], unregisterMiddleware(middlewareId: BigInt) => void

async function registerMiddleware(middlewareArchive: ArrayBuffer | Blob) {
	navigator.serviceWorker.controller.postMessage({
		type: "registerMiddleware",
		middlewareArchive
	});
}

async function unregisterMiddleawre(middlewareId: BigInt) {
	navigator.serviceWorker.controller.postMessage({
		type: "unregisterMiddleware",
		middlewareId
	});
}

async function getMiddlewareIds(): BigInt[] {
	new Promise((resolve, reject) => {
		navigator.serviceWorker.controller.postMessage({
			type: "getMiddlewareIds"
		});
	});
}
