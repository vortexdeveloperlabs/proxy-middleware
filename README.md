# Proxy Middleware Implementations

TODO: Everything in this repo is unfinished; please don't look at the code here unless you are willing to contribute

What sets this middleware implementation apart is...

## Projects that use these implementations

- [browser ports proxy middleware](https://github.com/vortexdeveloperlabs/browser-ports-proxy-middleware) (private right now)
- [misc/demo proxy middleware projects](https://github.com/vortexdeveloperlabs/proxy-middleware-demo)

## Types of middleware explained

Three types of proxy middleware can exist:

- **Proxy server backend middleware**: this would be coded on a proxy backend server, such as bare, where the requests and responses are modified according to the middleware handlers. While this was the first approach to proxy middleware in early proxies like PHProxy and Node Unblocker, this isn't ideal anymore: it can pose security risks, doesn't scale well, and because of this, it isn't a good idea to have users to upload their custom middleware. I do not support any of these middleware in my projects. This is the only type I will not help in my middleware system. However, you are migrating from other server backend-only proxies. In that case, a feature called "dummy middleware" makes it possible to write emulation for these legacy forms of middleware and have it function like the other two methods below.

## SW proxy middleware types

- **Patching fetch event handlers**: this involves proxifying the `addEventListener` function to get and modify the state of the listener beforehand (possibly modifying the event before the event is passed into the listener, while being given the original event before processed by the event middleware and after whatever has been processed by the other before middleware handled beforehand) and after the fact (possibly modifying the response after returning from the original listener, with all of the previous states of the event object: before being processed by the before middleware, after being processed by the before middleware, and after being processed by the middleware). The implementation for this in this repo can be found on npm as `sw-proxy-middleware.` There is now something similar called [WorkerWare](), a decent solution that implements this same type but also lets you patch more events other than fetch.
- **transport (proxy clients)**: proxy clients fetch to a server backend in an abstracted way but with consistency, which takes the pressure off of the SW proxy dev to maintain implementations for competing proxy server backend standards, which are constantly changing, unlike a basic API for fetching these proxy server backends. Specifically, this repo demonstrates this type of bare-mux transport. Your SW proxy should not use a proxy client solution other than bare-mux. The implementation for this in this repo can be found on npm as `sw-proxy-middleware/transport.`
- **SW pre-transport**: the approach of *transport* proxy middleware is beneficial because it doesn't require the SW itself to be patched. However, one issue with doing this in bare-mux is that the "Request object" it takes in is not compatible with the native Request object, which causes problems. What this does instead is you manually pass in the request and response before and after being rewritten. Because of this, it also gives you more control. The implementation for this in this repo can be found on npm as `sw-proxy-middleware/preTransport.`

- **Hooking into proxy rewriters**: ...The implementation for this in this repo can be found on npm as `sw-proxy-middleware/rewriter-hooks.`

There may also be other types of middleware specific to the sandboxing. While you could inject an extra rewriter into every proxy site, this would add even more overhead than we want.


Your average proxy site could have a basic frontend for managing the middleware installed, or it can have an entire storefront, which allows adding repos and browsing the resulting middleware. I want every middleware to have all of the descriptions about it inside of the manifest.json so you can list them on the proxy middleware system.
