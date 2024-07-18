import { firebaseConfig, firestore } from '../../firebase/config';
import { collection, where } from 'firebase/firestore';
import {
	toTypedRxJsonSchema,
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type RxCollection,
	type RxCollectionCreator,
	type RxJsonSchema
} from 'rxdb';
import type { DB } from '../db';
import { replicateFirestore } from 'rxdb/plugins/replication-firestore';

const characterSchemaLiteral = {
	title: 'character schema',
	description: 'describes the basics of an Iron Link character',
	version: 1,
	primaryKey: '_id',
	type: 'object',
	properties: {
		_id: {
			type: 'string',
			maxLength: 20
		},
		name: {
			type: 'string'
		},
		personalDetails: {
			type: 'object',
			properties: {
				pronouns: {
					type: 'string'
				},
				callsign: {
					type: 'string'
				}
			}
		},
		stats: {
			type: 'object',
			patternProperties: {
				'.*': {
					type: 'number'
				}
			}
		},
		conditionMeters: {
			type: 'object',
			patternProperties: {
				'*': {
					type: 'number'
				}
			}
		},
		momentum: {
			type: 'number'
		},
		campaignId: {
			type: 'string'
		},
		worldId: {
			type: 'string'
		},
		initiativeStatus: {
			type: 'string',
			enum: ['initiative', 'noInitiative', 'outOfCombat'],
			default: 'outOfCombat'
		},
		specialTracks: {
			type: 'object',
			patternProperties: {
				'.*': {
					type: 'object',
					properties: {
						value: {
							type: 'number'
						},
						isLegacy: {
							type: 'boolean'
						}
					}
				}
			}
		},
		experience: {
			type: 'object',
			properties: {
				spent: {
					type: 'number'
				},
				earned: {
					type: 'number'
				}
			}
		},
		debilities: {
			type: 'object',
			patternProperties: {
				'.*': {
					type: 'boolean'
				}
			}
		},
		adds: {
			type: 'number'
		},

		rulesetIds: {
			type: 'array',
			items: {
				type: 'string'
			}
		},
		expansionIds: {
			type: 'array',
			items: {
				type: 'string'
			}
		},

		uid: {
			type: 'string'
		},

		portrait: {
			type: 'object',
			properties: {
				filename: {
					type: 'string'
				},
				settings: {
					type: 'object',
					properties: {
						zoom: {
							type: 'number'
						},
						crop: {
							type: 'object',
							properties: {
								x: {
									type: 'number'
								},
								y: {
									type: 'number'
								}
							}
						}
					}
				}
			}
		}
	},
	required: ['name', 'uid', '_id', 'rulesetIds']
} as const; // <- It is important to set 'as const' to preserve the literal type

const schemaTyped = toTypedRxJsonSchema(characterSchemaLiteral);

// aggregate the document type from the schema
export type CharacterType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
const characterSchema: RxJsonSchema<CharacterType> = characterSchemaLiteral;

export type CharacterCollectionType = RxCollection<CharacterType>;

export const characterCollection: RxCollectionCreator = {
	schema: characterSchema,
	autoMigrate: false,
	migrationStrategies: {}
};

export function addCharacterReplication(db: DB, uid: string) {
	const characters = db.characters;
	const replication = replicateFirestore({
		collection: characters,
		firestore: {
			projectId: firebaseConfig.projectId,
			database: firestore,
			collection: collection(firestore, 'characters')
		},
		pull: {
			filter: [where('uid', '==', uid)]
		},
		push: {},
		live: true,
		replicationIdentifier: 'characters'
	});

	replication.error$.subscribe((err) => console.error(err.parameters.errors));

	return replication;
}
