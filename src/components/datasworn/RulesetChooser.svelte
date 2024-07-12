<script lang="ts">
	import Checkbox from '$components/common/Input/Checkbox.svelte';
	import { activeRulesets, defaultExpansions, defaultRulesets } from '$lib/datasworn/rules';
</script>

<div>
	{#each defaultRulesets as ruleset}
		<Checkbox
			id={ruleset.ruleset._id}
			label={ruleset.name}
			checked={$activeRulesets.rulesetIds[ruleset.ruleset._id] ?? false}
			onChecked={(checked) => {
				$activeRulesets.rulesetIds[ruleset.ruleset._id] = checked;
				$activeRulesets.expansionIds[ruleset.ruleset._id] = {};
			}}
		/>
		{#each Object.values(defaultExpansions[ruleset.ruleset._id] ?? {}) as expansion}
			<div class="expansion">
				<Checkbox
					id={expansion._id}
					label={expansion.title}
					disabled={!$activeRulesets.rulesetIds[ruleset.ruleset._id]}
					checked={$activeRulesets.expansionIds[ruleset.ruleset._id]?.[expansion._id] ?? false}
					onChecked={(checked) => {
						$activeRulesets.expansionIds[ruleset.ruleset._id] = {
							...$activeRulesets.expansionIds[ruleset.ruleset._id],
							[expansion._id]: checked
						};
					}}
				/>
			</div>
		{/each}
	{/each}
</div>

<style lang="scss">
	.expansion {
		margin-left: $space-3;
		padding-left: $space-4;
		border-left: 1px dotted $gray-600;
	}
</style>
