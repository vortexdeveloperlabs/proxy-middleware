type supportedMiddlewaereTypes =
	| "fetchTransport"
	| "transport"
	| "preTransport";
export default interface Manifest {
	supportsMiddlewaereTypes: supportedMiddlewaereTypes[];
	importFilesPaths: {
		fetchInterceptor?: string[];
		transport?: string[];
		preTransport?: string[];
	};
}
