<script lang="ts">
	import { createDialog, createSync, melt } from '@melt-ui/svelte';
	import CloseIcon from 'virtual:icons/tabler/x';
	import { blur, scale } from 'svelte/transition';
	import IconButton from '$components/IconButton.svelte';
	import { i18n } from '$lib/i18n';
	import { Breakpoints } from '$types/breakpoints';

	export let isAlertDialog = false;
	export let title: string;
	export let open: boolean | undefined = false;

	export let maxWidth: Breakpoints = Breakpoints['sm'];
	export let fullWidth: boolean = false;

	const {
		elements: { trigger, overlay, content, title: titleElement, close, portalled },
		states
	} = createDialog({
		role: isAlertDialog ? 'alertdialog' : 'dialog'
	});

	function closeDialog() {
		states.open.set(false);
	}

	const sync = createSync(states);
	$: sync.open(open ?? false, (v) => {
		open = v;
		states.open.set(v);
	});
</script>

{#if $$slots.trigger}
	<slot name="trigger" trigger={$trigger} />
{/if}

{#if states.open}
	<div use:melt={$portalled}>
		<div use:melt={$overlay} transition:blur={{ delay: 0, duration: 300, amount: '1rem' }} />
		<div
			use:melt={$content}
			transition:scale={{ delay: 0, duration: 300, start: 95 }}
			class:modal-sm={maxWidth === Breakpoints.sm}
			class:modal-md={maxWidth === Breakpoints.md}
			class:modal-lg={maxWidth === Breakpoints.lg}
			class:modal-xl={maxWidth === Breakpoints.xl}
			class:modal-2xl={maxWidth === Breakpoints['2xl']}
			class:fullWidth
		>
			<div class="modal-header">
				<h2 use:melt={$titleElement}>{title}</h2>
				<div class="button-container">
					<IconButton meltAction={$close} label={$i18n.t('shared.closeModal')}>
						<CloseIcon font-size="1.25rem" />
					</IconButton>
				</div>
			</div>
			<div class="modal-body">
				<slot {closeDialog} />
			</div>
			{#if $$slots.actions}
				<div class="modal-actions">
					<slot name="actions" {closeDialog} />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.button-container {
		color: $text-secondary;
	}
	div[data-melt-dialog-overlay] {
		background-color: transparentize($color: $gray-950, $amount: 0.4);
		backdrop-filter: blur($space-1);
		position: fixed;
		z-index: 99;
		inset: 0;
	}
	div[data-melt-dialog-content] {
		max-height: 90lvh;
		color: $text-primary;
		z-index: 100;
		background-color: $background-default;
		border-radius: $border-radius;
		border: 1px solid $divider;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $space-4;
		padding-bottom: $space-2;
		gap: $space-4;
	}
	.modal-body {
		flex-grow: 1;
		padding: $space-4 $space-4;
		padding-top: $space-2;
		overflow-y: auto;
	}
	.modal-actions {
		background-color: $background-inset;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: $space-1;
		padding: $space-2 $space-4;
	}

	.modal-sm {
		max-width: $breakpoint-sm;
	}
	.modal-md {
		max-width: $breakpoint-md;
	}
	.modal-lg {
		max-width: $breakpoint-lg;
	}
	.modal-xl {
		max-width: $breakpoint-xl;
	}
	.modal-2xl {
		max-width: $breakpoint-2xl;
	}
	.fullWidth {
		width: 100%;
	}
</style>
