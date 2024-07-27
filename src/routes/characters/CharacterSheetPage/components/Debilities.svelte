<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import Dialog from '$components/common/Dialog/Dialog.svelte';
	import Checkbox from '$components/common/Input/Checkbox.svelte';
	import IconButton from '$components/IconButton.svelte';
	import { impacts } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import { onDestroy } from 'svelte';
	import EditIcon from 'virtual:icons/tabler/edit';

	export let character: RxDocument<CharacterType>;

	$: debilities = character.debilities ?? {};
	$: debilitySubscription = character.debilities$?.subscribe((newDebilities) => {
		debilities = newDebilities ?? {};
	});
	onDestroy(() => {
		debilitySubscription?.unsubscribe();
	});

	$: debilityString = Object.keys(debilities)
		.filter((debility) => $impacts.impacts[debility] && debilities[debility])
		.map((debility) => $impacts.impacts[debility].label)
		.join(', ');

	function updateDebility(debility: string, value: boolean) {
		character
			.incrementalModify((character) => {
				if (!character.debilities) {
					character.debilities = {};
				}
				character.debilities[debility] = value;

				return character;
			})
			.catch(() => {});
	}
</script>

<div id="impacts-section">
	<h2 class="text-xl font-title">{$i18n.t('characterSheet.impactsHeader')}</h2>
	<div class="active-impacts">
		<div class="active-impacts-header">
			<span class="text-sm">{$i18n.t('characterSheet.activeImpactsHeader')}</span>
			<Dialog title={$i18n.t('characterSheet.activeImpactsEditButton')}>
				<svelte:fragment slot="trigger" let:trigger>
					<IconButton
						label={$i18n.t('characterSheet.activeImpactsEditButton')}
						meltAction={trigger}
					>
						<EditIcon font-size={'1.25rem'} />
					</IconButton>
				</svelte:fragment>
				<ul id="impact-categories">
					{#each Object.entries($impacts.impactCategories) as [categoryKey, category]}
						<li>
							<span class="font-title text-lg">{category.label}</span>
							<ul>
								{#each Object.entries(category.contents) as [impactKey, impact]}
									<li>
										<Checkbox
											label={impact.label}
											id={impactKey}
											checked={false}
											onChecked={(checked) => updateDebility(impactKey, checked)}
										/>
									</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
				<svelte:fragment slot="actions" let:closeDialog>
					<Button variant="text" onClick={closeDialog}>{$i18n.t('shared.done')}</Button>
				</svelte:fragment>
			</Dialog>
		</div>
		<p>
			{debilityString || $i18n.t('characterSheet.noActiveImpacts')}
		</p>
	</div>
</div>

<style lang="scss">
	#impacts-section {
		margin-top: $space-4;
	}
	.active-impacts {
		border: 1px solid $divider;
		border-radius: $border-radius;
		margin-top: $space-2;
		color: $text-secondary;
		.active-impacts-header {
			padding-left: $space-2;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-weight: 600;
		}
		p {
			padding: $space-2;
			text-transform: capitalize;
		}
	}

	ul#impact-categories {
		list-style-type: none;
		padding: 0;
		margin: 0;
		li {
			margin-top: $space-1;
			h3 {
				font-weight: 600;
				margin-bottom: $space-1;
			}
			ul {
				list-style-type: none;
				text-transform: capitalize;
				padding-left: 0;
				li {
					margin-top: $space-1;
				}
			}
		}
	}
</style>
