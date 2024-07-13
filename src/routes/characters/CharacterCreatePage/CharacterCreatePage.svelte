<script lang="ts">
	import OracleInputButton from '$components/common/Input/OracleInputButton.svelte';
	import TextInput from '$components/common/Input/TextInput.svelte';
	import NumberMeter from '$components/common/NumberMeter.svelte';
	import SectionHeader from '$components/common/SectionHeader.svelte';
	import RulesetChooser from '$components/datasworn/RulesetChooser.svelte';
	import PageLayout from '$components/Layout/PageLayout.svelte';
	import { activeRulesets, isStarforgedActive, rulesets, stats } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { createId } from '$lib/db/createId';
	import { getDatabase } from '$lib/db/rxdb';
	import { i18n } from '$lib/i18n';
	import { Breakpoints } from '$types/breakpoints';
	import { navigate } from 'svelte-routing';
	import AddIcon from 'virtual:icons/tabler/plus';

	// Reset active rulesets
	$activeRulesets = {
		rulesetIds: {},
		expansionIds: {}
	};

	$: name = '';
	$: pronouns = '';
	$: callsign = '';
	$: statsValues = {} as Record<string, number>;

	function handleCreateCharacter() {
		console.log('Creating character', { name, pronouns, callsign, statsValues });

		const expansionIds: string[] = [];
		Object.keys($activeRulesets.expansionIds).forEach((rulesetId) => {
			if ($activeRulesets.rulesetIds[rulesetId]) {
				Object.keys($activeRulesets.expansionIds[rulesetId] ?? {}).forEach((expansionId) => {
					if ($activeRulesets.expansionIds[rulesetId][expansionId]) {
						expansionIds.push(expansionId);
					}
				});
			}
		});

		const character: CharacterType = {
			_id: createId(),
			name,
			stats: statsValues,
			personalDetails: {
				pronouns,
				callsign
			},
			rulesetIds: Object.keys($activeRulesets.rulesetIds),
			expansionIds,
			uid: ''
		};
		getDatabase()
			.characters?.insert(character)
			.then(() => {
				// Redirect
				navigate(`/characters/${character._id}`);
			})
			.catch((e) => {
				console.error(e);
			});
	}
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
			{#if $isStarforgedActive}
				<TextInput
					label={$i18n.t('characterCreatePage.callsignInputLabel')}
					id="callsign"
					bind:value={callsign}
				>
					<svelte:fragment slot="endAction">
						<OracleInputButton
							label={$i18n.t('characterCreatePage.callsignInputLabel')}
							oracleIds={['oracle_rollable:starforged/character/name/callsign']}
							onResult={(result) => {
								callsign = result;
							}}
						/>
					</svelte:fragment>
				</TextInput>
			{/if}
		</div>
		{#if Object.keys($stats).length > 0}
			<h2 class="text-xl font-title">{$i18n.t('characters.statsLabel')}</h2>
			<div class="stat-grid">
				{#each Object.keys($stats) as statId}
					<NumberMeter
						min={-9}
						max={9}
						label={$stats[statId].label}
						bind:value={statsValues[statId]}
					/>
				{/each}
			</div>
		{/if}
		<div class="button-container">
			<button class="primary-button" on:click={handleCreateCharacter}>
				<div>
					{$i18n.t('characterCreatePage.createYourCharacterButton')}
					<div class="icon"><AddIcon /></div>
				</div>
			</button>
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
	.stat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 130px);
		gap: $space-2;
	}
	.button-container {
		display: flex;
		justify-content: flex-end;
		margin-top: $space-8;
	}
</style>
