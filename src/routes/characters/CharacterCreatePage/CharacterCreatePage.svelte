<script>
	import OracleInputButton from '$components/common/Input/OracleInputButton.svelte';
	import TextInput from '$components/common/Input/TextInput.svelte';
	import SectionHeader from '$components/common/SectionHeader.svelte';
	import RulesetChooser from '$components/datasworn/RulesetChooser.svelte';
	import PageLayout from '$components/Layout/PageLayout.svelte';
	import { activeRulesets, rulesets } from '$lib/datasworn/rules';
	import { i18n } from '$lib/i18n';
	import { Breakpoints } from '$types/breakpoints';

	// Reset active rulesets
	$activeRulesets = {
		rulesetIds: {},
		expansionIds: {}
	};

	$: name = '';
	$: pronouns = '';
</script>

<PageLayout maxWidth={Breakpoints.md}>
	<svelte:fragment slot="header">
		<h1 class="font-title text-4xl">
			{$i18n.t('characters.create')}
		</h1>
	</svelte:fragment>

	<div class="stack">
		<SectionHeader title={$i18n.t('characterCreatePage.gameSystemsHeading')} />
		<RulesetChooser />
		<SectionHeader title={$i18n.t('characterCreatePage.characterDetailsHeading')} />
		<div class="grid">
			<TextInput label={$i18n.t('characterCreatePage.nameInputLabel')} id="name" bind:value={name}>
				<svelte:fragment slot="endAction">
					<OracleInputButton
						label={$i18n.t('characterCreatePage.nameInputLabel')}
						oracleIds={[
							'oracle_rollable:classic/name/ironlander/a',
							'oracle_rollable:classic/name/ironlander/b',
							[
								'oracle_rollable:starforged/character/name/given_name',
								'oracle_rollable:starforged/character/name/family_name'
							]
						]}
						onResult={(result) => {
							name = result;
						}}
					/>
				</svelte:fragment>
			</TextInput>
			<TextInput
				label={$i18n.t('characterCreatePage.pronounsInputLabel')}
				id="pronouns"
				bind:value={pronouns}
			/>
		</div>
	</div>
</PageLayout>

<style lang="scss">
	.stack {
		display: flex;
		flex-direction: column;
		gap: $space-4;
	}
	:global(.stack > .section-header:not(:first-child)) {
		margin-top: $space-4;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: $space-4;
	}
</style>
