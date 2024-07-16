<script lang="ts">
	import Button from '../Button.svelte';
	import Dialog from '../Dialog/Dialog.svelte';
	import { confirmationDialogStore } from './confirmationDialog.store';
</script>

{#if $confirmationDialogStore.isOpen && $confirmationDialogStore.state}
	<Dialog bind:open={$confirmationDialogStore.isOpen} title={$confirmationDialogStore.state.title}>
		<p>{$confirmationDialogStore.state.message}</p>

		<svelte:fragment slot="actions" let:closeDialog>
			{#each $confirmationDialogStore.state.actions as action}
				<Button
					variant={action.variant}
					onClick={() => action.onClick(closeDialog)}
					dangerButton={action.isDanger}
				>
					{action.label}
				</Button>
			{/each}
		</svelte:fragment>
	</Dialog>
{/if}

<style lang="scss">
</style>
