// In your RxDB setup file
import { createRxDatabase, addRxPlugin, type RxDatabase, removeRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import {
	addCharacterCollection,
	type CharacterCollectionType
} from './collections/characterCollection';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { getContext } from 'svelte';

type DBType = {
	characters: CharacterCollectionType;
};
export type DB = RxDatabase<DBType>;

export let dbPromise: Promise<RxDatabase<DBType>> | undefined = undefined;

let database: RxDatabase<DBType> | undefined = undefined;

async function setupDatabase() {
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
		dbPromise = createRxDatabase({
			name: 'iron-link-db',
			storage: getRxStorageDexie(),
			eventReduce: true
		}).then(async (db) => {
			console.debug(Object.keys(db.collections));
			if (!db.collections.characters) {
				await addCharacterCollection(db);
			}

			return db as unknown as RxDatabase<DBType>;
		});
	} catch (e) {
		console.error(e);
		throw e;
	}

	return dbPromise;
}

export function initDB(): Promise<RxDatabase<DBType>> {
	return dbPromise ? dbPromise : setupDatabase();
}

export function getDB(): DB {
	return getContext('db');
}
