import { Archive } from "libarchive.js";

export default async (
	middlewareArchiveRaw: ArrayBuffer | File
): Promise<File[]> => {
	let middlewareArchiveFile: File;
	if (middlewareArchiveRaw instanceof ArrayBuffer) {
		middlewareArchiveFile = new File(
			[middlewareArchiveRaw],
			"middlewareArchive"
		);
	} else if (middlewareArchiveRaw instanceof File) {
		middlewareArchiveFile = middlewareArchiveRaw;
	} else {
		throw new Error("Invalid middlewareArchiveRaw type");
	}

	const middlewareArchive = await Archive.open(middlewareArchiveFile);
	const middlewareFiles = middlewareArchive.extractFiles();

	return middlewareFiles;
};
