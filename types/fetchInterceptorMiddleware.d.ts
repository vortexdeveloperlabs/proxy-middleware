export type when = "onbefore" | "onafter";

export type beforeMiddlewareHandler = (
	eventStates: beforeMiddlewareEventStates
) => Promise<Response | FetchEvent | "pass">;
export type afterMiddlewareHandler = (
	eventStates: afterMiddlewareEventStates,
	resp: Response
) => Promise<Response | "pass">;

export interface beforeMiddlewareEventStates {
	/* this will be the pure event before it is touched by any middleware */
	originalEvent: FetchEvent;
	/* this will be the event after it has been processed by whatever other middleware is there */
	currentEvent: FetchEvent;
}
export interface afterMiddlewareEventStates {
	/* this will be the pure event before it is touched by any middleware */
	originalEvent: FetchEvent;
	/* the middleware after being processed by all of the before middleware */
	eventAfterBeforeMiddleware: FetchEvent;
	/* the middleware after the event was processed by the event listener */
	currentEvent: FetchEvent;
}
