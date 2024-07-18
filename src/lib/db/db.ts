import { removeRxDatabase, type RxDatabase } from 'rxdb';
import {
	addCharacterReplication,
	type CharacterCollectionType
} from './collections/characterCollection';
import { dbStorage, setupDatabase } from './setupDatabase';
import type { DocumentData } from 'firebase/firestore';
import { writable } from 'svelte/store';
import type { RxFirestoreReplicationState } from 'rxdb/plugins/replication-firestore';

type DBType = {
	characters: CharacterCollectionType;
};
export type DB = RxDatabase<DBType>;

export let dbStore = writable<{ db?: DB; setupError?: boolean }>({});
let db: DB | undefined = undefined;

let replicators: Record<keyof DBType, RxFirestoreReplicationState<DocumentData> | undefined> = {
	characters: undefined
};

export async function initDB(uid: string | undefined) {
	if (uid) {
		try {
			const localDB = await setupDatabase();
			replicators.characters = addCharacterReplication(localDB, uid);

			db = localDB;
			dbStore.set({ db: localDB });
		} catch (e) {
			console.error(e);
			if (localStorage.getItem('db-setup-error-refreshed') === 'true') {
				const shouldWipe = confirm(
					'Error setting up database. Click OK to wipe your local data and try again. If you played online recently, your data is backed up, you will not lose anything.'
				);
				if (shouldWipe) {
					localStorage.removeItem('db-setup-error-refreshed');
					await removeRxDatabase('iron-link-db', dbStorage);
					location.reload();
				} else {
					localStorage.removeItem('db-setup-error-refreshed');
					throw e;
				}
			} else {
				localStorage.setItem('db-setup-error-refreshed', 'true');
				location.reload(); // this might fix things?
			}
		}
	} else {
		dbStore.set({});
		let replicatorPromises: Promise<unknown>[] = [];
		// Remove replicators & reset database
		replicatorPromises.push(replicators.characters?.remove() ?? Promise.resolve());
		replicators.characters = undefined;
		await Promise.all(replicatorPromises);
		await db?.remove();
		db = undefined;
	}
}
