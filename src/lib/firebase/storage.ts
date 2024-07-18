import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from './config';

const storage = getStorage(app);

export function uploadFile(collection: string, id: string, file: File) {
	const storageRef = ref(storage, `${collection}/${id}/${file.name}`);
	return uploadBytes(storageRef, file);
}

export function deleteFile(collection: string, id: string, fileName: string) {
	const storageRef = ref(storage, `${collection}/${id}/${fileName}`);
	return deleteObject(storageRef);
}

export async function getFileURL(
	collection: string,
	id: string,
	fileName: string
): Promise<string | undefined> {
	const storageRef = ref(storage, `${collection}/${id}/${fileName}`);
	try {
		return await getDownloadURL(storageRef);
	} catch (e) {
		console.error('Error downloading file: ', e);
		return undefined;
	}
}
