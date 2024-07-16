<script lang="ts">
	import IconButton from '$components/IconButton.svelte';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';
	import CloseIcon from 'virtual:icons/tabler/x';
	export let title: string;
	export let description: string;

	const {
		elements: {
			trigger,
			portalled,
			overlay,
			content,
			title: titleElement,
			description: descriptionElement,
			close
		},
		states: { open }
	} = createDialog();

	function closeDialog() {
		open.set(false);
	}
</script>

<slot name="trigger" trigger={$trigger} />

{#if $open}
	<div use:melt={$portalled}>
		<div use:melt={$overlay} />
		<div use:melt={$content} transition:slide={{ delay: 0, duration: 300, axis: 'x' }}>
			<h2 class="screen-reader-only" use:melt={$titleElement}>{title}</h2>
			<p class="screen-reader-only" use:melt={$descriptionElement}>{description}</p>
			<div class="button-container">
				<IconButton meltAction={$close} label="Close">
					<CloseIcon />
				</IconButton>
			</div>
			<slot {closeDialog} />
		</div>
	</div>
{/if}

<style lang="scss">
	div[data-melt-dialog-overlay] {
		background-color: transparentize($color: $gray-950, $amount: 0.4);
		backdrop-filter: blur($space-1);
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	div[data-melt-dialog-content] {
		background-color: $background-surface;
		// border-radius: $border-radius;
		border: 1px solid $divider;
		position: fixed;
		z-index: 100;
		top: 0px;
		left: 0px;
		bottom: 0px;
	}
	.button-container {
		display: flex;
		justify-content: flex-end;
		padding: $space-2;
	}
</style>
