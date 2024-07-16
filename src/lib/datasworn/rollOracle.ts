import type { OracleRollResult } from '$types/rolls/OracleRollResult.type';
import { IdParser as DefaultIdParser } from '@datasworn/core';
import type { OracleCollection, OracleRollable } from '@datasworn/core/dist/Datasworn';
import type { Parser } from './parser.type';

export function rollOracle(options: {
	oracleIds: (string | string[])[];
	joinOracles?: boolean;
	idParser?: Parser;
}): OracleRollResult | never {
	const { oracleIds, joinOracles, idParser = DefaultIdParser } = options;

	let oracleIdsToJoinAndRoll: string[] = oracleIds.flatMap((oracleId) => oracleId);
	// If oracleIds is greater than 0 and joinOracles is false, select a random oracle
	if (!joinOracles && oracleIds.length > 0) {
		let idx = Math.floor(Math.random() * oracleIds.length);
		oracleIdsToJoinAndRoll = Array.isArray(oracleIds[idx]) ? oracleIds[idx] : [oracleIds[idx]];
	}

	if (oracleIdsToJoinAndRoll.length === 1) {
		return getAndRollOracle(oracleIdsToJoinAndRoll[0], idParser);
	} else {
		let result: OracleRollResult = {
			oracleIds: [],
			rolls: [],
			result: '',
			match: false
		};
		const textResults: string[] = [];

		// Go through the oracles, and roll them
		oracleIdsToJoinAndRoll.map((oracleId) => {
			const rollResult = getAndRollOracle(oracleId, idParser);
			result.oracleIds.push(...rollResult.oracleIds);
			result.rolls.push(...rollResult.rolls);
			textResults.push(rollResult.result);
		});

		result.result = textResults.join(' ');
		return result;
	}
}

function getAndRollOracle(oracleId: string, idParser: Parser): OracleRollResult | never {
	let oracle = idParser.parse(oracleId);
	if (oracle.typeId === 'oracle_rollable') {
		let oracleRollable = oracle.get() as OracleRollable;
		if (!oracleRollable) {
			throw new Error('Oracle not found.');
		}
		const roll = rollDie(oracleRollable.dice);
		const result = oracleRollable.rows.find((r) => {
			return r.roll && r.roll.min <= roll && roll <= r.roll.max;
		});
		if (result) {
			return {
				oracleIds: [oracleRollable._id],
				rolls: [roll],
				result: result.text,
				match: checkIfMatch(roll)
			};
		} else {
			throw new Error('No matching result found for the rolled number.');
		}
	} else if (oracle.typeId === 'oracle_collection') {
		let oracleCollection = oracle.get() as OracleCollection;
		if (oracleCollection.oracle_type === 'table_shared_rolls') {
			const rolls: number[] = [];
			const result = Object.values(oracleCollection.contents)
				.map((table) => {
					const result = rollDie(table.dice);
					const row = table.rows.find((r) => {
						return r.roll && r.roll.min <= result && result <= r.roll.max;
					});
					if (row) {
						rolls.push(result);
						return row.text;
					} else {
						return undefined;
					}
				})
				.filter((row) => !!row)
				.join(' ');

			return {
				oracleIds: [oracleCollection._id],
				rolls,
				result,
				match: false
			};
		} else {
			throw new Error(
				`Cannot roll oracle. Provided id ${oracleId} is of an oracle collection that is not of type table_shared_rolls.`
			);
		}
	} else {
		throw new Error(
			`Cannot roll oracle. Provided id ${oracleId} does not match to an oracle collection.`
		);
	}
}

function rollDie(diceExpression: string): number | never {
	const parsedExpression = parseDiceExpression(diceExpression);

	let total = parsedExpression.modifier;
	for (let i = 0; i < parsedExpression.diceCount; i++) {
		total += Math.floor(Math.random() * parsedExpression.typeOfDice) + 1;
	}
	return total;
}

/**
 * FROM DATASWORN ---
 * A simple dice roll expression with an optional modifer.
 * @pattern ```javascript
 * /([1-9][0-9]*)d([1-9][0-9]*)([+-]([1-9][0-9]*))?/
 * ```
 * @example "1d100"
 * @example "1d6+2"
 */
export function parseDiceExpression(diceExpression: string):
	| {
			diceCount: number;
			typeOfDice: number;
			modifier: number;
	  }
	| never {
	if (!diceExpression.match(/([1-9][0-9]*)d([1-9][0-9]*)([+-]([1-9][0-9]*))?/)) {
		throw new Error('Invalid dice expression');
	}

	const stringSplitOnD = diceExpression.split('d');
	const diceCount = parseInt(stringSplitOnD[0]);

	const stringSplitOnModifierExpression = stringSplitOnD[1].split(/[+-]/);

	const typeOfDice = parseInt(stringSplitOnModifierExpression[0]);
	let modifier = 0;
	if (stringSplitOnModifierExpression.length > 1) {
		modifier =
			parseInt(stringSplitOnModifierExpression[1]) * (diceExpression.includes('+') ? 1 : -1);
	}

	if (isNaN(diceCount)) {
		throw new Error(`Dice count was NaN. Original expression: ${diceExpression}`);
	}
	if (isNaN(typeOfDice)) {
		throw new Error(`Type of dice was NaN. Original expression: ${diceExpression}`);
	}
	if (isNaN(modifier)) {
		throw new Error(`Modifier was NaN. Original expression: ${diceExpression}`);
	}

	return { diceCount, typeOfDice, modifier };
}

// A bit hacky, check if the last two digits of the number are equal to each other.
function checkIfMatch(num: number) {
	return num % 10 === Math.floor(num / 10) % 10;
}

export function canRollOracle(idParser: Parser, oracleId: string) {
	let oracle = idParser.parse(oracleId);

	if (!(oracle.typeId === 'oracle_collection' || oracle.typeId === 'oracle_rollable')) {
		return false;
	}
	try {
		const oracleGet = oracle.get();
		if (!oracleGet) {
			return false;
		}
		if (oracle.typeId === 'oracle_rollable') {
			return true;
		} else if (oracle.typeId === 'oracle_collection') {
			return (oracleGet as OracleCollection).oracle_type === 'table_shared_rolls';
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}
