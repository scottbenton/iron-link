<script lang="ts">
	import { canRollOracle, rollOracle } from '$lib/datasworn/rollOracle';
	import { parser } from '$lib/datasworn/rules';
	import { announcer } from '$lib/stores/announcer.store';
	import DieIcon from 'virtual:icons/tabler/dice-5';
	export let oracleIds: (string | string[])[];
	export let joinOracles: boolean = false;
	export let onResult: (result: string) => void = () => {};
	export let label: string;

	$: filteredOracleIds = oracleIds.filter((id) => {
		if (typeof id === 'string') {
			return canRollOracle($parser, id);
		} else {
			const reduced = id.reduce((prev, subId) => {
				return prev && canRollOracle($parser, subId);
			}, true);
			return reduced;
		}
	});

	const handleOracleClick = () => {
		try {
			const result = rollOracle({ oracleIds: filteredOracleIds, joinOracles, idParser: $parser });
			$announcer = `Changed ${label} to ${result.result}`;
			onResult(result.result);
		} catch (e) {
			console.error(e);
		}
	};
</script>

{#if filteredOracleIds.length > 0}
	<button class="icon-button" on:click={handleOracleClick} aria-label={'Consult the Oracle'}>
		<DieIcon />
	</button>
{/if}

<style lang="scss"></style>
