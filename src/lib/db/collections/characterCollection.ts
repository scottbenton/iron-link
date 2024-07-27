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
		legacyTracks: {
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
			type: 'number'
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
			type: 'object',
			patternProperties: {
				'.*': {
					type: 'boolean'
				}
			}
		},

		theme: {
			type: 'string'
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
							},
							required: ['x', 'y']
						}
					},
					required: ['zoom', 'crop']
				}
			},
			required: ['filename', 'settings']
		}
	},
	required: ['name', 'uid', '_id', 'rulesetIds']
} as const; // <- It is important to set 'as const' to preserve the literal type

const schemaTyped = toTypedRxJsonSchema(characterSchemaLiteral);

// aggregate the document type from the schema
export type CharacterType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped> & {
	stats: Record<string, number>;
	conditionMeters?: Record<string, number>;
	debilities?: Record<string, boolean>;
	legacyTracks?: Record<string, { value?: number; isLegacy?: boolean }>;
};

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
			filter: [where('uid', '==', uid)],
			modifier: (obj) => transformNullToUndefined(obj)
		},
		push: {
			modifier: (obj) => transformUndefinedToNull(obj)
		},
		live: true,
		replicationIdentifier: 'characters'
	});

	replication.error$.subscribe((err) => console.error(err.parameters.errors));

	return replication;
}

function transformUndefinedToNull(obj: any): any {
	// Check if the input is an object
	if (obj !== null && typeof obj === 'object') {
		// Iterate over object keys
		Object.keys(obj).forEach((key) => {
			// If the value is undefined, set it to null
			if (obj[key] === undefined) {
				obj[key] = null;
			} else if (typeof obj[key] === 'object') {
				// If the value is an object, recursively call the function
				transformUndefinedToNull(obj[key]);
			}
		});
	}
	return obj;
}

// Takes an object and converts all null values to undefined
function transformNullToUndefined(obj: any): any {
	// Check if the input is an object
	if (obj !== null && typeof obj === 'object') {
		// Iterate over object keys
		Object.keys(obj).forEach((key) => {
			// If the value is undefined, set it to null
			if (obj[key] === null) {
				obj[key] = undefined;
			} else if (typeof obj[key] === 'object') {
				// If the value is an object, recursively call the function
				transformNullToUndefined(obj[key]);
			}
		});
	}
	return obj;
}
