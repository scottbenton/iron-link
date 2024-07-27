<script lang="ts">
	import IronLinkLogo from '$assets/IronLinkLogo.svelte';
	import Button from '$components/common/Button.svelte';
	import Dialog from '$components/common/Dialog/Dialog.svelte';
	import OracleInputButton from '$components/common/Input/OracleInputButton.svelte';
	import TextInput from '$components/common/Input/TextInput.svelte';
	import { isStarforgedActive } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';

	import { type ColorScheme, colorSchemes } from '$lib/stores/theme.store';
	import type { RxDocument } from 'rxdb';
	import { onDestroy } from 'svelte';

	export let open: boolean = false;
	export let character: RxDocument<CharacterType>;

	function updateColorScheme(newColorScheme: ColorScheme) {
		character.incrementalPatch({ theme: newColorScheme });
	}
</script>

<Dialog bind:open title={$i18n.t('characterSheet.characterDetailsDialogHeader')}>
	<div class="grid">
		{#each colorSchemes as color}
			<button data-color-scheme={color} on:click={() => updateColorScheme(color)}>
				<IronLinkLogo />
				<span>{color}</span>
			</button>
		{/each}
	</div>
	<svelte:fragment slot="actions" let:closeDialog>
		<Button
			variant={'primary'}
			onClick={() => {
				closeDialog();
			}}
		>
			{$i18n.t('shared.done')}
		</Button>
	</svelte:fragment>
</Dialog>

<style lang="scss">
	.grid {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: $space-2;
		button {
			background-color: transparent;
			border: 1px solid $divider;
			border-radius: $border-radius;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 128px;
			padding: $space-4;
			text-transform: uppercase;
			cursor: pointer;
			span {
				font-size: $text-sm;
				font-weight: 600;
				color: $text-secondary;
				margin-top: $space-1;
			}
			&:hover {
				background-color: $background-inset;
			}
		}
	}
</style>
