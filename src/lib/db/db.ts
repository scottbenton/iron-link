import { type RxDatabase } from 'rxdb';
import {
	addCharacterReplication,
	type CharacterCollectionType
} from './collections/characterCollection';
import { setupDatabase } from './setupDatabase';
import type { RxFirestoreReplicationState } from './firestorePlugin';
import type { DocumentData } from 'firebase/firestore';
import { writable } from 'svelte/store';

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
	console.debug('INIT DB CALLED');

	if (uid) {
		try {
			const localDB = await setupDatabase();

			console.debug('ADDING REPLICATORS');

			replicators.characters = addCharacterReplication(localDB, uid);

			db = localDB;
			dbStore.set({ db: localDB });
		} catch (e) {
			console.error(e);
			location.reload(); // this might fix things?
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
