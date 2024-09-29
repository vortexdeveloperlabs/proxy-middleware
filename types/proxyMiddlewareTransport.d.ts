// Start of Middleware Types
// Both...
type DOMProxy = Function;

// Parameters
// Allows for control of the DOM through messages in request handler
// TODO: Specify function signature
type rewriteUrls = (path: string) => string;

// Return
type RewriteController = {
	rewriteUrls: [];
	resp: Response;
};

// Contexts
export type RequestContext =
	| {
			mode: "transport";
			req: Request;
	  }
	| {
			mode: "preTransport";
			req: Request;
			isHTML: boolean;
			isNavigate: boolean;
	  };
// This plays a crucial part in writing middleware for rewritable content interception as well (Which is in the module mwRewriters coming up later in the code), so that it can get more context of what lead up to the event. This means that it is used in both mw types.
export interface ResponseContext {
	req: Request;
	resp: Response;
	// You may infer these with the response itself, but they are still good abstractions to have for beginners
	isHTML: boolean;
	isNavigate: boolean;
}

export type RequestHandler = (
	ctx: RequestContext,
	DOMProxy?: DOMProxy
) => Promise<Request | Response | RewriteController | void>;
export type ResponseHandler = (
	ctx: ResponseContext,
	DOMProxy?: DOMProxy
) => Promise<Response | void>;
interface BaseMiddleware {
	match?: string | string[];
}
// This is what the MW code actually interfaces with
export interface RequestMiddleware extends BaseMiddleware {
	handle: RequestHandler;
}
export interface ResponseMiddleware extends BaseMiddleware {
	handle: ResponseHandler;
}

export type Middleware =
	| RequestMiddleware
	| ResponseMiddleware
	| HTMLMiddleware;

export type MiddlewareFileExport = Middleware | Middleware[];
