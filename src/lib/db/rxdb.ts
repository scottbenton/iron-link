// In your RxDB setup file
import { createRxDatabase, addRxPlugin, type RxDatabase, removeRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import {
	addCharacterCollection,
	type CharacterCollectionType
} from './collections/characterCollection';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';

export let dbPromise: Promise<RxDatabase> | undefined = undefined;

type DBType = {
	characters: CharacterCollectionType;
};
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
			console.debug(Object.keys(db.collections));

			database = db as unknown as RxDatabase<DBType>;
			return db;
		});
	} catch (e) {
		console.error(e);
	}

	return dbPromise;
}

export const initDB = () => (dbPromise ? dbPromise : setupDatabase());

export function getDatabase() {
	if (!database) {
		throw new Error('Database not set up');
	}
	return database;
}
