<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import Dialog from '$components/common/Dialog/Dialog.svelte';
	import OracleInputButton from '$components/common/Input/OracleInputButton.svelte';
	import TextInput from '$components/common/Input/TextInput.svelte';
	import { isStarforgedActive } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import { onDestroy } from 'svelte';

	export let open: boolean = false;
	export let character: RxDocument<CharacterType>;

	$: name = character.name;
	$: nameSubscription = character.name$.subscribe((newName) => {
		name = newName;
	});
	function updateName(newName: string) {
		character.incrementalPatch({ name: newName });
	}

	$: details = character.personalDetails ?? {};
	$: detailsSubscription = character.personalDetails$?.subscribe((newDetails) => {
		details = newDetails ?? {};
	});
	function updateDetail(key: 'pronouns' | 'callsign', value: string) {
		character.incrementalModify((char) => {
			char.personalDetails = char.personalDetails ?? {};
			char.personalDetails[key] = value;
			return char;
		});
	}
	$: localName = name;
	$: localDetails = {
		pronouns: details.pronouns ?? '',
		callsign: details.callsign ?? ''
	};

	function handleUpdates() {
		if (localName !== name) {
			updateName(localName);
		}
		if (localDetails.pronouns !== details.pronouns) {
			updateDetail('pronouns', localDetails.pronouns);
		}
		if (localDetails.callsign !== details.callsign) {
			updateDetail('callsign', localDetails.callsign);
		}
	}

	onDestroy(() => {
		nameSubscription?.unsubscribe();
		detailsSubscription?.unsubscribe();
	});
</script>

<Dialog bind:open title={$i18n.t('characterSheet.characterDetailsDialogHeader')}>
	<TextInput
		label={$i18n.t('characterCreatePage.nameInputLabel')}
		id="name"
		value={localName}
		onChange={(val) => (localName = val)}
		required
	>
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
					localName = result;
				}}
			/>
		</svelte:fragment>
	</TextInput>
	<TextInput
		label={$i18n.t('characterCreatePage.pronounsInputLabel')}
		id="pronouns"
		value={localDetails.pronouns}
		onChange={(value) => (localDetails.pronouns = value)}
	/>
	{#if $isStarforgedActive}
		<TextInput
			label={$i18n.t('characterCreatePage.callsignInputLabel')}
			id="callsign"
			value={localDetails.callsign}
			onChange={(value) => (localDetails.callsign = value)}
		>
			<svelte:fragment slot="endAction">
				<OracleInputButton
					label={$i18n.t('characterCreatePage.callsignInputLabel')}
					oracleIds={['oracle_rollable:starforged/character/name/callsign']}
					onResult={(result) => {
						localDetails.callsign = result;
					}}
				/>
			</svelte:fragment>
		</TextInput>
	{/if}
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
