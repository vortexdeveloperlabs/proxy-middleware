import type {
	when,
	beforeMiddlewareHandler,
	afterMiddlewareHandler
} from "../types/fetchInterceptorMiddleware";

declare const self: WorkerGlobalScope &
	typeof globalThis & {
		addMiddleware: (
			when: when,
			middlewareHandler: beforeMiddlewareHandler
		) => void;
		getBeforeMiddleware: () => beforeMiddlewareHandler[];
		getAfterMiddleware: () => afterMiddlewareHandler[];
		addEventListenser: ProxyHandler<typeof addEventListener>;
	};

const middlewareBefore: beforeMiddlewareHandler[] = [];
const middlewareAfter: afterMiddlewareHandler[] = [];

// TODO: Write a tsconfig and include SW types
self.addMiddleware = (
	when: when,
	middlewareHandler: beforeMiddlewareHandler
): void => {
	if (when === "onbefore") {
		middlewareBefore.push(middlewareHandler);
	}
	if (when === "onafter") {
		middlewareAfter.push(middlewareHandler);
	}
};

self.getBeforeMiddleware = () => middlewareBefore;
self.getAfterMiddleware = () => middlewareAfter;

self.addEventListener = new Proxy(addEventListener, {
	apply(target, that, args) {
		const [eventType, listener] = args;

		if (eventType === "fetch") {
			args[1] = async (event: FetchEvent): Promise<Response> => {
				const originalEvent = event;
				let eventAfterBeforeMiddleware = event;
				for (const middleware of middlewareBefore) {
					const middlewareBeforeRes = await middleware({
						originalEvent,
						currentEvent: event
					});
					if (middlewareBeforeRes !== "pass") {
						if (middlewareBeforeRes instanceof Response) {
							return middlewareBeforeRes;
						}
						if (middlewareBeforeRes instanceof FetchEvent) {
							event = middlewareBeforeRes;
						}
					}
				}
				eventAfterBeforeMiddleware = event;
				const fetchListenerRes = await listener(event);
				for (const middleware of middlewareAfter) {
					const middlewareAfterRes = await middleware(
						{
							originalEvent,
							eventAfterBeforeMiddleware,
							currentEvent: event
						},
						fetchListenerRes
					);
					if (middlewareAfterRes !== "pass") {
						if (middlewareAfterRes instanceof Response) {
							return middlewareAfterRes;
						}
					}
				}
			};
		}
		return Reflect.apply(target, that, args);
	}
});
