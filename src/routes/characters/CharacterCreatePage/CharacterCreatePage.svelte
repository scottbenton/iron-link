<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import CroppedImage from '$components/common/CroppedImage.svelte';
	import ImageUploadDialog from '$components/common/Input/ImageUploadAndCropDialog.svelte';
	import OracleInputButton from '$components/common/Input/OracleInputButton.svelte';
	import TextInput from '$components/common/Input/TextInput.svelte';
	import NumberMeter from '$components/datasworn/Rollers/NumberMeter.svelte';
	import SectionHeader from '$components/common/SectionHeader.svelte';
	import RulesetChooser from '$components/datasworn/RulesetChooser.svelte';
	import PageLayout from '$components/Layout/PageLayout.svelte';
	import { activeRulesets, isStarforgedActive, rulesets, stats } from '$lib/datasworn/rules';
	import { dbStore } from '$lib/db';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { createId } from '$lib/db/createId';
	import { authStore } from '$lib/firebase/auth';
	import { uploadFile } from '$lib/firebase/storage';
	import { i18n } from '$lib/i18n';
	import { Breakpoints } from '$types/breakpoints';
	import type { FileSettings } from '$types/FileSettings.type';
	import { melt } from '@melt-ui/svelte';
	import { createBlob } from 'rxdb';
	import { navigate } from 'svelte-routing';
	import AddIcon from 'virtual:icons/tabler/plus';

	// Reset active rulesets
	$activeRulesets = {
		rulesetIds: {},
		expansionIds: {}
	};

	$: showErrors = false;

	$: name = '';
	$: pronouns = '';
	$: callsign = '';
	$: statsValues = {} as Record<string, number>;
	$: profileImage = undefined as File | undefined;
	$: profileImageSettings = {
		zoom: 1,
		crop: { x: 0, y: 0 }
	};

	function handleCreateCharacter() {
		const uid = $authStore.user?.uid;

		if (!uid) {
			console.error('UID WAS NOT DEFINED');
			return;
		}
		// Validation
		if (
			!name.trim() ||
			!Object.values($activeRulesets.rulesetIds).filter((isActive) => isActive).length
		) {
			showErrors = true;
			return;
		}

		const expansionIds: Record<string, string[]> = {};
		Object.keys($activeRulesets.expansionIds).forEach((rulesetId) => {
			if ($activeRulesets.rulesetIds[rulesetId]) {
				expansionIds[rulesetId] = [];
				Object.keys($activeRulesets.expansionIds[rulesetId] ?? {}).forEach((expansionId) => {
					if ($activeRulesets.expansionIds[rulesetId][expansionId]) {
						expansionIds[rulesetId].push(expansionId);
					}
				});
			}
		});

		const character: CharacterType = {
			_id: createId(),
			name,
			stats: statsValues,
			personalDetails: {
				pronouns: pronouns.trim() || undefined,
				callsign: callsign.trim() || undefined
			},
			rulesetIds: Object.keys($activeRulesets.rulesetIds),
			expansionIds,
			uid
		};
		const filenameId = createId();
		const filenameExt = profileImage?.name.split('.').pop();
		const filename = `${filenameId}.${filenameExt ?? ''}`;
		if (profileImage) {
			character.portrait = {
				filename,
				settings: profileImageSettings
			};
		}
		$dbStore.db?.characters
			?.insert(character)
			.then(() => {
				if (profileImage) {
					const copiedFile = new File([profileImage], filename, {
						type: profileImage.type,
						lastModified: new Date().getTime()
					});
					uploadFile('characters', character._id, copiedFile)
						.then(() => {
							navigate(`/characters/${character._id}`);
						})
						.catch((e) => {
							console.error(e);
						});
				} else {
					// Redirect
					navigate(`/characters/${character._id}`);
				}
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

	<form
		class="stack"
		on:submit={(evt) => {
			evt.preventDefault();
			handleCreateCharacter();
		}}
	>
		<SectionHeader title={$i18n.t('characterCreatePage.gameSystemsHeading')} />
		<RulesetChooser showError={showErrors} />
		<SectionHeader title={$i18n.t('characterCreatePage.characterDetailsHeading')} />
		<div class="character-details">
			<ImageUploadDialog
				onUpload={(file, settings) => {
					profileImage = file;
					profileImageSettings = settings;
				}}
				onRemove={() => {
					profileImage = undefined;
				}}
				file={profileImage}
				fileSettings={profileImageSettings}
			>
				<svelte:fragment slot="trigger" let:trigger>
					<button use:melt={trigger} class="profile-upload-trigger">
						<div class="image">
							<CroppedImage image={profileImage} settings={profileImageSettings} />
						</div>
						<div class="text">
							{$i18n.t('characterCreatePage.uploadPortrait')}
						</div>
					</button>
				</svelte:fragment>
			</ImageUploadDialog>

			<div class="grid">
				<div>
					<TextInput
						label={$i18n.t('characterCreatePage.nameInputLabel')}
						id="name"
						bind:value={name}
						required
						error={showErrors && !name.trim()}
						helperText={showErrors && !name.trim()
							? $i18n.t('characterCreatePage.nameRequiredError')
							: undefined}
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
									name = result;
								}}
							/>
						</svelte:fragment>
					</TextInput>
				</div>
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
		</div>
		{#if Object.keys($stats).length > 0}
			<div>
				<span class="text-sm label">{$i18n.t('characters.statsLabel')}</span>
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
			</div>
		{/if}
		<div class="button-container">
			<Button variant="primary-gradient" type="submit">
				{$i18n.t('characterCreatePage.createYourCharacterButton')}
				<svelte:fragment slot="endIcon"><AddIcon /></svelte:fragment>
			</Button>
		</div>
	</form>
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
		grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
		gap: $space-4;
		flex-grow: 1;
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
	.label {
		font-weight: 600;
		color: $text-secondary;
	}
	.character-details {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: $space-4;
	}

	.profile-upload-trigger {
		background-color: transparent;
		border: 1px solid $divider;
		border-radius: $border-radius;
		text-wrap: wrap;
		width: 128px;
		box-sizing: border-box;
		padding: 0px;
		cursor: pointer;
		transition-property: background-color;
		transition-duration: 150ms;
		transition-timing-function: ease-in-out;

		&:hover {
			background-color: $background-hover;
		}
		.image {
			margin-top: -1px;
			margin-left: -1px;
		}
		.text {
			padding: $space-1;
			font-weight: 600;
			color: $text-secondary;
		}
	}
</style>
