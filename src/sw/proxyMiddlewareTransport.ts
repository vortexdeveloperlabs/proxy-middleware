import {
	BareTransport,
	BareHeaders,
	TransferrableResponse
} from "@mercuryworkshop/bare-mux";

export default async function patchTransport(transport: BareTransport) {
	const originalTransportaRequestHandler = transport.request;
	transport.request = async (
		remote: URL,
		method: string,
		body: BodyInit | null,
		headers: BareHeaders,
		signal: AbortSignal | undefined
	): Promise<TransferrableResponse> => {
		const dummyRequestInit: RequestInit = {
			method,
			// @ts-ignore: BareHeaders and HeadersInit are compatible
			headers,
			body,
			signal
		};
		const dummyRequest = new Request(remote.toString(), dummyRequestInit);

		const ctx = {
			req: dummyRequest
		};

		const resp = originalTransportaRequestHandler(
			remote,
			method,
			body,
			headers,
			signal
		);

		return resp;
	};

	return transport;
}
/*
            isHTML: .startsWith("text/html") || type.startsWith("application/xhtml+xml");,
            isNavigate: req.mode === "navigate" && req.destination === "document";,
            */
