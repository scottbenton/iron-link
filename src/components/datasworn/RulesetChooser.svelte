<script lang="ts">
	import Checkbox from '$components/common/Input/Checkbox.svelte';
	import {
		activeRulesets,
		defaultExpansions,
		defaultRulesets,
		rulesets
	} from '$lib/datasworn/rules';
	import { i18n } from '$lib/i18n';

	export let showError = false;

	$: isError =
		showError &&
		!(Object.values($activeRulesets.rulesetIds).filter((isActive) => isActive).length > 0);
</script>

<div role="group" aria-labelledby="ruleset-required-text">
	<p id="ruleset-required-text" class="text-sm" class:error={isError}>
		{$i18n.t('shared.rulesetRequiredText')}
	</p>
	{#each defaultRulesets as ruleset}
		<Checkbox
			id={ruleset.ruleset._id}
			label={ruleset.name}
			checked={$activeRulesets.rulesetIds[ruleset.ruleset._id] ?? false}
			onChecked={(checked) => {
				$activeRulesets.rulesetIds[ruleset.ruleset._id] = checked;
				$activeRulesets.expansionIds[ruleset.ruleset._id] = {};
			}}
			ariaControls={Object.values(defaultExpansions[ruleset.ruleset._id] ?? {})
				.map((expansion) => expansion._id)
				.join(' ')}
		/>
		<div role="group">
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
		</div>
	{/each}
</div>

<style lang="scss">
	.expansion {
		margin-left: $space-3;
		padding-left: $space-4;
		border-left: 1px dotted $gray-600;
	}
	#ruleset-required-text {
		color: $text-secondary;
		margin-bottom: $space-1;
		&.error {
			color: $error-600;
		}
	}
</style>
