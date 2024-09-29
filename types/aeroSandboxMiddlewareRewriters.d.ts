// While you could write your own rewritable content interceptors for the mw interceptors, this prevents you from reinventing the weel by making the proxy's existing content interceptors extendable. In turn, it makes the middleware code easier to understand.
// By rewritable content interception, I mean modification that happens after a resource is rewritten in the proxy. For normal assets that don't need rewrites in a proxy, you should be looking for Response Middleware instead.

// TODO: Implement these into aero

import { ResponseContext } from "./proxyMiddleware";
import { BaseMiddleware } from "./proxyMiddleware";

export interface HTMLMiddleware extends BaseMiddleware {
	handle: HTMLHandler;
}

export interface Rewriters {
	css: cssHandler;
	// For all scripts
	js?: jsHandler;
	// For inline scripts only
	jsInline?: jsHandler;
	// For external scripts only (the ones imported with src in them)
	jsExternal?: jsHandlerExternal;
	headers?: {
		req?: headersHandler;
		resp?: headersHandler;
	};
}

export type HTMLHandler = (el: Element) => HTMLCommand;

type HTMLCommand = "skip" | "delete" | void;

export type cssHandler = (styles: string) => Promise<string>;
export type jsHandler = (script: string) => Promise<string>;
export type jsHandlerExternal = (
	script: string,
	ctx: ResponseContext
) => Promise<string>;
export type headersHandler = (headers: object, proxyUrl: URL) => HeadersInit;
