// This will have four functions: `handleMiddlewareReq(req) => {req, resp, returnRequest: boolean}`, `handleMiddlewareResp(resp, originalReq, currentReq) => Request | Response`, handleMiddlewareReqAfterRewrite(event, currentReq), handleMiddlewareRespAfterRewrite(). It is important to note that a specific middleware mode is required, `preTransportFull`, rather than just `preTransport` in order to use `handleMiddlewareReqAfterRewrite()` and `preTransportResp()`. The reason for this is because those last two require adding code to specific proxies to accomplish this, most of the time requiring patching of the individual SW proxies (routed in the main SW) themselves. With the other two you can run `handleMiddlewareReq()` (before the SW proxy chosen is handled) and `handleMiddlewareRespAfterRewrite()` (after the SW proxy chosen is handled) in the main SW proxy.

// handleMiddlewareReq - ran right at the top of the SW proxy
// handleMiddlewareResp - ran right at after the resp was recieved from bare-mux
// handleMiddlewareReqAfterRewrite - ran right after the request was possibly rewritten in the SW proxy
// handleMiddlewareRespAfterRewrite - ran right at the bottom of the SW proxy, before returning the response

export type reqMiddlewareHandler = (req: Request) => Promise<
	| {
			req: Request;
	  }
	| {
			req: Request;
			resp: Response;
			/* To exit early by returning with the response in the main SW fetch event handler. For some reasons you might want to alter how the response is formed so the SW proxy treats it differently. */
			returnResponse: boolean;
	  }
	| "pass"
>;

export type respMiddlewareHandler = (
	resp: Response,
	originalReq: Request,
	currentReq: Request
) => Promise<Response | "pass">;

export type reqAfterRewriteMiddlewareHandler = (
	originalReq: Request,
	currentReq: Request
) => Promise<Request | "pass">;

export type handleMiddlewareRespAfterRewrite = (
	resp: Response,
	originalReq: Request,
	currentReq: Request
) => Promise<
	// There is no returnResponse here because the response is already formed and the SW proxy is about to return it
	Response | "pass"
>;
