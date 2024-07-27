<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import Dialog from '$components/common/Dialog/Dialog.svelte';
	import RulesetChooser from '$components/datasworn/RulesetChooser.svelte';
	import { activeRulesets } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';

	export let open: boolean = false;
	export let character: RxDocument<CharacterType>;

	function handleUpdates() {
		const activeRulesetIds = Object.keys($activeRulesets.rulesetIds).filter(
			(rulesetId) => $activeRulesets.rulesetIds[rulesetId]
		);

		const activeExpansionIds: Record<string, string[]> = {};
		Object.keys($activeRulesets.expansionIds).forEach((rulesetId) => {
			if ($activeRulesets.rulesetIds[rulesetId]) {
				activeExpansionIds[rulesetId] = [];
				Object.keys($activeRulesets.expansionIds[rulesetId] ?? {}).forEach((expansionId) => {
					if ($activeRulesets.expansionIds[rulesetId][expansionId]) {
						activeExpansionIds[rulesetId].push(expansionId);
					}
				});
			}
		});

		character.incrementalModify((char) => {
			char.rulesetIds = activeRulesetIds;
			char.expansionIds = activeExpansionIds;
			return char;
		});
	}
</script>

<Dialog bind:open title={$i18n.t('characterSheet.rulesetChooserDialogHeader')}>
	<RulesetChooser />
	<svelte:fragment slot="actions" let:closeDialog>
		<Button
			variant={'primary'}
			onClick={() => {
				handleUpdates();
				closeDialog();
			}}
		>
			{$i18n.t('shared.done')}
		</Button>
	</svelte:fragment>
</Dialog>

<style lang="scss">
	.label {
		font-weight: 600;
		color: $text-secondary;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 130px);
		gap: $space-2;
	}
</style>
