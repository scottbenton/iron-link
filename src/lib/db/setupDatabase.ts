import { addRxPlugin, createRxDatabase, type RxDatabase } from 'rxdb';
import type { DB } from './db';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { addCharacterCollection } from './collections/characterCollection';

export const dbName = 'iron-link-db';
export const dbStorage = getRxStorageDexie();

export async function setupDatabase(): Promise<DB> {
	// Rebuild database in dev mode
	// if (import.meta.env.DEV) {
	// 	try {
	// 		await removeRxDatabase('iron-link-db', getRxStorageDexie());
	// 	} catch (e) {}
	// }
	// Enable dev mode for RxDB in development

	if (import.meta.env.DEV && false) {
		const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
		addRxPlugin(RxDBDevModePlugin);
	}
	addRxPlugin(RxDBMigrationSchemaPlugin);
	try {
		return createRxDatabase({
			name: dbName,
			storage: dbStorage,
			eventReduce: true
		}).then(async (db) => {
			return await addCollections(db);
		});
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function addCollections(db: RxDatabase): Promise<DB> {
	const collectionPromises: Promise<unknown>[] = [];

	collectionPromises.push(addCharacterCollection(db));

	await Promise.all(collectionPromises);
	return db as unknown as DB;
}
